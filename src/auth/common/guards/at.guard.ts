import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
@Injectable()
export class AtGuard extends AuthGuard('jwt-at') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}

/**
 * Guard that implements authentication using JWT access token strategy.
 * Extends the AuthGuard from @nestjs/passport with 'jwt-at' strategy.
 *
 * This guard is used to protect routes/endpoints that require valid JWT access token authentication.
 * When applied to a route or controller, it will validate the JWT access token in the request header.
 *
 * The guard also checks for the 'isPublic' decorator and allows access to public routes without authentication.
 *
 * @class
 * @extends {AuthGuard}
 *
 * @param {Reflector} reflector - NestJS Reflector service used to retrieve metadata
 *
 * @method canActivate
 * @param {ExecutionContext} context - Execution context containing request details
 * @returns {boolean | Promise<boolean> | Observable<boolean>} Returns true for public routes,
 * otherwise validates JWT token and returns authentication result
 */
