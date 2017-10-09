/* @flow */

declare var atom: {
  packages: {
    resolvePackagePath: string => ?string,
  },
  notifications: {
    addError: (string, ?{ detail: string }) => void,
  },
};
