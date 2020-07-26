<template lang="pug">
	div#nextBattle(v-bind:time="nbd.timestamp")
		div.players_data
			span#nbP1 {{nbd.oneName}}
			span#nbVS VS
			span#nbP2 {{nbd.twoName}}
		//- <svg  xmlns="http://www.w3.org/2000/svg" class="bgarr">
		//- 	<use xlink:href="#arr"></use>
		//- </svg>
</template>

<script>
export default {
  name: 'NextBattle',
  props: ['nbd'],
  watch: {
    nbd(newVal, oldVal) { this.showNextBattle(newVal); },
  },
  template: '<NextBattle/>',
};
</script>
<style lang="sass" scoped>
#nextBattle
	position: absolute
	height: 100px
	text-align: center
	width: 320px
	height: 300px
	background-position: 0 0
	background-color: #00b
	font-size: 20px
	top: -900px
	left: 50%
	margin-left: -150px
	overflow: hidden
	background: url(img/bgImg/buster.png) no-repeat
	z-index: 8
	&.stand2
		background-position: -320px 0
	&.stand3
		background-position: -640px 0

	.players_data
		margin-top: 28px
		span
			color: #000
			font-family: "Capture", monospace
			font-size: 15px
			width: 120px
			display: inline-block
			overflow: hidden
			letter-spacing: 2px
			text-shadow: 2px 2px 2px rgba(255,255,255,255.6)
			&#nbVS
				padding: 0px 5px
				color: #d70
				width: auto
				font-size: 15px

#nextBattle.stand3 .players_data
	margin-top: 68px
</style>
