"use server"

import { cookies } from "next/headers";

export interface CreatePacienteData {
    nome: string;
    data_de_nascimento: string;
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

        const response = await fetch(`${process.env.URL_BACKEND}/pacientes`, {
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

        const response = await fetch(`${process.env.URL_BACKEND}/unidade/${unidadeId}/microarea`, {
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

export async function buscarPacientesPorUnidadeAction(id_unidade: string) {
    const token = (await cookies()).get('session_token')?.value;

    try {
        const response = await fetch(`${process.env.URL_BACKEND}/pacientes/unidade/${id_unidade}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        });

        if (!response.ok) {
            return { error: "Erro ao buscar pacientes." };
        }

        const pacientes = await response.json();
        return { data: pacientes };
    } catch (error) {
        return { error: "Erro ao buscar pacientes." };
    }
}

export async function updatePacienteAction(id: string, data: CreatePacienteData) {
    const token = (await cookies()).get('session_token')?.value;

    try {
        const response = await fetch(`${process.env.URL_BACKEND}/pacientes/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || "Erro ao atualizar paciente." };
        }

        return { success: true };
    } catch (error) {
        return { error: "Erro interno no servidor." };
    }
}

export async function buscarPacientePorIdAction(id: string) {
    const token = (await cookies()).get('session_token')?.value;

    try {
        const response = await fetch(`${process.env.URL_BACKEND}/pacientes/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        });

        if (!response.ok) {
            return { error: "Erro ao buscar paciente." };
        }

        const paciente = await response.json();
        return { data: paciente };
    } catch (error) {
        return { error: "Erro ao buscar paciente." };
    }
}
