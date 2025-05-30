import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';
import { createPostInput, updatePostInput } from '@nightmare_09/common-app';
const createExtendedPrismaClient = (datasourceUrl) => {
    return new PrismaClient({ datasourceUrl }).$extends(withAccelerate());
};
const blogRouter = new Hono();
blogRouter.use('/*', async (c, next) => {
    try {
        const jwt = c.req.header('Authorization');
        if (!jwt) {
            return c.json({ error: 'Unauthorized: Missing JWT' }, 401);
        }
        const parts = jwt.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return c.json({ error: 'Unauthorized: Invalid JWT format' }, 401);
        }
        const token = parts[1];
        const payload = await verify(token, c.env.JWT_SECRET);
        if (!payload || typeof payload.id === 'undefined') {
            return c.json({ error: 'Unauthorized: Invalid token payload' }, 401);
        }
        c.set('userId', String(payload.id));
        await next();
    }
    catch (error) {
        console.error('Error in authentication middleware:', error);
        return c.json({ error: 'Unauthorized: Token verification failed' }, 401);
    }
});
blogRouter.post('/', async (c) => {
    try {
        // Get userId from context
        const userId = c.get('userId');
        console.log(c.get('userId'));
        const prisma = c.get("prisma");
        const body = await c.req.json();
        const parsedBody = createPostInput.safeParse(body);
        if (!parsedBody.success) {
            return c.json({ error: 'Invalid input. Title and content are required.' }, 400);
        }
        const post = await prisma.blog.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: Number(userId)
            }
        });
        return c.json({
            id: post.id,
            message: 'Blog post created successfully for user ' + userId
        });
    }
    catch (error) {
        console.error('Error creating blog post:', error);
        return c.json({ error: 'Failed to create blog post. Please try again later.' }, 500);
    }
});
// update the blog post
blogRouter.put('/', async (c) => {
    try {
        const userId = c.get('userId');
        const prisma = c.get("prisma");
        const body = await c.req.json();
        if (!body.id || typeof body.id !== 'number' || (!body.title && !body.content)) {
            return c.json({ error: 'Blog post ID or (title and content) is required' }, 400);
        }
        const parsedBody = updatePostInput.safeParse(body);
        if (!parsedBody.success) {
            return c.json({ error: 'Invalid input. Title and content are required.' }, 400);
        }
        const updatedPost = await prisma.blog.update({
            where: {
                id: body.id,
                authorId: Number(userId)
            },
            data: {
                title: body.title,
                content: body.content
            }
        });
        return c.json({
            id: updatedPost.id,
            message: 'Blog post updated successfully for user ' + userId
        });
    }
    catch (error) {
        console.error('Error updating blog post:', error);
        return c.json({ error: 'Failed to update blog post. Please try again later.' }, 500);
    }
});
blogRouter.get('/bulk', async (c) => {
    try {
        const prisma = c.get("prisma");
        const blogs = await prisma.blog.findMany({});
        return c.json({
            blogs: blogs.map((blog) => ({
                id: blog.id,
                title: blog.title,
                content: blog.content,
                authorId: blog.authorId,
                createdAt: blog.createdAt,
                updatedAt: blog.updatedAt
            }))
        });
    }
    catch (e) {
        console.error("GET /bulk error:", e);
        return c.json({ error: 'Failed to fetch blog posts' }, 500);
    }
});
blogRouter.get('/:id', async (c) => {
    try {
        const prisma = c.get("prisma");
        const blogId = c.req.param('id');
        // Validate id format
        const id = Number(blogId);
        if (isNaN(id)) {
            return c.json({ error: 'Invalid blog ID format' }, 400);
        }
        const blog = await prisma.blog.findUnique({
            where: {
                id: id
            }
        });
        if (!blog) {
            return c.json({ error: 'Blog post not found' }, 404);
        }
        return c.json(blog);
    }
    catch (e) {
        console.error("GET /:id error:", e);
        return c.json({ error: 'Failed to fetch blog post' }, 500);
    }
});
export default blogRouter;
