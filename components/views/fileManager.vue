<template>
	<div>
		<el-upload 
			style="width:100%;"
			drag 
		    action="#" 
			:http-request="fileUpload"
			:show-file-list="false"
			multiple>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
		</el-upload>
		<div v-for="(x, index) in filelist" :key="index">
			<div>{{x.filename}}</div>
			<el-progress :stroke-width="18"	:percentage="x.percent" :status="x.status"></el-progress>
		</div>
	</div>
</template>

<script>

import {
	Upload,
	Progress,
} from "element-ui";
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import util from "@@/common/util.js";
import api from "@@/common/api/note.js";
import qiniuUpload from "@@/common/api/qiniu.js";

export default {
	data: function() {
		return {
			filelist: [
			],
		};
	},

	components: {
		[Upload.name]: Upload,
		[Progress.name]: Progress,
	},

	methods: {
		async fileUpload(e) {
			const self = this;
			const file = {
				percent: 0,
				status: null,
			};
			self.filelist.push(file);
			console.log(e, typeof(e));

			const path = this.user.username + "/" + e.file.name; 
			file.filename = e.file.name;
			file.key = util.getKeyByPath(path);
			file.path = path;
			console.log(file);
			const result = await qiniuUpload(file.key, e.file, null, file, {
				next(res) {
					console.log(res, res.percent);
					file.percent = res.total.percent;
				},
				complete() {
					file.status = "success";
				},
				error() {
					file.status = "exception";
				}
			});
			console.log(result);
		},
	}

}
</script>
