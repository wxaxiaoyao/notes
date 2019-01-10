
<template>
	<div class="login-container">
		<el-row>
			<el-col :span="8" :offset="8">
				<el-form label-width="80px">
					<el-form-item label="用户名:">
						<el-input v-model="username"></el-input>
					</el-form-item>
					<el-form-item label="密码:">
						<el-input type="password" v-model="password"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click.prevent="submitLoginForm">登陆</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import api from "./api.js";
import component from "@/components/component.js";

export default {
	mixins: [component],
	layout: "blank",

	data:function(){
		return {
			username:"",
			password:"",
		}
	},

	methods: {
		async submitLoginForm() {
			const self = this;

			const data = await api.login({
				username:self.username,
				password:self.password,
			});

			if (data && data.token) {
				api.setToken(data.token);
				self.setUser(data);
				self.push("/kp" + window.location.search);
			} else {
				self.$message("用户名或密码错误");
			}

		}
	},

	mounted() {
		const query = this.$route.query;
		if (query.env == "stage") {
			api.http.defaults.baseURL = "https://api-stage.keepwork.com/core/v0/";
		} else if (query.env == "release") {
			api.http.defaults.baseURL = "https://api-release.keepwork.com/core/v0/";
		}
	}
}
</script>

<style scoped>
.login-container {
	padding-top:100px;
}
</style>
