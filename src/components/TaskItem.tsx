import React, { useContext, useState } from "react";
import TaskForm from "./TaskForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../contexts/UserContext";
import { moveTask } from "../firebase";
import { TasksContext } from "../contexts/TasksContext";

import { TaskStatus } from "../types/task"

type Direction = -1 | 1;

interface TaskItemProps {
  id: string;
  task: string;
  status: TaskStatus
}

const TaskItem: React.FC<TaskItemProps> = ({ id, task, status }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user } = useContext(UserContext);
  const { taskStatus } = useContext(TasksContext);

  const changeStatus = (direction: Direction) => {
    if (user && taskStatus) {
      // find current status index
      const currentIdx = taskStatus.indexOf(status);

      // store new index as the value of currentIdx + the direction (1 or - 1)
      let newIdx = currentIdx + direction;
  
      // prevent out of range indexes of the taskStatus array
      // if newIdx < 0 - set to 0, if newIdx gte taskStatus length - set to last item in array, otherwise keep the value
      newIdx =
        newIdx < 0
          ? 0
          : newIdx >= taskStatus.length
          ? taskStatus.length - 1
          : newIdx;
  
      if (status !== taskStatus[newIdx]) {
        moveTask(user.dbRef + id, taskStatus[newIdx]);
      }
    }

  };
  // --------------------------- handleMovePrev
  const handleMovePrev = () => { changeStatus(-1); };

  // --------------------------- handleMoveNext
  const handleMoveNext = () => { changeStatus(1); };

  // --------------------------- toggleEdit
  // check if taskFormInput has a value (not cleared by user)
  const toggleEdit = () => {
    setIsEditing(isEditing => !isEditing);
  };

  return (
    <li className={`taskItem taskItem--${status}`}>
      {
        // If status is 'open' DO NOT render the "previous" status button
        status !== "open" && (
          <>
            <label htmlFor={`btnPrev--${id}`} className="srOnly">
              Move task to the previous status
            </label>
            <button
              id={`btnPrev--${id}`}
              className="taskItem__btn taskItem__btn--prev"
              onClick={handleMovePrev}
            >
              <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
              <span className="srOnly">Move task to the previous status</span>
            </button>
          </>
        )
      }

      {
        // if not in editing mode render the task as text ... otherwise render the task form to edit the task
        !isEditing ? (
          <>
            <label htmlFor={`taskItem--${id}`} className="srOnly">
              Click or focus on the text of the task to enter edit mode and
              modify or delete the task
            </label>
            <button
              id={`taskItem--${id}`}
              className="taskItem__text"
              onClick={toggleEdit}
              onFocus={toggleEdit}
            >
              {task}
            </button>
          </>
        ) : (
          <TaskForm
            id={id}
            type="edit"
            taskValue={task}
            closeForm={() => setIsEditing(false)}
          />
        )
      }

      {
        // If status is 'complete' DO NOT render the "next" status button
        status !== "complete" && (
          <>
            <label htmlFor={`btnNext--${id}`} className="srOnly">
              Move task to the previous status
            </label>
            <button
              id={`btnNext--${id}`}
              className="taskItem__btn taskItem__btn--next"
              onClick={handleMoveNext}
            >
              <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
              <span className="srOnly">
                Click to move task to the next status
              </span>
            </button>
          </>
        )
      }
    </li>
  );
};

export default TaskItem;
