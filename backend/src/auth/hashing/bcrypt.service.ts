import { Injectable } from '@nestjs/common';
import { HashingServiceProtocol } from './hashing.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService extends HashingServiceProtocol {
	async hash(senha: string): Promise<string> {
		const salt = await bcrypt.genSalt();
		return bcrypt.hash(senha, salt);
	}
	async compare(senha: string, hashDeSenha: string): Promise<boolean> {
		return bcrypt.compare(senha, hashDeSenha);
	}
}
