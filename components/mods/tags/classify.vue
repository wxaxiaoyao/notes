
<template>
	<div class="tags-index-container">
		<el-tag 
			v-for="(tag, index) in __data__.tags" 
			:key="index" 
			closable 
			:color="__data__.color" 
			:disable-transitions="false" 
			@close="handleCloseTag(tag, index)">
			{{tag.tagname}}
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
			<el-option v-for="(x, i) in tags" :key="x.id" :label="x.tagname" :value="x.tagname"></el-option>
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
			data: {
				tags:[],
				color:"white",
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

		async handleSelectChange() {
			if (this.tag) {
				const index = _.findIndex(this.tags, o => o.tagname ==  this.tag);
				const tag = this.tags[index];
				if (index < 0) {
					const result = await this.api.tags.create({
						classify: this.__data__.classify,
						tagname: this.tag,
					});
					if (result.isErr()) return;
					this.tags.push(result.data);
					this.__data__.tags.push(result.data);
				} else {
					const index = _.findIndex(this.__data__.tags, o => o.tagname == this.tag);
					if (index < 0) this.__data__.tags.push(tag);
				} 
			} else {
			}

			this.isShowInputTag = false;
			this.tag = "";

			this.$nextTick(_ => {
				this.$refs.bottonRef.$el.focus();
			});
		},

		handleCloseTag(tag, index) {
			this.__data__.tags.splice(index, 1);
		}
	},

	async mounted() {
		this.tags = await this.api.tags.get({classify:this.__data__.classify || 0}).then(res => res.data || []);
	}
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
	/*margin-left: 5px;*/
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
