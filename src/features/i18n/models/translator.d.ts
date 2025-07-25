/////// TRANSLATOR TYPES

/**
 * A function that translates a key into a string or React node.
 * It accepts a fallback string, a translation key, and optional variables for interpolation.
 *
 * @param fallback - The fallback string to return if the translation is not found.
 * @param key - The translation key to look up.
 * @param variables - Optional variables for interpolation in the translation string.
 * @returns The translated string or React node.
 */
type Translator<FullMap, Keys extends readonly string[] = []> = (
  fallback: string,
  key: TranslationKey<FullMap, Keys>,
  variables?: Record<string, string | number>
) => string | React.ReactNode;

//
//
//

/**
 * Extract the type from the route (dot-path) valid, eliminating the first level (locale).
 * @example
 * TranslationKey<{ en: { home: { title: string } } }, ['home']>
 * // => "home.title"
 */
type TranslationKey<
  FullMap extends Record<string, unknown>,
  Keys extends readonly string[] = [],
> = `${TranslationKeyRaw<FullMap, Keys>}`;

/**
 * Removes the first level of nesting from an object.
 * @example RemoveFirstLevel<{ a: { b: string } }> → { b: string }
 */
type RemoveFirstLevel<T> = T extends Record<string, infer U> ? U : never;

/**
 * Extracts the first element of an array.
 * @example Head<['a', 'b', 'c']> → 'a'
 */
type Head<T extends readonly string[]> = T extends readonly [infer H, ...string[]] ? H : never;

/**
 * Returns all elements except the first.
 * @example Tail<['a', 'b', 'c']> → ['b', 'c']
 */
type Tail<T extends readonly string[]> = T extends readonly [string, ...infer R] ? R : [];

/**
 * Retrieves the value at a given path in an object.
 * @example NestedValue<{ a: { b: string } }, ['a', 'b']> → string
 */
type NestedValue<T, Keys extends readonly string[]> = Keys extends []
  ? T
  : Head<Keys> extends keyof T
    ? NestedValue<T[Head<Keys>], Tail<Keys>>
    : never;

/** Extracts valid object keys as string. */
type KeysOf<T> = Extract<keyof T, string>;

/** Represents a nested dot-separated path. */
type DotJoin<A extends string, B extends string> = A extends '' ? B : `${A}.${B}`;

/**
 * Maps object keys to their corresponding dot-path representation.
 * @example
 * DotPathMap<{ title: string; form: { fields: { email: { label: string; placeholder: string } } }}>;
 * { title: "title", form: "form.fields.email" | "form.fields.email.label" | "form.fields.email.placeholder" }
 */
type TranslationKeyMap<T, Prefix extends string> = {
  [K in KeysOf<T>]: T[K] extends string
    ? DotJoin<Prefix, K>
    : TranslationKeyMap<T[K], DotJoin<Prefix, K>>;
};

/**
 * A helper type to flatten the nested paths into a union of strings.
 * @example
 * FlattenPathMap<{ a: { b: { c: string } } }> // "a.b.c"
 */
type FlattenPathMap<M> = M extends string
  ? M
  : M extends Record<string, unknown>
    ? FlattenPathMap<M[KeysOf<M>]>
    : never;

type TranslationKeyRaw<
  T extends Record<string, unknown>,
  Keys extends readonly string[] = [],
> = FlattenPathMap<TranslationKeyMap<NestedValue<RemoveFirstLevel<T>, Keys>, ''>>;
