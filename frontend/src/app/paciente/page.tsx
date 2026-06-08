import { cookies } from "next/headers";
import PacienteClient from "./PacienteClient";
import { redirect } from "next/navigation";

export default async function PacientePage() {
    const token = (await cookies()).get('session_token')?.value;
    const userInfoCookie = (await cookies()).get('UserInfo')?.value;

    if (!userInfoCookie) {
        redirect("/login")
    }
    const userInfo = JSON.parse(userInfoCookie);
    const id_unidade = userInfo.id_unidade;
    const response = await fetch(`http://localhost:3333/pacientes/unidade/${id_unidade}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": ` Bearer ${token}`
        },
        cache: "no-store"
    })



    if (!response.ok) {
        console.log("[*] ERRO DO NESTJS!!!:", response.status, await response.text());
        return <PacienteClient pacientesIniciais={[]} />;
    }


    const pacientes = response.ok ? await response.json() : [];
    console.log("[*] DADOS RECEBIDOS DO BACKEND:", pacientes);


    return <PacienteClient pacientesIniciais={pacientes} />;
}   