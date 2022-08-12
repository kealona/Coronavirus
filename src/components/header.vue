<template>
    <header class="kl-header">
        <el-row>
            <el-col :span="5" :offset="1">
                <h3>疫情分布系统后台管理</h3>
            </el-col>
            <el-col :span="10" :offset="7">
                <ul class="kl-header-list">
                    <li><a class="kl-header-list__content" @click="jumpTo(1)">home</a></li>
                    <li><a class="kl-header-list__content" @click="jumpTo(2)">Model</a></li>
                    <li><a class="kl-header-list__content" @click="jumpTo(3)">Preview</a></li>
                    <li><a class="kl-header-list__content">Other</a></li>
                </ul>
            </el-col>
        </el-row>
    </header>
</template>

<script>
import $ from "jquery";

export default {
    data() {
        return {

        }
    },
    mounted() {
        this.autoAdapt()
    },
    methods: {
        autoAdapt() {
            $('.kl-header').css('height', window.innerHeight * 0.13 + 'px')
            let header_height = $('.kl-header').css('height')
            $('.kl-header').css("line-height", header_height)
        },
        jumpTo(index) {
            if(index == 1) {
                this.$router.push('/home')
            } else if(index == 2) {
                this.$router.push('/model')
            } else {
                this.$router.push('/preview')
            }
        }
    }
}
</script>

<style scoped>
    * {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .kl-header {
        background-color: #fff;
        height: 13%;
        box-shadow: 0 8px 20px rgb(55 125 255 / 8%);
        position: fixed;
        width: 100%;
        z-index: 10
    }

    h3 {
        color: #121158;
        font-weight: bolder;
        margin: 0;
    }

    .kl-header-list {
        list-style: none;
        padding: 0;
        text-align: center;
        margin: 0;
        font-size: .8em;
    }

    .kl-header-list li {
        float: left;
        margin-right: 30px;
    }

    .kl-header-list__content {
        color: #3b4666;
        text-decoration: none;
        transition: all .3s ease-in-out;
        cursor: pointer;
        font-weight: bolder;
        margin: 0 18px;
        position: relative;
    }

    .kl-header-list__content:hover {
        color: #407ff0;
    }

    .kl-header-list__content::before {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 0;
        height: 3px;
        background-color: #407ff0;
        box-sizing: border-box;
        transition: all .25s ease-in-out;
        -webkit-transition: all .25s ease-in-out;
        width: 0;
    }

    .kl-header-list__content:hover::before {
        opacity: 1;
        visibility: visible;
        width: 100%;
        transition: all .25s ease-in-out;
        -webkit-transition: all .25s ease-in-out;
    }

    
</style>