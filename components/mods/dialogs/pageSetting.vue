
<template>
	<el-dialog :visible.sync="__data__.visible" title="页面设置" width="500px">
		<el-form :model="__data__" label-width="80px" label-position="right" style="width:400px;">
			<el-form-item label="标题">
				<el-input v-model="__data__.title" placeholder="请输入标题" ></el-input>
			</el-form-item>
			<el-form-item label="关键词">
				<el-input v-model="__data__.keywords" placeholder="关键词 逗号(,)分隔" ></el-input>
			</el-form-item>
			<el-form-item label="简介">
				<el-input type="textarea" :rows="3" v-model="__data__.description" placeholder="页面简介"></el-input>
			</el-form-item>
			<el-form-item label="标签">
				<el-tag v-for="(tag, index) in __data__.tags" :key="index" closable :disable-transitions="false" @close="handleCloseTag(index)">
					{{tag}}
				</el-tag>
				<el-input  class="input-new-tag" v-if="isShowInputTag" v-model="tag" ref="saveTagInput"  size="small" 
						 @keyup.enter.native="handleInputTagConfirm" @blur="handleInputTagConfirm"></el-input>
				<el-button v-else class="button-new-tag" size="small" @click="showInputTag">+ New Tag</el-button>
			</el-form-item>
			<el-form-item label="私密">
				<el-switch v-model="__data__.visibility"></el-switch>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="__data__.visible = false">取 消</el-button>
			<el-button type="primary" @click="clickSubmitPageSettingBtn">确 定</el-button>
		</div>
	</el-dialog>

</template>

<script>
import mod from "@/components/mods/common/mod.js";
import {
	Dialog,
	Form,
	FormItem,
	Switch,
	Tag,
} from "element-ui";

export default {
	mixins: [mod],

	components: {
		[Dialog.name]: Dialog,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Switch.name]: Switch,
		[Tag.name]: Tag,
	},

	data: function() {
		return {
			isShowInputTag: false,
			tag: "",
		}
	},

	props: {
		__default_data__: {
			type:Object,
			default: function() {
				return {
					id:null,
					visible: false,
					title:null,
					keywords:null,
					description:null,
					tags:[],
					visibility:0,
					pagename:"",
				}
			}
		}
	},

	methods: {
		showInputTag() {
			this.isShowInputTag = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},

		handleInputTagConfirm() {
			const index = _.findIndex(this.__data__.tags, tag => this.tag == tag);
			if (index < 0 && this.tag) this.__data__.tags.push(this.tag);

			this.isShowInputTag = false;
			this.tag = "";
		},

		handleCloseTag(index) {
			this.__data__.tags.splice(index,1);
		},	

		async clickSubmitPageSettingBtn() {
			//console.log(this.__data__);
			this.__data__.visibility = this.__data__.visibility ? 1 : 0;
			await this.api.pages.setSetting(this.__data__);
			this.__data__.visible = false;
			this.__data__.success && this.__data__.success(this.__data__);
		},
	}
}
</script>
