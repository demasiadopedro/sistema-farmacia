import {
	IsInt,
	Min,
	IsNotEmpty,
	IsOptional,
	IsUUID,
	IsDateString,
} from 'class-validator';

export class CreateDispensationDto {
	@IsInt({ message: 'A quantidade solicitada deve ser um número inteiro.' })
	@Min(1, { message: 'A quantidade solicitada deve ser no mínimo 1.' })
	@IsNotEmpty({ message: 'A quantidade solicitada é obrigatória.' })
	quantidade_solicitada!: number;

	@IsUUID('all', {
		message: 'O ID do medicamento é obrigatório para buscar os lotes.',
	})
	@IsNotEmpty({ message: 'O medicamento é obrigatório.' })
	id_medicamento!: string; // O Backend usa isso para achar os lotes!

	@IsDateString({}, { message: 'A próxima retirada deve ser uma data válida.' })
	@IsOptional()
	proxima_retirada?: string | Date;

	@IsUUID('all', { message: 'O ID da prescrição deve ser um UUID válido.' })
	@IsOptional()
	id_prescricao?: string;

	@IsUUID('all', {
		message: 'O ID do usuário (farmacêutico/atendente) deve ser válido.',
	})
	@IsOptional()
	id_usuario?: string;

	@IsUUID('all', { message: 'O ID do paciente deve ser um UUID válido.' })
	@IsOptional()
	id_paciente?: string;
}
