import {
	Injectable,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDispensationDto } from './dto/create-dispensation.dto';
import { ReturnDispensationDto } from './dto/return-dispensation.dto';

@Injectable()
export class DispensationService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createDispensacaoDto: CreateDispensationDto) {
		return this.prisma.$transaction(async (tx) => {
			const estoque = await tx.estoque.findUnique({
				where: { id: createDispensacaoDto.id_estoque },
			});

			const paciente = await tx.paciente.findUnique({
				where: {
					id: createDispensacaoDto.id_paciente,
				},
			});

			const prescricao = await tx.prescricao.findUnique({
				where: {
					id: createDispensacaoDto.id_prescricao,
				},
			});

			if (!paciente) {
				throw new BadRequestException(
					'Paciente não encontrado, por favor cadastralo no programa.',
				);
			}
			if (!prescricao) {
				throw new BadRequestException('Prescrição não encontrada.');
			}

			if (!estoque) {
				throw new BadRequestException('Lote de estoque não encontrado.');
			}
			if (estoque.quantidade < createDispensacaoDto.quantidade_entregue) {
				throw new BadRequestException('Quantidade insuficiente neste lote.');
			}
			const dispensacao = await tx.dispensacao.create({
				data: {
					quantidade_entregue: createDispensacaoDto.quantidade_entregue,
					proxima_retirada: createDispensacaoDto.proxima_retirada,
					id_prescricao: createDispensacaoDto.id_prescricao,
					id_usuario: createDispensacaoDto.id_usuario,
					id_paciente: createDispensacaoDto.id_paciente,
					id_estoque: createDispensacaoDto.id_estoque,
				},
			});
			await tx.estoque.update({
				where: { id: createDispensacaoDto.id_estoque },
				data: {
					quantidade: {
						decrement: createDispensacaoDto.quantidade_entregue,
					},
				},
			});

			return dispensacao;
		});
	}

	async reverseDispensation(
		idDispensacao: string,
		returnDto: ReturnDispensationDto,
	) {
		return this.prisma.$transaction(async (tx) => {
			const dispensacao = await tx.dispensacao.findUnique({
				where: { id: idDispensacao },
			});

			if (!dispensacao) {
				throw new NotFoundException('Registro de dispensação não encontrado.');
			}

			if (returnDto.quantidade_devolvida > dispensacao.quantidade_entregue) {
				throw new BadRequestException(
					'A quantidade devolvida não pode ser maior do que a quantidade entregue originalmente.',
				);
			}

			await tx.estoque.update({
				where: { id: dispensacao.id_estoque },
				data: {
					quantidade: {
						increment: returnDto.quantidade_devolvida,
					},
				},
			});
			return {
				message: 'Devolução processada com sucesso, estoque atualizado.',
				id_dispensacao_revertida: idDispensacao,
				quantidade_retornada: returnDto.quantidade_devolvida,
			};
		});
	}
}
