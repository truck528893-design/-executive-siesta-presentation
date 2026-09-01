const images=['assets/sunset-test-01.jpg','assets/sunset-test-02.jpg'];
let current=Math.floor(Math.random()*images.length);
const img=document.getElementById('heroImage');
function show(i){current=(i+images.length)%images.length;img.src=images[current];}
function next(){show(current+1)}
function prev(){show(current-1)}
show(current);
const shuffle=document.getElementById('shuffle');if(shuffle)shuffle.style.display='none';
let x=0;const visual=document.getElementById('visual');
visual.addEventListener('touchstart',e=>x=e.touches[0].clientX,{passive:true});
visual.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-x;if(Math.abs(dx)>40){dx<0?next():prev()}},{passive:true});