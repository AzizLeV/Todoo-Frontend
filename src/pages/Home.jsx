import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Task from '../components/Task';
import Spinner from '../components/Spinner';

const Home = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [task, setTask] = useState('');
    const [tasksList, setTasksList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false);


    const submitTask = async () => {

        try {
            const res = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({task})
            });

            const data = await res.json();

            if (res.ok) {
                // alert(data.message || 'Task Submitted');
            } else {
                alert(data.message || 'Task failed to submit');
            }

            getAllTasks();
            setTask('');
        } catch (err) {
            console.log(err);
        }
    }

    const getAllTasks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/tasks?username=${username}`, {
                method: 'GET',
                credentials: 'include'
            });

            const data = await res.json();

        if (!res.ok) {
            setErrorMessage(data.message || 'Failed to fetch tasks');
            setTasksList([]);
            return;
        }

            setTasksList(data.taskList || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        submitTask();
    }

    const logout = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json'
                },
            });

            const data = await res.json()
            if (res.ok) {
                navigate('/login');
            } else {
                alert('Failed to log out');
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetch('http://localhost:3000/api/check-auth', {
            method: 'GET',
            credentials: 'include',
        })
            .then((res) => {
                if (!res.ok) {
                    navigate('/login');
                }
            })
            .catch((err) => {
                console.error(err);
                navigate('/login');
            })
    }, [])

    useEffect(() => {
        getAllTasks();
    }, [])


  return (
    <div className="container flex justify-center mx-auto">

        <h2 className='absolute left-6 top-3 text-xl font-bold'>User: {username}</h2>
        <button 
            className='absolute right-6 top-3 w-10 aspect-square bg-red-500 rounded-md p-1 cursor-pointer transition duration-200 ease-in-out hover:bg-red-600 hover:scale-95 hover:shadow-md'
            onClick={() => logout()}
        >
            <img src="/door.png" alt="logout" 
                className='object-contain'
            />
        </button>

        <div className="flex justify-center flex-col gap-4 w-120 pt-15 pb-5 min-h-screen">

            <h1 className="font-semibold text-3xl text-gray-800">Your
                <span className='font-black bg-gradient-to-r from-blue-700 to-purple-300 bg-clip-text text-transparent'> Todoo</span>
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-row gap-2">
                <input 
                    type="text"
                    placeholder='Add new task'
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className='border-b-2 w-full px-3 focus:outline-none'
                />
                <button className="text-3xl font-light text-white w-1/10 aspect-[1/1] rounded-xl bg-gradient-to-r from-gray-900 to-gray-900 cursor-pointer transition duration-400 ease-in-out hover:scale-95 hover:shadow-md hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-300"
                    type='submit'
                >
                    +
                </button>
            </form>

            {isLoading ? (
                <div className="flex justify-center my-5">
                    <Spinner />
                </div>
            )
            : errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
            ): (
                <ul className="mt-1">
                    {tasksList.map((singleTask) => (
                        <Task key={singleTask._id} taskId={singleTask._id} taskBody={singleTask.body} finished={singleTask.finished} refreshTasks={getAllTasks}/>
                    ))}
                </ul>
            )}
            
        </div>


        
    </div>
  )
}

export default Home