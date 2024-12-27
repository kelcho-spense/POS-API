import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    return request.user['sub'];
  },
);

/**
 * Custom decorator to extract the current authenticated user's ID from the request.
 *
 * @param data - Unused parameter (always undefined)
 * @param context - The execution context containing the request
 *
 * @returns The user ID (sub claim) from the request's user object
 *
 * @example
 * ```typescript
 * @Get('profile')
 * getProfile(@GetCurrentUserId() userId: number) {
 *   return this.userService.findById(userId);
 * }
 * ```
 */
