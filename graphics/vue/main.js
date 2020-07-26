import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '@/app/App';

// import BracketWin from './components/BracketWin.vue';
// import BracketLose from './components/BracketLose.vue';
// import Bracket from './components/Bracket.vue';
import Wait from '@/screens/Wait.vue';
// import Gameplay from './components/Gameplay.vue';
import Empty from '@/screens/Empty.vue';
// import Stream from './components/Stream.vue';
// import Players from './components/Players.vue';
import Fight from '@/screens/Fight';

Vue.use(VueRouter);

const router = new VueRouter({
  // mode: 'history',
  // root: '/',
  abstract: true,
  hashbang: false,
  routes: [
    {
      path: '/empty',
      component: Empty
    },
    {
      path: '/wait',
      component: Wait
    },
    {
      path: '/fight',
      component: Fight
    },
    // {
    //   path: '/bracketwin',
    //   name: 'bracketwin',
    //   component: BracketWin
    // },
    // {
    //   path: '/bracketlose',
    //   name: 'bracketlose',
    //   component: BracketLose
    // },
    // {
    //   path: '/bracket',
    //   name: 'bracket',
    //   component: Bracket
    // },
    // {
    //   path: '/stream',
    //   name: 'stream',
    //   component: Sttream
    // },
    // {
    //   path: '/gameplay',
    //   name: 'gameplay',
    //   component: Gameplay
    // },
    // {
    //   path: '/players',
    //   name: 'players',
    //   component: Players
    // }
  ]
});

Vue.mixin({
  methods: {
    blackScreenAnimation() {
      // document.getElementById('bsvideo').play();
    },
  }
});

new Vue({
  name: 'App',
  components: {
    App
  },
  template: '<app/>',
  router,
  render: (h) => h(App),
}).$mount('#el');
