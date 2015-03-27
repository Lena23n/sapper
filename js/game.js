function Game(id) {
	this.id = id;
	this.drawer = new Drawer();
	this.holder = null;
	this.game = [];
	this.view = [];
	this.mineCount = 8;
	this.fieldSide = 10;
	this.cellState = {
		EMPTY: 0,
		MINE: 9,
		OPEN: 10,
		CLOSE: 11
	}
}

Game.prototype = {
	init: function () {
		var self = this;

		this.holder = document.getElementById(this.id);

		this.holder.addEventListener('click', function (e) {
			self.leftClickListener(e);
		});

		this.holder.addEventListener('contextmenu', function (e) {
			e.preventDefault();
		});

		this.startGame();
	},

	startGame: function () {
		this.clearHolder();
		this.createField();
	},

	createField: function () {
		this.drawer.createField(this.id, this.fieldSide, this.cellState);

		this.createEmptyGameField();
		this.putMine();
		this.calculateSiblingMines();

		this.drawer.draw(this.view, this.fieldSide);
	},

	createEmptyGameField: function () {
		var i,
			numberOfCells = Math.pow(this.fieldSide, 2);

		for (i = 0; i < numberOfCells; i++) {
			this.game[i] = this.cellState.EMPTY;
			this.view[i] = this.cellState.EMPTY;
		}

		//new version
		//var i,j;
		//
		//for (i = 0; i < this.fieldSide; i++) {
		//	this.game[i] = [];
		//	for (j = 0; j < this.fieldSide; j++) {
		//		this.game[i][j] = this.cellState.EMPTY;
		//	}
		//}

	},

	putMine: function () {
		var i,
			mines = this.mineCount,
			numberOfCells = Math.pow(this.fieldSide, 2);

		while (mines > 0) {
			i = Math.floor(Math.random() * numberOfCells);

			if (this.game[i] === this.cellState.EMPTY) {
				this.game[i] = this.cellState.MINE;
				mines--;
			}
		}

		//new version
		//var  x, y,
		//	mines = this.mineCount;
		//
		//while(mines > 0) {
		//	x = Math.floor((Math.random()*this.fieldSide));
		//	y = Math.floor((Math.random()*this.fieldSide));
		//
		//	if (this.game[x][y] === 0) {
		//		this.game[x][y] = this.cellState.MINE;
		//
		//		console.log(x, y);
		//		mines--;
		//	}
		//}


	},

	calculateSiblingMines: function () {
		var i,
			j;

		for (i = 0; i < this.game.length; i++) {
			if (this.game[i] !== this.cellState.MINE) {
				var result = 0,
					siblingMines = this.findSiblings(i);
				//	siblingMines = this.findSiblingMines(i);

				//console.log(siblingMines)
				//
				//for (j = 0; j < siblingMines.length; j++) {
				//
				//	console.log(siblingMines[j]);
				//	//if (siblingMines[j] === true) {
				//	//	result++;
				//	//}
				//}

				this.game[i] = result;
			}
		}
	},

	findSiblingMines: function (i) {
		var mine = this.cellState.MINE,
			siblingValues = this.findSiblings(i),
			sibling = this.checkSiblings(siblingValues);


		//sibling cell has a MINE
		var isMineSibling = {
			left: sibling.left == mine,
			topLeft: sibling.topLeft == mine,
			top: sibling.top == mine,
			topRight: sibling.topRight == mine,
			right: sibling.right == mine,
			bottomRight: sibling.bottomRight == mine,
			bottom: sibling.bottom == mine,
			bottomLeft: sibling.bottomLeft == mine
		};

		//array with checked siblings whether they have a MINE
		var siblingsMineArray = [
			isMineSibling.left,
			isMineSibling.topLeft,
			isMineSibling.top,
			isMineSibling.topRight,
			isMineSibling.right,
			isMineSibling.bottomRight,
			isMineSibling.bottom,
			isMineSibling.bottomLeft
		];

		return siblingsMineArray;

	},

	findSiblings: function (i) {
		var w = this.fieldSide,
			result,
			sibling,
			isSiblingRow,
			isSiblingColumn,
			isSiblingDiagonal,
			isSiblingCell,
			compareCoords,
			coordsDifference,
			currentCellX = i % w,
			currentCellY = Math.floor(i / w);

		//sibling cell index
		sibling = {
			left: i - 1,
			topLeft: i - w - 1,
			top: (i - w),
			topRight: i - w + 1,
			right: i + 1,
			bottomRight: i + w + 1,
			bottom: i + w,
			bottomLeft: i + w - 1
		};

		coordsDifference = {
			left: [-1, 0],
			topLeft: [-1, -1],
			top: [0, -1],
			topRight: [1, -1],
			right: [1, 0],
			bottomRight: [1, 1],
			bottom: [0, 1],
			bottomLeft: [-1, 1]
		};

		var map = {};

		for (var key in sibling) {
			map[key] = [];
			map[key].push(sibling[key] % w);
			map[key].push(Math.floor(sibling[key] / w));
		}


		var realDifference = {};

		for (var obj in map) {
			realDifference[obj] = (map[obj][0] == coordsDifference[obj][0]) && (map[obj][1] == coordsDifference[obj][1])
		}

		//console.log(i, realDifference);

		compareCoords = {

		};

		//isSiblingCell = {
		//	//left: compareCoords.leftX && compareCoords.leftY,
		//	left: this.game[sibling.left] && compareCoords.leftY,
		//	topLeft: this.game[sibling.topLeft] && compareCoords.topLeftY,
		//	top: compareCoords.topX && compareCoords.topY,
		//	topRight: compareCoords.topRightX && compareCoords.topRightY,
		//	right: compareCoords.rightX && compareCoords.rightY,
		//	bottomRight: compareCoords.bottomRightX && compareCoords.bottomRightY,
		//	bottom: compareCoords.bottomX && compareCoords.bottomY,
		//	bottomLeft: compareCoords.bottomLeftX && compareCoords.bottomLeftY
		//};
		//
		//result = isSiblingCell;
		//return result;

		////sibling has the same row
		//isSiblingRow = {
		//	left: Math.floor((sibling.left) / w) == currentCellY,
		//	right: Math.floor((sibling.right) / w) == currentCellY
		//};
		//
		////sibling has the same Column
		//isSiblingColumn = {
		//	top: (sibling.top) % w == currentCellX,
		//	bottom: (sibling.bottom) % w == currentCellX
		//};
		//
		////sibling diagonal (correct column and row)
		//isSiblingDiagonal = {
		//	topLeft: Math.abs((Math.floor((sibling.topLeft) / w) - currentCellY)) == 1,
		//	topRight: Math.abs((Math.floor((sibling.topRight) / w) - currentCellY)) == 1,
		//	bottomRight: Math.abs((Math.floor((sibling.bottomRight) / w) - currentCellY)) == 1,
		//	bottomLeft: Math.abs((Math.floor((sibling.bottomLeft) / w) - currentCellY)) == 1
		//};

		////gives sibling cells
		//isSiblingCell = {
		//	left: isSiblingRow.left && this.game[sibling.left],
		//	topLeft: isSiblingDiagonal.topLeft && this.game[sibling.topLeft],
		//	top: isSiblingColumn.top && this.game[sibling.top],
		//	topRight: isSiblingDiagonal.topRight && this.game[sibling.topRight],
		//	right: isSiblingRow.right && this.game[sibling.right],
		//	bottomRight: isSiblingDiagonal.bottomRight && this.game[sibling.bottomRight],
		//	bottom: isSiblingColumn.bottom && this.game[sibling.bottom],
		//	bottomLeft: isSiblingDiagonal.bottomLeft && this.game[sibling.bottomLeft]
		//};

		//result = [sibling, isSiblingRow, isSiblingColumn, isSiblingDiagonal];
		//return result;
	},

	checkSiblings : function (values) {

		var isSiblingCell,
			result,
			value;

		//description of different types of values
		value = {
			sibling: [0],
			row: [1],
			column: [2],
			diagonal: [3]
		};


		//gives sibling cells
		isSiblingCell = {
			left: values[value].left && this.game[sibling.left],
			topLeft: isSiblingDiagonal.topLeft && this.game[sibling.topLeft],
			top: isSiblingColumn.top && this.game[sibling.top],
			topRight: isSiblingDiagonal.topRight && this.game[sibling.topRight],
			right: isSiblingRow.right && this.game[sibling.right],
			bottomRight: isSiblingDiagonal.bottomRight && this.game[sibling.bottomRight],
			bottom: isSiblingColumn.bottom && this.game[sibling.bottom],
			bottomLeft: isSiblingDiagonal.bottomLeft && this.game[sibling.bottomLeft]
		};

		result = isSiblingCell;
		return result;
	},

	clearHolder: function () {
		this.holder.innerHTML = "";
	},

	leftClickListener: function (e) {
		var clickedCellPosition = this.defineCellPosition(e);

		this.openClickedCell(clickedCellPosition.x, clickedCellPosition.y);

	},

	defineCellPosition: function (e) {
		var offSetX, offSetY, currentX, currentY, x, y;

		offSetX = this.holder.offsetLeft;
		offSetY = this.holder.offsetTop;
		currentX = e.clientX - offSetX;
		currentY = e.clientY - offSetY;

		var result = {
			x: Math.floor(currentX / this.drawer.cellSize.w),
			y: Math.floor(currentY / this.drawer.cellSize.h)
		};

		return result;
	},

	openClickedCell: function (x, y) {
		var cellNumberInArray = y * this.fieldSide + x;

		if (this.game[cellNumberInArray] === this.cellState.EMPTY) {
			this.openSiblingsCells(x, y);
		} else {
			this.view[cellNumberInArray] = this.game[cellNumberInArray];
		}

		this.drawer.draw(this.view, this.fieldSide);
	},

	openSiblingsCells: function (x, y) {

		var i = y * this.fieldSide + x,
			sibling = this.findSiblings(i),
			test = [],
			j;

		test = [
			sibling.left,
			sibling.topLeft,
			sibling.top,
			sibling.topRight,
			sibling.right,
			sibling.bottomRight,
			sibling.bottom,
			sibling.bottomLeft
		];

		for (j = 0; j < test.length; j++) {
			if (test[j] !== this.cellState.MINE) {

			}
		}

		//
		//while (x > 0) {
		//	var sibling = this.findSiblings(i);
		//
		//
		//}
		//var result = 0,
		//	j,
		//	siblings = this.findSiblings(cellNumberInArray);
		//
		//for (j = 0; j < siblings.length; j++) {
		//	if (siblings[j] !== true) {
		//		this.view[i] = this.cellState.OPEN;
		//		this.view[isSibling[j]] = this.cellState.OPEN;
		//	}
		//}


		this.view[i] = this.cellState.OPEN;

	}

};

function pageLoaded() {
	var game = new Game('canvas');

	game.init();
}

window.addEventListener('load', pageLoaded);

