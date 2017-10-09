/* @flow */

export type Point = {
  row: number,
  column: number,
};

export type Range = {
  start: Point,
  end: Point,
};

// Copied and modified from linter-ui-default.
type Message = {
  version: 2,
  location: {
    position: Range,
  },
};

// Copied and modified from linter-ui-default.
type MessageLegacy = {
  version: 1,
  range?: Range,
};

// Copied from linter-ui-default.
export type LinterMessage = Message | MessageLegacy;

export type TextBuffer = {
  getTextInRange: Range => string,
};
