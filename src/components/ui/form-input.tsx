"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { Label } from "./shadcn/label";
import { Input } from "./shadcn/input";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import React from "react";

interface Props {
  form: UseFormReturn<any>;
  id: string;
  inputName: string;
  placeholder: string;
  label: string;
  type?: "email" | "text" | "password";
}

export default function FormInput({
  form,
  id,
  inputName,
  placeholder,
  label,
  type = "text",
}: Props) {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Controller
        // @ts-ignore // TODO FIX TYPE ERROR
        name={inputName}
        control={form.control}
        render={({ field, fieldState }) => (
          <>
            {type !== "password" && (
              <Input {...field} id={id} type={type} placeholder={placeholder} />
            )}
            {/* If it is an input for sensitive data, need to include logic to hide and show text */}
            {type === "password" && (
              <div className="relative">
                <Input
                  {...field}
                  id={id}
                  type={showPassword ? "text" : "password"}
                  placeholder={placeholder}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? (
                    <FaEye
                      size={20}
                      className="cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <FaEyeSlash
                      size={20}
                      className="cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
              </div>
            )}{" "}
            {fieldState.error && (
              <p className="text-xs text-red-500">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
}

/*
  Assignment note:

  Before I would have to repeat this code for each input field,
  this component means I can reuse it within any Form like this:

  <FormInput
    form={form}
    id="signup-email"
    inputName="email"
    placeholder="blacksmith@skillforge.com"
    label="Email"
  />

*/
