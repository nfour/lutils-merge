interface Options {
  depth: number,
  types: (
    { object: boolean, array: boolean, function: boolean }
    |
    ["array"|"object"|"function"]
  ),
  test: (params: {}) => boolean 
}

/**
 * Merges all objects into first object.
 */
declare function merge(
  target: {},
  ...sources: {}[]
): {}

declare function merge(
  objects: [{}],
  options?: Options,
  handler?: (params: {}) => boolean 
): {}

declare module merge {
  /**
   * Merges all objects into first object only if there **is** a key match.
   */
  function white(
    target: {},
    ...sources: {}[]  
  ): {}

  /**
   * Merges all objects into first object only if there **isn't** a key match.
   */
  function black(
    target: {},
    ...sources: {}[]
  ): {}
}

export = merge