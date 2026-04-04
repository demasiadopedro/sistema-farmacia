import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { unidade_saude } from '../../generated/prisma/client';
import { UpdateUnidadeDto } from './dto/update-user.dto';

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

	// async verificaExistencia(id: string) {
	// 	const unidade = await this.buscarUnidade(id);
	// 	if (!unidade) this.throwNotFound();
	// }

	async updateUnidade(id: string, updateUnidade: UpdateUnidadeDto) {
		const unidade = await this.buscarUnidade(id);
		if (!unidade) this.throwNotFound();
		const novaUnidade = this.prisma.unidade_saude.update({
			where: { id: id },
			data: { ...updateUnidade },
		});
		return novaUnidade;
	}
}
