<template lang="pug">
#palyers(:class='hidden ? "hidden" : ""')
    .text
        .left {{ curr[0].name }}
        .right {{ curr[1].name }}

</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    	return {
      hidden: true,
    		refNum: 0,
      refHide: false,
      inter: null,
    	};
  },
  computed: {
    ...mapGetters({
      curr: 'getCurrentFight',
    }),
    text() {
      return this.$store.state.bracketText;
    },
    logoimg() {
      return { 'background-image': 'url(img/Players.png)' };
    },
  },
  name: 'Players',
  mounted() {
  },
  beforeDestroy() {
  },
  template: '<Players/>',
};
</script>
<style lang="sass" scoped>
#palyers
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: -1
    background-image: url('img/Players.png')

    .text
        margin-top: 205px
        font-size: 50px
        color: #fff
        letter-spacing: 4px
        display: flex
        justify-content: space-between
        padding: 0 30px

</style>
