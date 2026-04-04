import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/createPatient.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePatientDto } from './dto/updatePatient.dto';

@Injectable()
export class PatientService {
	constructor(private prisma: PrismaService) {}

	throwNotFound(): never {
		throw new NotFoundException('Nao Foi possivel encontrar');
	}

	async createPatient(createPatient: CreatePatientDto) {
		const newPatient = await this.prisma.paciente.create({
			data: {
				nome: createPatient.nome,
				data_de_nascimento: createPatient.data_nascimento,
				cpf: createPatient.cpf,
				cns: createPatient.cns,
				telefone: createPatient.telefone,
				endereco: createPatient.endereco,
				condicao: createPatient.condicao,
				sexo: createPatient.sexo,
			},
		});
		return newPatient;
	}

	async buscarPatient(idParam: string) {
		const busca = { where: { id: idParam } };
		const paciente = await this.prisma.paciente.findUnique(busca);
		if (!paciente) this.throwNotFound();
		return paciente;
	}

	async deletePatient(id: string) {
		const paciente = await this.buscarPatient(id);
		if (!paciente) {
			console.log('paciente nao encontrado');
			this.throwNotFound();
		}
		await this.prisma.paciente.delete({ where: { id: id } });
		console.log('paciente do cpf', paciente?.cpf, 'foi deletado');
		return paciente;
	}

	async updatePatient(id: string, updatePatient: UpdatePatientDto) {
		const busca = { where: { id: id } };
		const paciente = await this.prisma.paciente.findUnique(busca);
		if (!paciente) this.throwNotFound();
		return this.prisma.paciente.update({
			where: { id: id },
			data: updatePatient,
		});
	}
}
