import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table"
import React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "./input"
import { useUser } from "@/context/UserContext"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  toolbar?: React.ReactNode
}

export function DataTable<TData extends object, TValue>({
  columns,
  data,
  toolbar,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const { user } = useUser()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter,
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filtrer par email ou nom..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm border-2"
        />
        {toolbar}
      </div>
      <div className="rounded-md border border-[#6b6b6b7e]">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className="border-[#6b6b6b7e]">
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  className={
                    header.column.getCanSort()
                      ? "cursor-pointer select-none"
                      : ""
                  }
                  onClick={header.column.getToggleSortingHandler()}
                  title={
                    header.column.getCanSort()
                      ? header.column.getNextSortingOrder() === "asc"
                        ? "Trier par ordre croissant"
                        : header.column.getNextSortingOrder() === "desc"
                          ? "Trier par ordre décroissant"
                          : "Annuler le tri"
                      : undefined
                  }
                >
                  <div className="flex items-center gap-1">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: <ChevronUp size={16} />, desc: <ChevronDown size={16} /> }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} className={`border-[#6b6b6b7e] ${
                user && 'id' in row.original && row.original.id === user.id
                  ? 'bg-[#f5f5f5] dark:bg-[#27272a]'
                  : ''
              }`}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}
