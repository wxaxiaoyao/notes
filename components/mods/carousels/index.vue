
<template>
	<el-carousel trigger="click" :height="__data__.height || '150px'">
		<el-carousel-item v-for="(item, index) in __data__.items" :key="index">
			<img v:if="item.src" :src="item.src"/> 
		</el-carousel-item>
	</el-carousel>
</template>

<script>
import _ from "lodash";

import {
	Carousel,
	CarouselItem,
} from "element-ui";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],
	components: {
		[Carousel.name]: Carousel,
		[CarouselItem.name]: CarouselItem,
	},

	data: function() {
		return {
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					height: '300px',
					items:[
						{
							src:"http://uploads.5068.com/allimg/151029/58-151029114221-52.jpg",
						},
						{
							src:"http://uploads.5068.com/allimg/151029/58-151029114220.jpg",
						},
						{
							src:"http://uploads.5068.com/allimg/151113/48-151113161301.jpg",
						},
					],
				}
			}
		},
	},

	computed: {
	},

	mounted() {
		//console.log(this.__data__);
	}
}
</script>
<style scope>
img {
	height:100%;
	width: 100%;
}
</style>
