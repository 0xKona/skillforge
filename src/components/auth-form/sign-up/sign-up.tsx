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

const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    username: z.string().min(2, "Username must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

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

export default function SignUpTab(props: Props) {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    isLoading,
    error,
    success,
    setIsLoading,
    setError,
    setSignUpEmail,
    setSuccessMessage,
    setNeedsConfirmation,
  } = props;

  const handleSignUp = async (data: z.infer<typeof signUpSchema>) => {
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
            updated_at: String(Math.floor(new Date().getTime() / 1000)), // TODO - Needs to be unix, keeping to block upload for now
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
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="signup-email"
                      type="email"
                      placeholder="johndoe@example.com"
                    />
                    {fieldState.error && (
                      <p className="text-xs text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-username">Username</Label>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="signup-username"
                      type="text"
                      placeholder="johndoe"
                    />
                    {fieldState.error && (
                      <p className="text-xs text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                    />
                    {fieldState.error ? (
                      <p className="text-xs text-red-500">
                        {fieldState.error.message}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm password"
                    />
                    {fieldState.error ? (
                      <p className="text-xs text-red-500">
                        {fieldState.error.message}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Passwords should match
                      </p>
                    )}
                  </>
                )}
              />
            </div>

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
