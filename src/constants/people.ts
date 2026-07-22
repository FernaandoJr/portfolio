import { SITE_URL } from "@/constants/profile";

export type Person = {
	id: string;
	name: string;
	avatar?: string;
	github?: string;
	url?: string;
};

export const people: Person[] = [
	{
		id: "fernaandojr",
		name: "Fernando Junior",
		avatar: "/pfp_greninja.png",
		github: "https://github.com/FernaandoJr",
		url: SITE_URL,
	},
	// Placeholders so the multi-author layout can be seen. No `github` on
	// purpose: a made-up handle would link to a stranger's real account.
	{ id: "marina-alves", name: "Marina Alves" },
	{ id: "rafael-costa", name: "Rafael Costa" },
	{ id: "beatriz-lima", name: "Beatriz Lima" },
];

export function findPerson(id: string): Person | undefined {
	return people.find((person) => person.id === id);
}
