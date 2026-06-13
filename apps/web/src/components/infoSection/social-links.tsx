"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { socials } from "@/constants/socials";
import Image from "next/image";
import Link from "next/link";

export function SocialLinks() {
	return (
		<div className="flex items-center gap-2 my-4">
			{socials.map((social) => (
				<Tooltip key={social.label}>
					<TooltipTrigger className="inline-flex items-center justify-center rounded-md p-2 opacity-50 hover:opacity-100 hover:bg-accent transition-all">
						<Link
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.label}
						>
							<Image
								src={social.icon}
								alt={social.label}
								width={16}
								height={16}
								className="dark:invert"
							/>
						</Link>
					</TooltipTrigger>
					<TooltipContent>{social.label}</TooltipContent>
				</Tooltip>
			))}
		</div>
	);
}
