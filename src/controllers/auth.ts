import { RouterContext } from "../deps.ts";
import { User } from "../types.ts";
import db from "../mongodb.ts";
import { makeJwt, setExpiration, Jose, Payload } from "../deps.ts"
import { hash, verify } from "../deps.ts";
import { auth_key } from "../keys.ts";

const userCollection = db.collection("users");

const header: Jose = {
    alg: "HS256",
    typ: "JWT",
}

// @desc            Login to get JWT
// @routes          POST /api/login
const login = async (ctx : RouterContext) => {
    if (!ctx.request.hasBody) {
        ctx.response.status = 400;
        ctx.response.body = {
            success: false,
            msg: 'No data'
        }
        return;
    }

    const body = await ctx.request.body();
    const user : User ={
        username: body.value.username,
        password: body.value.password,
    };

    const db_user = await userCollection.findOne({username: user.username});

    if(!db_user){
        ctx.response.status = 404;
        ctx.response.body = {
            success: false,
            msg: `No user with the username ${user.username} found`,
        }
        return;
    }

    if( !(await verify(db_user.password,user.password)) ){
        ctx.response.status = 422;
        ctx.response.body = {
            success: false,
            msg: `Wrong username or password`,
        }
        return;
    }


    const payload : Payload = {
        iss: user.username,
        exp: setExpiration(new Date().getTime() + 3600000)
    }

    const jwt = makeJwt({
        key: auth_key,
        header,
        payload
    })

    if(!jwt){
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            msg: `Internal server error failed to make token`
        }
        return
    }


    ctx.response.status = 200;
    ctx.response.body = {
        username: user.username,
        jwt
    }
    return;
}


// @desc            Register A user
// @routes          POST /api/register
const register = async (ctx: RouterContext) => {
    if (!ctx.request.hasBody) {
        ctx.response.status = 400;
        ctx.response.body = {
            success: false,
            msg: 'No data'
        }
        return;
    }
    const body = await ctx.request.body();

    const user : User ={
        username: body.value.username,
        password: body.value.password,
    };

    const exist = await userCollection.findOne({username: user.username}) ? true : false;

    if(exist){
        ctx.response.status = 409;
        ctx.response.body = {
            success: false,
            msg: `User with the username ${user.username} already exist`,
        }
        return;
    }

    const salt = crypto.getRandomValues(
        new Uint8Array(20)
    );

    user.password = await hash(user.password, {
        salt,
        hashLength: 32,
    })

    if(!user.password){
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            msg: `Internal server error failed to make user`
        }
        return;
    }

    await userCollection.insertOne(user);

    ctx.response.status = 200;
    ctx.response.body = {
        success: true,
        msg: `Register Success`,
    }
}

// @desc            Delete a user
// @routes          DELETE /api/register/:name
const deleteuser = async (ctx : RouterContext) => {
    const username = ctx.params.username;
    const exist = await userCollection.findOne({username: username}) ? true : false;

    if(!exist){
        ctx.response.status = 404;
        ctx.response.body = {
            success: false,
            msg: `No user with the name ${ctx.params.name} found`,
        }
        return;
    }

    await userCollection.deleteOne({username: username});

    ctx.response.body = {
        success: true,
        msg: `User with name ${username} removed`,
    }
}



export { login, register, deleteuser}