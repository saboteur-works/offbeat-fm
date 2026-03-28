interface IconLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

/**
 * Link for external social media or music platform profiles, consisting of an icon and a label,
 * styled with a border and padding. Used in ArtistProfile to link to artists' social media and music platforms.
 */
export default function IconLink({ href, icon, label }: IconLinkProps) {
  return (
    <a href={href} className="icon-link border border-ob-dim">
      {icon}
      <span className="icon-link-label grow text-brand-mid uppercase text-ob-label">
        {label}
      </span>
    </a>
  );
}
