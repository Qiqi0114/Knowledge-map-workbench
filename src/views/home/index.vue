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
  <el-menu-item   style="margin-left:40px" index="/home/visualization">工作台</el-menu-item>
  <el-menu-item   style="margin-left:40px" index="/home/taskList">任务列表</el-menu-item>
  <el-menu-item   style="margin-left:40px" index="/home/calloutTask">标注列表</el-menu-item>
  <el-sub-menu style="margin-left:400px" index="2">
    <template #title>账号管理</template>
    <el-menu-item index="2-1">用户信息</el-menu-item>
    <el-menu-item index="/login">退出</el-menu-item>
  </el-sub-menu>
</el-menu>
<div class="router-container" id="router-container">
      <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
//当前激活菜单的 index
const activeIndex = ref<string>('/home/taskList')
</script>

<style lang="scss" scoped>
.router-container{
  width: 100%;
}
</style>