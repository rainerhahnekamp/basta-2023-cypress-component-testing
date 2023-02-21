export function notNullable<T>(obj: T): asserts obj is NonNullable<T> {
  if (obj === null || obj === undefined) {
    throw new Error(`encountered ${obj} on notNullable`);
  }
}
