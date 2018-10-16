
<template>
	<div>
		<el-form ref="form" :model="issue" label-width="80px">
			<el-form-item label="标题">
				<el-input v-model="issue.title"></el-input>
			</el-form-item>
			<el-form-item label="标签">
				<tags :__default_data__="tagsData"></tags>
			</el-form-item>
			<el-form-item label="指派">
				<users :__default_data__="usersData"></users>
			</el-form-item>
			<el-form-item label="描述">
				<el-input type="textarea" v-model="issue.content">
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="clickSubmitIssueBtn">完成创建</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import {
	Form,
	FormItem,
	Tag,
} from "element-ui";

import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	components: {
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Tag.name]: Tag,
	},

	data: function() {
		return {
			tagsData: {tags:[], editable: true},
			usersData: {users:[], editable: true},
			issue: {objectId:1, objectType:1},
			tag: "",
		}
	},

	props: {
		__default_data__: {
			type:Object,
			default: function() {
				return {
					issue:null,
				}
			}
		}
	},

	methods: {
		async clickSubmitIssueBtn() {
			const tags = [];
			const assigns = [];

			_.each(this.tagsData.tags, o => tags.push(o))
			_.each(this.usersData.users, o => assigns.push(o.userId));

			this.issue.tags = "|" + tags.join("|") + "|";
			this.issue.assigns = "|" + assigns.join("|") + "|";
			console.log(this.issue);
			const result = await this.api.issues.create(this.issue);
			if (result.isErr()) return;

			this.__data__.cbNew && this.__data__.cbNew(this.issue);
		}
	},

	mounted() {

	},
}
</script>

<style>
</style>
