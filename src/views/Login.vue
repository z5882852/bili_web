<template>
    <div class="login-container card">
        <el-main v-loading="showLoading">
            <h1 style="margin-bottom: 50px;">BLOSS</h1>
            <el-form :model="form" label-position="top" label-width="auto">
                <el-form-item label="用户名">
                    <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="form.password" />
                </el-form-item>
                <el-form-item>
                    <a href="/#/register" class="btn"><el-button>注册</el-button></a>
                    <el-button class="btn" type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import router from '@/router'


export default defineComponent({
    components: {
    },
    setup() {
        const showLoading = ref(false)
        const form = reactive({
            username: '',
            password: '',
        })

        const onSubmit = () => {
            const formData = new FormData();
            formData.append('username', form.username);
            formData.append('password', form.password);
            showLoading.value = true;
            window.$axios.post("/api/v1/login", formData)
                .then(response => {
                    if (response.data.code === 200) {
                        ElMessage({
                            type: "success",
                            message: "登录成功",
                        });
                        localStorage.setItem("access_token", response.data.access_token)
                        setTimeout(() => {
                            router.push({ path: "/home" });
                        }, 200)
                    } else {
                        ElMessage({
                            type: "error",
                            message: response.data.message,
                        });
                    }
                    showLoading.value = false;
                })
                .catch(error => {
                    showLoading.value = false;
                    ElMessage({
                        type: "error",
                        message: "登录失败: " + error.status,
                    });
                    console.log(error);
                });
        }
        return {
            showLoading,
            form,
            onSubmit,
        }
    }
})

</script>


<style>
a {
    text-decoration: none;
    color: black;
}
</style>
<style scoped>
.login-container {
    padding: 100px;
    padding-top: 50px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.btn {
    margin: 0 auto;
}
</style>