import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import userRouter from './routes/user';
import blogRouter from './routes/blog';
// Helper function to create and type the extended Prisma client
const createExtendedPrismaClient = (datasourceUrl) => {
    return new PrismaClient({ datasourceUrl }).$extends(withAccelerate());
};
const app = new Hono();
app.use("*", async (c, next) => {
    const prismaInstance = createExtendedPrismaClient(c.env.DATABASE_URL);
    c.set("prisma", prismaInstance);
    await next();
});
app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);
export default app;
