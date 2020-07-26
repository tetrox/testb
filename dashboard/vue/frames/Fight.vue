<template lang="pug">
#fight
  el-row.player-plate
    el-col(:md='13' :sm='13' :xs='24')
      el-input(
        :value='players[0].name'
        @input='changePlOne'
      )
        template(slot='prepend') P1
    el-col(:span='1' :xs='0') &nbsp;
    el-col(:md='10' :sm='10' :xs='24')
      el-input.count(
        :value='players[0].count'
        @input='changeCnOne'
      )
        template(slot='prepend')
          el-button(@click="minusCnOne") -
        template(slot='append')
          el-button(@click="plusCnOne") +
  el-row.player-plate
    el-col(:md='13' :sm='13' :xs='24')
      el-input(
        :value='players[1].name'
        @input='changePlTwo'
      )
        template(slot='prepend') P2
    el-col(:span='1' :xs='0') &nbsp;
    el-col(:md='10' :sm='10' :xs='24')
      el-input.count(
        :value='players[1].count'
        @input='changeCnTwo'
      )
        template(slot='prepend')
          el-button(@click="minusCnTwo") -
        template(slot='append')
          el-button(@click="plusCnTwo") +

  .foot
    el-row.buttons(type="flex" justify="space-between")
      el-col(:span='7')
        el-button(type="danger" @click='clearEv') CLEAR
      el-col(:span='7' )
        el-button(type="success" @click='updateEv') UPDATE
      el-col(:span='7')
        el-button(type="warning" @click='swapEv') SWAP

  el-row.status(type="flex" justify="space-between" :class='statusStyle')
    el-col.status-plate(:span='7')
      .first
        i(:class='isUpdated[0].name ? "el-icon-check" : "el-icon-edit"')
        .brd
      .first
        i(:class='isUpdated[0].count ? "el-icon-check" : "el-icon-edit"')

    el-col.status-plate(:span='7')
      .second
        i(:class='isUpdated[1].name ? "el-icon-check" : "el-icon-edit"')
        .brd
      .second
        i(:class='isUpdated[1].count ? "el-icon-check" : "el-icon-edit"')

    el-col.status-plate(:span='7')
      .all
        .bar(:style='"width:" + prog + "%"' :class='{ is100: prog >= 100 }')
        i(:class='prog === 100 ? "el-icon-check" : "el-icon-loading"')

</template>

<script>
export default {
  data() {
    return {
      prog: 100,
      timer: null,
      players: [{}, {}],
      isUpdated: [{ name: true, count: true }, { name: true, count: true }],
      aa: {},
      reps: {
        players: null,
      },
    };
  },
  computed: {
    statusStyle() {
      const hidden = this.isUpdated[0].name
        * this.isUpdated[0].count
        * this.isUpdated[1].name
        * this.isUpdated[1].count;
      return { hidden };
    },
  },
  mounted() {
    if (typeof NodeCG !== 'undefined') {
      NodeCG.waitForReplicants(nodecg.Replicant('playersToFight')).then(() => {
        this.reps.players = nodecg.Replicant('playersToFight');
        this.reps.players.on('change', (newVal) => {
          if (typeof this.players[0].name === 'undefined') {
            this.players = [{ name: '', count: '' }, { name: '', count: '' }];
          } else {
            this.isUpdated = [
              {
                name: newVal[0].name === this.players[0].name,
                count: newVal[0].count === this.players[0].count,
              },
              {
                name: newVal[1].name === this.players[1].name,
                count: newVal[1].count === this.players[1].count,
              },
            ];
          }
          if (this.players !== newVal) {
            this.players[0].name = newVal[0].name;
            this.players[0].count = newVal[0].count;
            this.players[1].name = newVal[1].name;
            this.players[1].count = newVal[1].count;
          }
          this.isUpdated = [{ name: true, count: true }, { name: true, count: true }];
        });
      });
    }
  },
  methods: {
    changePlOne(value) {
      this.players[0].name = value;
      this.setTimer(0, 'name');
    },
    changeCnOne(value) {
      this.players[0].count = value;
      this.setTimer(0, 'count');
    },
    minusCnOne() {
      let val = parseInt(this.players[0].count, 10);
      val = Number.isNaN(val) ? 0 : val - 1;
      this.changeCnOne(`${val}`);
    },
    plusCnOne() {
      let val = parseInt(this.players[0].count, 10);
      val = Number.isNaN(val) ? 0 : val + 1;
      this.changeCnOne(`${val}`);
    },
    changePlTwo(value) {
      this.players[1].name = value;
      this.setTimer(1, 'name');
    },
    changeCnTwo(value) {
      this.players[1].count = value;
      this.setTimer(1, 'count');
    },
    minusCnTwo() {
      let val = parseInt(this.players[1].count, 10);
      val = Number.isNaN(val) ? 0 : val - 1;
      this.changeCnTwo(`${val}`);
    },
    plusCnTwo() {
      let val = parseInt(this.players[1].count, 10);
      val = Number.isNaN(val) ? 0 : val + 1;
      this.changeCnTwo(`${val}`);
    },
    commitPlayers() {
      this.reps.players.value = this.players;
    },
    setTimer(i, type) {
      this.isUpdated[i][type] = false;
      this.prog = 0;
      if (this.timer !== null) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        if (this.prog === 100) {
          clearInterval(this.timer);
          this.commitPlayers();
        } else {
          this.prog += 1;
        }
      }, 50);
      return true;
    },

    updateEv() {
      this.prog = 100;
    },
    clearEv() {
      this.players = [{ name: '', count: '0' }, { name: '', count: '0' }];
      this.commitPlayers();
    },
    swapEv() {
      const first = this.players[0];
      const second = this.players[1];
      this.players[0] = second;
      this.players[1] = first;
      if (this.prog < 100) {
        this.prog = 100;
      } else {
        this.commitPlayers();
      }
    },
  },

};
</script>

<style lang="sass">
@import '../ncg-theme/settings.sass'

#fight
  i
    color: $--color-white

  .player-plate
    margin: -2px 0 8px 0

    .el-col
      margin-top: 2px

  .status
    margin: 0
    font-size: 8px
    height: 8px
    transition: height 1s
    overflow: hidden

    &.hidden
      height: 0

    .status-plate
      border-radius: $--border-radius-small
      display: flex
      & > div
        padding: 0
        flex: 1 0

    .brd
      width: 1px
      height: 4px
      margin: 2px 0
      background: $--background-color-base
      display: inline-block
      float: right

    .first
      background-color: $--color-danger

    .second
      background-color: $--color-success

    .all
      position: relative
      background-color: $--color-info
      .bar
        position: absolute
        top: 0
        bottom: 0
        background: $--color-warning
        transition: width .05s, opacity 1s

        &.is100
          opacity: 0
      i
        position: relative

  .buttons
    button
      width: 100%

  .el-input__inner
    padding: 0 10px

  .count
    .el-input__inner
      text-align: center
    .el-input-group
      &__prepend, &__append
        background: $--color-danger

  .el-input-group
    &__prepend, &__append
      border: 0
      .el-button
        background-color: $--color-danger
        color: #fff
        border: 0

  .status .el-col
    text-align: center
</style>
