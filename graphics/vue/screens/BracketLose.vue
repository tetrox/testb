<template lang="pug">
	div#bracket(v-bind:style="logoimg")
		div.lines
		//- p.txt(v-html="text")
		template(v-for="(set, idx) of top16")
			div.wncn.wis(v-bind:id="set.identifier")
				div.p1
					//- p.pl.wp(v-bind:class="{ww: set.winner == 1 }" style='opacity:0')
					p.pl.wp(style='opacity:0')
						b {{set.p1n}}
						span {{set.p1s}}
				div.p2
					//- p.pl.wp(v-bind:class="{ww: set.winner == 2 }" style='opacity:0')
					p.pl.wp(style='opacity:0')
						b {{set.p2n}}
						span {{set.p2s}}
</template>

<script>
import $ from 'jquery';

export default {
  name: 'Bracket',
  props: [],
  data() {
    	return {
    		// top: this.$store.state.top8
    	};
  },
  computed: {
    	top() {
      return this.$store.state.top8;
    },
    	top16() {
    		console.log('this.$store.state.top16');
    		console.log(this.$store.state.top16.value);
      return this.$store.state.top16.value;
    },
    text() {
      return this.$store.state.bracketText;
    },
    logoimg() {
      if (this.$store.state.game == 'GG') {
        return { 'background-image': 'url(img/WR_Brackets_LOOSERS_GG.jpg)' };
      }
      return { 'background-image': 'url(img/WR_Brackets_LOOSERS.jpg)' };
    },
  },
  watch: {
    top(newVal, oldVal) { console.log('newVal'); },
    top16(newVal, oldVal) { console.log('newVal11'); },
    // p1name: function (newVal, oldVal) { this.renderName('.p1 b', newVal);},
    // p2name: function (newVal, oldVal) { this.renderName('.p2 b', newVal);},
    // score1: function (newVal, oldVal) { this.renderScore('.p1 i', newVal);},
    // score2: function (newVal, oldVal) { this.renderScore('.p2 i', newVal);},
  },
  mounted() {
    setTimeout(() => {
      $('.wncn').css('background-size', '100% 0%');

      const tl = new TimelineMax();
      tl.to($('.wncn'), 0.6, { 'background-size': '100% 100%', ease: Expo.easeInOut })
        .to($('.pl'), 1.5, { opacity: 1, ease: Linear.easeNone });
    }, 4000);

    setTimeout(() => {
      $('.lines').fadeIn(1500);
    }, 3500);
  	},
  template: '<Bracket/>',
};
</script>

<style lang="sass" scoped>
@import '../sass/vars'

=bipos($x ,$y)
	top: $x*1px
	left: $y*1px

#bracket
	background-color: #fff
	background-image: url(img/bracketBG.png)
	width: $screen-width
	height: $screen-height
	p
		margin: 0
		b
			display: inline-block
			width: 285px
			text-align: center

.txt
	font-size: 100px
	text-align: right
	padding: 30px 70px
	font-family: '109', monospace

.lines
	width: $screen-width
	height: $screen-height
	position: absolute
	background-image: url(img/WR_Brackets_LOOSERS.png)
	background-repeat: no-repeat
	background-position: center left
	z-index: 1
	display: none
	opacity: .7

.row
	margin-bottom: 30px

.wncn
	padding: 0 15px;
	overflow: hidden
	position: absolute
	width: 375px
	height: 100px
	display: block
	background-repeat: no-repeat
	background-position: center
	z-index: 3
	svg.bgarr
		position: absolute
		right: -35px
		top: -34px
		height: 130px

.lscn
	overflow: hidden
	margin-left: 55px
	display: inline-block

.p1, .p2
	overflow: hidden

.p1
	padding: 0px 6px 0 6px

.p2
	padding: 0px 6px 0px 6px

.p1 .pl
	float: right

.p2 .pl
	float: right

.pl
	width: 350px
	height: 35px
	color: #355473
	font-family: "PFSansn", monospace
	font-size: 32px
	letter-spacing: 2px
	display: inline-block
	padding: 5px 10px 3px 15px
	float: right
	transition: opacity 3s
	>span
		font-weight: bold
		color: #a42c42
		float: right
		font-family: "PFSansn", monospace
		text-align: center
		width: 50px
		margin-right: 10px;

.wis
	display: none;

#R,#S,#T,#U,#V,#W,#X,#Y,#Z,#AA,#AB,#AC,#AD,#AE
	display: block

#R
	+bipos(27, 1540)
#S
	+bipos(291, 1540)
#T
	+bipos(560, 1540)
#U
	+bipos(825, 1540)
#V
	+bipos(160, 1325)
#W
	+bipos(427, 1325)
#X
	+bipos(693, 1325)
#Y
	+bipos(960, 1325)
#Z
	+bipos(292, 953)
#AA
	+bipos(825, 953)
#AB
	+bipos(426, 738)
#AC
	+bipos(692, 738)
#AD
	+bipos(560, 364)
#AE
	+bipos(694, 92)

#r1m1
	+bipos(27, 20)

.ww
	// color: $Bcrd
	color: #355473
	span
		// color: $Bcwt
		color: #a42c42

#r3m2
	display: none

.brText
	position: absolute
	width: 370px
	height: 180px
	top: 260px
	left: 280px
	color: #fff
	font-family: "PFSansn", monospace
	letter-spacing: 5px
	font-size: 30px
	>p
		text-align: center
		height: 180px
		display: flex
		justify-content: center
		flex-direction: column
		text-align: center
		text-shadow: 5px 5px 3px rgba(0,0,0,.6)

#l1m1, #l1m2, #l2m1, #l2m2, #l3m1, #l4m1
	// background-image: url(img/BracketL.png)
	width: 420px
	// span
		// color: #fff
	.ww
	color: #fff
	// color: $Bcrd

#r3m1
	// background-image: url(img/BracketF.png)
	.ww
	// color: #fff
	span
		// color: #fff
</style>
