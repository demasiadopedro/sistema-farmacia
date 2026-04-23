import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrescriptionService {
	constructor(private prisma: PrismaService) {}

	async create(createPrescriptionDto: CreatePrescriptionDto) {
		const medicamentoExiste = await this.prisma.medicamento.findUnique({
			where: { id: createPrescriptionDto.id_medicamento },
		});
		if (!medicamentoExiste) {
			throw new NotFoundException(
				'Medicamento informado não foi encontrado na base de dados.',
			);
		}

		if (createPrescriptionDto.id_paciente) {
			const pacienteExiste = await this.prisma.paciente.findUnique({
				where: { id: createPrescriptionDto.id_paciente },
			});
			if (!pacienteExiste) {
				throw new NotFoundException(
					'Paciente informado não foi encontrado na base de dados.',
				);
			}
		}

		return this.prisma.prescricao.create({
			data: createPrescriptionDto,
		});
	}

	async findAll() {
		return this.prisma.prescricao.findMany();
	}

	async findOne(id: string) {
		const prescricao = await this.prisma.prescricao.findUnique({
			where: { id },
		});

		if (!prescricao) {
			throw new NotFoundException('Prescrição não encontrada.');
		}

		return prescricao;
	}

	async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
		await this.findOne(id);
		const medicamentoExiste = await this.prisma.medicamento.findUnique({
			where: { id: updatePrescriptionDto.id_medicamento },
		});
		if (!medicamentoExiste) {
			throw new NotFoundException(
				'Medicamento informado não foi encontrado na base de dados.',
			);
		}
		if (updatePrescriptionDto.id_paciente) {
			const pacienteExiste = await this.prisma.paciente.findUnique({
				where: { id: updatePrescriptionDto.id_paciente },
			});
			if (!pacienteExiste) {
				throw new NotFoundException(
					'Paciente informado não foi encontrado na base de dados.',
				);
			}
		}

		return this.prisma.prescricao.update({
			where: { id },
			data: updatePrescriptionDto,
		});
	}

	async remove(id: string) {
		await this.findOne(id);

		return this.prisma.prescricao.delete({
			where: { id },
		});
	}
}
