<template>
	<div class="editor-container">
		<headers __style__="editor" :__default_data__="headersData"></headers>
		<div class="editor-main-container">
			<div class="editor-main-content-container" v-if="isSmallScreen">
				<left v-show="viewMode == 'files' || viewMode == 'code-preview'"></left>
				<code-editor v-show="viewMode == 'code'" ref="codemirror"></code-editor>
				<div v-show="viewMode== 'preview'" class="preview-container">
					<mods :text="text" mode="editor"></mods>
				</div>
			</div>
			<div v-else 
				class="editor-main-content-container"
				@mouseup="splitStripMouseup"
				@mousemove="splitStripMousemove"
				@mouseleave="splitStripMouseup">
				<div ref="splitStrip1" :style="leftContainerStyle" class="editor-left-content-container">
					<left></left>
					<div v-if="headersData.isShowWorkspace" class="split-strip kp_forbit_copy" @mousedown="splitStripMousedown('splitStrip1')"></div>
				</div>
				<div class="editor-right-content-container" :style="rightContainerStyle">
					<div ref="splitStrip2" class="code-container" :style="codeContainerStyle" v-show="viewMode != 'preview'">
						<div class="code-content-container" >
							<code-editor ref="codemirror"></code-editor>
						</div>
					</div>
					<div v-if="viewMode== 'code-preview'" class="split-strip kp_forbit_copy" @mousedown="splitStripMousedown('splitStrip2')"></div>
					<div class="preview-container" v-show="viewMode != 'code'">
						<div class="preview-content-container">
							<mods :text="text" mode="editor"></mods>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	ButtonGroup,
	Popover,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Dialog,
	Form,
	FormItem,
} from "element-ui";
import vue from "vue";
import lodash from "lodash";

import component from "@/components/component.js";
import {tags} from "@/lib/tags";
import left from "@/components/views/left.vue";
//import codeEditor from "@/components/views/codeEditor.vue";

export default {
	mixins: [component],
	components: {
		[ButtonGroup.name]: ButtonGroup,
		[Popover.name]: Popover,
		[Dropdown.name]:Dropdown,
		[DropdownMenu.name]:DropdownMenu,
		[DropdownItem.name]:DropdownItem,
		[Dialog.name]: Dialog,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		left,
		codeEditor: () => import("@/components/views/codeEditor.vue"),
	},
	middleware: "authenticated",
	layout: "editor",
	data: function() {
		const self = this;
		return {
			viewMode:"code-preview",
			splitStrip1_width:"350px",
			splitStrip2_width:"50%",
			value:undefined,
			themeContent: "",
			themes:{},
			codeContainerStyle:{width:null},
			leftContainerStyle:{width:null, display:"flex"},
			rightContainerStyle:{width:null},
			headersData: {
				key:"test",
				isShowWorkspace: true,
				handleCommand: cmd => self.handleHeadersCommand(cmd),
			},
		}
	},
	
	filters: {
	},

	computed: {
		text() {
			return this.getData("__currentContent__") || "";
		},

		codemirror() {
			return this.$refs.codemirror.codemirror;
		},
	},

	watch:{
	},

	methods: {
		handleHeadersCommand(cmd) {
			console.log(cmd);
			if (cmd == "view-code") {
				this.codeContainerStyle.width = "100%";
				this.viewMode = "code";
			} else if(cmd == "view-preview") {
				this.codeContainerStyle.width = "0%";
				this.viewMode = "preview";
			} else if(cmd == "view-code-preview"){
				this.codeContainerStyle.width = "50%";
				this.viewMode = "code-preview";
			} else if(cmd == "view-workspace") {
				this.headersData.isShowWorkspace = !this.headersData.isShowWorkspace;
				if (this.isSmallScreen) {
					this.viewMode = "files";
				} else {
					const isShowWorkspace = this.headersData.isShowWorkspace;
					this.leftContainerStyle.display = isShowWorkspace ? "block" : "none";
					//this.leftContainerStyle.width = isShowWorkspace ? "15%" : "0px";
					this.rightContainerStyle.width = isShowWorkspace ? "85%" : "100%";
				}
			} else if(cmd == "save") {
				this.clickSaveBtn();
			}
		},

		clickViewModelBtn(mode) {
			const self = this;
			self.viewMode = mode;
			const timer = setInterval(()=> {
				if (!self.codemirror) return;
				clearInterval(timer);

				const doc = self.codemirror.getDoc();
				doc.setCursor(doc.getCursor());
			}, 10);
		},

		splitStripMousedown(typ) {
			if (!typ) return;
			const el = this.$refs[typ];
			this.splitStrip = {
				el: el,
				parentEl: el.parentElement,
				typ: typ,
				key: typ == "splitStrip1" ? "leftContainerStyle" : "codeContainerStyle",
				startX: event.clientX,
				leftWidth: el.offsetWidth,
			};
			//console.log(event, typ, this.splitStrip);
		},
		splitStripMousemove() {
			if (!this.splitStrip) return;

			// 移动的时候显示
			this.splitStrip.el.style.display = "";

			let key = this.splitStrip.key;
			let startX = this.splitStrip.startX;
			let leftWidth = this.splitStrip.leftWidth;
			let newLeftWidth = leftWidth + event.clientX - startX;

			if (this.splitStrip.typ == "splitStrip1" && newLeftWidth > 500) newLeftWidth = 500;
			
			this[key].width = newLeftWidth + "px";
			//console.log(newLeftWidth, leftWidth, event.clientX, startX);
		},

		splitStripMouseup() {
			this.splitStrip = undefined;
		},

		clickSaveBtn() {
			this.emit(this.EVENTS.__EVENT__CODEMIRROR__IN__SAVE__);
		},

		// 无操作
		unhandle() {
			const self = this;
			let el = this;
			while(el.$parent) el = el.$parent;
			el = el.$el;

			let lastHandleTime = (new Date()).getTime();
			const handle = () => { lastHandleTime = (new Date()).getTime(); };
			el.addEventListener("click", handle);
		    el.addEventListener("keydown", handle);
			el.addEventListener("mousemove", handle);
		    el.addEventListener("mousewheel", handle);

			setInterval(() => {
				const currentTime = (new Date()).getTime();
				const time = currentTime - lastHandleTime;
				if (time < 10 * 60 * 1000) return;
				// 10 分钟无操作

				if (self.editorMode == "privacy") {
					self.setEditorMode("normal");
				}
				
			}, 5 * 60 * 1000);
		}
	},
	mounted() {
		const self = this;
		self.unhandle();

		setTimeout(() => {
			const hash = decodeURIComponent(window.location.hash || "");
			self.setCurrentUrl(hash.substring(1));
		}, 100);
	},
}
</script>

<style>
html, body {
	height:100%;
	margin: 0px;
	overflow-y: hidden;
	overflow-x: hidden;
}
</style>
<style scoped>
.active-btn {
	background-color: blue;
}
.editor-container {
	height: 100%;
}
.editor-main-container {
	position: absolute;
	left: 0px;
	right: 0px;
	top:60px;
	bottom: 0px;
}
.editor-main-content-container {
	max-width:100%;
	height:100%;
	display: flex;
}
.editor-left-content-container {
	height:100%;
	display:flex;
	min-width:300px;
	width:15%;
}
.editor-right-content-container {
	height:100%;
	display:flex;
	width: 85%;
}
.code-container {
	height:100%;
	width:49%;
},
.preview-container {
	display:flex;
	height:100%;
	width:49%;
}
.code-content-container {
	height:100%;
	flex:1;
}
.preview-content-container {
	flex:1;
	overflow-y:auto; 
}
.preview-content-container::-webkit-scrollbar {
	display: none;
}
.split-strip {
	height:100%;
	width: 5px;
	background-color:rgb(168,168,168);
	cursor: col-resize;
}
</style>
