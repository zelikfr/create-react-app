/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

// Inspired by https://github.com/airbnb/javascript but less opinionated.

// We use eslint-loader so even warnings are very visible.
// This is why we only use "WARNING" level for potential errors,
// and we don't use "ERROR" level at all.

// In the future, we might create a separate list of rules for production.
// It would probably be more strict.

// The ESLint browser environment defines all browser globals as valid,
// even though most people don't know some of them exist (e.g. `name` or `status`).
// This is dangerous as it hides accidentally undefined variables.
// We blacklist the globals that we deem potentially confusing.
// To use them, explicitly reference them, e.g. `window.name` or `window.status`.
const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
  "globals": {},
  "env": {
    "jest/globals": true,
    "es6": true
  },
  "plugins": [
    "json",
    "react",
    "jest"
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "extends": [
    "standard",
    "plugin:react/recommended",
    "plugin:jest/recommended"
  ],
  "rules": {
    "react/jsx-curly-spacing": [
      "error",
      "never"
    ],
    "react/jsx-tag-spacing": [
      "error"
    ],
    "camelcase": "off",
    "comma-dangle": [
      "error",
      {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "never"
      }
    ],
    "default-case": "error",
    "jsx-quotes": "error",
    "max-len": "off",
    "no-invalid-this": "error",
    "no-return-await": "error",
    "no-var": "error",
    "no-use-before-define": "error",
    "prefer-arrow-callback": "error",
    "prefer-const": [
      "error",
      {
        "destructuring": "all",
        "ignoreReadBeforeAssign": true
      }
    ],
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "radix": "error",
    "react/display-name": "off",
    "object-curly-spacing": [
      "error",
      "always"
    ]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
};
