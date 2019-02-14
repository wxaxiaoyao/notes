<template>
	<div class="note-container">
		<dialogs __style__="confirm" :__default_data__="dialogsConfirmData"></dialogs>
		<div class="menu-container">
			<i @click="isShowLeftBar = !isShowLeftBar" class='iconfont icon-menu'></i>
			<i @click="CtrlS" :class='isModify ? "iconfont icon-edit" : "iconfont icon-save"'></i>
		</div>
		<div class="main-container">
			<div class="left-container" v-if="isShowLeftBar">
				<el-form label-width="60px" size="small">
					<el-form-item label="列表">
						<el-select 
							style="width:100%"
							v-loading="loading" 
							v-model="filename" 
							@change="selectDocument"
							clearable
							filterable 
							allow-create 
							default-first-option
							placeholder="文档名">
							<el-option v-for="(x, i) in list" :key="x.filename" :value="x.filename"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="名称">
						<el-input @blur="filenameBlur" v-model="filename" placeholder="文档名"></el-input>
					</el-form-item>
					<el-form-item label="标签">
						<tags __style__="classify" :__default_data__="tagsData"></tags>
					</el-form-item>
					<el-form-item label="">
						<el-button @click="CtrlS">保存</el-button>
						<el-button @click="clickNew">新增</el-button>
						<el-button @click="clickDelete">删除</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="right-container">
				<editors class="editor" __style__="codemirror" :__default_data__="editorData"></editors>
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
			storageKey:"__document__",
			defaultFilename:"",
			loading: false,
			filename:"",
			isModify: false,
			isShowLeftBar: false,
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
					this.filename = this.lists.length > 0 ? this.lists[0].filename : this.defaultFilename;
					this.switchDocument();
				}
			};
		},

		async clickNew() {
			this.filename = "";
			await this.selectDocument();
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
			//console.log(this.__data__.filename == filename, this.__data__.filename, filename, this.filename);
			//console.log(this.__data__.text == text, this.__data__.text, text);
			//console.log(this.__data__);
			this.__data__.isModify = true;
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.CtrlS();
			}, 10000);
		},

		async CtrlS() {
			if (!this.__data__.filename) {
				g_app.storage.localStorageSetItem(this.storageKey, this.__data__);
				return;
			}
			if (!this.__data__.isModify) return;
			this.__data__.text = this.editorData.text;
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
			let doc = {id:undefined, text:"", filename};

			if (index < 0) {
				if (!filename) {
					doc = g_app.storage.localStorageSetItem(this.storageKey) || doc;
				}
			} else {
				doc = this.lists[index];
			}

			this.__data__.id = doc.id;
			this.__data__.text = doc.text;
			this.__data__.filename = doc.filename;
			this.tagsData = {tags:doc.tags || []};

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

<style lang="less" scoped>
.iconfont {
	font-size: 20px;
	margin: 2px;
}
.note-container {
	position: relative;
	height: 100%;
}
.menu-container {
	z-index:10000;
	position: fixed;
	top: 0px;
	left: 10px;
	height: 60px;
	display: flex;
	align-items: center;
}
.main-container {
	height: 100%;
	display: flex;
	overflow-y: hidden;
}
.left-container {
	height: 100%;
	width: 300px;
	padding:10px;
}
.right-container {
	flex:1;
	height:100%;
}
.tags-container {
	padding:10px 0px;
}
</style>
