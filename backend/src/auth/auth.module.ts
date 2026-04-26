import { Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthControler } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		ConfigModule.forFeature(jwtConfig),
		JwtModule.registerAsync(jwtConfig.asProvider()),
	],
	controllers: [AuthControler],
	providers: [
		{
			provide: HashingServiceProtocol,
			useClass: BcryptService,
		},
		AuthService,
		JwtAuthGuard,
		JwtStrategy,
	],
	exports: [HashingServiceProtocol, JwtModule, ConfigModule, JwtAuthGuard],
})
export class AuthModule {}
