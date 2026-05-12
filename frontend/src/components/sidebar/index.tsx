
'use client';

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { Settings, FileChartColumn, ChartColumnStacked, Users, PillBottle, Menu, Home } from "lucide-react";


const navLinks = [
    { href: "/dashboard", icon: Home, label: "Início" },
    { href: "/dispensacao", icon: PillBottle, label: "Dispensação" },
    { href: "/paciente", icon: Users, label: "Pacientes" },
    { href: "/estoque", icon: ChartColumnStacked, label: "Estoque" },
    { href: "/estoque/relatorio", icon: FileChartColumn, label: "Relatórios" },
    { href: "#", icon: Settings, label: "Configurações" },
];

export default function AppSidebar() {
    return (
        <div className="contents">

            {/* Sidebar desktop */}
            <aside className="p-4 hidden sm:flex flex-col fixed left-0 top-0 h-screen w-56 
            border-r z-40">

                {/* Logo */}
                <div className="flex items-center justify-center w-45">
                    <Image
                        src="/logo_hiperdia.svg"
                        alt="Logo do sistema"
                        width={120}
                        height={40}
                        priority
                        className="w-full h-auto"
                    />
                </div>

                <nav className="flex flex-col gap-1 p-3 flex-1 w-full">
                    {navLinks.map(({ href, icon: Icon, label }) => (
                        <Link
                            key={label}
                            href={href}
                            className="flex items-center gap-3 rounded-lg w-full text-[20px] max-w-full font-medium
                            text-[#003967] hover:bg-[#9ACAE4] hover:text-[#003967] transition-colors"
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            {label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Sidebar mobile */}
            <div className="sm:hidden flex sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex h-16 items-center px-4 border-b gap-4 sm:static
                sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline" className="sm:hidden rounded-full bg-transparent border-none text-[#003967]">
                                <Menu className='w-5 h-5' />
                                <span className="sr-only">Abrir</span>
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="sm:max-w-xs">
                            <nav className="p-10 grid text-lg font-medium">

                                {/* Logo Mobile */}
                                <div className="flex items-center justify-center mb-6">
                                    <Link href="/dashboard" prefetch={false}>
                                        <Image
                                            src="/logo_hiperdia.svg"
                                            alt="Logo do sistema"
                                            width={130}
                                            height={45}
                                            priority
                                            className="w-auto h-auto object-contain"
                                        />
                                    </Link>
                                </div>

                                {/* Ícone de ínicio da sidebar */}
                                <Link
                                    href="/dashboard"
                                    className="p-2 flex items-center gap-4 px-2.5 text-muted-[#9ACAE4]
                                hover:text-[#003967] text-[22px]"
                                    prefetch={false}
                                >
                                    <Home className="h-5 w-5 transition-all" />
                                    <p>Início</p>
                                </Link>

                                {/* Ícone de dispensação da sidebar */}
                                <Link
                                    href="/dispensacao"
                                    className="p-2 flex items-center gap-4 px-2.5 text-muted-[#9ACAE4]
                                hover:text-[#003967] text-[22px]"
                                    prefetch={false}
                                >
                                    <PillBottle className="h-5 w-5 transition-all" />
                                    Dispensação
                                </Link>

                                {/* Ícone de pacientes da sidebar */}
                                <Link
                                    href="/paciente"
                                    className="p-2 flex items-center gap-4 px-2.5 text-muted-[#9ACAE4]
                                hover:text-[#003967] text-[22px]"
                                    prefetch={false}
                                >
                                    <Users className="h-5 w-5 transition-all" />
                                    Pacientes
                                </Link>

                                {/* Ícone de estoque da sidebar */}
                                <Link
                                    href="/estoque"
                                    className="p-2 flex items-center gap-4 px-2.5 text-muted-[#9ACAE4]
                                hover:text-[#003967] text-[22px]"
                                    prefetch={false}
                                >
                                    <ChartColumnStacked className="h-5 w-5 transition-all" />
                                    Estoque
                                </Link>

                                {/* Ícone de relatórios da sidebar */}
                                <Link
                                    href="/estoque/relatorio"
                                    className="p-2 flex items-center gap-4 px-2.5 text-muted-[#9ACAE4]
                                hover:text-[#003967] text-[22px]"
                                    prefetch={false}
                                >
                                    <FileChartColumn className="h-5 w-5 transition-all" />
                                    Relatórios
                                </Link>

                                {/* Ícone de configurações da sidebar */}
                                <Link
                                    href="#"
                                    className="p-2 flex items-center gap-4 px-2.5 text-muted-[#9ACAE4]
                                hover:text-[#003967] text-[22px]"
                                    prefetch={false}
                                >
                                    <Settings className="h-5 w-5 transition-all" />
                                    Configurações
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>
            </div>
        </div>
    )
}