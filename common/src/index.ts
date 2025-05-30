import z from 'zod';

export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().optional()
})

export type SignupInput = z.infer<typeof signupInput>;

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().optional()
})

export type SigninInput = z.infer<typeof signinInput>;

export const createPostInput = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required')
})

export type CreatePostInput = z.infer<typeof createPostInput>;

export const updatePostInput = z.object({
    id: z.string().uuid('Invalid post ID format'),
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional()
})

export type UpdatePostInput = z.infer<typeof updatePostInput>;
