<template lang="pug">
#app
  b-row
    b-col(cols='3')
      div.text
        span ID турнира
    b-col(cols='6')
      b-input(:value='Tid' @input='changeId')
    b-col(cols='3')
      b-button(variant='danger' @click='pullList(); clearPhase();')
        div(v-if='isLoad.main')
          b-spinner(small)
          span Downloading...
        span(v-else) Download
  div.tours-cont
    b-button.tours(v-for='el,index in gitTopList' variant='warning' @click='showPhase(index)')
      span(v-html='el.evtName + " " +el.phaseName')
  b-row
    b-col
      div.text
        span Фильтр по имени:
    b-col
      b-input.filter(v-model='inpSearch')

  .cards
    b-card(v-for='card in setsSearch')
      b-card-text(v-html='card.oneName')
      b-card-text(v-html='card.twoName')
      b-card-text(v-html='card.text + "-" + card.round + "-" + card.state')
      b-button.crd(
        v-if='card.oneName && card.twoName'
        variant='success'
        @click='toFight(card.oneName, card.twoName)'
      ) Fight!
      b-button.crd(
        v-if='card.oneName && card.twoName'
        variant='info'
        @click='toFight(card.twoName, card.oneName)'
      ) Swap & fight!
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      inpSearch: '',
      sets: {
        all: [],
        clear: [],
        top: [],
      },
    };
  },
  computed: {
    ...mapGetters({
      Tid: 'getID',
      isLoad: 'isLoad',
      tours: 'getTours',
      getList: 'getList',

    }),
    gitTopList() {
      const res = [];
      for (const k in this.getList.filter) {
        if (this.getList.filter[k].phaseName === 'Top-8') {
          res.push(this.getList.filter[k]);
        }
      }
      return res;
    },
    setsSearch() {
      // let res = this.sets.clear;
      let res = this.sets.top;
      let src = this.inpSearch;
      if (src !== '') {
        src = src.toLowerCase();
        res = res.filter((el) => {
          const one = el.oneName.toLowerCase().indexOf(src) !== -1;
          const two = el.twoName.toLowerCase().indexOf(src) !== -1;

          return one || two;
        });
      }
      return res;
    },

  },
  methods: {
    ...mapActions({
      changeId: 'setID',
      pullList: 'pullList',
      setPlayersRep: 'setPlayersRep',
      setTop: 'setTop',
    }),
    toFight(one, two) {
      this.setPlayersRep([{ name: one, count: '0' }, { name: two, count: '0' }]);
    },
    clearPhase() {
      this.sets.top = [];
    },
    showPhase(index) {
      const rawSets = this.gitTopList[index].phaseData.data.entities.sets;
      const rawEnts = this.gitTopList[index].phaseData.data.entities.entrants;
      let pl1; let pl2; let p1n; let p2n; let item;

      let set = {};
      const allSets = [];
      const clearSets = [];
      const topSets = [];
      let GFround = 0;
      let counter = 0;

      for (const k in rawSets) {
        if (rawSets[k].shortRoundText == 'GF') { // eslint-disable-line eqeqeq
          GFround = rawSets[k].round;
        }
      }

      for (const k in rawSets) {
        if (typeof rawSets[k] !== 'undefined') {
          item = rawSets[k];

          pl1 = null;
          pl2 = null;
          for (const e in rawEnts) {
            if (typeof rawEnts[e] !== 'undefined') {
              if (rawEnts[e].id == item.entrant1Id) { // eslint-disable-line eqeqeq
                pl1 = rawEnts[e].name; // eslint-disable-line eqeqeq
              }
              if (rawEnts[e].id == item.entrant2Id) { // eslint-disable-line eqeqeq
                pl2 = rawEnts[e].name; // eslint-disable-line eqeqeq
              }
            }
          }
          p1n = pl1 !== null ? pl1 : '';
          p2n = pl2 !== null ? pl2 : '';

          rawSets[k].p1n = p1n;
          rawSets[k].p2n = p2n;

          rawSets[k].p1s = item.entrant1Score || 0;
          rawSets[k].p2s = item.entrant2Score || 0;

          set = {
            id: item.id,
            oneName: p1n,
            twoName: p2n,
            oneCount: rawSets[k].p1s,
            twoCount: rawSets[k].p2s,
            text: item.shortRoundText,
            ident: item.identifier,
            state: item.state,
            round: item.round,
          };

          if (item.entrant1Id !== null
            && item.entrant1Id == parseInt(item.entrant1Id, 10) // eslint-disable-line eqeqeq
            && item.entrant2Id !== null
            && item.entrant2Id == parseInt(item.entrant2Id, 10) // eslint-disable-line eqeqeq
            /* && item.completedAt == null */
          ) {
            clearSets.push(set);
          }
          if (GFround !== false
              && (item.round >= GFround - 3 || item.round <= (-1 * GFround) + 2)) {
            if (counter < 8 && item.shortRoundText === 'L1') {
              counter += 1;
            } else {
              topSets.push(set);
            }
          }
          allSets.push(set);
        }
      }

      // this.sets.all = allSets;
      // this.sets.clear = clearSets;
      this.sets.top = topSets;
      this.setTop(topSets);
    },
  },

};
</script>

<style lang="sass">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

body
    background-color: #2f3a4f

#app
  margin: 10px 10px 0

.labl
  color: #fff

.tours-cont, .cards
  text-align: center

.card
  float: left
  margin: 10px
  padding: 0 10px
  width: 255px

.card-body
  padding: 5px 0 0 0

button
  width: 100%
  &.upd-current
    float: left
    width: 200px
    margin-left: 10px
  &.tours, &.crd
    display: inline-block
    width: auto
    margin: 10px 10px

  &.tours
    max-width: 32%
    max-height: 36px
    overflow: hidden
  &.crd
    margin-top: 0

  span
    margin: 0 5px
.text
  margin-top: 5px
  color: #fff
  text-align: right

.filter
  margin-right: 13px
  display: inline-block
  float: right
</style>
