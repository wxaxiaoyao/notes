
import _ from "lodash";

import common from "./common.js";

const {rotateDir, rotateSquareArr} = common;

class Block {
	constructor(options = {}) {
		const {type, col, row, width, height, left, top, floorBlock, cubeColNum, cubeSize} = options;

		this.cubeColNum = cubeColNum;
		this.cubeSize = cubeSize;

		this.style = {};
		this.type = type;
		this.belongFaceType = type;//所属面
		this.col = col || 0;
		this.row = row || 0;
		this.width = width || 0;//百分比
		this.height = height || 0;//百分比
		this.left = left || 0;
		this.top = top || 0;
		this.floorBlock = floorBlock;

		this.style.top = this.top + this.height / 2 + "%";
		this.style.left = this.left + this.width / 2 + "%";
		this.style.width = "0%";
		this.style.height = "0%";
		this.className = "block block-" + this.type;

		setTimeout(() => {
			this.style.width = this.width + "%";
			this.style.height = this.height + "%";
			this.style.top = this.top + "%";
			this.style.left = this.left + "%";
		}, 100);
	}

	setType(type) {
		this.type = type;
		this.className = 'block block-' + type;
	}

	getType() {
		return this.type;
	}
}

export default Block;
