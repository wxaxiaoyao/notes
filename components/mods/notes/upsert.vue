<template>
	<div class="note-container">
		<dialogs __style__="confirm" :__default_data__="dialogsConfirmData"></dialogs>

		<div class="editor-container">
			<editors class="editor" __style__="codemirror" :__default_data__="editorData"></editors>
		</div>
		<div class="toolbar-container">
			<div>
				<el-button size="small" @click="clickListBtn">列表</el-button>
				<el-button size="small" @click="clickNew">新增</el-button>
			</div>
			<div>
				<tags __style__="classify" :__default_data__="tagsData"></tags>
			</div>
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
			editorData: {
				text:"",
				CtrlS: _ => this.CtrlS(),
				inited: ref => this.editorInited(ref),
			},
			default_data: {
				id: undefined,
				text:"",
			}
		}
	},

	methods: {
		async editorInited(ref) {
			this.editor = ref;
			await this.loadData();

			this.editorData.tags = this.__data__.tags || [];
			this.editor.setValue({filename:"", text: this.__data__.text});
		},

		async CtrlS() {
			if (this.__data__.text == this.editorData.text && JSON.stringify(this.__data__.tags) == JSON.stringify(this.tagsData.tags)) return;

			this.__data__.tags = _.cloneDeep(this.tagsData.tags);
			this.__data__.text = this.editorData.text;

			await this.saveData(false);
		},

		async clickNew() {
			await this.CtrlS();

			this.__data__.text = "";
			this.__data__.id = undefined;
			this.tagsData = {tags:[], classify:3};

			this.editor.setValue({filename:"", text:""});
		}
	},

	async mounted() {
	},
}
</script>

<style lang="less" scoped>
.iconfont {
	font-size: 20px;
	margin: 2px;
}
.note-container {
	position: relative;
	height: 100%;
}
.editor-container {
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	z-index: 10;
}
.toolbar-container {
	display: none;
}
</style>
