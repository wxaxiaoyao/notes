
<template>
	<div class="site-list-container container">
		<div v-for="(x,i) in __data__.sites" :key="i" class="site-container">
			<a class="sitename" :href="'/note/sites/detail?siteId='+x.id">{{x.sitename}}</a>
			<div class="site-description">{{x.description}}</div>
		</div>
	</div>
</template>

<script>
import mod from "@/components/mods/common/mod.js";
export default {
	mixins: [mod],

	data: function() {
		return {
		}
	},

	methods: {
		async parseData() {
			
			await this.getSites();
		},

		async getSites(cache = true) {
			const userId = this.__data__.userId || this.userId;
			if (!userId) return ;
			const result = await this.api.sites.search({userId}, {cache});
			const list = result.data || [];
			this.$set(this.__data__, "sites", list);
		}
	},

	async mounted() {
		await this.parseData();
	}
}
</script>

<style scoped>
.site-container {
	padding:10px 10px 20px;	
	border-bottom: 1px solid gray;
	font-size:14px;
}

.sitename {
	display: block;
	padding-bottom: 6px;
	font-size:16px;
}
</style>
