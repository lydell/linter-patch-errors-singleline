/* @flow */

import type { TextEditor } from "../lib/types";

import singlelineify from "../lib/singlelineify";

function mockEditors(
  mocks: { file: string, lines: string[] }[],
): Set<TextEditor> {
  return new Set(
    mocks.map(({ file, lines }) => ({
      getPath: () => file,
      getTextInBufferRange: () => lines.join("\n"),
    })),
  );
}

describe("singlelineify", () => {
  it("works with a simple message", () => {
    const editors = mockEditors([
      {
        file: "/test/file",
        lines: ["line 1", "line 2"],
      },
    ]);

    const messages = [
      {
        version: 2,
        location: {
          file: "/test/file",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 2, column: 7 },
          },
        },
      },
    ];

    singlelineify(messages, editors);

    expect(messages).toEqual([
      {
        version: 2,
        location: {
          file: "/test/file",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 1, column: 7 },
          },
        },
      },
    ]);
  });

  it("works with a simple legacy message", () => {
    const editors = mockEditors([
      {
        file: "/test/file",
        lines: ["line 1", "line 2"],
      },
    ]);

    const messages = [
      {
        version: 1,
        filePath: "/test/file",
        range: {
          start: { row: 1, column: 1 },
          end: { row: 2, column: 7 },
        },
      },
    ];

    singlelineify(messages, editors);

    expect(messages).toEqual([
      {
        version: 1,
        filePath: "/test/file",
        range: {
          start: { row: 1, column: 1 },
          end: { row: 1, column: 7 },
        },
      },
    ]);
  });

  it("skips a legacy message without a range", () => {
    const editors = mockEditors([
      {
        file: "/test/file",
        lines: ["line 1", "line 2"],
      },
    ]);

    const messages = [
      {
        version: 1,
        filePath: "/test/path",
      },
    ];

    singlelineify(messages, editors);

    expect(messages).toEqual([
      {
        version: 1,
        filePath: "/test/path",
      },
    ]);
  });

  it("skips a legacy message without a file", () => {
    const editors = mockEditors([
      {
        file: "/test/file",
        lines: ["line 1", "line 2"],
      },
    ]);

    const messages = [
      {
        version: 1,
        range: {
          start: { row: 1, column: 1 },
          end: { row: 2, column: 7 },
        },
      },
    ];

    singlelineify(messages, editors);

    expect(messages).toEqual([
      {
        version: 1,
        range: {
          start: { row: 1, column: 1 },
          end: { row: 2, column: 7 },
        },
      },
    ]);
  });

  it("skips a legacy message with neither a range nor a filePath", () => {
    const editors = mockEditors([
      {
        file: "/test/file",
        lines: ["line 1", "line 2"],
      },
    ]);

    const messages = [
      {
        version: 1,
      },
    ];

    singlelineify(messages, editors);

    expect(messages).toEqual([
      {
        version: 1,
      },
    ]);
  });

  it("leaves singleline messages unchanged", () => {
    const editors = mockEditors([
      {
        file: "/test/file",
        lines: ["line 1"],
      },
    ]);

    const messages = [
      {
        version: 2,
        location: {
          file: "/test/file",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 1, column: 7 },
          },
        },
      },
    ];

    singlelineify(messages, editors);

    expect(messages).toEqual([
      {
        version: 2,
        location: {
          file: "/test/file",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 1, column: 7 },
          },
        },
      },
    ]);
  });

  it("includes trailing whitespace", () => {
    const editors = mockEditors([
      {
        file: "/test/file",
        lines: ["line 1    ", "line 2"],
      },
    ]);

    const messages = [
      {
        version: 2,
        location: {
          file: "/test/file",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 2, column: 2 },
          },
        },
      },
    ];

    singlelineify(messages, editors);

    expect(messages).toEqual([
      {
        version: 2,
        location: {
          file: "/test/file",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 1, column: 11 },
          },
        },
      },
    ]);
  });

  it("skips whitespace-only lines", () => {
    const editors = mockEditors([
      {
        file: "/test/file",
        lines: ["", " \t", "new end  ", "old end"],
      },
    ]);

    const messages = [
      {
        version: 2,
        location: {
          file: "/test/file",
          position: {
            start: { row: 10, column: 20 },
            end: { row: 13, column: 3 },
          },
        },
      },
    ];

    singlelineify(messages, editors);

    expect(messages).toEqual([
      {
        version: 2,
        location: {
          file: "/test/file",
          position: {
            start: { row: 10, column: 20 },
            end: { row: 12, column: 10 },
          },
        },
      },
    ]);
  });

  it("leaves the messages unchanged if no editors", () => {
    const editors = mockEditors([]);

    const messages = [
      {
        version: 2,
        location: {
          file: "/test/file",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 2, column: 7 },
          },
        },
      },
    ];

    singlelineify(messages, editors);

    expect(messages).toEqual([
      {
        version: 2,
        location: {
          file: "/test/file",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 2, column: 7 },
          },
        },
      },
    ]);
  });

  it("leaves the messages unchanged if no matching editors", () => {
    const editors = mockEditors([
      {
        file: "/test/file1",
        lines: ["line 1", "line 2"],
      },
      {
        file: "/test/file2",
        lines: ["line 1", "line 2"],
      },
    ]);

    const messages = [
      {
        version: 2,
        location: {
          file: "/test/nope",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 2, column: 7 },
          },
        },
      },
    ];

    singlelineify(messages, editors);

    expect(messages).toEqual([
      {
        version: 2,
        location: {
          file: "/test/nope",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 2, column: 7 },
          },
        },
      },
    ]);
  });

  it("works with everything at once", () => {
    const editors = mockEditors([
      {
        file: "/test/file1",
        lines: ["line 1", "line 2"],
      },
      {
        file: "/test/file2",
        lines: ["", " \t", "line", ""],
      },
    ]);

    const messages = [
      {
        version: 2,
        location: {
          file: "/test/file2",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 4, column: 1 },
          },
        },
      },
      {
        version: 1,
        filePath: "/test/file1",
        range: {
          start: { row: 1, column: 1 },
          end: { row: 2, column: 2 },
        },
      },
      {
        version: 1,
      },
      {
        version: 2,
        location: {
          file: "/test/nope",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 2, column: 2 },
          },
        },
      },
    ];

    singlelineify(messages, editors);

    expect(messages).toEqual([
      {
        version: 2,
        location: {
          file: "/test/file2",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 3, column: 5 },
          },
        },
      },
      {
        version: 1,
        filePath: "/test/file1",
        range: {
          start: { row: 1, column: 1 },
          end: { row: 1, column: 7 },
        },
      },
      {
        version: 1,
      },
      {
        version: 2,
        location: {
          file: "/test/nope",
          position: {
            start: { row: 1, column: 1 },
            end: { row: 2, column: 2 },
          },
        },
      },
    ]);
  });
});
