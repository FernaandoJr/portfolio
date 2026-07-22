/* eslint-disable @next/next/no-img-element -- next/image does not exist in the
   Satori runtime; raw <img> is the only supported element there. */

/**
 * Satori (next/og) resolves neither CSS variables nor oklch, so the palette is
 * inlined here as hex. Values are the .dark tokens from globals.css converted
 * to sRGB — keep them in sync if those tokens change.
 */
const COLOR = {
	background: "#141414",
	foreground: "#e6e2dc",
	card: "#1c1c1c",
	border: "#2c2c2c",
	muted: "#8c8a85",
};

export interface BlogProps {
	category: string;
	title: string;
	excerpt: string;
	author: string;
	meta: string;
	avatar?: string;
	brand: string;
	logo?: string;
}

const initials = (name: string) =>
	name
		.split(" ")
		.map((part) => part.charAt(0))
		.slice(0, 2)
		.join("")
		.toUpperCase();

export const Blog = ({
	category,
	title,
	excerpt,
	author,
	meta,
	avatar,
	brand,
	logo,
}: BlogProps) => (
	<div
		style={{
			backgroundColor: COLOR.background,
			color: COLOR.foreground,
			display: "flex",
			flexDirection: "column",
			height: "100%",
			justifyContent: "space-between",
			padding: "80px",
			position: "relative",
			width: "100%",
		}}
	>
		<div
			style={{
				alignSelf: "flex-start",
				backgroundColor: COLOR.card,
				border: `1px solid ${COLOR.border}`,
				borderRadius: "999px",
				color: COLOR.muted,
				display: "flex",
				fontSize: "24px",
				fontWeight: 600,
				letterSpacing: "0.04em",
				padding: "10px 22px",
				textTransform: "uppercase",
			}}
		>
			{category}
		</div>

		<div style={{ display: "flex", flexDirection: "column" }}>
			<div
				style={{
					display: "flex",
					fontSize: title.length > 48 ? 64 : 78,
					fontWeight: 700,
					letterSpacing: "-0.03em",
					lineHeight: 1.05,
					maxWidth: "1000px",
				}}
			>
				{title}
			</div>
			<div
				style={{
					color: COLOR.muted,
					display: "flex",
					fontSize: "32px",
					lineHeight: 1.4,
					marginTop: "28px",
					maxWidth: "920px",
				}}
			>
				{excerpt}
			</div>
		</div>

		<div style={{ alignItems: "center", display: "flex", gap: "20px" }}>
			{avatar ? (
				<img alt={author} src={avatar} width={72} height={72} style={{ borderRadius: "999px" }} />
			) : (
				<div
					style={{
						alignItems: "center",
						backgroundColor: COLOR.card,
						border: `1px solid ${COLOR.border}`,
						borderRadius: "999px",
						color: COLOR.foreground,
						display: "flex",
						fontSize: "28px",
						fontWeight: 700,
						height: "72px",
						justifyContent: "center",
						width: "72px",
					}}
				>
					{initials(author)}
				</div>
			)}
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ display: "flex", fontSize: "30px", fontWeight: 600 }}>{author}</div>
				<div style={{ color: COLOR.muted, display: "flex", fontSize: "24px" }}>{meta}</div>
			</div>
		</div>

		<div
			style={{
				alignItems: "center",
				display: "flex",
				gap: "12px",
				position: "absolute",
				right: "80px",
				top: "80px",
			}}
		>
			{logo ? (
				<img
					alt=""
					height={40}
					src={logo}
					width={40}
					style={{ borderRadius: "8px", objectFit: "contain" }}
				/>
			) : null}
			<div style={{ color: COLOR.muted, fontSize: "30px", fontWeight: 700 }}>{brand}</div>
		</div>
	</div>
);
