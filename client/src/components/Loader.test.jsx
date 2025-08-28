import { render, screen, waitFor } from "@testing-library/react";
import Loader from "./Loader";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import React from "react";

// Mocking react-router-dom's useParams
jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

// Mocking the AppContext
jest.mock("../context/AppContext", () => ({
  useAppContext: jest.fn(),
}));

describe("Loader", () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    useAppContext.mockReturnValue({
      navigate: navigateMock,
    });
    useParams.mockReturnValue({});
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("renders the loader spinner", () => {
    render(<Loader />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("navigates to the nextUrl after 8 seconds if nextUrl is present", async () => {
    useParams.mockReturnValue({ nextUrl: "dashboard" });
    render(<Loader />);

    expect(navigateMock).not.toHaveBeenCalled();

    jest.advanceTimersByTime(8000);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("does not navigate if nextUrl is not present", () => {
    render(<Loader />);
    jest.advanceTimersByTime(8000);
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
