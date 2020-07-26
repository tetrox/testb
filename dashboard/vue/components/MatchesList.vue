<template lang="pug">
#matches-list.list
  el-scrollbar(:native="false" wrap-class="list")
    el-row(v-for=" (match,i) in listMatches" :key="i")
      el-col.players-col(:span="8")
        p.name(v-html="getNameFromRaw(match.players[0])")
        p.name(v-html="getNameFromRaw(match.players[1])")
      el-col(:span="8")
        el-slider(
          v-model="changedVals[match.id].rate"
          :min="1" :max="5"
          :show-tooltip="false"
          @change="setChangeRate(match.id)"
          show-stops
        )
      el-col(:span="4")
        el-button(type="danger"
          @click="toFight(match.players, false)"
        )
          i.el-icon-back
          i.el-icon-right
      el-col(:span="4")
        el-button(type="success"
          @click="toFight(match.players, true)"
        )
          i.el-icon-right
          i.el-icon-back
</template>

<script>
export default {
  data() {
    return {
      reps: {
        matches: null,
        players: null,
        toFight: null
      },
      rawMatches: [],
      rawPlayers: {},
      aaa: [],
      changedVals:{}
    }
  },
  computed: {
    listMatches() {
      return this.rawMatches.sort((a,b) => {
        // Убираем вниз отыгранные матчи
        // И убираем вниз матчи без игроков
        return (b.rate 
            - ((b.score[0] + b.score[1])) 
            - ((b.players[0] ? 0 : 1) + (b.players[1] ? 0 : 1))
          )
          - (a.rate 
            - ((a.score[0] + a.score[1]))
            - ((a.players[0] ? 0 : 1) + (a.players[1] ? 0 : 1))
          );
      });
    }
  },
  methods: {
    getNameFromRaw(id) {
      return (typeof this.rawPlayers[id] === 'undefined') ? '&mdash;' : this.rawPlayers[id].name;
    },
    setChangeRate(id) {
      let pls = this.reps.matches.value;
      for (const i in pls) {
        if (pls[i].id === id) {
          pls[i].rate = this.changedVals[id].rate;
        }
      }
    },
    toFight(players, revert) {
      const list = this.rawPlayers;
      let res = [];
      res.push({
      	name: list[players[revert ? 1 : 0]].name,
        count: '0'
      });
      res.push({
        name: list[players[revert ? 0 : 1]].name,
        count: '0'
      });
      this.reps.toFight.value = res;    
    },
    setChangedName(id) {
      let pls = this.reps.players.value;
      for (const i in pls) {
        if (pls[i].id === id) {
          pls[i].changedName = this.changedVals[id].name;
        }
      }
    }
  },
  mounted() {
    if (typeof NodeCG !== 'undefined') {
      NodeCG.waitForReplicants(
        nodecg.Replicant('challongeMatches'),
        nodecg.Replicant('challongePlayers'),
        nodecg.Replicant('playersToFight')
      ).then(() => {

        this.reps.matches = nodecg.Replicant('challongeMatches');
        this.reps.players = nodecg.Replicant('challongePlayers');
        this.reps.toFight = nodecg.Replicant('playersToFight');
        
        this.reps.players.on('change', (newVal) => { //oodVal if
          for (const i in newVal) {
            this.rawPlayers[newVal[i].id] = {
              name: newVal[i].changedName
            };
          } 
        });
        this.reps.matches.on('change', (newVal) => {
          if (this.rawMatches !== newVal) {
            let res = [];
            let chng = {};
            for (const i in newVal) {
              res.push(newVal[i]);
              chng[newVal[i].id] = {
                players: [newVal[i].players[0], newVal[i].players[1]],
                rate: newVal[i].rate
              };
            }
            this.rawMatches = res;
            this.changedVals = chng;
          }
        });
      });
      
    }
  }
}

</script>

<style lang="sass">
@import '../ncg-theme/settings.sass'

#matches-list
  .el-col
    margin: 2px 0
    padding: 2px 0
    text-align: center
    background-color: $--frame-plate-color
    min-height: 55px
    display: flex
    justify-content: center
    align-items: center
    &.players-col
      flex-direction: column
  .el-button
    float: right
    height: 51px
  p.name
    margin: .2em
  .el-slider
    height: 40px
    width: calc(100% - 40px)
    padding: 0 20px
    &__button
      border-color: transparent
    &__bar
      background-color: $--color-info
</style>
