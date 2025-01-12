import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getHello(): Promise<string> {
    // Set a test value
    await this.cacheManager.set('test-key', 'new Hello new Redis!'); // Cache for 30 seconds

    // Get the value and log it
    const cachedValue = await this.cacheManager.get('test-key');
    console.log('Cached value:', cachedValue);

    // Delete the value
    await this.cacheManager.del('test-key');

    // Try to get the deleted value
    const deletedValue = await this.cacheManager.get('test-key');
    console.log('After deletion:', deletedValue); // Should be null

    return `Cache test completed. Initial value: ${cachedValue}, After deletion: ${deletedValue}`;
  }
}
