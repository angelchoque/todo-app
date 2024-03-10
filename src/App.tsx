import React, { useState } from "react";
import Header from "./components/Header";
import TodoList from "./components/TodoList";

interface Task {
  id: string;
  content: string;
  done: boolean;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      content: "Example",
      done: false,
      id: "1710101547259",
    },
    {
      content: "Example done",
      done: true,
      id: "1710101547260",
    },
  ]);
  const [view, setView] = useState<"all" | "active" | "completed">("all");

  function changeView(val: "all" | "active" | "completed") {
    setView(val);
  }

  function toggleTheme(): void {
    const app: HTMLElement | null = document.querySelector("#app");

    if (darkMode) {
      app?.classList.remove("dark");
      app?.classList.add("light");
    } else {
      app?.classList.remove("light");
      app?.classList.add("dark");
    }

    setDarkMode((prev) => !prev);
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.done));
  }

  function toggleTaskStatus(id: string) {
    setTasks((prev) => {
      const index = prev.findIndex((task) => task.id === id);
      const task = prev[index];
      const data = [...prev];
      data[index] = { ...task, done: !task.done };
      return data;
    });
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function dropped(event: React.DragEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.preventDefault();

    let currentId: string | undefined = undefined;
    const id = event.dataTransfer.getData("id");

    if (!(event.target as HTMLDivElement).id)
      currentId = (
        (event.target as HTMLDivElement).parentNode! as HTMLDivElement
      ).id;
    else currentId = (event.target as HTMLDivElement).id;

    const i = tasks.findIndex((t) => t.id === currentId);
    const y = tasks.findIndex((t) => t.id === id);

    const x = tasks[i];
    const z = tasks[y];

    const data = [...tasks];

    data[i] = z;
    data[y] = x;

    setTasks(data);
  }

  function addTask(txt: string) {
    setTasks((prev) => [
      { content: txt, done: false, id: Date.now().toString() },
      ...prev,
    ]);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const todoTxt = formData.get("todo-input")?.toString();

    if (!todoTxt?.trim()) return;

    addTask(todoTxt);

    const inputElement = e.currentTarget.querySelector<HTMLInputElement>(
      'input[name="todo-input"]'
    );

    if (inputElement) {
      inputElement.value = "";
    }
  }

  return (
    <div id="app" className={darkMode ? "dark" : "light"}>
      <Header />

      <main className="main container">
        <section className="main__header">
          <div className="main__title-toggle--wrapper">
            <h1 className="main__title">ToDo</h1>

            <button
              className={`main__btn btn ${darkMode ? "dark" : "light"}`}
              onClick={toggleTheme}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="main__input">
              <button
                className="main__input-btn btn"
                type="submit"
                name="create-todo"
                aria-label="create todo button"
                data-testid="create-todo"
              ></button>

              <label className="main__input-label">
                <input
                  className="main__input-component"
                  type="text"
                  name="todo-input"
                  id="todo-input"
                  placeholder={"Create a new todo..."}
                  aria-label="todo input create"
                />
              </label>
            </div>
          </form>
        </section>

        <TodoList
          tasks={tasks}
          view={view}
          currentView={view}
          changeView={changeView}
          clearCompleted={clearCompleted}
          toggleTaskStatus={toggleTaskStatus}
          removeTask={removeTask}
          dropped={dropped}
        />
      </main>
    </div>
  );
}

export default App;
