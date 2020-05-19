import { Point } from './Point'

const aCharCode = 'a'.charCodeAt(0)

const getPoint = (str: string) => str.charCodeAt(0) - aCharCode

export const parseSgf = (input: string) => {
  const [_kakko, _initial, ...turns] = input
    .replace(/^\((.+)\)$/, '$1')
    .split(';')

  return {
    turns: turns
      .map((turn) => {
        const matched = turn.match(/^(?<bw>\w)\[(?<x>\w)(?<y>\w)\]$/)
        if (!matched?.groups) return null
        const { bw, x, y } = matched.groups
        return {
          type: bw,
          pt: new Point(getPoint(x), getPoint(y)),
        }
      })
      .filter(<T>(item: T): item is NonNullable<T> => Boolean(item)),
  }
}
