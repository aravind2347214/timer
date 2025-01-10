import { Provider } from "react-redux"; // Correctly import Provider from react-redux
import { render } from "@testing-library/react";
import { store } from "../src/store/useTimerStore"; // Adjust the path to your store
import { ReactElement } from "react";
import React from "react";

// Create a helper function to render with the provider
const renderWithRedux = (ui: ReactElement) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

export { renderWithRedux };
