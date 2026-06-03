import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMicroareaDto {
	@IsString({ message: 'O nome deve ser uma string válida.' })
	@IsNotEmpty({ message: 'O nome não pode estar vazio.' })
	nome!: string;

	@IsOptional()
	@IsUUID('all', {
		message: 'O ID da unidade de saúde deve ser um UUID válido.',
	})
	unidade_saude_id?: string;
}
