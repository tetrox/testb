<template lang="pug">
div#bracket(v-bind:style='bgPath')
    //- .bracket-text {{ bgPath }}
    template(v-for="(match, idx) of top")
        .one(:class='match.text + " ph" + idx')
            .first
                .n {{ match.oneName }}
                .c
                    span(v-if='match.oneName != "" && match.twoName != ""') {{ match.oneCount }}
            .second
                .n {{ match.twoName }}
                .c
                    span(v-if='match.oneName != "" && match.twoName != ""') {{ match.twoCount }}
</template>

<script>
export default {
  name: 'Bracket',
  props: [],
  data() {
    return {
      games: {
        GG: 'GG',
        MK: 'MK',
        SF: 'SF',
        T7: 'TK',
        UN: 'UN',
      },
    };
  },
  computed: {
    top() {
      return this.$store.state.top8;
    },
    bgPath() {
      let name = this.games[this.$store.state.game] || 'BL';
      name = `WR2019 Brackets ${name}.jpg`;
      return { backgroundImage: `url('img/${name}')` };
    },
  },
  watch: {
  },
  mounted() {
  },
  template: '<Bracket/>',
};
// Color:202a3a
</script>

<style lang="sass" scoped>
#bracket
    position: absolute
    z-index: -1
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-image: url(img/bracket-full.jpg)
    padding: 0px 55px

    .bracket-text
        margin-top: 20px
        width: 100%
        color: #ff9118
        font-size: 90px
        letter-spacing: 5px
        text-align: center
        opacity: .8

    .one
        width: 405px
        height: 100px
        font-size: 36px
        line-height: 1.5
        display: flex
        flex-direction: column
        justify-content: space-between
        position: absolute

        div
            display: inline-block
            float: left

        .first, .second
            width: 415px
            display: flex
            justify-content: space-between

        .n
            color: #202A3A
            width: 324px
            max-height: 42px
            opacity: 0.9
            padding: 0 16px
            text-align: left
            overflow: hidden
            letter-spacing: 2.5px

        .c
            font-size: 40px
            margin-top: -3px
            color: #fff
            text-align: center
            width: 70px
            font-weight: bold
            letter-spacing: .21px
        .second .c
            margin-top: -7px

        &.GFR
            display: none

        &.ph0
            top: 115px

        &.ph1
            top: 322px

        &.ph2
            top: 217px
            left: 525px

        &.ph3
            top: 219px
            left: 995px

        &.ph5
            top: 655px

        &.ph6
            top: 863px

        &.ph7
            top: 655px
            left: 525px

        &.ph8
            top: 863px
            left: 525px

        &.ph9
            top: 758px
            left: 995px

        &.ph10
            top: 758px
            left: 1465px
</style>
