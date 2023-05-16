const svg = document.getElementById('display');
const width = window.innerWidth;
const height = window.innerHeight;

let slimes = [];

const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
svg.appendChild(container);

// Create a food item
function createFood(x, y) {
  const food = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  food.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'http://images.clipartpanda.com/apple-20clip-20art-apple-clipart.gif');
  food.setAttribute('x', x - 25);  // Set the center of the image as the click position
  food.setAttribute('y', y - 25);  
  food.setAttribute('width', '50');
  food.setAttribute('height', '50');
  container.insertBefore(food, container.firstChild); 

// Set the food to be deleted after 5 seconds
  setTimeout(() => {
    container.removeChild(food);
    for (const slime of slimes) {
      slime.targetFood = null;
    }
  }, 5000);  // 5000 milliseconds = 5s

  return food;
}

svg.addEventListener('click', function(event) {
  const x = event.clientX;
  const y = event.clientY;

  const food = createFood(x, y);

  for (const slime of slimes) {
    slime.targetFood = food;
  }
});

// Create slime mold
function createSlime(x, y) {
  const slime = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  slime.setAttribute('cx', x);
  slime.setAttribute('cy', y);
  slime.setAttribute('r', '10');
  slime.setAttribute('fill', 'orange');
  container.appendChild(slime); 

// Set the fill color of slime to gradient
slime.setAttribute('fill', 'url(#gradient)');

  return {
    element: slime,
    targetFood: null,
    speed: Math.random() + 0.5, 
    move: function() {
      if (this.targetFood) {
          /// Move to the target food if it is available
          const dx = this.targetFood.cx.baseVal.value - x;
          const dy = this.targetFood.cy.baseVal.value - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const speed = 0.5; 
        
          if (distance > speed) { 
            x += (dx / distance) * this.speed;
            y += (dy / distance) * this.speed;
          } else {
            this.targetFood = null;
          }
        } else {
          // Move freely if there is no target food
          const angle = Math.random() * Math.PI * 2;
          const speed = 1; 
          const dx = Math.cos(angle) * speed;
          const dy = Math.sin(angle) * speed;
        
          x += dx;
          y += dy;
        }
      
        slime.setAttribute('cx', x);
        slime.setAttribute('cy', y);

      document.getElementById('innerColor').setAttribute('stop-color', getRandomColor());
      document.getElementById('outerColor').setAttribute('stop-color', getRandomColor());
      }
      
  };
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
svg.addEventListener('click', function(event) {
  const x = event.clientX;
  const y = event.clientY;
  
  createFood(x, y);
  
  for (const slime of slimes) {
    slime.targetFood = { cx: { baseVal: { value: x } }, cy: { baseVal: { value: y } } };
  }
});

// Initialization
for (let i = 0; i < 100; i++) {
    const x = width / 2; 
    const y = height / 2; 
  
    const dx = Math.random() * 100 - 40;
    const dy = Math.random() * 100 - 30;
    
    const slime = createSlime(x + dx, y + dy); 
    slimes.push(slime);
  }

function animate() {
  for (const slime of slimes) {
    slime.move();
  }
  
  requestAnimationFrame(animate);
}

animate();