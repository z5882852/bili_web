<template>
    <div class="login-container card">
        <el-main v-loading="showLoading">
            <h1 style="margin-bottom: 50px;">BLOSS</h1>
            <el-form ref="baseForm" :model="form" label-position="top" label-width="auto" :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
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
import router from '@/router'
import { ElMessage } from 'element-plus'
const CryptoJS = require('crypto-js');

export default defineComponent({
    components: {
    },
    setup() {
        const showLoading = ref(false)
        const baseForm = ref(null)
        const form = reactive({
            username: '',
            password: '',
        })
        const rules = reactive({
            username: [
                { required: true, message: '请填写用户名', trigger: 'blur' },
                { min: 1, max: 10, message: '长度请保持在1-10之间', trigger: 'blur' },
            ],
            password: [
                { required: true, message: '请填写密码', trigger: 'blur' },
                { min: 1, max: 10, message: '长度请保持在1-10之间', trigger: 'blur' },
            ],
        })


        const onSubmit = () => {
            baseForm.value.validate((valid) => {
                if (!valid) {
                    ElMessage({
                        type: "error",
                        message: "请正确填写表单",
                    });
                    return
                }
                const formData = new FormData();
                let hashed_password = CryptoJS.SHA256(form.password).toString()
                formData.append('username', form.username);
                formData.append('password', hashed_password);
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
            })
            
        }
        return {
            showLoading,
            baseForm,
            form,
            rules,
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