import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "../../../__tests__/mocks/server";
import { mockUser } from "../../../__tests__/mocks/handlers";
import { renderWithProviders } from "../../../__tests__/utils/renderWithProviders";
import UserVitalSettings from "./UserVitalSettings";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());

describe("UserVitalSettings", () => {
  it("shows verification-sent message after completing re-auth and submitting a new email", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UserVitalSettings />, {
      preloadedState: { user: mockUser },
    });

    await user.click(screen.getByRole("button", { name: /change email/i }));

    // ReAuthModal is open — fill password and confirm
    await user.type(screen.getByPlaceholderText("Current password"), "mypassword");
    await user.click(screen.getByRole("button", { name: /^confirm$/i }));

    // After re-auth success: modal closes and email form appears
    await waitFor(() => {
      expect(screen.getByPlaceholderText("New email address")).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText("New email address"), "new@example.com");
    await user.click(screen.getByRole("button", { name: /send verification/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/a verification link was sent to/i, { selector: "p" }),
      ).toBeInTheDocument();
    });
  });

  it("shows username-updated message after submitting a new username", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UserVitalSettings />, {
      preloadedState: { user: mockUser },
    });

    await user.click(screen.getByRole("button", { name: /change username/i }));

    await user.type(screen.getByPlaceholderText("New username"), "coolnewname");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/username updated to/i, { selector: "p" }),
      ).toBeInTheDocument();
    });
  });
});
