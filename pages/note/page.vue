<template>
	<div class="page-container">
		<div v-if="isExistHeader" class="page-header-container">
			<headers __style__="system"></headers>
		</div>
		<div class="page-body-container">
			<component v-if="isModPage" :is="modname" :__style__="stylename" :__default_data__="modData"></component>
			<div v-else>not found</div>
		</div>
		<div v-if="isExistFooter" class="page-footer-container">
			<footers __style__="system"></footers>
		</div>
	</div>
</template>

<script>

export default {
	layout: "blank",

	data: function() {
		return {
			isModPage:false,
			modname: null,
			stylename:null,
			modData: {},
			head:{},
			layout:"default",
			isExistHeader:true,
			isExistFooter:false,
		}
	},

	async asyncData({req}) {
	},

	head() {
		return this.head;
	},

	created() {
		//console.log(this.$route);
		const paths = this.$route.path.split("/").filter(o => o);
		const modName = paths[1];
		const styleName = paths[2] || "index";

		this.modname = modName;
		this.stylename = styleName;

		//console.log(this.modname, this.stylename);
		if (g_app.mods[modName]) {
			this.modData = {
				setPageAttr: ref => {
					this.head = ref.head || {title:"note"};
					this.isExistHeader = ref.isExistHeader != undefined ? ref.isExistHeader : this.isExistHeader;
					this.isExistFooter = ref.isExistFooter != undefined ? ref.isExistFooter : this.isExistFooter;
				}
			};
			this.isModPage = true;
		} 
	}
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
}
.page-footer-container {

}
</style>
