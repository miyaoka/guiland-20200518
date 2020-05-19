<template>
  <div>
    <h1>#火曜GUI</h1>
    <h2>棋譜ビューアやりたい</h2>

    <section class="control">
      <label>
        turn
        <p>{{ turnIndex }}</p>
        <input
          v-model.number="turnIndex"
          type="range"
          min="0"
          :max="turns.length - 1"
          step="1"
        />
      </label>

      <label>
        filter
        <input v-model="useFilter" type="checkbox" />
      </label>

      <label>
        blur
        <p>{{ blur.toFixed(2) }}</p>
        <input v-model.number="blur" type="range" min="1" max="10" step="any" />
      </label>
      <label>
        stoneScale
        <p>{{ stoneScale.toFixed(2) }}</p>
        <input
          v-model.number="stoneScale"
          type="range"
          min="0.2"
          max="1.5"
          step="any"
        />
      </label>
      <label>
        edgeScale
        <p>{{ edgeScale.toFixed(2) }}</p>
        <input
          v-model.number="edgeScale"
          type="range"
          min="0"
          max="1.5"
          step="any"
        />
      </label>
      <select v-model="selectedKifu">
        <option
          v-for="(kifu, i) in kifuList"
          :key="i"
          :value="kifu"
          :label="kifu.head.GN || kifu.head.EV"
        ></option>
      </select>

      <button @click="check">check</button>
    </section>

    <svg :viewBox="`0 0 ${unitSize * 20} ${unitSize * 20}`">
      <defs>
        <filter id="blur">
          <feGaussianBlur
            in="SourceGraphic"
            :stdDeviation="blur"
            result="blur"
          />
          <feComposite in="SourceGraphic" in2="matrix" operator="atop" />
        </filter>

        <filter id="colormatrix">
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="matrix"
          />
          <feComposite in="SourceGraphic" in2="matrix" operator="atop" />
        </filter>
      </defs>

      <g>
        <rect
          x="0"
          y="0"
          :width="unitSize * 20"
          :height="unitSize * 20"
          fill="#cc9"
        />

        <g :transform="`translate(${unitSize} ${unitSize})`">
          <g>
            <rect
              x="0"
              y="0"
              :width="unitSize * 18"
              :height="unitSize * 18"
              fill="rgb(218, 163, 75)"
            />
            <polyline
              v-for="i in [...Array(19)].keys()"
              :key="`lineV${i}`"
              fill="none"
              stroke="black"
              :points="`${unitSize * i},0 ${unitSize * i},${unitSize * 18}`"
            />
            <polyline
              v-for="i in [...Array(19)].keys()"
              :key="`lineH${i}`"
              fill="none"
              stroke="black"
              :points="`0,${unitSize * i} ${unitSize * 18},${unitSize * i}`"
            />
          </g>

          <g :filter="useFilter && `url(#colormatrix)`">
            <g :filter="useFilter && `url(#blur)`">
              <circle
                v-for="(item, i) in turnsBlack"
                :key="`stoneB${i}`"
                :cx="item.pt.x * unitSize"
                :cy="item.pt.y * unitSize"
                :r="unitSize * 0.5 * stoneScale"
              />
              <line
                v-for="(item, i) in neighborsBlack"
                :key="`neighborsB${i}`"
                :x1="item.p0.x * unitSize"
                :y1="item.p0.y * unitSize"
                :x2="item.p1.x * unitSize"
                :y2="item.p1.y * unitSize"
                stroke="black"
                :stroke-width="(30 * edgeScale) / item.distance"
              />
            </g>
          </g>

          <g :filter="useFilter && `url(#colormatrix)`">
            <g :filter="useFilter && `url(#blur)`">
              <circle
                v-for="(item, i) in turnsWhite"
                :key="`stoneW${i}`"
                :cx="item.pt.x * unitSize"
                :cy="item.pt.y * unitSize"
                :r="unitSize * 0.5 * stoneScale"
                fill="#fff"
              />
              <line
                v-for="(item, i) in neighborsWhite"
                :key="`neighborsW${i}`"
                :x1="item.p0.x * unitSize"
                :y1="item.p0.y * unitSize"
                :x2="item.p1.x * unitSize"
                :y2="item.p1.y * unitSize"
                stroke="#fff"
                :stroke-width="(30 * edgeScale) / item.distance"
              />
            </g>
          </g>

          <circle
            v-for="(item, i) in turnsBlack"
            :key="`stoneB${i}`"
            :cx="item.pt.x * unitSize"
            :cy="item.pt.y * unitSize"
            :r="unitSize * 0.5 * stoneScale"
          />
          <circle
            v-for="(item, i) in turnsWhite"
            :key="`stoneW${i}`"
            :cx="item.pt.x * unitSize"
            :cy="item.pt.y * unitSize"
            :r="unitSize * 0.5 * stoneScale"
            fill="#fff"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { parseSgf } from '@/utils/kifuParser'
import { Point } from '@/utils/Point'
import { kifuList } from '@/assets/kifuList'

const parsedKifuList = kifuList.map((kifu) => parseSgf(kifu)) as Kifu[]

type KifuTurn = { type: string; pt: Point }
type Kifu = {
  head: Record<string, string>
  turns: KifuTurn[]
}

const unitSize = 40

export default Vue.extend({
  data() {
    return {
      turnIndex: 0,
      turns: [] as KifuTurn[],
      blur: 4,
      stoneScale: 1,
      edgeScale: 1,
      useFilter: true,
      unitSize,
      kifuList: parsedKifuList,
      selectedKifu: parsedKifuList[0],
    }
  },
  computed: {
    turnsBlack(): KifuTurn[] {
      return this.turns
        .slice(0, this.turnIndex)
        .filter(({ type }) => type === 'B')
    },
    distanceBlack(): { index: number; distance: number }[][] {
      const distanceList = this.turnsBlack.map((turn, i, array) => {
        const list = array.slice(i + 1).map((target, j) => {
          return {
            index: i + j + 1,
            distance: turn.pt.getDistance(target.pt),
          }
        })
        return list
      })
      return distanceList
    },
    neighborsBlack(): { p0: Point; p1: Point; distance: number }[] {
      return this.distanceBlack.reduce(
        (
          acc: { p0: Point; p1: Point; distance: number }[],
          distanceList,
          i
        ) => {
          const list = distanceList.filter(
            ({ distance }) => 1 < distance && distance <= 5
          )

          return [
            ...acc,
            ...list.map((item) => {
              return {
                p0: this.turnsBlack[i].pt,
                p1: this.turnsBlack[item.index].pt,
                distance: item.distance,
              }
            }),
          ]
        },
        []
      )
    },
    turnsWhite(): KifuTurn[] {
      return this.turns
        .slice(0, this.turnIndex)
        .filter(({ type }) => type === 'W')
    },
    distanceWhite(): { index: number; distance: number }[][] {
      const distanceList = this.turnsWhite.map((turn, i, array) => {
        const list = array.slice(i + 1).map((target, j) => {
          return {
            index: i + j + 1,
            distance: turn.pt.getDistance(target.pt),
          }
        })
        return list
      })
      return distanceList
    },
    neighborsWhite(): { p0: Point; p1: Point; distance: number }[] {
      return this.distanceWhite.reduce(
        (
          acc: { p0: Point; p1: Point; distance: number }[],
          distanceList,
          i
        ) => {
          const list = distanceList.filter(
            ({ distance }) => 1 < distance && distance <= 5
          )

          return [
            ...acc,
            ...list.map((item) => {
              return {
                p0: this.turnsWhite[i].pt,
                p1: this.turnsWhite[item.index].pt,
                distance: item.distance,
              }
            }),
          ]
        },
        []
      )
    },
  },
  watch: {
    selectedKifu: {
      immediate: true,
      handler(val: Kifu) {
        this.turns = val.turns
        this.turnIndex = val.turns.length - 1
      },
    },
  },
  methods: {
    check() {
      // eslint-disable-next-line no-console
      console.log(this.neighborsBlack)
    },
  },
})
</script>

<style scoped lang="scss">
.control {
  display: flex;
  flex-direction: row;
}
.board {
  background: rgb(218, 163, 75);
}
.lines {
  position: relative;
  width: 720px;
  height: 720px;

  .lineH,
  .lineV {
    position: absolute;
    background: #000;
  }

  .lineV {
    width: 1px;
    height: 100%;
  }
  .lineH {
    height: 1px;
    width: 100%;
  }
}

.useFilter {
  .stoneContainerContainer {
    filter: url(#colormatrix);
  }
  .stoneContainer {
    filter: url(#blur);
  }
}
.stone {
  position: absolute;
  // border: 1px solid #000;
  border-radius: 100%;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
