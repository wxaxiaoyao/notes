
<template>
	<div class="experiences-upsert-container container">
		<el-form label-width="80px">
			<el-form-item label="标题">
				<el-input v-model="__data__.title" placeholder="请输入体验标题"></el-input>
			</el-form-item>
			<el-form-item label="内容">
				<div ref="editor" style="text-align:left"></div>
			</el-form-item>
			<el-form-item>
				<el-button @click="saveData">提交</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import _ from "lodash";
import E from "wangeditor";

import common from "./common.js";

export default {
	mixins:[common],

	data: function() {
		return {
			text:"",
			head: {
				title:"感悟录入",
			},
			default_data: {
				title:"",
				text:"",
			}
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
		const editor = new E(this.$refs.editor);
		editor.customConfig.onchange = html => this.__data__.text = html;
		editor.create();
		editor.txt.html(this.__data__.text || "");
	},
}
</script>

<style lang="less">
</style>

<style lang="less" scoped>
.experiences-upsert-container {
	.el-select {
		width: 100%;
	}
}

.submit-btn-container {
	margin-top:20px;
	display: flex;
	justify-content: center;
}
</style>
