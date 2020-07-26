<template lang="pug">
#players-list.list
  el-scrollbar(:native="false" wrap-class="list")
    el-row(v-for=" (player,i) in listPlayers" :key="10*i+player.rate")
      el-col(:span="8")
        el-input(v-model="changedVals[player.id].name" @change="setChangedName(player.id)")
      el-col(:span="8")
        el-slider(
          v-model="changedVals[player.id].rate"
          :min="1" :max="5"
          :show-tooltip="false"
          @change="setChangeRate(player.id)"
          show-stops
        )
      el-col(:span="4")
        el-button(type="danger" @click="toFight(player.changedName, 0)") P1
      el-col(:span="4")
        el-button(type="success" @click="toFight(player.changedName, 1)") P2
    //- el-row(:ref="'out'") {{ changedVals }}
</template>

<script>
export default {
  data() {
    return {
      reps: {
        players: null,
        toFight: null
      },
      rawPlayers: [],
      aaa: [],
      changedVals:{}
    }
  },
  computed: {
    listPlayers() {
      this.aaa.push(1);
      return this.rawPlayers.sort((a,b) => {
        return b.rate - a.rate;
      });
    }
  },
  methods: {
    setChangeRate(id) {
      console.log(id);
      let pls = this.reps.players.value;
      for (const i in pls) {
        if (pls[i].id === id) {
          console.log(this.changedVals[id]);
          pls[i].rate = this.changedVals[id].rate;
        }
      }
    },
    toFight(name, num) {
      this.reps.toFight.value[num] = {
        name,
        count: '0'
      };    
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
        nodecg.Replicant('challongePlayers'),
        nodecg.Replicant('playersToFight')
      ).then(() => {

        this.reps.players = nodecg.Replicant('challongePlayers');
        this.reps.toFight = nodecg.Replicant('playersToFight');
        
        this.reps.players.on('change', (newVal) => {
          if (this.rawPlayers !== newVal) {
            let res = [];
            let chng = {};
            for (const i in newVal) {
              res.push(newVal[i]);
              chng[newVal[i].id] = {
                name: newVal[i].changedName,
                rate: newVal[i].rate
              };
            }
            this.rawPlayers = res;
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
#players-list
  .el-col
    margin: 2px 0
    padding: 2px 0
    text-align: center
    background-color: $--frame-plate-color
  .el-button
    float: right
  .el-input
    input
      font-weight: bold
      color: #000
  .el-slider
    height: 40px
    padding: 0 20px
    &__button
      border-color: transparent
    &__bar
      background-color: $--color-primary
</style>
