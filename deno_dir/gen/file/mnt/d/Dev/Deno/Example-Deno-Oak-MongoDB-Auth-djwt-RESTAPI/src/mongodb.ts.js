import { MongoClient } from "./deps.ts";
const client = new MongoClient();
client.connectWithUri("mongodb://localhost:27017");
const db = client.database("shortener");
export default db;
//# sourceMappingURL=file:///mnt/d/Dev/Deno/Example-Deno-Oak-MongoDB-Auth-djwt-RESTAPI/deno_dir/gen/file/mnt/d/Dev/Deno/Example-Deno-Oak-MongoDB-Auth-djwt-RESTAPI/src/mongodb.ts.js.map