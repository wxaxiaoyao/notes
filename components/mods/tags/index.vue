<template>
	<div class="tags-index-container container">
		<el-tag 
			v-for="(tag, index) in tags" 
			:key="index" 
			:closable="true" 
			:disable-transitions="false" 
			:color="__data__.color"
			@close="handleCloseTag(tag, index)">
			{{tag}}
		</el-tag>
		<el-select 
			ref="selectRef"
			style="width:140px"
			v-if="isShowInputTag"
		    v-model="tag"
		    @change="handleSelectChange"
		    size="small"
			placeholder="标签名"
			default-first-option
			allow-create
			filterable>
			<el-option v-for="(x, i) in tags" :key="i" :label="x" :value="x"></el-option>
		</el-select>
		<el-button 
			ref="bottonRef"
			v-if="!isShowInputTag"
			class="button-new-tag" 
			size="small" 
			@click="showInputTag">
			标签
		</el-button>
	</div>
</template>

<script>
import _ from "lodash";
import common from "./common.js";

export default {
	mixins: [common],

	data: function() {
		return {
			isShowInputTag:false,
			tag: "",
			head: {
				title:"我的标签"
			}
		}
	},

	methods: {
		showInputTag() {
			this.isShowInputTag = true;
			this.$nextTick(_ => {
				this.$refs.selectRef.focus();
			});
		},

		handleSelectChange() {
			if (_.indexOf(this.tags, this.tag) < 0 && this.tag) {
				this.tags.push(this.tag);
				this.api.tags.upsert({name: this.tag, classify:0});
			} 

			this.isShowInputTag = false;
			this.tag = "";

			this.$nextTick(_ => {
				this.$refs.bottonRef.$el.focus();
			});
		},

		handleCloseTag(tag, index) {
			this.tags.splice(index,1);
			this.api.tags.delete({id:tag});
		}
	},

	async mounted() {
		await this.loadDatas();
	},
}

</script>

<style lang="less">
.tags-index-container {
	.el-tag {
		color: black;
	}

	.el-tag + .el-tag {
		margin-left: 10px;
	}
}
</style>

<style scoped>
.button-new-tag {
	/*margin-left: 10px;*/
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
