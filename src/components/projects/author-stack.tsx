"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarGroup, type AvatarGroupItem } from "@/components/ui/avatar-group";
import { people } from "@/constants/people";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type ProjectAuthor = { id: string; roleKey?: string | undefined };

const PIXELS = { default: 34, sm: 26 } as const;

const AVATAR_COLORS = [
	"bg-avatar-1/20 text-avatar-1",
	"bg-avatar-2/20 text-avatar-2",
	"bg-avatar-3/20 text-avatar-3",
	"bg-avatar-4/20 text-avatar-4",
	"bg-avatar-5/20 text-avatar-5",
	"bg-avatar-6/20 text-avatar-6",
] as const;

function initialsOf(name: string): string {
	const parts = name.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";

	return `${first}${last}`.toUpperCase();
}

export function AuthorStack({
	authors,
	size = "default",
}: {
	authors: ProjectAuthor[];
	size?: keyof typeof PIXELS;
}) {
	const { t } = useTranslation();

	const pixels = PIXELS[size];

	const items: AvatarGroupItem[] = authors
		.map((author) => ({ ...author, index: people.findIndex((person) => person.id === author.id) }))
		.filter((author) => author.index >= 0)
		.map(({ id, roleKey, index }) => {
			const person = people[index]!;

			return {
				id,
				node: (
					<Avatar className="size-full">
						<AvatarFallback
							className={cn(
								"font-semibold leading-none",
								AVATAR_COLORS[index % AVATAR_COLORS.length]
							)}
							style={{ fontSize: pixels * 0.4 }}
						>
							{initialsOf(person.name)}
						</AvatarFallback>
					</Avatar>
				),
				label: roleKey ? `${person.name} · ${t(roleKey)}` : person.name,
				href: person.github ?? person.url,
			};
		});

	if (items.length === 0) return null;

	return (
		<AvatarGroup
			items={items}
			size={pixels}
			maxVisible={4}
			overlap={Math.round(pixels * 0.35)}
			ring={2}
		/>
	);
}
