import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  async getHello(): Promise<string> {
    await this.cacheManager.set('key', 'kevin');
    console.log(await this.cacheManager.get('key'));
    await this.cacheManager.del('key');
    console.log(await this.cacheManager.get('key'));
    return 'Hello World!';
  }
}
