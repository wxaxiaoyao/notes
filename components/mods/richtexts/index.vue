
<template>
	<div>
		<div v-if="isShowEditor">
			<quill-editor 
				class="quill-editor"
				v-model="content" 
				:options="editorOption">
			</quill-editor>
		</div>
		 <div v-else @dblclick="dblclick" class="ql-editor"> 
			 <div v-if="content" v-html="content"></div>
			 <div class="demo-container" v-else>双击编辑</div>
		</div>
	</div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
const quillEditor = () => import("vue-quill-editor");
import mod from "@/components/mods/common/mod.js";
//import hljs from 'highlight.js';
export default {
	mixins:[mod],
	components: {
		quillEditor: (resolve, reject) => {
			quillEditor().then(data => resolve(data.quillEditor), reject);
		},
	},

	data: function(){
		const self = this;
		return {
			isShowEditor: false, 
			content: "",
			editorOption: {
				modules: {
					//syntax: {
						//highlight: text => hljs.highlightAuto(text).value,
					//},
					toolbar: [
					['bold', 'italic', 'underline', 'strike'],
					['blockquote', 'code-block'],
					[{ 'list': 'ordered' }, { 'list': 'bullet' }],
					[{ 'script': 'sub' }, { 'script': 'super' }],
					[{ 'indent': '-1' }, { 'indent': '+1' }],
					[{ 'direction': 'rtl' }],
					[{ 'size': ['small', false, 'large', 'huge'] }],
					[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
					[{ 'font': [] }],
					[{ 'color': [] }, { 'background': [] }],
					[{ 'align': [] }],
					['clean'],
					['link', 'image', 'video'],
					],
					keyboard: {
						bindings: {
							save: {
								key:'S',
								ctrlKey: true,
								handler: function(range, context) {
									self.save();
								},
							}
						},
					}
				}
			}
		}
	},

	computed: {
	},

	mounted() {
		this.content = this.__data__.text || "";
	},

	methods: {
		save() {
			this.isShowEditor = false;
			this.__set_data__({text:this.content});
		},
		dblclick() {
			this.isShowEditor = true;
		},
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
.quill-editor {
	/*min-height: 300px;*/
	max-height: 400px;
	overflow-y: auto;
}
</style>
