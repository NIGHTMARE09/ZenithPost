import {useState, useEffect} from 'react';
import axios from 'axios';
import type {Blog} from '../components/BlogCard';

interface UseBlogResult {
    blog: Blog | null;
    loading: boolean;
    error: string | null;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787';

export const useBlog = (id: string | undefined) : UseBlogResult => {
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    console.log(id);
    
    useEffect(() => {
        if(!id){
            setLoading(false);
            setBlog(null);
            return;
        }

        const fetchBlog = async() => {
            setLoading(true);
            setError(null);
            try{
                console.log("HIII");
                
                const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
                    headers: {
                        // token: localStorage.getItem('token')
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                console.log(response.data);
                
                setBlog(response.data.blog);
            }
            catch(error: any){
                console.error(`Error fetching blog: ${id}`, error);
                setError(error.response?.data?.error || `Failed to fetch blog: ${id}`);
                setBlog(null);
            }
            finally{
                setLoading(false);
            }
        };
        fetchBlog();

    }, [id]);

    return {
        blog,
        loading,
        error
    };
}