"use client";
import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Plus, X } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import Link from "next/link";
import { DataTable } from "@/components/paciente/data-table";
import { columns } from "@/components/paciente/columns";
import { Paciente } from "@/types/paciente";
import ModalCadastroPaciente from "@/components/paciente/modal-paciente-novo";

interface PacienteClientProps {
    pacientesIniciais: Paciente[];
}

export default function PacienteClient({ pacientesIniciais }: PacienteClientProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("Nome");
    const [pacientesFiltrados, setPacientesFiltrados] = useState<Paciente[]>(pacientesIniciais);
    const [hasSearched, setHasSearched] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleAbrirModal = () => {
        setIsModalOpen(true);
    };

    const handleFecharModal = () => {
        setIsModalOpen(false);
    }

    return (
        <main className='sm:ml-56 min-h-screen bg-white'>
            {/* CABEÇALHO */}
            <div className='relative flex items-center bg-gray-50 border-b border-gray-200 p-4 h-16'>
                <Sidebar />
                <h1 className='text-2xl font-semibold text-[#003967] whitespace-nowrap'>Pacientes</h1>
            </div>

            <div className='relative flex flex-col p-4 min-h-fit'>
                {/* SEARCH E ÍCONES */}
                <section className="w-full flex gap-2">
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
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </Button>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="absolute top-12 left-0 z-50 flex flex-col w-full min-w-[110px] bg-white border border-blue-100 rounded-lg shadow-lg">
                                    {['Nome', 'CPF', 'CNS'].map(type => (
                                        <button
                                            key={type}
                                            className={`px-4 py-2.5 text-sm text-left transition-colors hover:bg-blue-50 ${searchType === type ? 'bg-blue-50 text-[#1976d2] font-semibold' : 'text-gray-700 font-medium'
                                                }`}
                                            onClick={() => { setSearchType(type); setOpen(false); }}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                        </div>

                        <Button
                            onClick={handleSearch}
                            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-transparent border-[#1976d2] text-[#1976d2] hover:bg-blue-50"
                        >
                            <Search />
                        </Button>

                        <Button
                            onClick={handleAbrirModal}
                            className="bg-[#1976d2] hover:bg-[#1565c0] text-white h-11 px-6 rounded-lg font-medium flex gap-2 items-center w-full md:w-auto shadow-sm transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Novo Paciente
                        </Button>
                    </Field>
                </section>

                {/* RESULTADO DA BUSCA */}
                <div className="mt-8 w-full">
                    {pacientesFiltrados.length > 0 ? (
                        <DataTable data={pacientesFiltrados} columns={columns} />
                    ) : hasSearched && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 font-medium">
                            Nenhum paciente encontrado para esta busca.
                        </div>
                    )}
                </div>
                {isModalOpen && (
                    <div
                        className="fixed inset-0  z-50 flex items-center justify-center backdrop-blur-sm p-4"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                        onClick={handleFecharModal}
                    >
                        <div
                            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={handleFecharModal}
                                className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-7">
                                <ModalCadastroPaciente
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}