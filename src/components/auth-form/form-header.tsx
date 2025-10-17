import { CardDescription, CardHeader, CardTitle } from "../ui/shadcn/card";

interface Props {
  title: string;
  description: string;
}

export default function FormHeader({ title, description }: Props) {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}
