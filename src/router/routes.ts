// RouteRecordRaw 增加路由对象类型限制，好处：允许在基础路由里面增加开发者自定义属性
import { RouteRecordRaw } from "vue-router"

const routes:Array<RouteRecordRaw> = [
    { //配置默认路由
      path: "/",
      redirect: "/login",        
    },
    {
     path: "/login",
     name: "login",
     meta: {
      title: "知识图谱工作台",
    },
     component: () => import("../views/login/index.vue"),
    },    
    {
      path: '/home',  
      name: 'Home',
      component: () => import("../views/home/index.vue"),
      children: [
        {
            path: "/home/visualization",
            name: "visualization",
            meta: {
                title: "桌面",
            },
            component: () => import("../views/visualization/index.vue"),
        },
        {
            path: "/home/calloutTask",
            name: "calloutTask",
            meta: {
                title: "我的标注",
            },
            component: () => import("../views/calloutTask/index.vue"),
        },
        {
          path: "/home/bookLabel",
          name: "bookLabel",
          meta: {
              title: "书籍标注",
          },
          component: () => import("../views/calloutTask/bookLabel.vue"),
        },
        {
            path: "/home/taskList",
            name: "taskList",
            meta: {
                title: "我的任务",
            },
            component: () => import("../views/taskList/index.vue"),
        },
      ]
    }
    
  ]
export default routes