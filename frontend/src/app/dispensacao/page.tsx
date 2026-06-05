import { cookies } from "next/headers";
import DispensacaoClient from "./DispensacaoClient";
import { redirect } from "next/navigation";

interface EstoqueItemBackend {
  id: string;
  lote: string;
  quantidade: number;
  data_de_validade: string;
  id_medicamento: string;
  id_unidade_saude: string;
  medicamento: {
    id: string;
    nome: string;
    unidade_medida: string;
    categoria: string;
  };
}

interface MedicamentoAgrupado {
  id: string;
  nome: string;
  quantidadeTotal: number;
}

export default async function DispensacaoPage() {
    const token = (await cookies()).get('session_token')?.value;
    const userInfoCookie = (await cookies()).get('UserInfo')?.value;

    if (!userInfoCookie) {
        redirect("/login");
    }
    
    const userInfo = JSON.parse(userInfoCookie);
    const id_unidade = userInfo.id_unidade;
    
    const [pacientesRes, estoqueRes] = await Promise.all([
        fetch(`http://localhost:3333/pacientes/unidade/${id_unidade}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        }),
        fetch(`http://localhost:3333/stock/unidade/${id_unidade}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        })
    ]);

    const pacientes = pacientesRes.ok ? await pacientesRes.json() : [];
    const estoqueBruto: EstoqueItemBackend[] = estoqueRes.ok ? await estoqueRes.json() : [];

    const medicamentosMap = new Map<string, MedicamentoAgrupado>();

    estoqueBruto.forEach((item) => {
        if (!item.medicamento || item.quantidade <= 0) return;
        const medId = item.medicamento.id;
        
        if (medicamentosMap.has(medId)) {
            const med = medicamentosMap.get(medId)!;
            med.quantidadeTotal += item.quantidade;
        } else {
            medicamentosMap.set(medId, {
                id: medId,
                nome: item.medicamento.nome,
                quantidadeTotal: item.quantidade
            });
        }
    });

    const medicamentos = Array.from(medicamentosMap.values());

    return <DispensacaoClient pacientes={pacientes} medicamentos={medicamentos} />;
}