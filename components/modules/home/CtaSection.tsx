import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CtaSection() {
  return (
    <section
      className="px-4 pb-8 pt-4 sm:px-6 lg:px-8"
      style={{ background: "#d4d0c8", fontFamily: "'Tahoma','Verdana','Arial',sans-serif" }}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Win2K modal-style dialog box */}
        <div className="win-panel mx-auto max-w-2xl">
          {/* Title bar */}
          <div
            className="win-titlebar flex items-center gap-2 px-2 py-1 select-none"
            style={{ background: "linear-gradient(to right, #0a246a 0%, #4872c4 60%, #a0b8d8 100%)" }}
          >
            <Sparkles className="h-3 w-3 text-yellow-300" aria-hidden />
            <span className="font-bold text-[11px] text-white">Join The Community — Dish Score</span>
          </div>

          {/* Dialog content */}
          <div className="p-6 text-center">
            {/* Win2K info icon row */}
            <div className="mb-4 flex justify-center">
              <div
                className="flex h-12 w-12 items-center justify-center text-[28px]"
                style={{
                  border: "2px solid",
                  borderColor: "#404040 #ffffff #ffffff #404040",
                  background: "#ece9d8",
                }}
                aria-hidden
              >
                🍽️
              </div>
            </div>

            <h2 className="text-[16px] font-bold text-[#0a246a]">
              Ready to share your food story?
            </h2>

            <p className="mx-auto mt-2 max-w-md text-[11px] leading-5 text-[#333333]">
              Publish your first review in minutes, help others find the best spots,
              and build your trusted foodie profile on Dish Score.
            </p>

            {/* Horizontal rule Win2K style */}
            <div
              className="my-4"
              style={{ borderTop: "1px solid #808080", borderBottom: "1px solid #ffffff" }}
            />

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-1 px-6 py-1.5 text-[11px] font-bold text-black"
                style={{
                  background: "#d4d0c8",
                  border: "1px solid #000000",
                  borderTop: "2px solid #ffffff",
                  borderLeft: "2px solid #ffffff",
                  borderRight: "2px solid #404040",
                  borderBottom: "2px solid #404040",
                  boxShadow: "inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080",
                }}
              >
                Create Your Account <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/reviews"
                className="btn-win inline-flex items-center gap-1 px-6 py-1.5 text-[11px]"
              >
                Browse Community Reviews
              </Link>
            </div>
          </div>

          {/* Status bar */}
          <div
            className="flex items-center gap-2 px-2 py-0.5 text-[10px] text-[#444444]"
            style={{ borderTop: "1px solid #808080", background: "#d4d0c8" }}
          >
            <span className="win-sunken px-2">Join for free</span>
          </div>
        </div>
      </div>
    </section>
  );
}
