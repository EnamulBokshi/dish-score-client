import Link from "next/link";

const allLinks = [
  { label: "Restaurants", href: "/restaurants" },
  { label: "Dishes", href: "/dishes" },
  { label: "Reviews", href: "/reviews" },
  { label: "How It Works", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#d4d0c8",
        borderTop: "2px solid #808080",
        fontFamily: "'Tahoma','Verdana','Arial',sans-serif",
        fontSize: "11px",
      }}
    >
      {/* Win2K status bar style strip */}
      <div
        style={{
          background: "linear-gradient(to right, #0a246a 0%, #4872c4 60%, #a0b8d8 100%)",
          padding: "2px 12px",
          color: "#ffffff",
          fontSize: "11px",
          fontWeight: "bold",
        }}
      >
        🍽️ Dish Score &mdash; The food intelligence platform
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Win2K groupbox / panel */}
        <div
          className="win-groupbox mb-4"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: "8px" }}
        >
          <div style={{ gridColumn: "1 / -1", marginBottom: "6px" }}>
            <p
              style={{
                background: "linear-gradient(to right, #0a246a 0%, #4872c4 60%, #a0b8d8 100%)",
                color: "#ffffff",
                padding: "2px 6px",
                fontSize: "11px",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              Site Navigation
            </p>
          </div>
          {allLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="text-[#0000cc] hover:text-[#cc0000] text-[11px]"
              style={{ textDecoration: "underline", display: "block" }}
            >
              &#x25BA; {link.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #808080", borderBottom: "1px solid #ffffff", marginBottom: "8px" }} />

        {/* Footer bottom bar */}
        <div
          className="win-sunken flex flex-col gap-1 px-2 py-2 text-[10px] text-[#444444] sm:flex-row sm:justify-between"
        >
          <span>© {currentYear} Dish Score. All rights reserved.</span>
          <span>Best viewed in Internet Explorer 6.0 at 800×600 resolution.</span>
        </div>

        {/* Animated visitor counter block */}
        <div className="mt-3 flex items-center gap-3">
          <div
            className="win-sunken px-3 py-1 text-[11px] font-bold text-[#0a246a]"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            Visitors: 0 0 0 , 4 2 1
          </div>
          <span className="text-[10px] text-[#666666]">You are visitor #421 today!</span>
        </div>
      </div>
    </footer>
  );
}
