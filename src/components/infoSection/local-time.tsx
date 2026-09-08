"use client";

import { useTranslation } from "@/lib/i18n";
import { TIMEZONE } from "@/constants/profile";
import { RiTimeLine } from "@remixicon/react";
import { useEffect, useState } from "react";

function getTime() {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: TIMEZONE,
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(new Date());
}

export function LocalTime() {
	const { t } = useTranslation();
	const [time, setTime] = useState<string | null>(null);

	useEffect(() => {
		setTime(getTime());
		const interval = setInterval(() => setTime(getTime()), 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col gap-2">
			<p className="text-text-sub-600 uppercase font-bold text-sm">{t("localTime")}</p>
			<div className="flex items-center gap-2">
				<RiTimeLine className="size-4 text-text-strong-950" />
				<p className="text-text-strong-950 uppercase font-normal text-sm">{time}</p>
			</div>
		</div>
	);
}
