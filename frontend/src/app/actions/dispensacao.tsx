"use server";

import { cookies } from "next/headers";

export async function registrarDispensacaoAction(formData: FormData) {
  const token = (await cookies()).get("session_token")?.value;

  if (!token) {
    return { error: "Usuário não autenticado." };
  }

  let id_usuario;
  
  const userInfoString = (await cookies()).get('UserInfo')?.value;
  if (userInfoString) {
    try {
      const userInfo = JSON.parse(userInfoString);
      id_usuario = userInfo.user.id

    } catch (error) {
      console.error("Erro ao ler o JSON do cookie UserInfo:", error);
    }
  }
  const id_paciente = formData.get("id_paciente");
  const id_medicamento = formData.get("id_medicamento");
  const via_administracao = formData.get("via_administracao");
  const quantidade_receitada = Number(formData.get("quantidade_receitada"));
  const uso_continuo = formData.get("uso_continuo") === "true";

  const proxima_retirada = formData.get("proxima_retirada")
    ? new Date(formData.get("proxima_retirada") as string).toISOString()
    : null;
  const quantidade_solicitada = Number(formData.get("quantidade_entregue"));

  try {
    const prescriptionResponse = await fetch("http://localhost:3333/prescription", {
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
        id_medicamento,
        id_paciente,
      }),
    });

    if (!prescriptionResponse.ok) {
      const errorData = await prescriptionResponse.json();
      return { error: `Erro na Prescrição: ${errorData.message}` };
    }

    const prescriptionData = await prescriptionResponse.json();

    const dispensationResponse = await fetch("http://localhost:3333/dispensation", {
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