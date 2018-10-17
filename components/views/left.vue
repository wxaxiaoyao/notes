<template>
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
			<modDataEditor></modDataEditor>
		</el-tab-pane>
		<el-tab-pane label="教程" name="tutorials">
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import {
	Tabs,
	TabPane,
	Message,
} from "element-ui";
import component from "@/components/component.js";
import modDataEditor from "./modDataEditor.vue";

export default {
	mixins: [component],
	components: {
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,
		//modEditor,
		modDataEditor,
	},

	data: function() {
		return {
			activeTab: "files",
		}
	},

	props: {
	},

	computed: {
		editorActiveTab() {
			return this.getData("editorActiveTab") || "files";
		},
		isPrivacyMode() {
			return this.editorMode == "privacy";
		}
	},

	watch: {
		editorActiveTab: function(val) {
			this.activeTab = val;
		},
	},

	methods: {
	},
}
</script>

<style>
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
</style>
