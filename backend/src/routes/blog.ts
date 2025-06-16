import { Hono } from 'hono'
import { Blog } from "@prisma/client";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { decode, sign, verify } from 'hono/jwt'
import bcrypt from 'bcryptjs';
import { createPostInput, updatePostInput } from '@nightmare_09/common-app'; 
import { authMiddleware } from '../middlewares/authmiddleware';
const createExtendedPrismaClient = (datasourceUrl: string) => {
    return new PrismaClient({ datasourceUrl }).$extends(withAccelerate());
};

// Infer the actual type of the extended Prisma client
type ExtendedPrismaClient = ReturnType<typeof createExtendedPrismaClient>;

type AppBindings = {
    DATABASE_URL: string;
    JWT_SECRET: string;
}

type AppVariables = {
    prisma: ExtendedPrismaClient;
    userId: string;
}

const blogRouter = new Hono<{
    Bindings: AppBindings;
    Variables: AppVariables;
}>();


blogRouter.use('/*', authMiddleware);

blogRouter.post('/', async(c) => {
    try{
        // Get userId from context
        const userId = c.get('userId');
        console.log(c.get('userId'));
        const prisma = c.get("prisma");
        const body = await c.req.json();
        const parsedBody = createPostInput.safeParse(body);
        if(!parsedBody.success){
            return c.json({ error: 'Invalid input. Title and content are required.' }, 400);
        }
        const post = await prisma.blog.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: Number(userId)
            },
            select: { id : true}
        });
    
        return c.json({
            id: post.id,
            message: 'Blog post created successfully for user ' + userId
        }, 201);
    }
    catch(error){
        console.error('Error creating blog post:', error);
        return c.json({ error: 'Failed to create blog post. Please try again later.' }, 500);
    }

})

// update the blog post
blogRouter.put('/', async(c) => {
    try{
        const userId = c.get('userId');
        const prisma = c.get("prisma");
        const body = await c.req.json();

        if(!body.id || typeof body.id !== 'number'||(!body.title  && !body.content)){
            return c.json({ error: 'Blog post ID or (title and content) is required' }, 400);
        }
        const parsedBody = updatePostInput.safeParse(body);
        if(!parsedBody.success){
            return c.json({ error: 'Invalid input. Title and content are required.' }, 400);
        }
        const updatedPost = await prisma.blog.update({
            where : {
                id: body.id,
                authorId: Number(userId)
            },
            data:{
                title: body.title,
                content: body.content
            },
            select: {id : true}
        });
        return c.json({
            id: updatedPost.id,
            message: 'Blog post updated successfully for user ' + userId
        },200);
    }
    catch(error: any){
        console.error('Error updating blog post:', error);
        return c.json({ error: 'Failed to update blog post. Please try again later.' }, 500);
    }
})
blogRouter.get('/bulk', async(c) => {
    try {
        const prisma = c.get("prisma");
        const blogs = await prisma.blog.findMany({});
        return c.json({
            blogs: blogs.map((blog: Blog) => ({
                id: blog.id,
                title: blog.title,
                content: blog.content,
                authorId: blog.authorId,
                createdAt: blog.createdAt,
                updatedAt: blog.updatedAt
            }))
        });
    } catch (e) {
        console.error("GET /bulk error:", e);
        return c.json({ error: 'Failed to fetch blog posts' }, 500);
    }
})
blogRouter.get('/:id', async(c) => {
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
            },
            select: {
                id: true,
                title: true,
                content: true,
                authorId: true,
                published: true,
                createdAt: true,
                author:{
                    select: {
                        name: true
                    }
                }
                // tags: true,
            }
        });
        if(!blog){
            return c.json({ error: 'Blog post not found' }, 404);
        }
        return c.json(blog);
    } catch (e) {
        console.error("GET /:id error:", e);
        return c.json({ error: 'Failed to fetch blog post' }, 500);
    }
})
export default blogRouter;