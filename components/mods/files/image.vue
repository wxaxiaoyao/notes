<template>
	<div class="files-image-container">
		<dialogs __style__="confirm" :__default_data__="dialogConfirmData"></dialogs>
		<dialogs __style__="rename" :__default_data__="dialogRenameData"></dialogs>
		<div class="files-header-container">
			<div>
				<span>图库</span>
			</div>
			<div>
				<el-input @keyup.native.enter="search" size="small" placeholder="文件名" v-model="filename" suffix-icon="el-icon-search" class="file-search"></el-input>	
			</div>
		</div>
		<el-upload drag action="#" :http-request="fileUpload" :show-file-list="false" multiple>
			<div @click.stop.prevent="nullfunc" class="files-list-container">
				<div v-for="(x, i) in files" :key="i" @click="clickImageItem(x)" class="image-container" data-toggle="tooltip" :title="x.filename">
					<img v-if="x.id" v-lazy="'/' + x.key" class="image"/>
					<el-progress v-else type="circle" :percentage="x.percent" :status="x.status"></el-progress>
					<i v-if="__data__.multiple ? x.selected : selectedKey == x.key" class="iconfont icon-select"></i>
				</div>
			</div>
		</el-upload>
		<div class="files-footer-container">
			<div style="display: flex; flex:1">
				<el-button :disabled="selections.length == 0" @click="clickDownloadSelectBtn" round>下载选中</el-button>
				<el-button :disabled="selections.length == 0" @click="clickDeleteSelectBtn" round>删除选中</el-button>
				<div class="upload-container">
					<el-upload drag action="#" :http-request="fileUpload" :show-file-list="false" multiple>
						<el-button slot="trigger" round>上传文件</el-button>
					</el-upload>
				</div>
			</div>
			<div>
				<el-button :disabled="selections.length == 0" @click="clickApplyBtn" round>应用</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import vue from "vue";
import _ from "lodash";
import {
	Upload,
	Progress,
} from "element-ui";

import common from "./common.js";
export default {
	mixins: [common],

	components: {
		[Upload.name]: Upload,
		[Progress.name]: Progress,
	},
	
	data: function() {
		return {
			fileSize:0,
			fileCount:0,
			filename:"",
			files:[],
			selections:[],
			dialogConfirmData: {},
			dialogRenameData:{},
			selectedKey: "",
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					multiple: false,
					success: null,
				}
			}
		}
	},

	filters: {
	},

	methods: {
		clickImageItem(x) {
			vue.set(x, "selected", !x.selected);
			if (!this.__data__.multiple) {
				const last = this.selections.pop();
				if(last && x.key != last.key) last.selected = false;
				this.selectedKey = x.selected ? x.key : "";
			}
			const index = _.findIndex(this.selections, o => o.key == x.key);
			if (x.selected) this.selections.push(x);
			else this.selections.splice(index, 1);
		},

		clickApplyBtn() {
			const self = this;
			const urls = [];
			_.each(self.selections, o => urls.push(self.getUrlByKey(o.key)));
			
			self.__data__.success && self.__data__.success(urls, self.selections);
		}
	},

	async mounted() {
		this.query.type = "images";
		this.getFiles();
	}
}
</script>

<style lang="scss">
.el-popover {
	width: 100px;
	min-width: 100px;
}
.files-image-container {
	.el-upload {
		display: block;
	}
	.el-upload-dragger {
		width:100%;
		height: 100%;
	}
	.el-upload-dragger {
		border: none;
	}
}
</style>
<style lang="scss" scoped>
.files-list-container {
	display: flex;
	flex-wrap: wrap;
	min-height: 150px;
}
.files-header-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.files-footer-container {
	display: flex;
	padding: 10px;
	justify-content: space-between;
	align-items: center;
}
.upload-container {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-left: 10px;
}
.upload-container> span {
	margin-left: 5px;
}
.file-search {
	/*width: 300px;*/
}
.file-oper-icon {
	margin: 0px 4px;
}
.file-oper-item-container {
	display: flex;
	align-items: center;
	cursor: pointer;
	i {
		margin: 0px 4px;
	}
}
.image-container {
	position: relative;
	margin: 5px;
	cursor: pointer;
}
.image {
	width:120px;
	height:120px;
}
.icon-select {
	color:#cdcdcd;
	position: absolute;
	right: 0px;
	top: 0px;
}
</style>
