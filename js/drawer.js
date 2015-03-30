function Drawer () {
	this.field = null;
	this.context = null;
	this.fieldWidth = 300;
	this.fieldHeight = 300;
	this.cellState = {};
	this.cellSize = {
		w: null,
		h: null
	}
}


Drawer.prototype = {
	createField : function (id, fieldSide, cellState) {
		this.field = document.createElement('canvas');

		this.field.width = this.fieldWidth;
		this.field.height = this.fieldHeight;

		this.context = this.field.getContext('2d');

		this.cellSize.w = this.fieldWidth / fieldSide;
		this.cellSize.h = this.fieldHeight/ fieldSide;

		this.attachToDOM(id, this.field);
		this.cellState = cellState;
	},

	attachToDOM : function (id, child) {
		document.getElementById(id).appendChild(child);
	},

	draw : function (array, fieldSide) {
		this.context.clearRect(0, 0, this.fieldWidth, this.fieldHeight);

		var i, x, y, text;

		for (i = 0; i < array.length; i++) {
			x = i%fieldSide;
			y = Math.floor(i/fieldSide);
			text = array[i];

			x *=this.cellSize.w;
			y *=this.cellSize.h;

			this.drawCell(text, x, y);
		}
	},

	drawCell : function (text, x ,y) {
		var radius = this.cellSize.w/2;
		this.context.font = "14px Arial";
		this.context.textBaseline = 'middle';
		this.context.textAlign = "center";

		switch (text) {
			case this.cellState.MINE:
				this.context.beginPath();
				this.context.arc(x+radius, y+radius, radius*0.7, 0, 2 * Math.PI, false);
				this.context.fillStyle = 'red';
				this.context.fill();
				this.context.lineWidth = 1;
				break;
			case this.cellState.FLAG:
				this.context.fillStyle = 'red';
				this.context.beginPath();
				this.context.moveTo(x+6, y + (this.cellSize.h/2));
				this.context.lineTo((x+this.cellSize.w*0.7), y+4);
				this.context.lineTo((x+this.cellSize.w*0.7), y + this.cellSize.h - 4);
				this.context.fill();
				//this.context.fillRect(x, y, this.cellSize.w, this.cellSize.h);
				break;
			case this.cellState.EMPTY:
				this.context.fillStyle = '#222222';
				this.context.fillRect(x, y, this.cellSize.w, this.cellSize.h);
				break;
			case this.cellState.OPEN:
				this.context.fillStyle = '#666666';
				this.context.fillRect(x, y, this.cellSize.w, this.cellSize.h);
				break;
			default:
				this.context.fillStyle = '#444444';
				this.context.fillRect(x, y, this.cellSize.w, this.cellSize.h);
				this.context.fillStyle = "#ffffff";
				this.context.fillText(text, x+14, y+14);
		}

		this.context.strokeStyle = 'grey';
		this.context.strokeRect(x, y, this.cellSize.w, this.cellSize.h);
	}
};