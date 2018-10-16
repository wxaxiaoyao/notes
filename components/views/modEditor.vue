
<template>
	<div class="mod-editor">
		<div v-for="(x, index) in datas" :key="index">
			<el-card v-if="isText(x.type)">
				<div slot="header">
					<span>文本</span>
				</div>
				<el-input type="textarea" autosize class="input-type" v-model="x.data.text" placeholder="文本内容"></el-input>
			</el-card>
			<el-card v-else-if="x.type">
				<div slot="header">
					<span>链接</span>
				</div>
				<el-input class="input-type" v-model="x.data.text" placeholder="链接文本"></el-input>
				<el-input class="input-type" v-model="x.data.href" placeholder="链接地址"></el-input>
				<el-select class="select-type" v-model="x.data.target">
					<el-option v-for="(target, index) in linkTargets" :key="index" :value="target.value" :label="target.label">
					</el-option>
				</el-select>
			</el-card>
			<div v-else>
				无数据编辑
			</div>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import {mapGetters, mapActions, mapMutations} from "vuex";
import {
	Card,
	Checkbox,
	Select,
	Option,
} from "element-ui";

import {
	BASE_MOD_TYPE_TEXT,
	BASE_MOD_TYPE_LINK,
	BASE_MOD_TYPE_MEDIA,
	BASE_MOD_TYPE_LIST,
} from "@@/common/consts.js";
import component from '@/components/component.js';

export default {
	mixins:[component],
	components: {
		[Card.name]: Card,
		[Checkbox.name]: Checkbox,
		[Select.name]: Select,
		[Option.name]: Option,
	},

	data: function() {
		return {
			count:0,
			linkTargets: [
			{
				value:'_self',
				label:"本窗口打开",
			},
			{
				value: "_blank",
				label: "新窗口打开",
			},
			],
			data: {},
			textData: {
				text:"",
			},
			linkData: {
				
			}
		}
	},

	computed: {
		...mapGetters({
			currentMod: "getCurrentMod",
			getModData: "getModData",
			currentModData: "getCurrentModData",
		}),

		datas() {
			const type = this.currentMod.__data_type__;
			const datas = [];
			const data = this.data;
			if (_.isNumber(type)) {
				datas.push({
					type,
					data:this.data,
				});
			} else if(_.isArray(type)) {
				_.each(type, obj => {
					const x = {};
					x.type = obj.type;
					x.data = obj.key ? _.get(data, obj.key) : data;
					datas.push(x);
				});
			};
			//console.log(datas);
			return datas;
		},

		cursorLine() {
			return this.getData("codeEditorCursorLine");
		},

	},

	watch: {
		currentModData: {
			handler(val) {
				//console.log(JSON.stringify(this.currentModData));
				//console.log(JSON.stringify(this.data));
				if (JSON.stringify(this.currentModData) == JSON.stringify(this.data)) return ;
				this.data = _.cloneDeep(this.currentModData || {}) || {};
			},
			deep: true,
		},
		data: {
			handler: function(val, oldVal){
				//console.log(JSON.stringify(this.currentModData));
				//console.log(JSON.stringify(this.data));
				if (JSON.stringify(this.currentModData) == JSON.stringify(this.data)) return ;
				this.setCurrentModData(this.data);
			},
			deep: true,
		},
		cursorLine: function(cursorLine) {
			const self = this;
			if (self.cursorTimer) return;
			self.cursorTimer = setTimeout(function() {
				const blocks = self.getShareData("blockData") || {};
				const key = _.findKey(blocks, block => block.start < self.cursorLine && self.cursorLine < block.end);
				if (key != self.currentMod.__mod_key__) {
					//console.log(cursorLine, key, self.currentMod.__mod_key__);
					self.setCurrentMod({});
					//self.setData("editorActiveTab", "files");
				} else {
					//self.setData("editorActiveTab", "baseCompEditor");
				}
				self.cursorTimer = undefined;
			},1000);
		}
	},

	methods: {
		...mapMutations({
			setCurrentMod:"setCurrentMod",
			setCurrentModData: "setCurrentModData",
		}),
		isText(type) {
			return type == BASE_MOD_TYPE_TEXT;
		},

		isLink(type) {
			return type == BASE_MOD_TYPE_LINK;
		}
	},

	mounted() {
		this.currentMod.__type__ = this.currentMod.__type__ || BASE_MOD_TYPE_TEXT;
	}
}
</script>

<style lang="scss">
.mod-editor  {
	padding:10px;

	.input-type  {
		.el-input__inner {
			border: none;
			border-bottom: 1px solid #e4e7ed;
			font-size: 16px;
			padding: 18px 0 0;
			border-radius: 0;
		}
	}

	.select-type {
		margin-top: 18px;
	}
}
</style>
