import type { TextStyle } from "react-native";

export type TextSegment =
  | { type: "text"; value: string }
  | { type: "url"; value: string };

/** Matches http(s) URLs and www. links in post title/body text. */
const URL_REGEX = /(?:https?:\/\/[^\s]+|www\.[^\s]+)/gi;

export function textContainsUrl(input: string): boolean {
  if (!input) return false;
  return new RegExp(URL_REGEX.source, URL_REGEX.flags).test(input);
}

export function splitTextByUrls(input: string): TextSegment[] {
  if (!input) return [{ type: "text", value: "" }];

  const segments: TextSegment[] = [];
  const regex = new RegExp(URL_REGEX.source, URL_REGEX.flags);
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: input.slice(lastIndex, match.index) });
    }
    segments.push({ type: "url", value: match[0] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    segments.push({ type: "text", value: input.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: "text", value: input }];
}

export function normalizeUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

export const LINK_TEXT_COLOR = "#8A94FF";

export function linkTextStyle(): TextStyle {
  return {
    color: LINK_TEXT_COLOR,
    textDecorationLine: "underline",
    textDecorationColor: LINK_TEXT_COLOR,
  };
}
