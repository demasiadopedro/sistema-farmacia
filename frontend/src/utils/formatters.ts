export const maskCPF = (value: string) => {
    return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
};

export const maskPhone = (value: string) => {
    return value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
};

export const maskCNS = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 15);
};

export function formatarData(dataIso: string | null | undefined): string {
    if (!dataIso) return "Não registrada";
    const data = new Date(dataIso);
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(data);
}
