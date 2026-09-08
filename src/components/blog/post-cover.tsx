import Image from "next/image";

import { cn } from "@/lib/utils";

type PostCoverProps = {
	src: string;
	alt: string;
	className?: string;
};

export function PostCover({ src, alt, className }: PostCoverProps) {
	return (
		<div
			aria-hidden
			className={cn(
				"relative aspect-video w-full overflow-hidden rounded-t-[inherit] bg-bg-weak-50 select-none",
				className
			)}
		>
			<Image
				src={src}
				alt={alt}
				fill
				className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
				sizes="(max-width: 640px) 100vw, 50vw"
				draggable={false}
			/>
		</div>
	);
}
