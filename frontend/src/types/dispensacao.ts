export interface Paciente {
  id: string;
  nome: string | null;
  cpf: string;
}

export interface MedicamentoEstoque {
  id: string;
  nome: string;
  quantidadeTotal: number;
}

export interface Prescricao {
    id_paciente: string;
    id_medicamento: string;
    medicamentoNome: string;
    viaAdministracao: string;
    quantidade: string;
}

export interface Dispensacao {
    dataEntrega: string;
    quantidadeEntregue: string;
    proximaRetirada: string;
}
