"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/routing";
import { useLocaleStore } from "@/lib/i18n/store";
import { cn } from "@/lib/utils";
import Image from "next/image";

const LANGUAGES: Record<Locale, { label: string; image: string; next: Locale }> = {
	ptBR: { label: "portuguese", image: "/pt-br.svg", next: "enUS" },
	enUS: { label: "english", image: "/en.svg", next: "ptBR" },
};

export function LanguageSwitcher({ className }: { className?: string }) {
	const { t } = useTranslation();
	const locale = useLocaleStore((state) => state.locale);
	const setLocale = useLocaleStore((state) => state.setLocale);

	const current = LANGUAGES[locale];
	const next = LANGUAGES[current.next];

	return (
		<Button
			variant="link"
			size="icon"
			aria-label={t("switchTo", { language: t(next.label) })}
			className={cn("cursor-pointer", className)}
			onClick={() => setLocale(current.next)}
		>
			<Image
				src={current.image}
				alt={t(current.label)}
				width={20}
				height={14}
				className="rounded-sm"
				style={{ width: 20, height: 14 }}
			/>
		</Button>
	);
}
