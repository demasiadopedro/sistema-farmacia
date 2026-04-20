import {
	Global,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { HashingServiceProtocol } from './hashing/hashing.service';
import { PrismaService } from '../prisma/prisma.service';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Global()
@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private readonly hashingService: HashingServiceProtocol,
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly jwtService: JwtService,
	) {}
	async login(loginDto: LoginDto) {
		const user = await this.prisma.usuario.findUnique({
			where: { email: loginDto.email },
		});

		if (!user) throw new UnauthorizedException('Usuario Invalido');

		const passwordIsValid = await this.hashingService.compare(
			loginDto.password,
			user.password,
		);

		if (!passwordIsValid) throw new UnauthorizedException('Senha Invalida');

		const acessToken = await this.jwtService.signAsync(
			{
				sub: user.id,
				email: user.email,
				role: user.role,
				unidade: user.id_unidade_pertecente,
			},
			{
				audience: this.jwtConfiguration.audience,
				issuer: this.jwtConfiguration.issuer,
				secret: this.jwtConfiguration.secret,
				expiresIn: this.jwtConfiguration.jwtTtl,
			},
		);
		console.log(acessToken);

		return { message: 'usuario logado' };
	}
}
