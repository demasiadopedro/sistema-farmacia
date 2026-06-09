"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
interface DispensacaoDb {
    id: string;
    data_entrega: string;
    proxima_retirada: string | null;
}
export interface PacienteData {
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

}

interface PacienteClientProps {
    pacientesIniciais: PacienteData[];
}

function corVencimento(dataVencimento: string | null | undefined) {
    if (!dataVencimento || dataVencimento === "-") {
        return 'border-gray-300 hover:border-gray-400 bg-gray-300'; // adicionei bg- caso use no Perfil
    }

    const hoje = new Date();
    const vencimento = new Date(dataVencimento);

    // Evita crash se a data vier zuada
    if (isNaN(vencimento.getTime())) {
        return 'border-gray-300 hover:border-gray-400 bg-gray-300';
    }

    // O SEGREDO: Zera as horas para ignorar o fuso horário e comparar só o dia
    hoje.setHours(0, 0, 0, 0);
    vencimento.setHours(0, 0, 0, 0);

    const diferencaMilisegundos = vencimento.getTime() - hoje.getTime();
    const diferencaDias = Math.ceil(diferencaMilisegundos / (1000 * 3600 * 24));

    if (diferencaDias < 0) {
        return 'border-red-500 hover:border-red-600 bg-red-500';
    }

    if (diferencaDias <= 3) {
        return 'border-yellow-500 hover:border-yellow-600 bg-yellow-500';
    }

    return 'border-green-500 hover:border-green-600 bg-green-500';
}

export default function PacienteClient({ pacientesIniciais }: PacienteClientProps) {

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("Nome");

    const [pacientesFiltrados, setPacientesFiltrados] = useState<PacienteData[]>(pacientesIniciais);
    const [hasSearched, setHasSearched] = useState(false);

    function handleSearch() {
        setHasSearched(true);
        if (!searchTerm.trim()) {
            setPacientesFiltrados(pacientesIniciais);
            return;
        }

        const filtrados = pacientesIniciais.filter(p => {
            if (searchType === "Nome") return p.nome?.toLowerCase().includes(searchTerm.toLowerCase());
            if (searchType === "CPF") return p.cpf?.replace(/\D/g, '') === searchTerm.replace(/\D/g, '');
            if (searchType === "CNS") return p.cns?.replace(/\D/g, '') === searchTerm.replace(/\D/g, '');
            return false;
        });

        setPacientesFiltrados(filtrados);
    }

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    return (
        <main className='sm:ml-56 min-h-screen bg-white'>
            {/* CABEÇALHO */}
            <div className='relative flex items-center bg-gray-50 border-b border-gray-200 p-4 h-16'>
                <Sidebar />
                <h1 className='text-2xl font-semibold text-[#003967] whitespace-nowrap'>Pacientes</h1>
            </div>

            <div className='relative flex flex-col p-4 min-h-fit'>
                {/* SEARCH E ÍCONES */}
                <section className="w-full w-px-1/2 flex">
                    <Field orientation={"horizontal"}>
                        <Input
                            type="search"
                            className="rounded-lg h-10 w-64 border-[#1976d2]"
                            placeholder={`Buscar por ${searchType}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />

                        <div ref={ref}>
                            <Collapsible open={open} onOpenChange={setOpen} className="relative items-center">
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-10 px-4 flex gap-2 items-center justify-between border-[#1976d2] text-[#1976d2] hover:bg-blue-50 bg-transparent rounded-lg min-w-[110px]"
                                    >
                                        <span className="font-medium text-sm">{searchType}</span>
                                        <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                    </Button>
                                </CollapsibleTrigger>

                                {/* Menu suspenso */}
                                <CollapsibleContent className="absolute top-12 left-0 z-50 flex flex-col w-full min-w-[110px] bg-white border border-blue-100 rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        className={`px-4 py-2.5 text-sm text-left transition-colors hover:bg-blue-50 ${searchType === 'Nome' ? 'bg-blue-50 text-[#1976d2] font-semibold' : 'text-gray-700 font-medium'}`}
                                        onClick={() => { setSearchType("Nome"); setOpen(false); }}
                                    >
                                        Nome
                                    </button>
                                    <button
                                        className={`px-4 py-2.5 text-sm text-left transition-colors hover:bg-blue-50 ${searchType === 'CPF' ? 'bg-blue-50 text-[#1976d2] font-semibold' : 'text-gray-700 font-medium'}`}
                                        onClick={() => { setSearchType("CPF"); setOpen(false); }}
                                    >
                                        CPF
                                    </button>
                                    <button
                                        className={`px-4 py-2.5 text-sm text-left transition-colors hover:bg-blue-50 ${searchType === 'CNS' ? 'bg-blue-50 text-[#1976d2] font-semibold' : 'text-gray-700 font-medium'}`}
                                        onClick={() => { setSearchType("CNS"); setOpen(false); }}
                                    >
                                        CNS
                                    </button>
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="shrink-0 w-10 h-10 flex gap-4 items-center justify-center rounded-full bg-transparent border-[#1976d2] sm:bg-transparent text-[#1976d2] hover:bg-blue-50">
                            <Search />
                        </Button>
                        <Button variant="default" className="bg-[#1976d2] h-full text-white hover:bg-[#1565c0] rounded-lg">
                            <Link href="/paciente/cadastro" className="text-[18px] font-medium">Cadastrar Paciente</Link>
                        </Button>
                    </Field>

                </section>

                {/* RESULTADO DA BUSCA / LISTAGEM */}
                <div className="mt-8 w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {pacientesFiltrados.length > 0 ? (
                        pacientesFiltrados.map((paciente) => {
                            const listaDispensacoes = paciente.dispensacoes || [];    
                            const ultimaDispensacao = listaDispensacoes.length > 0
                                ? [...listaDispensacoes].sort((a, b) => new Date(b.data_entrega).getTime() - new Date(a.data_entrega).getTime())[0]
                                : null;

                            const corAlerta = corVencimento(ultimaDispensacao?.proxima_retirada);
                            return (
                                <Link key={paciente.id} href={`/paciente/perfil?id=${paciente.id}`} className="h-full block group">
                                    <Card className={`border-2 ${corAlerta} rounded-2xl shadow-md overflow-hidden w-full h-full bg-white transition-all duration-200 hover:shadow-lg  cursor-pointer group-hover:-translate-y-1`}>
                                        <CardContent className="p-5 flex flex-col gap-1">
                                            <div className="flex justify-between items-center w-full">
                                                <h2 className="flex-1 text-xl font-bold text-[#003967] uppercase group-hover:text-blue-700 transition-colors">{paciente.nome}</h2>
                                                <span className=" shrink-0  whitespace-nowrap text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Ver perfil</span>
                                            </div>
                                            <div className="mt-3 flex flex-col gap-1">
                                                <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">CPF:</span> {paciente.cpf}</p>
                                                <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">CNS:</span> {paciente.cns}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })
                    ) : (
                        hasSearched && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 font-medium">
                                Nenhum paciente encontrado para esta busca.
                            </div>
                        )
                    )}
                </div>
            </div>

        </main>
    )
}