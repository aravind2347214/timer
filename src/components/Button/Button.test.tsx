import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import  {Button}  from "./Button"; // Adjust the path to the Button component

describe("Button Component", () => {
  it("renders primary button with label", () => {
    render(<Button variant="primary" label="Click Me" />);
    const button = screen.getByRole("button",{name:/Click Me/i});
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary-50");
  });

  it("renders text button with label", () => {
    render(<Button variant="text" label="Text Button" />);
    const button = screen.getByText("Text Button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("text-primary-50");
  });

  it("renders outline button with label", () => {
    render(<Button variant="outline" label="Outline Button" />);
    const button = screen.getByRole("button",{name:/Outline Button/i});
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("border-primary-50");
  });

  it("renders icon button with an image", () => {
    render(<Button variant="icon" icon="/icon-path.png" label="Icon Button" />);
    const img = screen.getByRole("img", { name: "Icon Button" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/icon-path.png");
  });

  it("calls onClick when the button is clicked", () => {
    const onClick = vi.fn();
    render(<Button variant="primary" label="Click Me" onClick={onClick} />);
    const button = screen.getByText("Click Me");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it("displays children instead of label when provided", () => {
    render(
      <Button variant="primary">
        <span>Custom Child</span>
      </Button>
    );
    const customChild = screen.getByText("Custom Child");
    expect(customChild).toBeInTheDocument();
  });

  it("does not render when invalid variant is provided", () => {
    render(<Button variant={"invalid"} label="Invalid" />);
    const button = screen.queryByText("Invalid");
    expect(button).not.toBeInTheDocument();
  });

  it("renders button with title attribute", () => {
    render(<Button variant="primary" label="Click Me" title="Button Title" />);
    const button = screen.getByTitle("Button Title");
    expect(button).toBeInTheDocument();
  });

});