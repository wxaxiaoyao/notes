
<template>
	<el-dialog :title="__data__.title" :visible.sync="__data__.visible" @close="clickCancelBtn">
		<div v-html="__data__.content"></div>
		<span slot="footer" class="dialog-footer">
			<el-button :type="__data__.primary == 'cancel' ? 'primary' : ''" @click="clickCancelBtn">取消</el-button>
			<el-button :type="__data__.primary == 'confrim' ? 'primary' : ''" @click="clickConfirmBtn">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import {
	Dialog,
} from "element-ui";

import mod from "@/components/mods/common/mod.js";
export default {
	mixins: [mod],

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					visible: false,
					title: "title",
					content: "dialog content",
					primary: "cancel",

					cbConfirm:null,
					cbCancel:null,
				}
			}
		}
	},

	methods: {
		clickConfirmBtn() {
			this.__data__.visible = false;
			this.__data__.cbConfirm && this.cbConfirm();
		},
		clickCancelBtn() {
			this.__data__.visible = false;
			this.__data__.cbCancel && this.cbCancel();
		}
	}
}

</script>

<style scoped>
</style>
