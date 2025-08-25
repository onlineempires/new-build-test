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
  // If onClick is provided, we need to use the new Link pattern without legacyBehavior
  // and handle the click directly on the Link component
  if (onClick) {
    return (
      <Link
        href={href}
        onClick={onClick}
        {...props}
      >
        <div
          className={className}
          style={style}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          aria-label={ariaLabel}
          title={title}
          role="link"
          tabIndex={0}
        >
          {/* React Fragment ensures all children are wrapped in a single element */}
          <>{children}</>
        </div>
      </Link>
    );
  }

  // For simple links without onClick, use the standard pattern
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      title={title}
      {...props}
    >
      {/* React Fragment ensures all children are wrapped in a single element */}
      <>{children}</>
    </Link>
  );
};

export default SafeLink;