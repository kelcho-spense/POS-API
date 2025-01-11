import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) { }
    async getHello(): Promise<string> {
        // console.log(await this.cacheManager.get('key'));
        // await this.cacheManager.clear();
        // await this.cacheManager.set('key', 'kevin');
        await this.cacheManager.del('key');
        //displays the value of the key
        // console.log(await this.cacheManager.get('key'));
        console.log("after delete");

        return await this.cacheManager.get('key');
    }
}
