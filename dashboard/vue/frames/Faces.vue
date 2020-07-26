<template lang="pug">
#app
  //- p {{ faces.vl }}
  el-row(v-for='v,k in faces.vl')
    el-col(:span='8' v-for='val,j in v')
      el-input(
        v-model="faces.vl[k][j]"
      )
  .bottom
    el-button(type="warning" @click="write") write
    el-switch(
      active-color="#0a0"
      inactive-color="#a00"
      v-model="faces.enabled"
      @change="enabledChange()"
    )

</template>

<script>
export default {
  data() {
    return {
      faces: {
        vl: [
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
        ],
        enabled: false,
      },
      reps: {
        faces: {},
      },
    };
  },
  computed: {
  },
  mounted() {
    const faces = nodecg.Replicant('faces');
    NodeCG.waitForReplicants(faces).then(() => {
      // let vals = faces.value;
      this.reps.faces = faces;
      this.reps.faces.on('change', (newVal) => {
        if (typeof newVal !== 'undefined') {
          this.faces.vl.forEach((row, i) => {
            row.forEach((val, j) => {
              this.faces.vl[i][j] = newVal.vl[i][j];
            });
          });
          this.faces.enabled = newVal.enabled;
          this.$forceUpdate();
        }
      });
    });
  },
  methods: {
    write() {
      this.reps.faces.value.vl = this.faces.vl;
    },
    enabledChange() {
      this.reps.faces.value.enabled = this.faces.enabled;
    },
  },

};
</script>

<style lang="sass">

body
  overflow: hidden
input.el-input__inner
  margin: 2px 0
.bottom
  display: flex
  justify-content: space-between
  align-items: center
</style>
