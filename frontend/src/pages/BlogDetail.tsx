// frontend/src/pages/BlogDetailPage.tsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {useBlog} from '../hooks/useBlog';
import { ArrowLeft, Calendar, Tag } from 'lucide-react'; // Import icons if used

// Helper function for date formatting, can move to utils if needed
const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return "Invalid Date";
    }
};


const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blog, loading, error } = useBlog(id);

   // Redirect to not found or home if blog ID is missing or fetch fails with 404
   useEffect(() => {
       if (!loading && !blog && !error) {
           // If not loading, no blog found, and no error occurred (e.g., 404)
           // This might need refinement based on specific error codes from backend
           // For simplicity, redirect if not loading and no blog found
            navigate('/'); // Or a dedicated 404 page
       } else if (!loading && error) {
            // Optionally show error message on the page or redirect
            console.error("Failed to load blog:", error);
            navigate('/'); // Example: redirect on error
       }
   }, [loading, blog, error, navigate]);


  if (loading) {
    return <div className="text-center py-10 text-slate-500">Loading post...</div>;
  }

   // We handle null blog by redirecting in useEffect, but a simple check is fine too
   if (!blog) {
       // This state should theoretically be brief before redirect in useEffect
       return null; // Or a "Blog not found" message if not redirecting
   }


  // Simple way to render paragraphs from newline characters, consider 'prose' styles
  const paragraphs = blog.content.split('\n\n');

  return (
    <article className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
       {/* Back button as in original */}
      <button
        onClick={() => navigate('/')} // Use navigate to go back to home
        className="flex items-center text-green-600 hover:text-green-700 mb-6"
      >
         <ArrowLeft className="h-4 w-4 mr-2" />
        Back to stories
      </button>

      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
        />
      )}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
        {blog.title}
      </h1>
      <div className="flex items-center text-sm text-slate-500 mb-6">
        {blog.authorImage ? (
          <img
            src={blog.authorImage}
            alt={blog.authorName}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
        ) : (
            // Placeholder for avatar
           <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-semibold mr-3">
                {blog.authorName? blog.authorName: "".charAt(0).toUpperCase()}
            </div>
        )}
        <span>By <span className="font-semibold text-slate-700">{blog.authorName}</span></span>
        <span className="mx-2">•</span>
        <span>
             <Calendar className="h-4 w-4 mr-1 inline-block" />
            {formatDate(blog.createdAt)} {/* Use formatDate helper */}
        </span>
      </div>

      {/* Use Tailwind Typography plugin for content if installed */}
      <div className="prose prose-slate max-w-none lg:prose-lg">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p> // Added mb-4 for spacing between paragraphs
        ))}
      </div>

      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">TAGS:</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogDetailPage;
