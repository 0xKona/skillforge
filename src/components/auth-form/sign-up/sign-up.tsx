"use client";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { TabsContent } from "@/components/shadcn/tabs";
import GoogleSignInButton from "../google-sign-in-button";
import React from "react";
import { signUp } from "aws-amplify/auth";
import { Avatar, AvatarImage, AvatarFallback } from "../../shadcn/avatar";
import { X } from "lucide-react";
import { SetState } from "@/types/set-state";

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

interface CreatePassword {
  password: string;
  confirmPassword: string;
}

const initialPassword: CreatePassword = {
  password: '',
  confirmPassword: ''
}

export default function SignUpTab(props: Props) {
    const [username, setUsername] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<CreatePassword>(initialPassword);
    const [userAvatar, setUserAvatar] = React.useState<File | null>(null);

    const { isLoading, error, success, setIsLoading, setError, setSignUpEmail, setSuccessMessage, setNeedsConfirmation } = props;

    function updatePasswordInput(newPassword: string, key: keyof CreatePassword) {
      setPassword(prev => ({ ...prev, [key]: newPassword }));
    }

    const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      // 1 - Verify input

      // 2 - Check email and username not in use

      // 3 - Upload picture to S3

      // 4 - Set image url to s3 link

      // 5 - Create account


  
      try {
        const { nextStep } = await signUp({
          username: email,
          password: password.password,
          options: {
            userAttributes: {
              email,
              preferred_username: username || "User",
              picture: "https://via.placeholder.com/150",
              updated_at: new Date().toString()
            },
          },
        });
  
        if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
          setNeedsConfirmation(true);
          setSignUpEmail(email);
          setSuccessMessage("Account created! Please check your email for the confirmation code.");
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
          <form className="flex" onSubmit={handleSignUp}>
            <CardContent>
              <p>Testing</p>
            </CardContent>
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

              {/* <div className="flex items-center space-x-4" onClick={() => document.getElementById('avatar-upload')?.click()}>
                <div className="flex-1">
                  <Label htmlFor="avatar-upload">Upload Avatar</Label>
                  <p className="text-xs text-muted-foreground">
                    {userAvatar ? userAvatar.name : "No avatar selected"}
                  </p>
                </div>
                <Avatar
                  className="cursor-pointer size-16 border-2 border-dotted border-gray-400 group relative"
                >
                  <AvatarImage src={userAvatar ? URL.createObjectURL(userAvatar) : undefined} />
                  <AvatarFallback>?</AvatarFallback>
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                    onClick={(e) => { e.stopPropagation(); setUserAvatar(null); }}
                  >
                    <X size={12} />
                  </button>
                </Avatar>
              </div> */}

              {/* <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setUserAvatar(e.target.files?.[0] || null)}
              /> */}

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="text"
                  placeholder="johndoe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-name">Username</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={password.password}
                  onChange={(e) => updatePasswordInput(e.target.value, 'password')}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Confirm Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Confirm password"
                  value={password.confirmPassword}
                  onChange={(e) => updatePasswordInput(e.target.value, 'confirmPassword')}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Passwords should match
                </p>
              </div>

              <div>
                <Button type="submit" className="w-full mb-2" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </div>

              <GoogleSignInButton setIsLoading={setIsLoading} setError={setError}/>
            </CardContent>
          </form>
        </Card>
      </TabsContent>
    );
  }