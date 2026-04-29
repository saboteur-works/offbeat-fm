import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { http, HttpResponse } from "msw";
import { server } from "../../../../../__tests__/mocks/server";
import { mockUser } from "../../../../../__tests__/mocks/handlers";
import { renderWithProviders } from "../../../../../__tests__/utils/renderWithProviders";
import submitTrack from "../../../../../actions/submitTrack";
import Page from "./page";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../../../../actions/submitTrack");

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());

describe("Add Track Page", () => {
  it("submits the form and redirects to the artist dashboard on valid input", async () => {
    const user = userEvent.setup();

    server.use(
      http.get("http://localhost/api/v1/auth/check-auth", () =>
        HttpResponse.json({ user: mockUser }),
      ),
    );
    vi.mocked(submitTrack).mockResolvedValue({ status: 201 } as any);

    await act(async () => {
      renderWithProviders(
        <Suspense fallback={null}>
          <Page params={Promise.resolve({ artistId: "artist-123" })} />
        </Suspense>,
      );
    });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter track title"),
      ).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText("Enter track title"), "Test Track");
    await user.selectOptions(screen.getByRole("combobox"), "Rock");
    await user.click(screen.getByRole("button", { name: /add track/i }));

    await waitFor(() => {
      expect(submitTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Track",
          genre: "Rock",
          artistId: "artist-123",
        }),
      );
      expect(mockPush).toHaveBeenCalledWith("/artist/dashboard/artist-123");
    });
  });

  it("shows an inline error for a missing required field and does not call the API", async () => {
    const user = userEvent.setup();

    server.use(
      http.get("http://localhost/api/v1/auth/check-auth", () =>
        HttpResponse.json({ user: mockUser }),
      ),
    );

    await act(async () => {
      renderWithProviders(
        <Suspense fallback={null}>
          <Page params={Promise.resolve({ artistId: "artist-123" })} />
        </Suspense>,
      );
    });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter track title"),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add track/i }));

    await waitFor(() => {
      expect(screen.getByText("Track title is required")).toBeInTheDocument();
    });
    expect(submitTrack).not.toHaveBeenCalled();
  });
});
