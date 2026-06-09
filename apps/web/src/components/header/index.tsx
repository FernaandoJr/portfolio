"use client";

import { MenuToggleIcon } from "@/components/header/menu-toggle-icon";
import { ModeToggle } from "@/components/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { headerLinks } from "@/constants/header-links";
import { cn } from "@/lib/utils";
import { useScroll } from "@/lib/use-scroll";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface HeaderProps {
  disableSticky?: boolean;
  forceBlur?: boolean;
}

export function Header({
  disableSticky = false,
  forceBlur = false,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const scrolled = useScroll(10);

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
        "z-50 w-full border-b border-transparent",
        !disableSticky && "fixed top-0 right-0 left-0",
        disableSticky && "relative",
        {
          "bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg":
            (scrolled && !disableSticky) || forceBlur,
        },
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-6 lg:px-0 select-none">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2 rounded-md p-2">
            <span className="text-lg font-medium">FernaandoJr</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {headerLinks.map((link) => (
              <Link
                key={link.key}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "rounded-md",
                )}
                href={link.href}
              >
                {link.key}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ModeToggle />
        </div>

        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      <MobileMenu
        open={open}
        className="flex flex-col justify-between gap-2 overflow-y-auto"
      >
        <div className="grid w-full flex-col gap-y-2">
          {headerLinks.map((link) => (
            <Link
              key={link.key}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start",
              )}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.key}
            </Link>
          ))}
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
        "fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden",
      )}
    >
      <div
        data-slot={open ? "open" : "closed"}
        className={cn(
          "data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out",
          "size-full p-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
