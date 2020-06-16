import { convertUint8ArrayToBase64url } from "./base64/base64url.ts";
import { decodeString as convertHexToUint8Array } from "https://deno.land/std@v0.56.0/encoding/hex.ts";
import { HmacSha256 } from "https://deno.land/std@v0.56.0/hash/sha256.ts";
import { HmacSha512 } from "https://deno.land/std@v0.56.0/hash/sha512.ts";
// Helper function: setExpiration()
// returns the number of milliseconds since January 1, 1970, 00:00:00 UTC
function setExpiration(exp) {
    return (exp instanceof Date ? exp : new Date(exp)).getTime();
}
function convertHexToBase64url(input) {
    return convertUint8ArrayToBase64url(convertHexToUint8Array(input));
}
function convertStringToBase64url(input) {
    return convertUint8ArrayToBase64url(new TextEncoder().encode(input));
}
function makeSigningInput(header, payload) {
    return `${convertStringToBase64url(JSON.stringify(header))}.${convertStringToBase64url(JSON.stringify(payload || ""))}`;
}
function encrypt(alg, key, msg) {
    function assertNever(alg) {
        throw new RangeError("no matching crypto algorithm in the header: " + alg);
    }
    switch (alg) {
        case "none":
            return null;
        case "HS256":
            return new HmacSha256(key).update(msg).toString();
        case "HS512":
            return new HmacSha512(key).update(msg).toString();
        default:
            assertNever(alg);
    }
}
function makeSignature(alg, key, input) {
    const encryptionInHex = encrypt(alg, key, input);
    return encryptionInHex ? convertHexToBase64url(encryptionInHex) : "";
}
function makeJwt({ key, header, payload }) {
    try {
        const signingInput = makeSigningInput(header, payload);
        return `${signingInput}.${makeSignature(header.alg, key, signingInput)}`;
    }
    catch (err) {
        err.message = `Failed to create JWT: ${err.message}`;
        throw err;
    }
}
export { makeJwt, setExpiration, makeSignature, convertHexToBase64url, convertStringToBase64url, };
//# sourceMappingURL=file:///mnt/d/Dev/Deno/Example-Deno-Oak-MongoDB-Auth-djwt-RESTAPI/deno_dir/gen/https/deno.land/x/djwt/create.ts.js.map