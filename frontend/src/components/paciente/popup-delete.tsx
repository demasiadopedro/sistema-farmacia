"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
    
    deletePacienteAction,
} from "@/actions/paciente";
import { Paciente } from "@/types/paciente";


interface ModalPacienteProps {
    onClose?: () => void;
    pacienteEditando?: Paciente | null;
}

export default function PopupDelete({ onClose, pacienteEditando }: ModalPacienteProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pacienteEditando) {
            setError("Paciente não encontrado.");
            return;
        }

        setLoading(true);
        setError(null);
        setSucesso(false);

        try {
            const result = await deletePacienteAction(pacienteEditando.id);


            if (result.error) {
                const errorMsg = Array.isArray(result.error) ? result.error.join(', ') : result.error;
                setError(errorMsg);
            } else {
                setSucesso(true);
                setTimeout(() => {
                    if (onClose) {
                        onClose();
                    }
                    router.refresh();
                    router.push("/paciente");
                }, 1500);
            }
        } catch (err) {
            setError("Ocorreu um erro inesperado ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white grid gap-y-5">
            {/* Header */}
            <div className="flex flex-col gap-2 pb-2 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-slate-900">
                    Você tem certeza que quer deletar este paciente?
                </h2>
                <p className="text-sm text-gray-500">
                    Esta ação não pode ser desfeita. Todos os dados relacionados a este paciente serão permanentemente removidos.
                </p>
            </div>

            {/* Mensagens */}
            {error && (
                <div className="p-1 rounded-md bg-red-50 border border-red-200 flex gap-2">
                    <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
            )}
            {sucesso && (
                <div className="p-1 rounded-md bg-green-50 border border-green-200 flex gap-2">
                    <span className="text-green-700 text-sm font-medium">✓ Paciente deletado com sucesso!</span>
                </div>
            )}

            
            {/* Botões */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
                {onClose && (
                    <Button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-11 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors text-sm font-semibold"
                        disabled={loading}
                    >
                        Não, cancelar
                    </Button>
                )}
                <Button
                    type="submit"
                    className={`${onClose ? 'flex-1' : 'w-full'} h-11 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors text-sm font-semibold shadow-sm disabled:opacity-60`}
                    disabled={loading}
                >
                    {loading ? "Deletando..." : "Sim, deletar"}
                </Button>
            </div>
        </form>
    );
}