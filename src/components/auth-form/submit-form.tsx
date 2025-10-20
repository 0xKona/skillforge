"use client";

import { SetState } from "@/types/set-state";
import { Button } from "../ui/shadcn/button";

interface Props {
  buttonText: string;
  buttonLoadingText: string;
  isLoading: boolean;
  setIsLoading: SetState<boolean>;
  setError: SetState<string>;
}

export default function SubmitAuthForm({
  buttonText,
  buttonLoadingText,
  isLoading,
}: Props) {
  return (
    <Button type="submit" className="w-full mb-2" disabled={isLoading}>
      {isLoading ? buttonLoadingText : buttonText}
    </Button>
  );
}
