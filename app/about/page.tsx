"use client"

import Href from "@/components/ui/href"
import { Trans, useTranslation } from "react-i18next"

export default function AboutPage() {
	const { t } = useTranslation()

	return (
		<div className="container mx-auto pt-18 px-4 sm:px-6 lg:px-8">
			<div className="flex justify-center flex-col gap-2 items-center my-10">
				<h1 className="text-4xl font-bold my-8">{t("about.title")}</h1>
				<article className="text-md max-w-2xl leading-8 text-justify flex flex-col gap-6">
					<p>
						<Trans
							i18nKey="about.p1"
							components={[
								<Href
									key="p1-link"
									href="https://pt.wikipedia.org/wiki/Mogi_Gua%C3%A7u"
								/>,
							]}
						/>
					</p>
					<p>{t("about.p2")}</p>
					<p>{t("about.p3")}</p>
					<p>{t("about.p4")}</p>
					<p>
						<Trans
							i18nKey="about.p5"
							components={[
								<Href
									key="p5-link"
									href="https://fatecmm.cps.sp.gov.br/"
								/>,
							]}
						/>
					</p>
					<p>
						<Trans
							i18nKey="about.p6"
							components={[
								<Href
									key="p6-link1"
									href="https://www.agrocrm.com.br/"
								/>,
								<Href
									key="p6-link2"
									href="https://www.genexus.com/"
								/>,
							]}
						/>
					</p>
					<p>{t("about.p7")}</p>
					<p>{t("about.p8")}</p>
					<p>{t("about.p9")}</p>
				</article>
			</div>
		</div>
	)
}
