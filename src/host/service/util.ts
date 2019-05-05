export function forEach<T, U>(arrayLike: T, countFn: (v: T) => number, cb: (v: U, i: number) => void) {
  const count = countFn(arrayLike)
  for (let i = 0; i < count; ++i) {
    cb((arrayLike as any)[i], i)
  }
}

export function find<T, U>(arrayLike: T, predicate: (v: U) => boolean): U | undefined {
  let count = 0
  if ((arrayLike as any).numItems > 0) count = (arrayLike as any).numItems
  if ((arrayLike as any).numSequences > 0) count = (arrayLike as any).numSequences
  if ((arrayLike as any).numProjects > 0) count = (arrayLike as any).numProjects

  for (let i = 0; i < count; ++i) {
    const value = (arrayLike as any)[i]
    if (predicate(value)) return value
  }
}
