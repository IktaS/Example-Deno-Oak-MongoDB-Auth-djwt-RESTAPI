import { Application } from "./deps.ts";
import router from "./routes.ts";
const port = 5000;
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Server running on port ${port}`);
await app.listen({ port });
//# sourceMappingURL=file:///mnt/d/Dev/Deno/Example-Deno-Oak-MongoDB-Auth-djwt-RESTAPI/deno_dir/gen/file/mnt/d/Dev/Deno/Example-Deno-Oak-MongoDB-Auth-djwt-RESTAPI/src/server.ts.js.map