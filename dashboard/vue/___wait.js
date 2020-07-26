import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import App from './pages/wait.vue';

const waitText = nodecg.Replicant('waitText');
const bracketText = nodecg.Replicant('bracketText');
const streamers = nodecg.Replicant('streamers');
const discordVoice = nodecg.Replicant('discordVoice');

const state = {
  streamers: {
    one: {
      name: '',
      social: '',
    },
    two: {
      name: '',
      socilal: '',
    },
  },
  waitText: '',
  bracketText: '',
  discordVoice: {
    isBotOnline: false,
    users: {
      0: {},
    },
  },
};

const actions = {
  setStreamers({ commit }, val) {
    streamers.value = val;
    commit('set_streamers', val);
  },
  setWaitText({ commit }, val) {
    waitText.value = val;
    commit('set_wait_text', val);
  },
  setBracketText({ commit }, val) {
    bracketText.value = val;
    commit('set_bracket_text', val);
  },

  setVoice({ commit }, { num, id }) { // eslint-disable-line no-unused-vars
    streamers.value[num].link = id;
  },
  setBotStatus({ commit }, bool) { // eslint-disable-line no-unused-vars
    discordVoice.value.isBotOnline = bool;
  },
};

const mutations = {
  set_wait_text(st, val) {
    st.waitText = val;
  },
  set_bracket_text(st, val) {
    st.bracketText = val;
  },
  set_streamers(st, val) {
    st.streamers = val;
  },
  set_discord_voice(st, val) {
    st.discordVoice = val;
  },
};

const getters = {
  getStreamers(st) {
    return st.streamers;
  },
  getWaitText(st) {
    return st.waitText;
  },
  getBracketText(st) {
    return st.bracketText;
  },
  getDiscordVoice(st) {
    return st.discordVoice;
  },
};

Vue.use(Vuex);
Vue.use(BootstrapVue);

const store = new Vuex.Store({
  state, actions, mutations, getters,
});

waitText.on('change', (newVal) => {
  store.commit('set_wait_text', newVal);
});

bracketText.on('change', (newVal) => {
  store.commit('set_bracket_text', newVal);
});

streamers.on('change', (newVal) => {
  store.commit('set_streamers', newVal);
});

discordVoice.on('change', (newVal) => {
  store.commit('set_discord_voice', newVal);
});

window.vmApp = new Vue({
  name: 'App',
  components: {
    App,
  },
  template: '<app/>',
  store,
  render: (h) => h(App),
}).$mount('#el');
