import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DispensacaoData } from "@/app/dashboard/page";

interface RetiradasProps {
    data: DispensacaoData[];
}

export default function Retiradas({ data }: RetiradasProps) {
    return (
        <Card className="rounded-xl shadow-sm border-none ring-1 ring-gray-100 bg-white h-full">
            <CardHeader>
                <CardTitle className="text-lg text-[#003967]">Últimas Retiradas</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 overflow-y-auto max-h-[400px]">
                {data.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhuma retirada recente encontrada.</p>
                ) : (
                    data.map((dispensacao) => (
                        <div key={dispensacao.id} className="flex flex-col border-b border-gray-100 pb-3 last:border-0">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-sm text-gray-800">
                                    {dispensacao.paciente?.nome || "Paciente não vinculado"}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(dispensacao.data_entrega).toLocaleDateString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 text-xs text-gray-600">
                                {dispensacao.itens.map((item) => (
                                    <span key={item.id}>
                                        {item.quantidade}x {item.estoque.medicamento.nome}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}