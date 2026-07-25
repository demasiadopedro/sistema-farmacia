import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pill, ClipboardList } from "lucide-react";
import { Prescricao, Dispensacao } from "@/types/dispensacao";

interface DispensacaoCardProps {
  prescricao: Prescricao;
  dispensacao: Dispensacao;
  setDispensacao: React.Dispatch<React.SetStateAction<Dispensacao>>;
  usoContinuo: boolean;
  buscaPaciente: string;
  loading: boolean;
  handleDispensacaoSubmit: (e: React.FormEvent) => void;
  setStep: (step: "prescricao" | "dispensacao" | "sucesso") => void;
}

export function DispensacaoCard({
  prescricao,
  dispensacao,
  setDispensacao,
  usoContinuo,
  buscaPaciente,
  loading,
  handleDispensacaoSubmit,
  setStep
}: DispensacaoCardProps) {
    return (
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
                      onChange={(e) => setDispensacao((d: Dispensacao) => ({ ...d, dataEntrega: e.target.value }))}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-[#003967]">Quantidade Entregue</Label>
                    <Input
                      required type="number" min={1} placeholder="Ex: 30"
                      className="rounded-lg border-gray-300 h-10"
                      value={dispensacao.quantidadeEntregue}
                      onChange={(e) => setDispensacao((d: Dispensacao) => ({ ...d, quantidadeEntregue: e.target.value }))}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-[#003967]">Estimativa da Próxima Retirada</Label>
                    <Input
                      type="date" className="rounded-lg border-gray-300 h-10"
                      value={dispensacao.proximaRetirada}
                      onChange={(e) => setDispensacao((d: Dispensacao) => ({ ...d, proximaRetirada: e.target.value }))}
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
    )
}
