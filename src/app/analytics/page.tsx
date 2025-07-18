import { promises as fs } from 'fs';
import path from 'path';
import type { OitizeiroRecord } from '@/lib/types';
import { ActivityChart } from '@/components/activity-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Users } from 'lucide-react';

export default async function AnalyticsPage() {
  const file = await fs.readFile(path.join(process.cwd(), 'src/data/oitizeiro.json'), 'utf8');
  const data: Omit<OitizeiroRecord, 'id'>[] = JSON.parse(file);

  // 1. Process data for activity chart
  const activityCounts = data.reduce((acc, record) => {
    let activity = record.Atividade && record.Atividade.trim() !== "0" && record.Atividade.trim() !== "" ? record.Atividade.trim() : "Outras";
    acc[activity] = (acc[activity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(activityCounts)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  // 2. Process data for responsible with multiple entries
  const responsibleCounts = data.reduce((acc, record) => {
    const responsible = record["Responsável pelo cadastro"].trim();
    if (responsible) {
      acc[responsible] = (acc[responsible] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const multipleEntriesResponsible = Object.entries(responsibleCounts)
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);

  // 3. Process data for invalid CPFs
  const invalidCpfRecords = data.filter(record => {
    const name = record["Nome Completo"].toLowerCase();
    const isSpecialCase = name.includes('alugado') || name.includes('fechado');
    const isCpfInvalid = record.CPF.trim() === '000000000-00';
    return isCpfInvalid && !isSpecialCase;
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="container mx-auto mb-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/" passHref>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    Análise de Dados
                </h1>
            </div>
        </div>
        <p className="text-muted-foreground mt-2">
          Visão geral das atividades e qualidade dos dados dos registros.
        </p>
      </header>

      <main className="container mx-auto grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Registros por Atividade</CardTitle>
            <CardDescription>Distribuição dos registros com base na atividade exercida.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart data={chartData} />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        <CardTitle>Responsáveis com Múltiplos Cadastros</CardTitle>
                    </div>
                    <CardDescription>Responsáveis que aparecem mais de uma vez nos registros.</CardDescription>
                </CardHeader>
                <CardContent>
                    {multipleEntriesResponsible.length > 0 ? (
                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {multipleEntriesResponsible.map(([name, count]) => (
                            <li key={name} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                            <span>{name}</span>
                            <Badge variant="secondary">{count} registros</Badge>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">Nenhum responsável com múltiplos cadastros encontrado.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                        <CardTitle>Registros com CPF Inválido</CardTitle>
                    </div>
                    <CardDescription>Registros com CPF '000000000-00' que não são casos especiais.</CardDescription>
                </CardHeader>
                <CardContent>
                    {invalidCpfRecords.length > 0 ? (
                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {invalidCpfRecords.map((record, index) => (
                            <li key={index} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                            <span className="truncate pr-4">{record["Nome Completo"]}</span>
                            <Badge variant="destructive">{record.CPF}</Badge>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">Nenhum registro com CPF inválido encontrado.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}