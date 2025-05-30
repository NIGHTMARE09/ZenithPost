import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import userRouter from './routes/user';
import blogRouter from './routes/blog';

// Helper function to create and type the extended Prisma client
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
}

const app = new Hono<{
  Bindings: AppBindings;
  Variables: AppVariables;
}>();

app.use("*", async(c, next)=>{
  const prismaInstance = createExtendedPrismaClient(c.env.DATABASE_URL);
  c.set("prisma", prismaInstance);
  await next();
})

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);


export default app;

