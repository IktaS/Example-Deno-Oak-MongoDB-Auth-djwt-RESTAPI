export let MIN_SALT_SIZE = 8;
export var Variant;
(function (Variant) {
    Variant["Argon2i"] = "argon2i";
    Variant["Argon2d"] = "argon2d";
    Variant["Argon2id"] = "argon2id";
})(Variant || (Variant = {}));
export var Version;
(function (Version) {
    Version["V10"] = "16";
    Version["V13"] = "19";
})(Version || (Version = {}));
export var ThreadMode;
(function (ThreadMode) {
    ThreadMode[ThreadMode["Sequential"] = 0] = "Sequential";
    ThreadMode[ThreadMode["Parallel"] = 1] = "Parallel";
})(ThreadMode || (ThreadMode = {}));
export function version() {
    return "0.7.0";
}
//# sourceMappingURL=file:///mnt/d/Dev/Deno/Example-Deno-Oak-MongoDB-Auth-djwt-RESTAPI/deno_dir/gen/https/deno.land/x/argon2/lib/common.ts.js.map