import { OitizeiroTable } from '@/components/oitizeiro-table';
import { promises as fs } from 'fs';
import path from 'path';
import type { OitizeiroRecord } from '@/lib/types';
import { FileSpreadsheet, LineChart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const file = await fs.readFile(path.join(process.cwd(), 'src/data/oitizeiro.json'), 'utf8');
  // Add IDs to data if they don't exist
  const rawData: Omit<OitizeiroRecord, 'id'>[] = JSON.parse(file);
  const data: OitizeiroRecord[] = rawData.map((item, index) => ({
    ...item,
    id: String(index + 1),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 md:p-8">
        <header className="mb-8 flex justify-between items-start">
          <div className="flex items-center gap-4 mb-2">
            <FileSpreadsheet className="w-10 h-10 text-primary-foreground bg-primary p-2 rounded-lg" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
                Mercado do Oitizeiro
              </h1>
            </div>
          </div>
          <Link href="/analytics" passHref>
            <Button variant="outline">
              <LineChart className="mr-2 h-4 w-4" />
              Análise de Dados
            </Button>
          </Link>
        </header>
        <OitizeiroTable data={data} />
      </main>
    </div>
  );
}
