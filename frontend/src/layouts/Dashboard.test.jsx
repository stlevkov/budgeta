import { test } from 'vitest';
 
import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";

test("renders test", () => {
  render(<Dashboard />);
  const linkElement = screen.getByText("Bugeta App");
  expect(linkElement).toBeInTheDocument();
});
