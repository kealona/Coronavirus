<template>
    <div class="kl-login_container">
        <div class="kl-login">
            <h3>Login</h3>
            <el-input v-model="username" placeholder="请输入用户名" style="width: 350px;margin-bottom: 20px;"></el-input><br>
            <el-input v-model="password" placeholder="请输入密码" type="password" style="width: 350px;margin-bottom: 20px;"></el-input><br>
            <el-button style="font-weight: bold" @click="clickLogin">Login</el-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

const prefix = "http://123.57.149.69:8080";

export default {
    data () {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        clickLogin() {
            if(this.username == '') {
                this.$message.error('请输入用户名')
            } else if(this.password == '') {
                this.$message.error('请输入密码')
            } else {
                axios.post(prefix + '/manageMent/login', {
                    username: this.username,
                    password: this.password
                })
                .then((res) => {
                    if(res.data.code == 500) {
                        this.$message.error('用户名或密码错误')
                    } else {
                        this.$message.success('登录成功')
                        this.$router.push('/home')
                    }
                })
            }
            
        }
    },
}
</script>

<style scoped>
    .kl-login_container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        widows: 100%;
        background-color: #ddd;
    }

    .kl-login {
        padding: 30px 0;
        background-color: #fff;
        min-width: 40%;
        min-height: 50%;
        border-radius: 15px;
        box-shadow: 0 1px 6px 0 rgb(32 33 36 / 28%);
        text-align: center;
    }
</style>