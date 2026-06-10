import { cookies } from "next/headers";
import EstoqueClient from "./EstoqueClient";

export default async function EstoquePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const userInfoString = cookieStore.get('UserInfo')?.value;
    // console.log('[*] Iniciando o get no backend')
    let unidadeId = "";

    if (userInfoString) {
        try {
            const userInfo = JSON.parse(userInfoString);
            // console.log("[*] CONTEÚDO DO USERINFO:", userInfo);
            unidadeId = userInfo.id_unidade;
        } catch (error) {
            console.error("Erro ao ler o JSON do cookie UserInfo:", error);
        }
    }

    if (!token || !unidadeId) {
        return <EstoqueClient
            estoqueInicial={[]}
            medicamentosExistentes={[]}
        />;
    }

    const response = await fetch(`${process.env.URL_BACKEND}/stock/unidade/${unidadeId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        console.log("[*] ERRO DO NESTJS!!!:", response.status, await response.text());
    }

    const medicamentosResponse = await fetch(`${process.env.URL_BACKEND}remedy`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const medicamentos = await medicamentosResponse.json();


    const estoqueData = response.ok ? await response.json() : [];
    // console.log("[*] DADOS RECEBIDOS DO BACKEND:", estoqueData);

    return <EstoqueClient
        estoqueInicial={estoqueData}
        medicamentosExistentes={medicamentos}
    />;
}