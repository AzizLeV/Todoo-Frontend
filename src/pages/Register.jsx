import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import Spinner from "../components/Spinner";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({username: "", password: ""});
    const [registerAlert, setRegisterAlert] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const res = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                // alert('Registred succefully');
                navigate('/login', {state: { successMsg : 'Registred succefully!' }});
            } else {
                setRegisterAlert(data.message || 'Register failed');
            }

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
            fetch('http://localhost:3000/api/check-auth', {
                method: 'GET',
                credentials: 'include',
            })
                .then((res) => {
                    if (res.ok) {
                        navigate('/');
                    }
                })
                .catch((err) => {
                    console.error(err);
                })
        }, [])

    return (
        <div className="flex justify-center items-center min-h-screen">
        {isLoading ? (
            <Spinner  width={40} height={40} color="#2563eb" dur="0.8s" />
        ) : (
            <form 
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-6 border rounded-md shadow-lg w-80"
            >
            <h2 className="text-2xl font-bold text-center">Register</h2>

            <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
            autoComplete="off"
            required
            className="p-2 border rounded"
                />

            <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
            autoComplete="off"
            required
            className="p-2 border rounded"
            />

            {registerAlert && (
                <p className="text-sm text-red-500 text-center">{registerAlert}</p>
            )}

            <button 
                type="submit" 
                className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer
                    ${(!form.username || !form.password) && 'opacity-50 hover:cursor-not-allowed'}
                `}
            >
                Sign Up
            </button>
            <p className="text-sm text-center">Already a Todoo user? <a href='/login' className='text-blue-600 hover:underline'>Log in instead.</a></p>
            </form>
        )}
        
        </div>
    );
};

export default Register;
