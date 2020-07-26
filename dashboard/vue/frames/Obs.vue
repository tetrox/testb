<template lang="pug">
#obs-socket
  el-row
    el-col.switch(:span="5")
      i(:class="statusIco")
      el-switch(
        v-model="enabled"
        @change="enabledChange"
      )
    el-col.scene(:span="12")
      p {{ scene }}
    el-col(:span="7")
      i.el-icon-video-camera
      i.el-icon-right
      i.el-icon-folder-opened
      el-button(
        type="primary"
        circle
        @click="saveBuffer"
      )
        i.el-icon-scissors
  //- el-row
  //-   el-col(:span="24")
  //-     el-button(
  //-       type="info"
  //-       @click="setup"
  //-     )  setup
</template>

<script>
export default {
  data() {
    return {
      connected: false,
      enabled: false,
      statusIco: 'el-icon-circle-close',
      scene: '?',
      reps: {
        obs: {},
      },
      instruction: '123',
    };
  },
  mounted() {
    if (typeof NodeCG !== 'undefined') {
      NodeCG.waitForReplicants(nodecg.Replicant('obs')).then(() => {
        this.reps.obs = nodecg.Replicant('obs');
        this.reps.obs.on('change', (newVal, oldVal) => {
          if (typeof newVal !== 'undefined' && newVal !== oldVal) {
            if (typeof oldVal !== 'undefined' && oldVal.scene !== newVal.scene) {
              this.scene = newVal.scene;
            }
            this.connected = newVal.connected;
            this.enabled = newVal.enabled;
            if (!newVal.enabled) {
              this.statusIco = 'el-icon-circle-close';
            } else if (this.connected) {
              this.statusIco = 'el-icon-video-play';
            } else {
              this.statusIco = 'el-icon-video-pause';
            }
          }
        });
      });
    }
  },
  methods: {
    enabledChange() {
      this.reps.obs.value.enabled = this.enabled;
    },
    setup() {
      nodecg.sendMessage('disCheck');
      // nodecg.sendMessage('owsSetup', this.instruction);
    },
    saveBuffer() {
      nodecg.sendMessage('owsSaveBuffer');
    },

  },

};
</script>

<style lang="sass">
@import '../ncg-theme/settings.sass'

#obs-socket
  min-width: 300px

  .el-col
    display: flex
    align-items: center
    justify-content: center
    height: 40px

  .el-icon-folder-opened
    margin-right: 20px

  .scene
    text-align: center

  .switch
    display: flex
    justify-content: space-between
    align-items: center
  i
    font-size: 1.25em
    color: $--color-white
    float: left

  span
    font-size: 1em
    line-height: 1.3

</style>
