
<template>
	<div class="inputs-markdown-container">
		<div v-if="__data__.editable" class="toolbar-container">
			<i v-if="editing" @click="editing=false" class="iconfont icon-preview"></i>
			<i v-else @click="editing=true" class="iconfont icon-pencil"></i>
		</div>
		<editors v-if="editing" __style__="codemirror" :__default_data__="editorsCodemirrorData"></editors>
		<modules v-else __style__="render" :__default_data__="modulesRenderData"></modules>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			editing: false,
			modulesRenderData:{
				text:"",
				templateStyle:"blank",
			},
			editorsCodemirrorData: {
				inited: ref => this.editorInited(ref),
				change: val => this.change(val),
			},
			defaultData: {
				text:"markdown text",
				editable: false,
			}
		}
	},

	computed: {
		size() {
			return this.__data__.size || "small";
		}
	},

	watch: {
		"__data__.text": function(text) {
			this.modulesRenderData.text = this.__data__.text;
			this.editorsCodemirrorData.text = this.__data__.text;
		}
	},

	methods: {
		change({text}) {
			this.modulesRenderData.text = text;
			this.editorsCodemirrorData.text = text;
			this.__data__.text = text;
		},
		editorInited(ref) {
			this.editor = ref;
		},
	},

	mounted() {
		this.modulesRenderData.text = this.__data__.text;
		this.editorsCodemirrorData.text = this.__data__.text;
	}
}
</script>

<style>
</style>

<style scoped>
.inputs-markdown-container {
	position:relative;
	height:100%;
	width:100%;
}

.toolbar-container {
	z-index:10;
	position: absolute;
	top:2px;
	right: 2px;
}
</style>
