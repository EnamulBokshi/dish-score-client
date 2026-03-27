import Image from "next/image";

import RegisterForm from "@/components/modules/auth/RegisterForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-dark-bg">
      <div className="grid min-h-screen md:grid-cols-2">
        <section className="relative hidden overflow-hidden border-r border-dark-border md:block">
          <Image
            src="/images/login-food-hero.svg"
            alt="A stylized dish visual for Dish Score signup"
            fill
            priority
            className="object-cover"
          />
        </section>

        <section className="relative flex items-center justify-center px-4 py-10 sm:px-6 md:px-10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_0%,rgba(255,87,34,0.22),transparent_43%),radial-gradient(circle_at_90%_15%,rgba(255,215,0,0.14),transparent_42%),linear-gradient(180deg,#0a0a0a,#101015)]" />

          <div className="w-full max-w-md">
            <div className="mb-6 md:hidden">
              <div className="relative h-48 overflow-hidden rounded-2xl border border-dark-border">
                <Image
                  src="/images/login-food-hero.svg"
                  alt="Dish Score signup visual"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            <RegisterForm />
          </div>
        </section>
      </div>
    </main>
  );
}
