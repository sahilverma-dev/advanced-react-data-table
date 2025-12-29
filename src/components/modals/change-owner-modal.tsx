"use client";

import * as React from "react";
import type { User } from "@/app/types/product";
import { users } from "@/app/data/users";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChangeOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOwner: User;
  onOwnerChange: (newOwner: User) => void;
}

export function ChangeOwnerModal({
  isOpen,
  onClose,
  currentOwner,
  onOwnerChange,
}: ChangeOwnerModalProps) {
  const [search, setSearch] = React.useState("");

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Owner</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ScrollArea className="h-[300px] pr-4">
            <div className="flex flex-col gap-2">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  className={cn(
                    "flex items-center gap-3 rounded-md p-2 text-left text-sm transition-colors hover:bg-accent",
                    currentOwner.id === user.id && "bg-accent"
                  )}
                  onClick={() => {
                    onOwnerChange(user);
                    onClose();
                  }}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
