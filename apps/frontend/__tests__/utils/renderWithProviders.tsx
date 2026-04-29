import React from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "../../lib/store";
import { setUser } from "../../lib/features/users/userSlice";

type PreloadedState = {
  user?: Parameters<typeof setUser>[0];
};

type ExtendedRenderOptions = Omit<RenderOptions, "wrapper"> & {
  preloadedState?: PreloadedState;
};

export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState = {}, ...renderOptions }: ExtendedRenderOptions = {},
) {
  const store = makeStore();
  if (preloadedState.user) {
    store.dispatch(setUser(preloadedState.user));
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from "@testing-library/react";
