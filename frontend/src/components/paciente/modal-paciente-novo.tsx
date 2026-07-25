"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
    createPacienteAction,
    getMicroareasAction,
    CreatePacienteData,
    Microarea
} from "@/actions/paciente";

const maskCPF = (value: string) => {
    return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
};

const maskPhone = (value: string) => {
    return value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
};

const maskCNS = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 15);
};

interface ModalCadastroPacienteProps {
    onClose?: () => void;
}

export default function ModalCadastroPaciente({ onClose }: ModalCadastroPacienteProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState(false);
    const [microareas, setMicroareas] = useState<Microarea[]>([]);

    const [formData, setFormData] = useState({
        nome: "",
        data_nascimento: "",
        cpf: "",
        cns: "",
        telefone: "",
        endereco: "",
        condicao: "",
        sexo: "",
        microarea_id: "",
    });

    useEffect(() => {
        const fetchMicroareas = async () => {
            const result = await getMicroareasAction();
            if (result.data) {
                setMicroareas(result.data);
            } else {
                console.error("Não foi possível carregar as microáreas:", result.error);
            }
        };

        fetchMicroareas();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "cpf") formattedValue = maskCPF(value);
        if (name === "telefone") formattedValue = maskPhone(value);
        if (name === "cns") formattedValue = maskCNS(value);

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSucesso(false);
        setLoading(true);

        const payload: CreatePacienteData = {
            ...formData,
            data_nascimento: new Date(formData.data_nascimento).toISOString(),
            cpf: formData.cpf.replace(/\D/g, ""),
            cns: formData.cns.replace(/\D/g, ""),
            telefone: formData.telefone.replace(/\D/g, "")
        };

        try {
            const result = await createPacienteAction(payload);

            if (result.error) {
                const errorMsg = Array.isArray(result.error) ? result.error.join(', ') : result.error;
                setError(errorMsg);
            } else {
                setSucesso(true);
                setTimeout(() => {
                    if (onClose) {
                        onClose();
                    }
                    router.push("/paciente");
                }, 1500);
            }
        } catch (err) {
            setError("Ocorreu um erro inesperado ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white grid gap-y-5">
            {/* Header */}
            <div className="flex flex-col gap-2 pb-2 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-slate-900">
                    Novo Paciente
                </h2>
                <p className="text-sm text-gray-500">
                    Preencha as informações do paciente conforme os dados solicitados.
                </p>
            </div>

            {/* Mensagens */}
            {error && (
                <div className="p-1 rounded-md bg-red-50 border border-red-200 flex gap-2">
                    <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
            )}
            {sucesso && (
                <div className="p-1 rounded-md bg-green-50 border border-green-200 flex gap-2">
                    <span className="text-green-700 text-sm font-medium">✓ Paciente cadastrado com sucesso!</span>
                </div>
            )}

            {/* Seção Dados Pessoais */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">Dados Pessoais</h3>

                <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-semibold text-slate-700">
                        Nome Completo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="nome"
                        name="nome"
                        placeholder="Digite o nome completo do paciente"
                        required
                        value={formData.nome}
                        onChange={handleChange}
                        className="h-10 text-sm rounded-lg border-gray-300 placeholder:text-gray-400"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* CPF */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                            CPF <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="cpf"
                            name="cpf"
                            placeholder="000.000.000-00"
                            required
                            value={formData.cpf}
                            onChange={handleChange}
                            className="h-10 text-sm rounded-lg border-gray-300 placeholder:text-gray-400"
                        />
                    </div>

                    {/* CNS */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                            CNS <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="cns"
                            name="cns"
                            placeholder="Cartão Nacional de Saúde (15 dígitos)"
                            required
                            value={formData.cns}
                            onChange={handleChange}
                            className="h-10 text-sm rounded-lg border-gray-300 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Data de Nascimento */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                            Data de Nascimento <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="data_nascimento"
                            name="data_nascimento"
                            type="date"
                            required
                            value={formData.data_nascimento}
                            onChange={handleChange}
                            className="h-10 text-sm rounded-lg border-gray-300 text-gray-700"
                        />
                    </div>

                    {/* Sexo */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                            Sexo <span className="text-red-500">*</span>
                        </Label>
                        <select
                            id="sexo"
                            name="sexo"
                            required
                            value={formData.sexo}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
                        >
                            <option value="" disabled>Selecione o sexo</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Seção Contato */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">Contato</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Telefone */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                            Telefone <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="telefone"
                            name="telefone"
                            required
                            placeholder="(00) 00000-0000"
                            value={formData.telefone}
                            onChange={handleChange}
                            className="h-10 text-sm rounded-lg border-gray-300 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Endereço */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                            Endereço Completo <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="endereco"
                            name="endereco"
                            required
                            placeholder="Rua, Número, Bairro, CEP"
                            value={formData.endereco}
                            onChange={handleChange}
                            className="h-10 text-sm rounded-lg border-gray-300 placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Seção Saúde */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">Informações de Saúde</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Condição de Saúde */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                            Condição de Saúde <span className="text-red-500">*</span>
                        </Label>
                        <select
                            id="condicao"
                            name="condicao"
                            required
                            value={formData.condicao}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
                        >
                            <option value="" disabled>Selecione a condição primária</option>
                            <option value="Nenhuma">Nenhuma</option>
                            <option value="Hipertensão">Hipertensão</option>
                            <option value="Diabetes">Diabetes</option>
                            <option value="Hipertensão e Diabetes">Hipertensão e Diabetes</option>
                        </select>
                    </div>

                    {/* Microárea */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">
                            Microárea de Abrangência <span className="text-red-500">*</span>
                        </Label>
                        <select
                            id="microarea_id"
                            name="microarea_id"
                            required
                            value={formData.microarea_id}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
                        >
                            <option value="" disabled>Selecione a microárea</option>
                            {microareas.map((micro) => (
                                <option key={micro.id} value={micro.id}>
                                    {micro.nome}
                                </option>
                            ))}
                        </select>
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
                    {loading ? "Salvando..." : "Salvar Paciente"}
                </Button>
            </div>
        </form>
    );
}