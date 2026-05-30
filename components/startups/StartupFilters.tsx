"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SECTORS } from "@/constants/sectors";
import { ALL_LGAS } from "@/constants/lgas";
import { STAGES } from "@/constants/stages";

export default function StartupFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.replace(`/startups?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => router.replace("/startups");

  const hasFilters =
    searchParams.has("search") ||
    searchParams.has("category") ||
    searchParams.has("lga") ||
    searchParams.has("stage");

  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-neutral-900 text-sm">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-neutral-500 hover:text-red-500 flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Search startups..."
          className="pl-9"
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            if (v.length === 0 || v.length >= 2) updateFilter("search", v);
          }}
        />
      </div>

      {/* Sector */}
      <div className="mb-4">
        <label className="text-xs font-medium text-neutral-600 mb-1.5 block">Sector</label>
        <Select
          value={searchParams.get("category") ?? "all"}
          onValueChange={(v) => updateFilter("category", v)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="All sectors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sectors</SelectItem>
            {SECTORS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* LGA */}
      <div className="mb-4">
        <label className="text-xs font-medium text-neutral-600 mb-1.5 block">LGA</label>
        <Select
          value={searchParams.get("lga") ?? "all"}
          onValueChange={(v) => updateFilter("lga", v)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="All LGAs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All LGAs</SelectItem>
            {ALL_LGAS.map((l) => (
              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stage */}
      <div className="mb-2">
        <label className="text-xs font-medium text-neutral-600 mb-1.5 block">Stage</label>
        <Select
          value={searchParams.get("stage") ?? "all"}
          onValueChange={(v) => updateFilter("stage", v)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="All stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {STAGES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
