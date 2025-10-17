import AuthForm from "@/components/auth-form/auth-form";

export default function LoginPage() {
  // TODO - Routing Logic

  /* 
        - IF USER LOGGED IN, REDIRECT TO DASHBOARD 
        - IF USER NOT LOGGED IN, SHOW LOGIN PAGE
        - IF USER NOT CONFIRMED, SHOW CONFIRMATION PAGE
    */

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">SkillForge</h1>
          <p className="text-muted-foreground">
            Welcome! Please sign in to continue.
          </p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
