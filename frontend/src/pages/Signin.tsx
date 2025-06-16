// frontend/src/pages/SigninPage.tsx
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import Input from '../components/Input';
import { useAuth } from '../context/Authcontext';
// Import SigninParams type from your common package
import type { SigninInput } from '@nightmare_09/common-app';

export const Signin = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { signin } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const userData: SigninInput = { name, email, password };
        try {
            await signin(userData);
            navigate('/');
        }
        catch (error: any) {
            console.error('Signin Failed: ', error);
            setError(error.response?.data?.error || 'Signin failed. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                        Sign in to your account
                    </h2>
                </div>

                {error && ( // Display error message if state is set
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <Input label="Email address" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                    <Input label="Password" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-slate-600 hover:text-slate-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}