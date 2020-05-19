import { parseSgf } from './kifuParser'
import { Point } from './Point'

const data = `(;GM[1]FF[4]SZ[19]PB[林立祥]BR[七段]PW[許皓鋐]WR[六段]KM[6.5]RE[W+R]DT[2020-05-18]GN[第10期友士杯十段戦挑戦手合五番勝負第4局];B[pd];W[dd];B[qp])`

describe(`parse`, () => {
  test('parse', () => {
    expect(parseSgf(data)).toStrictEqual({
      head: {
        BR: '七段',
        DT: '2020-05-18',
        FF: '4',
        GM: '1',
        GN: '第10期友士杯十段戦挑戦手合五番勝負第4局',
        KM: '6.5',
        PB: '林立祥',
        PW: '許皓鋐',
        RE: 'W+R',
        SZ: '19',
        WR: '六段',
      },
      turns: [
        { type: 'B', pt: new Point(15, 3) },
        { type: 'W', pt: new Point(3, 3) },
        { type: 'B', pt: new Point(16, 15) },
      ],
    })
  })
})
