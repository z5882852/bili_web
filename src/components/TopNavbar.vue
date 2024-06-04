<template>
    <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="0">
                <div class="title">B站视频优化推荐</div>
            </el-menu-item>
            <el-menu-item index="1">
                主页
            </el-menu-item>
            <el-menu-item index="2">
                介绍
            </el-menu-item>
            <div class="flex-grow" />
            <el-menu-item index="3">
                登录
            </el-menu-item>
        </el-menu>
    </el-header>
</template>

<script>
import { defineComponent, ref } from 'vue';
import router from '@/router'


export default defineComponent({
    components: {
    },
    setup() {
        const activeIndex = ref('1');
        const handleSelect = (key) => {
            if (key === '0') {
                router.push({ path: "/" });
            } else if (key === '1') {
                router.push({ path: "/home" });
            } else if (key === '2') {
                router.push({ path: "/intro" });
            } else if (key === '3') {
                router.push({ path: "/login" });
            }
        }
        router.push({ path: "/home" });
        return {
            activeIndex,
            handleSelect
        };
    },
});
</script>

<style>
/* 根据需要进行样式调整 */
.el-menu-demo {
    width: 100%;
    line-height: 60px;
    /* float: right; */
    /* margin-right: 0; */
}

.nav-link {
    padding: 0 20px !important;
    font-size: 14px !important;
    font-weight: 550 !important;
}

.title {
    /* padding: 15px;*/
    font-size: 18px;
}

.flex-grow {
    flex-grow: 1;
}
</style>
