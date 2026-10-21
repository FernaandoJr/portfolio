"use client";

import { useTranslation } from "@/lib/i18n";

export default function QuoteSection() {
	const { t } = useTranslation();

	return (
		<section className="w-full">
			<figure className="flex flex-col gap-6 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-8">
				<blockquote className="text-lg font-serif font-light leading-snug tracking-tight text-text-strong-950 sm:text-xl">
					<span className="text-text-sub-600/40 text-2xl font-serif leading-none select-none">
						{"“"}
					</span>
					{t("quoteText")}
					<span className="text-text-sub-600/40 text-2xl font-serif leading-none select-none">
						{"”"}
					</span>
				</blockquote>
				<figcaption className="flex items-center gap-3">
					<div className="h-px w-8 bg-text-sub-600/30" />
					<span className="text-sm text-text-sub-600 font-medium">{t("quoteAuthor")}</span>
				</figcaption>
			</figure>
		</section>
	);
}
