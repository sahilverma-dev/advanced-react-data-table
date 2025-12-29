"use client";

import * as React from "react";
import type { Row, Table } from "@tanstack/react-table";
import type { Product, User } from "@/app/types/product";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChangeOwnerModal } from "@/components/modals/change-owner-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataTableOwnerCellProps {
  row: Row<Product>;
  table: Table<Product>;
}

export function DataTableOwnerCell({ row }: DataTableOwnerCellProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const initialOwner = row.original.owner;
  const [owner, setOwner] = React.useState<User>(initialOwner);

  // In a real app, we would update the server/global state here.
  // For now, we update local state to reflect the change.
  const handleOwnerChange = (newOwner: User) => {
    setOwner(newOwner);
    console.log("Owner changed to:", newOwner);
  };

  return (
    <>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            className="flex items-center gap-2 rounded-full p-1 -ml-1 hover:bg-muted/50 transition-colors max-w-full"
            onClick={() => setIsModalOpen(true)}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={owner.avatarUrl} alt={owner.name} />
              <AvatarFallback>{owner.name[0]}</AvatarFallback>
            </Avatar>
            <span className="truncate text-sm text-foreground/80 max-w-[100px] hidden xl:inline-block">
              {owner.name}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent>Click to change owner</TooltipContent>
      </Tooltip>

      <ChangeOwnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentOwner={owner}
        onOwnerChange={handleOwnerChange}
      />
    </>
  );
}
