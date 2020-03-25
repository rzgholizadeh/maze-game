const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 10;
const width = 600;
const height = 600;

const unitLength = width / cells;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	// where we want to show the canvas in our page
	element: document.body,
	engine: engine,
	options: {
		// outline or solid fill for shapes
		wireframes: true,
		// size of the canvas element
		width,
		height
	}
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
	Bodies.rectangle(width / 2, 0, width, 2, {
		isStatic: true
	}),
	Bodies.rectangle(width / 2, height, width, 2, {
		isStatic: true
	}),
	Bodies.rectangle(0, height / 2, 2, height, {
		isStatic: true
	}),
	Bodies.rectangle(width, height / 2, 2, height, {
		isStatic: true
	})
];
World.add(world, walls);

// Maze generation

const shuffle = arr => {
	let counter = arr.length;
	while (counter > 0) {
		const index = Math.floor(Math.random() * counter);
		counter--;
		const temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}
	return arr;
};

const grid = Array(cells)
	.fill(null)
	.map(() => Array(cells).fill(false));
const verticals = Array(cells)
	.fill(null)
	.map(() => Array(cells - 1).fill(false));
const horizontals = Array(cells - 1)
	.fill(null)
	.map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
	// if visited the cell at [row,column] then return null
	if (grid[row][column]) {
		return;
	}
	// else, mark the cell as being visited
	grid[row][column] = true;
	// assemble random-ordered list of neighbors
	const neighbors = shuffle([
		[row - 1, column, "up"],
		[row, column + 1, "right"],
		[row + 1, column, "down"],
		[row, column - 1, "left"]
	]);
	// for each neighbor
	for (let neighbor of neighbors) {
		const [nextRow, nextColumn, direction] = neighbor;
		// see if neighbor is out of bounds
		if (
			nextRow < 0 ||
			nextRow >= cells ||
			nextColumn < 0 ||
			nextColumn >= cells
		) {
			continue;
		}
		// see if neighbor is already visited
		if (grid[nextRow][nextColumn]) {
			continue;
		}
		// remove the wall to that neighbor
		switch (direction) {
			case "up":
				horizontals[row - 1][column] = true;
				break;
			case "down":
				horizontals[row][column] = true;
				break;
			case "right":
				verticals[row][column] = true;
				break;
			case "left":
				verticals[row][column - 1] = true;
				break;
			default:
				console.log("default!");
				break;
		}
		// visit that next neighbor
		stepThroughCell(nextRow, nextColumn);
	}
};

stepThroughCell(startRow, startColumn);
console.log(verticals, horizontals);

horizontals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) return;
		const wall = Bodies.rectangle(
			columnIndex * unitLength + unitLength / 2,
			rowIndex * unitLength + unitLength,
			unitLength,
			5,
			{
				isStatic: true
			}
		);
		World.add(world, wall);
	});
});

verticals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) return;
		const wall = Bodies.rectangle(
			columnIndex * unitLength + unitLength,
			rowIndex * unitLength + unitLength / 2,
			5,
			unitLength,
			{
				isStatic: true
			}
		);
		World.add(world, wall);
	});
});

// Goal
const goal = Bodies.rectangle(
	width - unitLength / 2,
	height - unitLength / 2,
	unitLength * 0.7,
	unitLength * 0.7,
	{ isStatic: true }
);
World.add(world, goal);

// Ball
const ball = Bodies.circle(unitLength / 2, unitLength / 2, unitLength * 0.25, {
	isStatic: true
});
World.add(world, ball);
