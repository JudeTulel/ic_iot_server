import { Plugin } from 'vite';

/**
 * Provide a default string that will be used if the `process.env` value is not
 * defined.
 *
 * Use `undefined` for required variables which should cause the build to fail
 * if missing.
 *
 * Use `null` for optional variables.
 *
 * NOTE: Although you could technically pass a boolean or a number, all
 * process.env values are strings, and the inconsistency would make it easy to
 * introduce sutble bugs.
 */
declare type EnvVarDefault = string | null | undefined;
declare type EnvVarDefaults = Record<string, EnvVarDefault>;
declare type EnvVars = 'all' | string[] | EnvVarDefaults;
interface EnvOptions {
    /**
     * Only variables that match this prefix will be made available.
     * @default ''
     * @example EnvironmentPlugin('all', { prefix: 'VUE_APP_' })
     */
    prefix?: string;
    /**
     * You may also expose variables on `'import.meta.env'.
     * @default 'process.env'
     * @example EnvironmentPlugin(['NODE_ENV'], { defineOn: 'import.meta.env' })
     */
    defineOn?: string;
    /**
     * Whether to load environment variables defined in `.env` files.
     * @default true
     */
    loadEnvFiles?: boolean;
}
/**
 * Expose `process.env` environment variables to your client code.
 *
 * @param  {EnvVars} vars Provide a list of variables you wish to expose,
 *                        or an object that maps variable names to defaut values
 *                        to use when a variable is not defined.
 *                        Use 'all' to expose all variables that match the prefix.
 * @param  {EnvOptions} options
 */
declare function EnvironmentPlugin(vars: EnvVars, options?: EnvOptions): Plugin;

export { EnvOptions, EnvVarDefault, EnvVarDefaults, EnvVars, EnvironmentPlugin as default };
