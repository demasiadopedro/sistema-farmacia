"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { Search, Plus, Edit, Trash2, AlertTriangle, Info } from "lucide-react";

// Mock data para ilustrar os alertas
const mockEstoque = [
    { id: 1, nome: "Losartana Potássica", dosagem: "50mg", lote: "L-202301", validade: "2027-05-10", quantidade: 1200 },
    { id: 2, nome: "Metformina", dosagem: "850mg", lote: "M-19920", validade: "2026-08-15", quantidade: 85 }, // Baixo estoque (Atenção)
    { id: 3, nome: "Glibenclamida", dosagem: "5mg", lote: "G-0012", validade: "2024-05-01", quantidade: 300 }, // Validade vencida
    { id: 4, nome: "Enalapril", dosagem: "10mg", lote: "E-883", validade: "2028-11-20", quantidade: 25 }, // Muito baixo estoque (Crítico)
    { id: 5, nome: "Atenolol", dosagem: "50mg", lote: "A-5443", validade: "2024-07-25", quantidade: 500 }, // Validade próxima
];

export default function Estoque() {
    const [searchTerm, setSearchTerm] = useState("");

    // Helpers para definir os alertas visuais
    const getQuantidadeStatus = (qtd: number) => {
        if (qtd <= 50) return { label: "Crítico", color: "text-red-700 bg-red-100 border-red-200" };
        if (qtd <= 100) return { label: "Atenção", color: "text-amber-700 bg-amber-100 border-amber-200" };
        return { label: "Normal", color: "text-emerald-700 bg-emerald-100 border-emerald-200" };
    };

    const getValidadeStatus = (dataValidade: string) => {
        const hoje = new Date();
        const validade = new Date(dataValidade);
        const diferencaTempo = validade.getTime() - hoje.getTime();
        const diasFaltantes = Math.ceil(diferencaTempo / (1000 * 3600 * 24));

        if (diasFaltantes < 0) return { label: "Vencido", color: "text-red-700 bg-red-50 border border-red-200", icon: <AlertTriangle className="w-4 h-4 text-red-600" /> };
        if (diasFaltantes <= 90) return { label: "Vence em breve", color: "text-amber-700 bg-amber-50 border border-amber-200", icon: <Info className="w-4 h-4 text-amber-600" /> };
        return { label: "Ok", color: "text-gray-700 bg-gray-50 border border-gray-200", icon: null };
    };

    // Filter logic
    const filteredEstoque = mockEstoque.filter(item =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lote.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="sm:ml-56 min-h-screen bg-gray-50 flex flex-col">
            <div className="relative flex items-center bg-white border-b border-gray-200 p-4 h-16 shrink-0 shadow-sm">
                <Sidebar />
                <h1 className="text-2xl font-semibold text-[#003967] whitespace-nowrap">Estoque</h1>
            </div>

            <div className="p-4 md:p-8 flex-1 flex flex-col gap-6">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <Field orientation={"horizontal"} className="w-full md:w-auto">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1976d2] w-5 h-5" />
                            <Input
                                type="search"
                                placeholder="Buscar medicamento ou lote..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11 border-[#1976d2] focus-visible:ring-[#1976d2] w-full bg-white rounded-lg shadow-sm"
                            />
                        </div>
                    </Field>

                    <Button className="bg-[#1976d2] hover:bg-[#1565c0] text-white h-11 px-6 rounded-lg font-medium flex gap-2 items-center w-full md:w-auto shadow-sm transition-colors">
                        <Plus className="w-5 h-5" />
                        Novo Medicamento
                    </Button>
                </div>

                {/* Table Card */}
                <Card className="shadow-md border-none ring-1 ring-gray-100 overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#003967] text-white text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-lg">Medicamento / Dosagem</th>
                                    <th className="px-6 py-4">Lote</th>
                                    <th className="px-6 py-4 text-center">Quantidade</th>
                                    <th className="px-6 py-4 text-center">Validade</th>
                                    <th className="px-6 py-4 text-center rounded-tr-lg">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredEstoque.length > 0 ? (
                                    filteredEstoque.map((item) => {
                                        const qtdStatus = getQuantidadeStatus(item.quantidade);
                                        const valStatus = getValidadeStatus(item.validade);

                                        return (
                                            <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[#003967] text-base">{item.nome}</span>
                                                        <span className="text-gray-500 font-medium">{item.dosagem}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-600">
                                                    {item.lote}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="text-lg font-bold text-gray-800">{item.quantidade}</span>
                                                        <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase rounded border ${qtdStatus.color}`}>
                                                            {qtdStatus.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="font-semibold text-gray-800">
                                                            {new Date(item.validade).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${valStatus.color}`}>
                                                            {valStatus.icon}
                                                            {valStatus.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center gap-3">
                                                        <button className="text-[#1976d2] hover:text-blue-800 transition-colors p-1.5 rounded-md hover:bg-blue-100" title="Editar">
                                                            <Edit className="w-5 h-5" />
                                                        </button>
                                                        <button className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-md hover:bg-red-50" title="Excluir">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium text-base">
                                            Nenhum medicamento encontrado para "{searchTerm}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </div>
        </main>
    )
}