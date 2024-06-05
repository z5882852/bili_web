<template>
    <div class="reg-container card">
        <el-main v-loading="showLoading">
            <h1 style="margin-bottom: 50px;">BLOSS</h1>
            <el-form :model="form" label-position="top" label-width="auto" style="min-width: 300px;">
                <el-form-item label="用户名">
                    <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="form.password" />
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input type="password" v-model="form.confirm_pwd" />
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="form.gender">
                        <el-radio value="male">男</el-radio>
                        <el-radio value="female">女</el-radio>
                        <el-radio value="unknown">保密</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <a href="/#/login" class="btn"><el-button>登录</el-button></a>
                    <el-button class="btn" type="primary" @click="onSubmit">注册</el-button>
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
            confirm_pwd: '',
            gender: 'male'
        })

        const onSubmit = () => {
            if (form.password !== form.confirm_pwd) {
                ElMessage({
                    type: "warning",
                    message: "密码不一致",
                });
                return
            }
            showLoading.value = true;
            window.$axios.post("/api/v1/register", {
                username: form.username,
                password: form.password,
                gender: form.gender,
            })
                .then(response => {
                    if (response.data.code === 200) {
                        ElMessage({
                            type: "success",
                            message: "注册成功",
                        });
                        localStorage.setItem("access_token", response.data.access_token)
                        setTimeout(() => {
                            router.push({ path: "/login" });
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

<style scoped>
.reg-container {
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