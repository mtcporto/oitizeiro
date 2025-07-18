"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  Eye,
  FilePenLine,
  Trash2
} from "lucide-react"

import type { OitizeiroRecord } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RecordDetailsDialog } from "./record-details-dialog"
import { RecordEditDialog } from "./record-edit-dialog"
import { RecordDeleteAlert } from "./record-delete-alert"

const ITEMS_PER_PAGE = 20

export function OitizeiroTable({ data: initialData }: { data: OitizeiroRecord[] }) {
  const [data, setData] = React.useState<OitizeiroRecord[]>(initialData)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [activityFilter, setActivityFilter] = React.useState("all")
  const [currentPage, setCurrentPage] = React.useState(1)

  const [selectedRecord, setSelectedRecord] = React.useState<OitizeiroRecord | null>(null)
  const [isDetailsOpen, setDetailsOpen] = React.useState(false)
  const [isEditOpen, setEditOpen] = React.useState(false)
  const [isDeleteOpen, setDeleteOpen] = React.useState(false)

  const uniqueActivities = React.useMemo(() => {
    const activities = new Set(
      initialData
        .map(record => record.Atividade)
        .filter(activity => activity && activity !== "0")
    )
    return ["all", ...Array.from(activities).sort()]
  }, [initialData])

  const handleOpenDetails = (record: OitizeiroRecord) => {
    setSelectedRecord(record)
    setDetailsOpen(true)
  }

  const handleOpenEdit = (record: OitizeiroRecord) => {
    setSelectedRecord(record)
    setEditOpen(true)
  }

  const handleOpenDelete = (record: OitizeiroRecord) => {
    setSelectedRecord(record)
    setDeleteOpen(true)
  }

  const handleSaveRecord = (updatedRecord: OitizeiroRecord) => {
    setData(prevData => prevData.map(r => r.id === updatedRecord.id ? updatedRecord : r))
    setEditOpen(false)
  }
  
  const handleSoftDelete = (recordId: string) => {
    setData(prevData => 
      prevData.map(r => 
        r.id === recordId ? { ...r, deletedAt: new Date().toISOString() } : r
      )
    )
    setDeleteOpen(false)
  }

  const filteredData = React.useMemo(() => {
    return data
      .filter(record => !record.deletedAt)
      .filter(record => {
        const lowercasedTerm = searchTerm.toLowerCase()
        const searchMatch = !searchTerm || (
          record["Nome Completo"].toLowerCase().includes(lowercasedTerm) ||
          record.CPF.toLowerCase().includes(lowercasedTerm) ||
          record["Responsável pelo cadastro"].toLowerCase().includes(lowercasedTerm)
        )
        const activityMatch = activityFilter === "all" || record.Atividade === activityFilter
        return searchMatch && activityMatch
      })
  }, [data, searchTerm, activityFilter])

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activityFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome, CPF ou responsável..."
              className="pl-10 w-full shadow-md"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={activityFilter} onValueChange={setActivityFilter}>
            <SelectTrigger className="w-full sm:w-[220px] shadow-md">
              <SelectValue placeholder="Filtrar por atividade" />
            </SelectTrigger>
            <SelectContent>
              {uniqueActivities.map((activity) => (
                <SelectItem key={activity} value={activity}>
                  {activity === "all" ? "Todas as Atividades" : activity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm font-medium text-muted-foreground self-end md:self-center">
          Total de {filteredData.length} registros
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="font-semibold text-lg">Nome Completo</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-lg">CPF</TableHead>
              <TableHead className="font-semibold text-lg">Atividade</TableHead>
              <TableHead className="hidden lg:table-cell font-semibold text-lg">Cidade</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-lg">Responsável</TableHead>
              <TableHead className="text-right font-semibold text-lg">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map(record => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record["Nome Completo"]}</TableCell>
                  <TableCell className="hidden md:table-cell">{record.CPF}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{record.Atividade}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{record.Cidade}</TableCell>
                  <TableCell className="hidden md:table-cell">{record["Responsável pelo cadastro"]}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDetails(record)}>
                          <Eye className="mr-2 h-4 w-4" /> Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEdit(record)}>
                           <FilePenLine className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleOpenDelete(record)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      
      {selectedRecord && (
        <>
          <RecordDetailsDialog 
            record={selectedRecord} 
            isOpen={isDetailsOpen}
            onOpenChange={setDetailsOpen}
          />
          <RecordEditDialog 
            record={selectedRecord}
            isOpen={isEditOpen}
            onOpenChange={setEditOpen}
            onSave={handleSaveRecord}
          />
          <RecordDeleteAlert
            isOpen={isDeleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={() => handleSoftDelete(selectedRecord.id)}
          />
        </>
      )}
    </div>
  )
}
