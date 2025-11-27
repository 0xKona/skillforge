import {
    TypographyH3,
    TypographyP,
} from '@/components/ui/typography/typography';

// TODO - Fish implementation of this after rest of app is complete

export default function DeleteAccount() {
    return (
        <div className="space-y-6 w-full">
            <div>
                <TypographyH3>Delete Account</TypographyH3>
                <TypographyP className="text-muted-foreground">
                    TODO: Once all data usage implemented, add full delete
                    profile option with confirmation
                </TypographyP>
            </div>
            <div className="h-[1px] bg-border" />
        </div>
    );
}
