type Props = {
    className?: string;
    /** Outer circle size (Tailwind classes like "h-10 w-10"). Default: h-10 w-10 */
    sizeClassName?: string;
    /** Inner logo padding (Tailwind classes like "p-2"). Default: p-2 */
    paddingClassName?: string;
    /** Path to logo in /public */
    src?: string;
    /** Accessible label (optional) */
    alt?: string;
};

export default function AppLogoIcon({
    className,
    sizeClassName = 'h-10 w-10',
    paddingClassName = 'p-2',
    src = '/logo.svg',
    alt = 'Logo',
}: Props) {
    return (
        <div
            className={[
                'inline-flex items-center justify-center rounded-full bg-white dark:bg-black',
                sizeClassName,
                paddingClassName,
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            aria-label={alt}
        >
            {/* Logo color: black in light mode, white in dark mode */}
            <img
                src={src}
                alt={alt}
                className="h-full w-full object-contain invert dark:invert-0"
                draggable={false}
            />
        </div>
    );
}
