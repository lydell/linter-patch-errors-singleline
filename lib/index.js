/* @flow */

import type { LinterMessage, TextBuffer } from "./types";

import path from "path";
import singlelineify from "./singlelineify";

function monkeyPatch() {
  const linterPath = atom.packages.resolvePackagePath("linter");

  if (linterPath == null) {
    atom.notifications.addError(
      "linter-patch-errors-singleline: Could not find the 'linter' package. Make sure it is installed.",
    );
    return;
  }

  const requirePath = path.join(linterPath, "lib", "message-registry");

  let MessageRegistry = null;

  try {
    // $FlowIgnore: Dynamic `require` path needed.
    MessageRegistry = require(requirePath);
  } catch (error) {
    atom.notifications.addError(
      "linter-patch-errors-singleline: Failed to require the 'linter' package.",
      {
        detail: String((error && error.stack) || error),
      },
    );
    return;
  }

  if (
    !MessageRegistry ||
    !MessageRegistry.prototype ||
    typeof MessageRegistry.prototype.set !== "function"
  ) {
    atom.notifications.addError(
      "linter-patch-errors-singleline: Could not find `MessageRegistry.prototype.set` in the 'linter' package for monkey-patching.",
    );
    return;
  }

  const originalSetMethod = MessageRegistry.prototype.set;
  MessageRegistry.prototype.set = function(data: {
    messages: LinterMessage[],
    buffer: TextBuffer,
  }) {
    singlelineify(data.messages, data.buffer);
    return originalSetMethod.call(this, data);
  };
}

monkeyPatch();
