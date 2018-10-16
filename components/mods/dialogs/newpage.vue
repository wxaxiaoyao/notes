
<template>
	<el-dialog :visible.sync="__data__.visible" title="新增页面" width="400px">
		<el-form :model="__data__" label-width="80px" label-position="right" style="width:300px;">
			<el-form-item label="类型">
				<el-select v-model="__data__.type" placeholder="请选择类型">
					<el-option label="文件" value="0"></el-option>
					<el-option label="目录" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="文件名">
				<el-input v-model="__data__.filename" 
					clearable
					placeholder="请输入文件名" 
					@keyup.native.enter="clickSubmitNewFileBtn"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="__data__.visible = false">取 消</el-button>
			<el-button type="primary" @click="clickSubmitNewFileBtn">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import {
	Form,
	FormItem,
	Dialog,
	Select,
	Option,
} from "element-ui";
import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	components:{
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Dialog.name]: Dialog,
		[Select.name]: Select,
		[Option.name]: Option,
	},

	data: function() {
		return {
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					visible: false,
					type: "pages",
					filename: "",
					folder: "", // 父url
				};
			}
		}
	},

	methods: {
		async clickSubmitNewFileBtn() {
			const self = this;
			const data = this.__data__;

			if (!data.filename) return this.$message("文件名不能为空");
			
			data.visibility = this.editorMode == "privacy" ? 1 : 0;
			data.url = data.folder + data.filename + (data.type == "1" ? "/" : "");
			data.content = "";
			let result = await self.api.pages.create(data)
			if (result.isErr()) {
				if (e.status == 409) return self.$message("文件已存在");
				return self.$message("创建失败");
			}

			data.page = result.data;
			data.succes && data.succes(data.page);
			data.visible = false;
		}
	}
}
</script>
