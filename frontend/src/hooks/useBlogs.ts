// 4. frontend/src/hooks/useBlogs.ts (Fetch Blog List Hook)
// A custom hook to handle fetching the list of blogs, including pagination.
import {useState, useEffect} from 'react';
import axios from 'axios';
import type { Blog } from '../components/BlogCard';

interface UseBlogsResult {
    blogs: Blog[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    setPage: (page: number) => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787';
const useBlogs = (itemsPerPage: number = 10): UseBlogsResult => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        const fetchBlogs = async () =>{
            setLoading(true);
            setError(null);
            try{
                const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                    },
                    headers: {
                        // token: localStorage.getItem('token'),
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                setBlogs(response.data.blogs || []);
                setTotalPages(Math.ceil(response.data.totalItems / itemsPerPage));
            }
            catch(err :  any){
                console.error('Error fetching blogs:', err);
                setError(err.message || 'Failed to fetch blogs');
            }
            finally{
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [currentPage, itemsPerPage]);

    return {
        blogs, loading, error, totalPages, currentPage, setPage: setCurrentPage
    };  
};

export default useBlogs;