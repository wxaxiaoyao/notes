<template>
	<div class="page-container">
		<div v-if="isExistHeader" class="page-header-container">
			<headers :__style__="headerStyle"></headers>
		</div>
		<div class="page-body-container">
			<div v-if="pageType == 'notfound-page'">not found</div> <users v-else-if="pageType == 'user-profile-page'"  __style__="home" :__default_data__="modData"></users>
			<modules v-else-if="pageType == 'user-page'" __style__="render" :__default_data__="modData"></modules>
			<component v-else-if="pageType == 'system-page'" :is="modname" :__style__="stylename" :__default_data__="modData"></component>
			<div v-else></div>
		</div>
		<div v-if="isExistFooter" class="page-footer-container">
			<footers :__style__="footerStyle"></footers>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import component from "@/components/component.js";

export default {
	layout: "blank",
	mixins: [component],

	head() {
		return this.head;
	},

	data: function() {
		return {
			cellphonesData:{},
			loading: true,
			loaded: false,
			isNotFound: false,
			pageType: "system-page",
			url:"",
			page:{},
			modname: null,
			stylename:null,
			modData: {},
			head:{},
			isExistHeader:true,
			isExistFooter:false,
			headerStyle: "system",
			footerStyle: "system",
		}
	},

	watch: {
		pagedata: function(data) {
			this.initData(data);
		},
	},

	methods: {
		initData(data) {
			_.each(data, (val, key) => this[key] = val);

			const params = g_app.storage.sessionStorageGetItem("/" + this.url) || {};
			const query = this.$route.query || {};
			const paths = this.url.split("/").filter(o => o);
			this.modname = paths[1];
			this.stylename = paths[2] || "index";

			this.modData = {
				...this.modData,
				...params,
				...query,
				setPageAttr: ref => {
					if (ref.isModContainer) return;
					this.head = ref.head || {title:"note"};
					this.isExistHeader = ref.isExistHeader != undefined ? ref.isExistHeader : this.isExistHeader;
					this.isExistFooter = ref.isExistFooter != undefined ? ref.isExistFooter : this.isExistFooter;
				},
			};

			// 设置当前页
			if (this.pageType == "user-page" && this.page) {
				this.setData("__currentUrl__", this.page.url);
				this.setData("__currentContent__", this.page.content);
			}

			console.log(this.modname, this.stylename);
			if (this.pageType == "system-page" && !g_app.mods[this.modname]) this.pageType = "notfound-page"; 
		},
	},

	async mounted() {
		this.initData(this.pagedata);
	},
}
</script>

<style scoped>
.page-container {
	display:flex;
	flex-direction: column;
	height:100%;
}
.page-header-container {
	
}
.page-body-container {
	flex:1;
	overflow-y:auto;
}
.page-footer-container {

}
</style>
