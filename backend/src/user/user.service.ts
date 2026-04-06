import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { usuario } from '../../generated/prisma/client';
import { UpdatePatientDto } from '../patient/dto/updatePatient.dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}
	throwNotFound(): never {
		throw new NotFoundException('Nao Foi possivel encontrar');
	}

	async createUser(createUserDto: CreateUserDto): Promise<usuario> {
		// 1. Verificar se a unidade existe
		const unidade = await this.prisma.unidade_saude.findUnique({
			where: { id: createUserDto.id_unidade },
		});
		if (!unidade) {
			throw new Error('Unidade atrelada ao usuario nao existe');
		}

		// 2. Gerar hash da senha
		// const hashedPassword = await this.hashService.hash(createUserDto.password);

		// 3. Criar usuário com a senha hasheada
		const newUser = await this.prisma.usuario.create({
			data: {
				cpf: createUserDto.cpf,
				nome: createUserDto.nome,
				password: createUserDto.password,
				email: createUserDto.email,
				atribuicao: createUserDto.atribuicao,
				comprovante: createUserDto.comprovante,
				id_unidade_pertecente: createUserDto.id_unidade,
			},
		});

		return newUser;
	}

	buscarTodosUsers() {
		return this.prisma.usuario.findMany();
	}

	async buscarUser(id: string) {
		const busca = { where: { id: id } };
		const user = await this.prisma.usuario.findUnique(busca);
		if (!user) this.throwNotFound();
		return user;
	}

	// update(id: number, updateUserDto: UpdateUserDto) {
	//   return `This action updates a #${id} user`;
	// }

	async deleteUser(id: string) {
		const busca = { where: { id: id } };
		const usuario = await this.prisma.usuario.findUnique(busca);
		if (!usuario) this.throwNotFound();
		return this.prisma.usuario.delete({ where: { id: id } });
	}

	async updateUser(id: string, updateUserDto: UpdatePatientDto) {
		const busca = { where: { id: id } };
		const usuario = await this.prisma.usuario.findUnique(busca);
		if (!usuario) this.throwNotFound();
		return this.prisma.usuario.update({
			where: { id: id },
			data: updateUserDto,
		});
	}

	// async verificaExistencia(id: string) {
	// 	const busca = { where: { id: id } };
	// 	const usuario = await this.prisma.usuario.findUnique(busca);
	// 	if (!usuario) this.throwNotFound();
	// }
}
