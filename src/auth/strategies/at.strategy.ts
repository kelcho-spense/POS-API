import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

type JWTPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-at') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET, // Secret key to verify the signature of the JWT
    });
  }

  validate(payload: JWTPayload) {
    return payload; // attach request.user = payload;
  }
}

/**
 * Access Token Strategy for JWT authentication
 * Extends PassportStrategy using JWT Strategy for 'jwt-at' authentication
 *
 * @class AtStrategy
 * @extends PassportStrategy
 *
 * @remarks
 * This strategy validates JWT tokens from Authorization Bearer headers
 * using the JWT_ACCESS_TOKEN_SECRET environment variable
 *
 * @constructor
 * Configures the JWT strategy with:
 * - Bearer token extraction from Authorization header
 * - Secret key verification using JWT_ACCESS_TOKEN_SECRET
 *
 * @method validate
 * @param {JWTPayload} payload - The decoded JWT payload
 * @returns {JWTPayload} The validated payload attached to request.user
 */
