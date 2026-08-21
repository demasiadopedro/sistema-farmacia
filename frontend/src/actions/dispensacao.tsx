"use server";

import { cookies } from "next/headers";

export async function buscarDispensacoesPorUnidadeAction(id_unidade: string) {
  const token = (await cookies()).get("session_token")?.value;
  if (!token) return { error: "Usuário não autenticado." };

  try {
    const response = await fetch(`${process.env.URL_BACKEND}/dispensation/unidade/${id_unidade}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return { error: "Erro ao buscar dispensações." };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}

export async function registrarDispensacaoAction(formData: FormData) {
  const token = (await cookies()).get("session_token")?.value;

  if (!token) {
    return { error: "Usuário não autenticado." };
  }

  let id_usuario: string | undefined;

  const userInfoString = (await cookies()).get('UserInfo')?.value;
  if (userInfoString) {
    try {
      const userInfo = JSON.parse(userInfoString);
      id_usuario = userInfo.id || userInfo.id_usuario;
    } catch (error) {
      console.error(error);
    }
  }

  if (!id_usuario) {
    return { error: "ID do usuário não encontrado. Faça login novamente." };
  }

  const id_paciente = formData.get("id_paciente");
  const id_medicamento = formData.get("id_medicamento");
  const via_administracao = formData.get("via_administracao");
  const quantidade_receitada = Number(formData.get("quantidade_receitada"));
  const uso_continuo = formData.get("uso_continuo") === "true";
  const afericao_pressao = formData.get("afericao_pressao") === "true";
  const avaliacao_pes = formData.get("avaliacao_pes") === "true";
  const avaliacao_peso = formData.get("avaliacao_peso") === "true";
  const avaliacao_altura = formData.get("avaliacao_altura") === "true";

  const proxima_retirada = formData.get("proxima_retirada")
    ? new Date(formData.get("proxima_retirada") as string).toISOString()
    : null;
  const quantidade_solicitada = Number(formData.get("quantidade_entregue"));

  try {
    const prescriptionResponse = await fetch(`${process.env.URL_BACKEND}/prescription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data_receita: new Date().toISOString(),
        uso_continuo,
        via_administracao,
        quantidade_receitada,
        afericao_pressao,
        avaliacao_pes,
        avaliacao_peso,
        avaliacao_altura,
        id_medicamento,
        id_paciente,
      }),
    });

    if (!prescriptionResponse.ok) {
      const errorData = await prescriptionResponse.json();
      return { error: `Erro na Prescrição: ${errorData.message}` };
    }

    const prescriptionData = await prescriptionResponse.json();

    const dispensationResponse = await fetch(`${process.env.URL_BACKEND}/dispensation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        quantidade_solicitada,
        id_medicamento,
        proxima_retirada,
        id_prescricao: prescriptionData.id,
        id_usuario,
        id_paciente,
      }),
    });

    if (!dispensationResponse.ok) {
      const errorData = await dispensationResponse.json();
      return { error: `Erro na Dispensação: ${errorData.message}` };
    }

    return { success: true };
  } catch (error) {
    return { error: "Ocorreu um erro inesperado de conexão." };
  }
}
