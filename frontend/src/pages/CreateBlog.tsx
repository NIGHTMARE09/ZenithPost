// frontend/src/pages/CreateBlogPage.tsx
import { useState, type FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import { ArrowLeft } from 'lucide-react'; // Import icon if used in back button

// Get backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787'; // Fallback


const CreateBlogPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setError(null);

    const token = localStorage.getItem('token'); // Get token from local storage

    if (!token) {
        setError("Authentication token not found. Please sign in.");
        setIsPublishing(false);
        // Redirect to signin or handle auth state update
        navigate('/signin');
        return;
    }

    try {
      // Assuming your backend endpoint for creating blog is POST /api/v1/blog
      // and it expects { title, content } in the body
      const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
        title,
        content,
        // Add other fields like tags, image if your backend supports them in this endpoint
        // tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        // image: base64EncodedImage // or upload as multipart/form-data
      }, {
        headers: {
           Authorization: `Bearer ${token}`, // Include JWT token
           'Content-Type': 'application/json' // Or 'multipart/form-data' if uploading files
        }
      });

      // Assuming backend returns { id: postId, ... } upon success
      alert('Blog published successfully!'); // Simple alert
      navigate(`/blog/${response.data.id}`); // Navigate to the new blog post

    } catch (err: any) {
      console.error('Error publishing blog:', err);
      setError(err.response?.data?.error || 'Failed to publish blog.');
      alert(`Failed to publish blog: ${err.response?.data?.error || err.message}`); // Show error alert
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
         {/* Back button as in original */}
        <button
          onClick={() => navigate(-1)} // Use navigate(-1) to go back
          className="flex items-center text-green-600 hover:text-green-700"
        >
           <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <button
          type="submit"
          form="createBlogForm" // Link button to form using its ID
          disabled={isPublishing || !title || !content} // Disable if title or content is empty or publishing
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
          </div>
      )}

      <form id="createBlogForm" onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <Input
          label="Title"
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
           // Styling from original code applied via className props if needed
           // className="w-full text-4xl font-bold border-none outline-none placeholder-gray-300 resize-none"
        />
        <TextArea
          label="Content"
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your amazing story..."
          rows={20} // Set default rows
          required
           // Styling from original code applied via className props if needed
          // className="w-full text-lg border-none outline-none placeholder-gray-300 resize-none leading-relaxed"
        />
         {/* Optional fields for tags and image upload can be added here */}
        {/* <Input label="Tags (comma-separated)" id="tags" type="text" ... /> */}
        {/* <Input label="Featured Image (Optional)" id="image" type="file" ... /> */}
      </form>
    </div>
  );
};

export default CreateBlogPage;
