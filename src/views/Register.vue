<template>
    <div class="reg-container card">
        <el-main v-loading="showLoading">
            <h1 style="margin-bottom: 50px;">BLOSS</h1>
            <el-form ref="baseForm" :model="form" label-position="top" label-width="auto" style="min-width: 300px;"  :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="form.password" />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirm_pwd">
                    <el-input type="password" v-model="form.confirm_pwd" />
                </el-form-item>
                <el-form-item label="性别" prop="gender">
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
import router from '@/router'
import { defineComponent, reactive, ref } from 'vue'
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
            confirm_pwd: '',
            gender: 'male'
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
            confirm_pwd: [
                { required: true, message: '请确认密码', trigger: 'blur' },
                { min: 1, max: 10, message: '长度请保持在1-10之间', trigger: 'blur' },
            ],
            gender: [
                { required: true, message: '请选择性别', trigger: 'blur' },
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
                showLoading.value = true;
                let hashed_password = CryptoJS.SHA256(form.password).toString()
                window.$axios.post("/api/v1/register", {
                    username: form.username,
                    password: hashed_password,
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