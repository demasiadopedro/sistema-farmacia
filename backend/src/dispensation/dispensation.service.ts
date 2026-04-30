// dispensation.service.ts
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

	async create(dto: CreateDispensationDto) {
		return this.prisma.$transaction(
			async (tx) => {
				if (dto.id_paciente) {
					const paciente = await tx.paciente.findUnique({
						where: { id: dto.id_paciente },
					});
					if (!paciente)
						throw new BadRequestException('Paciente não encontrado.');
				}

				if (dto.id_prescricao) {
					const prescricao = await tx.prescricao.findUnique({
						where: { id: dto.id_prescricao },
					});
					if (!prescricao)
						throw new BadRequestException('Prescrição não encontrada.');
				}

				const lotesDisponiveis = await tx.estoque.findMany({
					where: {
						id_medicamento: dto.id_medicamento,
						quantidade: { gt: 0 },
					},
					orderBy: {
						data_de_validade: 'asc',
					},
				});

				const totalDisponivel = lotesDisponiveis.reduce(
					(acc, lote) => acc + lote.quantidade,
					0,
				);

				if (totalDisponivel < dto.quantidade_solicitada) {
					throw new BadRequestException(
						`Estoque insuficiente. Solicitado: ${dto.quantidade_solicitada}, Disponível: ${totalDisponivel}`,
					);
				}

				const dispensacao = await tx.dispensacao.create({
					data: {
						proxima_retirada: dto.proxima_retirada,
						id_prescricao: dto.id_prescricao,
						id_usuario: dto.id_usuario,
						id_paciente: dto.id_paciente,
					},
				});

				let quantidadeRestanteParaPegar = dto.quantidade_solicitada;

				for (const lote of lotesDisponiveis) {
					if (quantidadeRestanteParaPegar === 0) break;

					const quantidadeRetiradaDesteLote = Math.min(
						lote.quantidade,
						quantidadeRestanteParaPegar,
					);

					await tx.item_dispensado.create({
						data: {
							id_dispensacao: dispensacao.id,
							id_estoque: lote.id,
							quantidade: quantidadeRetiradaDesteLote,
						},
					});

					await tx.estoque.update({
						where: { id: lote.id },
						data: {
							quantidade: { decrement: quantidadeRetiradaDesteLote },
						},
					});

					quantidadeRestanteParaPegar -= quantidadeRetiradaDesteLote;
				}

				return tx.dispensacao.findUnique({
					where: { id: dispensacao.id },
					include: { itens: true },
				});
			},
			{
				maxWait: 5000, // Tempo máximo esperando para conectar (5s)
				timeout: 10000, // Tempo máximo para a transação inteira rodar (10s)
			},
		);
	}

	async reverseDispensation(
		idDispensacao: string,
		returnDto: ReturnDispensationDto,
	) {
		return this.prisma.$transaction(
			async (tx) => {
				const dispensacao = await tx.dispensacao.findUnique({
					where: { id: idDispensacao },
					include: {
						itens: {
							include: { estoque: true },
							orderBy: { estoque: { data_de_validade: 'desc' } },
						},
					},
				});

				if (!dispensacao) {
					throw new NotFoundException(
						'Registro de dispensação não encontrado.',
					);
				}

				const totalEntregue = dispensacao.itens.reduce(
					(acc, item) => acc + item.quantidade,
					0,
				);

				if (returnDto.quantidade_devolvida > totalEntregue) {
					throw new BadRequestException(
						'A quantidade devolvida não pode ser maior do que a quantidade entregue originalmente.',
					);
				}

				let quantidadeRestanteParaDevolver = returnDto.quantidade_devolvida;

				for (const item of dispensacao.itens) {
					if (quantidadeRestanteParaDevolver === 0) break;

					const quantidadeDevolvidaParaEsteLote = Math.min(
						item.quantidade,
						quantidadeRestanteParaDevolver,
					);

					await tx.estoque.update({
						where: { id: item.id_estoque },
						data: {
							quantidade: { increment: quantidadeDevolvidaParaEsteLote },
						},
					});

					quantidadeRestanteParaDevolver -= quantidadeDevolvidaParaEsteLote;
				}

				return {
					message: 'Devolução processada com sucesso, estoque atualizado.',
					id_dispensacao_revertida: idDispensacao,
					quantidade_retornada: returnDto.quantidade_devolvida,
				};
			},
			{
				maxWait: 5000, // Tempo máximo esperando para conectar (5s)
				timeout: 10000, // Tempo máximo para a transação inteira rodar (10s)
			},
		);
	}
}
