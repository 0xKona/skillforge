"use client";

import { useState } from "react";
import { signIn, confirmSignUp } from "aws-amplify/auth";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import VerifyCodeCard from "./sign-up/verify-code";
import SignInTab from "./sign-in";
import SignUpTab from "./sign-up/sign-up";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await signIn({
        username: email,
        password,
      });
      setSuccessMessage("Signed in successfully!");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: signUpEmail,
        confirmationCode,
      });

      if (isSignUpComplete) {
        setSuccessMessage("Email confirmed! You can now sign in.");
        setNeedsConfirmation(false);
        setConfirmationCode("");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to confirm sign up"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (needsConfirmation) {
    return (
      <VerifyCodeCard
        signUpEmail={signUpEmail}
        handleConfirmSignUp={handleConfirmSignUp}
        error={error}
        success={successMessage}
        confirmationCode={confirmationCode}
        isLoading={isLoading}
        setConfirmationCode={setConfirmationCode}
        setNeedsConfirmation={setNeedsConfirmation}
      />
    );
  }

  return (
    <Tabs defaultValue="signin" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <SignInTab
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        error={error}
        success={successMessage}
        handleSignIn={handleSignIn}
        setError={setError}
        setIsLoading={setIsLoading}
      />

      <SignUpTab
        isLoading={isLoading}
        error={error}
        success={successMessage}
        setError={setError}
        setIsLoading={setIsLoading}
        setSignUpEmail={setSignUpEmail}
        setSuccessMessage={setSuccessMessage}
        setNeedsConfirmation={setNeedsConfirmation}
      />
    </Tabs>
  );
}
