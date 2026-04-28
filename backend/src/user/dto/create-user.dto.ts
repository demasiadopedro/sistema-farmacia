import { IsNotEmpty, IsString, IsTaxId } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsTaxId('pt-BR', { message: 'cpf invalido' })
	@IsNotEmpty({ message: 'o cpf nao pode esta vazio' })
	cpf!: string;

	@IsString()
	@IsNotEmpty({ message: 'o nome nao pode esta vazio' })
	nome!: string;

	@IsString()
	@IsNotEmpty({ message: 'o email nao pode esta vazio' })
	email!: string;

	@IsString()
	@IsNotEmpty({ message: 'a senha nao pode esta vazia' })
	password!: string;

	@IsString()
	@IsNotEmpty({ message: 'a atibuicao nao pode esta vazia' })
	atribuicao!: string;

	@IsString()
	@IsNotEmpty({ message: 'o comprovante nao pode esta vazio' })
	comprovante!: string;

	@IsString()
	@IsNotEmpty({ message: 'o id da unidade nao pode estar vazio' })
	id_unidade!: string;
}
