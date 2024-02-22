document.addEventListener('DOMContentLoaded', () => {
  const zoomSlider = document.getElementById('zoomSlider');
  const blogContainer = document.querySelector('.blog-container');

  zoomSlider.addEventListener('input', () => {
    const scaleValue = zoomSlider.value;
    // Adjust grid template columns based on zoom level
    blogContainer.style.gridTemplateColumns = `repeat(auto-fit, minmax(${scaleValue * 10}%, 1fr))`;
  });
});
const horizontalSlider = document.getElementById('horizontalSlider');
const verticalSlider = document.getElementById('verticalSlider');

horizontalSlider.addEventListener('input', () => {
  const scrollValue = horizontalSlider.value;
  blogContainer.scrollLeft = (blogContainer.scrollWidth - blogContainer.clientWidth) * (scrollValue / 100);
});

verticalSlider.addEventListener('input', () => {
  const scrollValue = verticalSlider.value;
  blogContainer.scrollTop = (blogContainer.scrollHeight - blogContainer.clientHeight) * (scrollValue / 100);
});
let isDragging = false;
let startX, startY;
let scrollSpeedX = 0, scrollSpeedY = 0;

blogContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX - blogContainer.offsetLeft;
  startY = e.pageY - blogContainer.offsetTop;
  scrollSpeedX = scrollSpeedY = 0;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const x = e.pageX - blogContainer.offsetLeft;
  const y = e.pageY - blogContainer.offsetTop;
  scrollSpeedX = x - startX;
  scrollSpeedY = y - startY;
  blogContainer.scrollLeft -= scrollSpeedX;
  blogContainer.scrollTop -= scrollSpeedY;
  startX = x;
  startY = y;
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  const deceleration = 0.95; // Adjust for effect
  const inertia = setInterval(() => {
    blogContainer.scrollLeft -= scrollSpeedX;
    blogContainer.scrollTop -= scrollSpeedY;
    scrollSpeedX *= deceleration;
    scrollSpeedY *= deceleration;
    if (Math.abs(scrollSpeedX) < 1 && Math.abs(scrollSpeedY) < 1) clearInterval(inertia);
  }, 10);
});

