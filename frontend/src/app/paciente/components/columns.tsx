"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Paciente } from "@/types/paciente";
import { maskCPF, formatarData , maskPhone} from "@/utils/formatters";

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends unknown> {
        handleEditPaciente?: (paciente: Paciente) => void;
        handleDeletePaciente?: (paciente: Paciente) => void;
    }
}

export function obterStatusVencimento(dataVencimento: string | null | undefined) {
    if (!dataVencimento || dataVencimento === "-") {
        return { status: 'NORMAL', cor: 'bg-green-100 text-green-800' };
    }

    const hoje = new Date();
    const vencimento = new Date(dataVencimento);

    if (isNaN(vencimento.getTime())) {
        return { status: 'NORMAL', cor: 'bg-green-100 text-green-800' };
    }

    hoje.setHours(0, 0, 0, 0);
    vencimento.setHours(0, 0, 0, 0);

    const diferencaMilisegundos = vencimento.getTime() - hoje.getTime();
    const diferencaDias = Math.ceil(diferencaMilisegundos / (1000 * 3600 * 24));

    if (diferencaDias < 0) {
        return { status: 'VENCIDO', cor: 'bg-red-100 text-red-800' };
    }

    if (diferencaDias <= 3) {
        return { status: 'PRÓXIMO', cor: 'bg-yellow-100 text-yellow-800' };
    }

    return { status: 'NORMAL', cor: 'bg-green-100 text-green-800' };
}

export const columns: ColumnDef<Paciente>[] = [
    {
        id: "status",
        header: "STATUS",
        cell: ({ row }) => {
            const paciente = row.original;
            const listaDispensacoes = paciente.dispensacoes || [];
            const ultimaDispensacao = listaDispensacoes.length > 0
                ? [...listaDispensacoes].sort((a, b) =>
                    new Date(b.data_entrega).getTime() - new Date(a.data_entrega).getTime()
                )[0]
                : null;

            const { status, cor } = obterStatusVencimento(ultimaDispensacao?.proxima_retirada);

            return (
                <span className={`inline-flex items-center w-fit px-3 py-1 rounded-md text-xs font-semibold ${cor}`}>
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: "nome",
        header: ({ column }) => (
            <div className="flex items-center gap-2">
                <span>PACIENTE</span>
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-white/20 p-1 rounded"
                >
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            </div>
        ),
        cell: ({ row }) => (
            <Link
                href={`/paciente/perfil?id=${row.original.id}`}
                className="block group"
            >
                <div className="font-semibold text-[#003967] group-hover:text-blue-700 group-hover:underline">
                    {row.original.nome}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                    {row.original.condicao || "-"}
                </div>
            </Link>
        ),
    },
    {
        accessorKey: "cpf",
        header: "CPF",
        cell: ({ row }) => (
            <span className="text-sm">{maskCPF(row.original.cpf)}</span>
        ),
    },
    {
        accessorKey: "telefone",
        header: "TELEFONE",
        cell: ({ row }) => (
            <span className="text-sm">{maskPhone(row.original.telefone || "-")}</span>
        ),
    },
    {
        accessorKey: "data_de_nascimento",
        header: "DATA NASC.",
        cell: ({ row }) => (
            <span className="text-sm">{formatarData(row.original.data_de_nascimento || "-")}</span>
        ),
    },
    {
        accessorKey: "condicao",
        header: "COND.",
        cell: ({ row }) => (
            <span className="text-sm">{row.original.condicao || "-"}</span>
        ),
    },
    {
        accessorKey: "Editar",
        header: "EDITAR",
        cell: ({ row, table}) => (
            <button
                type="button"
                onClick={(e)=> {
                    e.stopPropagation();
                    table.options.meta?.handleEditPaciente?.(row.original)
                    
                }}
                className="text-[#1976d2] hover:text-blue-800 transition-colors p-1.5 rounded-md hover:bg-blue-100"
                title="Editar"
            >
                <Edit className="w-5 h-5" />
            </button>
        ),
    },
    {
        accessorKey: "Excluir",
        header: "EXCLUIR",
        cell: ({ row, table }) => (
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    table.options.meta?.handleDeletePaciente?.(row.original)
                }}
                className="text-red-600 hover:text-red-800 transition-colors p-1.5 rounded-md hover:bg-red-100"
                title="Excluir"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        ),
    }

]
