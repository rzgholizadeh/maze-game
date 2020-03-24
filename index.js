const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 600;
const height = 600;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	// where we want to show the canvas in our page
	element: document.body,
	engine: engine,
	options: {
		// outline or solid fill for shapes
		wireframes: false,
		// size of the canvas element
		width,
		height
	}
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
	Bodies.rectangle(width / 2, 0, width, 40, {
		isStatic: true
	}),
	Bodies.rectangle(width / 2, height, width, 40, {
		isStatic: true
	}),
	Bodies.rectangle(0, height / 2, 40, height, {
		isStatic: true
	}),
	Bodies.rectangle(width, height / 2, 40, height, {
		isStatic: true
	})
];
World.add(world, walls);
