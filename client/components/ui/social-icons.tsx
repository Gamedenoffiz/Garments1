import React from "react";
import { cn } from "@/lib/utils";
import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  PinterestIcon,
} from "./icons";

interface SocialIconProps {
  href: string;
  ariaLabel: string;
  className?: string;
}

interface SocialIconButtonProps extends SocialIconProps {
  icon: React.ComponentType<{
    size?: string;
    variant?: string;
    className?: string;
  }>;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "bordered";
}

const SocialIconButton: React.FC<SocialIconButtonProps> = ({
  icon: Icon,
  href,
  ariaLabel,
  size = "md",
  variant = "default",
  className,
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const variants = {
    default: "bg-transparent hover:bg-gray-100",
    bordered:
      "border border-[#999] rounded-full bg-transparent hover:bg-gray-100",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-200",
        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400",
        sizes[size],
        variants[variant],
        className,
      )}
    >
      <Icon
        size={size}
        variant="black"
        className="fill-[#999] hover:fill-[#333] transition-colors duration-200"
      />
    </a>
  );
};

// Instagram Icon Component
export const InstagramButton: React.FC<SocialIconProps> = ({
  href,
  ariaLabel = "Follow us on Instagram",
  className,
}) => (
  <SocialIconButton
    icon={InstagramIcon}
    href={href}
    ariaLabel={ariaLabel}
    variant="bordered"
    className={className}
  />
);

// Twitter Icon Component
export const TwitterButton: React.FC<SocialIconProps> = ({
  href,
  ariaLabel = "Follow us on Twitter",
  className,
}) => (
  <SocialIconButton
    icon={TwitterIcon}
    href={href}
    ariaLabel={ariaLabel}
    variant="bordered"
    className={className}
  />
);

// Facebook Icon Component
export const FacebookButton: React.FC<SocialIconProps> = ({
  href,
  ariaLabel = "Follow us on Facebook",
  className,
}) => (
  <SocialIconButton
    icon={FacebookIcon}
    href={href}
    ariaLabel={ariaLabel}
    variant="bordered"
    className={className}
  />
);

// Pinterest Icon Component
export const PinterestButton: React.FC<SocialIconProps> = ({
  href,
  ariaLabel = "Follow us on Pinterest",
  className,
}) => (
  <SocialIconButton
    icon={PinterestIcon}
    href={href}
    ariaLabel={ariaLabel}
    variant="bordered"
    className={className}
  />
);

// Social Icons Group Component
interface SocialIconsGroupProps {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  pinterest?: string;
  className?: string;
  iconClassName?: string;
}

export const SocialIconsGroup: React.FC<SocialIconsGroupProps> = ({
  instagram,
  twitter,
  facebook,
  pinterest,
  className,
  iconClassName,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {instagram && (
        <InstagramButton href={instagram} className={iconClassName} />
      )}
      {twitter && <TwitterButton href={twitter} className={iconClassName} />}
      {facebook && <FacebookButton href={facebook} className={iconClassName} />}
      {pinterest && (
        <PinterestButton href={pinterest} className={iconClassName} />
      )}
    </div>
  );
};

// Footer Social Icons (as used in footer)
interface FooterSocialIconsProps {
  social: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    pinterest?: string;
  };
  className?: string;
}

export const FooterSocialIcons: React.FC<FooterSocialIconsProps> = ({
  social,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-start gap-4", className)}>
      <h3 className="text-[#111] font-jost text-[18px] font-normal leading-[28px] mb-2">
        Follow Us
      </h3>
      <SocialIconsGroup
        {...social}
        className="flex gap-3"
        iconClassName="w-9 h-9"
      />
    </div>
  );
};

export default SocialIconsGroup;
