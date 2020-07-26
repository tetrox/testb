<template lang="pug">
#challonge
  el-row
    el-col(:span="18")
      el-input.url(v-model="urlModel" @change="updateUrl")
        template(slot="prepend") P1
    el-col(:span="6")
      el-button(@click="syncChallonge" type="warning") Get data
  el-row
    el-col(:span="8")
      el-button.control(
        @click="isPlayers=!isPlayers"
        :type="isPlayers ? 'info' : 'primary'"
      ) {{ 'To ' + changeMenu[isPlayers ? 0 : 1] }}
    el-col(:span="2") &nbsp;
    el-col.flexed(:span="2")
      i.el-icon-refresh-right
    el-col.flexed(:span="2")
      el-switch(
        v-model="autoUpdate"
        @change="changeAutoUpdate"
      )
    el-col(:span="2") &nbsp;
    el-col(:span="8")
      el-button.control(@click="resetCustomData()" type="danger") Reset
  el-row
    el-col
      component(:is='changeMenu[isPlayers ? 1 : 0] + "-list"')
   
</template>

<script>
import playersList from '@/components/PlayersList'
import matchesList from '@/components/MatchesList'
export default {
  components: {
  	playersList,
    matchesList
  },
  data() {
  	return {
  	  reps: {
  	    settings: null,
  	    players: null,
  	    matches: null
  	  },
  	  aaa: '5',
      changeMenu: ['matches', 'players'],
      urlModel: '',
      autoUpdate: false,
  	  isPlayers: true
  	}
  },
  methods: {
  	syncChallonge() {
      nodecg.sendMessage('challongeUpdateMatches');
      nodecg.sendMessage('challongeUpdatePlayers');
  	},
    changeAutoUpdate() {
      this.reps.settings.value.autoUpdate = this.autoUpdate;
    },
    updateUrl() {
      this.reps.settings.value.url = this.urlModel;
    },
  	resetCustomData() {
  	  let fresh = [];
      let pls = this.reps.players.value;
      let mch = this.reps.matches.value;
      if(this.isPlayers) {
        for (const i in pls) {
          fresh.push({
          	id: pls[i].id,
          	name: pls[i].name,
          	changedName: pls[i].name,
          	rate: 3
          });
        }
        this.reps.players.value = fresh;	
      }
  	}
  },
  mounted() {
  	if (typeof NodeCG !== 'undefined') {
      NodeCG.waitForReplicants(
        nodecg.Replicant('challongeMatches'),
        nodecg.Replicant('challongePlayers'),
        nodecg.Replicant('challongeSettings'),
  	  ).then(() => {
        this.reps.matches = nodecg.Replicant('challongeMatches');
        this.reps.players = nodecg.Replicant('challongePlayers');
        this.reps.settings = nodecg.Replicant('challongeSettings');

        this.reps.settings.on('change', (newVal, oldVal) => {
          if (newVal !== oldVal) {
            this.urlModel = this.reps.settings.value.url;
            this.autoUpdate = this.reps.settings.value.autoUpdate;
          }
        });
      });
    }
  }
}
</script>

<style lang="sass">
@import '../ncg-theme/settings.sass'
#challonge
  .list
    margin-right: -10px
    .el-row
      margin-right: 10px
    .el-scrollbar__thumb
      border-radius: 0
      background-color: $--frame-plate-color
  .el-button
    width: 100%
  .control
    margin: 4px 0 2px

  .list
    max-height: 400px
    // &::-webkit-scrollbar 
    //   display: none
  .switch
    display: flex
    justify-content: space-between
    align-items: center
  .el-icon-refresh-right
    margin-right: 10px
    font-size: 1.3em
  .flexed
    min-height: 40px
    display: flex
    align-items: center
    justify-content: center
    padding-top: 10px
</style>
