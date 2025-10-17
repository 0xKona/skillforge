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
import GoogleSignInButton from "../google-sign-in-button";
import React from "react";
import { signUp } from "aws-amplify/auth";
import { SetState } from "@/types/set-state";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema } from "@/lib/form-schemas/auth-schema";
import FormInput from "@/components/ui/form-input";

interface Props {
  isLoading: boolean;
  error: string;
  success: string;
  setIsLoading: SetState<boolean>;
  setError: SetState<string>;
  setSignUpEmail: SetState<string>;
  setSuccessMessage: SetState<string>;
  setNeedsConfirmation: SetState<boolean>;
}

export default function SignUpTab({
  isLoading,
  error,
  success,
  setIsLoading,
  setError,
  setSignUpEmail,
  setSuccessMessage,
  setNeedsConfirmation,
}: Props) {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignUp = async (data: z.infer<typeof signUpFormSchema>) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { nextStep } = await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            preferred_username: data.username,
            picture:
              "https://img.icons8.com/?size=100&id=99268&format=png&color=000000",
            updated_at: String(Math.floor(new Date().getTime() / 1000)),
          },
        },
      });

      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setNeedsConfirmation(true);
        setSignUpEmail(data.email);
        setSuccessMessage(
          "Account created! Please check your email for the confirmation code."
        );
      } else {
        setSuccessMessage("Account created successfully!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabsContent value="signup">
      <Card>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Enter your email and password to create a new account
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(handleSignUp)}>
          <CardContent className="space-y-4">
            {/* TODO - Move to cards */}
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
            {/* Email Input */}
            <FormInput
              form={form}
              id="signup-email"
              inputName="email"
              placeholder="blacksmith@skillforge.com"
              label="Email"
            />
            {/* Username Input */}
            <FormInput
              form={form}
              id="signup-username"
              inputName="username"
              placeholder="Forger"
              label="Username"
            />
            {/* Password Input */}
            <FormInput
              form={form}
              id="signup-password"
              inputName="password"
              placeholder="Enter your password"
              label="Password"
            />
            {/* Confirm Password Input */}
            <FormInput
              form={form}
              id="signup-confirm-password"
              inputName="confirmPassword"
              placeholder="Confirm your password"
              label="Confirm Password"
            />

            <div>
              <Button
                type="submit"
                className="w-full mb-2"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
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
