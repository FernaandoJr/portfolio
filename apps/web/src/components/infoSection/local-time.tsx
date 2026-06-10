"use client"

import { useTranslation } from "@repo/i18n"
import { ClockIcon } from "lucide-react"
import { useEffect, useState } from "react"

const SP_TIMEZONE = "America/Sao_Paulo"

function getTime() {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: SP_TIMEZONE,
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(new Date())
}

export function LocalTime() {
	const { t } = useTranslation()
	const [time, setTime] = useState(getTime)

	useEffect(() => {
		const interval = setInterval(() => setTime(getTime()), 1000)
		return () => clearInterval(interval)
	}, [])

	return (
		<div className="flex flex-col gap-2">
			<p className="text-muted-foreground uppercase font-bold text-sm">
				{t("localTime")}
			</p>
			<div className="flex items-center gap-2">
				<ClockIcon className="size-4 text-foreground" />
				<p className="text-foreground uppercase font-normal text-sm">{time}</p>
			</div>
		</div>
	)
}
