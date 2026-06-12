import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const monthKeyMap: Record<string, string> = {
  Jan: "monthJan", Feb: "monthFeb", Mar: "monthMar", Apr: "monthApr",
  May: "monthMay", Jun: "monthJun", Jul: "monthJul", Aug: "monthAug",
  Sep: "monthSep", Oct: "monthOct", Nov: "monthNov", Dec: "monthDec",
}

export function translateDate(date: string, t: (key: string) => string): string {
  return date.replace(/^([A-Za-z]{3})/, (abbr) => {
    const key = monthKeyMap[abbr]
    return key ? t(key) : abbr
  })
}
