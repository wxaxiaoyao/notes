
<template>
	<div class="customsContainer" @dblclick="clickEditBtn">
		<el-dialog :visible.sync="isShowEditor" :fullscreen="true" :show-close="false">
			<div slot="title" class="title">
				<span>模块编辑</span>
				<div>
					<el-button @click="clickSaveBtn">保存</el-button>
					<el-button @click="isShowEditor = false">取消</el-button>
				</div>
			</div>
			<editor :tag="tag"></editor>
		</el-dialog>
		<div class="example" v-if="!tag">
			双击编辑
		</div>
		<tag v-else :tag="tag"></tag>
	</div>
</template>

<script>
import {
	Dialog,
} from "element-ui";

import _ from "lodash";
import {mapActions, mapGetters} from "vuex";
import {tags} from "@/lib/tags";
import tag from "./tag.js";
import editor from "./editor.vue";
import component from '@/components/component.js';
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[component, mod],
	components: {
		[Dialog.name]:Dialog,
		editor,
		tag,
	},

	data: function() {
		return {
			isShowEditor: false,
		}
	},

	props: {
		__default_data__: {
			type:Object,
			default: function() {
				return {};
			}
		}
	},

	computed: {
		tag() {
			if (!this.__data__.tag) return;
			const tag = _.cloneDeep(this.__data__.tag);
			return tags.getTagByTag(tag);
		}
	},

	watch: {
	},

	methods: {
		clickEditBtn() {
			this.isShowEditor = true;
		},
		clickSaveBtn() {
			this.isShowEditor = false;
			const tag = this.getShareData("__ROOT_TAG__");
			this.__set_data__({tag:tag.json()});
			//this.__data__.tag = this.getShareData("__ROOT_TAG__");
		}
	},

	mounted() {
	}
}
</script>

<style scoped>
.example {
	box-sizing: border-box;
	height:80px;
	padding-top: 30px;
	text-align: center;
	background-color: #ccc;
}

.title {
	padding: auto 20px;
	height: 60px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
<style>
.customsContainer .el-dialog__body {
	padding: 0px;
	position: absolute;
	bottom: 0;
	top: 60px;
	right: 0;
	left: 0;
}
.customsContainer .el-dialog__header {
	padding: 0px;
}
</style>
