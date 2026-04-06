import { Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';

@Module({
	providers: [
		{
			provide: HashingServiceProtocol,
			useClass: BcryptService,
		},
	],
	exports: [HashingServiceProtocol],
})
export class AuthModule {}
