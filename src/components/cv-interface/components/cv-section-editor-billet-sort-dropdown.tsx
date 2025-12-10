import { Label } from '@/components/shadcn-components/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn-components/select';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { Section } from '@/lib/types/cv-types';
import {
    SortOrder,
    sortOrderLabelMap,
    sortOrderOptions,
} from '@/lib/types/preview-util-types';

interface Props {
    section: Section;
    activeSectionIndex: number;
}

export default function CvSectionEditorBilletSortDropdown({
    section,
    activeSectionIndex,
}: Props) {
    const { updateSection } = useCvEditorState();

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Sort Billets By</Label>
                <Select
                    value={section.sortBilletsBy || 'date-desc'}
                    onValueChange={(value: SortOrder) => {
                        updateSection(activeSectionIndex, {
                            sortBilletsBy: value,
                        });
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Sort order" />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOrderOptions.map((sortOption: SortOrder) => (
                            <SelectItem key={sortOption} value={sortOption}>
                                {sortOrderLabelMap[sortOption]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
