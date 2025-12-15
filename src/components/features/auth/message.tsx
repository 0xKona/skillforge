import { Card } from '@/components/ui/component-library/shadcn-components/card';

export default function LoginPageMessage() {
    return (
        <Card className="my-1 p-4">
            <div className="text-center">
                <p className="text-muted-foreground text-sm">
                    Warning!
                    <br />
                    Access for approved email domains only.
                    <br />
                    Please check back later for wider access.
                </p>
            </div>
        </Card>
    );
}
