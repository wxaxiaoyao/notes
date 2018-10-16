
<template>
	<div class="headers-container">
		<dialogs __style__="confirmpwd" :__default_data__="confirmPwdData"></dialogs>
		<el-dropdown class="menu" @command="handleCommand" :trigger="isSmallScreen ? 'click' : 'hover'">
			<i class="iconfont icon-menu el-dropdown-link"></i>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="save"><span>保存</span></el-dropdown-item>
				<el-dropdown-item divided command="privacy"><span>私密模式<i v-if="isPrivacyMode" class="iconfont icon-ok"></i></span></el-dropdown-item>
				<el-dropdown-item v-if="!isSmallScreen" divided command="view-workspace">
					<span>工作区<i v-if="isShowWorkspace" class="iconfont icon-ok"></i></span>
				</el-dropdown-item>
				<el-dropdown-item v-else divided command="view-code-preview">
					<span>文件<i v-if="viewMode == 'view-code-preview'" class="iconfont icon-dot"></i></span>
				</el-dropdown-item>
				<el-dropdown-item command="view-code">编辑<i v-if="viewMode == 'view-code'" class="iconfont icon-dot"></i></el-dropdown-item> <el-dropdown-item command="view-preview">预览<i v-if="viewMode == 'view-preview'" class="iconfont icon-dot"></i></el-dropdown-item>
				<el-dropdown-item v-if="!isSmallScreen" command="view-code-preview">拆分<i v-if="viewMode == 'view-code-preview'" class="iconfont icon-dot"></i></el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<pagenavs __style__="editor"></pagenavs>
		<userlinks __style__="system"></userlinks>
	</div>
</template>

<script>
import {
	Dropdown,
	DropdownMenu,
	DropdownItem,
} from "element-ui";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins: [mod],

	components: {
		[Dropdown.name]:Dropdown,
		[DropdownMenu.name]:DropdownMenu,
		[DropdownItem.name]:DropdownItem,
	},

	data: function() {
		const self = this;
		return {
			viewMode: "view-code-preview",
			confirmPwdData: {
				visible: false, 
				primary: "confirm",
				success: () => {
					self.setEditorMode("privacy");
				}
			},
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
				}
			}
		}
	},

	computed: {
		isShowWorkspace() {
			return this.__data__.isShowWorkspace;
		},
		isPrivacyMode() {
			return this.editorMode == "privacy";
		}
	},

	methods: {
		handleCommand(cmd) {
			if (cmd == "privacy"){
				if (this.isPrivacyMode) {
					this.setEditorMode("normal");
				} else {
					this.$set(this.confirmPwdData, "visible", true);
				}
				return;
			} 

			if (cmd == "view-code" || cmd == "view-preview" || cmd == "view-code-preview") this.viewMode = cmd;
			this.__data__.handleCommand && this.__data__.handleCommand(cmd);
		}
	},

	mounted() {
	}
}
</script>

<style scoped>
.headers-container {
	display:flex;
	align-items: center;
	justify-content: space-between;
	height: 60px;
	background-color: rgb(248,248,248);
}

.menu {
	margin-left: 20px;
}
.el-dropdown-menu__item {
	min-width:50px;
}
</style>
