"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
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

export default function CadastroPaciente() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                alert("Paciente cadastrado com sucesso!");
                router.push("/paciente");
            }
        } catch (err) {
            setError("Ocorreu um erro inesperado ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="sm:ml-56 min-h-screen bg-gray-50 flex flex-col">
            <div className="relative flex items-center bg-white border-b border-gray-200 p-4 h-16 shrink-0 shadow-sm">
                <Sidebar />
                <h1 className="text-2xl font-semibold text-[#003967] whitespace-nowrap">Cadastro de Paciente</h1>
            </div>

            <div className="p-4 md:p-8 flex-1">
                <div className="max-w-4xl mx-auto">
                    <Card className="shadow-lg border-none ring-1 ring-gray-100 overflow-hidden bg-white rounded-md">
                        <div className="h-2 w-full bg-[#1976d2]"></div>
                        <CardHeader className="pb-6 pt-6">
                            <CardTitle className="text-[#003967] text-2xl font-bold">Novo Paciente</CardTitle>
                            <CardDescription className="text-base text-gray-500 mt-2">
                                Preencha as informações do paciente conforme os dados solicitados.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Exibição de Erros do Backend */}
                                {error && (
                                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    {/* Nome */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="nome" className="text-gray-800 font-medium">Nome Completo <span className="text-red-500">*</span></Label>
                                        <Input id="nome" name="nome" placeholder="Digite o nome completo do paciente" required value={formData.nome} onChange={handleChange} className="border-gray-300 h-11 focus-visible:ring-[#1976d2]" />
                                    </div>

                                    {/* CPF */}
                                    <div className="space-y-2">
                                        <Label htmlFor="cpf" className="text-gray-800 font-medium">CPF <span className="text-red-500">*</span></Label>
                                        <Input id="cpf" name="cpf" placeholder="000.000.000-00" required value={formData.cpf} onChange={handleChange} className="border-gray-300 h-11 focus-visible:ring-[#1976d2]" />
                                    </div>

                                    {/* CNS */}
                                    <div className="space-y-2">
                                        <Label htmlFor="cns" className="text-gray-800 font-medium">CNS <span className="text-red-500">*</span></Label>
                                        <Input id="cns" name="cns" placeholder="Cartão Nacional de Saúde (15 dígitos)" required value={formData.cns} onChange={handleChange} className="border-gray-300 h-11 focus-visible:ring-[#1976d2]" />
                                    </div>

                                    {/* Data de Nascimento */}
                                    <div className="space-y-2">
                                        <Label htmlFor="data_nascimento" className="text-gray-800 font-medium">Data de Nascimento <span className="text-red-500">*</span></Label>
                                        <Input id="data_nascimento" name="data_nascimento" type="date" required value={formData.data_nascimento} onChange={handleChange} className="border-gray-300 h-11 focus-visible:ring-[#1976d2] text-gray-700" />
                                    </div>

                                    {/* Telefone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="telefone" className="text-gray-800 font-medium">Telefone <span className="text-red-500">*</span></Label>
                                        <Input id="telefone" name="telefone" required placeholder="(00) 00000-0000" value={formData.telefone} onChange={handleChange} className="border-gray-300 h-11 focus-visible:ring-[#1976d2]" />
                                    </div>

                                    {/* Sexo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="sexo" className="text-gray-800 font-medium">Sexo <span className="text-red-500">*</span></Label>
                                        <select
                                            id="sexo"
                                            name="sexo"
                                            required
                                            value={formData.sexo}
                                            onChange={handleChange}
                                            className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1976d2] focus-visible:ring-offset-2 text-gray-700"
                                        >
                                            <option value="" disabled>Selecione o sexo</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>

                                    {/* Condição */}
                                    <div className="space-y-2">
                                        <Label htmlFor="condicao" className="text-gray-800 font-medium">Condição de Saúde <span className="text-red-500">*</span></Label>
                                        <select
                                            id="condicao"
                                            name="condicao"
                                            required
                                            value={formData.condicao}
                                            onChange={handleChange}
                                            className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1976d2] focus-visible:ring-offset-2 text-gray-700"
                                        >
                                            <option value="" disabled>Selecione a condição primária</option>
                                            <option value="Nenhuma">Nenhuma</option>
                                            <option value="Hipertensão">Hipertensão</option>
                                            <option value="Diabetes">Diabetes</option>
                                            <option value="Hipertensão e Diabetes">Hipertensão e Diabetes</option>
                                        </select>
                                    </div>

                                    {/* Endereço */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="endereco" className="text-gray-800 font-medium">Endereço Completo <span className="text-red-500">*</span></Label>
                                        <Input id="endereco" name="endereco" required placeholder="Rua, Número, Complemento, Bairro, CEP" value={formData.endereco} onChange={handleChange} className="border-gray-300 h-11 focus-visible:ring-[#1976d2]" />
                                    </div>

                                    {/* Microárea: SELECT DINÂMICO */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="microarea_id" className="text-gray-800 font-medium">
                                            Microárea de Abrangência <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="microarea_id"
                                            name="microarea_id"
                                            required
                                            value={formData.microarea_id}
                                            onChange={handleChange}
                                            className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1976d2] focus-visible:ring-offset-2 text-gray-700"
                                        >
                                            <option value="" disabled>Selecione a microárea do paciente</option>
                                            {microareas.map((micro) => (
                                                <option key={micro.id} value={micro.id}>
                                                    {micro.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Botões */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 mt-8 border-t border-gray-200">
                                    <Button type="button" variant="outline" asChild disabled={loading} className="border-gray-300 text-gray-700 hover:bg-gray-100 h-11 px-8 text-base font-medium">
                                        <Link href="/paciente">Cancelar</Link>
                                    </Button>
                                    <Button type="submit" disabled={loading} className="bg-[#1976d2] hover:bg-[#1565c0] text-white h-11 px-8 text-base font-medium shadow-sm transition-colors">
                                        {loading ? "Salvando..." : "Salvar Paciente"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}