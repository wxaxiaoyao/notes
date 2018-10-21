<template>
	<div>
		<div v-show="user.id">
			<el-dropdown @command="handleCommand" trigger="click">
				<el-button round size="small" type="text" class="el-dropdown-link">
					{{user.nickname || user.username || "逍遥"}}
					<i class="el-icon-arrow-down el-icon--right"></i>
				</el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="user-profile">主页</el-dropdown-item>
					<el-dropdown-item command="files">网盘</el-dropdown-item>
					<el-dropdown-item command="settings">设置</el-dropdown-item>
					<el-dropdown-item command="editor">编辑器</el-dropdown-item>
					<!--<el-dropdown-item command="uieditor">UI编辑器</el-dropdown-item>-->
					<el-dropdown-item v-show="user && user.roleId == 10" command="admins">后台</el-dropdown-item>
					<el-dropdown-item divided command="logout">退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
		<div v-show="!user.id">
			<el-button type="text" @click="clickLoginBtn">登陆</el-button>
			<el-button type="text" @click="clickRegisterBtn">注册</el-button>
		</div>
	</div>
</template>

<script>
import common from "./common.js";

export default {
	mixins: [common],

	data: function() {
		return {
		}
	},

	methods: {
	},

	mounted() {
		//console.log("===========");
	}
}
</script>

<style scoped>
</style>
