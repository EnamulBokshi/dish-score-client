import ChangePasswordForm from "@/components/modules/auth/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Change Password</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Keep your account secure by updating your password regularly.
        </p>
      </div>

      <div className="max-w-2xl">
        <ChangePasswordForm />
      </div>
    </section>
  );
}
