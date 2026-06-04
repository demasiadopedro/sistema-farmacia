"use server"

import { cookies } from "next/headers";

export interface CreatePacienteData {
    nome: string;
    data_nascimento: string;
    cpf: string;
    cns: string;
    telefone: string;
    endereco: string;
    condicao: string;
    sexo: string;
    microarea_id: string;
}

export interface Microarea {
    id: string;
    nome: string; 
}

export async function createPacienteAction(data: CreatePacienteData) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token')?.value;

        if (!token) return { error: "Usuário não autenticado." };

        const response = await fetch('http://localhost:3333/pacientes', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || "Erro ao cadastrar paciente." };
        }

        return { success: true };
    } catch (error) {
        return { error: "Erro interno no servidor." };
    }
}



export async function getMicroareasAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token')?.value;
        const userInfoCookie = cookieStore.get('UserInfo')?.value;

        if (!token || !userInfoCookie) {
            return { error: "Usuário não autenticado ou perfil não encontrado." };
        }

        const userInfo = JSON.parse(userInfoCookie);
        const unidadeId = userInfo.id_unidade;

        if (!unidadeId) {
            return { error: "ID da unidade não vinculado ao usuário." };
        }

        const response = await fetch(`http://localhost:3333/unidade/${unidadeId}/microarea`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            return { error: "Erro ao buscar microáreas no banco de dados." };
        }

        const microareas: Microarea[] = await response.json();
        return { data: microareas };
    } catch (error) {
        console.error("Erro na action de microáreas:", error);
        return { error: "Erro interno no servidor de interface." };
    }
}