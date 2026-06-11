export const subtitleKeys = [
	"technologyEnthusiast",
	"passionateAboutProgramming",
	"designEngineer",
	"softwareBuilder",
	"detailObsessed",
] as const

export type SubtitleKey = (typeof subtitleKeys)[number]
