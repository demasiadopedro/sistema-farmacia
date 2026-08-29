"use client";

import Sidebar from "@/components/sidebar";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { registrarDispensacaoAction } from "../../actions/dispensacao";
import { Paciente, MedicamentoEstoque } from "@/types/dispensacao";
import { PrescricaoCard } from "@/app/dispensacao/components/PrescricaoCard";
import { DispensacaoCard } from "@/app/dispensacao/components/DispensacaoCard";
import { SucessoCard } from "@/app/dispensacao/components/SucessoCard";

const viasAdministracao = [
  "Oral", "Injetável", "Sublingual", "Tópica",
  "Inalatória", "Vaginal", "Retal", "Ocular", "Nasal",
];

interface DispensacaoClientProps {
  pacientes: Paciente[];
  medicamentos: MedicamentoEstoque[];
  id_usuario: string;
}

export default function DispensacaoClient({ pacientes = [], medicamentos = [], id_usuario }: DispensacaoClientProps) {
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
    dataEntrega: new Date().toISOString().split("T")[0],
    quantidadeEntregue: "",
    proximaRetirada: "",
    afericaoPressao: false,
    avaliacaoPes: false,
    avaliacaoPeso: false,
    avaliacaoAltura: false,
  });

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
    setError(null);
    setStep("dispensacao");
  }

  async function handleDispensacaoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("id_usuario", id_usuario);
    formData.append("id_paciente", prescricao.id_paciente);
    formData.append("id_medicamento", prescricao.id_medicamento);
    formData.append("via_administracao", prescricao.viaAdministracao);
    formData.append("quantidade_receitada", prescricao.quantidade);
    formData.append("uso_continuo", usoContinuo.toString());
    formData.append("quantidade_entregue", dispensacao.quantidadeEntregue);
    formData.append("proxima_retirada", dispensacao.proximaRetirada);
    formData.append("afericao_pressao", dispensacao.afericaoPressao.toString());
    formData.append("avaliacao_pes", dispensacao.avaliacaoPes.toString());
    formData.append("avaliacao_peso", dispensacao.avaliacaoPeso.toString());
    formData.append("avaliacao_altura", dispensacao.avaliacaoAltura.toString());

    try {
      const result = await registrarDispensacaoAction(formData);
      
      if (result?.error) {
        setError(result.error);
      } else {
        setStep("sucesso");
      }
    } catch {
      setError("Ocorreu um erro inesperado ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setStep("prescricao");
    setPrescricao({
      id_paciente: "",
      id_medicamento: "",
      medicamentoNome: "",
      viaAdministracao: "",
      quantidade: "",
    });
    setDispensacao({
      dataEntrega: new Date().toISOString().split("T")[0],
      quantidadeEntregue: "",
      proximaRetirada: "",
      afericaoPressao: false,
      avaliacaoPes: false,
      avaliacaoPeso: false,
      avaliacaoAltura: false,
    });
    
    setUsoContinuo(false);
    setBuscaPaciente("");
    setBuscaMedicamento("");
  }

  return (
    <main className="sm:ml-56 min-h-screen bg-white">
      <div className="relative flex items-center bg-gray-50 border-b border-gray-200 p-4 h-16">
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
          <PrescricaoCard
            pacientes={pacientes}
            medicamentos={medicamentos}
            prescricao={prescricao}
            setPrescricao={setPrescricao}
            handlePrescricaoSubmit={handlePrescricaoSubmit}
            buscaPaciente={buscaPaciente}
            setBuscaPaciente={setBuscaPaciente}
            buscaMedicamento={buscaMedicamento}
            setBuscaMedicamento={setBuscaMedicamento}
            usoContinuo={usoContinuo}
            setUsoContinuo={setUsoContinuo}
            viasAdministracao={viasAdministracao}
            dropdownAberto={dropdownAberto}
            setDropdownAberto={setDropdownAberto}
            dropdownMedAberto={dropdownMedAberto}
            setDropdownMedAberto={setDropdownMedAberto}
            dropdownPacRef={dropdownPacRef}
            dropdownMedRef={dropdownMedRef}
          />
        )}

        {step === "dispensacao" && (
          <DispensacaoCard
            prescricao={prescricao}
            dispensacao={dispensacao}
            setDispensacao={setDispensacao}
            usoContinuo={usoContinuo}
            buscaPaciente={buscaPaciente}
            loading={loading}
            handleDispensacaoSubmit={handleDispensacaoSubmit}
            setStep={setStep}
          />
        )}

        {step === "sucesso" && (
          <SucessoCard
            prescricao={prescricao}
            dispensacao={dispensacao}
            resetForm={resetForm}
          />
        )}
      </div>
    </main>
  );
}
