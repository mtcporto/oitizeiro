import { OitizeiroTable } from '@/components/oitizeiro-table';
import { promises as fs } from 'fs';
import path from 'path';
import type { OitizeiroRecord } from '@/lib/types';
import { FileSpreadsheet } from 'lucide-react';

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
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <FileSpreadsheet className="w-10 h-10 text-primary-foreground bg-primary p-2 rounded-lg" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
                Oitizeiro Viewer
              </h1>
              <p className="text-muted-foreground mt-1">
                Visualize, pesquise e gerencie os registros da base de dados.
              </p>
            </div>
          </div>
        </header>
        <OitizeiroTable data={data} />
      </main>
    </div>
  );
}
