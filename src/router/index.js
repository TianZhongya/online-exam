import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () =>
      import('../views/login')
  },
  {
    path: '/home',
    component: () =>
      import('../views/home'),
    children: [
      {
        path: 'exam',
        component: () => import('../components/exam.vue')
      },
      {
        path: 'grade',
        component: () => import('../components/grade')
      },
      {
        path: 'subject',
        component: () => import('../components/subject')
      },
      {
        path: 'curriculum',
        component: () => import('../components/curriculum')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') return next()
//   const { data: tokenStr } = this.$http.get('api/v1/auth')
//   console.log(tokenStr)
//   if (!tokenStr.data) return next('/')
//   next()
// })

export default router
