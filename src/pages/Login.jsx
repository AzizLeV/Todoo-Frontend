import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { getAccessToken, setAccessToken } from '../components/tokenStorage';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [successMsg, setSuccessMsg] = useState(location.state?.successMsg || '');
    const [form, setForm] = useState({username:'', password:''});
    const [loginAlert, setloginAlert] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const checkToken = async () => {
        setIsLoading(true)
        try {
            const accessToken = getAccessToken();
            console.log(accessToken);
            fetch(`http://localhost:3000/api/auth/check`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then((res) => {
                if (!res.ok) {
                    navigate('/login');
                }
            })
            .catch((err) => {
                // console.error(err);
                navigate('/login');
            })
        } catch(err) {
            console.log(err);
        } finally {
            setIsLoading(false)
        }
    }

    const refreshToken = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/auth/refresh', {
                method: 'GET',
                credentials: 'include'
            })

            const data = await res.json()
 
            if(!res.ok) {
                console.log(data.message)
                navigate('/login')
                return;
            }

            setAccessToken(data.accessToken);
            checkToken();
            navigate('/');
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        refreshToken();
        // checkToken();
    }, [])

    useEffect(() => {
    if (successMsg) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [successMsg]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:3000/api/login", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(form)
            })

            const data = await res.json();
            console.log(data);
            if (res.ok) {
                // alert('Logged in succefully!');
                localStorage.setItem('username', form.username);
                setAccessToken(data.accessToken);
                navigate('/');
            } else {
                setloginAlert(data.message || "Login failed");
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen">
        {isLoading ? (
            <Spinner  width={40} height={40} color="#2563eb" dur="0.8s" />
        ): (
            <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-6 border rounded-md shadow-lg w-80"
        >
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
            autoComplete='off'
            required
            className="p-2 border rounded"
            />
            <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
            autoComplete='off'
            required
            className="p-2 border rounded"
            />
            {successMsg && (
            <p className="text-sm text-green-600 text-center">{successMsg}</p>
            )}
            {loginAlert && (
            <p className="text-sm text-red-500 text-center">{loginAlert}</p>
             )}
    
            <button
            type="submit"
            disabled={!form.username || !form.password}
            className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer
                ${(!form.username || !form.password) && 'opacity-50 hover:cursor-not-allowed'}
             `}
            >
            Login
            </button>
            <p className="text-sm text-center">New to Todoo? <a href='/signup' className='text-blue-600 hover:underline'>Create an account</a></p>
        </form>
        )}
        
        </div>
    )
}

export default Login