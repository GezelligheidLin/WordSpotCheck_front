<template>

  <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="value"
      @open="handleOpen"
      @close="handleClose"
  >
    <el-menu-item index='1' @click="value=!value">
      <el-icon>
        <Plus v-if="value===true"/>
        <Minus v-if="value===false"/>
      </el-icon>
      <template #title>
        <span v-if="value===false">turn off</span>
        <span v-if="value===true">turn on</span>
      </template>
    </el-menu-item>
    <el-menu-item index="2" disabled>
      <el-icon><document /></el-icon>
      <template #title>Navigator Three</template>
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon><setting /></el-icon>
      <template #title>Navigator Four</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(true);

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>