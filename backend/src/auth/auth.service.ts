import { Global, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { HashingServiceProtocol } from './hashing/hashing.service';
import { PrismaService } from '../prisma/prisma.service';
@Global()
@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private readonly hashingService: HashingServiceProtocol,
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

		return { message: 'usuario logado' };
	}
}
