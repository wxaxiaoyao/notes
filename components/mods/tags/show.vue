<template>
	<div class="tags-show-container">
		<el-tag v-for="(tag, index) in __data__.tags" :key="index" 
			:color="__data__.color" 
			:size="__data__.size"
			:disable-transitions="false">
			{{tag}}
		</el-tag>
	</div>
</template>

<script>
import {
	Tag,
} from "element-ui";

import mod from "@/components/mods/common/mod.vue";
export default {
	mixins: [mod],
	components: {
		[Tag.name]: Tag,
	},

	data: function() {
		return {
			defaultData: {
				tags:[],
				color:"white",
				size: "small",
			}
		}
	},

	props: {
	},

	methods: {
	},

	mounted() {
	}
}

</script>

<style lang="scss">
.tags-show-container {
	.el-tag + .el-tag {
		margin-left: 10px;
	}
}
</style>

<style scoped>
.tags-show-container {
	overflow-x: auto;
	cursor: pointer;
	padding-bottom:2px;
	white-space: nowrap;
}
.tags-show-container::-webkit-scrollbar {
	width:1px;
	height:4px;
}
.tags-show-container::-webkit-scrollbar-thumb {
	border-radius: 1px;
	-webkit-box-shadow: inset 0 0 0px rgba(0,0,0,0.2);
	background-color: gray;
}
.tags-show-container::-webkit-scrollbar-track {
	border-radius: 1px;
	-webkit-box-shadow: inset 0 0 0px rgba(0,0,0,0.2);
	background-color: #EDEDED;
}
</style>
