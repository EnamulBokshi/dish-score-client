import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface HomeSectionFrameProps {
  badgeLabel: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  badgeClassName?: string;
  titleGradientClassName?: string;
  cardClassName?: string;
  backgroundGradientClassName?: string;
  topGlowClassName?: string;
  leftGlowClassName?: string;
  rightGlowClassName?: string;
  link: {
    href: string;
    label: string;
  }
}

export default function HomeSectionFrame({
  badgeLabel,
  title,
  description,
  icon,
  children,
  className,
  link: { href, label },
}: HomeSectionFrameProps) {
  return (
    <section
      className={cn("px-4 pb-6 pt-4 sm:px-6 lg:px-8", className)}
      style={{ background: "#d4d0c8", fontFamily: "'Tahoma','Verdana','Arial',sans-serif" }}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Win2K outer window panel */}
        <div className="win-panel">
          {/* Title bar */}
          <div
            className="win-titlebar flex items-center gap-2 px-2 py-1 select-none"
            style={{ background: "linear-gradient(to right, #0a246a 0%, #4872c4 60%, #a0b8d8 100%)" }}
          >
            <span className="text-yellow-300" aria-hidden>{icon}</span>
            <span className="font-bold text-[11px] text-white">{title}</span>
            <span className="ml-1 text-[10px] text-[#c8dff0] opacity-80">— {badgeLabel}</span>
          </div>

          {/* Section header area */}
          <div
            className="px-4 py-3"
            style={{ borderBottom: "1px solid #808080", background: "#ece9d8" }}
          >
            <h2
              className="text-[15px] font-bold text-[#0a246a]"
              style={{ fontFamily: "'Tahoma','Verdana','Arial',sans-serif" }}
            >
              {title}
            </h2>
            <p className="mt-1 text-[11px] text-[#444444] max-w-2xl">{description}</p>
          </div>

          {/* Content */}
          <div className="p-4">{children}</div>

          {/* Win2K bottom toolbar */}
          <div
            className="flex items-center justify-between px-3 py-1"
            style={{ borderTop: "2px solid #808080", background: "#d4d0c8" }}
          >
            <div
              className="win-sunken px-2 py-0.5 text-[10px] text-[#444444]"
            >
              {badgeLabel}
            </div>
            <Link
              href={href}
              className="btn-win inline-flex items-center gap-1 px-3 py-0.5 text-[11px] text-[#000080] hover:text-[#cc0000]"
            >
              {label} &rsaquo;&rsaquo;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
