/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - (len % 32));
    x[(((len + 64) >> 9) << 4) + 15] = len;
    const w = [];
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let e = -1009589776;
    for (let i = 0; i < x.length; i += 16) {
        const olda = a;
        const oldb = b;
        const oldc = c;
        const oldd = d;
        const olde = e;
        for (let j = 0; j < 80; j++) {
            if (j < 16)
                w[j] = x[i + j];
            else
                w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = bit_rol(b, 30);
            b = a;
            a = t;
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return [a, b, c, d, e];
}
/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d) {
    if (t < 20)
        return (b & c) | (~b & d);
    if (t < 40)
        return b ^ c ^ d;
    if (t < 60)
        return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
}
/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t) {
    return t < 20
        ? 1518500249
        : t < 40
            ? 1859775393
            : t < 60
                ? -1894007588
                : -899497514;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}
export class Sha1Hash {
    digest(bytes) {
        let data = [];
        for (var i = 0; i < bytes.length * 8; i += 8) {
            data[i >> 5] |= (bytes[i / 8] & 0xff) << (24 - (i % 32));
        }
        data = binb_sha1(data, bytes.length * 8);
        return this.toStrBytes(data);
    }
    /*
     * Convert an array of big-endian words to a string
     */
    toStrBytes(input) {
        let pos = 0;
        const data = new Uint8Array(input.length * 4);
        for (let i = 0; i < input.length * 32; i += 8) {
            data[pos++] = (input[i >> 5] >> (24 - (i % 32))) & 0xff;
        }
        return data;
    }
}
//# sourceMappingURL=file:///mnt/d/Dev/Deno/Example-Deno-Oak-MongoDB-Auth-djwt-RESTAPI/deno_dir/gen/https/deno.land/x/checksum@1.4.0/sha1.ts.js.map