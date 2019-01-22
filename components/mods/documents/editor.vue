<template>
	<div class="note-container">
		<dialogs __style__="confirm" :__default_data__="dialogsConfirmData"></dialogs>
		<div class="header-container">
			<!--div class="tip-info">
				{{isModify ? "已修改 Ctrl+S保存" : "未修改或已自动保存"}}
			</div-->
			<i @click="CtrlS" :class='isModify ? "iconfont icon-edit" : "iconfont icon-save"'></i>
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
			<el-input class="filename" v-else @blur="filenameBlur" v-model="filename" size="small"></el-input>
			<i @click="showFiles = !showFiles" class="iconfont icon-find" :class="showFiles ? 'files-active' : 'file-active'"></i>
			<i @click="clickDelete" v-if="__data__.id" class='iconfont icon-delete'></i>
			<div>
				<tags __style__="input" :__default_data__="tagsData"></tags>
			</div>
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
				text:"",
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
					const result = await this.api.documents.delete({id:this.__data__.id});
					if (result.isErr()) return this.$message({message:"删除失败"});
					this.list.splice(index, 1);
					this.lists.splice(index, 1);
					this.filename = this.defaultFilename;
					this.switchDocument();
				}
			};
		},

		async editorInited(ref) {
			this.editor = ref;

			await this.loadDatas();

			this.filename = this.__data__.filename || this.defaultFilename;
			this.switchDocument();
		},
	
		filenameBlur() {
			if (!this.filename) {
				this.filename = this.__data__.filename;
				return;
			}

			if (this.__data__.filename != this.filename) this.isModify = true;
			this.__data__.filename = this.filename;
			this.__data__.isModify = this.isModify;
		},

		async change({filename="", text, cursor}) {
			if (filename != this.filename || text != this.__data__.text) this.isModify = true;
			if (!this.isModify) return;
			console.log(this.__data__.filename == filename, this.__data__.filename, filename, this.filename);
			console.log(this.__data__.text == text, this.__data__.text, text);
			console.log(this.__data__);
			this.__data__.isModify = true;
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.CtrlS();
			}, 10000);
		},

		async CtrlS() {
			if (!this.__data__.isModify) return;
			this.__data__.text = this.editorData.text;
			//this.__data__.filename = this.filename;
			this.isModify = false;
			await this.saveData(false);
		},

		async selectDocument() {
			if (!this.filename) return;

			await this.CtrlS();

			this.switchDocument();
		},

		switchDocument(filename) {
			filename = filename || this.filename || this.defaultFilename;
			const index = _.findIndex(this.lists, o => o.filename == filename);
			if (index < 0) {
				this.__data__.id = undefined;
				this.__data__.text = "";
				this.__data__.filename = filename;
				this.tagsData = {tags:[]};
			} else {
				const doc = this.lists[index];
				this.__data__.id = doc.id;
				this.__data__.text = doc.text;
				this.__data__.filename = doc.filename;
				this.tagsData = {tags:doc.tags.split("|").filter(o => o)};
			}
			//console.log(this.__data__);
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
