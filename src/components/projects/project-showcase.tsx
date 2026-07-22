"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type ShowcaseImage = { src: string; alt: string };

const AUTOPLAY_MS = 5000;

export function ProjectShowcase({
	cover,
	title,
	images,
}: {
	cover?: string | undefined;
	title: string;
	images: ShowcaseImage[];
}) {
	const { t } = useTranslation();
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);
	const [paused, setPaused] = React.useState(false);
	const [lightbox, setLightbox] = React.useState<number | null>(null);

	const slides: ShowcaseImage[] = React.useMemo(
		() => (cover ? [{ src: cover, alt: title }, ...images] : images),
		[cover, title, images]
	);

	React.useEffect(() => {
		if (!api) return;

		function sync() {
			setCurrent(api!.selectedScrollSnap());
		}

		sync();
		api.on("select", sync);
		return () => {
			api.off("select", sync);
		};
	}, [api]);

	React.useEffect(() => {
		if (!api || slides.length < 2) return;
		// Nothing should keep moving while the reader is looking at a slide up
		// close, hovering it, or has asked the OS for less motion.
		if (paused || lightbox !== null) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const timer = setInterval(() => api.scrollNext(), AUTOPLAY_MS);
		return () => {
			clearInterval(timer);
		};
	}, [api, paused, lightbox, slides.length]);

	const step = React.useCallback(
		(delta: number) => {
			setLightbox((at) => (at === null ? null : (at + delta + slides.length) % slides.length));
		},
		[slides.length]
	);

	React.useEffect(() => {
		if (lightbox === null) return;

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "ArrowLeft") step(-1);
			if (event.key === "ArrowRight") step(1);
		}

		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [lightbox, step]);

	if (slides.length === 0) return null;

	const active = lightbox === null ? null : slides[lightbox];

	return (
		<>
			<Carousel
				setApi={setApi}
				opts={{ loop: true }}
				className="group/carousel"
				onMouseEnter={() => setPaused(true)}
				onMouseLeave={() => setPaused(false)}
				onFocusCapture={() => setPaused(true)}
				onBlurCapture={() => setPaused(false)}
			>
				<CarouselContent className="ml-0">
					{slides.map((image, index) => (
						<CarouselItem key={`${image.src}-${index}`} className="pl-0">
							<button
								type="button"
								onClick={() => setLightbox(index)}
								aria-label={image.alt}
								className="relative block aspect-video w-full cursor-zoom-in overflow-hidden rounded-xl border border-border select-none"
							>
								<Image
									src={image.src}
									alt={image.alt}
									fill
									priority={index === 0}
									sizes="(max-width: 768px) 100vw, 768px"
									className="object-cover object-top"
									draggable={false}
								/>
							</button>
						</CarouselItem>
					))}
				</CarouselContent>

				{slides.length > 1 && (
					<>
						{/*
						 * `inset-y-0 my-auto` instead of the default `top-1/2 -translate-y-1/2`:
						 * the Button base presses with `active:translate-y-px`, and both write
						 * the same `translate` property, so on click the centering was dropped
						 * and the arrow fell half its own height.
						 */}
						<CarouselPrevious
							variant="ghost"
							className="inset-y-0 left-3 my-auto translate-y-0 cursor-pointer border-0 bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 hover:text-white group-hover/carousel:opacity-100 focus-visible:opacity-100 active:not-aria-[haspopup]:translate-y-0"
						/>
						<CarouselNext
							variant="ghost"
							className="inset-y-0 right-3 my-auto translate-y-0 cursor-pointer border-0 bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 hover:text-white group-hover/carousel:opacity-100 focus-visible:opacity-100 active:not-aria-[haspopup]:translate-y-0"
						/>

						<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-2.5 py-1.5 backdrop-blur-sm">
							{slides.map((image, index) => (
								<button
									key={`dot-${image.src}-${index}`}
									type="button"
									onClick={() => api?.scrollTo(index)}
									aria-label={image.alt}
									aria-current={index === current}
									className={cn(
										"h-1.5 cursor-pointer rounded-full transition-all",
										index === current ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
									)}
								/>
							))}
						</div>
					</>
				)}
			</Carousel>

			<Dialog open={lightbox !== null} onOpenChange={(open) => !open && setLightbox(null)}>
				<DialogContent className="max-w-[calc(100%-2rem)] gap-3 sm:max-w-4xl">
					<DialogTitle className="sr-only">{active?.alt ?? title}</DialogTitle>

					{active && (
						<div className="relative aspect-video w-full overflow-hidden rounded-lg">
							<Image
								src={active.src}
								alt={active.alt}
								fill
								sizes="(max-width: 1024px) 100vw, 896px"
								className="object-contain"
								draggable={false}
							/>
						</div>
					)}

					<div className="flex items-center justify-between gap-4">
						<p className="text-muted-foreground text-xs">{active?.alt}</p>

						{slides.length > 1 && (
							<div className="flex items-center gap-1">
								<button
									type="button"
									onClick={() => step(-1)}
									aria-label={t("galleryPrevious")}
									className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
								>
									<ChevronLeftIcon className="size-4" />
								</button>
								<span className="text-muted-foreground text-xs tabular-nums select-none">
									{(lightbox ?? 0) + 1}/{slides.length}
								</span>
								<button
									type="button"
									onClick={() => step(1)}
									aria-label={t("galleryNext")}
									className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
								>
									<ChevronRightIcon className="size-4" />
								</button>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
