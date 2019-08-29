const teams = ['Aliens', 'Humans'];
const Orientation = Object.freeze({
    VERTICAL: Symbol('vertical'),
    HORIZONTAL: Symbol('horizontal')
});
const Status = Object.freeze({
    HIT: Symbol('hit'),
    NOTHIT: Symbol('nothit')
});

class Point {
    x = null;
    y = null;
}

class Association {
    point = null;
    ship = null;
    constructor(point, ship) {
        this.point = point;
        this.ship = ship;
    }
}

class Ship {
    length = 1;
    direction = Orientation.VERTICAL;
    parts = [];

    constructor(length) {
        this.length = length;
        for (let i = 0; i < this.length; i++) {
            this.parts.push({
                state: Status.NOTHIT
            });
        }
    }

    setHit(part) {
        this.parts[part] = Status.HIT;
    }

    isDead() {
        return !(this.parts.find(e => e.state === Status.NOTHIT));
    }
}

class Cell {
    index = null;
    name = "";
    ship = false;
    alreadyShot = false;
    constructor(index, name) {
        this.index = parseInt(index, 10);
        this.name = name.toString();
    }
}

class Grid {
    defaultDimension = 8;
    dimension = null;
    matrix = {};
    associations = [];

    constructor(dimension = null) {
        this.dimension = (dimension ? dimension : this.defaultDimension);
    }

    init() {
        for (let i = 0; i < this.dimension; i++) {
            let row = {
                index: i,
                name: getRowIndex(i),
                cells: []
            };
            for (let k = 0; k < this.dimension; k++) {
                let cell =  new Cell(k, (k + 1));
                row.cells.push(cell);
            }
            this.matrix[row.name] = row;
        }
        this.render();
    }

    render() {
        console.log(this.matrix);
        let rendered = document.createElement('div');
        for (let colIndex in this.matrix) {
            let col = this.matrix[colIndex];
            let rowNode = document.createElement('div');
            rowNode.className = 'row';
            col.cells.forEach(cell => {
                let node = document.createElement('div');
                node.className = 'cell';
                node.innerHTML = col.name + " - " + cell.name;
                rowNode.appendChild(node);
            })
            rendered.appendChild(rowNode);
        }
        document.getElementById('exe').appendChild(rendered);
    }
}

function getRowIndex (n) {
    return getChar(parseInt(n));
}
function getChar (n) {
    return String.fromCharCode(65 + n);
}

document.addEventListener('DOMContentLoaded', function() {
    const grid = new Grid();
    grid.init();
})