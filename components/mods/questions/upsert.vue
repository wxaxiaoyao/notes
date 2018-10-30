
<template>
	<div class="questions-upsert-container container">
		<div class="header-container">
			<div class="title">问题录入</div>
			<el-button @click="clickListBtn" type="text">列表</el-button>
		</div>
		<el-form label-width="80px">
			<el-form-item label="标题">
				<el-input v-model="__data__.title" placeholder="请输入需求标题..."></el-input>
			</el-form-item>
			<el-form-item label="标签">
				<tags __style__="input" :__default_data__="tagsData"></tags>
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="__data__.description" type="textarea" :autosize="{minRows:2, maxRows:5}" placeholder="问题简述 ^-^"></el-input>
			</el-form-item>
			<el-form-item label="解答">
				<el-input v-model="__data__.text" type="textarea" :autosize="{minRows:3, maxRows:10}" placeholder="问题解答 ^-^"></el-input>
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
.questions-upsert-container {

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
