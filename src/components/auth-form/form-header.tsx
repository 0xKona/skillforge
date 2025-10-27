import { CardDescription, CardHeader, CardTitle } from '../ui/shadcn/card';

interface Props {
    id?: string;
    title: string;
    description: string;
}

export default function FormHeader({ id, title, description }: Props) {
    return (
        <CardHeader id={id} data-testid={id}>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
    );
}
