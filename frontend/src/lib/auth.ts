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
        
        if (!response.ok) {
            return { error: 'Credenciais Invalidas, verifique email e senha' }
        }

        const token = data.access_token
        
        if (token) {
            (await cookies()).set('session_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 8
            });

            const userProfile = {
                nome: data.nome,
                email: data.email,
                role: data.role,
                atribuicao: data.atribuicao,
                unidade: data.unidade,
                id_unidade: data.unidade_id,
                cep: data.cep,
                cnes: data.cnes
            };

            (await cookies()).set('UserInfo', JSON.stringify(userProfile) ,{
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax",
                path: '/',
                maxAge: 60 * 60 * 8
            });

            return { success: true };
        }

    } catch (error) {
        console.error("Erro no servidor:", error)
        return { error: "Ocorreu um erro ao tentar se comunicar com o servidor." }
    }
}