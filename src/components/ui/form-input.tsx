import { Controller, UseFormReturn } from "react-hook-form";
import { Label } from "../shadcn/label";
import { Input } from "../shadcn/input";
import { SignUpForm } from "@/lib/form-schemas/auth-schema";

interface Props {
  form: UseFormReturn<SignUpForm>;
  id: string;
  inputName: string;
  placeholder: string;
  label: string;
}

export default function FormInput({
  form,
  id,
  inputName,
  placeholder,
  label,
}: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Controller
        // @ts-ignore // TODO FIX TYPE ERROR
        name={inputName}
        control={form.control}
        render={({ field, fieldState }) => (
          <>
            <Input {...field} id={id} type="text" placeholder={placeholder} />
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
