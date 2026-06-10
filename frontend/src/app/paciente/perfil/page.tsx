import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Phone, Activity, PillBottle, CalendarCheck2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MedicamentoDb {
    nome: string | null;
    unidade_medida: string;
}

interface PrescricaoDb {
    id: string;
    uso_continuo: boolean;
    via_administracao: string | null;
    quantidade_receitada: number;
    medicamento: MedicamentoDb | null;
}

interface DispensacaoDb {
    id: string;
    data_entrega: string;
    proxima_retirada: string | null;
}

interface PacienteDb {
    id: string;
    nome: string | null;
    data_de_nascimento: string | null;
    cpf: string;
    cns: string;
    telefone: string | null;
    endereco: string | null;
    condicao: string | null;
    sexo: string | null;
    prescricaos?: PrescricaoDb[];
    dispensacoes?: DispensacaoDb[];
}

interface RemedioFormatado {
    nome: string;
    dosagem: string;
}

function calcularIdade(dataNascimento: string) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

function formatarData(dataIso: string | null | undefined): string {
    if (!dataIso) return "Não registrada";
    const data = new Date(dataIso);
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(data);
}
function corVencimento(dataVencimento: string | null | undefined) {
    if (!dataVencimento || dataVencimento === "-") {
        return 'border-gray-300 hover:border-gray-400 bg-gray-300';
    }

    const hoje = new Date();
    const vencimento = new Date(dataVencimento);

    if (isNaN(vencimento.getTime())) {
        return 'border-gray-300 hover:border-gray-400 bg-gray-300';
    }

    hoje.setHours(0, 0, 0, 0);
    vencimento.setHours(0, 0, 0, 0);

    const diferencaMilisegundos = vencimento.getTime() - hoje.getTime();
    const diferencaDias = Math.ceil(diferencaMilisegundos / (1000 * 3600 * 24))

    if (diferencaDias < 0) {
        return 'bg-red-500';
    }

    if (diferencaDias <= 3) {
        return 'bg-yellow-500';
    }

    return 'bg-green-500';
}
export default async function PerfilPaciente({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
    // 1. Log inicial para saber se a página ao menos abriu
    console.log("🔥 [TESTE] A página PerfilPaciente carregou!");

    const params = await searchParams;
    const idParam = params.id;

    console.log("[*] ID recebido da URL:", idParam);

    if (!idParam) {
        console.log("[*] ID vazio! Redirecionando...");
        redirect("/paciente");
    }

    const token = (await cookies()).get('session_token')?.value;

    let pacienteDb: PacienteDb | null = null;
    let responseOk = false;

    console.log(`[*] Iniciando fetch para o ID: ${idParam}`);

    try {
        const response = await fetch(`${process.env.URL_BACKEND}/pacientes/${idParam}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        });

        responseOk = response.ok;
        if (responseOk) {
            pacienteDb = await response.json();
        }
    } catch (error: unknown) {
        responseOk = false;
    }
    if (!responseOk || !pacienteDb) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <p className="text-[#003967] font-bold text-xl mb-4">Paciente não encontrado ou erro no servidor.</p>
                <Button asChild className="bg-[#1976d2] hover:bg-[#1565c0]">
                    <Link href="/paciente">Voltar para busca</Link>
                </Button>
            </div>
        );
    }

    const listaPrescricoes = pacienteDb.prescricaos || [];

    const mapaRemedios = new Map<string, RemedioFormatado>();

    listaPrescricoes.forEach((prescricao) => {
        const nomeMedicamento = prescricao.medicamento?.nome || 'Desconhecido';
        const unidade = prescricao.medicamento?.unidade_medida || 'S/R';
        const via = prescricao.via_administracao ? ` - Via: ${prescricao.via_administracao}` : "";

        mapaRemedios.set(nomeMedicamento, {
            nome: nomeMedicamento,
            dosagem: `${prescricao.quantidade_receitada} ${unidade}${via}`
        });
    });

    const remediosMapeados: RemedioFormatado[] = Array.from(mapaRemedios.values())

    console.log(pacienteDb)

    const listaDispensacoes = pacienteDb.dispensacoes || [];
    const ultimaDispensacao = listaDispensacoes.length > 0
        ? listaDispensacoes.sort((a, b) => new Date(b.data_entrega).getTime() - new Date(a.data_entrega).getTime())[0]
        : null;

    const paciente = {
        nome: pacienteDb.nome || "Não informado",
        cpf: pacienteDb.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") || "000.000.000-00",
        cns: pacienteDb.cns || "Não informado",
        idade: pacienteDb.data_de_nascimento ? calcularIdade(pacienteDb.data_de_nascimento) : "Idade não informada",
        endereco: pacienteDb.endereco || "Endereço não cadastrado",
        telefone: pacienteDb.telefone?.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") || "Não informado",
        condicao: pacienteDb.condicao || "Não informada",
        remedios: remediosMapeados,
        ultimaRetirada: ultimaDispensacao ? formatarData(ultimaDispensacao.data_entrega) : "Nenhuma retirada registrada",
        proximaRetirada: ultimaDispensacao && ultimaDispensacao.proxima_retirada ? formatarData(ultimaDispensacao.proxima_retirada) : "-",
    };
    const corRetirada = corVencimento(ultimaDispensacao?.proxima_retirada)

    return (
        <main className="sm:ml-56 min-h-screen bg-gray-50 flex flex-col">
            <div className="relative flex items-center bg-white border-b border-gray-200 p-4 h-16 shrink-0 shadow-sm z-10">
                <Sidebar />
                <h1 className="text-2xl font-semibold text-[#003967] whitespace-nowrap tracking-tight">Paciente</h1>
            </div>

            <div className="p-4 md:p-8 flex-1 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 shadow-md border-none ring-1 ring-gray-100 bg-white overflow-hidden">
                        <div className={`h-2 w-full ${corRetirada}`}></div>
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
                            <div className="flex flex-col gap-3 mt-2">
                                <div className="grid grid-cols-2 gap-1 items-center">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                        <Phone className="w-3 h-3" /> Contato:
                                    </span>
                                    <p className="text-sm text-gray-700">{paciente.telefone}</p>
                                </div>
                                <Link
                                    href={`https://wa.me/55${paciente.telefone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex justify-center items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-xl w-full transition-colors text-sm gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                                    </svg>
                                    Falar no WhatsApp
                                </Link>
                            </div>

                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 space-y-6">
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
                                            {paciente.remedios.map((remedio: RemedioFormatado, index: number) => (
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
        </main>
    );
}