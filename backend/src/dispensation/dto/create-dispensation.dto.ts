import {
	IsInt,
	Min,
	IsNotEmpty,
	IsOptional,
	IsUUID,
	IsDateString,
} from 'class-validator';

export class CreateDispensationDto {
	@IsInt({ message: 'A quantidade entregue deve ser um número inteiro.' })
	@Min(1, { message: 'A quantidade entregue deve ser no mínimo 1.' })
	@IsNotEmpty({ message: 'A quantidade entregue é obrigatória.' })
	quantidade_entregue!: number;

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

	@IsUUID('all', { message: 'O ID do estoque deve ser um UUID válido.' })
	@IsOptional()
	id_estoque!: string;
}
