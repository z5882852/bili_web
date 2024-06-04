<template>
    <el-header class="container">
        <!-- 容器，包含输入框和按钮 -->
        <div class="search-container">
            <el-input placeholder="请输入需要解析的视频链接" v-model="searchValue" clearable @clear="handleClear"
                @keydown.enter="handleSearch" class="search-input">
            </el-input>
            <el-button @click="handleSearch">解析</el-button>
        </div>
    </el-header>
    <el-main v-loading="showLoading">
        <el-collapse class="select-container" v-if="showSelectPage" v-model="selectedCollapse">
            <el-collapse-item title="请选择分P" name="1" class="select-collapse">
                <!-- 单选框 -->
                <el-radio-group v-model="selectedPage" style="width: 100%;">
                    <!-- 标签和选择 -->
                    <el-radio v-for="page in pages" :key="page.page" :label="page.page" class="page-radio">P{{ page.page }} | {{ page.part }}</el-radio>
                    <el-button id="select-page-btn" type="primary" @click="handleSelectPage">确定</el-button>
                </el-radio-group>
            </el-collapse-item>
        </el-collapse>
        <!-- 标签栏 -->
        <el-tabs v-model="selectedTap" v-if="showInfo">
            <el-tab-pane label="视频信息" :name=1>
                <VideoContent :data="videoData" :page="parsePage"></VideoContent>
            </el-tab-pane>
            <el-tab-pane label="弹幕分析" :name=2>
                <DmContent :data="videoData" :page="parsePage"  :tap="selectedTap"></DmContent>
            </el-tab-pane>
            <el-tab-pane label="视频建议" :name=3>
                <ChatContent :data="videoData" :page="parsePage"></ChatContent>
            </el-tab-pane>
        </el-tabs>
    </el-main>


</template>
<script>
import { defineComponent, ref } from 'vue';
import { ElMessage } from 'element-plus'
import VideoContent from '@/components/VideoContent.vue';
import DmContent from '@/components/DmContent.vue';
import ChatContent from '@/components/ChatContent.vue';

export default defineComponent({
    components: {
        VideoContent,
        DmContent,
        ChatContent,
    },
    setup() {
        const selectedTap = ref(1);  // 默认选中第一个标签
        const selectedCollapse = ref("1");  // 默认选中第一个折叠页
        const showInfo = ref(false);
        const showLoading = ref(false);
        const searchValue = ref('https://www.bilibili.com/video/BV18Z421H7yH?spm_id_from=333.1007.tianma.1-1-1.click');  // 输入框的值
        const showSelectPage = ref(false);  // 是否显示选择分P页面
        const selectedPage = ref(0);  // 选择的分P
        const parsePage = ref(0);  // 解析的分P
        const pages = ref([]);  // 分P列表
        const videoData = ref({});  // 视频数据


        const handleSearch = () => {
            showLoading.value = true;
            window.$axios.get("/api/v1/video/info", {
                params: {
                    url: searchValue.value
                },
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("access_token")
                }
            }).then(response => {
                let data = response.data.data;
                if (response.data.code === 200) {
                    // selectedTap.value = 1;
                    videoData.value = data;
                    showLoading.value = false;
                    pages.value = data.pages;

                    if (pages.value.length > 1) {
                        selectedPage.value = 1
                        showSelectPage.value = true;
                    } else {
                        selectedPage.value = 1
                        showSelectPage.value = false;
                        handleSelectPage()
                    }
                    ElMessage({
                        message: '解析成功!',
                        type: 'success',
                    })
                } else {
                    showLoading.value = false;
                    ElMessage({
                        type: "error",
                        message: response.data.message,
                    });
                }
            })
                .catch(error => {
                    showLoading.value = false;
                    if (error.response.status == "401") {
                        ElMessage({
                            type: "error",
                            message: "请先登录",
                        });
                    } else {
                        ElMessage({
                            type: "error",
                            message: "解析失败，请联系客服",
                        });
                    }
                    
                    console.log(error);
                });
        };

        const handleClear = () => {
            searchValue.value = '';
        };

        const handleSelectPage = () => {
            showInfo.value = true;
            parsePage.value  = selectedPage.value
            selectedCollapse.value = "0"
            selectedTap.value = 1
            
        };

        return {
            selectedTap,
            selectedCollapse,
            showInfo,
            showLoading,
            searchValue,
            showSelectPage,
            handleSearch,
            handleClear,
            handleSelectPage,
            selectedPage,
            parsePage,
            pages,
            videoData
        };
    },
});

</script>
<style scoped>
.container {
    padding: 20px;
}

.search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    width: 50%;
    margin: 0 auto;

}

.search-input {
    margin: 0 10px 0 0;
    /* width: 50%; */
}

.select-container {
    margin: 0 auto;
    width: 50%;
    margin-top: 20px;
    border: 0;
}


</style>

<style>
.select-collapse button {
    border: 0;
    height: 16px;
}

.el-radio-group {
    min-height: 50px !important;
}

.page-radio {
    display: inline-block;
    width: calc(50% - 22px);
    border: 1px solid #656f7a;
    border-radius: 4px;
    padding: 0 5px;
    margin: 5px 5px !important;
}
.is-checked {
    border-color: #409eff;
}

.page-radio span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#select-page-btn {
    
    font-size: 14px;
    padding: 10px;
}
</style>
