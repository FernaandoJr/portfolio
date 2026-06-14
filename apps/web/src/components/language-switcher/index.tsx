"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import i18n, { useTranslation } from "@repo/i18n";
import Image from "next/image";

const languages = [
	{ name: "ptBR", label: "portuguese", image: "/pt-br.svg" },
	{ name: "enUS", label: "english", image: "/en.svg" },
];

function setLocaleCookie(locale: string) {
	document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LanguageSwitcher() {
	const { t, i18n: i18nCtx } = useTranslation();
	const selectedLang = languages.find((l) => l.name === i18nCtx.language) ?? languages[0]!;

	function handleChange(lang: string) {
		setLocaleCookie(lang);
		i18n.changeLanguage(lang);
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
				{languages.map((lang) => (
					<DropdownMenuItem key={lang.name} onClick={() => handleChange(lang.name)}>
						<Image
							src={lang.image}
							alt={lang.label}
							width={16}
							height={12}
							className="rounded-sm"
							style={{ width: 16, height: 12 }}
						/>
						{t(lang.label)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
