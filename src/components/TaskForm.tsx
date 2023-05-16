import React, { useContext, useState, useEffect } from 'react';
import autosize from 'autosize';
import {UserContext} from '../contexts/UserContext';
import { addTask, removeTask, updateTask } from '../firebase';
import { NewTask, TaskStatus } from '../types/task'
interface TaskFormProps {
  id: TaskStatus | string;
  type: "edit" | "staging";
  taskValue?: string;
  closeForm: () => void;
}

const TaskForm: React.FC<TaskFormProps> = (props) => {
  const { id, type, taskValue, closeForm } = props;
  const {user} = useContext(UserContext);
  const [ taskInput, setTaskInput ] = useState(taskValue || "")

    // --------------------------- useEffect
    useEffect(() => {
      const textInput = document.querySelector(`#taskFormInput_${id}`) as HTMLTextAreaElement;
  
      // only go to the end of the text if the input is not already focused
      if (textInput && textInput !== document.activeElement) {
        // autosize the textarea height as needed
        autosize(textInput);
  
        // set the cursor to the end of the text input by setting value to "" > focus > value back to state.stagingTask
        textInput.value = "";
        // focus on the input
        textInput.focus();
        // set the input value
        textInput.value = taskInput;
      }
    }, [id, taskInput])

    const handleBlur = (evt: React.SyntheticEvent) => {
      // implementation from https://gist.github.com/pstoica/4323d3e6e37e8a23dd59
      const currentTarget = evt.currentTarget;
  
      // Check the newly focused element in the next tick of the event loop
      setTimeout(() => {
        // Check if the new activeElement is a child of the original container
        if (!currentTarget.contains(document.activeElement)) {
          // if new focused element is not contained in the form ... toggle out of staging a task
          closeForm()
        }
      }, 5);
    }

  const handleTaskInputChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTaskInput(evt.target.value);
  }

  const handleClear = () => setTaskInput("");

  const handleAddTask = (evt: React.SyntheticEvent) => { 
    evt.preventDefault();
    const newTask: NewTask = {
      task: taskInput,
      status: id as TaskStatus
    }

    if (user) {
      addTask(user.dbRef, newTask); 
      closeForm()
    }
  }

  const handleRemoveTask = () => { 
    if (user) {
      closeForm()
      removeTask(user.dbRef, id); 
    }
  }
  
  const handleUpdateTask = (evt: React.SyntheticEvent) => { 
    evt.preventDefault();
    if (user) {
      updateTask(user.dbRef, id, taskInput); 
      closeForm()
    }
  }

  return (
    <>
      <h3 className="taskForm__heading">{type === 'edit' ? 'Edit Task' : 'New Task'}</h3>
      <form action="#" onSubmit={type === 'edit' ? handleUpdateTask : handleAddTask} onBlur={handleBlur} className="taskForm">
        <label htmlFor={`taskFormInput_${id}`} className="srOnly">Task Item</label>
        <textarea className="taskForm__input" id={`taskFormInput_${id}`} name="taskFormInput" onChange={handleTaskInputChange} value={taskInput}></textarea>
        
        {
        // if there is input, display button to clear the text
        taskInput &&
          <>
            <label htmlFor={`taskBtn__clear--${id}`} className="srOnly">Clear task input</label>
            <button id={`taskBtn__clear--${id}`} type="button" onClick={handleClear} className="btn btn--black">Clear</button>
          </>  
        }
        
        {
        // if in editing mode, display button to delete the task
        type === "edit" 
        &&
          <>
            <label htmlFor={`taskBtn__delete--${id}`} className="srOnly">Delete task</label>
            <button id={`taskBtn__delete--${id}`} type="button" onClick={handleRemoveTask} className="btn btn--red">Delete</button>
          </>
        }
        
        {/* Save task button */}
        <label htmlFor={`taskBtn__save--${id}`} className="srOnly">Save task input</label>
        <button id={`taskBtn__save--${id}`} className="btn btn--green" disabled={taskInput.length === 0}>{type === 'edit' ? 'Save' : 'Add'}</button>
        
      </form>  
    </>
  );
}

export default TaskForm;