import { CatergoriasMedicamentos, FormaFarmaceutica } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateRemedyDto {
	nome!: string;
	@IsEnum(CatergoriasMedicamentos, {
		message:
			'O medicamento deve pertence a pelo menos uma das seguintes categorias: Hipertensão ou Diabet1es',
	})
	categoria!: CatergoriasMedicamentos;
	@IsEnum(FormaFarmaceutica, { message: 'Forma invalida' })
	forma_farmaceutica!: FormaFarmaceutica;
}
