import { Suspense } from "react";
import { LoginForm } from "@/app/ui/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
