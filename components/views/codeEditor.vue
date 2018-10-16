<template>
	<div style="height:100%; width:100%" v-loading="loading" element-loading-text="文件上传中...">
		<el-dialog title="文件上传" :visible.sync="fileUploadDialogVisible" width="500px">
			<div style="color:red; margin-top:-20px; margin-bottom:10px"><b>存在同名文件会覆盖</b></div>
			<el-input v-model="uploadFilename" placeholder="请输入文件名"></el-input>
			<span slot="footer">
				<el-button @click="fileUploadDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="fileUpload">确定</el-button>
			</span>
		</el-dialog>
		<codemirror ref="cm" :value="value" class="kp_forbit_copy" 
			@change="textChange" 
			@save="save" 
			@fileUpload="fileUploadEvent" 
			@cursorActivity="cursorActivity"
			@focus="editorFocus">
		</codemirror>
	</div>
</template>

<script>
import _ from "lodash";
import vue from "vue";
import {Base64} from "js-base64";
import {
	Dialog,
	Input,
	Button,
	Message,
} from "element-ui";

import component from "@/components/component.js";
import codemirror from "@/components/common/codemirror.vue";
import qiniuUpload from "@/api/qiniu.js";
import api from "@/api/notes.js";
import util from "@/lib/util.js";
const tempContentKey = "cmeditor_temp_content";

export default {
	mixins: [component],
    components:{
		[Dialog.name]: Dialog,
		[Input.name]: Input,
		[Button.name]: Button,
		codemirror,
    },
	data: function() {
		return {
			fileUploadDialogVisible: false,
			uploadFilename:"",
			loading: false,
			value:{text:"", filename:null},
			change: {
				timer:undefined,
				filename:undefined,
			},
		};
	},

	computed: {
		codemirror() {
			return this.$refs.cm && this.$refs.cm.codemirror;
		},
		pages() {
			return g_app.getData("pages", {});
		},
		currentPage() {
			if (!this.currentUrl) return {};
			return this.pages[this.currentUrl] || {};
		},
	},

	watch: {
		currentUrl: function(url) {
			this.switchPage();
		},
		currentContent: function(content) {
			this.switchPage();
		},
	},

	methods: {
		getTempPageContent() {
			return this.storage && this.storage.sessionStorageGetItem(tempContentKey)
		},

		savePageToDB(page){
			page = _.cloneDeep(page || this.currentPage);
			if (!page || !page.url || !page.isModify) return ;
			g_app.pageDB.setItem(page);
		},

		editorFocus() {
			this.setData("editorActiveTab", "files");
			this.$store.commit("setCurrentMod", {});
		},

		switchPage() {
			const url = this.currentUrl;
			if (_.endsWith(url, "/")) return console.log("url 为目录:", url);
			const page = url ? this.pages[url] : {url, loaded: true, content: this.getTempPageContent()};
			if (!page || !page.loaded || !this.$refs.cm) return console.log("页面不存在或未加载:", page);

			const value = this.$refs.cm.getValue();
			if (value.filename == page.url && value.text == page.content) return console.log("正在编辑中...");

			console.log("切换页面:", page.url);
			this.value =  {
				filename: page.url,
				text: page.content || "",
				cursor: page.cursor,
			}

			if (this.lastUrl && this.lastUrl != url) {
				this.lastUrl = url;
				this.savePageToDB(this.pages[this.lastUrl]);
			}
		},

		textChange(payload) {
			const self = this;
			const url = this.currentUrl;
			this.setData("__currentContent__", payload.text);

			if (!payload.filename) {
				this.storage && this.storage.sessionStorageSetItem(tempContentKey, payload.text);
				return;
			}

			if (url != payload.filename) return;
			
			if (this.currentPage.content != payload.text) this.currentPage.isModify = true;
			this.currentPage.content = payload.text;
			this.currentPage.cursor = this.codemirror.getDoc().getCursor();

			self.change.timer && clearTimeout(self.change.timer);
			self.change.timer = setTimeout(function(){
				self.savePageToDB();
				//self.save();
			}, 20000);

		},

		async save() {
			if (!this.currentPage || !this.currentPage.url || !this.currentPage.isModify) return ;

			this.currentPage.hash = util.hash(this.currentPage.content);
			this.currentPage.isRefresh = true;
			const result = await this.api.pages.update(this.currentPage);
			if (!result) {
				Message("文件保存失败");
				return;
			}
			this.currentPage.isRefresh = false;
			this.currentPage.isModify = false;
			g_app.pageDB.setItem(this.currentPage);
		},

		fileUploadEvent(file) {
			this.fileUploadDialogVisible = true;
			this.uploadFilename = file.name;
			this.file = file;
		},

		async fileUpload() {
			this.fileUploadDialogVisible = false;
			if (!this.uploadFilename){
				Message("文件名为空, 取消文件上传");
				return;
			};
			const file = this.file;
			const filename = this.uploadFilename;
			const isImage = file.type.indexOf("image") == 0;
			let username = this.user.username;
			let sitename = undefined;
			let path = undefined;
			if (this.currentPage && this.currentPage.url) {
				const paths = this.currentPage.url.split("/");
				username = paths[0];
				sitename = paths[1];
				path = [username, sitename, filename].join("/");	
			} else {
				path = [username, filename].join("/");	
			}
			const key = util.getKeyByPath(path);
			this.loading = true;
			const ok = await qiniuUpload(key, file, null, {
				username,
				sitename,
				filename,
			});

			if (ok) {
				const url = ok.url;
				const cmComp = this.$refs.cm;
				let content = '['+ this.uploadFilename +'](' + url+')'; 
				if (isImage){
					content = "!" + content;	
				}
				cmComp.insertContent(content);
			}

			this.loading = false;
		},

		cursorActivity() {
			const self = this;
			const cursor = self.codemirror.getDoc().getCursor();
			this.setData("__current_line__", cursor.line);

			if (!self.currentPage) return ;

			self.currentPage.cursor = self.codemirror && self.codemirror.getDoc().getCursor();
		},
	},

	mounted() {
		const self = this;
		this.storage = g_app.storage;

		g_app.vue.$on(g_app.consts.EVENT_ADD_MOD_TO_EDITOR, function(style){
			self.value = self.$refs.cm.getValue();
			self.value.text += '\n```@' + style.modName + '/' + style.styleName + '\n' +'```\n';
		});

		self.on(self.EVENTS.__EVENT__CODEMIRROR__IN__SAVE__, function() {
			self.save();
		});

		self.on(self.EVENTS.__EVENT__CODEMIRROR__IN__TEXT_REPLACE__, function(data) {
			
			if (!self.codemirror) return;

			//let content = typeof(data.data) == "string" ? data.data : JSON.stringify(data.data,null, 2);
			let content = typeof(data.data) == "string" ? data.data : g_app.mdconf.jsonToMd(data.data);
			self.codemirror.replaceRange(content + "\n", {line:data.from+1, ch:0}, {line:data.to-1,ch:0});
		
			//console.log(data);
		});
	},

	created() {
	},

}
</script>

<style>
.vue-codemirror {
	height:100%;
}
</style>
