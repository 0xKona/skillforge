import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/component-library/shadcn-components/dialog';
import { Button } from '@/components/ui/component-library/shadcn-components/button';
import { Shield, Lock, Server, EyeOff } from 'lucide-react';
import {
    TypographyH4,
    TypographyP,
} from '@/components/ui/typography/typography';

export function PrivacyModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="link"
                    className="text-slate-400 hover:text-forge-orange transition-colors text-sm p-0 h-auto font-normal"
                >
                    Privacy & Data Use
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="h-6 w-6 text-forge-orange" />
                        Privacy & Data Security
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Transparency about how your data is handled and secured.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* No Marketing/Training Section */}
                    <div className="flex gap-4">
                        <div className="bg-slate-800/50 p-3 rounded-lg h-fit">
                            <EyeOff className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="space-y-2">
                            <TypographyH4 className="text-lg">
                                No Marketing or AI Training
                            </TypographyH4>
                            <TypographyP className="text-slate-400 text-sm leading-relaxed">
                                Your personal data, CVs, and Ingots are yours
                                alone. We do not use your content for marketing
                                campaigns, nor do we use it to train any AI
                                models. Your career history remains private.
                            </TypographyP>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="flex gap-4">
                        <div className="bg-slate-800/50 p-3 rounded-lg h-fit">
                            <Lock className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div className="space-y-2">
                            <TypographyH4 className="text-lg">
                                Owner-Only Access
                            </TypographyH4>
                            <TypographyP className="text-slate-400 text-sm leading-relaxed">
                                We utilize strict{' '}
                                <strong>Owner-Based Authorization</strong>. This
                                means your data is cryptographically tied to
                                your user identity. Only you can read, update,
                                or delete your information. Even other logged-in
                                users cannot access your data.
                            </TypographyP>
                        </div>
                    </div>

                    {/* Infrastructure Section */}
                    <div className="flex gap-4">
                        <div className="bg-slate-800/50 p-3 rounded-lg h-fit">
                            <Server className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="space-y-2">
                            <TypographyH4 className="text-lg">
                                Data Security
                            </TypographyH4>
                            <TypographyP className="text-slate-400 text-sm leading-relaxed">
                                SkillForge is built on secure{' '}
                                <strong>AWS</strong> infrastructure. Your data
                                is stored in a secure database and leverages
                                industry-standard encryption at rest and in
                                transit.
                            </TypographyP>
                        </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mt-4 space-y-2">
                        <TypographyH4 className="text-sm font-semibold text-amber-500">
                            Educational Project Disclaimer
                        </TypographyH4>
                        <TypographyP className="text-xs text-amber-500/80 leading-relaxed">
                            SkillForge is an educational project developed for
                            demonstration and learning purposes. It is not
                            intended for widespread commercial use.
                        </TypographyP>
                        <ul className="list-disc list-inside text-xs text-amber-500/80 space-y-1 ml-1">
                            <li>
                                The service may change, update, or go offline
                                without notice.
                            </li>
                            <li>Data persistence is not guaranteed.</li>
                            <li>
                                Please do not store highly sensitive personal
                                identification (e.g., passport numbers) or
                                financial data.
                            </li>
                        </ul>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full sm:w-auto bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700"
                        >
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
