import {
	IsBoolean,
	IsDate,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePrescriptionDto {
	@IsNotEmpty({ message: 'A data da receita é obrigatória' })
	@Type(() => Date)
	@IsDate({ message: 'A data da receita deve ser uma data válida' })
	data_receita!: Date;

	@IsNotEmpty({ message: 'O campo uso contínuo é obrigatório' })
	@IsBoolean({
		message: 'O campo uso contínuo deve ser um booleano (true/false)',
	})
	uso_continuo!: boolean;

	@IsOptional()
	@IsString({ message: 'A via de administração deve ser um texto' })
	via_administracao!: string;

	@IsNotEmpty({ message: 'A quantidade receitada é obrigatória' })
	@IsInt({ message: 'A quantidade receitada deve ser um número inteiro' })
	quantidade_receitada!: number;

	@IsOptional()
	@IsUUID('all', { message: 'O id_medicamento deve ser um UUID válido' })
	id_medicamento!: string;

	@IsOptional()
	@IsUUID('all', { message: 'O id_paciente deve ser um UUID válido' })
	id_paciente!: string;
}
