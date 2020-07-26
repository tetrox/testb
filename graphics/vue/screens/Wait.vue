aa<template lang="pug">
#waitscr(:class='hidden ? "hidden" : ""')
  #ws-bg-top
  #ws-bg-left
  #ws-bg-left-sc
  #ws-bg-right-sc
  #ws-bg-right
  #ws-bg-bottom
  #ws-bg-bottom-sc
  img#ws-logo(src="img/dmlogo.png")
  img#ws-logo2(src="img/dmlogo2.png")
  img#ws-logo3(src="img/dmlogo3.png")
  img#logo-sub(src="img/dmlogo-sub.png")

  #ws-text-bg
    p(v-html="dispWaitText")
  img#ws-border(src="img/wait-border.png")
  img#ws-shadows(src="img/wait-shadows.png")
  #streamers
    .lpart(:class="{speak: firstVoice.voiceStatus}")
      .plates(v-if="dispStreamers.one.name")
        h3 {{ dispStreamers.one.name }}
        p {{ dispStreamers.one.social }}
      img(v-if="firstVoice.avatarURL"
        :src="firstVoice.avatarURL"
        )
    .rpart(:class="{speak: secondVoice.voiceStatus}")
      img(v-if="secondVoice.avatarURL"
        :src="secondVoice.avatarURL"
        )
      .plates(v-if="dispStreamers.two.name")
        h3 {{ dispStreamers.two.name }}
        p {{ dispStreamers.two.social }}
</template>

<script>
export default {
  name: 'WaitScreen',
  data() {
    return {
      hidden: true,
      reps: {
        waitText: nodecg.Replicant('waitText'),
        streamers: nodecg.Replicant('streamers'),
        discordBot: nodecg.Replicant('discordVoice'),
      },
    };
  },
  computed: {
    voices() {
      const list = this.reps.discordBot.value;
      return list ? list.users : {};
    },
    dispWaitText() {
      let txt = '';
      const repText = this.reps.waitText.value;
      if (repText) {
        txt = repText.replace(/\n/gi, '<br>');
      }
      return txt;
    },
    dispStreamers() {
      const str = { one: {}, two: {} };
      const repStr = this.reps.streamers.value;
      if (typeof repStr !== 'undefined') {
        str.one.name = repStr.one.name;
        str.one.social = repStr.one.social;
        str.one.link = repStr.one.link;
        str.two.name = repStr.two.name;
        str.two.social = repStr.two.social;
        str.two.link = repStr.two.link;
      }
      return str;
    },
    firstVoice() {
      const { link } = this.dispStreamers.one;
      return link ? this.getVoiceData(link) : {};
    },
    secondVoice() {
      const { link } = this.dispStreamers.two;
      return link ? this.getVoiceData(link) : {};
    },
  },
  mounted() {
    setTimeout(() => { this.hidden = false; }, 1000);
  },
  methods: {
    getVoiceData(link) {
      let ret = {};
      const vc = this.voices;
      if (link !== '0' && vc && vc[link]) {
        ret = vc[link];
      }
      return ret;
    },
  },
  template: '<WaitScreen/>',
};
</script>

<style lang="sass">
$--screen-width: 1920px

#ws-bg-top, #ws-bg-left-sc, #ws-bg-right-sc, #ws-bg-bottom, #ws-bg-right, #ws-bg-left, #ws-bg-bottom-sc
  background-image: url(img/bg-repeat.png)
  background-repeat: repeat
  position: absolute
  background-size: 235px

#ws-bg-top
  width: $--screen-width
  height: 108px
  background-position: 0px -5px

#ws-bg-left, #ws-bg-left-sc
  width: 563px
  left: 0
  top: 108px
  height: 447px
  background-position: 0px 0px

#ws-bg-left
  background-position: 0px 112px

#ws-bg-right, #ws-bg-right-sc
  width: 563px
  right: 0
  top: 108px
  height: 447px
  background-position: 54px 0px

#ws-bg-right
  background-position: 54px 112px

#ws-bg-bottom, #ws-bg-bottom-sc
  width: $--screen-width
  bottom: 0
  height: 526px
  background-position: 0px 1px

#ws-bg-bottom
  background-position: 0px 113px

#ws-bg-top, #ws-bg-left, #ws-bg-left, #ws-bg-bottom
  animation: ws-one 60s infinite
  animation-timing-function: linear

#ws-bg-top-sc, #ws-bg-left-sc, #ws-bg-left-sc, #ws-bg-bottom-sc  
  animation: ws-two 60s infinite
  animation-timing-function: linear

#ws-bg-right
  animation: ws-right-one 60s infinite
  animation-timing-function: linear

#ws-bg-right-sc
  animation: ws-right-two 60s infinite
  animation-timing-function: linear


#waitscr
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-position: center
  background-size: 100% auto
  z-index: -1
  background-image: url(img/waitscreen.png)


  video
    position: absolute
    top: 0
    left: 0

  #ws-text-bg
    width: 1300px
    height: 200px
    margin: 850px auto
    display: flex
    justify-content: center
    align-items: center
    transition: opacity 1s 2s
    z-index: 10
    > p
      font-family: "E2B", monospace, serif
      font-size: 50px
      font-weight: bold
      font-style: normal
      line-height: normal
      letter-spacing: 1.17px
      text-align: center
      z-index: 10
      margin: 0
      color: #fff

  #streamers
    position: absolute
    display: flex
    z-index: 7
    top: 575px
    left: 0
    padding: 50px 110px
    width: 1700px
    transition: opacity 1s 2s
    justify-content: space-between
    .lpart, .rpart
      flex-basis: 40%
      justify-content: space-between
      color: #000
      position: relative
      max-width: 300px
      img
        position: absolute
        top: 0
        width: 130px
        border: 2px solid #ec52fe
        border-radius: 50%
        box-shadow: 0px 0px 3px 3px #ec52fe
        transition: box-shadow .5s
      .plates
        display: flex
        flex-direction: column
        justify-content: center
        height: 140px
        padding-top: 10px
        h3
          transition: box-shadow .5s
          background-color: #fff
          margin: 25px 0 0 0
          font-size: 32px
          text-align: center
          padding-bottom: 3px
          border-radius: 30px
          box-shadow: 0px 0px 5px 5px #ec52fe
        p
          background-color: transparent
          color: #fff
          margin: 10px  0
          font-size: 22px
          text-align: center
    
      &.speak
        h3, img
          box-shadow: 0px 0px 10px 7px #ec52fe

    .lpart
      margin: 0 300px 0 180px
      img
        right: 0
        margin-right: -105px
      // .plates
      //   h3
      //     box-shadow: 0px 0px 20px 7px #00eaff

    .rpart
      margin: 0 180px 0 300px
      img
        left: 0
        margin-left: -105px
  #ws-logo, #ws-logo2, #ws-logo3
    position: absolute
    bottom: 270px
    left: 767px
    animation: ws-logo 40s infinite
    animation-timing-function: cubic-bezier(0, 1, 0, 1)

  #ws-logo
    left: 768px

  #ws-logo2
    opacity: 0
    animation: ws-logo2 40s infinite
    animation-timing-function: cubic-bezier(0, 1, 0, 1)

  #ws-logo3
    opacity: 0
    animation: ws-logo3 40s infinite
    animation-timing-function: cubic-bezier(0, 1, 0, 1)

  #logo-sub
    position: absolute
    bottom: 220px
    left: 733px

  #ws-border
    position: absolute
    top: 86px
    left: 527px

  #ws-shadows
    position: absolute
    top: 85px
    left: 220px
    animation: ws-shadows 5s infinite


  &.hidden
    #ws-text-bg, #faces, #streamers
      opacity: 0


@keyframes ws-one
  0%
    background-position-x: 0px
  100%
    background-position-x: 235px

@keyframes ws-two
  0%
    background-position-x: 0px
  100%
    background-position-x: -235px

@keyframes ws-right-one
  0%
    background-position-x: 54px
  100%
    background-position-x: 289px

@keyframes ws-right-two
  0%
    background-position-x: 54px
  100%
    background-position-x: -181px

@keyframes ws-shadows
  0%
    opacity: 1
  50%
    opacity: .6
  100%
    opacity: 1


@keyframes ws-logo
  0%
    opacity: 1
  5%
    opacity: 1
  6.99%
    opacity: 0
  18.99%
    opacity: 0
  20%
    opacity: 1

@keyframes ws-logo2
  0%
    opacity: 0
  5%
    opacity: 0
  6%
    opacity: 1
  10.99%
    opacity: 1
  12%
    opacity: 0
  13%
    opacity: 0
  14%
    opacity: 1
  19%
    opacity: 1
  20%
    opacity: 0

@keyframes ws-logo3
  0%
    opacity: 0
  11%
    opacity: 0
  12%
    opacity: 1
  12.99%
    opacity: 1
  13%
    opacity: 0
  20%
    opacity: 0


// cubic-bezier(0, 1, 0, 1)

</style>
