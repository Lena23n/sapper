function Game (id) {
	this.id = id;
	this.drawer = new Drawer();
	this.holder = null;
	this.game = [];
	this.mineCount = 8;
	this.fieldSide = 10;
	this.cellState = {
		empty: 0,
		mine: 9,
		closed: 10
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
		this.createField();
	},

	createField : function () {
		this.drawer.createField(this.id, this.fieldSide);

		this.createEmptyGameField();
		this.putMine();
		//this.calculateSiblingMines();

		this.drawer.draw(this.game, this.fieldSide);
	},

	createEmptyGameField : function () {
		//var i,
		//	numberOfCells = Math.pow(this.fieldSide, 2);
		//
		//for( i = 0; i < numberOfCells; i++) {
		//	this.game[i] = this.cellState.empty;
		//}

		//new version
		var i,j;

		for (i = 0; i < this.fieldSide; i++) {
			this.game[i] = [];
			for (j = 0; j < this.fieldSide; j++) {
				this.game[i][j] = this.cellState.empty;
			}
		}

	},

	putMine : function () {
		//var i,
		//	mines = this.mineCount,
		//	numberOfCells = Math.pow(this.fieldSide, 2);
		//
		//while (mines > 0) {
		//	i = Math.floor(Math.random()*numberOfCells);
		//
		//	this.game[i] = this.cellState.mine;
		//	mines--;
		//}

		//new version
		var  x, y,
			mines = this.mineCount;

		while(mines > 0) {
			x = Math.floor((Math.random()*this.fieldSide));
			y = Math.floor((Math.random()*this.fieldSide));

			if (this.game[x][y] === 0) {
				this.game[x][y] = this.cellState.mine;

				console.log(x, y);
				mines--;
			}
		}


	},

	calculateSiblingMines : function () {
		var i,
			j,
			w = this.fieldSide;
		for (i = 0; i < this.game.length; i++) {
			if (this.game[i] !== this.cellState.mine) {
				var result = 0,
					mine = this.cellState.mine,
					currentCellX = i%w,
					currentCellY = Math.floor(i/w),
					isLeftSibling = Math.floor((i-1)/w) == currentCellY,
					isRightSibling = Math.floor((i+1)/w) == currentCellY,
					isRightMine = isRightSibling && this.game[i+1] == mine,
					isLeftMine = isLeftSibling && this.game[i - 1 ] == mine,
					isTopSiblings = (i-w)%w == currentCellX,
					isBottomSiblings = (i+w)%w == currentCellX,
					isTopMine = isTopSiblings && this.game[i - w] == mine,
					isBottomMine = isBottomSiblings && this.game[i + w] == mine;

				var arrayTest = [isRightMine,isTopMine,isBottomMine,isLeftMine];

				for (j = 0; j < arrayTest.length; j++) {
					if (arrayTest[j] === true) {
						result++;
						console.log(result);
					}
				}

				this.game[i] = result;
			}
		}

		//new version

	},

	leftClickListener : function (e) {
		this.defineCellPosition(e);
	},

	defineCellPosition : function (e) {
		var offSetX, offSetY, x, y;

		offSetX = this.holder.offsetLeft;
		offSetY = this.holder.offsetTop;

		x = Math.floor(e.clientX - offSetX);
		y = Math.floor(e.clientY - offSetY);

		console.log(x, y);
	}

};

function pageLoaded () {
	var game = new Game('canvas');

	game.init();
}

window.addEventListener('load', pageLoaded);

