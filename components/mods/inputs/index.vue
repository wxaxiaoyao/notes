
<template>
	<div class="inputs-index-container">
		<div v-if="!editing" class="input-show-container">
			<span>{{__data__.value}}</span>
			<i @click="editing = true" class="iconfont icon-pencil" data-toggle="tooltip" title="编辑"></i>
		</div>
		<div v-else class="inputs-edit-container">
			<el-input v-model="__data__.value" :size="__data__.size"></el-input>
			<el-button :size="size" class="oper-btn" @click="clickConfirmBtn">确定</el-button>
			<el-button :size="size" class="oper-btn" @click="clickCancelBtn">取消</el-button>
		</div>
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
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					value:"",
					success:null,
					size: "small",
				}
			}
		}
	},

	computed: {
		size() {
			return this.__data__.size || "small";
		}
	},

	methods: {
		clickConfirmBtn() {
			this.editing = false;
			this.__data__.success && this.__data__.success(this.__data__.value);
		},

		clickCancelBtn() {
			this.editing = false;
		}
	}
}
</script>

<style>
</style>

<style scoped>
.inputs-index-container {
}
.inputs-edit-container {
	display: flex;
}
.input-show-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.oper-btn {
	margin-left:4px;
}
.icon-pencil {
	display:none;
}
.input-show-container:hover .icon-pencil {
	display:inline;
}
</style>
