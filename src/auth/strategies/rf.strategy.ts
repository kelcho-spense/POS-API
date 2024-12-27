import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RfStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET, // Secret key to verify the signature of the JWT
      passReqToCallback: true, // Pass the request object to the validate function
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return {
      ...payload, // attach request.user = payload;
      refreshToken,
    };
  }
}

/**
 * Strategy for handling JWT refresh token authentication.
 * Extends PassportStrategy and implements the 'jwt-rt' strategy.
 *
 * @class RfStrategy
 * @extends {PassportStrategy}
 *
 * @constructor
 * Configures the strategy with:
 * - JWT extraction from Authorization header
 * - Refresh token secret key verification
 * - Request object pass-through enabled
 *
 * @method validate
 * Validates the JWT refresh token and returns enhanced payload
 * @param {Request} req - Express request object containing the Authorization header
 * @param {any} payload - Decoded JWT payload
 * @returns {Object} Enhanced payload object with refresh token
 *
 * @throws {UnauthorizedException} When token validation fails
 */
