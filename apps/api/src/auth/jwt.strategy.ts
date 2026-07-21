import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super_secret_access_token_key_change_me',
    });
  }

  async validate(payload: JwtPayload) {
    // Optionally fetch full user state from database to confirm account status
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    if (!user || user.status === 'SUSPENDED' || user.status === 'DELETED') {
      throw new UnauthorizedException('User account is inactive or suspended');
    }

    return {
      userId: user.id,
      email: user.email,
      roles: user.userRoles.map((ur) => ur.role.name),
    };
  }
}
