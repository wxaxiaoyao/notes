
const rotateDir = {
	'y': {
			'sizeEdges': [
				{'face': 'front', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
				{'face': 'right', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
				{'face': 'back', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
				{'face': 'left', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
			],
			'faceUp': {'face': 'bottom', 'rotateDegree': 0},
			'faceBottom': {'face': 'up', 'rotateDegree': 2}
		},
	'x': {
			'sizeEdges': [
				{'face': 'up', 'rowOrCol': 'col', 'stackDir': '1', 'readDir': '-1'},
				{'face': 'back', 'rowOrCol': 'col', 'stackDir': '-1', 'readDir': '1'},
				{'face': 'bottom', 'rowOrCol': 'col', 'stackDir': '1', 'readDir': '-1'},
				{'face': 'front', 'rowOrCol': 'col', 'stackDir': '1', 'readDir': '-1'},
			],
			'faceUp': {'face': 'right', 'rotateDegree': 0},
			'faceBottom': {'face': 'left', 'rotateDegree': 0}
		},
	'z': {
			'sizeEdges': [
				{'face': 'up', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
				{'face': 'right', 'rowOrCol': 'col', 'stackDir': '-1', 'readDir': '1'},
				{'face': 'bottom', 'rowOrCol': 'row', 'stackDir': '-1', 'readDir': '-1'},
				{'face': 'left', 'rowOrCol': 'col', 'stackDir': '1', 'readDir': '-1'},
			],
			'faceUp': {'face': 'front', 'rotateDegree': 0},
			'faceBottom': {'face': 'back', 'rotateDegree': 0}
		},
};
//rotateDegree: 转多少个90(顺时针)度才能做成旋转层floor的顶面，底面 旋转层的底面是他的顶面向Y轴旋转180度做成的
//floor的原始是z轴堆叠方向的，

//旋转i == j二维数组 dir: 1 顺时针， -1 逆时针, step 步数
function rotateSquareArr(arr, dir, step) {
	if (step == 0) {return arr;}
	var rotate180 = false,
		arrAfterRotate = [],
		floor = arr.length,
		maxIndex = floor - 1;

	step = step % 4;
	if (Math.abs(step) == 3) {
		dir = dir * -1;
	} else if (Math.abs(step) == 2) {
		rotate180 = true;
	}

	if (rotate180) {
		for (var i = 0; i < floor; i++) {
			for (var j = 0; j < floor; j++) {
				if (!arrAfterRotate[maxIndex - i]) {
					arrAfterRotate[maxIndex - i] = [];
				}
				arrAfterRotate[maxIndex - i][maxIndex - j] = arr[i][j];
			}
		}		
	} else if (dir == 1) {
		for (var i = 0; i < floor; i++) {
			for (var j = 0; j < floor; j++) {
				if (!arrAfterRotate[j]) {
					arrAfterRotate[j] = [];
				}
				arrAfterRotate[j][maxIndex - i] = arr[i][j];
			}
		}			
	} else if (dir == -1) {
		for (var i = 0; i < floor; i++) {
			for (var j = 0; j < floor; j++) {
				if (!arrAfterRotate[maxIndex - j]) {
					arrAfterRotate[maxIndex - j] = [];
				}
				arrAfterRotate[maxIndex - j][i] = arr[i][j];
			}
		}			
	}

	return arrAfterRotate;
}

function getRotateArgs(options = {}) {
	const {faceType, arrowType, row, col, cubeColNum} = options;
	const rowRotateData = {}, colRotateData = {};
	const args = {};
	////确定横竖分别会触发的旋转方向，主要就是用faceType查common.js的rotateDir
	for (let dir in rotateDir) {
		const edges = rotateDir[dir].sizeEdges;
		for (let i = 0; i < edges.length; i++) {
			if (edges[i].face == faceType) {
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

	switch (arrowType) {
		case 'up':
			args.rotateType = colRotateData.rotateType;
			args.dir = -colRotateData.readDir;
			args.floorNum = (colRotateData.stackDir == 1 ? col : cubeColNum - 1 - col);
			break;
		case 'down':
			args.rotateType = colRotateData.rotateType;
			args.dir = colRotateData.readDir;
			args.floorNum = (colRotateData.stackDir == 1 ? col : cubeColNum - 1 - col);
			break;
		case 'left':
			args.rotateType = rowRotateData.rotateType;
			args.dir = -rowRotateData.readDir;
			args.floorNum = (rowRotateData.stackDir == 1 ? row : cubeColNum - 1 - row);
			break;
		case 'right':
			args.rotateType = rowRotateData.rotateType;
			args.dir = rowRotateData.readDir;
			args.floorNum = (rowRotateData.stackDir == 1 ? row : cubeColNum - 1 - row);
			break;
	}

	return args;
}

export function getTimeStr(millisecond) {
	const second = 1000, minute = 60*second, hour = 60*minute, day = 24*hour, timeInfo = {};

	//补0
	function addZero(num) {
		if (num < 10) {
			return '0' + num.toString();
		}
		return num;
	}

	timeInfo.day = parseInt(millisecond / day, 10);
	millisecond -= timeInfo.day * day;
	timeInfo.hour = parseInt(millisecond / hour, 10);
	millisecond -= timeInfo.hour * hour;
	timeInfo.minute = parseInt(millisecond / minute, 10);
	millisecond -= timeInfo.minute * minute;
	timeInfo.second = parseInt(millisecond / second, 10);
	millisecond -= timeInfo.second * second;
	timeInfo.hour = addZero(timeInfo.hour);
	timeInfo.minute = addZero(timeInfo.minute);
	timeInfo.second = addZero(timeInfo.second);

	return timeInfo;
}

export default {
	rotateDir,
	rotateSquareArr,
	getRotateArgs,
}
