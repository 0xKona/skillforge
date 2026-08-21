export interface IconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    color?: string;
    size?: number;
}

export default function HomeIcon({
    className,
    color = 'currentColor',
    size = 24,
    ...props
}: IconProps) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={color}
            {...props}
        >
            <path d="M12 3L2 12h3v9h5v-6h4v6h5v-9h3L12 3zm-1 8h2v4h-2v-4z" />
        </svg>
    );
}
