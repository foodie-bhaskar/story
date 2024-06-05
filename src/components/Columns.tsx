import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Option } from "@/App.type"

export type Dropdown = {
    uiId: string
    cascade: string,
    defaultValue?: string,
    options: Option[],
    created_by_user: string
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const Columns: ColumnDef<Dropdown>[] = [
  {
    accessorKey: "uiId",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "cascade",
    header: "Cascade Group",
  },
  {
    accessorKey: "options",
    //header: "No. of Options",
    header: () => <div className="text-right">No. of Options</div>,
    cell: ({ row }) => {
      const optionCount = row.getValue("options").length
      /* const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(optionCount) */
 
      return <div className="text-right font-medium">{optionCount}</div>
    },
  },
  {
    accessorKey: "defaultValue",
    header: "Default Selected"
  },
  {
    accessorKey: "created_by_user",
    header: "Created By",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const dropdown = row.original
      const navigate = useNavigate();
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
              onClick={() => {
                navigate(`/dropdown/${dropdown.uiId}`);
              }}>
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => {
                // navigator.clipboard.writeText(dropdown.uiId);
                navigate(`/dropdown/edit/${dropdown.uiId}`);
              }}>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
