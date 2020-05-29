import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { User } from "../types.ts";
import db from "../mongodb.ts";

const userCollection = db.collection("users");


