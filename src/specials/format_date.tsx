import React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { getFormattedDateTime, CountdownTimer } from "../helpers/format_date";

describe("getFormattedDateTime", () => {
  it("should return a formatted date and time string", () => {
    // Mock the Date object
    const mockDate = new Date(2023, 5, 15, 14, 30); // June 15, 2023, 2:30 PM
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);

    const result = getFormattedDateTime();
    expect(result).toBe("2:30PM 15/06/2023");

    jest.restoreAllMocks();
  });
});

describe("CountdownTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render the correct time remaining", () => {
    const futureDate = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in the future
    const { getByText } = render(<CountdownTimer expiryTime={futureDate} />);

    expect(getByText("5:00")).toBeInTheDocument();

    // Fast-forward time by 1 minute
    act(() => {
      jest.advanceTimersByTime(60 * 1000);
    });

    expect(getByText("4:00")).toBeInTheDocument();
  });

  it("should change color when time is running out", () => {
    const futureDate = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes in the future
    const { getByText } = render(<CountdownTimer expiryTime={futureDate} />);

    const timerElement = getByText("3:00");
    expect(timerElement).toHaveClass("text-green-600");

    // Fast-forward time by 1 minute
    act(() => {
      jest.advanceTimersByTime(60 * 1000);
    });

    expect(timerElement).toHaveClass("text-red-600");
    expect(timerElement).toHaveClass("animate-pulse");
  });
});
