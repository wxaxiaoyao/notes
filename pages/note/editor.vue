<template>
	<div class="editor-container">
		<headers __style__="editor" :__default_data__="headersData"></headers>
		<div class="editor-main-container">
			<div class="editor-main-content-container"
				@mouseup="splitStripMouseup"
				@mousemove="splitStripMousemove"
				@mouseleave="splitStripMouseup">
				<div ref="splitStrip1" :style="leftContainerStyle" class="editor-left-content-container">
					<el-tabs v-model="activeTab" class="left-el-tabs" type="border-card">
						<el-tab-pane label="文件" name="files">
							<div class="kp_forbit_copy" style="margin-bottom:60px">
								<pages __style__="recent"></pages>
								<div v-show="!isPrivacyMode">
									<pages :__default_data__="{mode:'normal'}" __style__="usertree"></pages>
								</div>
								<div v-show="isPrivacyMode">
									<pages :__default_data__="{mode:'privacy'}"  __style__="usertree"></pages>
								</div>
							</div>
						</el-tab-pane>	
						<el-tab-pane label="模块" name="mods">
						</el-tab-pane>
						<el-tab-pane label="数据" name="baseCompEditor">
						</el-tab-pane>
						<el-tab-pane label="教程" name="tutorials">
						</el-tab-pane>
					</el-tabs>
					<div v-if="headersData.isShowWorkspace" class="split-strip kp_forbit_copy" @mousedown="splitStripMousedown('splitStrip1')"></div>
				</div>
				<div class="editor-right-content-container" :style="rightContainerStyle">
					<div ref="splitStrip2" class="code-container" :style="codeContainerStyle" v-show="viewMode != 'preview'">
						<div class="code-content-container" >
							<editors __style__="editor" :__default_data__="editorsEditorData"></editors>
						</div>
					</div>
					<div v-if="viewMode== 'code-preview'" class="split-strip kp_forbit_copy" @mousedown="splitStripMousedown('splitStrip2')"></div>
					<div class="preview-container" v-show="viewMode != 'code'">
						<div class="preview-content-container">
							<modules __style__="render" :__default_data__="modulesRenderData" ></modules>
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
	Tabs,
	TabPane,
} from "element-ui";
import vue from "vue";
import _ from "lodash";

import component from "@/components/component.js";

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
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,
	},
	middleware: "authenticated",
	layout: "editor",
	data: function() {
		const self = this;
		return {
			activeTab: "files",
			modulesRenderData:{text:"", mode:"editor"},
			editorsEditorData: {},
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
		editorActiveTab() {
			return this.getData("editorActiveTab") || "files";
		},

		isPrivacyMode() {
			return this.editorMode == "privacy";
		},

		text() {
			return this.getData("__currentContent__") || "";
		},

		codemirror() {
			return this.$refs.codemirror.codemirror;
		},
	},

	watch:{
		editorActiveTab: function(val) {
			this.activeTab = val;
		},
		text(val) {
			this.modulesRenderData.text = val;
		},
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
				this.editorsEditorData.save && this.editorsEditorData.save();
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

	created() {
		if (this.isSmallScreen) {
			return this.pushName("simple-editor");
		}
	},

	mounted() {
		const self = this;
		self.unhandle();
	},
}
</script>

<style lang="less">
html, body {
	height:100%;
	margin: 0px;
	overflow-y: hidden;
	overflow-x: hidden;
}
.editor-container {
	.el-tabs, .el-tab-pane {
		height:100%;
		width: 100%;
		border: 0px;
	}
	.left-el-tabs {
		height:100%;
		padding:0px;
	}
	.left-el-tabs .el-tabs__content  {
		height:100%;
		padding:0px;
	}
	.left-el-tabs .el-tabs__header.is-left {
		margin-right:0px;
	}
	.left-el-tabs .el-tab-pane {
		overflow-y:auto;
	}
	.left-el-tabs .el-tab-pane::-webkit-scrollbar {
		display: none;
	}
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
