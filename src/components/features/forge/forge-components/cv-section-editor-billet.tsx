import { Checkbox } from '@/ui/shadcn/checkbox';
import { Label } from '@/ui/shadcn/label';
import { Badge } from '@/ui/shadcn/badge';
import { BilletHelper } from '@/lib/classes/helpers/billet-helpers';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { Section } from '@/lib/types/cv-types';
import { Ingot, INGOT_FIELD_LABELS } from '@/lib/types/ingot-types';
import { cn } from '@/lib/utils';
import { TypographyP } from '@/ui/typography/typography';

interface Props {
    ingot: Ingot;
    section: Section;
}

export default function CvSectionEditorBillets({ ingot, section }: Props) {
    const { activeSectionIndex, toggleBillet } = useCvEditorState();

    if (activeSectionIndex === null) {
        return null;
    }

    return (
        <div className="ml-7 mt-2 space-y-3 border-l-2 border-slate-700 pl-4">
            {/* Header Section: Title and Count */}
            <div className="flex items-center justify-between">
                <TypographyP className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Include Items
                </TypographyP>
                <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-5 text-slate-500 border-slate-700"
                >
                    {ingot.content.billets.length} available
                </Badge>
            </div>

            {/* Billet List: Grid of selectable items */}
            <div className="grid gap-2">
                {BilletHelper.sortBillets(
                    ingot.content.billets,
                    section.sortBilletsBy
                ).map((billet) => {
                    const isSelected = section.billetIds.includes(billet.id);
                    const fieldKeys = BilletHelper.getBilletFieldNames(billet);
                    const displayName =
                        BilletHelper.getBilletDisplayName(billet);

                    return (
                        <div
                            key={billet.id}
                            className={cn(
                                'flex items-start space-x-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer',
                                isSelected
                                    ? 'bg-slate-800/80 border-forge-orange/50 shadow-sm'
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                            )}
                            onClick={() =>
                                toggleBillet(activeSectionIndex, billet.id)
                            }
                        >
                            {/* Selection Checkbox */}
                            <Checkbox
                                checked={isSelected}
                                className="mt-1 data-[state=checked]:bg-forge-orange data-[state=checked]:border-forge-orange pointer-events-none"
                            />

                            {/* Billet Content */}
                            <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-slate-200 cursor-pointer truncate">
                                        {displayName}
                                    </Label>
                                </div>

                                {/* Field Summary: Shows key details excluding descriptions */}
                                <div className="grid grid-cols-1 gap-1 text-xs text-slate-400">
                                    {fieldKeys.map((fieldKey) => {
                                        const fieldValue =
                                            billet.fields[fieldKey].value;
                                        // Skip empty values or long descriptions for the summary view
                                        if (
                                            !fieldValue ||
                                            fieldKey
                                                .toLowerCase()
                                                .includes('description')
                                        )
                                            return null;

                                        // Skip the name field if it's the display name
                                        if (fieldValue === displayName)
                                            return null;

                                        return (
                                            <div
                                                key={fieldKey}
                                                className="flex items-center gap-2 truncate"
                                            >
                                                <span className="text-slate-500 w-20 shrink-0">
                                                    {INGOT_FIELD_LABELS[
                                                        fieldKey
                                                    ] || fieldKey}
                                                    :
                                                </span>
                                                <span className="text-slate-300 truncate">
                                                    {fieldValue}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
