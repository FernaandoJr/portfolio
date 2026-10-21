"use client";

import { AvatarGroup, type AvatarGroupItem } from "@/components/ui/avatar-group";
import { people } from "@/constants/people";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type ProjectAuthor = { id: string; roleKey?: string | undefined };

const PIXELS = { default: 34, sm: 26 } as const;

const AVATAR_COLORS = [
	"bg-feature-base/30 text-feature-dark dark:text-purple-200",
	"bg-verified-base/30 text-verified-dark dark:text-sky-200",
	"bg-away-base/30 text-away-dark dark:text-yellow-200",
	"bg-success-base/30 text-success-dark dark:text-green-200",
	"bg-highlighted-base/30 text-highlighted-dark dark:text-pink-200",
	"bg-stable-base/30 text-stable-dark dark:text-teal-200",
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
					<div
						className={cn(
							"flex size-full items-center justify-center font-semibold leading-none",
							AVATAR_COLORS[index % AVATAR_COLORS.length]
						)}
						style={{ fontSize: pixels * 0.4 }}
					>
						{initialsOf(person.name)}
					</div>
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
