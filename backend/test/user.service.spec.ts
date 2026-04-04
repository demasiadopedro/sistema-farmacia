import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

describe('UserService', () => {
	let userService: UserService;
	let prismaService: PrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: PrismaService,
					useValue: {
						usuario: {
							create: jest.fn(),
						},
						unidade_saude: {
							findUnique: jest.fn(),
						},
					},
				},
			],
		}).compile();

		userService = module.get<UserService>(UserService);
		prismaService = module.get<PrismaService>(PrismaService);
	});

	describe('createUser', () => {
		it('deve criar um novo usuário', async () => {
			const createUserDto: CreateUserDto = {
				cpf: '123.456.789-00',
				nome: 'João da Silva',
				email: 'joao.silva@exemplo.com',
				password: 'senhaSegura123!',
				atribuicao: 'Administrador',
				comprovante: 'url_do_comprovante',
				id_unidade: 'id-unidade-teste',
			};

			const unidadeRetornadaDoBanco = {
				id: 'id-unidade-teste',
				nome: 'UBS Centro',
				endereco: 'Rua das Flores, 123',
				cnes: '1234567',
			};

			const usuarioSalvoNoBanco = {
				id: 'uuid-do-usuario-gerado',
				...createUserDto,
				id_unidade_pertecente: createUserDto.id_unidade,
			};

			jest
				.spyOn(prismaService.unidade_saude, 'findUnique')
				.mockResolvedValue(unidadeRetornadaDoBanco);
			jest
				.spyOn(prismaService.usuario, 'create')
				.mockResolvedValue(usuarioSalvoNoBanco);

			await userService.createUser(createUserDto);

			expect(prismaService.unidade_saude.findUnique).toHaveBeenCalledWith({
				where: { id: createUserDto.id_unidade },
			});

			expect(prismaService.usuario.create).toHaveBeenCalledWith({
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
		});
	});
});
