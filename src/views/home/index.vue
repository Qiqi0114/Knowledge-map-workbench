<template>
  <el-menu
  :default-active="activeIndex"
  class="el-menu-demo"
  mode="horizontal"
  background-color="#545c64"
  text-color="#fff"
  router
  active-text-color="#ffd04b"
>
  <el-menu-item   style="margin-left:40px" index="/home/visualization"><el-icon><Briefcase /></el-icon>我的桌面</el-menu-item>
  <el-menu-item   style="margin-left:40px" index="/home/calloutTask"><el-icon><EditPen /></el-icon>我的标注</el-menu-item>
  <el-menu-item   style="margin-left:40px" index="/home/taskList"><el-icon><BellFilled/></el-icon>我的任务</el-menu-item>
  <el-sub-menu style="margin-left:400px" index="2">
    <template #title><el-icon><Avatar /></el-icon>账号管理</template>
    <el-menu-item index="/login">退出</el-menu-item>
  </el-sub-menu>
</el-menu>
<div class="router-container" id="router-container">
      <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Briefcase,BellFilled,EditPen,Avatar } from '@element-plus/icons-vue'
//当前激活菜单的 index
const activeIndex = ref<string>('/home/visualization')
</script>

<style lang="scss" scoped>
.router-container{
  width: 100%;
  height: 100%;
}
</style>