<template>
	<div class="container" style="display:flex;">
		<div style="flex:2">
			<el-menu :router="true" @open="open" :default-active="activeItem" :unique-opened="true">
				<el-submenu :index='index("user/profile")'>
					<template slot="title" style="background-color: blue">用户</template>
					<el-menu-item :index='index("user/profile")'>基本信息</el-menu-item>
					<el-menu-item :index='index("user/accountSafe")'>账号安全</el-menu-item>
				</el-submenu>
				<!--<el-submenu :index='index("dataSource")'>-->
					<!--<template slot="title" style="background-color: blue">数据源</template>-->
					<!--<el-menu-item :index='index("dataSource")'>列表</el-menu-item>-->
					<!--<el-menu-item :index='index("dataSource/upsert")'>更新</el-menu-item>-->
				<!--</el-submenu>-->
				<el-submenu :index='index("groups/groups")'>
					<template slot="title" style="background-color: blue">用户组</template>
					<el-menu-item :index='index("groups/groups")'>组列表</el-menu-item>
					<el-menu-item :index='index("groups/members")'>组成员</el-menu-item>
				</el-submenu>
			</el-menu>
		</div>
		<div style="flex:10; margin:20px">
			<nuxt-child></nuxt-child>
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
import config from "@/config.js";

export default {
	mixins: [component],
	components: {
		[Menu.name]: Menu,
		[MenuItem.name]: MenuItem,
		[Submenu.name]: Submenu,
	},

	data: function() {
		return {
			activeItem: ""
		}
	},

	methods: {
		index(path) {
			if (this.activeItem && this.activeItem.indexOf(path) == 0) {
				return this.activeItem;
			}
			return "/" + config.urlPrefix + "/settings/" + path;
		},
		open(index) {
			if (this.activeItem == index) return;

			this.$router.push(index);
			this.activeItem = index;
		},
	}

}
</script>

<style scoped>
.el-menu-item.is-active {
	border-left: 2px solid gray;
}
</style>
