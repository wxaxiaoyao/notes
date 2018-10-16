<template>
	<div class="tags-index-container">
		<el-tag v-for="(tag, index) in __data__.tags" :key="index" :closable="__data__.editable" :disable-transitions="false" @close="handleCloseTag(index)">
			{{tag}}
		</el-tag>
		<el-input  class="input-new-tag" v-if="isShowInputTag" v-model="tag" ref="tagInputRef"  size="small" 
				 @keyup.enter.native="handleInputTagConfirm" @blur="handleInputTagConfirm"></el-input>
		<el-button v-if="!isShowInputTag && __data__.editable" class="button-new-tag" size="small" @click="showInputTag">+ New Tag</el-button>
	</div>
</template>

<script>
import {
	Tag,
} from "element-ui";

import mod from "@/components/mods/common/mod.vue";
export default {
	mixins: [mod],
	components: {
		[Tag.name]: Tag,
	},

	data: function() {
		return {
			isShowInputTag:false,
			tag: "",
		}
	},

	props: {
		__default_data__: {
			type:Object,
			default: function() {
				return {
					tags:[],
					editable: false,
				}
			}
		}
	},

	methods: {
		showInputTag() {
			this.isShowInputTag = true;
			this.$nextTick(_ => {
				this.$refs.tagInputRef.$refs.input.focus();
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
		}
	},

	mounted() {

	}
}

</script>

<style lang="scss">
.tags-index-container {
	.el-tag + .el-tag {
		margin-left: 10px;
	}
}
</style>

<style scoped>
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
</style>
