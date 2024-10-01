// src/index.ts
import { resolve } from "path";
import { loadEnv } from "vite";
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
      const resolvedRoot = resolve(root);
      envDir = envDir ? resolve(resolvedRoot, envDir) : resolvedRoot;
      const env = loadEnvFiles ? loadEnv(mode, envDir, prefix) : loadProcessEnv(prefix);
      const keys = vars === "all" ? Object.keys(env) : Array.isArray(vars) ? vars : Object.keys(vars);
      const defaultValues = vars === "all" || Array.isArray(vars) ? {} : vars;
      return { define: defineEnvVars(env, defineOn, keys, defaultValues) };
    }
  };
}
export {
  EnvironmentPlugin as default
};
