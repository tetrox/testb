<template lang="pug">
#wait-frame
  el-collapse(v-model='waitFrameCollapseModel')
    el-collapse-item(
      :title="'Wait text: \"' + (waitTextBuffer ? waitTextBuffer.substr(0, 15) : '') + '\"'"
      name="wait"
    )
      el-row
        el-col
          el-input(:value='waitTextBuffer'
            type="textarea"
            @input='updWait'
            rows="3"
            no-resize)
      el-row
        el-col
          el-progress(:percentage="waitProg"
            stroke-linecap='square'
            :show-text='false'
            :status='waitProg === 100 ? "success" : "warning"')
    el-collapse-item(:title="tournamentTextTitle" name="branch")
      el-row
        el-col
          el-input(:value='bracketTextBuffer' @input='updBracket')
      el-row
        el-col
          el-progress(:percentage="bracketProg"
            stroke-linecap='square'
            :show-text='false'
            :status='bracketProg === 100 ? "success" : "warning"')

    el-collapse-item(
      :title='"Streamers: " + streamCollapseHeader'
      name='streamers'
      class="stream-collapse"
    )
      el-row.first-streamer-row
        el-col(:span='13' :xs='24')
          el-input(:value='streamersBuffer.one.name ' @input='updSoneName')
            template(slot='prepend') 1
        el-col(:xs='0' :span='1') &nbsp;
        el-col(:span='10' :xs='24')
          el-input(:value='streamersBuffer.one.social' @input='updSoneSoc')
      el-row
        el-col(:span='13' :xs='24')
          el-input(:value='streamersBuffer.two.name' @input='updStwoName')
            template(slot='prepend') 2
        el-col(:span='1' :xs='0') &nbsp;
        el-col(:span='10' :xs='24')
          el-input(:value='streamersBuffer.two.social' @input='updStwoSoc')
      el-progress(:percentage="streamersProg"
        stroke-linecap='square'
        :show-text='false'
        :status='streamersProg === 100 ? "success" : "warning"')

    el-collapse-item(:title='"Discord bot " + botData.header' name='discord')
      el-row
          el-col(:span='8')
            el-button.disc-btn(
              :type="botData.type"
              :disabled="botData.disabled"
              @click='disconnectDiscordBot'
            ) {{ botData.text }}
          el-col(:span='1') &nbsp;
          el-col(:span='7')
            el-select(
              placeholder="Select"
              :value='streamersLinks.one'
              @change='changeStreamerVoice("one", $event)'
            )
              el-option(
                v-for='(vc, key) in voiceData.users'
                :value='vc.id'
                :label="vc.name"
                :key="key"
              )
          el-col(:span='1') &nbsp;
          el-col(:span='7')
            el-select(
              placeholder="Select"
              :value='streamersLinks.two'
              @change='changeStreamerVoice("two", $event)'
            )
              el-option(
                v-for='(vc, key) in voiceData.users'
                :value='vc.id'
                :label="vc.name"
                :key="key"
              )

      //- el-progress(:value="waitProg"
      //- :max="3"
      //- :variant='waitProg === 3 ? "success" : "warning"'
      //- :animated='waitProg < 3')

  el-row
    el-col(:span='12')
      el-button(
        type="success"
        @click='updateAll'
      ) UPDATE
    el-col(:span='12')

</template>

<script>
export default {
  data() {
    return {
      sw: 45,
      waitFrameCollapseModel: ['wait', 'branch', 'streamers', 'discord'],
      waitTextBuffer: null,
      waitProg: 100,
      waitTimer: null,
      bracketProg: 100,
      bracketTimer: null,
      bracketTextBuffer: null,
      streamersProg: 100,
      streamersTimer: null,
      streamersBuffer: {
        one: {
          name: null,
          social: null,
        },
        two: {
          name: null,
          social: null,
        },
      },
      reps: {
        waitText: null,
        bracketText: null,
        streamers: null,
        discordVoice: null,
      },
    };
  },
  computed: {
    streamCollapseHeader() {
      let string = '';
      let length = 22;
      let count = 0;
      count += this.streamersBuffer.one.name ? 1 : 0;
      count += this.streamersBuffer.one.social ? 1 : 0;
      count += this.streamersBuffer.two.name ? 1 : 0;
      count += this.streamersBuffer.two.social ? 1 : 0;
      length = Math.ceil(length / count);
      if (this.streamersBuffer.one.name) {
        string += `${this.streamersBuffer.one.name.substr(0, length)}|`;
      }
      if (this.streamersBuffer.one.social) {
        string += this.streamersBuffer.one.social.substr(0, length);
      }
      string += ' ';
      if (this.streamersBuffer.two.name) {
        string += `${this.streamersBuffer.two.name.substr(0, length)}|`;
      }
      if (this.streamersBuffer.two.social) {
        string += this.streamersBuffer.two.social.substr(0, length);
      }
      return string;
    },
    voiceData() {
      return this.reps.discordVoice && this.reps.discordVoice.value
        ? this.reps.discordVoice.value
        : { users: {} };
    },
    botData() {
      let res = {};
      if (this.voiceData.isBotOnline) {
        res = {
          type: 'danger',
          disabled: false,
          text: 'OFF',
          header: ' слушает',
        };
      } else {
        res = {
          type: 'primary',
          disabled: true,
          text: 'Type "/hear"',
          header: ' ждет',
        };
      }
      return res;
    },
    streamersLinks() {
      const res = { one: '0', two: '0' };
      if (this.reps.streamers && this.reps.streamers.value) {
        res.one = this.reps.streamers.value.one.link;
        res.two = this.reps.streamers.value.two.link;
      }
      return res;
    },
    tournamentTextTitle() {
      const txt = this.bracketTextBuffer ? this.bracketTextBuffer.substr(0, 15) : '';
      return `Tournament text: ${txt}`;
    },
    waitTextTitle() {
      const txt = this.waitTextBuffer ? this.waitTextBuffer.substr(0, 15) : '';
      return `Wait text: ${txt}`;
    },
  },
  watch: {
    waitFrameCollapseModel(arr) {
      localStorage.waitFrameCollapseModel = arr.toString();
    },
  },
  mounted() {
    if (localStorage.waitFrameCollapseModel) {
      this.waitFrameCollapseModel = localStorage.waitFrameCollapseModel.split(',');
    } else if (localStorage.waitFrameCollapseModel === '') {
      this.waitFrameCollapseModel = [];
    }

    if (typeof NodeCG !== 'undefined') {
      NodeCG.waitForReplicants(
        nodecg.Replicant('waitText'),
        nodecg.Replicant('bracketText'),
        nodecg.Replicant('streamers'),
        nodecg.Replicant('discordVoice'),
      ).then(() => {
        this.reps.waitText = nodecg.Replicant('waitText');
        this.reps.bracketText = nodecg.Replicant('bracketText');
        this.reps.streamers = nodecg.Replicant('streamers');
        this.reps.discordVoice = nodecg.Replicant('discordVoice');

        this.reps.waitText.on('change', (newVal) => {
          this.waitTextBuffer = newVal;
        });

        this.reps.bracketText.on('change', (newVal) => {
          this.bracketTextBuffer = newVal;
        });

        this.reps.streamers.on('change', (newVal) => {
          this.streamersBuffer = newVal;
        });
      });
    }
  },
  methods: {
    changeStreamerVoice(i, voice) {
      this.reps.streamers.value[i].link = voice;
    },
    disconnectDiscordBot() {
      if (this.voiceData.isBotOnline) {
        this.reps.discordVoice.value.isBotOnline = false;
      }
    },
    updWait(val) {
      this.waitTextBuffer = val;
      this.waitProg = 0;
      if (this.waitTimer !== null) {
        clearInterval(this.waitTimer);
      }
      this.waitTimer = setInterval(() => {
        if (this.waitProg === 100) {
          clearInterval(this.waitTimer);
          this.reps.waitText.value = this.waitTextBuffer;
        } else {
          this.waitProg += 1;
        }
      }, 50);
    },
    commitStreamers() {
      const st = { one: {}, two: {} };
      if (this.reps.streamers.value) {
        if (this.streamersBuffer.one.name !== null) {
          st.one.name = this.streamersBuffer.one.name;
        }
        if (this.streamersBuffer.one.social !== null) {
          st.one.social = this.streamersBuffer.one.social;
        }
        if (this.streamersBuffer.two.name !== null) {
          st.two.name = this.streamersBuffer.two.name;
        }
        if (this.streamersBuffer.two.social !== null) {
          st.two.social = this.streamersBuffer.two.social;
        }
        st.one.link = this.reps.streamers.value.one.link;
        st.two.link = this.reps.streamers.value.two.link;
        this.reps.streamers.value = st;
      }
    },
    updSoneName(val) {
      this.updStreamers({
        one: { name: val, social: this.streamersBuffer.one.social },
        two: this.streamersBuffer.two,
      });
    },
    updSoneSoc(val) {
      this.updStreamers({
        one: { name: this.streamersBuffer.one.name, social: val },
        two: this.streamersBuffer.two,
      });
    },
    updStwoName(val) {
      this.updStreamers({
        one: this.streamersBuffer.one,
        two: { name: val, social: this.streamersBuffer.two.social },
      });
    },
    updStwoSoc(val) {
      this.updStreamers({
        one: this.streamersBuffer.one,
        two: { name: this.streamersBuffer.two.name, social: val },
      });
    },
    updStreamers(val) {
      this.streamersBuffer = val;
      this.streamersProg = 0;
      if (this.streamersTimer !== null) {
        clearInterval(this.streamersTimer);
      }
      this.streamersTimer = setInterval(() => {
        if (this.streamersProg === 100) {
          clearInterval(this.streamersTimer);
          this.commitStreamers();
        } else {
          this.streamersProg += 1;
        }
      }, 50);
    },

    updBracket(val) {
      this.bracketTextBuffer = val;
      this.bracketProg = 0;
      if (this.bracketTimer !== null) {
        clearInterval(this.bracketTimer);
      }
      this.bracketTimer = setInterval(() => {
        if (this.bracketProg === 100) {
          clearInterval(this.bracketTimer);
          this.reps.bracketText.value = this.bracketTextBuffer;
        } else {
          this.bracketProg += 1;
        }
      }, 50);
    },
    updateAll() {
      if (this.waitTimer !== null) {
        clearInterval(this.waitTimer);
      }
      this.waitProg = 100;

      if (this.waitTextBuffer !== null) {
        this.reps.waitText.value = this.waitTextBuffer;
      }

      if (this.bracketTimer !== null) {
        clearInterval(this.bracketTimer);
      }
      this.bracketProg = 100;

      if (this.bracketTextBuffer !== false) {
        this.reps.bracketText.value = this.bracketTextBuffer;
      }

      if (this.streamersTimer !== null) {
        clearInterval(this.streamersTimer);
      }
      this.streamersProg = 100;
      this.commitStreamers();
    },
  },
};
</script>

<style lang="sass">
@import '../ncg-theme/settings.sass'

#wait-frame
  padding: 0 10px

  .el-collapse
    border: 0

  .el-collapse-item
    margin-bottom: 4px

    &__header
      color: $--color-white
      background-color: $--frame-plate-color
      border: 0
      padding-left: 8px
      height: 40px
    &__wrap
      background-color: transparent
      background-color: $--frame-plate-color
      border: 0
    &__content
      padding-bottom: 0

    &.stream-collapse
      .el-row
        margin-top: -2px

        .el-col
          margin-top: 2px

  .progress
    height: 9px
    margin-top: 8px

  body
    background-color: #2f3a4f
    overflow: hidden

  .h3
    color: #fff

  .button
    width: 100%

  select
      padding: .375rem 0
      width: 100%

  textarea.form-control, .progress, input.form-control
    border-radius: 0

  .first-streamer-row
    margin-bottom: 8px

  .el-progress
    transition: height 1s
    overflow: hidden
    &.is-success
      height: 0
    &.is-warning
      height: 8px

    .el-progress-bar
      &__inner
        transition: width 0.05s ease
        border-radius: 0
      &__outer
        border-radius: 0

  .disc-btn
    width: 100%

</style>
