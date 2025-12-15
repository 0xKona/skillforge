import { render, screen } from '@testing-library/react';
import DynamicForm from './dynamic-form';
import { IngotFormHelper } from '@/lib/classes/helpers/ingot-form-helpers';
import { IngotField } from '@/lib/types/ingot-types';

jest.mock('./form-field', () => ({
    FormField: ({ fieldKey }: { fieldKey: string }) => (
        <div data-testid={`field-${fieldKey}`}>Field {fieldKey}</div>
    ),
}));

jest.mock('@/lib/classes/helpers/ingot-form-helpers');

describe('DynamicForm', () => {
    const mockFields: Record<string, IngotField> = {
        field1: { value: '', inputType: 'text', mandatory: false },
        field2: { value: '', inputType: 'text', mandatory: false },
    };

    beforeEach(() => {
        (IngotFormHelper.getGroupedFields as jest.Mock).mockReturnValue([
            { type: 'single', keys: ['field1'] },
            { type: 'row', keys: ['field2'] },
        ]);
    });

    it('renders grouped fields', () => {
        render(
            <DynamicForm
                fields={mockFields}
                values={{ field1: '', field2: '' }}
                onChange={jest.fn()}
            />
        );
        expect(screen.getByTestId('field-field1')).toBeInTheDocument();
        expect(screen.getByTestId('field-field2')).toBeInTheDocument();
    });
});
