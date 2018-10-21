
<template>
	<div class="draft-page-container">
		<div class="header-container">
			<div class=header-left-container>
				<a class="iconfont icon-home" href="/" data-toggle="tooltip" title="首页"></a>
				<a class="iconfont icon-edit" href="/note/simple-editor" data-toggle="tooltip" title="简易编辑器"></a>
				<i @click="clickPreviewBtn" class="iconfont icon-preview" :class="{'preview-active': preview}" data-toggle="tooltip" title="预览"></i>
			</div>
			<userlinks __style__="system"></userlinks>
		</div>
		<div class="body-container">
			<modules v-if="preview" __style__="render" :__default_data__="modulesRenderData" ></modules>
			<editors v-show="!preview" __style__="codemirror" :__default_data__="editorsCodemirrorData"></editors>
		</div>
	</div>
</template>

<script>
import mousetrap from 'mousetrap';

import mod from "@/components/mods/common/mod.js";

export default {
	mixins: [mod],

	data: function() {
		return {
			modulesRenderData:{text:""},
			preview: false,
			storageKey: "__page__",
			editorsCodemirrorData: {
				change: val => this.change(val),
				inited: ref => this.editorInited(ref),
				CtrlS: () => this.savePage(),
				AltP: () => this.clickPreviewBtn(),
			},
			head: {
				title:"草稿页",
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

	methods: {
		clickPreviewBtn() {
			this.preview = !this.preview;
			if (!this.preview) {
				setTimeout(() => {
					this.editor && this.editor.codemirror && this.editor.codemirror.focus();
				}, 1000);
			}
		},

		savePage() {
			const {text, cursor} = this.editor.getValue();
			this.currentPage.content = text;
			this.currentPage.cursor = cursor;
			g_app.storage.localStorageSetItem(this.storageKey, this.currentPage);
			console.log("保存临时页");
		},

		change({text, cursor}) {
			this.modulesRenderData.text = text;
			this.currentPage.content = text;
			this.currentPage.cursor = cursor;
			this.setCurrentContent(text);

			this.timer && clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				g_app.storage.localStorageSetItem(this.storageKey, this.currentPage);
			}, 3000);
		},

		editorInited(ref) {
			this.editor = ref;
			this.editorsCodemirrorData.ref = ref;
			const page = g_app.storage.localStorageGetItem(this.storageKey) || {};
			ref.setValue({filename: page.url, text: page.content, cursor: page.cursor});
		}
	}, 

	mounted() {
		mousetrap.bind("alt+p", () => {
			this.clickPreviewBtn();
		});
	}
}

</script>

<style scoped>
.draft-page-container {
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
