import { CatergoriasMedicamentos, UnidadeMedida } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateRemedyDto {
	@IsString()
	@IsNotEmpty({ message: 'O nome do medicamento não pode ser vazio.' })
	nome!: string;
	@IsEnum(CatergoriasMedicamentos, {
		message:
			'O medicamento deve pertence a pelo menos uma das seguintes categorias: Hipertensão ou Diabet1es',
	})
	categoria!: CatergoriasMedicamentos;
	@IsEnum(UnidadeMedida, { message: 'Forma invalida' })
	forma_farmaceutica!: UnidadeMedida;
}
