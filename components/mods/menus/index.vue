
<template>
	<div>
		<el-menu :default-active="__data__.activeIndex" class="el-menu-demo" mode="vertical" router>
			<el-menu-item v-for='(x, index) in __data__.menus' :key="index" :index="x.index">{{x.label}}</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
import {
	Menu,
	Submenu,
	MenuItem,
} from "element-ui";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	components: {
		[Menu.name]: Menu,
		[Submenu.name]: Submenu,
		[MenuItem.name]: MenuItem,
	},

	props: {
		__data_type__: {
			type:Object,
			default: function() {
				return {};
			}
		},

		__default_data__: {
			type: Object,
			default: function() {
				return {
					activeIndex:"",
					menus:[
					{
						label:"主页",
						index:"/note",
					},
					],
				}
			} 
		},
	},

	data: function() {
		return {
		}
	},

	methods: {
		handleSelect(index, indexPath) {
		}
	},
	
	mounted() {
	}
}
</script>
