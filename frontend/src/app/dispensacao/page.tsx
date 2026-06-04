import { cookies } from "next/headers";
import DispensacaoClient from "./DispensacaoClient";
import { redirect } from "next/navigation";

export default async function DispensacaoPage() {
    const token = (await cookies()).get('session_token')?.value;
    const userInfoCookie = (await cookies()).get('UserInfo')?.value;

    if (!userInfoCookie) {
        redirect("/login");
    }
    
    const userInfo = JSON.parse(userInfoCookie);
    const id_unidade = userInfo.id_unidade;
    
    const response = await fetch(`http://localhost:3333/pacientes/unidade/${id_unidade}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        cache: "no-store"
    });

    if (!response.ok) {
        console.log("[*] ERRO DO NESTJS (Pacientes)!!!:", response.status, await response.text());
        return <DispensacaoClient pacientes={[]} />;
    }

    const pacientes = await response.json();
    console.log("[*] PACIENTES RECEBIDOS DO BACKEND:", pacientes.length);

    return <DispensacaoClient pacientes={pacientes} />;
}