import { IsInt, Min, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ReturnDispensationDto {
	@IsInt({ message: 'A quantidade devolvida deve ser um número inteiro.' })
	@Min(1, { message: 'A quantidade devolvida deve ser de pelo menos 1.' })
	@IsNotEmpty({ message: 'A quantidade devolvida é obrigatória.' })
	quantidade_devolvida!: number;

	@IsString({ message: 'O motivo deve ser um texto.' })
	@IsOptional()
	motivo?: string;
}
