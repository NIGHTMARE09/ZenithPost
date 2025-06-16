import { Hono } from 'hono'
import { User } from "@prisma/client";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { decode, sign, verify } from 'hono/jwt'
import bcrypt from 'bcryptjs';
import { signinInput, signupInput} from '@nightmare_09/common-app';
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
  prisma: ExtendedPrismaClient,
  userId: string
}

const userRouter = new Hono<{
  Bindings: AppBindings;
  Variables: AppVariables;
}>();

// implement password hashing and validation here
// SIGNUP Route: POST /api/v1/user/signup
userRouter.post('/signup', async (c) => {
    const prisma = c.get("prisma");
    try {
        const body = await c.req.json();
        console.log("Recieved signup request:", body);
        
        const { success, data, error } = signupInput.safeParse(body);

        if (!success) {
            c.status(400); // Bad Request
            // Return Zod validation errors
            return c.json({ error: 'Invalid input', details: error.errors });
        }

        const { email, password, name } = data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            c.status(409); // Conflict
            return c.json({ error: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create the user
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword, // Store the hashed password
                name: name, // Optional field
                // Add other fields like avatarUrl if they exist in your schema
            },
             select: { // Select fields to return
                id: true,
                name: true,
                email: true,
                // Include avatarUrl if it exists
                // avatarUrl: true
            }
        });

        // Generate JWT token
        // Ensure payload matches what your auth middleware expects (e.g., { id: userId })
        const token = await sign({ id: newUser.id }, c.env.JWT_SECRET);

        c.status(201); // Created
        return c.json({
            message: 'User created successfully',
            token: token,
            user: newUser // Return user details
        });

    } catch (e:any) {
        console.error('Error during signup:', e);
        c.status(500); // Internal Server Error
        return c.json({ error: e.message || 'Failed to create user. Please try again later.' });
    } 
});

userRouter.post('/signin', async (c) => {
  const prisma = c.get("prisma");
  const body = await c.req.json();
  const email: string = body.email;
  const password: string = body.password;
  const parsedBody = signinInput.safeParse(body);
  if(!parsedBody.success){
    return c.json({ error: "Invalid input"}, 400);
  }
  // zod validation, password hashing, etc. can be done here
  try {
    const user: User = await prisma.user.findUniqueOrThrow({
      where: {
        email: email
      },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    })
    if (!user) {
        c.status(401); // Unauthorized (or 403 Forbidden depending on preferred security pattern)
        return c.json({ error: 'Invalid credentials' }); // Use a generic message
    }
    // compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch){
      return c.json({ error: 'Invalid email or password' }, 403); // Invalid credentials
    }
    // if password matches, create JWT token
    const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
    const {password: _, ...userWithoutPassword} = user;
    return c.json({
      message: 'User signed-in successfully',
      token: jwt,
      user: userWithoutPassword // Return user details without password
    }, 200);

  }
  catch (error) {
    console.error('Error signing-in user:', error);
    return c.json({
      error: 'Failed to signin user. Please try again later.'
    }, 500);
  }
})


// GET CURRENT USER Route: GET /api/v1/user/me

userRouter.get('/me', authMiddleware, async(c) =>{
  const prisma = c.get("prisma");
  try{
    const userId = c.get('userId');
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: Number(userId)
      },
      select: {
        id: true,
        email: true,
        name: true,
        // createdAt: true,
        // updatedAt: true
      }
    });

    if (!user) {
        c.status(404); // Not Found (shouldn't happen if auth middleware works, but good practice)
        return c.json({ error: 'User not found' });
    }

    c.status(200); // OK
    return c.json({ user: user }); // Return user details
  }
  catch(err){
    console.error('Error getting current user:', err);
    c.status(500); // Internal Server Error
    return c.json({ error: 'Failed to get current user. Please try again later.' });
  }
});

export default userRouter;