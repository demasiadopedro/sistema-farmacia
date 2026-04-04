import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUnidadeDto {
	@IsString()
	@IsNotEmpty({ message: 'o nome nao pode esta vazio' })
	readonly nome!: string;
	@IsString()
	@IsNotEmpty({ message: 'o cnes nao pode esta vazio' })
	readonly cnes!: string;
	@IsInt()
	@IsNotEmpty({ message: 'o nome nao pode esta vazio' })
	readonly CEP!: number;
	@IsInt()
	@IsNotEmpty()
	readonly numero_edificio!: number;
}
