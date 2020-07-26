<template lang="pug">
#main(v-cloak)
  ui-styles
  el-row(:class="{ 'now-edit': editMode }")
    el-col(
      v-for='(list,i) in frameList'
      :key='i'
      :xl='6'
      :lg='8'
      :md='12'
      :sm='12'
      :xs='24'
    )
      .frame(v-for='(frame,j) in list' :key='j')
        component(:is='frame + "-frame"' class='fr-component')
      draggable.draggable(group='frames' v-model='frameList[i]')
        .dragg-plate(v-for='(frame,j) in list' :key='j')
          i(class="el-icon-rank")
          span {{ frame }}

  el-row.edit-footer
    el-button.change(
      :icon="editMode ? 'el-icon-finished' : 'el-icon-unlock'" 
      :type="editMode ? 'warning' : 'primary'"
      @click="onEditPosition"
      circle
    )
    el-button.change-count(
      v-if="editMode && frameList.length > 2"
      icon="el-icon-minus" 
      @click="minusFramesRow"
      type="info"
      circle
    )
    el-button.change-count(
      v-if="editMode && frameList.length < 5"
      icon="el-icon-plus" 
      @click="plusFramesRow"
      type="info"
      circle
    )
    el-button.reset(
      v-if="editMode"
      icon="el-icon-refresh-left" 
      @click="resetFramesRows(true)"
      type="danger"
      circle
    )

</template>

<script>
import obsFrame from '@/frames/Obs';
import fightFrame from '@/frames/Fight';
import currentFrame from '@/frames/Current';
import waitFrame from '@/frames/Wait';
import challongeFrame from '@/frames/Challonge';

const draggable = () => import(/* webpackChunkName: "vuedraggable" */ 'vuedraggable');
const uiStyles = () => import(/* webpackChunkName: "ui-styles" */ '@/components/Styles');

export default {
  components: {
    draggable,
    uiStyles,
    obsFrame,
    fightFrame,
    currentFrame,
    waitFrame,
    challongeFrame
  },
  data() {
    return {
      editMode: false,
      frameList: []
    }
  },
  computed: {
    comps() {
      let arr;
      return this.components;
    }
  },
  methods: {
    onEditPosition() {
      if (this.editMode) {
        this.minusFramesRow();
        localStorage.mainPanelMoveModel = JSON.stringify(this.frameList);
      } else {
      	this.plusFramesRow();
      }
      this.editMode = !this.editMode;
    },
    minusFramesRow() {
      this.frameList.splice(-1,1);
    },
    plusFramesRow() {
      this.frameList.push([]);
    },
    resetFramesRows(andAdd) {
      const backup = [
      	[
      	  'fight',
      	  'challonge',
      	  'obs'
      	],
      	[
      	  'current',
      	  'wait'
      	]
      ];
      if (andAdd) {
      	backup.push([]); 
      }
      this.frameList = backup;
    }
  },
  mounted() {
    if (localStorage.mainPanelMoveModel) {
      this.frameList = JSON.parse(localStorage.mainPanelMoveModel);
    } else {
      this.resetFramesRows();
    }
  }
  
};
</script>

<style lang="sass">
@import '../ncg-theme/settings.sass'

#main
  width: 100%
  transition: opacity 1s
  opacity: 0

  .frame, .plate
    // border: 1px solid $--border-color-base
    box-shadow: $--shadow-elevation-3dp_-_box-shadow
    background: $--frame-color
    // border: 1px solid #000
    padding: 8px 12px
    margin: 6px 4px

  p
    color: $--color-white

  .el-select__caret
    color: $--color-black

  .dragg-plate
    display: none
    text-transform: uppercase
    box-shadow: $--shadow-elevation-3dp_-_box-shadow
    background: $--frame-color

  .edit-footer
    margin-top: 50px
    display: flex
    align-items: center
    .change
      margin-right: 15px
    .reset
      margin-left: 25px

  .now-edit
    .draggable
      min-height: 30px
      background: $--color-white
      border-radius: 2px
      overflow: hidden
      margin: 4px

    .el-col:last-child .draggable
      background-color: $--color-danger
      width: 20%

    .frame 
      display: none
    .dragg-plate
      display: flex
      cursor: move
      user-select: none
      margin: 4px

  .flip-list-move
    transition: transform 0.5s

  .no-move
    transition: transform 0s

</style>
