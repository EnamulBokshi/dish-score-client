import Link from "next/link";

const discoverLinks = [
  { label: "Restaurants", href: "/restaurants" },
  { label: "Dishes", href: "/dishes" },
  { label: "Reviews", href: "/reviews" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Home", href: "/" },
];

const accountLinks = [
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
  { label: "Verify Email", href: "/verify-email" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-neon-gold">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-[#a0a0a0] transition-colors hover:text-neon-orange">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-16 border-t border-dark-border bg-dark-bg">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-neon-orange to-transparent opacity-70"
      />

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:px-8">
        <div>
          <Link href="/" className="inline-block text-2xl font-bold text-neon-orange">
            <span className="sr-only">Dish Score</span>
            <span aria-hidden>🍽️ Dish Score</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#a0a0a0]">
            Discover standout dishes, rate experiences, and help food lovers find their next favorite meal.
          </p>
          <p className="mt-5 inline-flex rounded-full border border-neon-orange/40 px-3 py-1 text-xs text-neon-gold">
            Built for real food opinions
          </p>
        </div>

        <LinkColumn title="Discover" links={discoverLinks} />
        <LinkColumn title="Company" links={companyLinks} />
        <LinkColumn title="Account" links={accountLinks} />
      </div>

      <div className="border-t border-dark-border/80 bg-dark-card/30">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-2 px-4 py-4 text-xs text-[#7c7c86] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {currentYear} Dish Score. All rights reserved.</p>
          <p className="tracking-wide">
            Crafted with <span className="text-neon-orange">bold taste</span> and <span className="text-neon-gold">trusted reviews</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
