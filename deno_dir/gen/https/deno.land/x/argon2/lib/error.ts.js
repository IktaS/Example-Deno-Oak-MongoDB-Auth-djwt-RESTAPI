export var Argon2ErrorType;
(function (Argon2ErrorType) {
    Argon2ErrorType["UnmeetPermission"] = "UnmeetPermission";
    Argon2ErrorType["InvalidInput"] = "InvalidInput";
    Argon2ErrorType["Native"] = "Native";
})(Argon2ErrorType || (Argon2ErrorType = {}));
export class Argon2Error extends Error {
    constructor(type, message, originalError) {
        super(message);
        this.type = type;
        this.originalError = originalError;
    }
    get name() {
        return `Argon2Error(${this.type})`;
    }
}
//# sourceMappingURL=file:///mnt/d/Dev/Deno/Example-Deno-Oak-MongoDB-Auth-djwt-RESTAPI/deno_dir/gen/https/deno.land/x/argon2/lib/error.ts.js.map