import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';

type Payload = {
	sub: string;
	email: string;
	role: string;
	unidade: string;
	audience: string;
	issuer: string;
	secret: string;
	expiresIn: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConfiguration.secret as string,
			audience: jwtConfiguration.audience as string,
			issuer: jwtConfiguration.issuer as string,
		});
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async validate(payload: Payload) {
		return { userId: payload.sub, role: payload.role };
	}
}
