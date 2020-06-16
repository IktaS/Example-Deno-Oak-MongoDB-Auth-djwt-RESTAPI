import { validateJwt } from "../deps.ts";
import { auth_key } from "../keys.ts";
const authMiddleware = async (ctx, next) => {
    const headers = ctx.request.headers;
    const authorization = headers.get('Authorization');
    if (!authorization) {
        ctx.response.status = 401;
        ctx.response.body = {
            success: false,
            msg: `Did not have any authorization`
        };
        return;
    }
    const jwt = authorization.split(' ')[1];
    if (!jwt) {
        ctx.response.status = 401;
        ctx.response.body = {
            success: false,
            msg: `Did not have any jwt`
        };
        return;
    }
    const validatedJwtObject = await validateJwt(jwt, auth_key);
    if (!validatedJwtObject.isValid) {
        ctx.response.status = 401;
        ctx.response.body = {
            success: false,
            msg: 'Invalid jwt token'
        };
        return;
    }
    await next();
    return;
};
export default authMiddleware;
//# sourceMappingURL=file:///mnt/d/Dev/Deno/Example-Deno-Oak-MongoDB-Auth-djwt-RESTAPI/deno_dir/gen/file/mnt/d/Dev/Deno/Example-Deno-Oak-MongoDB-Auth-djwt-RESTAPI/src/middlewares/authMiddleware.ts.js.map