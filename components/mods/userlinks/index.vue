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
					<el-dropdown-item command="storage">网盘</el-dropdown-item>
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
import {
	Button, 
	Dropdown, 
	DropdownMenu, 
	DropdownItem
} from "element-ui";

import mod from "@/components/mods/common/mod.vue";
export default {
	mixins: [mod],
	components: {
		[Button.name]: Button,
		[Dropdown.name]: Dropdown,
		[DropdownMenu.name]: DropdownMenu,
		[DropdownItem.name]: DropdownItem,
	},

	data: function() {
		return {
		}
	},

	methods: {
		handleCommand(cmd){
			if (cmd == "logout") {
				this.setUser()
				this.pushName("login");
				this.api.users.logout();
				return;
			}
			
			if (cmd == "user-profile") {
				this.$router.push({path:"/" + this.user.username});
				return ;
			}

			if (cmd == "admins") {
				window.open("/admin");
				return;
			}
			this.pushName(cmd);
		},
		clickLoginBtn() {
			this.pushName("login");
		},
		clickRegisterBtn() {
			this.pushName("register");
		},
	},

	mounted() {
		//console.log("===========");
	}
}
</script>

<style scoped>
</style>
