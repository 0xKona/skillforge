"use client";

import { Card, CardContent } from "@/components/ui/shadcn/card";
import { TabsContent } from "@/components/ui/shadcn/tabs";
import React from "react";
import { signUp } from "aws-amplify/auth";
import { SetState } from "@/types/set-state";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpForm, signUpFormSchema } from "@/lib/form-schemas/auth-schema";
import FormInput from "@/components/ui/form-input";
import CompleteAuthForm from "./complete-form";
import FormHeader from "./form-header";

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
  const form = useForm<SignUpForm>({
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
        <FormHeader
          title="Create Account"
          description="Enter your email and password to create a new account"
        />
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
              type="password"
            />
            {/* Confirm Password Input */}
            <FormInput
              form={form}
              id="signup-confirm-password"
              inputName="confirmPassword"
              placeholder="Confirm your password"
              label="Confirm Password"
              type="password"
            />
            {/* Submit buttons Or Google login */}
            <CompleteAuthForm
              buttonText="Sign Up"
              buttonLoadingText="Creating account..."
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setError={setError}
            />
          </CardContent>
        </form>
      </Card>
    </TabsContent>
  );
}
