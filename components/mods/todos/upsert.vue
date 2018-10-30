
<template>
	<div class="todos-upsert-container container">
		<div class="header-container">
			<div class="title">待办事项录入</div>
			<el-button @click="clickListBtn" type="text">列表</el-button>
		</div>
		<el-form label-width="80px">
			<el-form-item label="标题" width="200">
				<el-input v-model="__data__.title" placeholder="请输入标题..."></el-input>
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="__data__.description" type="textarea" :autosize="{minRows:2, maxRows:5}" placeholder="简述 ^-^"></el-input>
			</el-form-item>
			<el-form-item label="标签">
				<tags __style__="input" :__default_data__="__data__.tagsData"></tags>
			</el-form-item>
			<el-form-item label="重要性">
				<el-radio-group v-model="__data__.rate">
					<el-radio :label="1">不重要</el-radio>
					<el-radio :label="2">不紧急</el-radio>
					<el-radio :label="3">一般</el-radio>
					<el-radio :label="4">重要</el-radio>
					<el-radio :label="5">紧急</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="状态">
				<el-radio-group v-model="__data__.state">
					<el-radio :label="0">未开始</el-radio>
					<el-radio :label="1">行动中</el-radio>
					<el-radio :label="2">已完成</el-radio>
					<el-radio :label="3">已废弃</el-radio>
				</el-radio-group>
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
.todos-upsert-container {

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
