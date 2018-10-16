<template>
	<div class="navs-container">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item v-for="(path, index) in paths" :key="index">
				<span @click="clickPathItem(index)" class="path-text">{{path}}</span>
			</el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>

<script>
import {
	Breadcrumb,
	BreadcrumbItem,
	Popover,
} from "element-ui";
import mod from "@/components/mods/common/mod.js";
import _ from "lodash";

export default {
	mixins:[mod],
	components: {
		[Breadcrumb.name]:Breadcrumb,
		[BreadcrumbItem.name]:BreadcrumbItem,
		[Popover.name]: Popover,
	},
	props: {
		__data_type__: {
			type:Object, 
			default: function() {
				return {
				}
			}
		},
		__default_data__: {
			type: Object,
			default: function() {
				return {
					path:"",
				}
			}
		},
	},

	data: function() {
		return {
		}
	},
	
	computed: {
		paths() {
			return this.__data__.path.split("/");
		}
	},

	methods: {
		clickPathItem(index){
			const paths = _.slice(this.paths, 0, index + 1);
			this.__data__.path = paths.join("/");
		}
	},

	mounted() {
	}
}
</script>

<style scoped>
.navs-container {
}
.path-text {
	cursor:pointer;
}
</style>
