import React, { useContext } from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import Header from './components/Header';
import TaskBoardMenu from './components/TaskBoardMenu';
import TaskLists from './components/TaskLists';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  const { theme } = useContext(ThemeContext);

  return (
  <div className={`pageContainer ${theme}`}>
    {/* START of HEADER */}
    <Header />
    
    {/* START of MAIN */}
    <main>
      <div className="wrapper">
        <TaskBoardMenu />
        <TaskLists />
      </div>
    </main>

    {/* START of FOOTER */}
    <Footer />
  </div>
  );
}

export default App;
