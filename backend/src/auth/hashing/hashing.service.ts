export abstract class HashingServiceProtocol {
	abstract hash(senha: string): Promise<string>;
	abstract compare(senha: string, hashDeSenha: string): Promise<boolean>;
}
