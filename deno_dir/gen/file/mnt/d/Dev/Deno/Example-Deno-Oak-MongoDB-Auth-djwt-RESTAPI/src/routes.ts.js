import { Router } from "./deps.ts";
import { getShorts, getShort, addShort, updateShort, deleteShort } from "./controllers/shorteners.ts";
import { login, register, deleteuser } from "./controllers/auth.ts";
import authMiddleware from "./middlewares/authMiddleware.ts";
const router = new Router();
router.get('/api/shorts', authMiddleware, getShorts)
    .get('/api/shorts/:name', authMiddleware, getShort)
    .post('/api/shorts', authMiddleware, addShort)
    .put('/api/shorts/:name', authMiddleware, updateShort)
    .delete('/api/shorts/:name', authMiddleware, deleteShort);
router.post('/api/login', login)
    .post('/api/register', register)
    .delete('/api/register/:username', authMiddleware, deleteuser);
router.get('/', (ctx) => {
    ctx.response.body = "Welcome screen";
});
export default router;
//# sourceMappingURL=file:///mnt/d/Dev/Deno/Example-Deno-Oak-MongoDB-Auth-djwt-RESTAPI/deno_dir/gen/file/mnt/d/Dev/Deno/Example-Deno-Oak-MongoDB-Auth-djwt-RESTAPI/src/routes.ts.js.map