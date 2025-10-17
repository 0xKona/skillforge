"use client";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { TabsContent } from "@/components/shadcn/tabs";
import GoogleSignInButton from "./google-sign-in-button";
import { useForm } from "react-hook-form";
import { SignInForm, signInFormSchema } from "@/lib/form-schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "aws-amplify/auth";
import { SetState } from "@/types/set-state";
import FormInput from "../ui/form-input";

export default function SignInTab(props: {
  isLoading: boolean;
  error: string;
  success: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMessage: SetState<string>;
}) {
  const {
    isLoading,
    error,
    success,
    // handleSignIn,
    setIsLoading,
    setError,
    setSuccessMessage,
  } = props;

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await signIn({
        username: data.email,
        password: data.password,
      });
      setSuccessMessage("Signed in successfully!");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabsContent value="signin">
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(handleSignIn)}>
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

            <FormInput
              form={form}
              id="sign-in-email"
              inputName="email"
              placeholder="blacksmith@skillforge.com"
              label="Email"
            />
            <FormInput
              form={form}
              id="sign-in-password"
              inputName="password"
              placeholder="enter password"
              label="Password"
              type="password"
            />

            <div>
              <Button
                type="submit"
                className="w-full mb-2"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>

            <GoogleSignInButton
              setIsLoading={setIsLoading}
              setError={setError}
            />
          </CardContent>
        </form>
      </Card>
    </TabsContent>
  );
}
