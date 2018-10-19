
<template>
	<div class="simple-editor-container">
		<div class="header-container">
			<div class="header-left-container">
				<i @click="savePage" v-if="currentPage.url" :class='currentPage.isRefresh ? "el-icon-loading" : currentPage.isModify ? "iconfont icon-edit" : "iconfont icon-save"'></i>
			</div>
			<div class="header-middle-container">
				<pages __style__="search" class="pages-search"></pages>
				<i @click="clickPreviewBtn" class="iconfont icon-preview" :class="{'preview-active': preview}" data-toggle="tooltip" title="预览 Alt+P"></i>
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
			modulesRenderData:{text:""},
			editorsEditorData:{
				AltP: () => this.clickPreviewBtn(),
			},
			preview: false,
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
	},

	methods: {
		clickPreviewBtn() {
			this.preview = !this.preview;
		},

		async savePage() {
			this.editorsEditorData.save && this.editorsEditorData.save();
		},
	}, 

	mounted() {
		mousetrap.bind("alt+p", () => {
			this.clickPreviewBtn();
		});
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
.icon-preview {
	color: gray;
}
.preview-active {
	color: blue;
}
</style>
