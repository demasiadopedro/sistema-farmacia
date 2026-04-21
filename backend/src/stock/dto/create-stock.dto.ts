import {
	IsString,
	IsInt,
	IsNotEmpty,
	IsUUID,
	IsDateString,
	Min,
} from 'class-validator';

export class CreateStockDto {
	@IsString({ message: 'O lote deve ser uma string válida.' })
	@IsNotEmpty({ message: 'O lote não pode estar vazio.' })
	lote!: string;

	@IsInt({ message: 'A quantidade deve ser um número inteiro.' })
	@Min(0, { message: 'A quantidade não pode ser negativa.' })
	@IsNotEmpty({ message: 'A quantidade é obrigatória.' })
	quantidade!: number;

	@IsDateString(
		{},
		{
			message:
				'A data de validade deve ser uma data válida no formato ISO 8601.',
		},
	)
	@IsNotEmpty({ message: 'A data de validade é obrigatória.' })
	data_de_validade!: string | Date;

	@IsUUID('all', { message: 'O ID do medicamento deve ser um UUID válido.' })
	@IsNotEmpty({ message: 'O ID do medicamento é obrigatório.' })
	id_medicamento!: string;

	@IsUUID('all', {
		message: 'O ID da unidade de saúde deve ser um UUID válido.',
	})
	@IsNotEmpty({ message: 'O ID da unidade de saúde é obrigatório.' })
	id_unidade_saude!: string;
}
