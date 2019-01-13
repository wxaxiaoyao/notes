
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
import mod from "@/components/mods/common/mod.vue";
import api from "./note/api.js";

export default {
	mixins: [mod],

	data:function(){
		return {
			username:"",
			password:"",

			isExistHeader:false,
			isExistFooter:false,
			head: {
				title:"KEEPWORK后台登录",
			},
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
				self.push("/");
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
