
<template>
	<div>
		<h3>{{__data__.subject}}</h3>
		<p>{{__data__.body}}</p>
		<div>
			<img :src="order.QR">
		</div>
	</div>
</template>

<script>

import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			order: {},

			default_data: {
				subject: "会员",
				body: "keepwork 会员",
				channel: "wx_pub_qr",
				amount: 30,
			}
		}
	},

	props: {
	},

	async mounted() {
		const result = await this.api.orders.create(this.__data__);
		if (result.isErr()) return;

		this.order = result.data || {};
	}
}
</script>
