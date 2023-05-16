import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import UserContext from './contexts/UserContext';
import ThemeContext from './contexts/ThemeContext';
import TasksContext from './contexts/TasksContext';

ReactDOM.render(
  <React.StrictMode>
    <UserContext>
      <ThemeContext>
        <TasksContext>
          <App />
        </TasksContext>
      </ThemeContext>
    </UserContext>
  </React.StrictMode>,
  document.getElementById('root')
);