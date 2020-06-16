import { makeJwt } from "./create.ts";
import { convertBase64urlToUint8Array } from "./base64/base64url.ts";
import { encodeToString as convertUint8ArrayToHex } from "https://deno.land/std@v0.56.0/encoding/hex.ts";
class JwtError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = this.constructor.name;
        this.date = new Date();
    }
}
function isObject(obj) {
    return (obj !== null && typeof obj === "object" && Array.isArray(obj) === false);
}
function has(key, x) {
    return key in x;
}
function isExpired(exp, leeway = 0) {
    return new Date(exp + leeway) < new Date();
}
// A present 'crit' header parameter indicates that the JWS signature validator
// must understand and process additional claims (JWS §4.1.11)
function checkHeaderCrit(header, handlers) {
    // prettier-ignore
    const reservedWords = new Set(["alg", "jku", "jwk", "kid", "x5u", "x5c", "x5t", "x5t#S256", "typ", "cty", "crit", "enc", "zip", "epk", "apu", "apv", "iv", "tag", "p2s", "p2c"]);
    if (!Array.isArray(header.crit) ||
        header.crit.some((str) => typeof str !== "string" || !str)) {
        throw Error("header parameter 'crit' must be an array of non-empty strings");
    }
    if (header.crit.some((str) => reservedWords.has(str))) {
        throw Error("the 'crit' list contains a non-extension header parameter");
    }
    if (header.crit.some((str) => typeof header[str] === "undefined" ||
        typeof handlers?.[str] !== "function")) {
        throw Error("critical extension header parameters are not understood");
    }
    return Promise.all(header.crit.map((str) => handlers[str](header[str])));
}
function validateJwtObject(maybeJwtObject) {
    if (typeof maybeJwtObject.signature !== "string") {
        throw ReferenceError("the signature is no string");
    }
    if (!(isObject(maybeJwtObject.header) &&
        has("alg", maybeJwtObject.header) &&
        typeof maybeJwtObject.header.alg === "string")) {
        throw ReferenceError("header parameter 'alg' is not a string");
    }
    if (isObject(maybeJwtObject.payload) && has("exp", maybeJwtObject.payload)) {
        if (typeof maybeJwtObject.payload.exp !== "number") {
            throw RangeError("claim 'exp' is not a number");
        } // Implementers MAY provide for some small leeway to account for clock skew (JWT §4.1.4)
        else if (isExpired(maybeJwtObject.payload.exp, 1000)) {
            throw RangeError("the jwt is expired");
        }
    }
    return maybeJwtObject;
}
async function handleJwtObject(jwtObject, critHandlers) {
    return [
        jwtObject,
        "crit" in jwtObject.header
            ? await checkHeaderCrit(jwtObject.header, critHandlers)
            : undefined,
    ];
}
function parseAndDecode(jwt) {
    const parsedArray = jwt
        .split(".")
        .map(convertBase64urlToUint8Array)
        .map((uint8Array, index) => index === 2
        ? convertUint8ArrayToHex(uint8Array)
        : JSON.parse(new TextDecoder().decode(uint8Array)));
    if (parsedArray.length !== 3)
        throw TypeError("invalid serialization");
    return {
        header: parsedArray[0],
        payload: parsedArray[1] === "" ? undefined : parsedArray[1],
        signature: parsedArray[2],
    };
}
async function validateJwt(jwt, key, { critHandlers } = {}) {
    try {
        const [oldJwtObject, critResult] = await handleJwtObject(validateJwtObject(parseAndDecode(jwt)), critHandlers);
        if (oldJwtObject.signature !==
            parseAndDecode(makeJwt({ ...oldJwtObject, key })).signature)
            throw Error("signatures don't match");
        return { ...oldJwtObject, jwt, critResult, isValid: true };
    }
    catch (err) {
        return {
            jwt,
            error: new JwtError(err.message),
            isValid: false,
            isExpired: err.message === "the jwt is expired" ? true : false,
        };
    }
}
export { validateJwt, validateJwtObject, checkHeaderCrit, parseAndDecode, isExpired, };
//# sourceMappingURL=file:///mnt/d/Dev/Deno/Example-Deno-Oak-MongoDB-Auth-djwt-RESTAPI/deno_dir/gen/https/deno.land/x/djwt/validate.ts.js.map