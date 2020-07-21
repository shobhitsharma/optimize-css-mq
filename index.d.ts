export default OptimizeCssMqPlugin;
export type Compiler = import("webpack").Compiler;
export type Plugin = import("webpack").Plugin;

/** @typedef {import('webpack').Compiler} Compiler */

declare class OptimizeCssMqPlugin implements Plugin {
  constructor(options?: {});
  /**
   * @param {Compiler} compiler
   * @returns {void}
   */
  apply(compiler: Compiler): void;
  /**
   *
   * @param {Compiler} compiler
   * @returns {string}
   */
  getContext(compiler: Compiler): string;
}
