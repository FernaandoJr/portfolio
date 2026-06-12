"use client"

import { useTranslation } from "@repo/i18n"

export default function QuoteSection() {
	const { t } = useTranslation()

	return (
		<section className="w-full">
			<div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
				<figure className="flex flex-col gap-6 rounded-xl border border-border bg-card p-8">
					<blockquote className="text-lg font-serif font-light leading-snug tracking-tight text-foreground sm:text-xl">
						<span className="text-muted-foreground/40 text-2xl font-serif leading-none select-none">"</span>
						{t("quoteText")}
						<span className="text-muted-foreground/40 text-2xl font-serif leading-none select-none">"</span>
					</blockquote>
					<figcaption className="flex items-center gap-3">
						<div className="h-px w-8 bg-muted-foreground/30" />
						<span className="text-sm text-muted-foreground font-medium">
							{t("quoteAuthor")}
						</span>
					</figcaption>
				</figure>
			</div>
		</section>
	)
}
