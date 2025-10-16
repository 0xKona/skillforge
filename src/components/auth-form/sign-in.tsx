'use client'

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { TabsContent } from "@/components/shadcn/tabs";
import GoogleSignInButton from "./google-sign-in-button";

export default function SignInTab(props: {
    email: string;
    setEmail: (s: string) => void;
    password: string;
    setPassword: (s: string) => void;
    isLoading: boolean;
    error: string;
    success: string;
    handleSignIn: (e: React.FormEvent) => Promise<void> | void;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setError: React.Dispatch<React.SetStateAction<string>>
  }) {
    const { email, setEmail, password, setPassword, isLoading, error, success, handleSignIn, setIsLoading, setError } = props;

    return (
      <TabsContent value="signin">
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 text-sm text-green-500 bg-green-50 dark:bg-green-900/10 rounded-md">
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Button type="submit" className="w-full mb-2" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>

              <GoogleSignInButton setIsLoading={setIsLoading} setError={setError}/>
            </CardContent>
          </form>
        </Card>
      </TabsContent>
    );
  }