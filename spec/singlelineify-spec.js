/* @flow */

import type { TextBuffer } from "../lib/types";

import singlelineify from "../lib/singlelineify";

function mockTextBuffer(lines: string[]): TextBuffer {
  return {
    getTextInRange: () => lines.join("\n"),
  };
}

describe("singlelineify", () => {
  it("works with a simple message", () => {
    const textBuffer = mockTextBuffer(["line 1", "line 2"]);

    const messages = [
      {
        version: 2,
        location: {
          position: {
            start: { row: 1, column: 1 },
            end: { row: 2, column: 7 },
          },
        },
      },
    ];

    singlelineify(messages, textBuffer);

    expect(messages).toEqual([
      {
        version: 2,
        location: {
          position: {
            start: { row: 1, column: 1 },
            end: { row: 1, column: 7 },
          },
        },
      },
    ]);
  });

  it("works with a simple legacy message", () => {
    const textBuffer = mockTextBuffer(["line 1", "line 2"]);

    const messages = [
      {
        version: 1,
        range: {
          start: { row: 1, column: 1 },
          end: { row: 2, column: 7 },
        },
      },
    ];

    singlelineify(messages, textBuffer);

    expect(messages).toEqual([
      {
        version: 1,
        range: {
          start: { row: 1, column: 1 },
          end: { row: 1, column: 7 },
        },
      },
    ]);
  });

  it("works with a legacy message without a range", () => {
    const textBuffer = mockTextBuffer(["line 1", "line 2"]);

    const messages = [
      {
        version: 1,
      },
    ];

    singlelineify(messages, textBuffer);

    expect(messages).toEqual([
      {
        version: 1,
      },
    ]);
  });

  it("leaves singleline messages unchanged", () => {
    const textBuffer = mockTextBuffer(["line 1"]);

    const messages = [
      {
        version: 2,
        location: {
          position: {
            start: { row: 1, column: 1 },
            end: { row: 1, column: 7 },
          },
        },
      },
    ];

    singlelineify(messages, textBuffer);

    expect(messages).toEqual([
      {
        version: 2,
        location: {
          position: {
            start: { row: 1, column: 1 },
            end: { row: 1, column: 7 },
          },
        },
      },
    ]);
  });

  it("includes trailing whitespace", () => {
    const textBuffer = mockTextBuffer(["line 1    ", "line 2"]);

    const messages = [
      {
        version: 2,
        location: {
          position: {
            start: { row: 1, column: 1 },
            end: { row: 2, column: 2 },
          },
        },
      },
    ];

    singlelineify(messages, textBuffer);

    expect(messages).toEqual([
      {
        version: 2,
        location: {
          position: {
            start: { row: 1, column: 1 },
            end: { row: 1, column: 11 },
          },
        },
      },
    ]);
  });

  it("skips whitespace-only lines", () => {
    const textBuffer = mockTextBuffer(["", " \t", "new end  ", "old end"]);

    const messages = [
      {
        version: 2,
        location: {
          position: {
            start: { row: 10, column: 20 },
            end: { row: 13, column: 3 },
          },
        },
      },
    ];

    singlelineify(messages, textBuffer);

    expect(messages).toEqual([
      {
        version: 2,
        location: {
          position: {
            start: { row: 10, column: 20 },
            end: { row: 12, column: 10 },
          },
        },
      },
    ]);
  });

  it("leaves the messages unchanged if the TextBuffer is missing", () => {
    const textBuffer = null;

    const messages = [
      {
        version: 2,
        location: {
          position: {
            start: { row: 1, column: 1 },
            end: { row: 2, column: 7 },
          },
        },
      },
    ];

    singlelineify(messages, textBuffer);

    expect(messages).toEqual([
      {
        version: 2,
        location: {
          position: {
            start: { row: 1, column: 1 },
            end: { row: 2, column: 7 },
          },
        },
      },
    ]);
  });
});
