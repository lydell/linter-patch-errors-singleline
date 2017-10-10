/* @flow */

import type { TextEditor } from "../lib/types";

declare var atom: {
  packages: {
    resolvePackagePath: string => ?string,
  },
  notifications: {
    addError: (string, ?{ detail: string }) => void,
  },
  textEditors: {
    editors: Set<TextEditor>,
  },
};
