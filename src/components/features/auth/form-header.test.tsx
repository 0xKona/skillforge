import { render, screen } from '@testing-library/react';
import FormHeader from './form-header';

interface FormHeaderProps {
    id?: string;
    title: string;
    description: string;
}

const TEST_ID = 'header';
const TEST_TITLE_ID = `${TEST_ID}-title`;
const TEST_DESC_ID = `${TEST_ID}-desc`;

describe('Form Header Component', () => {
    const testTitle = 'TestTitle';
    const testDesc = 'TestDesc';

    let props: FormHeaderProps = {
        id: TEST_ID,
        title: testTitle,
        description: testDesc,
    };

    it('Should render with correct title', () => {
        render(<FormHeader {...props} />);

        const container = screen.getByTestId(TEST_ID);
        const title = screen.getByTestId(TEST_TITLE_ID);

        expect(container).toBeInTheDocument();
        expect(title).toHaveTextContent(testTitle);
    });

    it('Should render with correct desc', () => {
        render(<FormHeader {...props} />);

        const container = screen.getByTestId(TEST_ID);
        const desc = screen.getByTestId(TEST_DESC_ID);

        expect(container).toBeInTheDocument();
        expect(desc).toHaveTextContent(testDesc);
    });

    it('Should re-render when title changes', () => {
        const { rerender } = render(<FormHeader {...props} />);

        const container = screen.getByTestId(TEST_ID);
        const title = screen.getByTestId(TEST_TITLE_ID);

        expect(container).toBeInTheDocument();
        expect(title).toHaveTextContent(testTitle);

        const newTitle = 'TitleChanged!';

        props = {
            ...props,
            title: newTitle,
        };

        rerender(<FormHeader {...props} />);

        expect(container).toBeInTheDocument();
        expect(title).toHaveTextContent(newTitle);
    });

    it('Should re-render when desc changes', () => {
        const { rerender } = render(<FormHeader {...props} />);

        const container = screen.getByTestId(TEST_ID);
        const desc = screen.getByTestId(TEST_DESC_ID);

        expect(container).toBeInTheDocument();
        expect(desc).toHaveTextContent(testDesc);

        const newDesc = 'DescChanged!';

        props = {
            ...props,
            description: newDesc,
        };

        rerender(<FormHeader {...props} />);

        expect(container).toBeInTheDocument();
        expect(desc).toHaveTextContent(newDesc);
    });
});
