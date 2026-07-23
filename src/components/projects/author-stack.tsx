"use client";

import { GradientAvatar } from "@outpacelabs/avatars";

import { AvatarGroup, type AvatarGroupItem } from "@/components/ui/avatar-group";
import { findPerson } from "@/constants/people";
import { useTranslation } from "@/lib/i18n";

export type ProjectAuthor = { id: string; roleKey?: string | undefined };

const PIXELS = { default: 34, sm: 26 } as const;

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
		.map((author) => ({ ...author, person: findPerson(author.id) }))
		.filter((author) => author.person !== undefined)
		.map(({ id, roleKey, person }) => ({
			id,
			node: <GradientAvatar seed={id} size={pixels} pattern="dither" radius={0} />,
			label: roleKey ? `${person!.name} · ${t(roleKey)}` : person!.name,
			href: person!.github ?? person!.url,
		}));

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
