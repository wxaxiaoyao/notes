
<template>
	<div class="note-container container">
		<div class="header-container">
			<div class="title">便条录入</div>
			<el-button @click="clickListBtn" type="text">列表</el-button>
		</div>
		<div class="tags-container">
			<tags __style__="classify" :__default_data__="tagsData"></tags>
		</div>
		<editors class="editor" __style__="codemirror" :__default_data__="editorData"></editors>
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
				tags:[],
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
		this.tagsData = {tags: this.__data__.tags, classify:3};
	},
}
</script>

<style>
</style>

<style lang="less" scoped>
.note-container {
	display: flex;
	flex-direction: column;
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
	flex:1;
}

.tags-container {
	padding:10px 0px;
}
</style>
