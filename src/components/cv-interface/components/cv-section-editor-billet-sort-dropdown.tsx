import { Label } from '@/components/shadcn-components/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn-components/select';
import SortingHelpers from '@/lib/classes/helpers-sorting';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { Section } from '@/lib/types/cv-types';
import { SortOrder } from '@/lib/types/sorting-types';

interface Props {
    section: Section;
    activeSectionIndex: number;
    type: 'ingot' | 'billet';
}

export default function CvSectionEditorSortDropdown({
    section,
    activeSectionIndex,
    type,
}: Props) {
    const { updateSection } = useCvEditorState();

    const typeLabels = {
        ingot: 'Ingots',
        billet: 'Billets',
    };

    let dropDownValue;

    if (type === 'billet') dropDownValue = section.sortBilletsBy;
    if (type === 'ingot') dropDownValue = section.sortIngotsBy;

    const getUpdateObject = (value: SortOrder) => {
        if (type === 'billet') {
            return { sortBilletsBy: value };
        } else {
            return { sortIngotsBy: value };
        }
    };

    return (
        <div className="space-y-2 mr-2">
            <Label>{`Sort ${typeLabels[type]} By`}</Label>
            <Select
                value={dropDownValue || 'date-desc'}
                onValueChange={(value: SortOrder) => {
                    updateSection(
                        activeSectionIndex,
                        // { sortBilletsBy: value }
                        getUpdateObject(value)
                    );
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                    {SortingHelpers.getSortOrderOptions().map(
                        (sortOption: SortOrder) => (
                            <SelectItem key={sortOption} value={sortOption}>
                                {SortingHelpers.getSortOrderLabel(sortOption)}
                            </SelectItem>
                        )
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}
