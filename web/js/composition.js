// Compose the mobile illustration and story as one group, using actual text height.
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function composition(width,height,textHeight,chapter){
  const top=66,bottom=24,gap=clamp(width*.06,18,28);
  if(['mode','about','contact'].includes(chapter)){
    return {artTop:0,artHeight:0,readingTop:Math.max(top,(height-textHeight)/2),gap:0};
  }
  const label=['uni','btn','ww','bri'].includes(chapter)?32:0;
  const desired=clamp(width*(chapter==='hero'?.35:chapter==='why'?.48:.58),110,250);
  const available=height-top-bottom;
  const artHeight=Math.max(70,Math.min(desired,available-textHeight-gap-label));
  const total=artHeight+label+gap+textHeight;
  const artTop=top+Math.max(0,(available-total)/2);
  return {artTop,artHeight,readingTop:artTop+artHeight+label+gap,gap};
}
export function arrangeMobile(sections){
  for(const section of sections){
    const reading=section.querySelector('.col')||section.querySelector('.summary');
    if(!reading||section.dataset.sec==='skill')continue;
    if(innerWidth>=760){section.querySelector('.pin').style.removeProperty('--reading-top');delete section.__composition;continue;}
    const pin=section.querySelector('.pin');
    const size=composition(innerWidth,Math.min(innerHeight,pin.clientHeight),reading.offsetHeight,section.dataset.sec);
    pin.style.setProperty('--reading-top',size.readingTop+'px');
    section.__composition=size;
  }
}
export function activateComposition(section){
  const slot=document.getElementById('mobile-stage'),size=section.__composition;
  if(!size){slot.style.removeProperty('top');slot.style.removeProperty('height');slot.style.removeProperty('display');return;}
  slot.style.top=size.artTop+'px';slot.style.height=size.artHeight+'px';slot.style.display=size.artHeight?'block':'none';
}
