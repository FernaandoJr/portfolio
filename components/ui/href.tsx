interface HrefProps {
	readonly href?: string
	readonly children?: React.ReactNode
	readonly className?: string
	readonly space?: boolean
}

export default function Href({
	href,
	children,
	space = true,
	className,
}: HrefProps) {
	return (
		<>
			{space && <span> </span>}
			<a
				href={href}
				className={`text-primary hover:underline ${className}`}
				target="_blank"
				rel="noopener noreferrer">
				<span className="font-semibold">{children}</span>
			</a>
			{space && <span> </span>}
		</>
	)
}
