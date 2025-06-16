import { sign, verify } from 'hono/jwt';
export const authMiddleware = async (c: any, next: any) => {
    try{

        const jwt = c.req.header('Authorization');
        if (!jwt) {
            return c.json({ error: 'Unauthorized: Missing JWT' }, 401);
        }
        const parts = jwt.split(' ');
        if(parts.length !== 2 || parts[0] !== 'Bearer'){
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
    catch(error){
        console.error('Error in authentication middleware:', error);
        return c.json({ error: 'Unauthorized: Token verification failed' }, 401);
    }
}