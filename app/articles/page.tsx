"use client"
import { Construction } from "lucide-react"
import { useTranslation } from "react-i18next"
export default function Home() {
	const { t } = useTranslation()
	return (
		<div className="container mx-auto py-18 sx:px-3 sx:px-3 sm:px-6 lg:px-8">
			<div className="flex flex-col items-center justify-center h-screen">
				<Construction className="text-primary h-8 w-8 my-4" />
				<p className="text-lg ">{t("pageInDev")}</p>
			</div>
		</div>
	)
}
