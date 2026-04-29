import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../__tests__/mocks/server";
import { mockUser } from "../../__tests__/mocks/handlers";
import { renderWithProviders } from "../../__tests__/utils/renderWithProviders";
import Page from "./page";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// checkAuthentication uses NEXT_PUBLIC_API_URL (unset in tests). Mock it to
// return a 200 with no user — skips both the redirect branch and the error branch,
// leaving the form in a clean initial state.
vi.mock("../../actions/checkAuthentication", () => ({
  default: vi.fn().mockResolvedValue({ status: 200, data: { user: null } }),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  mockPush.mockClear();
});
afterAll(() => server.close());

describe("Login Page", () => {
  it("calls the login handler once and redirects to /discover on valid credentials", async () => {
    const user = userEvent.setup();
    const loginSpy = vi.fn();

    server.use(
      http.post("http://localhost/api/v1/auth/log-in", () => {
        loginSpy();
        return HttpResponse.json({ user: mockUser });
      }),
    );

    renderWithProviders(<Page />);

    await user.type(screen.getByPlaceholderText("Username"), "testuser");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/discover");
    });

    expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
  });

  it("renders an error message when the server returns 401", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("http://localhost/api/v1/auth/log-in", () =>
        HttpResponse.json(
          { message: "Invalid credentials", code: 1 },
          { status: 401 },
        ),
      ),
    );

    renderWithProviders(<Page />);

    await user.type(screen.getByPlaceholderText("Username"), "baduser");
    await user.type(screen.getByPlaceholderText("Password"), "wrongpass");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
