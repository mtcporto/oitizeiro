"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { OitizeiroRecord } from "@/lib/types"

interface RecordEditDialogProps {
  record: OitizeiroRecord
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (record: OitizeiroRecord) => void
}

const formSchema = z.object({
  "Nome Completo": z.string().min(3, { message: "O nome completo é obrigatório." }),
  CPF: z.string().min(14, { message: "CPF deve ter 11 dígitos." }).max(14, { message: "CPF deve ter 11 dígitos." }),
  Atividade: z.string().min(1, { message: "Atividade é obrigatória." }),
  Local: z.string().min(1, { message: "Local é obrigatório." }),
  Tempo: z.string().optional(),
  Endereço: z.string().optional(),
  Bairro: z.string().optional(),
  Cidade: z.string().min(1, { message: "Cidade é obrigatória." }),
  Telefone: z.string().optional(),
  "OBS.": z.string().optional(),
  "Responsável pelo cadastro": z.string().min(1, { message: "Responsável é obrigatório." }),
})

export function RecordEditDialog({ record, isOpen, onOpenChange, onSave }: RecordEditDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        "Nome Completo": record["Nome Completo"],
        CPF: record.CPF,
        Atividade: record.Atividade,
        Local: record.Local,
        Tempo: record.Tempo,
        Endereço: record.Endereço,
        Bairro: record.Bairro,
        Cidade: record.Cidade,
        Telefone: record.Telefone,
        "OBS.": record["OBS."],
        "Responsável pelo cadastro": record["Responsável pelo cadastro"],
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({ ...record, ...values })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Registro</DialogTitle>
          <DialogDescription>
            Modifique as informações de {record["Nome Completo"]}. Clique em salvar para aplicar as mudanças.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[60vh] pr-6">
              <div className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="Nome Completo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="CPF"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="Atividade"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Atividade</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="Local"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Local</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                 <FormField
                  control={form.control}
                  name="Endereço"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="Bairro"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="Cidade"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="Telefone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="Tempo"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tempo de Atividade</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="OBS."
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="Responsável pelo cadastro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsável pelo cadastro</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
