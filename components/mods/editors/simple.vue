
<template>
	<div class="simple-editor-container">
		<div class="header-container">
			<div class="header-left-container">
				<a v-if="!isSmallScreen" href="/" class="header-icon iconfont icon-home" data-toggle="tooltip" title="首页"></a>
				<i @click="savePage" v-if="currentPage.url" class="header-icon" :class='currentPage.isRefresh ? "el-icon-loading" : currentPage.isModify ? "iconfont icon-edit" : "iconfont icon-save"'></i>
			</div>
			<div class="header-middle-container">
				<pages __style__="search" class="pages-search"></pages>
				<i @click="clickPreviewBtn" class="iconfont icon-preview" :class="{'preview-active': preview}" data-toggle="tooltip" title="预览 Alt+P"></i>
				<i v-if="isFile && !isSmallScreen" @click="clickOpenBtn" class="iconfont icon-open" data-toggle="tooltip" title="打开"></i>
			</div>
			<userlinks __style__="system"></userlinks>
		</div>
		<div class="body-container">
			<modules v-if="preview" __style__="render" :__default_data__="modulesRenderData" ></modules>
			<editors v-show="!preview" __style__="editor" :__default_data__="editorsEditorData"></editors>
		</div>
	</div>
</template>

<script>

import mousetrap from 'mousetrap';
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	layout: "editor",

	data: function() {
		return {
			modulesRenderData:{text:""},
			editorsEditorData:{
				AltP: () => this.clickPreviewBtn(),
				inited: ref => this.editorInited(ref),
			},
			isFile: false,
			preview: false,
			head: {
				title: "简易编辑器",
			},
			isExistHeader: false,
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
		currentContent: function(content) {
			this.modulesRenderData.text = content || "";
		},
		currentUrl: function(url) {
			if (url && !_.endsWith(url, "/")) this.isFile = true;
			else this.isFile = false;
		}
	},

	methods: {
		editorInited(ref) {
			this.editor = ref;
			const {text} = ref.getValue();
			this.modulesRenderData.text = text;
		},

		clickOpenBtn() {
			this.isFile && window.open("/" + this.currentUrl);
		},

		clickPreviewBtn() {
			this.preview = !this.preview;
			if (!this.preview) {
				setTimeout(() => {
					//console.log(this.editor.codemirror);
					this.editor && this.editor.codemirror && this.editor.codemirror.focus();
				}, 100);
			}
		},

		async savePage() {
			this.editorsEditorData.save && this.editorsEditorData.save();
		},
	}, 

	mounted() {
		mousetrap.bind("alt+p", () => {
			this.clickPreviewBtn();
		});
		//mousetrap.bind("alt+o", () => {
			//this.clickOpenBtn();
		//});
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
.header-left-container {
	margin-left:20px;
}
.body-container {
	position: absolute;
	top: 60px;
	left: 0px;
	right: 0px;
	bottom: 0px;
}
.header-icon {
	/*font-size:20px;*/
	text-decoration: none;
}
.icon-preview {
	color: gray;
}
.preview-active {
	color: blue;
}
</style>
