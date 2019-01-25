
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

		this.arrows = [];
		if (floorBlock) return;
		this.arrows = [
		{className:"arrow-up", style:{}, attr:{}},
		{className:"arrow-right", style:{}, attr:{}},
		{className:"arrow-down", style:{}, attr:{}},
		{className:"arrow-left", style:{}, attr:{}},
		];
		//箭头横向（left right）转的时候要用的旋转数据，在sizeEdges里
		//箭头竖向（up down）转的时候要用的旋转数据，在sizeEdges里
		const rowRotateData = {}, colRotateData = {};
		////确定横竖分别会触发的旋转方向，主要就是用faceType查common.js的rotateDir
		for (let dir in rotateDir) {
			let edges = rotateDir[dir].sizeEdges;
			for (let i = 0; i < edges.length; i++) {
				if (edges[i].face == this.belongFaceType) {
					if (edges[i].rowOrCol == 'row') {
						rowRotateData.rotateType = dir;
						rowRotateData.stackDir = edges[i].stackDir;
						rowRotateData.readDir = edges[i].readDir;
					} else {
						colRotateData.rotateType = dir;
						colRotateData.stackDir = edges[i].stackDir;
						colRotateData.readDir = edges[i].readDir;
					}
				}
			}
		}

		const arrows = this.arrows;
		const cube_floor_num = cubeColNum || common.cubeColNum;
		for (let i = 0; i < arrows.length; i++) {
			let arrowType = arrows[i].className.replace('arrow-', ''), rotateType = '', dir = '', floorNum = 0;
			switch (arrowType) {
				case 'up':
					rotateType = colRotateData.rotateType;
					dir = -colRotateData.readDir;
					floorNum = (colRotateData.stackDir == 1 ? this.col : cube_floor_num - 1 - this.col);
					break;
				case 'down':
					rotateType = colRotateData.rotateType;
					dir = colRotateData.readDir;
					floorNum = (colRotateData.stackDir == 1 ? this.col : cube_floor_num - 1 - this.col);
					break;
				case 'left':
					rotateType = rowRotateData.rotateType;
					dir = -rowRotateData.readDir;
					floorNum = (rowRotateData.stackDir == 1 ? this.row : cube_floor_num - 1 - this.row);
					break;
				case 'right':
					rotateType = rowRotateData.rotateType;
					dir = rowRotateData.readDir;
					floorNum = (rowRotateData.stackDir == 1 ? this.row : cube_floor_num - 1 - this.row);
					break;
			}
			arrows[i].rotateType = rotateType;
			arrows[i].dir = dir;
			arrows[i].floorNum = floorNum;
			arrows[i].attr.alt = rotateType + ',' + dir + ',' + floorNum;
			arrows[i].style.borderWidth = this.cubeSize/this.cubeColNum/6 + 'px';
		}
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
