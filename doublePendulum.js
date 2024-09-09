
let canvasHolder = document.getElementById('canvasholder');
let w = canvasHolder.offsetWidth
console.log(w)

let m1 = 1.0, m2 = 1.0;
let l1 = 1.0, l2 = 1.0;
const g = 9.81;

let theta1 = Math.PI + 0.4;
let theta2 = Math.PI;
let omega1 = 0, omega2 = 0;

const delta_t = 0.01;
const scale = 3*w/16
const offset = { x: w/2, y: w/2};
var prev = [null, null]
let trace;
function setup() {
  let canvas = createCanvas(w, w);
  canvas.parent('doublePendulumCanvas');
  trace = createGraphics(width, height);
  trace.background(240, 240, 240);
}

function draw() {
  background(240, 240, 240);
  // image(trace, 0, 0);

  // Runge-Kutta Integration
  let k1 = G([theta1, theta2, omega1, omega2]);
  let k2 = G([theta1 + 0.5 * k1[0] * delta_t, theta2 + 0.5 * k1[1] * delta_t, omega1 + 0.5 * k1[2] * delta_t, omega2 + 0.5 * k1[3] * delta_t]);
  let k3 = G([theta1 + 0.5 * k2[0] * delta_t, theta2 + 0.5 * k2[1] * delta_t, omega1 + 0.5 * k2[2] * delta_t, omega2 + 0.5 * k2[3] * delta_t]);
  let k4 = G([theta1 + k3[0] * delta_t, theta2 + k3[1] * delta_t, omega1 + k3[2] * delta_t, omega2 + k3[3] * delta_t]);

  theta1 += (delta_t / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
  theta2 += (delta_t / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
  omega1 += (delta_t / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
  omega2 += (delta_t / 6) * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]);

  let point1 = {
    x: offset.x + l1 * scale * sin(theta1),
    y: offset.y + l1 * scale * cos(theta1)
  };

  let point2 = {
    x: point1.x + l2 * scale * sin(theta2),
    y: point1.y + l2 * scale * cos(theta2)
  };

  if (prev[1]) {
    trace.stroke(255);
    trace.line(prev[0], prev[1], point2.x, point2.y);
  }

  fill(0);
  ellipse(offset.x, offset.y, 8, 8);

  fill(13, 23, 219);
  ellipse(point1.x, point1.y, 15, 15);

  fill(13, 23, 219);
  ellipse(point2.x, point2.y, 15, 15);

  line(offset.x, offset.y, point1.x, point1.y);
  line(point1.x, point1.y, point2.x, point2.y);
  prev = [point2.x, point2.y]
}

function G(y) {
  const [theta1, theta2, omega1, omega2] = y;
  const f1 = omega1;
  const f2 = omega2;
  const f3 = (-g * (2 * m1 + m2) * sin(theta1) - m2 * g * sin(theta1 - 2 * theta2) - 2 * sin(theta1 - theta2) * m2 * (f2 ** 2 * l2 + f1 ** 2 * l1 * cos(theta1 - theta2))) / (l1 * (2 * m1 + m2 - m2 * cos(2 * theta1 - 2 * theta2)));
  const f4 = (2 * sin(theta1 - theta2) * (f1 ** 2 * l1 * (m1 + m2) + g * (m1 + m2) * cos(theta1) + f2 ** 2 * l2 * m2 * cos(theta1 - theta2))) / (l2 * (2 * m1 + m2 - m2 * cos(2 * theta1 - 2 * theta2)));
  return [f1, f2, f3, f4];
}