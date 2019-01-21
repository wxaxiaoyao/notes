
<template>
	<div class="note-container container">
		<div class="header-container">
			<div class="title">便条录入</div>
			<el-button @click="clickListBtn" type="text">列表</el-button>
		</div>
		<el-form label-width="80px">
			<el-form-item label="标题">
				<el-input v-model="__data__.title" placeholder="请输入需求标题..."></el-input>
			</el-form-item>
			<el-form-item label="标签">
				<tags __style__="classify" :__default_data__="tagsData"></tags>
			</el-form-item>
			<el-form-item label="描述">
				<editors class="editor" __style__="codemirror" :__default_data__="editorData"></editors>
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
			editorData: {
				text:"",
			},
			default_data: {
				classifyTags:[],
			},
		}
	},

	methods: {
		async CtrlS() {
			this.__data__.text = this.editorData.text;
			await this.saveData(false);
		}
	},

	async mounted() {
		await this.loadData();
		this.editorData = {text: this.__data__.text || "", CtrlS: _ => this.CtrlS(),};
		this.tagsData = {tags: this.__data__.classifyTags, classify:3};
	},
}
</script>

<style>
</style>

<style lang="less" scoped>
.note-container {
	height: 100%;
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
