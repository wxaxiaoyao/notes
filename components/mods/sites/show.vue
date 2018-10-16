
<template>
	<div class="site-container">
		<a class="sitename" :href="siteUrl">{{__data__.site.sitename}}</a>
		<div class="site-description">{{__data__.site.description}}</div>
	</div>
</template>

<script>
import mod from "@/components/mods/common/mod.vue";

export default {
	mixins: [mod],

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					username:"",
					site:{},
				}
			}
		}
	},

	computed: {
		siteUrl() {
			return this.__data__.username + "/" + this.__data__.site.sitename;
		}
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
