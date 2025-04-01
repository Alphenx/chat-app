/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * It represents an object of translations: the keys can be strings or nested.
 */
type TranslationObject = {
  [key: string]: string | TranslationObject;
};

type LocaleTranslations<T extends TranslationObject = TranslationObject> = {
  [locale: string]: T;
};

/**
 * Extracts the first element of an array.
 * @example Head<['a', 'b', 'c']> → 'a'
 */
type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never;

/**
 * Returns all elements except the first.
 * @example Tail<['a', 'b', 'c']> → ['b', 'c']
 */
type Tail<T extends any[]> = T extends [any, ...infer R] ? R : [];

/**
 * Retrieves the value at a given path in an object.
 * @example NestedValue<{ a: { b: string } }, ['a', 'b']> → string
 */
type NestedValue<T, Keys extends string[]> = Keys extends []
  ? T
  : Head<Keys> extends keyof T
    ? NestedValue<T[Head<Keys>], Tail<Keys>>
    : never;

/**
 * Extracts valid object keys as string.
 */
type KeysOf<T> = Extract<keyof T, string>;

/**
 * Represents a simple key path.
 * @example KeyAsString<'title'> → "title"
 */
type KeyAsString<K extends string> = `${K}`;

/**
 * Represents a nested dot-separated path.
 * @example KeyAsDotPath<'form', { form: { fields: { email: string } } }> → "form.fields.email"
 */
type KeyAsDotPath<K extends string, T> = `${K}.${TranslationKey<T>}`;

/**
 * Determines if a key should be a simple or nested path.
 * @example
 * PathKeyResolver<'title', string> → "title"
 * PathKeyResolver<'form', { form: { fields: { email: string } } }> → "form.fields.email"
 */
type PathKeyResolver<K extends string, V> = V extends string
  ? KeyAsString<K>
  : V extends object
    ? KeyAsDotPath<K, V>
    : never;

/**
 * Maps object keys to their corresponding dot-path representation.
 * @example
 * DotPathMap<{ title: string; form: { fields: { email: { label: string; placeholder: string } } }}>;
 * // { title: "title", form: "form.fields.email" | "form.fields.email.label" | "form.fields.email.placeholder" }
 */
type TranslationKeyMap<T> = { [K in KeysOf<T>]: PathKeyResolver<K, T[K]> };

/**
 * Generates all valid dot-separated paths leading to string values.
 * @example
 * DotPaths<{ title: string; form: { fields: { email: { label: string; placeholder: string } } }}>;
 * // "title" | "form.fields.email.label" | "form.fields.email.placeholder"
 */
type TranslationKey<T> = TranslationKeyMap<T>[KeysOf<T>];

/**
 * Removes the first level of nesting from an object.
 * @example RemoveFirstLevel<{ a: { b: string } }> → { b: string }
 */
type RemoveFirstLevel<T> = T extends Record<string, infer U> ? U : never;

/**
 * Represents a scoped key path without the first level.
 * @example ScopedKey<{ a: { b: { c: string } } }, ['b']> → "c"
 */
type ScopedKey<T, Keys extends string[]> = NestedValue<RemoveFirstLevel<T>, Keys>;

/**
 * Returns the translated string corresponding to the provided key, with variables
 * interpolated if provided.
 * @example
 * t('Hello, ${name}', 'greeting', { name: 'John' }) // "Hello, John"
 */
type Translator<T> = (
  fallback: string,
  key: TranslationKey<T>,
  variables?: Record<string, string | number>
) => string;

/**
 * Represents a translator scope for a given set of keys.
 * @example
 * type TranslatorScope<T, Keys extends string[]> = Translator<ScopedKey<T, Keys>>;
 */
type TranslatorScope<T, Keys extends string[]> = Translator<ScopedKey<T, Keys>>;
