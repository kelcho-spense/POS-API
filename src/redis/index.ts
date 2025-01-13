import { CacheModuleAsyncOptions, CacheStore } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>('REDIS_HOST') || 'localhost',
        port: parseInt(configService.get<string>('REDIS_PORT') || '6379', 10),
      },
      ttl: configService.get<number>('CACHE_TTL') || 30, // 30 seconds
      username: configService.get<string>('REDIS_USERNAME'),
      password: configService.get<string>('REDIS_PASSWORD'),
    });
    return {
      store: store as unknown as CacheStore,
    };
  },
  inject: [ConfigService],
};
