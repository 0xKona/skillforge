import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Label } from "@/components/shadcn/label";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";

interface Props {
    handleConfirmSignUp: (e: React.FormEvent) => void;
    signUpEmail: string;
    error: string;
    success: string;
    confirmationCode: string;
    isLoading: boolean;
    setConfirmationCode: React.Dispatch<React.SetStateAction<string>>
    setNeedsConfirmation: React.Dispatch<React.SetStateAction<boolean>>
}

export default function VerifyCodeCard({ 
    handleConfirmSignUp, 
    signUpEmail, 
    error,
    success,
    confirmationCode,
    isLoading,
    setConfirmationCode,
    setNeedsConfirmation
}: Props) {

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Confirm Your Email</CardTitle>
                <CardDescription>
                    Enter the confirmation code sent to {signUpEmail}
                </CardDescription>
            </CardHeader>
        <form onSubmit={handleConfirmSignUp}>
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
              <Label htmlFor="code">Confirmation Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter confirmation code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Confirming..." : "Confirm Email"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setNeedsConfirmation(false)}
            >
              Back to Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    )
}