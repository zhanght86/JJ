// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource';
import cs from '../vue/consolidateexer'
import store from './store'
import API from './common/API'
Vue.use(VueResource);
Vue.prototype.API=API;
/* eslint-disable no-new */
new Vue({
  el: '#consolidateexer',
  data:{a1:1,b1:22   },
  store,
  render:h=>h(cs)
});
