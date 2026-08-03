import { cookies } from "next/headers";
import PacienteClient from "./PacienteClient";
import { redirect } from "next/navigation";
import { buscarPacientesPorUnidadeAction } from "@/actions/paciente";

export default async function PacientePage() {
    const userInfoCookie = (await cookies()).get('UserInfo')?.value;

    if (!userInfoCookie) {
        redirect("/login")
    }
    const userInfo = JSON.parse(userInfoCookie);
    const id_unidade = userInfo.id_unidade;
    
    const result = await buscarPacientesPorUnidadeAction(id_unidade);

    if (result.error) {
        console.log("[*] ERRO DO NESTJS!!!:", result.error);
        return <PacienteClient pacientesIniciais={[]} />;
    }

    const pacientes = result.data || [];
    console.log("[*] DADOS RECEBIDOS DO BACKEND:", pacientes);

    return <PacienteClient pacientesIniciais={pacientes} />;
}
