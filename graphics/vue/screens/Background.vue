<template lang="pug">
	div#bgimg(v-bind:style="{ backgroundImage: 'url(img/mock/' + bgImg + ')' }")
</template>

<script>
export default {
  name: 'Background',
  props: {
    	bgImg: {
    		type: String,
    		default: 'GB',
    	},
  },
  data() {
    	return {
    		blank: true,
    	};
  },
  template: '<Background/>',
};
</script>
<style lang="sass">
#bgimg
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-position: center
    background-size: 100% auto
    z-index: -1
</style>
