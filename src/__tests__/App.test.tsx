import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import App from "../App";

describe("TodoList Component", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("render TodoList component", () => {
    render(<App />);

    expect(screen.getByText("ToDo")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Create a new todo...")
    ).toBeInTheDocument();
  });

  test("add new task", () => {
    render(<App />);

    const input = screen.getByPlaceholderText("Create a new todo...");
    const button = screen.getByTestId("create-todo");

    fireEvent.change(input, { target: { value: "Example todo test" } });
    fireEvent.click(button);

    expect(screen.getByText("Example todo test")).toBeInTheDocument();
  });

  test("delete task", () => {
    render(<App />);

    const input = screen.getByPlaceholderText("Create a new todo...");
    const button = screen.getByTestId("create-todo");

    fireEvent.change(input, { target: { value: "Task to delete" } });
    fireEvent.click(button);

    const taskEl = screen.getByText("Task to delete");
    const { nextSibling } = taskEl;
    fireEvent.click(nextSibling!);

    expect(screen.queryByText("Task to delete")).toBeNull();
  });

  test("complete task", () => {
    render(<App />);

    const input = screen.getByPlaceholderText("Create a new todo...");
    const button = screen.getByTestId("create-todo");

    fireEvent.change(input, { target: { value: "Task to complete" } });
    fireEvent.click(button);

    const taskEl = screen.getByText("Task to complete");
    const { previousSibling: checkboxButton } = taskEl;
    fireEvent.click(checkboxButton!);

    const { parentNode } = taskEl;

    expect(parentNode).toHaveClass("done");
  });
});
