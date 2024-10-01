var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => EnvironmentPlugin
});
module.exports = __toCommonJS(src_exports);
var import_path = require("path");
var import_vite = require("vite");
function defineEnvVars(env, defineOn, keys, defaultValues) {
  return keys.reduce((vars, key) => {
    const value = env[key] === void 0 ? defaultValues[key] : env[key];
    if (value === void 0)
      throwMissingKeyError(key);
    vars[`${defineOn}.${key}`] = JSON.stringify(value);
    return vars;
  }, {});
}
function loadProcessEnv(prefix) {
  if (prefix === "")
    return process.env;
  return Object.fromEntries(Object.entries(process.env).filter(([key, _value]) => key.startsWith(prefix)));
}
function throwMissingKeyError(key) {
  throw new Error(`vite-plugin-environment: the \`${key}\` environment variable is undefined.

You can pass an object with default values to suppress this warning.
See https://github.com/ElMassimo/vite-plugin-environment for guidance.`);
}
function EnvironmentPlugin(vars, options = {}) {
  const { prefix = "", defineOn = "process.env", loadEnvFiles = true } = options;
  return {
    name: "vite-plugin-environment",
    config({ root = process.cwd(), envDir }, { mode }) {
      const resolvedRoot = (0, import_path.resolve)(root);
      envDir = envDir ? (0, import_path.resolve)(resolvedRoot, envDir) : resolvedRoot;
      const env = loadEnvFiles ? (0, import_vite.loadEnv)(mode, envDir, prefix) : loadProcessEnv(prefix);
      const keys = vars === "all" ? Object.keys(env) : Array.isArray(vars) ? vars : Object.keys(vars);
      const defaultValues = vars === "all" || Array.isArray(vars) ? {} : vars;
      return { define: defineEnvVars(env, defineOn, keys, defaultValues) };
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
