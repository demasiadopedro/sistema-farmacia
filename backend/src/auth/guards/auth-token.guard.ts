import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';
import { TokenPayloadDto } from '../dto/token-payload.dto';

@Injectable()
export class AuthTokenGuard implements CanActivate {
	constructor(
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly jwtService: JwtService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException('Token nao enviado ou invalido');
		}

		const payload = await this.jwtService
			.verifyAsync<TokenPayloadDto>(token, this.jwtConfiguration)
			.catch((error: unknown) => {
				const message =
					error instanceof Error ? error.message : 'Token inválido';
				throw new UnauthorizedException(message);
			});

		request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;

		return true;
	}

	extractTokenFromHeader(request: Request): string | undefined {
		const authorization = request.headers?.authorization;
		if (!authorization || typeof authorization !== 'string') return undefined;

		return authorization.split(' ')[1];
	}
}
