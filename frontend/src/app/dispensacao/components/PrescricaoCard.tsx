import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ClipboardList, Check, X } from "lucide-react";
import { Paciente, MedicamentoEstoque, Prescricao } from "@/types/dispensacao";

interface PrescricaoCardProps {
  pacientes: Paciente[];
  medicamentos: MedicamentoEstoque[];
  prescricao: Prescricao;
  setPrescricao: React.Dispatch<React.SetStateAction<Prescricao>>;
  handlePrescricaoSubmit: (e: React.FormEvent) => void;
  buscaPaciente: string;
  setBuscaPaciente: (value: string) => void;
  buscaMedicamento: string;
  setBuscaMedicamento: (value: string) => void;
  usoContinuo: boolean;
  setUsoContinuo: React.Dispatch<React.SetStateAction<boolean>>;
  viasAdministracao: string[];
  dropdownAberto: boolean;
  setDropdownAberto: (value: boolean) => void;
  dropdownMedAberto: boolean;
  setDropdownMedAberto: (value: boolean) => void;
  dropdownPacRef: React.RefObject<HTMLDivElement | null>;
  dropdownMedRef: React.RefObject<HTMLDivElement | null>;
}

export function PrescricaoCard(props: PrescricaoCardProps) {
  const {
    pacientes,
    medicamentos,
    prescricao,
    setPrescricao,
    handlePrescricaoSubmit,
    buscaPaciente,
    setBuscaPaciente,
    buscaMedicamento,
    setBuscaMedicamento,
    usoContinuo,
    setUsoContinuo,
    viasAdministracao,
    dropdownAberto,
    setDropdownAberto,
    dropdownMedAberto,
    setDropdownMedAberto,
    dropdownPacRef,
    dropdownMedRef,
  } = props;

  const pacientesFiltrados = pacientes.filter(p => 
    p.nome?.toLowerCase().includes(buscaPaciente.toLowerCase()) || 
    p.cpf.includes(buscaPaciente)
  );

  const medicamentosFiltrados = medicamentos.filter(m =>
    m.nome.toLowerCase().includes(buscaMedicamento.toLowerCase())
  );

  return (
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
                      setPrescricao((p: Prescricao) => ({ ...p, id_paciente: "" }));
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
                        setPrescricao((p: Prescricao) => ({ ...p, id_paciente: paciente.id }));
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
                      setPrescricao((p: Prescricao) => ({ ...p, id_medicamento: "", medicamentoNome: "" }));
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
                        setPrescricao((p: Prescricao) => ({ ...p, id_medicamento: med.id, medicamentoNome: med.nome }));
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
              onChange={(e) => setPrescricao((p: Prescricao) => ({ ...p, viaAdministracao: e.target.value }))}
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
              onChange={(e) => setPrescricao((p: Prescricao) => ({ ...p, quantidade: e.target.value }))}
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

            <div className="flex flex-col gap-3 rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#003967]">Avaliações realizadas</p>
                <p className="text-xs text-gray-500">Informe se cada avaliação foi realizada.</p>
              </div>
              {([
                ["afericaoPressao", "Aferição da pressão"],
                ["avaliacaoPes", "Avaliação dos pés"],
                ["avaliacaoPeso", "Avaliação do peso"],
                ["avaliacaoAltura", "Avaliação da altura"],
              ] as const).map(([campo, label]) => (
                <div key={campo} className="flex items-center justify-between gap-4 text-sm text-gray-700">
                  <span>{label}</span>
                  <button
                    type="button"
                    aria-label={`${label}: ${prescricao[campo] ? "sim" : "não"}`}
                    aria-pressed={prescricao[campo]}
                    onClick={() => setPrescricao((p: Prescricao) => ({ ...p, [campo]: !p[campo] }))}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                      prescricao[campo]
                        ? "border-green-200 bg-green-100 text-green-600"
                        : "border-red-200 bg-red-100 text-red-600"
                    }`}
                  >
                    {prescricao[campo] ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="mt-2 bg-[#1976d2] hover:bg-[#1565c0] text-white rounded-lg h-10 text-base font-medium">
            Avançar para Dispensação
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
