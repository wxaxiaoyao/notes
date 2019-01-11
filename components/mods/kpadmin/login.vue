
<template>
	<div class="login-container">
		<el-row>
			<el-col :span="8" :offset="8">
				<el-form label-width="80px">
					<el-form-item label="环境:">
						<el-select v-model="env" style="width:100%">
							<el-option label="开发环境" value="stage"></el-option>
							<el-option label="测试环境" value="release"></el-option>
							<el-option label="正式环境" value="production"></el-option>
						</el-select>
					</el-form-item>
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
import mod from "@/components/mods/common/mod.vue";

export default {
	mixins: [mod],

	data:function(){
		return {
			env:"stage",
			username:"",
			password:"",

			isExistHeader:false,
			isExistFooter:false,
		}
	},

	methods: {
		async submitLoginForm() {
			const self = this;

			g_app.storage.sessionStorageSetItem("__kpadmin_env__", this.env);

			if (this.env == "stage") {
				api.http.defaults.baseURL = "https://api-stage.keepwork.com/core/v0/";
			} else if (this.env == "release") {
				api.http.defaults.baseURL = "https://api-release.keepwork.com/core/v0/";
			} else {
				api.http.defaults.baseURL = "https://api.keepwork.com/core/v0/";
			}

			const data = await api.login({
				username:self.username,
				password:self.password,
			});

			if (data && data.token) {
				api.setToken(data.token);
				self.setUser(data);
				self.push("/" + window.location.search);
			} else {
				self.$message("用户名或密码错误");
			}

		}
	},

	mounted() {
	}
}
</script>

<style scoped>
.login-container {
	padding-top:100px;
}
</style>
