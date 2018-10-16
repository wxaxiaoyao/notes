
<template>
	<div class="object-editor-container">
		<div class="horizontal-container" v-if="__style__ == 'horizontal'">
			<div class="horizontal-data-nav-container">
				<typetree 
					v-on:selectDataItem="selectDataItem"
					:__data_type__="__data_type__" 
					:__data__="__data__">
				</typetree>
			</div>
			<div class="horizontal-data-editor-container">
				<dataEditor :data="dataItem || __data__"></dataEditor>
			</div>
		</div>
		<div class="vertical-container" v-else>
			<div class="vertical-data-nav-container">
				<typetree 
					v-on:selectDataItem="selectDataItem"
					:__data_type__="__data_type__" 
					:__data__="__data__">
				</typetree>
			</div>
			<div class="vertical-data-editor-container">
				<dataEditor :data="dataItem || __data__"></dataEditor>
			</div>
		</div>
	</div>
</template>

<script>

import typetree from "./typetree.vue";
import dataEditor from "./dataEditor.vue";

export default {
	components: {
		typetree,
		dataEditor,
	},

	data: function() {
		return {
			dataItem:null,
		}
	},

	props: {
		__style__: {
			type:String,
			default: "horizontal"
		},
		__data_type__: {
			type: Object,
			default: function() {
				return {
					//text: {
						//label:"文本",
						//type:"text",
					//},
					//link: {
						//label: "link",
						//type: "link",
					//},
					//list: {
						//label: "list",
						//type: "list",
						//item: {
							//label:"listitem",
							//type: "text",
						//}
					//},
					//objectlist: {
						//label: "list",
						//type: "list",
						//item: {
							//label:"objectitem",
							//type: "object",
							//items: {
								//text: {
									//label:"text",
									//type:"text",
								//}
							//}
						//}
					//},
					//"object": {
						//label:'object',
						//type: "object", 
						//items: {
							//text: {
								//label: "text",
								//type:"text",
							//},
							//link: {
								//label:"link",
								//type: "link",
							//}
						//}
					//}
				}	
			}
		},
		__data__: {
			type: Object,
			default: function() {
				return {
					//text: {
						//text: "hello world",
					//},
					//link: {
						//text: "link text",
						//href: "link href",
					//},
					//list: [
					//{
						//text: "list item text",
					//},
					//{
						//text: "list item text",
					//},
					//],
					//objectlist: [
					//{
						//text:{
							//text:"object list hello world"
						//}
					//}
					//],
					//"object": {
						//text: {
							//text:"object text",
						//},

						//link: {
							//text:"object link text",
							//href:"object link href",
						//},
					//}
				};
			}
		},
	},

	watch: {
		__data_type__: function() {
			//console.log(this.__data_type__);
		},
		__data__: function() {
		}
	},

	methods: {
		selectDataItem(data) {
			this.dataItem = data;
			//console.log(data);
		}
	}
}
</script>

<style scoped>
.horizontal-container {
	display: flex;	
}
.horizontal-data-nav-container {
	min-width: 300px;	
}
.horizontal-data-editor-container {
	flex:1;
}
.vertical-container {

}
.vertical-data-nav-container {
}
.vertical-data-editor-container {

}
</style>
