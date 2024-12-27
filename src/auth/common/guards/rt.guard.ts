import { AuthGuard } from '@nestjs/passport';

export class RtGuard extends AuthGuard('jwt-rt') {
  constructor() {
    super();
  }
}

/**
 * Guard that implements refresh token authentication using Passport's JWT-RT strategy
 * @extends {AuthGuard}
 * @description Extends the Passport AuthGuard to protect routes requiring a valid refresh token
 * @example
 * ```typescript
 * @UseGuards(RtGuard)
 * @Get('protected-route')
 * async protectedRoute() {
 *   // Only accessible with valid refresh token
 * }
 * ```
 */
