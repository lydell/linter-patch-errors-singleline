/* @flow */

import type { LinterMessage, Range, TextBuffer } from "./types";

// This function mutates the messages rather than returning new ones since the
// messages are stored based on object identity. Returning new messages here
// means that old messages are never removed. We _could_ change the way messages
// are stored, but mutation is easier.
// export default function singlelineify(
export default function singlelineify(
  messages: LinterMessage[],
  textBuffer: ?TextBuffer,
): void {
  messages.forEach(message => updateMessage(message, textBuffer));
}

function updateMessage(message: LinterMessage, textBuffer: ?TextBuffer): void {
  if (!textBuffer) {
    return;
  }

  switch (message.version) {
    case 2:
      updateRange(message.location.position, textBuffer);
      break;

    case 1:
      if (message.range) {
        updateRange(message.range, textBuffer);
      }
      break;

    default:
    // Do nothing.
  }
}

function updateRange(range: Range, textBuffer: TextBuffer): void {
  const text = textBuffer.getTextInRange(range);
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
