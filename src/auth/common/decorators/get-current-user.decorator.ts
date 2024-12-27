/**
 * Custom parameter decorator to extract the current user or a specific user property from the request.
 *
 * @param data - Optional string parameter to specify which property of the user object to return.
 *               If not provided, returns the entire user object.
 * @param context - The execution context from which to extract the request.
 *
 * @returns The entire user object if no data parameter is provided,
 *          or the specified property of the user object if data parameter is provided.
 *
 * @example
 * ```typescript
 * // Get entire user object
 * @GetCurrentUser() user: User
 * ```
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
