import { RouterContext } from "../deps.ts";
import { validateJwt } from "../deps.ts"
import { auth_key } from "../keys.ts";

const authMiddleware = async (ctx : RouterContext, next: any) => {
    
    const headers: Headers = ctx.request.headers;
    const authorization = headers.get('Authorization')
    if (!authorization) {
        ctx.response.status = 401;
        ctx.response.body = {
            success: false,
            msg: `Did not have any authorization`
        }
        return;
    }
    const jwt = authorization.split(' ')[1];
    if (!jwt) {
        ctx.response.status = 401;
        ctx.response.body = {
            success: false,
            msg: `Did not have any jwt`
        }
        return;
    }

    if (!(await validateJwt(jwt, auth_key, {isThrowing: false}))){
        ctx.response.status = 401;
        ctx.response.body = {
            success: false,
            msg: 'Invalid jwt token'
        };
        return
    }

    await next();
    return
}

export default authMiddleware;