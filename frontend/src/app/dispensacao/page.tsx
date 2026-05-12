"use client";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Pill,
} from "lucide-react";
import { useState } from "react";

const viasAdministracao = [
  "Oral",
  "Injetável",
  "Sublingual",
  "Tópica",
  "Inalatória",
  "Vaginal",
  "Retal",
  "Ocular",
  "Nasal",
];

export default function Dispensacao() {
  const [usoContinuo, setUsoContinuo] = useState(false);
  const [step, setStep] = useState<"prescricao" | "dispensacao" | "sucesso">(
    "prescricao",
  );

  const [prescricao, setPrescricao] = useState({
    pacienteType: "",
    pacienteValue: "",
    medicamento: "",
    viaAdministracao: "",
    quantidade: "",
  });

  const [dispensacao, setDispensacao] = useState({
    usuario: "",
    dataEntrega: "",
    quantidadeEntregue: "",
    proximaRetirada: "",
    crm: ""
  });

  function handlePrescricaoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("dispensacao");
  }

  function handleDispensacaoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("sucesso");
  }

  return (
    <main className="sm:ml-56 min-h-screen bg-white">
      {/* topbar */}
      <div className='relative flex items-center bg-gray-50 border-b border-gray-200 p-4 h-16'>
        <Sidebar />
        <h1 className="text-xl font-semibold text-[#003967] whitespace-nowrap">
          Dispensação de Medicamentos
        </h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 px-6 py-5">
        <div
          className={`flex items-center gap-2 text-sm font-medium ${step === "prescricao" ? "text-[#1976d2]" : "text-green-600"}`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white
                    ${step === "prescricao" ? "bg-[#1976d2]" : "bg-green-500"}`}
          >
            {step === "prescricao" ? "1" : <CheckCircle2 className="w-4 h-4" />}
          </div>
          Prescrição
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <div
          className={`flex items-center gap-2 text-sm font-medium ${step === "dispensacao" ? "text-[#1976d2]" : step === "sucesso" ? "text-green-600" : "text-gray-400"}`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white
                        ${step === "dispensacao" ? "bg-[#1976d2]" : step === "sucesso" ? "bg-green-500" : "bg-gray-300"}`}
          >
            {step === "sucesso" ? <CheckCircle2 className="w-4 h-4" /> : "2"}
          </div>
          Dispensação
        </div>
      </div>

      <div className="px-6 pb-10 max-w-2xl">
        {/* Prescrição */}
        {step === "prescricao" && (
          <Card className="rounded-xl border border-gray-100">
            <CardHeader className="pb-2 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-[#003967] text-lg font-semibold">
                <ClipboardList className="w-5 h-5 text-[#1976d2]" />
                Adicionar Prescrição
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-5">
              <form
                onSubmit={handlePrescricaoSubmit}
                className="flex flex-col gap-5"
              >
                {/* Paciente */}
                <div>
                  <Label className="text-sm font-medium text-[#003967]">
                    Paciente
                  </Label>
                  <div className="flex gap-2">
                    <select
                      required
                      className="h-10 rounded-lg border border-gray-300 px-3 text-sm text-gray-700
                                        bg-white focus:outline-none focus:ring-[#1976d2] flex-1"
                      value={prescricao.pacienteType}
                      onChange={(e) =>
                        setPrescricao((p) => ({
                          ...p,
                          pacienteType: e.target.value,
                        }))
                      }
                    >
                      <option value="">Selecione...</option>
                      <option value="nome">Nome</option>
                      <option value="cpf">CPF</option>
                      <option value="cns">CNS</option>
                    </select>
                    <Input
                      required
                      placeholder={
                        prescricao.pacienteType === "nome"
                          ? "Digite o nome"
                          : prescricao.pacienteType === "cpf"
                          ? "Digite o CPF"
                          : prescricao.pacienteType === "cns"
                          ? "Digite o CNS"
                          : "Selecione o tipo primeiro"
                      }
                      className="rounded-lg border-gray-300 h-10 flex-1"
                      value={prescricao.pacienteValue}
                      onChange={(e) =>
                        setPrescricao((p) => ({
                          ...p,
                          pacienteValue: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Medicamento */}
                <div>
                  <Label className="text-sm font-medium text-[#003967]">
                    Nome do Medicamento
                  </Label>

                  <Input
                    required
                    placeholder="Ex: Insulina"
                    className="rounded-lg border-gray-300 h-10"
                    value={prescricao.medicamento}
                    onChange={(e) =>
                      setPrescricao((p) => ({
                        ...p,
                        medicamento: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Via administração */}
                <div>
                  <Label className="text-sm font-medium text-[#003967]">
                    Via de Administração
                  </Label>

                  <select
                    required
                    className="h-10 rounded-lg border border-gray-300 px-3 text-sm text-gray-700
                                        bg-white focus:outline-none focus:ring-[#1976d2]"
                    value={prescricao.viaAdministracao}
                    onChange={(e) =>
                      setPrescricao((p) => ({
                        ...p,
                        viaAdministracao: e.target.value,
                      }))
                    }
                  >
                    <option value="">Selecione...</option>
                    {viasAdministracao.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>

                {/* Quantidade prescrita */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-[#003967]">
                    Quantidade Prescrita
                  </Label>
                  <Input
                    required
                    type="number"
                    min={1}
                    placeholder="Ex: 30"
                    className="rounded-lg border-gray-300 h-10"
                    value={prescricao.quantidade}
                    onChange={(e) =>
                      setPrescricao((p) => ({
                        ...p,
                        quantidade: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-3 pt-1">
                  {/* Uso continuo */}
                  <div
                    className="flex items-center justify-between rounded-lg border
                                    border-gray-200 px-4 py-3"
                  >
                    <div>
                      <p className="texte-sm font-medium text-[#003967]">
                        Uso Contínuo
                      </p>
                      <p className="text-xs text-gray-500">
                        O paciente usa este medicamento de forma contínua?
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setUsoContinuo((v) => !v)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${usoContinuo ? "bg-[#1976d2]" : "bg-gray-300"}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${usoContinuo ? "translate-x-5" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="mt-2 bg-[#1976d2] hover:bg-[#1565c0] texte-white rounded-lg h-10 text-base font-medium"
                >
                  Avançar para Dispensação
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Dispensação */}
        {step === "dispensacao" && (
          <div className="flex flex-col gap-4">
            {/* Resumo da prescrição */}
            <Card className="rounded-xl border border-[#1976d2]/30 bg-[#e3f2fd] shadow-sm">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs font-semibold text-[#1976d2] uppercase tracking-wide mb-2">
                  Prescrição selecionada
                </p>
                <div className="flex items-center gap-3">
                  <Pill className="w-5 h-5 text-[#1976d2]" />
                  <div>
                    <p className="text-sm font-semibold text-[#003967]">
                      {prescricao.medicamento}
                    </p>
                    <p className="text-xs text-gray-600">
                      {prescricao.viaAdministracao} · {prescricao.quantidade}{" "}
                      unidades ·
                      {usoContinuo ? " Uso contínuo" : " Uso não contínuo"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-gray-200 shadow-sm">
              <CardHeader className="pb-2 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-[#003967] text-lg font-semibold">
                  <ClipboardList className="w-5 h-5 text-[#1976d2]" />
                  Dados da Dispensação
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-5">
                <form
                  onSubmit={handleDispensacaoSubmit}
                  className="flex flex-col gap-5"
                >
                  {/* Usuário que dispensou */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-[#003967]">
                      Dispensado por
                    </Label>
                    <Input
                      required
                      placeholder="Nome do usuário responsável"
                      className="rounded-lg border-gray-300 h-10"
                      value={dispensacao.usuario}
                      onChange={(e) =>
                        setDispensacao((d) => ({
                          ...d,
                          usuario: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Data de entrega */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-[#003967]">
                      Data de Entrega
                    </Label>
                    <Input
                      required
                      type="date"
                      className="rounded-lg border-gray-300 h-10"
                      value={dispensacao.dataEntrega}
                      onChange={(e) =>
                        setDispensacao((d) => ({
                          ...d,
                          dataEntrega: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Quantidade entregue */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-[#003967]">
                      Quantidade Entregue
                    </Label>
                    <Input
                      required
                      type="number"
                      min={1}
                      placeholder="Ex: 30"
                      className="rounded-lg border-gray-300 h-10"
                      value={dispensacao.quantidadeEntregue}
                      onChange={(e) =>
                        setDispensacao((d) => ({
                          ...d,
                          quantidadeEntregue: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Próxima retirada */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-[#003967]">
                      Estimativa da Próxima Retirada
                    </Label>
                    <Input
                      required
                      type="date"
                      className="rounded-lg border-gray-300 h-10"
                      value={dispensacao.proximaRetirada}
                      onChange={(e) =>
                        setDispensacao((d) => ({
                          ...d,
                          proximaRetirada: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Médico responsável*/}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-[#003967]">
                      Médico responsável
                    </Label>
                    <Input
                      required
                      placeholder="CRM"
                      className="rounded-lg border-gray-300 h-10"
                      value={dispensacao.crm}
                      onChange={(e) =>
                        setDispensacao((d) => ({
                          ...d,
                          crm: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("prescricao")}
                      className="flex-1 rounded-lg h-10 border-gray-300 text-gray-600"
                    >
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#1976d2] hover:bg-[#1565c0] text-white rounded-lg h-10 text-base font-medium"
                    >
                      Confirmar Dispensação
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sucesso */}
        {step === "sucesso" && ( 
            <Card className="rounded-xl border border-green-200 shadow-sm">
                <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-9 h-9 text-green-500"/>
                    </div>

                    <div>
                        <p className="text-lg font-semibold text-[#003967]">
                            Dispensação registrada
                        </p>
                        <p className="test-sm text-gray-500 mt-1">
                            {prescricao.medicamento} dispensado com sucesso por {dispensacao.usuario}
                        </p>
                        <p>
                            Próxima retirada estimada: <span>
                                {dispensacao.proximaRetirada
                                ? new Date(dispensacao.proximaRetirada + "T00:00:00").toLocaleDateString("pt-BR") : "-"
                                }
                            </span>
                        </p>
                    </div>

                    <Button 
                    onClick={() => {
                        setStep("prescricao")
                        setPrescricao({ pacienteType: "", pacienteValue: "", medicamento: "", viaAdministracao: "", quantidade: ""})
                        setDispensacao({ usuario: "", dataEntrega: "", quantidadeEntregue: "", proximaRetirada: "", crm: ""})
                        setUsoContinuo(false)
                        }}
                        className="mt-2 bg-[#1976d2] hover:bg-[#1565c0] text-white rounded-lg h-10 px-8"    
                    >
                        Nova Dispensação
                    </Button>
                </CardContent>
            </Card>
        )
        
        }
      </div>
    </main>
  );
}
