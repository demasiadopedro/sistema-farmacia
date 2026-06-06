"use server";

import { cookies } from "next/headers";

export async function criarMedicamentoAction(formData: FormData) {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  const nome = formData.get("nome");
  const categoria = formData.get("categoria");
  const forma_farmaceutica = formData.get("forma_farmaceutica");

  try {
    const response = await fetch("http://localhost:3333/remedy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, categoria, forma_farmaceutica }),
    });

    if (!response.ok) {
      return { error: "Erro ao cadastrar o novo medicamento no sistema." };
    }

    const data = await response.json();
    return { success: true, id_medicamento: data.id };
  } catch (error) {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}

export async function criarLoteAction(formData: FormData) {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  const userInfoString = (await cookies()).get("UserInfo")?.value;
  let id_unidade_saude = "";
  
  if (userInfoString) {
    const userInfo = JSON.parse(userInfoString);
    id_unidade_saude = userInfo.id_unidade; 
  }

  const lote = formData.get("lote");
  const quantidade = Number(formData.get("quantidade"));
  const data_de_validade = new Date(formData.get("data_de_validade") as string).toISOString();
  const id_medicamento = formData.get("id_medicamento");

  try {
    const response = await fetch("http://localhost:3333/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        lote,
        quantidade,
        data_de_validade,
        id_medicamento,
        id_unidade_saude,
      }),
    });

    if (!response.ok) {
      return { error: "Erro ao registrar a entrada do lote." };
    }

    return { success: true };
  } catch (error) {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}