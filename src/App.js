import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import Footer from "./components/Footer";
import About from "./components/About";
import {useState, useEffect} from 'react';
import {BrowserRouter, Route} from "react-router-dom";

const App = () => {
    const [showAddTask, setShowAddTask] = useState(false)
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const getTasks = async () => {
            setTasks(await fetchTasks())
        }
        getTasks()
    }, [])

    const fetchTasks = async () => {
        const result = await fetch('http://localhost:5000/tasks')
        return await result.json()
    }

    const fetchTask = async (id) => {
        const result = await fetch(`http://localhost:5000/tasks/${id}`)
        return await result.json();
    }

    const addTask = async (task) => {
        const result = await fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        const newTask = await result.json()
        setTasks([...tasks, newTask])
    }

    const deleteTask = async (id) => {
        await fetch(`http://localhost:5000/tasks/${id}`, {method: 'DELETE'})
        setTasks(await fetchTasks())
        //setTasks(tasks.filter((task) => task.id !== id))
    }

    const toggleReminder = async (id) => {
        const task = await fetchTask(id)
        const updatedTask = {...task, reminder: !task.reminder}
        const result = await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        })
        const data = await result.json()
        setTasks(tasks.map((task) => task.id !== id ? task : {...task, reminder: data.reminder}))
    }

    return (
        <BrowserRouter>
            <div className={'container'}>
                <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
                <Route path={'/'} exact render={(props) => (
                    <>
                        {showAddTask && <AddTask onAdd={addTask}/>}
                        {tasks.length < 1 ? 'No Tasks to show' :
                            <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>}
                    </>
                )}/>
                <Route path={'/about'} component={About}/>
                <Footer/>
            </div>
        </BrowserRouter>
    )
}

export default App;
