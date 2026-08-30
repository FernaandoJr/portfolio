"use client";

import { MenuToggleIcon } from "@/components/header/menu-toggle-icon";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { headerLinks } from "@/constants/header-links";
import { NAME } from "@/constants/profile";
import { useScroll } from "@/lib/use-scroll";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface HeaderProps {
	disableSticky?: boolean;
	forceBlur?: boolean;
}

export function Header({ disableSticky = false, forceBlur = false }: HeaderProps) {
	const [open, setOpen] = useState(false);
	const scrolled = useScroll(10);
	const { t } = useTranslation();

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<header
			className={cn(
				"z-50 w-full",
				!disableSticky && "fixed top-0 right-0 left-0",
				disableSticky && "relative"
			)}
		>
			<div
				aria-hidden
				className={cn(
					"pointer-events-none absolute inset-x-0 top-0 -bottom-16 transition-opacity duration-500 ease-out",
					"bg-linear-to-b from-background/85 via-background/60 to-transparent",
					"supports-[backdrop-filter]:backdrop-blur-lg",
					"[mask-image:linear-gradient(to_bottom,var(--background)_45%,transparent)]",
					(scrolled && !disableSticky) || forceBlur ? "opacity-100" : "opacity-0"
				)}
			/>

			<nav className="relative mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-6 lg:px-0 select-none">
				<div className="flex items-center gap-5">
					<Link href="/" className="flex items-center rounded-md" aria-label={NAME}>
						<Image
							src="/pfp_greninja.png"
							alt=""
							width={75}
							height={66}
							className="h-8 w-auto"
							style={{ imageRendering: "pixelated" }}
							unoptimized
						/>
					</Link>
					<div className="hidden items-center gap-1 md:flex">
						{headerLinks.map((link) => (
							<Link
								key={link.key}
								className={cn(buttonVariants({ variant: "ghost" }), "rounded-md")}
								href={link.href}
							>
								{t(link.key)}
							</Link>
						))}
					</div>
				</div>

				<div className="hidden items-center gap-2 md:flex">
					<LanguageSwitcher />
					<ModeToggle />
				</div>

				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label={t("openMenu")}
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>

			<MobileMenu open={open} className="flex flex-col justify-between gap-2 overflow-y-auto">
				<div className="grid w-full flex-col gap-y-2">
					{headerLinks.map((link) => (
						<Link
							key={link.key}
							className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
							href={link.href}
							onClick={() => setOpen(false)}
						>
							{t(link.key)}
						</Link>
					))}
				</div>
				<div className="flex items-center gap-2 p-1">
					<LanguageSwitcher />
					<ModeToggle />
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<"div"> & { open: boolean };

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === "undefined") return null;

	return createPortal(
		<div
			id="mobile-menu"
			className={cn(
				"bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg",
				"fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden"
			)}
		>
			<div
				data-slot={open ? "open" : "closed"}
				className={cn(
					"data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out",
					"size-full p-4",
					className
				)}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body
	);
}
