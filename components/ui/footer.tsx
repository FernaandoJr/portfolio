"use client"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "react-i18next"

export default function Footer() {
	const { t } = useTranslation()
	return (
		<footer className="mx-auto w-full bg-background md:container">
			<div className="mx-auto px-4 py-16 sx:mx-3 sx:px-3 sm:px-6 lg:px-8">
				<Separator className="my-8" />
				<div className="flex flex-col items-center justify-between sm:flex-row">
					<p className="text-xs text-muted-foreground">
						{t("footer", { date: new Date().getFullYear() })}
					</p>
					<div className="mt-4 flex space-x-4 sm:mt-0">
						<p className="cursor-pointer text-xs text-muted-foreground hover:text-primary">
							{t("madeWithLove")}
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}
