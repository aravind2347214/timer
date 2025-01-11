import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders SVG with proper attributes", () => {
    const { container } = render(<EmptyState />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveClass("w-64", "h-64", "mb-4", "text-gray-300");
    expect(svg).toHaveAttribute("fill", "none");
  });

  it("should contain circle and path elements", () => {
    const { container } = render(<EmptyState />);

    const circle = container.querySelector("circle");
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveAttribute("r", "11");
    expect(circle).toHaveAttribute("cy", "12");
    expect(circle).toHaveAttribute("cx", "12");
    expect(circle).toHaveAttribute("stroke", "currentColor");

    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(2);
    paths.forEach((path) => {
      expect(path).toHaveAttribute("stroke", "currentColor");
    });
  });
});