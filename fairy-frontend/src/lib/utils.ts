import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type SheetData = {
  name: string;
  headers: string[];
  rows: string[][];
};

export async function parseExcelFile(file: File): Promise<SheetData[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  return workbook.SheetNames.map((name) => {
      const worksheet = workbook.Sheets[name];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
      const [headers = [], ...rows] = json;

      return {
          name,
          headers: headers as string[],
          rows: rows as string[][],
      };
  });
}
