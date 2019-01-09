
<template>
	<div style="display:flex; height:100%; flex-direction:column;">
		<div class="header-container">
			<div class="container header-content-container">
				<el-dropdown @command="handleCommand" trigger="click">
					<el-button round size="small" type="text" class="el-dropdown-link">
						{{user.nickname || user.username || "逍遥"}}
						<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item divided command="logout">退出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
		<div style="flex:1; display:flex">
			<div class="left-container">
				<el-menu @select="handleSelect" default-active="users" class="el-menu-demo" mode="vertical">
					<el-menu-item v-for='(x, i) in menus' :key="i" :index="x.index">{{x.label}}</el-menu-item>
				</el-menu>
			</div>
			<div class="main-container">
				<tables :options="options"></tables>
			</div>
		</div>
	</div>
</template>

<script>
import {
	Menu,
	Submenu,
	MenuItem,
} from "element-ui";

import component from "@/components/component.js";
import tables from "./tables.vue";
import resources from "./resources/index.js";
import api from "./api.js";

export default {
	layout: 'blank',

	mixins: [component],

	components: {
		tables,
	},

	data: function() {
		return {
			options:{},
			menus: [
				{label:"用户",index:"users"},
				{label:"物品",index:"goods"},
				{label:"管理员",index:"admins"},
				{label:"封停",index:"illegals"},
			],
		}
	},

	methods: {
		handleCommand(cmd){
			if (cmd == "logout") {
				this.setUser();
				this.setToken();
				this.push("kp/login");
				return;
			}
		},
		handleSelect(index, indexPath) {
			this.options = resources[index];
		}
	},

	mounted() {
		if (!this.isAuthenticated) this.push("/kp/login");
		api.setToken(this.token);
		this.options = resources["users"];
	}
}
</script>

<style scoped>
.left-container {
	min-width: 100px;
}
.main-container {
	flex:1;
}
.header-container {
	border-bottom: 1px solid rgb(221,221,221);
	height:60px;
}
.header-content-container {
	height: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
}
</style>
