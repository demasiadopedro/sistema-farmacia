import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { unidade_saude } from '../../generated/prisma/client';
import { UpdateUnidadeDto } from './dto/update-user.dto';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { Role } from '@prisma/client';
import { UpdateMicroareaDto } from './dto/update-microarea.dto';
import { CreateMicroareaDto } from './dto/create-microarea.dto';

@Injectable()
export class UnidadeService {
	constructor(private prisma: PrismaService) {}

	throwNotFound(): never {
		throw new NotFoundException('Nao Foi possivel encontrar');
	}

	async buscarTodos() {
		return this.prisma.unidade_saude.findMany();
	}

	async criarUnidade(
		createUnidadeDto: CreateUnidadeDto,
	): Promise<unidade_saude> {
		const cnesValidado = createUnidadeDto.cnes;

		const newUnidade = await this.prisma.unidade_saude.create({
			data: {
				nome: createUnidadeDto.nome,
				cnes: cnesValidado,
				CEP: createUnidadeDto.CEP,
				numero_edificio: createUnidadeDto.numero_edificio,
			},
		});
		return newUnidade;
	}

	async buscarUnidade(idParam: string) {
		const busca = { where: { id: idParam } };
		const unidade = await this.prisma.unidade_saude.findUnique(busca);
		if (!unidade) return this.throwNotFound();
		return unidade;
	}

	async deleteUnidade(idParam: string) {
		const unidade = await this.buscarUnidade(idParam);
		if (!unidade) this.throwNotFound();
		await this.prisma.unidade_saude.delete({ where: { id: idParam } });
	}

	async updateUnidade(
		id: string,
		updateUnidade: UpdateUnidadeDto,
		token: TokenPayloadDto,
	) {
		const user = await this.prisma.usuario.findUnique({
			where: { id: token.sub },
		});

		if (user?.id_unidade_pertecente !== id && user?.role !== Role.ADMIN) {
			throw new ForbiddenException(
				'Voce nao tem permissão para alterar essa unidade',
			);
		}
		const unidade = await this.buscarUnidade(id);
		if (!unidade) this.throwNotFound();
		const novaUnidade = await this.prisma.unidade_saude.update({
			where: { id: id },
			data: { ...updateUnidade },
		});
		return novaUnidade;
	}

	async criarMicroarea(
		unidadeId: string,
		createMicroareaDto: CreateMicroareaDto,
	) {
		await this.buscarUnidade(unidadeId);

		return this.prisma.microarea.create({
			data: {
				nome: createMicroareaDto.nome,
				unidade_saude_id: unidadeId,
			},
		});
	}

	async buscarTodasMicroareasDaUnidade(unidadeId: string) {
		await this.buscarUnidade(unidadeId);

		return this.prisma.microarea.findMany({
			where: { unidade_saude_id: unidadeId },
		});
	}

	async buscarMicroareaPorId(unidadeId: string, microareaId: string) {
		const microarea = await this.prisma.microarea.findFirst({
			where: {
				id: microareaId,
				unidade_saude_id: unidadeId, // Garante que a microárea pertence a esta unidade
			},
		});

		if (!microarea) this.throwNotFound();
		return microarea;
	}

	async atualizarMicroarea(
		unidadeId: string,
		microareaId: string,
		updateMicroareaDto: UpdateMicroareaDto,
	) {
		await this.buscarMicroareaPorId(unidadeId, microareaId);

		return this.prisma.microarea.update({
			where: { id: microareaId },
			data: { ...updateMicroareaDto },
		});
	}

	async deletarMicroarea(unidadeId: string, microareaId: string) {
		await this.buscarMicroareaPorId(unidadeId, microareaId);

		await this.prisma.microarea.delete({
			where: { id: microareaId },
		});
	}
}
