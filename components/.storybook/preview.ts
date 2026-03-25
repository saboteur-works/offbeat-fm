import "../../apps/frontend/app/globals.css";
import { Preview } from "@storybook/react-vite";
const preview: Preview = {
  parameters: {
    backgkrounds: {
      options: {
        // 👇 Default options
        dark: { name: "Dark", value: "#0a0a0a" },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
