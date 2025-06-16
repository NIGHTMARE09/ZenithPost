import {formatDate} from '../utils/FormatDate';
import {Link} from 'react-router-dom';
export interface Blog{
    id: string;
    title: string;
    content: string;
    authorId: string | number;
    authorImage?: string;
    authorName?: string;
    tags?: string[];
    image?: string;
    createdAt: string;
    updatedAt?: string;
}

interface BlogCardProps{
    blog: Blog;
}

export const BlogCard = ({ blog }: BlogCardProps) => {
    // console.log(blog);
    const truncatedContent = blog.content.length > 100
    ? blog.content.slice(0,100) + '...'
    : blog.content;
    
    const formattedDate = formatDate(blog.createdAt);
    // const formattedUpdatedDate = blog.updatedDate ? formatDate(blog.updatedDate) : null;

    return (
        <Link to={`/blog/${blog.id}`} className="block group mb-8 p-1">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {blog.image && (
            <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
            />
            )}
            <div className="p-6">
            <div className="flex items-center mb-3">
                {blog.authorImage ? (
                <img
                    src={blog.authorImage}
                    alt={blog.authorName}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                ) : (
                // Placeholder for avatar if no image
                <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-semibold mr-3">
                    {blog.authorName? blog.authorName : " ".charAt(0).toUpperCase()}
                </div>
                )}
                <div>
                <p className="font-semibold text-slate-800">{blog.authorName}</p>
                <p className="text-xs text-slate-500">
                    {/* <Calendar className="h-3 w-3 mr-1 inline-block" /> */}
                    {formattedDate} {/* Use formatDate helper */}
                </p>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-slate-900">
                {blog.title}
            </h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                {truncatedContent}
            </p>
            {blog.tags && blog.tags.length > 0 && (
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
            )}
            </div>
        </article>
        </Link>
    );
}