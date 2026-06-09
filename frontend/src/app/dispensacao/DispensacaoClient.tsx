"use client";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, ClipboardList, Pill, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { registrarDispensacaoAction } from "../../actions/dispensacao";

const viasAdministracao = [
  "Oral", "Injetável", "Sublingual", "Tópica",
  "Inalatória", "Vaginal", "Retal", "Ocular", "Nasal",
];

export interface Paciente {
  id: string;
  nome: string | null;
  cpf: string;
}

export interface MedicamentoEstoque {
  id: string;
  nome: string;
  quantidadeTotal: number;
}

interface DispensacaoClientProps {
  pacientes: Paciente[];
  medicamentos: MedicamentoEstoque[];
}

export default function DispensacaoClient({ pacientes = [], medicamentos = [] }: DispensacaoClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usoContinuo, setUsoContinuo] = useState(false);
  const [step, setStep] = useState<"prescricao" | "dispensacao" | "sucesso">("prescricao");

  const [buscaPaciente, setBuscaPaciente] = useState("");
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const dropdownPacRef = useRef<HTMLDivElement>(null);

  const [buscaMedicamento, setBuscaMedicamento] = useState("");
  const [dropdownMedAberto, setDropdownMedAberto] = useState(false);
  const dropdownMedRef = useRef<HTMLDivElement>(null);

  const [prescricao, setPrescricao] = useState({
    id_paciente: "",
    id_medicamento: "",
    medicamentoNome: "", 
    viaAdministracao: "",
    quantidade: "",
  });

  const [dispensacao, setDispensacao] = useState({
    dataEntrega: new Date().toISOString().split('T')[0],
    quantidadeEntregue: "",
    proximaRetirada: "",
  });

  const pacientesFiltrados = pacientes.filter(p => 
    p.nome?.toLowerCase().includes(buscaPaciente.toLowerCase()) || 
    p.cpf.includes(buscaPaciente)
  );

  const medicamentosFiltrados = medicamentos.filter(m =>
    m.nome.toLowerCase().includes(buscaMedicamento.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownPacRef.current && !dropdownPacRef.current.contains(event.target as Node)) {
        setDropdownAberto(false);
      }
      if (dropdownMedRef.current && !dropdownMedRef.current.contains(event.target as Node)) {
        setDropdownMedAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handlePrescricaoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prescricao.id_paciente || !prescricao.id_medicamento) {
        setError("Por favor, selecione um paciente e um medicamento válidos da lista.");
        return;
    }
    setStep("dispensacao");
  }

  async function handleDispensacaoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("id_paciente", prescricao.id_paciente);
    formData.append("id_medicamento", prescricao.id_medicamento);
    formData.append("via_administracao", prescricao.viaAdministracao);
    formData.append("quantidade_receitada", prescricao.quantidade);
    formData.append("uso_continuo", usoContinuo.toString());
    formData.append("quantidade_entregue", dispensacao.quantidadeEntregue);
    formData.append("proxima_retirada", dispensacao.proximaRetirada);

    try {
      const result = await registrarDispensacaoAction(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        setStep("sucesso");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="sm:ml-56 min-h-screen bg-white">
      <div className='relative flex items-center bg-gray-50 border-b border-gray-200 p-4 h-16'>
        <Sidebar />
        <h1 className="text-xl font-semibold text-[#003967] whitespace-nowrap">
          Dispensação de Medicamentos
        </h1>
      </div>

      <div className="flex items-center gap-2 px-6 py-5">
        <div className={`flex items-center gap-2 text-sm font-medium ${step === "prescricao" ? "text-[#1976d2]" : "text-green-600"}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${step === "prescricao" ? "bg-[#1976d2]" : "bg-green-500"}`}>
            {step === "prescricao" ? "1" : <CheckCircle2 className="w-4 h-4" />}
          </div>
          Prescrição
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <div className={`flex items-center gap-2 text-sm font-medium ${step === "dispensacao" ? "text-[#1976d2]" : step === "sucesso" ? "text-green-600" : "text-gray-400"}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${step === "dispensacao" ? "bg-[#1976d2]" : step === "sucesso" ? "bg-green-500" : "bg-gray-300"}`}>
            {step === "sucesso" ? <CheckCircle2 className="w-4 h-4" /> : "2"}
          </div>
          Dispensação
        </div>
      </div>

      <div className="px-6 pb-10 max-w-2xl">
        {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                {error}
            </div>
        )}

        {step === "prescricao" && (
          <Card className="rounded-xl border border-gray-100">
            <CardHeader className="pb-2 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-[#003967] text-lg font-semibold">
                <ClipboardList className="w-5 h-5 text-[#1976d2]" />
                Adicionar Prescrição
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-5">
              <form onSubmit={handlePrescricaoSubmit} className="flex flex-col gap-5">
                
                <div className="flex flex-col gap-1.5 relative" ref={dropdownPacRef}>
                  <Label className="text-sm font-medium text-[#003967]">Paciente</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      required={!prescricao.id_paciente}
                      placeholder="Digite o nome ou CPF para buscar..."
                      className="pl-10 rounded-lg border-gray-300 h-10 w-full"
                      value={buscaPaciente}
                      onChange={(e) => {
                        setBuscaPaciente(e.target.value);
                        setDropdownAberto(true);
                        if (prescricao.id_paciente) {
                            setPrescricao(p => ({ ...p, id_paciente: "" }));
                        }
                      }}
                      onFocus={() => setDropdownAberto(true)}
                    />
                  </div>

                  {dropdownAberto && buscaPaciente.length > 0 && (
                    <ul className="absolute z-10 top-[70px] w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {pacientesFiltrados.length > 0 ? (
                        pacientesFiltrados.map((paciente) => (
                          <li
                            key={paciente.id}
                            onClick={() => {
                              setPrescricao(p => ({ ...p, id_paciente: paciente.id }));
                              setBuscaPaciente(`${paciente.nome || "Sem Nome"} (CPF: ${paciente.cpf})`);
                              setDropdownAberto(false);
                            }}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                          >
                            <p className="text-sm font-medium text-[#003967]">{paciente.nome || "Sem Nome"}</p>
                            <p className="text-xs text-gray-500">CPF: {paciente.cpf}</p>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-3 text-sm text-gray-500 text-center">
                          Nenhum paciente encontrado.
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 relative" ref={dropdownMedRef}>
                  <Label className="text-sm font-medium text-[#003967]">Medicamento</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      required={!prescricao.id_medicamento}
                      placeholder="Buscar medicamento em estoque..."
                      className="pl-10 rounded-lg border-gray-300 h-10 w-full"
                      value={buscaMedicamento}
                      onChange={(e) => {
                        setBuscaMedicamento(e.target.value);
                        setDropdownMedAberto(true);
                        if (prescricao.id_medicamento) {
                            setPrescricao(p => ({ ...p, id_medicamento: "", medicamentoNome: "" }));
                        }
                      }}
                      onFocus={() => setDropdownMedAberto(true)}
                    />
                  </div>

                  {dropdownMedAberto && buscaMedicamento.length > 0 && (
                    <ul className="absolute z-10 top-[70px] w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {medicamentosFiltrados.length > 0 ? (
                        medicamentosFiltrados.map((med) => (
                          <li
                            key={med.id}
                            onClick={() => {
                              setPrescricao(p => ({ ...p, id_medicamento: med.id, medicamentoNome: med.nome }));
                              setBuscaMedicamento(med.nome);
                              setDropdownMedAberto(false);
                            }}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                          >
                            <p className="text-sm font-medium text-[#003967]">{med.nome}</p>
                            <p className="text-xs text-green-600 font-medium">Estoque total: {med.quantidadeTotal} unidades</p>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-3 text-sm text-gray-500 text-center">
                          Medicamento indisponível no estoque.
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-[#003967]">Via de Administração</Label>
                  <select
                    required
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-[#1976d2]"
                    value={prescricao.viaAdministracao}
                    onChange={(e) => setPrescricao(p => ({ ...p, viaAdministracao: e.target.value }))}
                  >
                    <option value="">Selecione...</option>
                    {viasAdministracao.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-[#003967]">Quantidade Prescrita</Label>
                  <Input
                    required type="number" min={1} placeholder="Ex: 30"
                    className="rounded-lg border-gray-300 h-10"
                    value={prescricao.quantidade}
                    onChange={(e) => setPrescricao(p => ({ ...p, quantidade: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col gap-3 pt-1">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#003967]">Uso Contínuo</p>
                      <p className="text-xs text-gray-500">O paciente usa este medicamento de forma contínua?</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUsoContinuo((v) => !v)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${usoContinuo ? "bg-[#1976d2]" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${usoContinuo ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                </div>

                <Button type="submit" className="mt-2 bg-[#1976d2] hover:bg-[#1565c0] text-white rounded-lg h-10 text-base font-medium">
                  Avançar para Dispensação
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "dispensacao" && (
          <div className="flex flex-col gap-4">
            <Card className="rounded-xl border border-[#1976d2]/30 bg-[#e3f2fd] shadow-sm">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs font-semibold text-[#1976d2] uppercase tracking-wide mb-2">Prescrição selecionada</p>
                <div className="flex items-center gap-3">
                  <Pill className="w-5 h-5 text-[#1976d2]" />
                  <div>
                    <p className="text-sm font-semibold text-[#003967]">{prescricao.medicamentoNome}</p>
                    <p className="text-xs text-gray-600">{prescricao.viaAdministracao} · {prescricao.quantidade} unidades · {usoContinuo ? " Uso contínuo" : " Uso não contínuo"}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Para: {buscaPaciente}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-gray-200 shadow-sm">
              <CardHeader className="pb-2 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-[#003967] text-lg font-semibold">
                  <ClipboardList className="w-5 h-5 text-[#1976d2]" /> Dados da Dispensação
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-5">
                <form onSubmit={handleDispensacaoSubmit} className="flex flex-col gap-5">
                  
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-[#003967]">Data de Entrega</Label>
                    <Input
                      required type="date" className="rounded-lg border-gray-300 h-10"
                      value={dispensacao.dataEntrega}
                      onChange={(e) => setDispensacao(d => ({ ...d, dataEntrega: e.target.value }))}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-[#003967]">Quantidade Entregue</Label>
                    <Input
                      required type="number" min={1} placeholder="Ex: 30"
                      className="rounded-lg border-gray-300 h-10"
                      value={dispensacao.quantidadeEntregue}
                      onChange={(e) => setDispensacao(d => ({ ...d, quantidadeEntregue: e.target.value }))}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-[#003967]">Estimativa da Próxima Retirada</Label>
                    <Input
                      type="date" className="rounded-lg border-gray-300 h-10"
                      value={dispensacao.proximaRetirada}
                      onChange={(e) => setDispensacao(d => ({ ...d, proximaRetirada: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <Button type="button" variant="outline" onClick={() => setStep("prescricao")} className="flex-1 rounded-lg h-10 border-gray-300 text-gray-600">
                      Voltar
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1 bg-[#1976d2] hover:bg-[#1565c0] text-white rounded-lg h-10 text-base font-medium">
                      {loading ? "Processando..." : "Confirmar Dispensação"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "sucesso" && ( 
            <Card className="rounded-xl border border-green-200 shadow-sm">
                <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-9 h-9 text-green-500"/>
                    </div>

                    <div>
                        <p className="text-lg font-semibold text-[#003967]">Dispensação registrada</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {prescricao.medicamentoNome} dispensado com sucesso!
                        </p>
                        <p className="text-sm mt-2">
                            Próxima retirada estimada: <span className="font-semibold">
                                {dispensacao.proximaRetirada ? new Date(dispensacao.proximaRetirada + "T00:00:00").toLocaleDateString("pt-BR") : "-"}
                            </span>
                        </p>
                    </div>

                    <Button 
                    onClick={() => {
                        setStep("prescricao");
                        setPrescricao({ id_paciente: "", id_medicamento: "", medicamentoNome: "", viaAdministracao: "", quantidade: ""});
                        setDispensacao({ dataEntrega: new Date().toISOString().split('T')[0], quantidadeEntregue: "", proximaRetirada: "" });
                        setUsoContinuo(false);
                        setBuscaPaciente("");
                        setBuscaMedicamento("");
                    }}
                        className="mt-2 bg-[#1976d2] hover:bg-[#1565c0] text-white rounded-lg h-10 px-8"    
                    >
                        Nova Dispensação
                    </Button>
                </CardContent>
            </Card>
        )}
      </div>
    </main>
  );
}