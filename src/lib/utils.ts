import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function capitalizeFirstLetter(str: string) {
  if (!str) return str; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export function capitalizeWords(str: string) {
  if (!str) return str; // Handle empty strings
  return str
    .split('-')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
}

