<template>
  <el-header>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <div class="title">B站视频优化推荐</div>
      <ElLink href="./#/" class="nav-link">主页</ElLink>
      <ElLink href="./#/intro" class="nav-link">介绍</ElLink>
    </el-menu>
  </el-header>
</template>

<script>
import { defineComponent, ref } from 'vue';


export default defineComponent({
  components: {
  },
  setup() {
    const activeIndex = ref('1');

    return {
      activeIndex,
    };
  },
});
</script>

<style>
/* 根据需要进行样式调整 */
.el-menu-demo {
  width: 100%;
  line-height: 60px;
  float: right;
  margin-right: 0;
}

.nav-link {
  /* 设置优先级最高 */
  padding: 0 20px !important;
  font-size: 14px !important;
  font-weight: 550 !important;
}

.title {
  /* padding: 15px;*/
  font-size: 18px;
}
</style>
