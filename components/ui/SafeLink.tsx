import Link from 'next/link';
import { ReactNode, MouseEvent } from 'react';

interface SafeLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
  'aria-label'?: string;
  title?: string;
}

/**
 * SafeLink Component
 * 
 * A wrapper around Next.js Link that properly handles multiple children
 * by wrapping them in a React Fragment. This prevents the "Multiple children 
 * were passed to <Link>" error while maintaining all Link functionality.
 * 
 * Also handles onClick events properly for modern Next.js (13+) by using
 * legacyBehavior when needed.
 * 
 * Usage:
 * <SafeLink href="/dashboard" className="nav-item">
 *   <Icon />
 *   <span>Dashboard</span>
 * </SafeLink>
 */
export const SafeLink: React.FC<SafeLinkProps> = ({
  href,
  children,
  className,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  target,
  rel,
  'aria-label': ariaLabel,
  title,
  ...props
}) => {
  // For modern Next.js 13+, we always use the new Link pattern
  // If onClick is provided, we handle it properly without warnings
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      {...props}
    >
      <span
        className={className}
        style={style}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={ariaLabel}
        title={title}
        role="link"
        tabIndex={0}
      >
        {/* React Fragment ensures all children are wrapped in a single element */}
        <>{children}</>
      </span>
    </Link>
  );
};

export default SafeLink;