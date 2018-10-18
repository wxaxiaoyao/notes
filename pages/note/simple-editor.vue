
<template>
	<div class="simple-editor-container">
		<div class="header-container">
			<div>
				<i @click="savePage" v-if="currentPage.url" :class='currentPage.isRefresh ? "el-icon-loading" : currentPage.isModify ? "iconfont icon-edit" : "iconfont icon-save"'></i>
			</div>
			<div class="header-middle-container">
				<pages __style__="search" class="pages-search"></pages>
				<i @click="clickPreviewBtn" class="iconfont icon-preview" :class="{'preview-active': preview}" data-toggle="tooltip" title="预览"></i>
			</div>
			<userlinks __style__="system"></userlinks>
		</div>
		<div class="body-container">
			<mods :text="text" v-if="preview"></mods>
			<editors v-show="!preview" __style__="codemirror" :__default_data__="editorsCodemirrorData"></editors>
		</div>
	</div>
</template>

<script>

import component from "@/components/component.js";

export default {
	mixins: [component],

	layout: "editor",

	middleware: "authenticated",

	head() {
		return {
			title: "简易编辑器",
		}
	},

	data: function() {
		return {
			preview: false,
			text:"",
			storageKey: "__page__",
			editorsCodemirrorData: {
				change: val => this.change(val),
				inited: ref => this.editorInited(ref),
				CtrlS: () => this.savePage(),
			}
		}
	},

	computed: {
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
		clickPreviewBtn() {
			this.preview = !this.preview;
		},

		getTempPage() {
			return g_app.storage.localStorageGetItem(this.storageKey) || {};
		},

		savePageToDB(page){
			page = _.cloneDeep(page || this.currentPage);
			console.log("保存页面到本地存贮", page);
			if (!page.isModify) return ;

			if (page.url) {
				g_app.pageDB.setItem(page);
			} else {
				return g_app.storage.localStorageSetItem(this.storageKey, this.currentPage);
			}
		},

		async savePage() {
			this.savePageToDB();

			if (!this.currentPage.url) return;

			this.currentPage.hash = g_app.util.hash(this.currentPage.content);
			this.currentPage.isRefresh = true;
			const oper = this.currentPage.id ? "update" : "create";
			const result = await this.api.pages[oper](this.currentPage);

			this.currentPage.isRefresh = false;

			if (result.isErr()) return Message("文件保存失败");

			this.currentPage.isModify = false;
		},

		switchPage() {
			const url = this.currentUrl;
			if (_.endsWith(url, "/")) return console.log("url 为目录:", url);
			const page = url ? this.pages[url] : {url:""};
			if (!page || (page.url && !page.loaded) || !this.editor) return console.log("页面不存在或未加载:", page);

			const value = this.editor.getValue();
			if (value.filename == page.url && value.text == page.content) return console.log("正在编辑中...");

			if (this.lastUrl && this.lastUrl != url) {
				console.log("保存旧页面到本地存贮");
				this.lastUrl = url;
				this.savePageToDB(this.pages[this.lastUrl]);
			}

			console.log("切换页面:", page.url);
			const newValue =  {
				filename: page.url,
				text: page.content,
				cursor: page.cursor,
			}

			this.editor.setValue(newValue);
		},

		change({filename, text, cursor}) {
			const url = this.currentUrl;
			this.text = text;
			if (this.currentPage.content != text) this.currentPage.isModify = true;
			this.currentPage.content = text;
			this.currentPage.cursor = cursor;

			this.timer && clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.savePageToDB();
			}, 3000);
		},

		editorInited(ref) {
			this.editor = ref;
			this.editorsCodemirrorData.ref = ref;
			const page = this.getTempPage();
			ref.setValue({filename: page.url, text: page.content, cursor: page.cursor});
		}
	}, 

	mounted() {
	}
}

</script>

<style scoped>
@media (min-width: 768px) {
	.pages-search {
		width:200px;
	}
}
.simple-editor-container {
	position: relative;
	height: 100%;
}

.header-container {
	height: 60px;
	display:flex;
	align-items: center;
	justify-content: space-between;
	background-color: rgb(248,248,248);
}
.pages-search {
	width: 400px;
}
.body-container {
	position: absolute;
	top: 60px;
	left: 0px;
	right: 0px;
	bottom: 0px;
}
.icon-preview {
	color: gray;
}
.preview-active {
	color: blue;
}
</style>
