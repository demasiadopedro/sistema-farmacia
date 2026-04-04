-- CreateTable
CREATE TABLE "dispensacao" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "data_entrega" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantidade_entregue" INTEGER NOT NULL,
    "proxima_retirada" DATE,
    "id_prescricao" UUID,
    "id_usuario" UUID,

    CONSTRAINT "dispensacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estoque" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lote" TEXT,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "data_de_validade" DATE,
    "id_medicamento" UUID,
    "id_unidade_saude" UUID,

    CONSTRAINT "estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescricao" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "data_receita" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uso_continuo" BOOLEAN NOT NULL DEFAULT false,
    "receita_externa" BOOLEAN NOT NULL DEFAULT false,
    "via_administracao" TEXT,
    "quantidade_receitada" INTEGER NOT NULL,
    "id_medicamento" UUID,
    "id_paciente" UUID,

    CONSTRAINT "prescricao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicamento" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT,
    "forma_farmaceutica" TEXT,
    "categoria" TEXT,

    CONSTRAINT "medicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "microarea" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "unidade_saude_id" UUID,

    CONSTRAINT "microarea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paciente" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT,
    "data_de_nascimento" DATE,
    "cpf" VARCHAR(11) NOT NULL,
    "cns" VARCHAR(15) NOT NULL,
    "telefone" VARCHAR(14),
    "endereco" TEXT,
    "condicao" TEXT,
    "sexo" TEXT,
    "microarea_id" UUID,
    "retiradas" UUID,

    CONSTRAINT "paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidade_saude" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "endereco" TEXT,
    "cnes" TEXT NOT NULL,

    CONSTRAINT "unidade_saude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cpf" VARCHAR(11),
    "nome" TEXT,
    "email" TEXT,
    "password" TEXT,
    "atribuicao" TEXT,
    "comprovante" TEXT,
    "id_unidade_pertecente" UUID,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paciente_cpf_key" ON "paciente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "paciente_cns_key" ON "paciente"("cns");

-- CreateIndex
CREATE UNIQUE INDEX "unidade_saude_cnes_key" ON "unidade_saude"("cnes");

-- AddForeignKey
ALTER TABLE "dispensacao" ADD CONSTRAINT "dispensacao_id_prescricao_fkey" FOREIGN KEY ("id_prescricao") REFERENCES "prescricao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispensacao" ADD CONSTRAINT "dispensacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estoque" ADD CONSTRAINT "estoque_id_medicamento_fkey" FOREIGN KEY ("id_medicamento") REFERENCES "medicamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estoque" ADD CONSTRAINT "estoque_id_unidade_saude_fkey" FOREIGN KEY ("id_unidade_saude") REFERENCES "unidade_saude"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescricao" ADD CONSTRAINT "prescricao_id_medicamento_fkey" FOREIGN KEY ("id_medicamento") REFERENCES "medicamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescricao" ADD CONSTRAINT "prescricao_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "paciente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "microarea" ADD CONSTRAINT "microarea_unidade_saude_id_fkey" FOREIGN KEY ("unidade_saude_id") REFERENCES "unidade_saude"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "paciente" ADD CONSTRAINT "paciente_microarea_id_fkey" FOREIGN KEY ("microarea_id") REFERENCES "microarea"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "paciente" ADD CONSTRAINT "paciente_retiradas_fkey" FOREIGN KEY ("retiradas") REFERENCES "dispensacao"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_unidade_pertecente_fkey" FOREIGN KEY ("id_unidade_pertecente") REFERENCES "unidade_saude"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
