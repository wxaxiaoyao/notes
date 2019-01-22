<template>
	<div class="note-container">
		<dialogs __style__="confirm" :__default_data__="dialogsConfirmData"></dialogs>
		<div class="header-container">
			<div class="tip-info">
				{{isModify ? "已修改 Ctrl+S 保存" : "未修改或已自动保存"}}
			</div>
			<el-select 
				class="filename"
				v-if="showFiles"
				v-loading="loading" 
			    v-model="filename" 
				@change="selectDocument"
				size="small"
				clearable
				filterable 
				allow-create 
				default-first-option
				placeholder="文档名">
				<el-option v-for="(x, i) in list" :key="x.filename" :value="x.filename"></el-option>
			</el-select>
			<el-input class="filename" v-else v-model="filename" size="small"></el-input>
			<i @click="showFiles = !showFiles" class="iconfont icon-find" :class="showFiles ? 'files-active' : 'file-active'"></i>
			<i @click="clickDelete()" v-if="__data__.id" class='iconfont icon-delete'></i>
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
			defaultFilename:"未命名",
			loading: false,
			filename:"",
			isModify: false,
			showFiles: false,
			editorData: {
				text:"",

				change: val => this.change(val),
				inited: ref => this.editorInited(ref),
				CtrlS: _ => this.CtrlS(),
			},
			default_data: {
				filename:"",
				id: undefined,
			}
		}
	},

	methods: {
		async clickDelete() {
			const index = _.findIndex(this.lists, o => o.id == this.__data__.id);
			if (index < 0) return;

			this.dialogsConfirmData = {
				visible: true,
				title:"删除确认",
				content:"确定要删除此条记录?",
				success: async () => {
					const result = await this.api.documents.delete({id:x.id});
					if (result.isErr()) return this.$message({message:"删除失败"});
					this.list.splice(index, 1);
					this.lists.splice(index, 1);
				}
			};

			this.filename = this.defaultFilename;
			this.switchDocument();
		},

		async editorInited(ref) {
			this.editor = ref;

			await this.loadDatas();

			this.filename = this.__data__.filename || this.defaultFilename;
			this.switchDocument();
		},
	
		async change({filename, text, cursor}) {
			if (filename != this.filename || text != this.__data__.text) this.isModify = true;
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.CtrlS();
			}, 10000);
		},

		async CtrlS() {
			this.__data__.text = this.editorData.text;
			this.__data__.filename = this.filename;
			this.isModify = false;
			await this.saveData(false);
		},

		async selectDocument() {
			await this.CtrlS();

			this.switchDocument();
		},

		async switchDocument() {
			const index = _.findIndex(this.lists, o => o.filename == this.filename);
			if (index < 0) {
				this.__data__.id = undefined;
				this.__data__.text = "";
				this.__data__.filename = this.filename;
			} else {
				const doc = this.lists[index];
				this.__data__.id = doc.id;
				this.__data__.text = doc.text;
				this.__data__.filename = doc.filename;
			}
			this.editor.setValue({
				filename: this.__data__.filename,
				text: this.__data__.text,
			});
		},
	},

	async mounted() {
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
	align-items: center;
	justify-content: center;
	margin: 4px;
}
.editor {
	flex:1;
}
.tags-container {
	padding:10px 0px;
}
.files-active {
	color: blue;
}
.iconfont {
	font-size: 20px;
	margin: 2px;
}
.filename {
	width: 300px;
}
.tip-info {
	font-size:10px;
	color: gray;
	padding: 0px 10px;
}
</style>
