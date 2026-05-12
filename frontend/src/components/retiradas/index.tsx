import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Retiradas() {
    return (
        <Card className="w-full rounded-xl shadow-sm border-none ring-1 ring-gray-100 bg-white h-full">  
            <CardHeader className="pb-4">
                <CardTitle>
                    <h2 className='text-lg sm:text-xl font-bold text-[#003967]'>
                        Últimas Retiradas
                    </h2>
                </CardTitle>
            </CardHeader>
            
            <CardContent className="flex flex-col gap-4">
                <article className="flex items-center gap-3 border-b border-gray-100 pb-3 w-full last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1976d2] font-bold text-sm">
                        FS
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">Fulano da Silva</span>
                        <span className="text-xs text-gray-500">Há 2 horas</span>
                    </div>
                </article>

                <article className="flex items-center gap-3 border-b border-gray-100 pb-3 w-full last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                        BS
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">Beltrano Sousa</span>
                        <span className="text-xs text-gray-500">Há 5 horas</span>
                    </div>
                </article>

                <article className="flex items-center gap-3 border-b border-gray-100 pb-3 w-full last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                        CS
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">Cicrano Silva</span>
                        <span className="text-xs text-gray-500">Ontem</span>
                    </div>
                </article>
            </CardContent>
        </Card>
    )
}