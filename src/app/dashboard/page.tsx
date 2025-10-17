"use client";

import { Button } from "@/components/ui/shadcn/button";
import { signOut } from "aws-amplify/auth";

export default function Dashboard() {
  async function handleSignOut() {
    console.log("Clicked");
    await signOut();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <h1 className="text-xl font-bold tracking-tight mb-2">Dashboard</h1>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </main>
  );
}
