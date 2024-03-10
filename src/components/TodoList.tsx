import React from "react";
import cx from "../libs/cx";

type View = "all" | "active" | "completed";

interface MainProps {
  view: View;
  tasks: Array<{ id: string; done: boolean; content: string }>;
  currentView: View;
  changeView: (val: View) => void;
  toggleTaskStatus: (id: string) => void;
  removeTask: (id: string) => void;
  clearCompleted: () => void;
  dropped: (event: React.DragEvent<HTMLDivElement>) => void;
}

const TodoList: React.FC<MainProps> = ({
  tasks,
  view,
  changeView,
  clearCompleted,
  currentView,
  dropped,
  removeTask,
  toggleTaskStatus,
}) => {
  function draggingOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    event.dataTransfer.dropEffect = "move";
  }

  function dragStarted(event: React.DragEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.dataTransfer.setData("id", (event.target as HTMLDivElement).id);
    event.dataTransfer.effectAllowed = "move";
  }

  const task = (task: { id: string; done: boolean; content: string }) => (
    <div
      draggable="true"
      onDragStart={dragStarted}
      onDragOver={draggingOver}
      onDrop={dropped}
      id={task.id}
      key={task.id}
      className={cx("main__task-item", task.done ? "done" : "")}
    >
      <button
        className="main__task-btn btn"
        onClick={() => {
          toggleTaskStatus(task.id);
        }}
        type="button"
      ></button>

      <h3 className="main__task-title done">{task.content}</h3>

      <button
        className="main__task-delete-btn btn"
        onClick={() => removeTask(task.id)}
        type="button"
        aria-label="remove task"
      ></button>
    </div>
  );

  let list: React.ReactElement[] | React.ReactElement = [];

  if (view === "all") {
    const t = tasks.map(task);
    list = t.length === 0 ? <EmptyList value="Empty List" /> : t;
  } else if (view === "active") {
    const t = tasks.filter((task) => task.done === false).map(task);
    list = t.length === 0 ? <EmptyList value="No active task" /> : t;
  } else {
    const t = tasks.filter((task) => task.done === true).map(task);
    list = t.length === 0 ? <EmptyList value="No completed task" /> : t;
  }

  const totalTasks = tasks.filter((t) => t.done === false).length;
  const count =
    totalTasks > 1 ? `${totalTasks} items left` : `${totalTasks} item left`;

  return (
    <>
      <section className="main__task">
        {list}

        <div className="main__task-controls">
          <div className="main__task-items-left">{count}</div>

          <TaskSortComponent
            className={"hide-mobile"}
            changeView={changeView}
            currentView={currentView}
          />

          <button
            className="main__task-clear-completed--btn btn"
            onClick={clearCompleted}
          >
            Clear Completed
          </button>
        </div>
      </section>

      <TaskSortComponent
        className={"hide-desktop"}
        changeView={changeView}
        currentView={currentView}
      />
    </>
  );
};

export default TodoList;

const EmptyList: React.FC<{ value: string }> = (props) => (
  <div className="main__task-empty">{props.value}</div>
);

interface TaskSortComponentProps {
  className: string;
  currentView: View;
  changeView: (val: View) => void;
}

const TaskSortComponent: React.FC<TaskSortComponentProps> = ({
  changeView,
  className,
  currentView,
}) => {
  return (
    <div className={cx("main__sortList", className)}>
      <ul>
        <li
          className={cx(currentView === "all" && "active")}
          onClick={() => changeView("all")}
        >
          All
        </li>
        <li
          className={cx(currentView === "active" && "active")}
          onClick={() => changeView("active")}
        >
          Active
        </li>
        <li
          className={cx(currentView === "completed" && "active")}
          onClick={() => changeView("completed")}
        >
          Completed
        </li>
      </ul>
    </div>
  );
};
