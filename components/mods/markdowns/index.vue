
<template>
	<div>
		<div v-if="isShowEditor">
			<mavon-editor ref="md" v-model="text" @save="save"></mavon-editor>
		</div>
		<div v-else @dblclick="dblclick">
			 <div v-if="html" v-html="html"></div>
			 <div class="demo-container" v-else>双击编辑</div>
		</div>
	</div>
</template>

<script>
import vue from "vue";
import {mapGetters, mapActions, mapMutations} from "vuex";

import {mavonEditor} from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import component from "@/components/component.js";
import mod from "@/components/mods/common/mod.js";

const md = mavonEditor.getMarkdownIt();

export default {
	mixins: [component, mod],
	layout: "index",

	components: {
		mavonEditor,
	},

	data: function() {
		return {
			isShowEditor: false,
			text:"",
			html:"",
		}
	},

	computed: {
	},

	watch: {
		"__data__.text": function(text) {
			this.text = text;
			this.html = md.render(text);
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					text:"",
				}
			}
		},
	},


	methods: {
		dblclick() {
			this.isShowEditor = true;
		},
		save(text, html){
			this.html = html;
			this.__set_data__({text});
			this.isShowEditor = false;
		},
	},

	mounted() {
		this.text = this.__data__.text || "";
		this.html = md.render(this.text);
	},

	destroyed() {
	}
}
</script>

<style scoped>
.demo-container {
	box-sizing: border-box;
	height:80px;
	padding-top: 30px;
	text-align: center;
	background-color: #ccc;
}
</style>
