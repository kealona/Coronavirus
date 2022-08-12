import Vue from 'vue'
import Router from 'vue-router'

import CoronavirusMap from '../components/CoronavirusMap.vue'
import CountryMap from '../components/Country.vue'
import home from '../view/home.vue'
import model from '../view/model'
import preview from '../view/preview'
import login from '../view/login'

Vue.use(Router)

export default new Router({
  routes: [
     {
      path: '/maps',
      name: 'maps',
      component: CoronavirusMap
    } ,
    {
      path: '/Country-map',
      name: 'country',
      component: CountryMap
    }, {
	    path: '/',
	  	redirect: '/maps'
  	}, {
      path: '/home',
      component: home
    },  {
      path: '/model',
      component: model
    }, {
      path: '/preview',
      component: preview
    }, {
      path: '/login',
      component: login
    }
  ]
})
