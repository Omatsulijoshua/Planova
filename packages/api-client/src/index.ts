import { User } from '@planova/shared-types';

export class PlanovaApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getCurrentUser(token: string): Promise<User> {
    console.log(`Initializing fetch from ${this.baseUrl} with token: ${token.substring(0, 5)}...`);
    return {
      id: '1',
      email: 'user@planova.ai',
      role: 'FREE_USER',
      status: 'ACTIVE'
    };
  }
}
