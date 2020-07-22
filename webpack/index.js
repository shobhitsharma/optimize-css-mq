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
    compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, () => {
      const contents = fs.readFileSync(this.options.input, "utf8");

      return optmizemq
        .pack(contents, {
          from: this.options.input,
          map: {
            inline: false,
          },
          to: this.options.output,
        })
        .then((result) => {
          if (!this.options.output) {
            process.stdout.write(result.css);
            return;
          }

          fs.writeFileSync(this.options.output, result.css);

          if (result.map) {
            fs.writeFileSync(`${this.options.output}.map`, result.map);
          }
        })
        .catch((error) => {
          if (error.name !== "CssSyntaxError") {
            throw error;
          }

          process.exitCode = 1;
          console.error(
            `${error.file}:${error.line}:${error.column}: ${error.reason}`
          );
        });
    });
  }
}

module.exports = OptimizeCssMqPlugin;
