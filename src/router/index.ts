// createRouter 创建路由模块
// createWebHistory 创建 路由模式

import {createRouter ,createWebHashHistory } from "vue-router"
import routes from "./routes"

  const router = createRouter({
    history: createWebHashHistory(),
    routes
  })
  
  export default router
