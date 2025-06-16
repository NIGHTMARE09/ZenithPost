import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { SignupInput, SigninInput} from '@nightmare_09/common-app';

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signin: (credentials: SigninInput) => Promise<void>;
    signup: (userData : SignupInput) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined> (undefined);

const BACKEND_URL = 'http://localhost:8787';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user,setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        const f = async () => {
            try{
                const token = localStorage.getItem('token');
                if(token){
                    const response = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    if(response.data && response.data.user){
                        setUser(response.data.user);
                    }
                    else {
                        console.error('No user data found in response');
                        localStorage.removeItem('token');
                        setUser(null);
                    }                
                }
            }
            catch (error) {
                console.error('Error fetching user data:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
            finally {
                setLoading(false);
            }
            return () => {
                setUser(null);
                setLoading(true);
            };
        };
        
        f();

    }, []);

    const signin = async (credentials: SigninInput) => {
        setLoading(true);
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, credentials);
            const {token, user: userData} = response.data;
            if(!token || !userData) {
                throw new Error('Invalid response from server');
            }
            localStorage.setItem('token', token);
            setUser(userData);
            navigate('/home'); 
        }
        catch(error: any){
            console.error('Signin Failed: ', error);
            throw new Error(error.response?.data?.error || 'Signin failed. Please try again.');
        }
        finally{
            setLoading(false);
        }
    };

    const signup = async (userData: SignupInput) => {
        setLoading(true);
        try{
            // Make sure you're setting the correct Content-Type header
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const {token, user: newUser} = response.data;
            localStorage.setItem('token', token);
            setUser(newUser);
            navigate('/home');
        }
        catch(error: any){
            console.error('Signup Failed: ', error);
            throw new Error(error.response?.data?.error || 'Signup failed. Please try again.');
        }
        finally{
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value = {{
            user,
            loading,
            signin,
            signup,
            logout
        }} >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined || context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}