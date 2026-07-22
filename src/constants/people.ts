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
];

export function findPerson(id: string): Person | undefined {
	return people.find((person) => person.id === id);
}

export function initialsOf(name: string): string {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");
}
