<template>
	<el-row>
		<el-col :span="8" :offset="8">
			<el-form ref="loginForm" :model="loginForm" label-width="80px">
				<el-form-item label="用户名:" prop="username">
					<el-input v-model="loginForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码:" prop="password">
					<el-input type="password" v-model="loginForm.password"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click.prevent="submitLoginForm">登陆</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	</el-row>
</template>

<script>

import axios from "axios";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data:function(){
		return {
			loginForm:{
				username:"",
				password:"",
			},
		}
	},
	props:{
		__default_data__: {
			type: Object,
			default: function() {
				return {
					url: {text: "http://localhost:3001/api/v0/users/login"},
					redirectUrl: {text: "/admin"},
				};
			}
		}
	},
	methods: {
		async submitLoginForm() {
			const self = this;

			const url = self.__data__.url.text;
			const data = await axios.post(url, {
				username:self.loginForm.username,
				password:self.loginForm.password,
			}).then(res => res.data);

			if (data && data.token) {
				self.setUser(data);
				window.location.href = window.location.origin + self.__data__.redirectUrl.text;
			} else {
				self.$message("用户名或密码错误");
			}

		}
	},
}
</script>
