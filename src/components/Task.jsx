import { useEffect, useState } from 'react'

const Task = ({taskId, taskBody, finished, refreshTasks}) => {
const [isChecked, setIsChecked] = useState(finished)

const deleteTask = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'DELETE'
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Failed to delete task');
    }

    refreshTasks();
  } catch (err) {
    console.error(err);
  }
}

  const updateStatus = async () => {
    try {
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      const res = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({finished: newChecked})
      })

      const data = await res.json();

      if (!res.ok) {
            alert(data.message || 'Failed to fetch tasks');
        }

    } catch (err) {
      console.error(err);
    }
  }

  

  return (
    <div className='grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-5 border-2 border-gray-400 rounded-3xl mb-3'>
      <button  
        className={`cursor-pointer w-6.5 h-6.5 aspect-square border-2 border-gray-400 rounded-md flex items-center justify-center overflow-hidden ${isChecked && 'bg-gray-500 border-none'} `}
        onClick={() => updateStatus()}
      >
        <img src="/checked.png" alt="checkbox" draggable='false' className='w-full h-full object-contain'/>
      </button>

      <p className='font-semibold text-center text-gray-800'>
        {taskBody}
      </p>

      <button 
        className='cursor-pointer w-7.5 aspect-square '
        onClick={() => deleteTask()}
      >
        <img src="/close.png" alt="delete"  draggable='false' className='w-full h-full object-contain'/>
      </button>
    </div>
  )
}

export default Task