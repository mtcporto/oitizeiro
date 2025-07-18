"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { OitizeiroRecord } from "@/lib/types"

interface RecordDetailsDialogProps {
  record: OitizeiroRecord
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function RecordDetailsDialog({ record, isOpen, onOpenChange }: RecordDetailsDialogProps) {
  const details = Object.entries(record).filter(([key]) => key !== 'id' && key !== 'deletedAt');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes do Registro</DialogTitle>
          <DialogDescription>
            Informações completas de {record["Nome Completo"]}.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            {details.map(([key, value]) => (
              <div key={key} className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-semibold text-muted-foreground col-span-1">{key}</span>
                <span className="col-span-2">{value || "-"}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
