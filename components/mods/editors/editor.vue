
<template>
	<editors __style__="codemirror" :__default_data__="editorsCodemirrorData"></editors>
</template>

<script>
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			storageKey: "__page__",
			editorsCodemirrorData: {
				change: val => this.change(val),
				inited: ref => this.editorInited(ref),
				CtrlS: () => this.savePage(),
				AltP: cm => this.__data__.AltP && this.__data__.AltP(cm),
			}
		}
	},

	props: {
		__default_data__: {
			type: Object, 
			default: function() {
				return {
				}
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
		savePageToDB(page){
			page = _.cloneDeep(page || this.currentPage);

			console.log("保存页面到本地存贮", page);

			page.hash = g_app.util.hash(page.content);
			if (page.url) {
				page.isModify = false;
				g_app.pageDB.setItem(page);
			} else {
				return g_app.storage.localStorageSetItem(this.storageKey, this.currentPage);
			}

			this.timer && clearTimeout(this.timer);
		},

		async savePage() {
			if (!this.currentPage.isModify) return;

			if (!this.currentPage.url) return this.savePageToDB(this.currentPage);

			this.currentPage.hash = g_app.util.hash(this.currentPage.content);
			this.currentPage.isRefresh = true;
			const oper = this.currentPage.id ? "update" : "create";
			const result = await this.api.pages[oper](this.currentPage);

			this.currentPage.isRefresh = false;
			if (result.isErr()) return Message("文件保存失败");
			this.currentPage.isModify = false;

			this.savePageToDB(this.currentPage);
		},

		switchPage() {
			const url = this.currentUrl;
			if (_.endsWith(url, "/")) return console.log("url 为目录:", url);
			const page = url ? this.pages[url] : {...this.currentPage, loaded:true};
			if (!page || (page.url && !page.loaded) || !this.editor) return console.log("页面不存在或未加载:", page);

			const value = this.editor.getValue();
			if ((value.filename || "") == (page.url || "") && value.text == page.content) return console.log("正在编辑中...");
			//console.log(value, page);

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
			this.setCurrentContent(text);

			const url = this.currentUrl;
			if ((url||"") != (filename||"")) return console.log(`更新:${filename} 当前:${url}`);
			if (this.currentPage.content != text) this.currentPage.isModify = true;
			this.currentPage.content = text;
			this.currentPage.cursor = cursor;

			const page = _.cloneDeep(this.currentPage);
			this.timer && clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.savePageToDB(page);
			}, 3000);
		},

		editorInited(ref) {
			this.editor = ref;
			this.editorsCodemirrorData.ref = ref;

			if (!this.currentUrl) {
				const page = g_app.storage.localStorageGetItem(this.storageKey) || {};
				ref.setValue({filename: page.url, text: page.content, cursor: page.cursor});
			}

			this.__data__.inited && this.__data__.inited(ref);
		}
	}, 

	mounted() {
		this.__data__.save = () => this.savePage();
	}
}

</script>

<style>
</style>

<style scoped>
@media screen and (max-width: 768px) {
	.pages-search {
		width:200px;
	}
}

@media screen and (min-width: 768px) {
	.pages-search {
		width:400px;
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
