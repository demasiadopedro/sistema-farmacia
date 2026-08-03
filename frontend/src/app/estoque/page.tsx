import { cookies } from "next/headers";
import EstoqueClient from "./EstoqueClient";
import { buscarEstoquePorUnidadeAction, buscarRemediosAction } from "@/actions/estoque";

export default async function EstoquePage() {
    const cookieStore = await cookies();
    const userInfoString = cookieStore.get('UserInfo')?.value;
    let unidadeId = "";

    if (userInfoString) {
        try {
            const userInfo = JSON.parse(userInfoString);
            unidadeId = userInfo.id_unidade;
        } catch (error) {
            console.error("Erro ao ler o JSON do cookie UserInfo:", error);
        }
    }

    if (!unidadeId) {
        return <EstoqueClient
            estoqueInicial={[]}
            medicamentosExistentes={[]}
        />;
    }

    const [estoqueResult, medicamentosResult] = await Promise.all([
        buscarEstoquePorUnidadeAction(unidadeId),
        buscarRemediosAction()
    ]);

    const estoqueData = estoqueResult.data || [];
    const medicamentos = medicamentosResult.data || [];

    return <EstoqueClient
        estoqueInicial={estoqueData}
        medicamentosExistentes={medicamentos}
    />;
}
