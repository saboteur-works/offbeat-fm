import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../../../__tests__/mocks/server";
import { mockUser, mockArtist } from "../../../../__tests__/mocks/handlers";
import { renderWithProviders } from "../../../../__tests__/utils/renderWithProviders";
import Page from "./page";

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

describe("Create Artist Page", () => {
  it("submits the form and redirects to the artist dashboard on valid input", async () => {
    const user = userEvent.setup();
    const createSpy = vi.fn();

    server.use(
      http.get("http://localhost/api/v1/auth/check-auth", () =>
        HttpResponse.json({ user: mockUser }),
      ),
      http.post("http://localhost/api/v1/artists", () => {
        createSpy();
        return HttpResponse.json({ artist: mockArtist }, { status: 201 });
      }),
    );

    renderWithProviders(<Page />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /save artist profile/i }),
      ).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText("Enter your artist name"),
      "My Band",
    );
    await user.selectOptions(screen.getByRole("combobox"), "Rock");
    await user.click(screen.getByRole("button", { name: /save artist profile/i }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/artist/dashboard");
    });
  });

  it("shows an inline error for a missing required field and does not call the API", async () => {
    const user = userEvent.setup();
    const createSpy = vi.fn();

    server.use(
      http.get("http://localhost/api/v1/auth/check-auth", () =>
        HttpResponse.json({ user: mockUser }),
      ),
      http.post("http://localhost/api/v1/artists", () => {
        createSpy();
        return HttpResponse.json({ artist: mockArtist }, { status: 201 });
      }),
    );

    renderWithProviders(<Page />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /save artist profile/i }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /save artist profile/i }));

    await waitFor(() => {
      expect(screen.getByText("Artist name is required")).toBeInTheDocument();
    });
    expect(createSpy).not.toHaveBeenCalled();
  });
});
