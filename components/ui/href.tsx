interface HrefProps {
	href?: string
	children?: React.ReactNode
	className?: string
	space?: boolean
}

export default function Href({ href, children, space = true }: HrefProps) {
	return (
		<>
			{space && <span> </span>}
			<a
				href={href}
				className="text-primary hover:underline"
				target="_blank"
				rel="noopener noreferrer">
				<span className="font-semibold">{children}</span>
			</a>
			{space && <span> </span>}
		</>
	)
}
