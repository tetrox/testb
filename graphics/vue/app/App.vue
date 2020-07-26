<template lang="pug">
div#app
  div#blackScreen(:class="bsClass")
    #bs-one
    #bs-two
    img.logo(src="img/dmlogo.png")
    img.logo.sub(src="img/dmlogo-sub.png")
  router-view
</template>

<script>
export default {
  data() {
    return {
      bg_img: 'GB.JPG',
      msg: 'Hello Vueify',
      blackScreen: false,
      reps: {
        currentScreen: nodecg.Replicant('currentScreen'),
      },
    };
  },
  computed: {
    bsClass() {
      return { showed: this.blackScreen };
    },
  },
  mounted() {
    NodeCG.waitForReplicants(this.reps.currentScreen).then(() => {
      this.reps.currentScreen.on('change', (newVal, oldVal) => {
        if (this.$route.path !== `/${newVal.screen}` && (!oldVal || newVal.screen !== oldVal.screen)) {
          this.$router.push(`/${newVal.screen}`);
        }
      });
    });
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      this.blackScreen = true;
      setTimeout(() => { this.blackScreen = false; }, 2000);
      setTimeout(() => { next(); }, 1300);
    });
  },
};
</script>
<style lang="sass">
$--screen-width: 1920px
$--screen-height: 1080px

@font-face
  font-family: 'PFSans'
  src: url("fonts/PFBeauSansPro/PFBeauSansPro-Bold.ttf") format("truetype")
  font-weight: bold
  font-style: normal

@font-face
  font-family: 'PFSansn'
  src: url("fonts/PFBeauSansPro/PFBeauSansPro-Reg.ttf") format("truetype")
  font-weight: normal
  font-style: normal

@font-face
  font-family: 'PFSans'
  src: url("fonts/PFBeauSansPro/PFBeauSansPro-Light.ttf") format("truetype")
  font-weight: lighter
  font-style: normal

@font-face
  font-family: 'Bandera'
  src: url("fonts/BanderaPro/BanderaPro.otf") format("opentype")
  font-weight: normal
  font-style: normal

@font-face
  font-family: 'Bandera'
  src: url("fonts/BanderaPro/BanderaPro-Bold.otf") format("opentype")
  font-weight: bold
  font-style: normal

@font-face
  font-family: 'RobotoC'
  src: url("fonts/Roboto_Condensed/RobotoCondensed-Bold.ttf") format("truetype")
  font-weight: bold
  font-style: normal

@font-face
  font-family: 'RobotoC'
  src: url("fonts/Roboto_Condensed/RobotoCondensed-Regular.ttf") format("truetype")
  font-weight: normal
  font-style: normal

@font-face
  font-family: 'RED'
  src: url("fonts/RED.ttf") format("truetype")
  font-weight: normal
  font-style: normal

@font-face
  font-family: 'DIN'
  src: url("fonts/DIN-Condensed-Bold.ttf") format("truetype")
  src: url("fonts/DINPro-Bold.ttf") format("truetype")
  font-weight: normal
  font-style: normal

@font-face
  font-family: 'E2B'
  src: url("fonts/Exo2Bold.otf") format("opentype")
  font-weight: normal
  font-style: normal

body
  margin: 0
  font-family: "E2B", monospace, serif

#app
  float: left
  width: $--screen-width
  height: $--screen-height
  position: relative
  overflow: hidden

#empty
  width: $--screen-width
  height: $--screen-height
  background-color: #000
  opacity: 0

#blackScreen
  width: 1920px
  height: 1080px
  z-index: 1000
  background: #000
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
  opacity: 0
  transition:  opacity 1s

  .logo
    position: relative
    z-index: 5
    padding: 0px
  &.showed
    opacity: 1

#bs-one, #bs-two
  width: $--screen-width
  height: $--screen-height
  background-position: 0px 0px
  background-image: url(img/bg-repeat.png)
  background-repeat: repeat
  position: absolute
  background-size: 235px

#bs-one
  animation: bg-one 60s infinite
#bs-two
  background-position: 117px 112px
  animation: bg-two 60s infinite

@keyframes bg-one
  0%
    background-position-x: 0px
  100%
    background-position-x: 235px

@keyframes bg-two
  0%
    background-position-x: 117px
  100%
    background-position-x: -1px
</style>
