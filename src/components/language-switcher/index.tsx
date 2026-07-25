"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/routing";
import { useLocaleStore } from "@/lib/i18n/store";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import Image from "next/image";

const languages: { name: Locale; label: string; image: string }[] = [
	{ name: "ptBR", label: "portuguese", image: "/pt-br.svg" },
	{ name: "enUS", label: "english", image: "/en.svg" },
];

export function LanguageSwitcher() {
	const { t } = useTranslation();
	const locale = useLocaleStore((state) => state.locale);
	const setLocale = useLocaleStore((state) => state.setLocale);

	const selectedLang = languages.find((l) => l.name === locale) ?? languages[0]!;

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger
				aria-label={t("languages")}
				className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
			>
				<Image
					src={selectedLang.image}
					alt={selectedLang.label}
					width={20}
					height={14}
					className="rounded-sm"
					style={{ width: 20, height: 14 }}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{languages.map((lang) => {
					const active = lang.name === selectedLang.name;

					return (
						<DropdownMenuItem
							key={lang.name}
							onClick={() => setLocale(lang.name)}
							aria-checked={active}
							className="gap-2 pr-2"
						>
							<Image
								src={lang.image}
								alt={lang.label}
								width={16}
								height={12}
								className="rounded-sm"
								style={{ width: 16, height: 12 }}
							/>
							{t(lang.label)}
							<CheckIcon className={cn("ml-auto size-3.5", active ? "opacity-100" : "opacity-0")} />
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
