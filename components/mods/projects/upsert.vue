
<template>
	<div class="projects-upsert-container container">
		<div class="header-container">
			<div class="title">项目-</div>
			<el-button @click="clickListBtn" type="text">列表</el-button>
		</div>
		<el-form label-width="80px">
			<el-form-item label="标题" width="200">
				<el-input v-model="__data__.name" placeholder="请输入标题..."></el-input>
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="__data__.description" type="textarea" :autosize="{minRows:2, maxRows:5}" placeholder="简述 ^-^"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="saveData">提交</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import _ from "lodash";

import common from "./common.js";

export default {
	mixins:[common],

	data: function() {
		return {
		}
	},

	props: {
	},

	computed: {
	},

	methods: {

	},

	async mounted() {
		await this.loadData();
	},
}
</script>

<style lang="less">
</style>

<style lang="less" scoped>
.projects-upsert-container {

}
.header-container {
	display: flex;
	justify-content: space-between;
	margin-top: 15px;

	.title {
		font-weight: bold;
		font-size:20px;
	}
}
.editor {
	line-height: 20px;
	height:400px;
}
</style>
