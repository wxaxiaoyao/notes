
import mod from "@/components/mods/common/mod.js";

export default {
	mixins: [mod],

	data: function() {
		return {
			mods: [
			{
				label: "轮播",
				modname: "carousels",
				styles: [
				{
					label: "默认样式",
					stylename: "index",
					description: "图片轮播",
				}
				]
			},
			{
				label: "首部",
				modname:"headers",
				styles: [
				{
					label:"默认样式",
					stylename:"index",
					description:"页面首部元素",
				}
				]
			}
			]
		}
	},
}
