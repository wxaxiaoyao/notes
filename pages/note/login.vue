<template>
	<div class="container" style="margin-top:40px">
		<el-row>
			<el-col :span="8" :offset="8" :xs="{span:22, offset:1}">
				<el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="80px">
					<el-form-item label="用户名:" prop="username">
						<el-input v-model="loginForm.username"></el-input>
					</el-form-item>
					<el-form-item label="密码:" prop="password">
						<el-input type="password" v-model="loginForm.password" @keyup.native.enter="submitLoginForm"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click.prevent="submitLoginForm">登陆</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="8" :offset="8" :xs="{span:22, offset:1}">
				<div style="display:flex; justify-content:center">
					<OauthLogin></OauthLogin>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import {
	Row,
	Col,
	Form,
	FormItem,
	Input,
	Button,
	Message,
} from "element-ui";
import {mapActions, mapGetters} from "vuex";
import OauthLogin from "@/components/views/oauthLogin.vue";
import component from "@/components/component.js";

export default {
	mixins: [component],
	components: {
		[Button.name]: Button,
		[Row.name]: Row,
		[Col.name]: Col,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Input.name]: Input,
		OauthLogin,
	},

	data:function(){
		return {
			loginForm:{
				username:"",
				password:"",
			},
			loginRules: {
				username: [
				{required:true, message:"用户名不能为空", trigger:"blur"}
				],
				password: [
				{required:true, message:"密码不能为空", trigger:"blur"}
				]
			}
		}
	},
	props:{
	},
	methods: {
		async submitLoginForm() {
			const self = this;
			const ret = await new Promise((resolve, reject) => {
				self.$refs.loginForm.validate(valid => resolve(valid));
			});
			if (!ret) return;

			const result = await self.api.users.login({
				username:self.loginForm.username,
				password:self.loginForm.password,
			});
			
			const user = result.getData();
			if (!user) {
				this.$message("账号密码错误");
				return;;
			}

			self.setUser(user);
			self.$router.push({name:"user", params:{user:user.username}});
		}
	},
}
</script>
