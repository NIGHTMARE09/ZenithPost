import z from 'zod';

export const signupInput = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().optional()
})

export type SignupInput = z.infer<typeof signupInput>;

export const signinInput = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().optional()
})

export type SigninInput = z.infer<typeof signinInput>;

export const createPostInput = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    tags: z.array(z.string()).optional(),
    imageUrl: z.string().optional()
});

export type CreatePostInput = z.infer<typeof createPostInput>;

export const updatePostInput = z.object({
    id: z.string().uuid('Invalid blog ID format'),
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
    imageUrl: z.string().optional()
}).refine(data => data.title !== undefined || data.content !== undefined, {
    message: 'Either title or content must be provided',
    path: ['title', 'content']
});

export type UpdatePostInput = z.infer<typeof updatePostInput>;

// TypeScript Interface for Blog data shared by backend (including author details)
// This should match the structure returned by the API
export interface Blog {
    id: string; // Or number, depending on your Prisma schema
    authorId: string; // Or number
    authorName: string;
    authorImage?: string; // Optional: if you add an avatarUrl to your User model
    title: string;
    content: string;
    publishedDate: string; // ISO string representation of the date
    tags?: string[]; // Optional: if you add a tags field to your Post model
    image?: string; // Optional: if you add an imageUrl field to your Post model
};