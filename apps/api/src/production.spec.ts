import { Test, TestingModule } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import request = require('supertest');

@Controller()
class TestController {
  @Get()
  getHello() {
    return 'Hello';
  }
}

describe('Production Hardening Integration Checks', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([{
          ttl: 60000,
          limit: 3, // Allow only 3 requests total across all test cases
        }]),
      ],
      controllers: [TestController],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(helmet());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should verify Helmet security headers are present in response', async () => {
    // Cumulative Request Count = 1
    const response = await request(app.getHttpServer()).get('/');
    expect(response.headers['x-dns-prefetch-control']).toBe('off');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('should block requests that exceed our Throttler rate limit with 429', async () => {
    const server = app.getHttpServer();
    // Request 2 (Cumulative): success
    await request(server).get('/').expect(200);
    // Request 3 (Cumulative): success
    await request(server).get('/').expect(200);
    // Request 4 (Cumulative): blocked (limit exceeded)
    const response = await request(server).get('/');
    expect(response.status).toBe(429);
    expect(response.body.message).toContain('ThrottlerException');
  });
});
