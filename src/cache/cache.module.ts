import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import redisConfig from './redis.config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
