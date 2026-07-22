"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { criarMedicamentoAction, criarLoteAction, atualizarLoteAction } from "../../../actions/estoque";
import { EstoqueData } from "../EstoqueClient";

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
    itemEditando?: EstoqueData | null;
}

export default function FormularioLote({ medicamentosExistentes, onClose, itemEditando }: FormularioLoteProps) {
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

    useEffect(() => {
        if (itemEditando) {
            setIdMedicamentoSelecionado(itemEditando.medicamento?.id || "");
            setLote(itemEditando.lote || "");
            setQuantidade(itemEditando.quantidade.toString());
            
            if (itemEditando.data_de_validade) {
                const data = new Date(itemEditando.data_de_validade).toISOString().split('T')[0];
                setDataValidade(data);
            }
            
            setBuscaMedicamento(itemEditando.medicamento?.nome || "");
        }
    }, [itemEditando]);

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

        if (itemEditando) {
            loteData.append("id_lote", itemEditando.id);
            const resultLote = await atualizarLoteAction(loteData);

            if (resultLote.error) {
                setError(resultLote.error);
            } else {
                setSucesso(true);
                setTimeout(() => window.location.reload(), 1500);
            }
        } else {
            const resultLote = await criarLoteAction(loteData);

            if (resultLote.error) {
                setError(resultLote.error);
            } else {
                setSucesso(true);
                window.location.reload();
            }
        }

        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 rounded-lg bg-white grid gap-y-5 max-h-[90vh] overflow-y-auto pr-2">
            {/* Header */}
            <div className="flex flex-col gap-2 pb-2 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-slate-900">
                    {itemEditando ? "Editar Lote" : "Entrada de Estoque"}
                </h2>
                <p className="text-sm text-gray-500">
                    {itemEditando ? "Atualize os dados do lote de medicamento" : "Registre um novo lote no sistema"}
                </p>
            </div>

            {/* Mensagens */}
            {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 flex gap-2">
                    <span className="text-red-700 text-sm font-medium">⚠️ {error}</span>
                </div>
            )}
            {sucesso && (
                <div className="p-3 rounded-md bg-green-50 border border-green-200 flex gap-2">
                    <span className="text-green-700 text-sm font-medium">✓ {itemEditando ? "Lote atualizado com sucesso!" : "Lote cadastrado com sucesso!"}</span>
                </div>
            )}

            {/* Seção de Medicamento */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-800">Medicamento</h3>
                    {!itemEditando && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            {idMedicamentoSelecionado ? (idMedicamentoSelecionado === "NOVO" ? "Novo" : "Selecionado") : "Obrigatório"}
                        </span>
                    )}
                </div>
                
                <div className="relative">
                    <Input 
                        type="text"
                        placeholder="Buscar medicamento..."
                        value={buscaMedicamento}
                        className="h-11 text-base w-full rounded-lg border-gray-300 placeholder:text-gray-400"
                        onChange={(e) => {
                            setBuscaMedicamento(e.target.value)
                            setDropdownAberto(true)
                            if (idMedicamentoSelecionado !== 'NOVO') {
                                setIdMedicamentoSelecionado("");
                            }
                        }}
                        onFocus={() => !itemEditando && setDropdownAberto(true)}
                        onBlur={() => setTimeout(() => setDropdownAberto(false), 200)}
                        disabled={itemEditando ? true : false}
                    />
                
                    {dropdownAberto && !itemEditando && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                            {medicamentosFiltrados.length > 0 ? (
                                medicamentosFiltrados.map((med) => (
                                    <div
                                        key={med.id}
                                        className="px-4 py-2.5 cursor-pointer hover:bg-blue-50 text-slate-700 text-sm transition-colors"
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
                                <div className="px-4 py-3 text-gray-500 text-sm italic text-center">
                                    Nenhum medicamento encontrado
                                </div>
                            )}
                            
                            <div
                                className="px-4 py-2.5 cursor-pointer text-blue-600 font-semibold hover:bg-blue-50 bg-blue-50 sticky bottom-0 border-t border-gray-100 text-sm transition-colors"
                                onClick={() => {
                                    setIdMedicamentoSelecionado("NOVO");
                                    setBuscaMedicamento(""); 
                                    setDropdownAberto(false);
                                }}
                            >
                                + Cadastrar Novo Medicamento
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Seção Novo Medicamento */}
            {isNovoMedicamento && (
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4">
                    <h4 className="font-semibold text-blue-900 text-sm flex items-center gap-2">
                        Informações do Novo Medicamento
                    </h4>
                    
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Nome do Medicamento</Label>
                        <Input
                            placeholder="Ex: Losartana 50mg"
                            value={novoNome}
                            onChange={(e) => setNovoNome(e.target.value)}
                            required={isNovoMedicamento}
                            className="h-10 text-sm rounded-lg border-gray-300 placeholder:text-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700">Categoria</Label>
                            <select
                                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={novaCategoria}
                                onChange={(e) => setNovaCategoria(e.target.value)}
                            >
                                <option value="HIPERTENSAO">Hipertensão</option>
                                <option value="DIABETES">Diabetes</option>
                                <option value="HIPERDIA">Hiperdia</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700">Forma Farmacêutica</Label>
                            <select
                                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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

            {/* Seção Dados do Lote */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">Dados do Lote</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Número do Lote</Label>
                        <Input
                            placeholder="LOT2026-A"
                            value={lote}
                            className="h-10 text-sm rounded-lg border-gray-300 placeholder:text-gray-400"
                            onChange={(e) => setLote(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Quantidade</Label>
                        <Input
                            type="number"
                            placeholder="500"
                            className="h-10 text-sm rounded-lg border-gray-300 placeholder:text-gray-400"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            required
                            min="1"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Data de Validade</Label>
                        <Input
                            type="date"
                            className="h-10 text-sm rounded-lg border-gray-300"
                            value={dataValidade}
                            onChange={(e) => setDataValidade(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
                {onClose && (
                    <Button 
                        type="button" 
                        onClick={onClose}
                        className="flex-1 h-11 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors text-sm font-semibold" 
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                )}
                <Button 
                    type="submit" 
                    className={`${onClose ? 'flex-1' : 'w-full'} h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm font-semibold shadow-sm disabled:opacity-60`} 
                    disabled={loading}
                >
                    {loading ? "Salvando..." : itemEditando ? "Atualizar Lote" : "Registrar Entrada"}
                </Button>
            </div>
        </form>
    );
}