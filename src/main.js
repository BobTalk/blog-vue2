// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue              from 'vue'
import VueResource      from 'vue-resource'
import App              from './App'
import router           from './router'
import store            from './store/store.js'
import './assets/css/index.scss'
Vue.config.productionTip = false

Vue.use(VueResource)

Vue.filter("toDate", (date)=> {
  if (date) {
    const d = new Date(date)
    const minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()
    const hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours()
    return d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日" + hours + "时" + minutes + "分"
  }
})
Vue.filter("to_date", (date)=> {
  if (date) {
    const d = new Date(date)
    const minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()
    const hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours()
    return d.getYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + hours + ":" + minutes
  }
})
Vue.filter("toTag", (arr)=> {
  if (arr) {
    return arr.join(",")
  }
})
Vue.directive("scrollShow", {
  bind: (el)=> {
    window.addEventListener("scroll", ()=> {
      if (document.body.scrollTop + 600 > el.offsetTop) {
        for (let i = 0; i < el.children.length; i++) {
          setTimeout(()=> {
              el.children[i] ? el.children[i].style.display = "block" : 0
            },
            500 * i
          )
        }
      }
    })
  }
})
//vue 拦截器
Vue.http.interceptors.push((req, next)=> {
  if (window.localStorage.getItem("token")) {
    req.headers.set("authorization", "Bearer" + window.localStorage.getItem("token"))
  }
  next((req)=> {
    if (req.status === 401) {
      store.commit("unset_user")
      router.go({name: "login"})
    }
    return req
  })
})
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
