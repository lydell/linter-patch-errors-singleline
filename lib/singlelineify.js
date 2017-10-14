/* @flow */

import type { LinterMessage, Range, TextEditor } from "./types";

export default function singlelineify(
  messages: LinterMessage[],
  editors: Set<TextEditor>,
): void {
  messages.forEach(message => updateMessage(message, editors));
}

function updateMessage(message: LinterMessage, editors: Set<TextEditor>): void {
  switch (message.version) {
    case 2:
      updateRange(message.location.position, message.location.file, editors);
      break;

    case 1:
      if (message.range && message.filePath != null) {
        updateRange(message.range, message.filePath, editors);
      }
      break;

    default:
    // Do nothing.
  }
}

function updateRange(
  range: Range,
  file: string,
  editors: Set<TextEditor>,
): void {
  const editor = getEditor(file, editors);

  if (!editor) {
    return;
  }

  const text = editor.getTextInBufferRange(range);
  const lines = text.split("\n");

  // Leave the range completely untouched if only one line.
  if (lines.length <= 1) {
    return;
  }

  // Find the first non-whitespace-only line in the range, and use the end of
  // that line as the end of the range. (The start of the range is always left
  // untouched.)
  const endRowIndex = lines.findIndex(line => line.trim() !== "");

  if (endRowIndex === -1) {
    return;
  }

  const endRow = range.start.row + endRowIndex;

  const endColumn =
    (endRowIndex === 0 ? range.start.column : 1) + lines[endRowIndex].length;

  range.end.row = endRow;
  range.end.column = endColumn;
}

function getEditor(file: string, editors: Set<TextEditor>): ?TextEditor {
  for (const editor of editors) {
    if (editor.getPath() === file) {
      return editor;
    }
  }
  return null;
}
