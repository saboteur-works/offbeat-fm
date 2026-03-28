import IconLink from "../IconLink/IconLink.js";
import { Icon, IconName } from "../Icons/Icons.js";
import TechnicalTypography from "../Typography/TechnicalTypography.js";

export interface ExternalLinkListProps {
  containerClasses?: string;
  links: { [key: string]: string | undefined };
  linkContainerType: "list" | "cloud";
  hideLinkTitle?: boolean;
  title: string;
}

export default function ExternalLinkList({
  links,
  containerClasses = "mt-2",
  linkContainerType = "list",
  hideLinkTitle = false,
  title = "Links",
}: ExternalLinkListProps) {
  return (
    <div id="artist-external-links" className={containerClasses}>
      <div className="mb-4 mt-4">
        <TechnicalTypography text={title} isRed uppercase />
      </div>
      <div
        id="links-container"
        className={
          linkContainerType === "cloud"
            ? "flex flex-wrap gap-2"
            : "flex flex-col gap-2"
        }
      >
        {links &&
          Object.keys(links).map((key) => {
            const url = links[key];
            if (url) {
              // return (
              //   <a
              //     href={url}
              //     className="max-w-max flex items-center gap-1 hover:underline"
              //     key={key}
              //     target="_blank"
              //   >
              //     <Icon size="small" icon={key as IconName} />
              //     {!hideLinkTitle && key.charAt(0).toUpperCase() + key.slice(1)}
              //   </a>
              // );
              return (
                <IconLink
                  key={key}
                  href={url}
                  icon={<Icon size="small" icon={key as IconName} />}
                  label={
                    !hideLinkTitle
                      ? key.charAt(0).toUpperCase() + key.slice(1)
                      : "Unknown Link"
                  }
                />
              );
            }
            return null;
          })}
      </div>
    </div>
  );
}
