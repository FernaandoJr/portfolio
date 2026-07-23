"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import i18n, { useTranslation } from "@/lib/i18n";
import { isLocale, isLocaleSegment, toSegment } from "@/lib/i18n/routing";
import { useCurrentLanguage } from "@/lib/i18n/use-current-language";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const languages = [
	{ name: "ptBR", label: "portuguese", image: "/pt-br.svg" },
	{ name: "enUS", label: "english", image: "/en.svg" },
];

function swapLocaleSegment(pathname: string, segment: string): string {
	const parts = pathname.split("/");
	if (parts[1] && isLocaleSegment(parts[1])) {
		parts[1] = segment;
		return parts.join("/");
	}
	return `/${segment}`;
}

export function LanguageSwitcher() {
	const { t } = useTranslation();
	const currentLanguage = useCurrentLanguage();
	const pathname = usePathname();
	const router = useRouter();

	const selectedLang = languages.find((l) => l.name === currentLanguage) ?? languages[0]!;

	function handleChange(lang: string) {
		void i18n.changeLanguage(lang);
		if (!isLocale(lang)) return;
		router.push(swapLocaleSegment(pathname, toSegment(lang)));
	}

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
							onClick={() => handleChange(lang.name)}
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
