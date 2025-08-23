"use client"
import { useTranslation } from "react-i18next"
import i18nInstance from "@/lib/i18n"
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

const languages = [
	{ name: "en", label: "english", image: "/en.svg" },
	{ name: "pt", label: "portuguese", image: "/pt-br.svg" },
]

export default function ChangeLanguage() {
	const { t } = useTranslation()
	const currentLang = i18nInstance.language
	const selectedLang =
		languages.find((l) => l.name === currentLang) ?? languages[0]

	const handleChangeLanguage = (lang: string) => {
		i18nInstance.changeLanguage(lang)
	}

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger>
				<div className="cursor-pointer p-2">
					<Image
						src={selectedLang.image}
						alt={selectedLang.label}
						width={20}
						height={14}
					/>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>{t("languages")}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{languages.map((lang) => (
					<DropdownMenuItem
						key={lang.label}
						onClick={() => handleChangeLanguage(lang.name)}>
						<Image
							src={lang.image}
							alt={lang.label}
							width={16}
							height={12}
						/>
						{t(lang.label)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
