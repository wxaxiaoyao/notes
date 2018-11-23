
<template>
	<div class="bugs-upsert-container container">
		<el-form label-width="80px">
			<el-form-item label="标题">
				<el-input v-model="__data__.title"></el-input>
			</el-form-item>
			<el-form-item label="项目">
				<el-select v-model="__data__.projectId">
					<el-option v-for="(x, i) in projects" :key="i" :label="x.name" :value="x.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态">
				<el-select v-model="__data__.state">
					<el-option v-for="(x, i) in states" :key="i" :label="x.label" :value="x.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-tabs v-model="activeName">
					<el-tab-pane label="编辑" name="editor">
						<editors class="bug-editor-container" v-if="activeName == 'editor'" __style__="codemirror" :__default_data__="editorPreviewData"></editors>
					</el-tab-pane>
					<el-tab-pane label="预览" name="preview">
						<modules class="bug-preview-container" v-if="activeName == 'preview'" __style__="render" :__default_data__="editorPreviewData" ></modules>
					</el-tab-pane>
				</el-tabs>
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
			activeName:"",
			editorPreviewData:{text:""},
			default_data: {
				state:0,
				projectId:0,
			},
			head: {
				title:"BUG录入",
			}
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
		async saveData() {
			const oper = this.__data__.id ? "update" : "create";
			this.__data__.description = this.editorPreviewData.text;
			const result = await this.api.bugs[oper](this.__data__);
			if (result.isErr()) return this.$message({message:"提交失败"});

			this.push(`/note/bugs`);
		},
		
	},

	async mounted() {
		await this.loadProjects();
		await this.loadData();

		this.editorPreviewData.text = this.__data__.description || "";
		this.activeName = "editor";

		this.__data__.state = this.__data__.state || 0;
		this.__data__.projectId = this.__data__.projectId || this.projects[0].id;
	},
}
</script>

<style lang="less">
</style>

<style lang="less" scoped>
.bugs-upsert-container {
	.el-select {
		width: 100%;
	}
}
.bug-editor-container, .bug-preview-container {
	line-height: 20px;
	max-height: 500px;
	overflow-y: auto;
}
.submit-btn-container {
	margin-top:20px;
	display: flex;
	justify-content: center;
}
</style>
