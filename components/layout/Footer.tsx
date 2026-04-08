import Link from "next/link";

const discoveryLinks = [
  { label: "Restaurants", href: "/restaurants" },
  { label: "Dishes", href: "/dishes" },
  { label: "Reviews", href: "/reviews" },
];

const workflowLinks = [
  { label: "How It Works", href: "/" },
  { label: "Review Explorer", href: "/reviews" },
  { label: "Global Search", href: "/reviews" },
];

const dashboardLinks = [
  { label: "Consumer Dashboard", href: "/dashboard/my-reviews" },
  { label: "Owner Dashboard", href: "/owner/dashboard/restaurants" },
  { label: "Admin Console", href: "/admin/dashboard/users" },
];

const supportLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];

const platformHighlights = [
  "Global Search Across Restaurants, Dishes, Reviews",
  "Community Review Publishing Workflow",
  "Role-based Dashboards for Consumer, Owner, Admin",
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
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#8e4e39] dark:text-neon-gold">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="text-sm text-[#65554d] transition-colors hover:text-[#b5553b] dark:text-[#aeb0bb] dark:hover:text-neon-orange"
            >
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
    <footer className="relative mt-16 px-4 pb-6 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-[#f9eee9]/40 to-[#f3e4dc]/55 dark:from-transparent dark:via-[#120b10]/40 dark:to-[#0b0a10]/70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-4 top-4 h-40 w-40 rounded-full bg-[#ff8a4c]/18 blur-3xl dark:bg-neon-orange/18"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-8 h-44 w-44 rounded-full bg-[#f85f8b]/16 blur-3xl dark:bg-neon-pink/16"
      />

      <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[28px] border border-[#e5d5cb]/90 bg-[#fff7f2]/68 shadow-[0_30px_90px_-50px_rgba(84,50,38,0.45)] backdrop-blur-xl dark:border-white/12 dark:bg-[#12101a]/62 dark:shadow-[0_30px_90px_-50px_rgba(0,0,0,0.9)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(255,150,90,0.20),transparent_36%),radial-gradient(circle_at_86%_75%,rgba(248,95,139,0.18),transparent_34%)] dark:bg-[radial-gradient(circle_at_14%_20%,rgba(255,87,34,0.18),transparent_36%),radial-gradient(circle_at_86%_75%,rgba(248,95,139,0.16),transparent_34%)]"
        />

        <div className="relative grid w-full gap-10 px-6 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-12 lg:px-10">
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block text-2xl font-bold text-[#9f5138] dark:text-neon-orange">
              <span className="sr-only">Dish Score</span>
              <span aria-hidden>🍽️ Dish Score</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#65554d] dark:text-[#aeb0bb]">
              The food intelligence platform where discovery, experience, and trusted reviews connect in one place.
            </p>
            <div className="mt-5 space-y-2">
              {platformHighlights.map((item) => (
                <p
                  key={item}
                  className="inline-flex rounded-full border border-[#e8c8b8] bg-[#fff4ed]/85 px-3 py-1 text-[11px] text-[#8f5f2a] dark:border-neon-orange/25 dark:bg-neon-orange/6 dark:text-neon-gold/90"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>

          <LinkColumn title="Discovery" links={discoveryLinks} />
          <LinkColumn title="Workflows" links={workflowLinks} />
          <LinkColumn title="Dashboards" links={dashboardLinks} />
          <LinkColumn title="Support & Account" links={supportLinks} />
        </div>

        <div className="relative border-t border-[#dcc8bd] bg-[#fff2ea]/55 dark:border-white/12 dark:bg-white/3">
          <div className="mx-auto flex w-full flex-col items-start gap-2 px-6 py-4 text-xs text-[#73645d] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10 dark:text-[#8f94a1]">
            <p>© {currentYear} Dish Score. All rights reserved.</p>
            <p className="tracking-wide">
              Live platform: discovery, review intelligence, and role-based operations.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
