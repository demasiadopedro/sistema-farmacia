import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, MaxDate } from 'class-validator';

export class CreatePatientDto {
	@IsString()
	@IsNotEmpty()
	nome: string;
	@IsNotEmpty()
	@Type(() => Date)
	@IsDate()
	@MaxDate(new Date(), { message: 'data de nascimento invalida' })
	data_nascimento: Date;
	@IsString()
	@IsNotEmpty()
	cpf: string;
	@IsString()
	@IsNotEmpty()
	cns: string;
	@IsString()
	@IsNotEmpty()
	telefone: string;
	@IsString()
	@IsNotEmpty()
	endereco: string;
	@IsString()
	@IsNotEmpty()
	condicao: string;
	@IsString()
	@IsNotEmpty()
	sexo: string;
}
