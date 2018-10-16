
<template>
	<div class="files-index-container">
		<dialogs __style__="confirm" :__default_data__="dialogConfirmData"></dialogs>
		<dialogs __style__="rename" :__default_data__="dialogRenameData"></dialogs>
		<div class="files-header-container">
			<div>
				<span>总大小: {{fileSize | sizeFilter}}</span>
			</div>
			<div>
				<el-input @keyup.native.enter="search" size="small" placeholder="文件名" v-model="filename" suffix-icon="el-icon-search" class="file-search"></el-input>	
			</div> 
		</div>
		<div class="files-list-container">
			<el-upload drag action="#" :http-request="fileUpload" :show-file-list="false" multiple>
				<el-table @click.native.stop.prevent="nullfunc" :data="files" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="50">
					</el-table-column>
					<el-table-column label="文件名" prop="filename" sortable>
						<template slot-scope="{row}">
							<el-popover placement="bottom-end" trigger="hover" v-if="row.type == 'images'">
								<img v-lazy="'/' + row.key" class="preview-image">
								<div class="filename" slot="reference">
									<inputs :__default_data__="{value:row.filename, success: row.rename}"></inputs>
								</div>
							</el-popover>
							<div class="filename" v-else>
								<inputs :__default_data__="{value:row.filename, success: row.rename}"></inputs>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="文件类型" prop="type" sortable width="120px"
						:filter-method="clickTypeFilter"
						:filters="[{text:'图片', value:'images'}, {text:'视频', value:'videos'}, {text:'音频', value:'audios'}, {text:'其它', value:'files'}]">
						<template slot-scope="{row}">
							<span>{{row.type | typefilter}}</span>
						</template>
					</el-table-column>
					<el-table-column label="文件大小" prop="size" sortable width="120px">
						<template slot-scope="{row}">
							<span>{{row.size | sizeFilter}}</span>
						</template>
					</el-table-column>
					<el-table-column label="上传时间" sortable width="120px">
						<template slot-scope="{row}">
							<span v-if="row.id">{{row.createdAt | datetime}}</span>
							<el-progress v-else :percentage="row.percent" :status="row.status"></el-progress>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="{row}">
							<i @click="clickCopyLinkBtn(row)" data-toggle="tooltip" title="复制链接" class="file-oper-icon iconfont icon-copy"></i>
							<i @click="clickDownloadBtn(row)" data-toggle="tooltip" title="下载文件" class="file-oper-icon iconfont icon-download"></i>
							<i @click="clickDeleteOperBtn(row)" data-toggle="tooltip" title="删除文件" class="file-oper-icon iconfont icon-delete"></i>
						</template>
					</el-table-column>
				</el-table>
			</el-upload>
		</div>
		<div class="files-footer-container">
			<div>
				<el-button :disabled="selections.length == 0" @click="clickDownloadSelectBtn" round>下载选中</el-button>
				<el-button :disabled="selections.length == 0" @click="clickDeleteSelectBtn" round>删除选中</el-button>
			</div>
			<div class="upload-container">
				<el-upload action="#" :http-request="fileUpload" :show-file-list="false" multiple>
					<el-button slot="trigger" round>上传文件</el-button>
				</el-upload>
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
	Table,
	TableColumn,
	Popover,
} from "element-ui";

import common from "./common.js";

export default {
	mixins: [common],

	components: {
		[Upload.name]: Upload,
		[Progress.name]: Progress,
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
		[Popover.name]: Popover,
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

	filters: {
	},

	methods: {
	},

	async mounted() {
		this.getFiles();
		this.statistics();
	}
}
</script>

<style lang="scss">
.el-popover {
	width: 100px;
	min-width: 100px;
}
.files-index-container {
	margin-top: 10px;
	.el-upload {
		display: block;
		text-align: left;
	}
	.el-upload-dragger {
		width:100%;
		height: 100%;
		text-align: left;
	}
	.el-upload-dragger {
		border: none;
	}
}
</style>
<style lang="scss" scoped>
.files-list-container {
	mix-height: 120px;
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
}
.upload-container> span {
	margin-right: 5px;
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
.preview-image {
	width: 100px;
	height: 100px;
}
.filename {
	overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
