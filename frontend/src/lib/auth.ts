"use server"

import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');
    try {
        const response = await fetch('http://localhost:3333/auth', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })

        const data = await response.json();
        // console.log("Status do NestJS:", response.status);
        // console.log("Resposta do NestJS:", data);
        // if (!response.ok) {
        //     return { error: 'Credenciais Invalidas, verifique email e senha' }
        // }

        const token = data.acessToken
        if(token) {
            (await cookies()).set('session_token', data.token, {
                name: 'session_token',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 8
            })
        }
        return { sucess: true }
    } catch (error) {
        console.error("Erro no servidor:", error)
        return { error: "Ocorreu um erro ao tentar se comunicar com o servidor." }
    }

}
