/** @typedef {import("webpack/lib/Compiler")} Compiler */

const fs = require("fs");
const validateOptions = require("schema-utils");
const optmizemq = require("../index");

const PLUGIN_NAME = "OptimizeCssMqPlugin";

const schema = {
  type: "object",
  properties: {
    input: {
      description: "Input css string path",
      type: "string",
    },
    output: {
      descriptions: "Output css string path",
      type: "string",
    },
  },
  additionalProperties: false,
};

class OptimizeCssMqPlugin {
  constructor(options = {}) {
    validateOptions(schema, options, { name: PLUGIN_NAME });
    this.options = options;
    this.cache = {};
  }

  /**
   * @param {Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
      const contents = fs.readFileSync(this.options.input, "utf8");
      const output = optmizemq.pack(contents, {
        from: this.options.input,
        map: {
          inline: false,
        },
        to: this.options.output,
      }).css;
      callback(output);
    });
  }
}

module.exports = OptimizeCssMqPlugin;
