<template>
  <div class="common-layout">
    <el-container style="height: 98vh">
      <el-header style="width: 100%"><Header/></el-header>
      <el-container style="width: 100%;height: 90%">
        <el-aside  style="width: auto;"><Aside style="height: 100%"/></el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script setup lang="ts">


import Header from "./layout/header.vue";
import Aside from "./layout/aside.vue";
</script>

<style scoped>

</style>