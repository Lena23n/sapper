function Game (id) {
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
	init : function () {
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

	startGame : function () {
		this.clearHolder();
		this.createField();
	},

	createField : function () {
		this.drawer.createField(this.id, this.fieldSide, this.cellState);

		this.createEmptyGameField();
		this.putMine();
		this.calculateSiblingMines();

		this.drawer.draw(this.view, this.fieldSide);
	},

	createEmptyGameField : function () {
		var i,
			numberOfCells = Math.pow(this.fieldSide, 2);

		for( i = 0; i < numberOfCells; i++) {
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

	putMine : function () {
		var i,
			mines = this.mineCount,
			numberOfCells = Math.pow(this.fieldSide, 2);

		while (mines > 0) {
			i = Math.floor(Math.random()*numberOfCells);

			if (this.game[i] === this.cellState.EMPTY) {
				this.game[i] = this.cellState.MINE;
				mines--;
				console.log(i)
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

	calculateSiblingMines : function () {
		var i,
			j;

		for (i = 0; i < this.game.length; i++) {
			if (this.game[i] !== this.cellState.MINE) {
				var result = 0,
					siblings = this.findSiblings(i);

				for (j = 0; j < siblings.length; j++) {
					if (siblings[j] === true) {
						result++;
					}
				}

				this.game[i] = result;
			}
		}
	},

	findSiblings : function (i) {
		var w = this.fieldSide,
			mine = this.cellState.MINE,
			currentCellX = i%w,
			currentCellY = Math.floor(i/w);

		//position difference between current cell and sibling cell
		//var findSibling2 = {
		//	left : [-1, 0],
		//	right : [1, 0],
		//	top : [0, -1],
		//	bottom : [0, 1],
		//	topLeft : [-1, -1],
		//	topRight : [1, -1],
		//	bottomLeft : [-1, 1],
		//	bottomRight : [1, 1]
		//};
		//
		////position difference in array between current cell and sibling cell
		//var findSibling = {
		//	left: -1,
		//	right: 1,
		//	top: 10,
		//	bottom: 10,
		//	topLeft : -11,
		//	topRight : -9,
		//	bottomLeft : 9,
		//	bottomRight : 11
		//};

		//sibling has the same row or column
		var isSiblingRow = {
			left : Math.floor((i-1)/w) == currentCellY,
			topLeft : Math.abs((Math.floor((i-w+1)/w) - currentCellY)) == 1,
			top : (i-w)%w == currentCellX,
			topRight : Math.abs((Math.floor((i-w-1)/w) - currentCellY)) == 1,
			right : Math.floor((i+1)/w) == currentCellY,
			bottomRight: Math.abs((Math.floor((i+w+1)/w) - currentCellY)) == 1,
			bottom : (i+w)%w == currentCellX,
			bottomLeft: Math.abs((Math.floor((i+w-1)/w) - currentCellY)) == 1
		};


		var isSiblingadsfsdf = {
			left : [i - 1],
			topLeft: [i - w + 1 ],
			top : [i - w],
			topRight: [i - w - 1],
			right : [i+1],
			bottomRight: [i + w + 1],
			bottom : [i + w],
			bottomLeft: [i + w - 1]
		};

		//sibling cell has a MINE
		var isMineSibling = {
			left : isSibling.left && this.game[i - 1 ] == mine,
			topLeft: isSibling.topLeft && this.game[i - w + 1 ] == mine,
			top : isSibling.top && this.game[i - w] == mine,
			topRight: isSibling.topRight && this.game[i - w - 1 ] == mine,
			right : isSibling.right && this.game[i+1] == mine,
			bottomRight: isSibling.bottomRight && this.game[i + w + 1 ] == mine,
			bottom : isSibling.bottom && this.game[i + w] == mine,
			bottomLeft: isSibling.bottomLeft && this.game[i + w - 1 ] == mine
		};

		//array with checked siblings whether they have MINE
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

	clearHolder : function () {
		this.holder.innerHTML = "";
	},

	leftClickListener : function (e) {
		var clickedCellPosition = this.defineCellPosition(e);

		this.openClickedCell(clickedCellPosition.x, clickedCellPosition.y);

	},

	defineCellPosition : function (e) {
		var offSetX, offSetY, currentX, currentY, x, y;

		offSetX = this.holder.offsetLeft;
		offSetY = this.holder.offsetTop;
		currentX = e.clientX - offSetX;
		currentY = e.clientY - offSetY;

		var result = {
			x : Math.floor(currentX/this.drawer.cellSize.w),
			y : Math.floor(currentY/this.drawer.cellSize.h)
		};

		return result;
	},

	openClickedCell : function (x , y) {
		var cellNumberInArray = y*this.fieldSide + x;

		if (this.game[cellNumberInArray] === this.cellState.EMPTY) {
			this.openSiblingsCells(x, y);
		} else {
			this.view[cellNumberInArray] = this.game[cellNumberInArray];
		}

		this.drawer.draw(this.view, this.fieldSide);
	},

	openSiblingsCells : function (x, y) {

		var i = y*this.fieldSide + x,
			w = this.fieldSide;


		var isSibling = {
			left : [i - 1 ],
			topLeft: [i - w + 1 ],
			top : [i - w],
			topRight: [i - w - 1 ],
			right : [i+1],
			bottomRight: [i + w + 1 ],
			bottom : [i + w],
			bottomLeft: [i + w - 1 ]
		};

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

		//while ( x >= 0) {
		//	var cellNumberInArray = y*this.fieldSide + x;
		//
		//	switch (this.game[cellNumberInArray]) {
		//		case this.cellState.EMPTY:
		//			this.view[cellNumberInArray] = this.cellState.OPEN;
		//			break;
		//		case this.cellState.MINE:
		//			x = 0;
		//			break;
		//		default:
		//			this.view[cellNumberInArray] = this.game[cellNumberInArray];
		//	}
		//	x--;
		//}
		//
		//while ( x <= 10) {
		//	var cellNumberInArray = y*this.fieldSide + x;
		//
		//	switch (this.game[cellNumberInArray]) {
		//		case this.cellState.EMPTY:
		//			this.view[cellNumberInArray] = this.cellState.OPEN;
		//			break;
		//		case this.cellState.MINE:
		//			x = 10;
		//			break;
		//		default:
		//			this.view[cellNumberInArray] = this.game[cellNumberInArray];
		//	}
		//	x++;
		//}



	}

};

function pageLoaded () {
	var game = new Game('canvas');

	game.init();
}

window.addEventListener('load', pageLoaded);

