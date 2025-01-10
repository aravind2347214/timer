import { render, screen ,fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Home from "./Home";
import '@testing-library/jest-dom/vitest'

import React from "react";
import { Provider } from "react-redux";
import { store } from "../src/store/useTimerStore";
import { renderWithRedux } from "../tests/RenderWithRedux";
let originalWidth = window.innerWidth;

describe("Home Component", () => {

  beforeEach(() => {
    // Save the original window width before each test
    originalWidth = window.innerWidth;
  });

  afterEach(() => {
    // Reset the window width after each test
    window.innerWidth = originalWidth;
  });

  it("renders the Timer App title and Add Timer button", () => {
    render(    
    <Provider store={store}>
      <Home />
    </Provider>);
    const heading = screen.getByRole("heading",{name:/Timer App/i})
    expect(heading).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Add Timer/i })).toBeInTheDocument();
  });

  it("displays the Toaster in the correct position based on window size", () => {
    // Simulate desktop view
    window.innerWidth = 1024;
    window.dispatchEvent(new Event("resize"));
    renderWithRedux (<Home />);
    const toasterDesktop = screen.queryByText(/bottom-center/i);
    expect(toasterDesktop).toBeNull();

    // Simulate mobile view
    window.innerWidth = 500;
    window.dispatchEvent(new Event("resize"));
    renderWithRedux(<Home />);
    const toasterMobile = screen.queryByText(/bottom-center/i);
    expect(toasterMobile).toBeNull();
  });

  it("opens the TimerModal when Add Timer button is clicked", () => {
    renderWithRedux(<Home />);
    const addTimerButton = screen.getByRole("button", { name: /Add Timer/i });
    fireEvent.click(addTimerButton);
    expect(screen.getByText(/Add New Timer/i)).toBeVisible();
  });

});
