
<template>
	<div class="dailies-sm-upsert-container">
		<mt-header :title="daily.id ? '日报-更新' : '日报-新增'">
			<mt-button slot="left" icon="back" @click="$router.go(-1)"></mt-button>
			<mt-button slot="right" @click="clickSubmitBtn">提交</mt-button>
		</mt-header>
		<div class="form-container">
			<mt-field type="date" placeholder="请输入日期" v-model="daily.date"></mt-field>
			<tags __style__="input" :__default_data__="tagsData"></tags>
			<mt-field type="textarea" rows=4 placeholder="请输入日报内容" v-model="daily.content"></mt-field>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			daily: {
				date: moment().format("YYYY-MM-DD"),
			},
			tagsData: {editable: true, tags:[]},
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					title:"日报",
					success: null,
					fail: null,
				}
			}
		}
	},

	computed: {

	},

	methods: {
		async clickSubmitBtn() {
			await this.clickDailyCreateBtn();
		},

		async clickDailyCreateBtn() {
			const {year, month, day} = g_app.util.getDate(this.daily.date);
			this.daily.date = `${year}-${month}-${day}`;
			this.daily.tags = "|" + this.tagsData.tags.join("|") + "|";
			//console.log(this.tagsData, this.daily);
			
			const oper = this.daily.id ? "update" : "create";
			const result = await this.api.dailies[oper](this.daily);
			if (result.isErr()) {
				this.$message({message:"创建失败", type:'error'});
				this.__data__.fail && this.__data__.fail();
				return;
			}

			const data = result.data;
			this.__data__.success && this.__data__.success(data);

			this.go(-1);
		},
	},

	async mounted() {
		//console.log(this.__data__);
		if (this.__data__.id) {
			const result = await this.api.dailies.getById({id:this.__data__.id});
			if (result.isErr()) return;
			const daily = result.data;
			this.tagsData.tags = (daily.tags || "|").split("|").filter(o => o);
			this.daily = daily;
		}
	},
}

</script>

<style>
</style>

<style lang="less" scoped>
.dailies-sm-upsert-container {
}
</style>
