"use client";

import { SetState } from "@/types/set-state";
import { Button } from "../ui/shadcn/button";
import GoogleSignInButton from "./google-sign-in-button";

interface Props {
  buttonText: string;
  buttonLoadingText: string;
  isLoading: boolean;
  setIsLoading: SetState<boolean>;
  setError: SetState<string>;
}

export default function CompleteAuthForm({
  buttonText,
  buttonLoadingText,
  isLoading,
  setIsLoading,
  setError,
}: Props) {
  return (
    <>
      <div>
        <Button type="submit" className="w-full mb-2" disabled={isLoading}>
          {isLoading ? buttonLoadingText : buttonText}
        </Button>
      </div>
      <GoogleSignInButton setIsLoading={setIsLoading} setError={setError} />
    </>
  );
}
