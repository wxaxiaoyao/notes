
<template>
	<div class="container">
		<div v-for="(x, i) in __data__.users" :key="i" class="user-item-container">
			<div class="user-info-container">
				<img class="user-portrait" :src="x.portrait || systemPortrait">
				<div class="user-info">
					<div class="user-name">{{x.username}}</div>
					<div class="user-description">{{x.description}}</div>
				</div>
			</div>
			<el-button @click="clickUnfollowBtn(x, i)" class="user-actions" type="text">{{"取消关注"}}</el-button>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import mod from "@/components/mods/common/mod.vue";
export default {
	mixins: [mod],
	data: function() {
		return {

		};
	},

	props: {
		__default_data__: {
			type:Object,
			default: function() {
				return {
					objectId:undefined,
					objectType:0,
					users:[
					//{
						//portrait:"https://img2.woyaogexing.com/2018/08/07/76a56256770fc8c0!400x400_big.jpg",
						//username:"xiaoyao",
						//description:"test",
					//},
					//{
						//portrait:"https://img2.woyaogexing.com/2018/08/07/76a56256770fc8c0!400x400_big.jpg",
						//username:"xiaoyao",
						//description:"test",
					//},
					],
				}
			}
		}
	},

	watch: {
		"__data__.objectId": function() {
			this.parseData();
		},
	},

	methods: {
		async parseData(){
			await this.getFavoriteUsers();
		},

		async getFavoriteUsers() {
			const {objectId, objectType} = this.__data__;
			if (!_.isNumber(objectType) || !_.isNumber(objectId)) return;
			const result = await this.api.favorites.get({userId:objectId,objectType}, {cache: true});
			const list = result.data || [];

			this.$set(this.__data__, "users", list);
		},

		async clickUnfollowBtn(x, i) {
			const params = {
				objectType: 0,
				objectId: x.userId,
			}
			
			await this.api.favorites.destroy(params);
			this.__data__.users.splice(i, 1);
		}
	},

	mounted() {
		this.parseData();
	}
}
</script>

<style scoped>
.user-item-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin:2px 0px;
}
.user-info-container {
	display: flex;
	align-items: center;
}
.user-portrait {
	width:50px;
	height:50px;
	border-radius: 50%;
}
.user-info {
	padding-left:12px;

}
.user-name {
	font-size:14px;
}
.user-description {
	padding-top:5px;
	font-size:12px;

}
.user-actions {
	padding-right:20px;
	
}
</style>
