"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/ui/components/popover";

export function Combobox({
  data,
  value,
  onSelect,
}: {
  data: { value: string; label: string }[];
  value?: string;
  onSelect?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const list = data || [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? list.find((item) => item.value === value)?.label
            : "Seleccionar otra lista"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar lista..." />
          <CommandEmpty>No encontrada.</CommandEmpty>
          <CommandGroup>
            {list.map((item) => (
              <CommandItem
                key={item.value}
                onSelect={() => {
                  const next = item.value === value ? "" : item.value;
                  setOpen(false);
                  onSelect?.(next);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
