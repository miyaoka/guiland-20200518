<template>
  <div>
    <h1>#月曜GUI</h1>
    <h2>棋譜ビューアやりたい</h2>

    <section class="control">
      <label>
        turn: {{ turn }}
        <input
          v-model.number="turnIndex"
          type="range"
          min="0"
          :max="turns.length"
          step="1"
        />
      </label>
    </section>

    <div class="board">
      <div class="lines">
        <div
          v-for="i in [...Array(19)].keys()"
          :key="i"
          class="lineV"
          :style="getLineStyleV(i)"
        ></div>
        <div
          v-for="i in [...Array(19)].keys()"
          :key="i"
          class="lineH"
          :style="getLineStyleH(i)"
        ></div>

        <div
          v-for="(item, i) in turns.slice(0, turnIndex)"
          :key="i"
          class="stone"
          :style="getStoneStyle(item)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { parseSgf } from '@/utils/kifuParser'

const kifuData = `(;GM[1]FF[4]SZ[19]PB[林立祥]BR[七段]PW[許皓鋐]WR[六段]KM[6.5]RE[W+R]DT[2020-05-18]GN[第10期友士杯十段戦挑戦手合五番勝負第4局];B[pd];W[dd];B[qp];W[dp];B[cq];W[dq];B[cp];W[do];B[bn];W[oq];B[po];W[lq];B[nc];W[fc];B[qi];W[md];B[nd];W[mf];B[cm];W[qd];B[qe];W[pe];B[re];W[pf];B[me];W[qh];B[rh];W[pi];B[qg];W[ph];B[qj];W[pj];B[pk];W[ok];B[rg];W[le];B[ne];W[nf];B[lf];W[ke];B[kc];W[pl];B[qk];W[nl];B[om];W[ol];B[rm];W[lb];B[lc];W[pc];B[od];W[mc];B[mb];W[ld];B[nb];W[kb];B[jc];W[jb];B[ic];W[ib];B[of];W[og];B[oe];W[jf];B[pg];W[ng];B[oh];W[nh];B[oj];W[oi];B[nj];W[ni];B[mj];W[li];B[lj];W[ll];B[ki];W[kj];B[kg];W[lh];B[ie];W[jg];B[ec];W[fd];B[gb];W[hc];B[fb];W[hd];B[ed];W[ee];B[dc];W[cc];B[cb];W[de];B[bc];W[cd];B[bb];W[jj];B[ff];W[id];B[je];W[jd];B[dg];W[fg];B[kq];W[kp];B[jq];W[lr];B[jp];W[ko];B[gq];W[cr];B[br];W[jo];B[ho];W[dm];B[dl];W[el];B[dn];W[en];B[em];W[fm];B[eo];W[dm];B[kf];W[kd];B[em];W[fn];B[fo];W[dm];B[cn];W[dk];B[cl];W[di];B[bg];W[eg];B[io];W[ck];B[be];W[in];B[hn];W[hm];B[dh];W[ei];B[pq];W[hq];B[hp];W[gr];B[fq];W[ir];B[fr];W[jr];B[gm];W[hl];B[gn];W[gl];B[or];W[nr];B[op];W[nq];B[ln];W[fs];B[es];W[gs];B[dr];W[kr];B[ip];W[mo];B[mn];W[qm];B[mm];W[ml];B[qn];W[kn];B[im];W[jn];B[lo];W[lp];B[pr];W[rl];B[ql];W[pm])`

type KifuTurn = readonly [string, number, number]

export default Vue.extend({
  data() {
    return {
      turnIndex: 0,
      turns: [] as KifuTurn[],
    }
  },
  mounted() {
    this.loadKifu(kifuData)
  },
  methods: {
    getStoneStyle(turn: KifuTurn) {
      const [bw, x, y] = turn
      return {
        left: `${(x - 0.5) * 20}px`,
        top: `${(y - 0.5) * 20}px`,
        background: bw === 'B' ? '#000' : '#fff',
      }
    },
    getLineStyleH(i: number) {
      return {
        left: 0,
        top: `${i * 20}px`,
      }
    },
    getLineStyleV(i: number) {
      return {
        top: 0,
        left: `${i * 20}px`,
      }
    },
    loadKifu(sgf: string) {
      const { turns } = parseSgf(sgf)
      this.turns = turns
    },
  },
})
</script>

<style scoped lang="scss">
.lines {
  position: relative;
  width: 360px;
  height: 360px;

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

.stone {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 1px solid #000;
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
