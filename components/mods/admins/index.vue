
<template>
	<div style="display:flex; height:100%; flex-direction:column;">
		<div class="header-container">
			<div class="container header-content-container">
				<div></div>
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
				<el-menu unique-opened 
					@select="handleSelect" 
					@open="handleSelect" 
					@close="handleSelect"
					:default-active="defaultActive" 
					class="el-menu-demo" 
					mode="vertical">
					<el-submenu index="users">
						<template slot="title">用户</template>
						<el-menu-item index="accounts">用户账户</el-menu-item>
						<el-menu-item index="roles">用户角色</el-menu-item>
						<el-menu-item index="discounts">用户优惠券</el-menu-item>
						<el-menu-item index="oauthUsers">账号绑定</el-menu-item>
					</el-submenu>
					<el-submenu index="projects">
						<template slot="title">项目</template>
						<el-menu-item index="projectMembers">项目成员</el-menu-item>
						<el-menu-item index="projectIssues">项目问题</el-menu-item>
					</el-submenu>
					<el-submenu index="trades">
						<template slot="title">交易</template>
						<el-menu-item index="goods">物品</el-menu-item>
						<el-menu-item index="orders">充值</el-menu-item>
					</el-submenu>
					<el-submenu index="favorites">
						<template slot="title">收藏</template>
						<el-menu-item index="favoriteUsers">用户收藏</el-menu-item>
						<el-menu-item index="favoriteProjects">项目收藏</el-menu-item>
					</el-submenu>
					<el-submenu index="systems">
						<template slot="title">系统</template>
						<el-menu-item index="admins">管理员</el-menu-item>
						<el-menu-item index="versions">版本管理</el-menu-item>
						<el-menu-item index="caches">缓存</el-menu-item>
						<el-menu-item index="sensitiveWords">敏感词</el-menu-item>
					</el-submenu>
					<el-submenu index="illegals">
						<template slot="title">封停</template>
						<el-menu-item index="illegalUsers">用户封停</el-menu-item>
						<el-menu-item index="illegalProjects">项目封停</el-menu-item>
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
//import component from "@/components/component.js";
import mod from "@/components/mods/common/mod.vue";
import tables from "./tables.vue";
import resources from "./note/index.js";
import api from "./note/api.js";

export default {
	mixins: [mod],

	components: {
		tables,
	},

	data: function() {
		return {
			options:{},
			defaultActive:"users",

			isExistHeader:false,
			isExistFooter:false,
			head: {
				title:"KEEPWORK后台管理",
			},
		}
	},

	computed: {
		currentEnv() {
			const envs = {stage:"开发", release:"测试", production:"正式"};
			return  "环境:" + envs[this.env];
		}
	},

	methods: {
		handleCommand(cmd){
			if (cmd == "logout") {
				this.setUser();
				this.setToken();
				this.push("/login");
				return;
			}
		},
		handleSelect(index, indexPath) {
			this.options = resources[index];
		}
	},

	mounted() {
		if (!this.isAuthenticated) return this.push("/login");
		api.setToken(this.token);

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
	justify-content: space-between;
	align-items: center;
}
</style>
