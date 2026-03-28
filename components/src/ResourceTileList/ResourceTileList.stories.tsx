import type { Meta, StoryObj } from "@storybook/react-vite";

import ResourceTileList from "./ResourceTileList";
import ResourceTile from "../ResourceTile/ResourceTile";
import TrackCard from "../TrackCard/TrackCard";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Atoms/ResourceTileList",
  component: ResourceTileList,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof ResourceTileList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    resourceTiles: [
      <ResourceTile
        mainText="Short Main Text"
        subText="Short Sub Text"
        onClick={() => {}}
      />,
      <ResourceTile
        mainText="Main Text That Is Surprisingly Long and Needs Marquee"
        subText="Sub Text"
        onClick={() => {}}
      />,
      <ResourceTile
        mainText="Another Tile with medium text amount"
        subText="Sub Text that's longer but smaller than the main text"
        onClick={() => {}}
      />,
      <ResourceTile
        mainText="Main Text"
        subText="Sub Text"
        onClick={() => {}}
      />,
      <ResourceTile
        mainText="Main Text"
        subText="Sub Text"
        onClick={() => {}}
      />,
      <ResourceTile
        mainText="Main Text"
        subText="Sub Text"
        onClick={() => {}}
      />,
      <ResourceTile
        mainText="Main Text"
        subText="Sub Text"
        onClick={() => {}}
      />,
      <ResourceTile
        mainText="Main Text"
        subText="Sub Text"
        onClick={() => {}}
      />,
    ],
  },
};

export const NewCards: Story = {
  args: {
    resourceTiles: [
      <TrackCard
        title="Believe"
        artist="The Neon Circuit"
        genre="Electronic"
        imageUrl="https://picsum.photos/512?random=1"
      />,
      <TrackCard
        title="Believe"
        artist="The Neon Circuit"
        genre="Electronic"
        imageUrl="https://picsum.photos/512?random=2"
      />,
      <TrackCard
        title="Believe"
        artist="The Neon Circuit"
        genre="Electronic"
        imageUrl="https://picsum.photos/512?random=1"
      />,
      <TrackCard
        title="Believe"
        artist="The Neon Circuit"
        genre="Electronic"
        imageUrl="https://picsum.photos/512?random=2"
      />,
      <TrackCard
        title="Believe"
        artist="The Neon Circuit"
        genre="Electronic"
        imageUrl="https://picsum.photos/512?random=1"
      />,
    ],
  },
};
