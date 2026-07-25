export type DispensacaoDb = {
    id: string;
    data_entrega: string;
    proxima_retirada: string | null;
};

export type Paciente = {
    id: string;
    nome: string | null;
    data_de_nascimento?: string | null;
    cpf: string;
    cns: string;
    telefone: string | null;
    endereco: string | null;
    condicao: string | null;
    sexo: string | null;
    microarea_id: string | null;
    dispensacoes?: DispensacaoDb[];
};
