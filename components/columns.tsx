"use client";

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/editor/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/editor/ui/dropdown-menu"

export type Submission = {
    createdAt: Date | null,
    submissionEmail: string | null,
    submissionName: string | null,
    submissionMessage: string | null,
}

export const columns: ColumnDef<Submission>[] = [
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Date Submitted
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => {
            const date = new Date().toLocaleDateString('en-us', {  weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
            return <div className="ml-4">{date}</div>
          },
    },
    {
        accessorKey: "submissionEmail",
        header: "Email",
    },
    {
        accessorKey: "submissionName",
        header: "Name",
    },
    {
        accessorKey: "submissionMessage",
        header: "Message",
    },
    {
        id: "actions",
        cell: ({ row }) => {
          const submission = row.original
     
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(submission.submissionEmail || "")}
                >
                  Copy user email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
    },
]