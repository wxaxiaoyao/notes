
import _ from "lodash";

import common from "./common.js";
import Block from "./block.js";

const {rotateDir, rotateSquareArr} = common;

class Face {
	constructor(faceType) {
		this.blocks = [];
		this.faceData = [];
		this.faceType = faceType;
		this.className = 'face ' + faceType;
		this.style = {};

		var faceTransformStyle = '';
		switch (faceType) {
			case 'front': 
				faceTransformStyle = 'translateZ(0px)';
				break;
			case 'right': 
				faceTransformStyle = 'rotateY(90deg) translateZ(0px)';
				break;
			case 'back': 
				faceTransformStyle = 'rotateY(180deg) translateZ(0px)';
				break;
			case 'left': 
				faceTransformStyle = 'rotateY(270deg) translateZ(0px)';
				break;
			case 'up': 
				faceTransformStyle = 'rotateX(90deg) translateZ(0px)';
				break;
			case 'bottom': 
				faceTransformStyle = 'rotateX(270deg) translateZ(0px)';
				break;
		}
		this.style.transform = faceTransformStyle;
	}

	col(colNum, colData) {
		var floorData = [];
		for (var i = 0; i < this.blocks.length; i++) {
			if (colData) {
				this.blocks[i][colNum].setType(colData[i]);
				this.blocks[i][colNum].style.opacity = '1';
			} else {
				floorData.push(this.blocks[i][colNum].type);
				this.blocks[i][colNum].style.opacity = '0';
			}
		}
		return floorData;
	}

	row(rowNum, rowData) {
		var floorData = [];
		for (var i = 0; i < this.blocks[rowNum].length; i++) {
			if (rowData) {
				this.blocks[rowNum][i].setType(rowData[i]);
				this.blocks[rowNum][i].style.opacity = '1';
			} else {
				floorData.push(this.blocks[rowNum][i].type);
				this.blocks[rowNum][i].style.opacity = '0';
			}
		} 
		return floorData;
	}
	
	//参数包括旋转类型xyz?， 层数 ,
	getFloorData(rotateType, floorNum) {
		var sizeEdgesData = rotateDir[rotateType].sizeEdges,edgeData = {};
		//找到对应该面的sizeedge数据
		for (var i = 0; i < sizeEdgesData.length; i++) {
			if (sizeEdgesData[i].face == this.faceType) {
				edgeData = sizeEdgesData[i];
			}
		}
		//{'face': 'front', 'rowOrCol': 'row', 'dir': '1'},
		var floorData = [];
		if (edgeData.rowOrCol == 'col') {
			floorData = this.col((edgeData.stackDir == 1? floorNum: this.cubeColNum - 1 - floorNum));
		} else {
			floorData = this.row((edgeData.stackDir == 1? floorNum: this.cubeColNum - 1 - floorNum));
		}
		return (edgeData.readDir == 1 ? floorData : floorData.reverse());
	}

	setFloorData = function(rotateType, floorNum, floorData) {
		var sizeEdgesData = rotateDir[rotateType].sizeEdges, edgeData = {};
		//找到对应该面的sizeedge数据
		for (var i = 0; i < sizeEdgesData.length; i++) {
			if (sizeEdgesData[i].face == this.faceType) {
				edgeData = sizeEdgesData[i];
			}
		}
		//{'face': 'front', 'rowOrCol': 'row', 'dir': '1'},
		if (edgeData.rowOrCol == 'col') {
			return this.col((edgeData.stackDir == 1? floorNum: this.cubeColNum - 1 - floorNum), (edgeData.readDir == 1 ? floorData : floorData.reverse()));
		} else {
			return this.row((edgeData.stackDir == 1? floorNum: this.cubeColNum - 1 - floorNum), (edgeData.readDir == 1 ? floorData : floorData.reverse()));
		}
	}

	//faceData形式：[['up','front','left'],[...],[...]]
	getFaceData() {
		var faceData = [];
		for (var i = 0; i < this.blocks.length; i++) {
			faceData[i] = [];
			for (var j = 0; j < this.blocks[i].length; j++) {
				faceData[i][j] = this.blocks[i][j].type;
				this.blocks[i][j].style.opacity = '0';
			}
		}
		return faceData;
	}

	//faceData形式：[['up','front','left'],[...],[...]]
	setFaceData(faceData) {
		for (var i = 0; i < faceData.length; i++) {
			for (var j = 0; j < faceData[i].length; j++) {
				this.blocks[i][j].setType(faceData[i][j]);
				this.blocks[i][j].style.opacity = '1';
			}	
		}		
	}

	isAllSame() {
		var type =  this.blocks[0][0].type;
			
		for (var i = 0; i < this.blocks.length; i++) {
			for (var j = 0; j < this.blocks[i].length; j++) {
				if (this.blocks[i][j].type != type) {
					return false;
				}				
			}
		}
		return true;
	}

	hideRown(rowIndex ) {}

	hideCol(rowIndex ) {}

	reset({cubeColNum, cubeSize}) {
		this.cubeSize = cubeSize || this.cubeSize;
		this.cubeColNum = cubeColNum || this.cubeColNum;

		this.blocklist = [];
		this.blocks = _.times(this.cubeColNum, _ => []);
		const size = 100 / this.cubeColNum;
		for (let i = 0; i < this.cubeColNum; i++) {
			for (let j = 0; j < this.cubeColNum; j++) {
				const blockData = {
					type: this.faceType, 
					col: j, 
					row: i, 
					width: size, 
					height: size, 
					left: size * j,	
					top: size * i, 
					floorBlock: false,
					cubeColNum: this.cubeColNum,
					cubeSize: this.cubeSize
				};

				const block = new Block(blockData);

				this.blocks[i].push(block);
				this.blocklist.push(block);
			}
		}
	}	
}

export default Face;
