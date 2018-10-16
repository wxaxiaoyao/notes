
<template>
	<div class="container">
		<div v-for="(x, i) in __data__.sites" :key="i" class="site-item-container">
			<sites __style__="show" :__default_data__="siteData(x)"></sites>
			<el-button @click="clickUnfavoriteBtn(x, i)" class="site-actions" type="text">{{"取消收藏"}}</el-button>
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
					objectType:1,
					username:"",
					sites:[],
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
			await this.getFavoriteSites();
		},

		siteData(site) {
			return {site, username:this.__data__.username};
		},

		async getFavoriteSites() {
			const {objectId, objectType} = this.__data__;
			if (!_.isNumber(objectType) || !_.isNumber(objectId)) return;
			const result = await this.api.favorites.get({userId:objectId,objectType}, {cache: true});
			const list = result.data || [];

			this.$set(this.__data__, "sites", list);
		},

		async clickUnfavoriteBtn(x, i) {
			const params = {
				objectType: this.__data__.objectType,
				objectId: x.id,
			}
			
			await this.api.favorites.destroy(params);
			this.__data__.sites.splice(i,1);

		}
	},

	mounted() {
		this.parseData();
	}
}
</script>

<style scoped>
.site-item-container {
	position: relative;
}
.site-actions {
	position: absolute;
	top: 10px;
	right: 10px;
}
</style>
