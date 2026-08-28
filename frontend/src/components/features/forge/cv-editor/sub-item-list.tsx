'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';

import { Input } from '@/ui/shadcn/input';
import { Textarea } from '@/ui/shadcn/textarea';
import { Button } from '@/ui/shadcn/button';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { SECTION_SCHEMAS } from '@/lib/constants/cv-constants';
import { cvImport } from '@/lib/helpers/cv-import';
import { springs, scaleIn } from '@/lib/constants/cv-editor-animations';
import type {
    DocumentItem,
    FieldDef,
    SectionType,
} from '@/lib/types/cv-document-types';

interface SubItemListProps {
    item: DocumentItem;
    sectionIndex: number;
    itemIndex: number;
    sectionType: SectionType;
}

export function SubItemList({
    item,
    sectionIndex,
    itemIndex,
    sectionType,
}: SubItemListProps) {
    const addSubItem = useCvDocumentStore((s) => s.addSubItem);
    const removeSubItem = useCvDocumentStore((s) => s.removeSubItem);
    const updateSubItemField = useCvDocumentStore((s) => s.updateSubItemField);

    const schema = SECTION_SCHEMAS[sectionType];
    const subFields = schema.subFields;

    const handleAdd = useCallback(() => {
        const newSubItem = cvImport.emptySubItem(sectionType);
        addSubItem(sectionIndex, itemIndex, newSubItem);
    }, [sectionType, sectionIndex, itemIndex, addSubItem]);

    const handleCommitField = useCallback(
        (subItemIndex: number, field: string, value: string) => {
            updateSubItemField(
                sectionIndex,
                itemIndex,
                subItemIndex,
                field,
                value
            );
        },
        [sectionIndex, itemIndex, updateSubItemField]
    );

    if (!subFields) return null;

    const subItems = item.subItems ?? [];
    const subFieldEntries = Object.entries(subFields);

    const sectionLabel =
        sectionType === 'experience'
            ? 'Roles'
            : sectionType === 'education'
              ? 'Subjects'
              : sectionType === 'skill'
                ? 'Skills'
                : sectionType === 'personal_info'
                  ? 'Socials'
                  : 'Entries';

    return (
        <div className="mt-3 border-t border-border-default pt-3">
            <p className="mb-2 text-xs font-medium text-ash">{sectionLabel}</p>

            <div className="flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                    {subItems.map((sub, subIndex) => (
                        <motion.div
                            key={sub.id}
                            layout
                            variants={scaleIn}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={springs.snappy}
                            className="flex items-start gap-2 rounded-md border border-border-default bg-gunmetal p-2"
                        >
                            <div className="flex flex-1 flex-wrap gap-2">
                                {subFieldEntries.map(([key, def]) => (
                                    <SubItemField
                                        key={key}
                                        fieldKey={key}
                                        def={def}
                                        value={sub.fields[key] ?? ''}
                                        subItemIndex={subIndex}
                                        onCommit={handleCommitField}
                                    />
                                ))}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0 hover:text-destructive"
                                onClick={() =>
                                    removeSubItem(
                                        sectionIndex,
                                        itemIndex,
                                        subIndex
                                    )
                                }
                                aria-label="Remove entry"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 text-xs text-ash hover:text-flux"
                onClick={handleAdd}
            >
                <Plus className="mr-1 h-3 w-3" />
                Add
            </Button>
        </div>
    );
}

// -- Sub-item field with local state --

interface SubItemFieldProps {
    fieldKey: string;
    def: FieldDef;
    value: string;
    subItemIndex: number;
    onCommit: (subItemIndex: number, field: string, value: string) => void;
}

function SubItemField({
    fieldKey,
    def,
    value,
    subItemIndex,
    onCommit,
}: SubItemFieldProps) {
    const [localValue, setLocalValue] = useState(value);

    const handleBlur = () => {
        if (localValue !== value) {
            onCommit(subItemIndex, fieldKey, localValue);
        }
    };

    return (
        <div className="flex-1 min-w-[120px]">
            {def.type === 'textarea' ? (
                <Textarea
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    placeholder={def.placeholder ?? def.label}
                    className="min-h-[40px] resize-y text-xs bg-gunmetal border-border-default focus-visible:ring-1 focus-visible:ring-border-hot"
                />
            ) : (
                <Input
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    placeholder={def.placeholder ?? def.label}
                    className="h-7 text-xs bg-gunmetal border-border-default focus-visible:ring-1 focus-visible:ring-border-hot"
                />
            )}
        </div>
    );
}
