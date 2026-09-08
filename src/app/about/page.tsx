"use client";

import { Trans, useTranslation } from "@/lib/i18n";
import { RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";

function StoryLink({ href, children }: { href: string; children?: React.ReactNode }) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="text-text-strong-950 underline underline-offset-2 hover:text-text-sub-600 transition-colors"
		>
			{children}
		</a>
	);
}

export default function AboutPage() {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-10">
			<Link
				href="/#about"
				className="inline-flex items-center gap-1.5 text-sm text-text-sub-600 hover:text-text-strong-950 transition-colors w-fit"
			>
				<RiArrowLeftLine className="size-3.5" />
				{t("storyBack")}
			</Link>

			<article className="flex flex-col gap-6">
				<h1 className="text-3xl font-bold">{t("storyTitle")}</h1>

				<p className="text-text-sub-600 leading-8 text-justify">
					<Trans
						i18nKey="storyP1"
						components={[
							<StoryLink key="p1" href="https://pt.wikipedia.org/wiki/Mogi_Gua%C3%A7u" />,
						]}
					/>
				</p>

				<p className="text-text-sub-600 leading-8 text-justify">{t("storyP2")}</p>

				<p className="text-text-sub-600 leading-8 text-justify">{t("storyP3")}</p>

				<p className="text-text-sub-600 leading-8 text-justify">{t("storyP4")}</p>

				<p className="text-text-sub-600 leading-8 text-justify">
					<Trans
						i18nKey="storyP5"
						components={[<StoryLink key="p5" href="https://fatecmm.cps.sp.gov.br/" />]}
					/>
				</p>

				<p className="text-text-sub-600 leading-8 text-justify">
					<Trans
						i18nKey="storyP6"
						components={[
							<StoryLink key="p6-1" href="https://www.agrocrm.com.br/" />,
							<StoryLink key="p6-2" href="https://www.genexus.com/" />,
						]}
					/>
				</p>

				<p className="text-text-sub-600 leading-8 text-justify">{t("storyP7")}</p>

				<p className="text-text-sub-600 leading-8 text-justify">{t("storyP8")}</p>

				<p className="text-text-sub-600 leading-8 text-justify">{t("storyP9")}</p>
			</article>
		</div>
	);
}
