
<template>
	<div class="bugs-index-container">
		<el-input v-model="__data__.title" placeholder="请输入标题..."></el-input>

		<el-tabs v-model="activeName">
			<el-tab-pane label="编辑" name="write">
				<editors v-if="activeName == 'write'" __style__="codemirror" __default_data__="editorsData"></editors>
			</el-tab-pane>
			<el-tab-pane label="预览" name="preview">
				<modules v-if="activeName == 'preview'" __style__="render" :__default_data__="modulesRenderData" ></modules>
			</el-tab-pane>
		</el-tabs>

		<div>
			<el-button>提交</el-button>
		</div>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			activeName:"write",
			editorsData: {
				text:"",
		   	}
		}
	},

	props: {
	},

	computed: {
	},

	mounted() {

	},
}
</script>

<style lang="less">
</style>

<style lang="less" scoped>
.bugs-index-container {

}
</style>
