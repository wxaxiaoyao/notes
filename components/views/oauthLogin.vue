<template>
	<div>
		<i @click="clickOauthLoginBtn('qq')" class="oauth-login-icon iconfont icon-qq"></i>
		<i @click="clickOauthLoginBtn('weixin')" class="oauth-login-icon iconfont icon-weixin"></i>
		<i @click="clickOauthLoginBtn('github')" class="oauth-login-icon iconfont icon-github"></i>
		<i @click="clickOauthLoginBtn('xinlang')" class="oauth-login-icon iconfont icon-xinlang"></i>
	</div>
</template>

<script>
export default {
	methods: {
		async clickOauthLoginBtn(type) {
			const data = await this.$auth.authenticate(type, {state:"login"}).then(res => res.data);
			if (!data.id)  {
				return this.$message("账号未绑定");
			}
			this.login(data);
			this.$router.push({name:g_app.getRouteName("home")});
		}
	}
}
</script>

<style scoped>
.oauth-login-icon {
	font-size: 40px;
	margin: 10px;
}
</style>
