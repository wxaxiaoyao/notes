
<template>
	<div class="cellphones-login-container">
		<mt-header title="登录"></mt-header>

		<div class="fields-container">
			<mt-field type="text" placeholder="请输入用户名" v-model="username"></mt-field>
			<mt-field type="password" placeholder="请输入密码" v-model="password"></mt-field>
		</div>

		<div class="login-container">
			<mt-button @click="clickLogin">登陆</mt-button>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import { Toast  } from 'mint-ui';

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			username:"",
			password:"",
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
		async clickLogin() {
			const result = await this.api.users.login({
				username:this.username,
				password:this.password,
			});
			
			const user = result.data;
			if (!user) return Toast("账号密码错误");

			this.setUser(user);
			this.push("/note/cellphones/index");
		}
	},

	mounted() {

	},
}
</script>

<style lang="less" scoped>
.login-container {
	margin-top: 20px;
	.mint-button {
		width: 100%;
	}
}
</style>
