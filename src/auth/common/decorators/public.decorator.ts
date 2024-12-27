/**
 * Decorator that marks a route as public, exempting it from authentication requirements.
 * When applied to a controller or route handler, it sets metadata with key 'isPublic' to true.
 *
 * @decorator
 * @example
 * ```typescript
 * @Public()
 * @Get('public-route')
 * publicEndpoint() {
 *   return 'This endpoint is public';
 * }
 * ```
 * @returns A decorator function that sets the 'isPublic' metadata to true
 */
import { SetMetadata } from '@nestjs/common';
export const Public = () => SetMetadata('isPublic', true);
