"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/new-hover-card";
import { findPerson, initialsOf } from "@/constants/people";
import { useTranslation } from "@/lib/i18n";

export type ProjectAuthor = { id: string; roleKey?: string | undefined };

export function AuthorStack({ authors }: { authors: ProjectAuthor[] }) {
	const { t } = useTranslation();

	const resolved = authors
		.map((author) => ({ ...author, person: findPerson(author.id) }))
		.filter((author) => author.person !== undefined);

	if (resolved.length === 0) return null;

	return (
		<div className="flex items-center gap-3 select-none">
			<AvatarGroup>
				{resolved.map(({ id, roleKey, person }) => {
					const name = person!.name;

					return (
						<HoverCard key={id} openDelay={100}>
							<HoverCardTrigger className="cursor-pointer rounded-full">
								<Avatar>
									{person!.avatar && <AvatarImage src={person!.avatar} alt={name} />}
									<AvatarFallback>{initialsOf(name)}</AvatarFallback>
								</Avatar>
							</HoverCardTrigger>

							<HoverCardContent className="w-64">
								<div className="flex items-start gap-3">
									<Avatar size="lg">
										{person!.avatar && <AvatarImage src={person!.avatar} alt={name} />}
										<AvatarFallback>{initialsOf(name)}</AvatarFallback>
									</Avatar>

									<div className="flex flex-col gap-1">
										<span className="text-sm font-medium">{name}</span>
										{roleKey && <span className="text-muted-foreground text-xs">{t(roleKey)}</span>}

										{person!.github && (
											<Link
												href={person!.github}
												target="_blank"
												rel="noopener noreferrer"
												className="mt-1 inline-flex items-center gap-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
											>
												<Icon icon="mdi:github" className="size-3.5" />
												{t("viewOnGitHub")}
											</Link>
										)}
									</div>
								</div>
							</HoverCardContent>
						</HoverCard>
					);
				})}
			</AvatarGroup>
		</div>
	);
}
