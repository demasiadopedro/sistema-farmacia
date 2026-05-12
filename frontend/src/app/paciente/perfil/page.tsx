"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Phone, Activity, PillBottle, CalendarCheck2, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock detalhado baseado no nome do paciente (já que a busca será pelo nome)
const patientDetailsDB: Record<string, any> = {
    "João da Silva": {
        nome: "João da Silva",
        cpf: "111.111.111-11",
        cns: "123456789012345",
        idade: 68,
        endereco: "Rua das Flores, 123, Bairro Centro, Cidade - UF",
        telefone: "(11) 98765-4321",
        condicao: "Hipertensão e Diabetes",
        remedios: [
            { nome: "Losartana 50mg", dosagem: "Tomar 1x ao dia (manhã)" },
            { nome: "Metformina 850mg", dosagem: "Tomar 2x ao dia (após almoço e jantar)" }
        ],
        ultimaRetirada: "10/05/2026",
        proximaRetirada: "10/06/2026",
    },
    "Maria Oliveira": {
        nome: "Maria Oliveira",
        cpf: "222.222.222-22",
        cns: "987654321098765",
        idade: 55,
        endereco: "Avenida Brasil, 456, Bloco B - Apt 12, Bairro Nobre - UF",
        telefone: "(11) 91234-5678",
        condicao: "Diabetes",
        remedios: [
            { nome: "Glibenclamida 5mg", dosagem: "Tomar 1x ao dia (antes do café)" }
        ],
        ultimaRetirada: "25/04/2026",
        proximaRetirada: "25/05/2026",
    }
};

function PerfilContent() {
    const searchParams = useSearchParams();
    const nomeParam = searchParams.get("nome");

    // Buscar os detalhes do paciente pelo nome, ou gerar um "mock padrão" caso seja um nome novo
    const paciente = nomeParam && patientDetailsDB[nomeParam]
        ? patientDetailsDB[nomeParam]
        : {
            nome: nomeParam || "Paciente Não Identificado",
            cpf: "000.000.000-00",
            cns: "000000000000000",
            idade: 40,
            endereco: "Endereço não cadastrado",
            telefone: "(00) 00000-0000",
            condicao: "Não informada",
            remedios: [],
            ultimaRetirada: "Nenhuma retirada registrada",
            proximaRetirada: "-",
        };

    if (!nomeParam) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
                <p className="text-gray-500 mb-4">Nenhum paciente selecionado.</p>
                <Button asChild className="bg-[#1976d2] hover:bg-[#1565c0]">
                    <Link href="/paciente">Voltar para busca</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 flex-1 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header de Ação */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild className="rounded-full border-[#1976d2] text-[#1976d2] hover:bg-blue-50">
                        <Link href="/paciente">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h2 className="text-2xl font-bold text-[#003967]">Perfil do Paciente</h2>
                </div>
                <Button className="bg-[#1976d2] hover:bg-[#1565c0] rounded-lg">
                    Nova Retirada
                </Button>
            </div>

            {/* Layout em Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Coluna Principal - Dados Pessoais */}
                <Card className="lg:col-span-1 shadow-md border-none ring-1 ring-gray-100 bg-white overflow-hidden">
                    <div className="h-2 w-full bg-[#1976d2]"></div>
                    <CardHeader className="pb-4 pt-6 flex flex-col items-center text-center border-b border-gray-100">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#1976d2] shadow-sm">
                            <User className="w-12 h-12" />
                        </div>
                        <CardTitle className="text-[#003967] text-xl font-bold uppercase tracking-wide">{paciente.nome}</CardTitle>
                        <p className="text-sm font-medium text-gray-500 mt-1">{paciente.idade} anos</p>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Documentos</span>
                            <p className="text-sm text-gray-700"><span className="font-medium">CPF:</span> {paciente.cpf}</p>
                            <p className="text-sm text-gray-700"><span className="font-medium">CNS:</span> {paciente.cns}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1"><MapPin className="w-3 h-3" /> Endereço</span>
                            <p className="text-sm text-gray-700 leading-relaxed">{paciente.endereco}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Phone className="w-3 h-3" /> Contato</span>
                            <p className="text-sm text-gray-700">{paciente.telefone}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Coluna Secundária - Clínico e Histórico */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Informações Clínicas */}
                    <Card className="shadow-md border-none ring-1 ring-gray-100 bg-white">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="text-lg font-bold text-[#003967] flex items-center gap-2">
                                <Activity className="w-5 h-5 text-[#1976d2]" />
                                Informações Clínicas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5">
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Condição Diagnosticada</h3>
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 text-red-700 font-medium text-sm border border-red-100">
                                    {paciente.condicao}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <PillBottle className="w-4 h-4" />
                                    Tratamento Contínuo
                                </h3>
                                {paciente.remedios.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {paciente.remedios.map((remedio: any, index: number) => (
                                            <div key={index} className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg flex flex-col gap-1">
                                                <span className="font-semibold text-blue-900 text-sm">{remedio.nome}</span>
                                                <span className="text-xs text-blue-700/80">{remedio.dosagem}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Nenhum medicamento registrado.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Histórico de Dispensação */}
                    <Card className="shadow-md border-none ring-1 ring-gray-100 bg-white">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="text-lg font-bold text-[#003967] flex items-center gap-2">
                                <CalendarCheck2 className="w-5 h-5 text-[#1976d2]" />
                                Histórico de Dispensação
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                                <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-1 justify-center">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Última Retirada</span>
                                    {paciente.ultimaRetirada !== "Nenhuma retirada registrada" ? (
                                        <span className="text-lg font-bold text-gray-800">{paciente.ultimaRetirada}</span>
                                    ) : (
                                        <span className="text-sm font-medium text-gray-600">{paciente.ultimaRetirada}</span>
                                    )}
                                </div>
                                <div className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col gap-1 justify-center">
                                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Próxima Retirada Prevista</span>
                                    <span className="text-lg font-bold text-[#1976d2]">{paciente.proximaRetirada}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function PerfilPaciente() {
    return (
        <main className="sm:ml-56 min-h-screen bg-gray-50 flex flex-col">
            <div className="relative flex items-center bg-white border-b border-gray-200 p-4 h-16 shrink-0 shadow-sm z-10">
                <Sidebar />
                <h1 className="text-2xl font-semibold text-[#003967] whitespace-nowrap tracking-tight">Paciente</h1>
            </div>


            <Suspense fallback={<div className="p-8 text-center text-gray-500">Carregando perfil...</div>}>
                <PerfilContent />
            </Suspense>
        </main>
    );
}
