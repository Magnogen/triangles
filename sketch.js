// jshint esversion: 10
const $ = query => document.querySelector(query);
const $$ = query => document.querySelectorAll(query);
EventTarget.prototype.on = function (...args) { return this.addEventListener(...args) };
EventTarget.prototype.trigger = function (event) { return this.dispatchEvent(new Event(event)) };

const c = $('canvas');
const ctx = c.getContext('2d');
c.width = innerWidth;
c.height = innerHeight;

;(async () => {
  
  let loops = [...Array(2)].map(e => ({
    verts: [...Array(3)].map(e => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      theta: Math.random() * 2*Math.PI
    })),
    col: new Elements.Colour('hsl', Math.random()*360, 0.3 + Math.random()*0.4, 0.5).toHex(),
    draw(ctx) {
      ctx.strokeStyle = this.col;
      ctx.lineWidth = 1.5*Math.min(c.width, c.height)/150;
      ctx.beginPath();
      for (let i = 1; i <= this.verts.length; i++) {
        ctx.moveTo(this.verts[i-1].x, this.verts[i-1].y);
        ctx.lineCap = 'round';
        ctx.lineTo(this.verts[i%this.verts.length].x, this.verts[i%this.verts.length].y);
      }
      ctx.stroke();
    },
    update(dt) {
      for (let v of this.verts) {
        if (v.x < 0 || v.x > c.width) v.theta = Math.random() * 2*Math.PI;
        if (v.y < 0 || v.y > c.height) v.theta = Math.random() * 2*Math.PI;
        v.x = Math.max(0, Math.min(v.x, c.width));
        v.x += Math.sin(v.theta) * 0.5 * Math.min(c.width, c.height)/150;
        v.y = Math.max(0, Math.min(v.y, c.height));
        v.y += Math.cos(v.theta) * 0.5 * Math.min(c.width, c.height)/150;
      }
    }
  }));
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, c.width, c.height);
  while (true) {
    ctx.fillStyle = '#0002';
    ctx.fillRect(0, 0, c.width, c.height);
    for (let loop of loops) {
      loop.draw(ctx);
      loop.update();
    }
    await new Promise(requestAnimationFrame);
  }
  
})();