# optimize-css-mq

Optimize CSS media queries by combining them together and injecting at end of base styles.

## Install

```bash
# npm
$ npm install optimize-css-mq --dev

# yarn
$ yarn add optimize-css-mq -D
```

## Example

### Input

```css
.foo {
  width: 240px;
}

@media screen and (min-width: 768px) {
  .foo {
    width: 576px;
  }
}

.bar {
  width: 160px;
}

@media screen and (min-width: 768px) {
  .bar {
    width: 384px;
  }
}
```

### Output

```css
.foo {
  width: 240px;
}

.bar {
  width: 160px;
}

@media screen and (min-width: 768px) {
  .foo {
    width: 576px;
  }
  .bar {
    width: 384px;
  }
}
```

## Usage

### PostCSS Plugin

```js
#!/usr/bin/env node

const fs = require("fs");
const postcss = require("postcss");

postcss([
  require("autoprefixer-core")(),
  require("optimize-css-mq")()
])
  .process(fs.readFileSync("from.css", "utf8"))
  .then(function (result) => result.css);
```

### Node.js Module

```js
#!/usr/bin/env node

const fs = require("fs");
const mqpacker = require("optimize-css-mq");

console.log(
  mqpacker.pack(fs.readFileSync("from.css", "utf8"), {
    from: "from.css",
    map: {
      inline: false,
    },
    to: "to.css",
  }).css
);
```

### CLI

This package also installs a command line interface.

```bash
$ node ./node_modules/.bin/mqpacker --help
Usage: mqpacker [options] INPUT [OUTPUT]

Description:
  Pack same CSS media query rules into one using PostCSS

Options:
  -s, --sort       Sort “min-width” queries.
      --sourcemap  Create source map file.
  -h, --help       Show this message.
      --version    Print version information.

Use a single dash for INPUT to read CSS from standard input.

Examples:
  $ mqpacker fragmented.css
  $ mqpacker fragmented.css > packed.css
```

> `--sort` option does not currently support a custom function.

## Options

### sort

By default, CSS MQPacker pack and order media queries as they are defined ([the
“first win” algorithm][1]). If you want to sort media queries automatically,
pass `sort: true` to this module.

```js
postcss([
  mqpacker({
    sort: true,
  }),
]).process(css);
```

Currently, this option only supports `min-width` queries with specific units
(`ch`, `em`, `ex`, `px`, and `rem`). If you want to do more, you need to create
your own sorting function and pass it to this module like this:

```js
postcss([
  mqpacker({
    sort: function (a, b) {
      return a.localeCompare(b);
    },
  }),
]).process(css);
```

In this example, all your media queries will sort by A-Z order.

This sorting function is directly passed to `Array#sort()` method of an array of
all your media queries.

## API

### .pack(css, [options])

Packs media queries in `css`.

The second argument is optional. The `options` are:

- [options][2] mentioned above
- the second argument of [PostCSS’s `process()` method][3]

You can specify both at the same time.

```js
const fs = require("fs");
const mqpacker = require("optimize-css-mq");

const result = mqpacker.pack(fs.readFileSync("from.css", "utf8"), {
  from: "from.css",
  map: {
    inline: false,
  },
  sort: true,
  to: "to.css",
});
fs.writeFileSync("to.css", result.css);
fs.writeFileSync("to.css.map", result.map);
```

## Licnse

MIT
