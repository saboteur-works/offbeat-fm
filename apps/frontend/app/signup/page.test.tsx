import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import toast from "react-hot-toast";
import { server } from "../../__tests__/mocks/server";
import { renderWithProviders } from "../../__tests__/utils/renderWithProviders";
import Page from "./page";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../commonComponents/ResendVerification", () => ({
  default: () => <div data-testid="resend-verification" />,
}));

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());

describe("Sign Up Page", () => {
  it("shows success state after valid form submission", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Page />);

    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Username"), "testuser");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.type(screen.getByPlaceholderText("Confirm Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /sign up successful/i }),
      ).toBeInTheDocument();
    });
    expect(screen.queryByPlaceholderText("Email")).not.toBeInTheDocument();
    expect(screen.getByTestId("resend-verification")).toBeInTheDocument();
  });

  it("shows error toast when server returns a duplicate-username error", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("http://localhost/api/v1/auth/sign-up", () =>
        HttpResponse.json({ message: "Username already taken" }, { status: 409 }),
      ),
    );

    renderWithProviders(<Page />);

    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Username"), "existinguser");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.type(screen.getByPlaceholderText("Confirm Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Sign up failed. Please review the form and try again.",
      );
    });
  });

  it("shows inline validation error for an empty required field without making a network request", async () => {
    const user = userEvent.setup();
    const signupSpy = vi.fn();

    server.use(
      http.post("http://localhost/api/v1/auth/sign-up", () => {
        signupSpy();
        return HttpResponse.json({}, { status: 201 });
      }),
    );

    renderWithProviders(<Page />);

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
    expect(signupSpy).not.toHaveBeenCalled();
  });
});
