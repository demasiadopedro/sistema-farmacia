"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { criarMedicamentoAction, criarLoteAction } from "@/app/actions/estoque";

export interface MedicamentoOption {
    id: string;
    nome: string;
}

const FormaFarmaceutica = [
    'COMPRIMIDO',
    'CAPSULA',
    'FRASCO',
    'AMPOLA',
    'BISNAGA',
    'ENVELOPE',
    'CANETA',
    'UNIDADE',
]

interface FormularioLoteProps {
    medicamentosExistentes: MedicamentoOption[];
    onClose?: () => void;
}

export default function FormularioLote({ medicamentosExistentes }: FormularioLoteProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState(false);

    const [idMedicamentoSelecionado, setIdMedicamentoSelecionado] = useState("");
    const [lote, setLote] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [dataValidade, setDataValidade] = useState("");
    
    const [buscaMedicamento, setBuscaMedicamento] = useState("");
    const [dropdownAberto, setDropdownAberto] = useState(false);
    
    const isNovoMedicamento = idMedicamentoSelecionado === "NOVO";
    const [novoNome, setNovoNome] = useState("");
    const [novaCategoria, setNovaCategoria] = useState("HIPERTENSAO");
    const [novaForma, setNovaForma] = useState("COMPRIMIDO");

    const medicamentosFiltrados = medicamentosExistentes.filter(
        (med) => med.nome.toLowerCase().includes(buscaMedicamento.toLowerCase())
    );

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let idMedicamentoFinal = idMedicamentoSelecionado;

        if (isNovoMedicamento) {
            const medData = new FormData();
            medData.append("nome", novoNome);
            medData.append("categoria", novaCategoria);
            medData.append("forma_farmaceutica", novaForma);

            const resultMed = await criarMedicamentoAction(medData);

            if (resultMed.error) {
                setError(resultMed.error);
                setLoading(false);
                return;
            }
            idMedicamentoFinal = resultMed.id_medicamento;
        }

        const loteData = new FormData();
        loteData.append("id_medicamento", idMedicamentoFinal);
        loteData.append("lote", lote);
        loteData.append("quantidade", quantidade);
        loteData.append("data_de_validade", dataValidade);

        const resultLote = await criarLoteAction(loteData);

        if (resultLote.error) {
            setError(resultLote.error);
        } else {
            setSucesso(true);
            window.location.reload();
        }

        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 rounded-md bg-white grid gap-y-4 max-h-[85vh] overflow-y-auto pr-2">
            <h2 className="text-xl font-bold mb-1 text-center">Entrada de Estoque</h2>

            {error && <div className="text-red-500 text-sm font-semibold">{error}</div>}
            {sucesso && <div className="text-green-600 text-sm font-semibold">Lote cadastrado com sucesso!</div>}

            <div className="space-y-2 relative">
                <Label className="text-base font-semibold">Medicamento</Label>
                <Input 
                    type="text"
                    placeholder="Ex: Insulina"
                    value={buscaMedicamento}
                    className="h-12 text-base w-full rounded-md"
                    onChange={(e) => {
                        setBuscaMedicamento(e.target.value)
                        setDropdownAberto(true)
                        if (idMedicamentoSelecionado !== 'NOVO') {
                            setIdMedicamentoSelecionado("");
                        }
                    }}
                    onFocus={() => setDropdownAberto(true)}
                    onBlur={() => setTimeout(() => setDropdownAberto(false), 200)}
                />
            
                {dropdownAberto && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        
                        {medicamentosFiltrados.length > 0 ? (
                            medicamentosFiltrados.map((med) => (
                                <div
                                    key={med.id}
                                    className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 text-slate-700"
                                    onClick={() => {
                                        setIdMedicamentoSelecionado(med.id);
                                        setBuscaMedicamento(med.nome);
                                        setDropdownAberto(false);
                                    }}
                                >
                                    {med.nome}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-gray-500 italic border-b border-gray-100">
                                Nenhum medicamento encontrado.
                            </div>
                        )}
                        
                        <div
                            className="px-4 py-3 cursor-pointer text-blue-600 font-bold hover:bg-blue-50 bg-gray-50 sticky bottom-0"
                            onClick={() => {
                                setIdMedicamentoSelecionado("NOVO");
                                setBuscaMedicamento("Criando Novo Medicamento..."); 
                                setDropdownAberto(false);
                            }}
                        >
                            + Cadastrar Novo Medicamento
                        </div>
                    </div>
                )}
            </div>

            {/* DETALHES DO NOVO MEDICAMENTO */}
            {isNovoMedicamento && (
                <div className=" p-4 border rounded-md grid gap-y-6 mt-2">
                    <div className="space-y-2 mt-2">
                        <Label className="text-base ">Nome do Medicamento</Label>
                        <Input
                            placeholder="Ex: Losartana 50mg"
                            value={novoNome}
                            onChange={(e) => setNovoNome(e.target.value)}
                            required={isNovoMedicamento}
                            className="h-12 text-md w-full rounded-md placeholder:text-black placeholder:font-normal"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 m">
                        <div className="space-y-2">
                            <Label className="text-base">Categoria</Label>
                            <select
                                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 outline-none"
                                value={novaCategoria}
                                onChange={(e) => setNovaCategoria(e.target.value)}
                            >
                                <option value="HIPERTENSAO">Hipertensão</option>
                                <option value="DIABETES">Diabetes</option>
                                <option value="HIPERDIA">Hiperdia</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-base">Forma Farmacêutica</Label>
                            <select
                                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 outline-none"
                                value={novaForma}
                                onChange={(e) => setNovaForma(e.target.value)}
                            >
                                {FormaFarmaceutica.map((forma, index) => (
                                    <option key={index} value={forma}>
                                        {forma}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* DADOS DO LOTE */}
            <div className="mt-6 pt-6">
                <h3 className="text-lg font-bold mb-4 text-slate-800">Dados do Lote</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-base">Lote</Label>
                        <Input
                            placeholder="Ex: LOT2026-A"
                            value={lote}
                            className="h-12 text-base w-full rounded-md"
                            onChange={(e) => setLote(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-base">Quantidade</Label>
                        <Input
                            type="number"
                            placeholder="Ex: 500"
                            className="h-12 text-base w-full rounded-md"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            required
                            min="1"
                        />
                    </div>
                </div>
            </div>
            
            <div className="space-y-2">
                <Label className="text-base">Validade</Label>
                <Input
                    type="date"
                    className="h-10 text-base w-full rounded-md"
                    value={dataValidade}
                    onChange={(e) => setDataValidade(e.target.value)}
                    required
                />
            </div>
            
            <Button type="submit" className="w-full h-12 rounded-md mt-8 bg-[#1976d2] hover:bg-[#1565c0] text-white transition-colors text-lg shadow-sm font-semibold" disabled={loading}>
                {loading ? "Salvando..." : "Registrar Entrada no Estoque"}
            </Button>
        </form>
    );
}