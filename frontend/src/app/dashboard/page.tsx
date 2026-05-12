
import Sidebar from '@/components/sidebar'
import { ChevronRight, Users, ClipboardList, User, PillBottle } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import ChartOverview from '@/components/chart';
import Retiradas from '@/components/retiradas';
import { auth } from "@/auth";

const actionCards = [


    {
        href: "/dispensacao",
        icon: PillBottle,
        label: "Dispensar Medicamentos",
    },

    {
        href: "/paciente",
        icon: User,
        label: "Pacientes Cadastrados",
    },

    {
        href: "/paciente/cadastro",
        icon: Users,
        label: "Cadastrar Novo Paciente",
    },

    {
        href: "/estoque/relatorio",
        icon: ClipboardList,
        label: "Relatório de Estoque",
    },
];

export default async function AppHome() {
    const session = await auth();
    const userName = session?.user?.name || "Visitante";

    return (
        <main className='sm:ml-56 min-h-screen bg-gray-50 flex flex-col'>
            <div className='relative flex items-center bg-white border-b
                border-gray-200 p-4 h-16 shadow-sm shrink-0'>
                <Sidebar />
                <h1 className='text-2xl font-bold text-[#003967] whitespace-nowrap tracking-tight'>Olá, {userName}</h1>
            </div>
            <section className='p-4 md:p-8 pb-0'>
                <Card className='rounded-xl shadow-sm border-none ring-1 ring-gray-100 bg-white'>
                    <CardHeader className="pb-6">
                        {/* Cards de ações rápidas */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
                            {actionCards.map(({ href, icon: Icon, label }) => (
                                <Link
                                    href={href}
                                    key={href}
                                    className='flex flex-col items-start gap-4 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 rounded-xl p-5 transition-all group'
                                >
                                    <div className='w-12 h-12 flex items-center justify-center bg-blue-50 text-[#1976d2] group-hover:bg-[#1976d2] group-hover:text-white transition-colors rounded-lg'>
                                        <Icon className='w-6 h-6' />
                                    </div>

                                    <div className='flex items-center justify-between w-full mt-2'>
                                        <span className='text-[16px] font-semibold text-gray-800 leading-snug'>
                                            {label}
                                        </span>
                                        <ChevronRight className='w-5 h-5 text-gray-400 group-hover:text-[#1976d2] transition-colors shrink-0' />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardHeader>
                </Card>
            </section>

            <section className='grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-8 flex-1'>
                <div className="lg:col-span-2">
                    <ChartOverview />
                </div>
                <div className="lg:col-span-1">
                    <Retiradas />
                </div>
            </section>
        </main>
    )
}