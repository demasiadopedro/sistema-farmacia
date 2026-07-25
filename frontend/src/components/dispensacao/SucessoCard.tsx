import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Prescricao, Dispensacao } from "@/types/dispensacao";

interface SucessoCardProps {
    prescricao: Prescricao;
    dispensacao: Dispensacao;
    resetForm: () => void;
}

export function SucessoCard({
    prescricao,
    dispensacao,
    resetForm
}: SucessoCardProps) {
    return (
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
                onClick={resetForm}
                    className="mt-2 bg-[#1976d2] hover:bg-[#1565c0] text-white rounded-lg h-10 px-8"    
                >
                    Nova Dispensação
                </Button>
            </CardContent>
        </Card>
    )
}
