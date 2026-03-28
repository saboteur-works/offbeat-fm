import { JSX } from "react";

export type ResourceTileProps = {
  resourceTiles: JSX.Element[];
};

const ResourceTileList = ({ resourceTiles }: ResourceTileProps) => {
  return (
    <div className="flex flex-col md:flex-row md:flex-wrap md:gap-4 md:content-start">
      {resourceTiles.map((tile, index) => (
        <div key={index}>{tile}</div>
      ))}
    </div>
  );
};

export default ResourceTileList;
