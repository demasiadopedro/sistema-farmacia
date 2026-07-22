"use server";

import { cookies } from "next/headers";

export async function criarMedicamentoAction(formData: FormData) {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  const nome = formData.get("nome");
  const categoria = formData.get("categoria");
  const forma_farmaceutica = formData.get("forma_farmaceutica");

  try {
    const response = await fetch(`${process.env.URL_BACKEND}/remedy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, categoria, forma_farmaceutica }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.log("ERRO REAL:", errorData);

      const errorMessage = Array.isArray(errorData.message)
        ? errorData.message[0]
        : errorData.message || "Erro ao cadastrar o novo medicamento no sistema.";

      return { error: errorMessage };
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
    const response = await fetch(`${process.env.URL_BACKEND}/stock`, {
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

export async function atualizarLoteAction(formData: FormData) {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  const id_lote = formData.get("id_lote");
  const lote = formData.get("lote");
  const quantidade = Number(formData.get("quantidade"));
  const data_de_validade = new Date(formData.get("data_de_validade") as string).toISOString();
  const id_medicamento = formData.get("id_medicamento");

  try {
    const response = await fetch(`${process.env.URL_BACKEND}/stock/${id_lote}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_medicamento,
        lote,
        quantidade,
        data_de_validade,
      }),
    });

    if (!response.ok) {
      return { error: "Erro ao atualizar o lote." };
    }

    return { success: true };
  } catch (error) {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}

export async function deletarLoteAction(id_lote: string) {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  try {
    const response = await fetch(`${process.env.URL_BACKEND}/stock/${id_lote}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { error: "Erro ao deletar o lote." };
    }

    return { success: true };
  } catch (error) {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}
