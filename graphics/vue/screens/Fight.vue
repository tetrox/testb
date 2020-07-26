<template lang="pug">
#fight(:class='hidden ? "hidden" : ""')
  #upper
    #left
      .lCont
        #n1(:style="firstNameTextStyle") {{ players.first[0] }}
      #c1
        .in {{ players.first[1] }}
    #right
      #c2
        .in {{ players.second[1] }}
      .rCont
        #n2(:style="secondNameTextStyle") {{ players.second[0] }}
  //- div#flogo(:class='"game-" + game')
  #center
    img#fight-bottom(src="img/fight-bottom.png")
    .cCont
      p(:style="footerTextStyle") {{ bottomText }}
</template>

<script>
export default {
  name: 'Fight',
  data() {
    return {
      hidden: true,
      reps: {
        playersToFight: nodecg.Replicant('playersToFight'),
        bracketText: nodecg.Replicant('bracketText'),
      },
      vals: {
        first: ['', ''],
        second: ['', ''],
      },
    };
  },
  computed: {
    players() {
      let first = ['', ''];
      let second = ['', ''];
      const source = this.reps.playersToFight;
      if (source.value) {
        first = [source.value[0].name, source.value[0].count];
        second = [source.value[1].name, source.value[1].count];
      }
      return { first, second };
      // return this.playersToFight
    },
    bottomText() {
      return this.reps.bracketText.value || '';
    },
    firstNameTextStyle() {
      return this.fontResizer(50, this.players.first[0], 2);
    },
    secondNameTextStyle() {
      return this.fontResizer(50, this.players.second[0], 2);
    },
    footerTextStyle() {
      return this.fontResizer(32, this.bottomText);
    },
  },
  mounted() {
    setTimeout(() => {
      this.hidden = false;
    }, 1000);
  },
  methods: {
    fontResizer(startSize, text, modifer = 1, limit = 7) {
      let size = startSize;
      if (text.length > limit) {
        size -= modifer * (text.length - limit);
      }
      size = size < 20 ? 20 : size;
      return { 'font-size': `${size}px` };
    },
  },
  template: '<Fight/>',
};
</script>

<style lang="sass" scoped>
@import '../css/vars'
#fight
  background-image: url(img/mock/GB.jpg)
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: -1
  #upper
    position: relative
    height: 100px
    width: 1920px
    display: flex
    justify-content: center
    align-items: start
    text-align: center
    div
      transition: margin 1s, opacity 1s, width 1s, height 1s

    #left, #right
      font-size: 45px
      height: 53px
      background: #fff
      line-height: 1.5
      color: #fff
      border: 5px solid #fff
      border-top: 0
      border-bottom: 2px solid #fff
      border-bottom-left-radius: 15px
      border-bottom-right-radius: 15px
      margin: 0 132px
      transform: skew(-32deg)
      display: flex
      box-shadow: 0px 0px 20px 6px #12d6df
    
    #left
      border-bottom-right-radius: 7px
    #right
      border-bottom-left-radius: 7px
      transform: skew(32deg)

    .lCont,.rCont
      height: 54px
      margin-top: -33px
      padding-top: 30px
      background: #003025
      border-bottom-left-radius: 10px
      border-bottom-right-radius: 10px
      box-shadow: inset 0px 0px 17px 2px #12d6df


    .lCont
      border-bottom-right-radius: 7px

    .rCont
      border-bottom-left-radius: 7px

    #n1, #c1
      transform: skew(32deg)
    #n2, #c2
      transform: skew(-32deg)

    #n1, #n2
      width: 375px
      height: 49px
      padding: 0
      display: flex
      align-items: center
      transition: opacity 1s 1s
      justify-content: center
      line-height: 1

    #c1, #c2
      width: 60px
      height: 49px
      padding: 0
      display: flex
      align-items: center
      justify-content: center
      transition: opacity 1s 2s, width 1s 1.5s

      background-color: #003025
      color: #fff
      transform: skew(0deg)
      padding-top: 30px
      margin: -30px 5px 0 0 
      border-bottom-left-radius: 6px
      border-bottom-right-radius: 10px
      padding-bottom: 2px
      box-shadow: inset 0px 0px 17px 2px #12d6df
      font-size: 35px

    #c1
      margin: -30px 0 0 5px
      border-bottom-left-radius: 10px
      border-bottom-right-radius: 6px
      .in
        transform: skew(32deg)
        margin-top: -4px
    
    #c2 .in
      transform: skew(-32deg)
      margin-top: -4px

  #center
    transition: margin 1s, opacity 1s, width 1s
    width: 1920px
    position: absolute
    bottom: 0
    display: flex
    justify-content: center
    #fight-bottom
      position: absolute
      z-index: 10
      width: 342px
      margin-top: -8px

    .cCont
      width: 230px
      height: 48px
      background: #014435
      border-top: 2px solid #fff
      position: relative
      display: flex
      align-items: center
      justify-content: space-around
      &:before, &:after
        z-index: -1
        content: ''
        width: 30px
        height: 70px
        background: #014435
        top: 0
        position: absolute
        border-top-left-radius: 4px
        border-top-right-radius: 4px
        box-shadow: 0px 2px 4px #fffa

      &:before
        left: -23px
        transform: rotate(30deg)
        border-left: 2px solid #fff

      &:after
        right: -23px
        transform: rotate(-30deg)
        border-right: 2px solid #fff

      p
        color: #fff
        margin: 0
        padding: 0 10px 5px
        font-size: 32px
        text-align: center
        line-height: 1
        // letter-spacing: 3px

  &.hidden
    #upper
      #left, #right
        margin-top: -5px
        box-shadow: none
      #left, #right, .lCont,.rCont
        height: 0
      #c1, #c2
        width: 0
        opacity: 0
      #n1, #n2
        opacity: 0
    #center
      margin-bottom: -80px
</style>
