import { Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthControler } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	controllers: [AuthControler],
	providers: [
		{
			provide: HashingServiceProtocol,
			useClass: BcryptService,
		},
		AuthService,
	],
	exports: [HashingServiceProtocol],
})
export class AuthModule {}
