
<template>
	<div class="bugs-upsert-container container">
		<div>
			<div>
				<span>项目</span>
			</div>
			<div>
				<div>
					<span></span>
				</div>
			</div>
		</div>
		<el-input v-model="__data__.title" placeholder="请输入标题..."></el-input>

		<el-tabs v-model="activeName">
			<el-tab-pane label="基本信息" name="baseinfo">
				<el-from label-width="80px">
					<el-from-item label="标题">
						<el-input v-model="__data__.title"></el-input>
					</el-from-item>
					<el-from-item label="项目">
						<el-select v-model="__data__.projectId">
							<el-options v-for="(x, i) in projects" :key="i" :label="x.name" :value="x.id"></el-options>
						</el-select>
					</el-from-item>
					<el-from-item label="状态">
						<el-select v-model="__data__.projectId">
							<el-options v-for="(x, i) in projects" :key="i" :label="x.name" :value="x.id"></el-options>
						</el-select>
					</el-from-item>
				</el-from>
			</el-tab-pane>
			<el-tab-pane label="编辑" name="editor">
				<editors class="bug-editor-container" v-if="activeName == 'editor'" __style__="codemirror" :__default_data__="editorPreviewData"></editors>
			</el-tab-pane>
			<el-tab-pane label="预览" name="preview">
				<modules class="bug-preview-container" v-if="activeName == 'preview'" __style__="render" :__default_data__="editorPreviewData" ></modules>
			</el-tab-pane>
		</el-tabs>

		<div class="submit-btn-container">
			<el-button @click="saveData">提交</el-button>
		</div>
	</div>
</template>

<script>
import _ from "lodash";

import common from "./common.js";

export default {
	mixins:[common],

	data: function() {
		return {
			activeName:"baseinfo",
			editorPreviewData:{text:""},
			projects: [
			{name:"keepwork", projectId:1},
			],
		}
	},

	props: {
	},

	computed: {
	},

	mounted() {
	},

	methods: {
		
	},
}
</script>

<style lang="less">
</style>

<style lang="less" scoped>
.bugs-upsert-container {

}
.bug-editor-container, .bug-preview-container {
	height: 500px;
	overflow-y: auto;
}
.submit-btn-container {
	margin-top:20px;
}
</style>
