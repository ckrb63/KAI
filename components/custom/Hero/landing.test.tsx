import { describe, it, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LandingHero } from "./landing";
import "@testing-library/jest-dom";

const mockUseAuth = vi.fn();
vi.mock("@clerk/nextjs", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("typewriter-effect", () => ({
  default: function MockTypewriter() {
    return <div>Typewriter Effect</div>;
  },
}));

describe("LandingPage Hero", () => {

  it("renders the texts", () => {
    mockUseAuth.mockReturnValue({ isSignedIn: true });
    render(<LandingHero />);

    expect(screen.getByText("한국인을 위한 가장 쉬운")).toBeInTheDocument();
    expect(screen.getByText("Typewriter Effect")).toBeInTheDocument();
  });

  it("link with signed in user", () => {
    mockUseAuth.mockReturnValue({ isSignedIn: true });
    render(<LandingHero />);

    expect(screen.getByRole("link").getAttribute("href")).toBe("/dashboard");
  });

  it("link without signed in user", () => {
    mockUseAuth.mockReturnValue({ isSignedIn: false });
    render(<LandingHero />);

    expect(screen.getByRole("link").getAttribute("href")).toBe("/sign-up");
  });
});
