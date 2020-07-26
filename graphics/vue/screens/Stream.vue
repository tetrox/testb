<template lang="pug">
div#streamers(:class='hidden ? "hidden" : ""')
    .bottom
        .lpart
            .bg
            h3 {{ sOne[0] }}
            p {{ sOne[1] }}
        .logo
            //- p {{ text }}
        .rpart
            .bg
            h3 {{ sTwo[0] }}
            p {{ sTwo[1] }}

</template>

<script>
export default {
  name: 'Stream',
  props: {
    	bg: {
    		type: String,
    		default: 'bgImg/waitText_bg.png',
    	},
  },
  data() {
    return {
      hidden: true,
      inter: null,
    };
  },
  computed: {
    streamers() {
      return this.$store.state.streamers;
    },
    text() {
      return this.$store.state.bracketText;
    },
    sOne() {
      return [this.streamers.one.name,
        this.streamers.one.social];
    },
    sTwo() {
      return [this.streamers.two.name,
        this.streamers.two.social];
    },
  },
  mounted() {
    setTimeout(() => {
      this.hidden = false;
    }, 1000);
  },
  template: '<Stream/>',
};
</script>

<style lang="sass" scoped>
#streamers
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: -1

    .bottom
        position: relative
        margin-top: 860px
        height: 220px
        width: 1920px
        text-align: center
        transition: margin 1s

        .lpart, .rpart
            position: relative
            width: 571px
            height: 94px
            display: inline-block
            margin-bottom: 16px
            transition: opacity .5s .8s

            h3
                position: absolute
                margin: 0px
                margin-left: 5px
                padding: 20px 65px 10px
                width: 415px
                color: #fff
                text-align: center
                font-size: 36px
                letter-spacing: 2px
            p
                position: absolute
                top: 43px
                margin: 0px
                padding: 20px 105px 10px
                width: 335px
                color: #202A3A
                text-align: center
                font-size: 25px
                letter-spacing: 1.8px

            .bg
                position: absolute
                top: 0
                left: 0
                right: 0
                bottom: 0
                background: url(img/commentator-left.png)

        .rpart
            h3, p
                margin: 0px
                margin-left: 30px
            .bg
                background-image: url(img/commentator-right.png)

        .logo
            width: 273px
            height: 273px
            margin: -20px 43px
            z-index: 3
            position: relative
            display: inline-block
            background: url(img/logo.png) center no-repeat
            transition: margin 1s .8s

            p
                margin: 0
                font-weight: bold
                letter-spacing: .22px
                font-size: 12px
                text-align: center
                padding-top: 197px

    &.hidden
        .left
            opacity: 0

        .bottom
            margin-top: 1180px
            .lpart, .rpart
                opacity: 0
            .logo
                margin: -40px -190px

</style>
