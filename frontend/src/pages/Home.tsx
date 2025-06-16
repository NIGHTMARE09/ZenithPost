// frontend/src/pages/HomePage.tsx
import {BlogCard} from '../components/BlogCard';
import Pagination from '../components/Pagination';
import useBlogs from '../hooks/useBlogs';

const ITEMS_PER_PAGE = 10; // Define how many blogs per page

const Home = () => {
  const { blogs, loading, error, totalPages, currentPage, setPage } = useBlogs(ITEMS_PER_PAGE);

  if (loading) {
    return (
        // show a skeleton loader, as of now we are using a simple text
      <div className="text-center py-10 text-slate-500">Loading posts...</div>
    );
  }

  if (error) {
      return (
          <div className="text-center py-10 text-red-500">Error: {error}</div>
      );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-800 mb-10 text-center">
        Latest Stories {/* Changed from "Recent Posts" for variety */}
      </h1>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500">No blog posts found.</p>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default Home;
