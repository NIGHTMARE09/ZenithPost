import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { signinInput, signupInput } from '@nightmare_09/common-app';
const createExtendedPrismaClient = (datasourceUrl) => {
    return new PrismaClient({ datasourceUrl }).$extends(withAccelerate());
};
const userRouter = new Hono();
// implement password hashing and validation here
userRouter.post('/signup', async (c) => {
    const prisma = c.get("prisma");
    const body = await c.req.json();
    // validate input using zod schema
    // zod validation, password hashing, etc. can be done here
    const parsedBody = signupInput.safeParse(body);
    if (!parsedBody.success) {
        return c.json({ error: "Invalid input" }, 400);
    }
    const password = body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword, //store hashed password
                name: body.name || '',
            }
        });
        const jwt = await sign({
            id: user.id,
        }, c.env.JWT_SECRET);
        return c.text(jwt, 201);
    }
    catch (error) {
        console.error('Error creating user:', error);
        return c.json({
            error: 'Failed to create user. Please try again later.'
        }, 500);
    }
});
userRouter.post('/signin', async (c) => {
    const prisma = c.get("prisma");
    const body = await c.req.json();
    const email = body.email;
    const password = body.password;
    const parsedBody = signinInput.safeParse(body);
    if (!parsedBody.success) {
        return c.json({ error: "Invalid input" }, 400);
    }
    // zod validation, password hashing, etc. can be done here
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email: email
            }
        });
        // compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return c.json({ error: 'Invalid email or password' }, 403); // Invalid credentials
        }
        // if password matches, create JWT token
        const jwt = await sign({
            id: user.id,
        }, c.env.JWT_SECRET);
        return c.text(jwt, 200);
    }
    catch (error) {
        console.error('Error signing-in user:', error);
        return c.json({
            error: 'Failed to signin user. Please try again later.'
        }, 500);
    }
});
export default userRouter;
