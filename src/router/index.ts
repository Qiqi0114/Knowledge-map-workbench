// createRouter 创建路由模块
// createWebHistory 创建 路由模式

import {createRouter ,createWebHashHistory } from "vue-router"
import routes from "./routes"

  const router = createRouter({
    history: createWebHashHistory(),
    routes
  })
  
router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title
  next()
})

  export default router
