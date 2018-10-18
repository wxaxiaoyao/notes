
<template>
	<div class="draft-page-container">
		<div class="header-container">
			<i @click="clickPreviewBtn" class="iconfont icon-preview" :class="{'preview-active': preview}"></i>
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

	layout: "blank",

	data: function() {
		return {
			preview: false,
			text:"",
			storageKey: "__draft_page__",
			editorsCodemirrorData: {
				change: val => this.change(val),
				inited: ref => this.editorInited(ref),
			}
		}
	},

	methods: {
		clickPreviewBtn() {
			this.preview = !this.preview;
		},

		change(value) {
			this.text = value.text;
			this.timer && clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				g_app.storage.localStorageSetItem(this.storageKey, value);
			}, 3000);
		},

		editorInited(ref) {
			this.editor = ref;
			this.editorsCodemirrorData.ref = ref;
			const value = g_app.storage.localStorageGetItem(this.storageKey) || {};
			ref.setValue(value);
		}
	}, 

	mounted() {
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
.body-container {
	position: absolute;
	top: 60px;
	left: 0px;
	right: 0px;
	bottom: 0px;
}
.icon-preview {
	margin-left:20px;
	color: gray;
}
.preview-active {
	color: blue;
}
</style>
