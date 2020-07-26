import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import App from './pages/smashgg.vue';

const smashList = nodecg.Replicant('smashgg-list');
const tournamentId = nodecg.Replicant('tornamentID');
const playersFight = nodecg.Replicant('playersToFight');

const top8 = nodecg.Replicant('top');

const state = {
  ID: '',
  list: {},
  loading: {
    main: false,
  },
  top8: [],
};

const actions = {
  setID({ commit }, val) {
    tournamentId.value = val;
    commit('set_ID', val);
  },
  setPlayersRep({ commit }, val) { // eslint-disable-line no-unused-vars
    playersFight.value = val;
  },
  pullList({ commit, st }, val) { // eslint-disable-line no-unused-vars
    if (!st.loading.main && st.ID !== '') {
      commit('change_loading', { main: true });
      nodecg.sendMessage('ssbmSGGUpdate',
        { tournament: st.ID, discipline: '', pool: '' },
        (result) => {
          smashList.value = result;
          // commit('change_list', result);
          commit('change_loading', { main: false });
        });
    }
  },
  setTop({ commit }, val) { // eslint-disable-line no-unused-vars
    top8.value = val;
    // commit('change_top', {main: false});
  },
};

const mutations = {
  set_ID(st, val) {
    st.ID = val;
  },
  change_loading(st, obj) {
    Object.assign(st.loading, obj);
  },
  change_list(st, list) {
    st.list = list;
  },
  change_top(st, list) { // eslint-disable-line no-unused-vars
    st.top8 = top8;
  },
};

const getters = {
  getID(st) {
    return st.ID;
  },
  isLoad(st) {
    return st.loading;
  },
  getList(st) {
    return st.list;
  },
  getTop(st) {
    return st.top8;
  },

};

Vue.use(Vuex);
Vue.use(BootstrapVue);

const store = new Vuex.Store({
  state, actions, mutations, getters,
});

// playersFight.on('change', (newVal, oldVal) => {
//   store.commit('set_players', newVal);
// });

tournamentId.on('change', (newVal) => {
  store.commit('set_ID', newVal);
});

smashList.on('change', (newVal, oldVal) => {
  if (newVal !== oldVal) {
    store.commit('change_list', newVal);
  }
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
