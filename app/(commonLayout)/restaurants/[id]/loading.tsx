export default function RestaurantDetailsLoading() {
  return (
    <section className="px-4 pb-16 pt-22 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="h-9 w-44 animate-pulse rounded-full bg-white/10" />

        <div className="grid animate-pulse gap-6 rounded-3xl border border-white/10 bg-black/35 p-5 sm:p-7 lg:grid-cols-[1.1fr_1fr]">
          <div className="h-80 rounded-2xl bg-white/10" />
          <div className="space-y-4">
            <div className="h-6 w-32 rounded bg-white/10" />
            <div className="h-10 w-3/4 rounded bg-white/10" />
            <div className="h-20 w-full rounded bg-white/10" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 rounded bg-white/10" />
              <div className="h-16 rounded bg-white/10" />
              <div className="h-16 rounded bg-white/10" />
              <div className="h-16 rounded bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
