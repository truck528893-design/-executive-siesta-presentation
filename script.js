/*
EXECUTIVE SIESTA WEBSITE IMAGE POLICY
- Website hero images must come ONLY from the approved KEEPERS collection.
- Keep every approved KEEPERS image available for rotation.
- Display each image for 7 seconds.
- Randomize the order of each cycle.
- Show every image exactly once before any image repeats.
- After a complete cycle, reshuffle and begin a new cycle.
- Preserve manual left/right swipe navigation.

IMPORTANT: The website repository currently contains four synchronized KEEPERS hero assets.
When additional KEEPERS assets are synchronized into this repository, add their paths to
KEEPER_IMAGES below; the rotation logic will automatically include them under the same rules.
*/
const KEEPER_IMAGES=[
  'assets/executive-siesta-01.jpg',
  'assets/executive-siesta-02.jpg',
  'assets/executive-siesta-03.jpg',
  'assets/executive-siesta-04.jpg'
];
const DISPLAY_MS=7000;
const img=document.getElementById('heroImage');
let cycle=[];
let cycleIndex=0;

function shuffledCycle(){
  const a=[...KEEPER_IMAGES];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function startNewCycle(){
  const previous=cycle.length?cycle[cycle.length-1]:null;
  cycle=shuffledCycle();
  if(cycle.length>1 && previous && cycle[0]===previous){
    [cycle[0],cycle[1]]=[cycle[1],cycle[0]];
  }
  cycleIndex=0;
}

function showCurrent(){
  if(!cycle.length)startNewCycle();
  img.src=cycle[cycleIndex];
}

function next(){
  cycleIndex++;
  if(cycleIndex>=cycle.length)startNewCycle();
  showCurrent();
}

function prev(){
  cycleIndex--;
  if(cycleIndex<0)cycleIndex=cycle.length-1;
  showCurrent();
}

startNewCycle();
showCurrent();
setInterval(next,DISPLAY_MS);

const shuffle=document.getElementById('shuffle');
if(shuffle)shuffle.style.display='none';

let x=0;
const visual=document.getElementById('visual');
visual.addEventListener('touchstart',e=>x=e.touches[0].clientX,{passive:true});
visual.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-x;
  if(Math.abs(dx)>40){dx<0?next():prev();}
},{passive:true});
