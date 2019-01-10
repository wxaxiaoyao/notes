
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
		<el-row>
			<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2" class="left-container">
				<el-menu unique-opened @select="handleSelect" :default-active="defaultActive" class="el-menu-demo" mode="vertical" @open="handleMenuOpen">
					<el-menu-item index="users">用户</el-menu-item>
					<el-menu-item index="projects">项目</el-menu-item>
					<el-menu-item index="caches">缓存</el-menu-item>
					<el-submenu index="illegalUsers">
						<template slot="title">封停</template>
						<el-menu-item index="illegalUsers">用户封停</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-col>
			<el-col :xs="16" :sm="18" :md="20" :lg="21" :xl="22" class="main-container">
				<tables :options="options"></tables>
			</el-col>
		</el-row>
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
			defaultActive:"projects",
			menus: [
				{label:"用户",index:"users"},
				{label:"项目",index:"projects"},
				{label:"物品",index:"goods"},
				{label:"管理员",index:"admins"},
				{label:"封停",index:"illegals", children:[
					{label:"用户封停", index:"illegalUsers"},
				]},
				{label:"缓存",index:"caches"},
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
		handleMenuOpen(index) {
			this.defaultActive = index;
			this.options = resources[index];
		},
		handleSelect(index, indexPath) {
			this.options = resources[index];
		}
	},

	mounted() {
		if (!this.isAuthenticated) this.push("/kp/login");
		const query = this.$route.query;
		api.setToken(this.token);
		if (query.env == "stage") {
			api.http.defaults.baseURL = "https://api-stage.keepwork.com/core/v0/";
		} else if (query.env == "release") {
			api.http.defaults.baseURL = "https://api-release.keepwork.com/core/v0/";
		}
		this.options = resources[this.defaultActive];
	}
}
</script>

<style scoped>
.left-container {
}
.main-container {
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
