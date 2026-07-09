import type { Language, Token, TokenType } from "@/types";

/**
 * A tiny, synchronous, allocation-friendly tokenizer.
 *
 * Full syntax highlighters like Shiki/Prism are asynchronous or heavy and are
 * awkward to reconcile with per-character typing state. Instead we tokenize the
 * source once into a flat list of tokens that fully covers the string
 * (including whitespace and newlines), so the render layer can split every
 * token into characters while preserving exact indexes.
 */

interface Rule {
  type: TokenType;
  regex: RegExp;
  /** Optional classifier to refine the token type from the matched value. */
  refine?: (value: string) => TokenType;
}

const JS_KEYWORDS = new Set([
  "abstract", "as", "async", "await", "break", "case", "catch", "class",
  "const", "continue", "debugger", "default", "delete", "do", "else", "enum",
  "export", "extends", "finally", "for", "from", "function", "get", "if",
  "implements", "import", "in", "infer", "instanceof", "interface", "is",
  "keyof", "let", "namespace", "new", "of", "private", "protected", "public",
  "readonly", "return", "satisfies", "set", "static", "super", "switch",
  "this", "throw", "try", "type", "typeof", "var", "void", "while", "yield",
  "declare", "override",
]);

const JS_LITERALS = new Set([
  "true", "false", "null", "undefined", "NaN", "Infinity",
]);

const JS_TYPES = new Set([
  "string", "number", "boolean", "any", "unknown", "never", "object", "symbol",
  "bigint", "Record", "Partial", "Promise", "Array", "ReadonlyArray", "Map",
  "Set", "React",
]);

function classifyIdentifier(value: string): TokenType {
  if (JS_KEYWORDS.has(value)) return "keyword";
  if (JS_LITERALS.has(value)) return "boolean";
  if (JS_TYPES.has(value)) return "function";
  return "plain";
}

/** Shared building blocks. */
const WHITESPACE: Rule = { type: "plain", regex: /\s+/y };

const jsFamily: Rule[] = [
  WHITESPACE,
  { type: "comment", regex: /\/\/[^\n]*/y },
  { type: "comment", regex: /\/\*[\s\S]*?\*\//y },
  { type: "string", regex: /`(?:\\[\s\S]|[^\\`])*`/y },
  { type: "string", regex: /"(?:\\.|[^"\\])*"/y },
  { type: "string", regex: /'(?:\\.|[^'\\])*'/y },
  { type: "number", regex: /\b0[xXbBoO][0-9a-fA-F]+\b/y },
  { type: "number", regex: /\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y },
  // JSX / HTML-ish tags embedded in TSX.
  { type: "tag", regex: /<\/?[A-Za-z][\w.-]*/y },
  { type: "function", regex: /[A-Za-z_$][\w$]*(?=\s*\()/y },
  {
    type: "plain",
    regex: /[A-Za-z_$][\w$]*/y,
    refine: classifyIdentifier,
  },
  { type: "punctuation", regex: /[{}[\]()<>;:,.?!&|=+\-*/%^~@]+/y },
  { type: "plain", regex: /./y },
];

const cssFamily: Rule[] = [
  WHITESPACE,
  { type: "comment", regex: /\/\*[\s\S]*?\*\//y },
  { type: "string", regex: /"(?:\\.|[^"\\])*"/y },
  { type: "string", regex: /'(?:\\.|[^'\\])*'/y },
  { type: "keyword", regex: /@[\w-]+/y },
  { type: "number", regex: /#[0-9a-fA-F]{3,8}\b/y },
  {
    type: "number",
    regex: /\b\d[\d.]*(?:px|rem|em|%|vh|vw|s|ms|deg|fr)?\b/y,
  },
  { type: "property", regex: /[A-Za-z-]+(?=\s*:)/y },
  { type: "function", regex: /[A-Za-z-]+(?=\s*\()/y },
  { type: "tag", regex: /\.[A-Za-z_-][\w-]*/y },
  { type: "plain", regex: /[A-Za-z_-][\w-]*/y },
  { type: "punctuation", regex: /[{}():;,>+~*.#!]+/y },
  { type: "plain", regex: /./y },
];

const htmlFamily: Rule[] = [
  WHITESPACE,
  { type: "comment", regex: /<!--[\s\S]*?-->/y },
  { type: "string", regex: /"(?:\\.|[^"\\])*"/y },
  { type: "string", regex: /'(?:\\.|[^'\\])*'/y },
  { type: "tag", regex: /<\/?[A-Za-z][\w-]*/y },
  { type: "attr", regex: /[A-Za-z-]+(?==)/y },
  { type: "punctuation", regex: /[<>/=]+/y },
  { type: "plain", regex: /[^<>\s=/"']+/y },
  { type: "plain", regex: /./y },
];

const jsonFamily: Rule[] = [
  WHITESPACE,
  { type: "property", regex: /"(?:\\.|[^"\\])*"(?=\s*:)/y },
  { type: "string", regex: /"(?:\\.|[^"\\])*"/y },
  { type: "number", regex: /-?\d[\d.]*(?:[eE][+-]?\d+)?/y },
  { type: "boolean", regex: /\b(?:true|false|null)\b/y },
  { type: "punctuation", regex: /[{}[\]:,]+/y },
  { type: "plain", regex: /./y },
];

function rulesFor(language: Language): Rule[] {
  switch (language) {
    case "css":
      return cssFamily;
    case "html":
      return htmlFamily;
    case "json":
      return jsonFamily;
    default:
      return jsFamily;
  }
}

/**
 * Tokenize `code` into a flat list of tokens that concatenate back to the
 * original string exactly. Never throws; unknown characters fall back to
 * "plain" so the character count is always preserved.
 */
export function tokenize(code: string, language: Language): Token[] {
  const rules = rulesFor(language);
  const tokens: Token[] = [];
  let pos = 0;

  while (pos < code.length) {
    let matched = false;

    for (const rule of rules) {
      rule.regex.lastIndex = pos;
      const match = rule.regex.exec(code);
      if (match && match.index === pos && match[0].length > 0) {
        const value = match[0];
        const type = rule.refine ? rule.refine(value) : rule.type;
        tokens.push({ value, type });
        pos += value.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Absolute safety net so we always make progress.
      tokens.push({ value: code[pos] ?? "", type: "plain" });
      pos += 1;
    }
  }

  return tokens;
}
