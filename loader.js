/* Loaded fresh by Simulator-Launcher.html every time it opens. Changing this file changes how the launcher
   loads the simulator, without sending a new launcher to anyone. */
(function(){
 var B='https://cdn.jsdelivr.net/gh/denisgaming01-dk/Simulator@main/',G='https://denisgaming01-dk.github.io/Simulator/';
 var SRC=[B+'index.html',G+'index.html'],notes=[];
 function show(h){document.open();document.write(h);document.close();}
 function fail(){var m=document.getElementById('msg');if(m)m.innerHTML='<b>Die-Cutter Simulator</b>The simulator could not be loaded. Open this file in Microsoft Edge or Chrome (not in a preview window) and check the internet connection.<small>'+notes.join('\n')+'</small>';}
 function get(i){if(i>=SRC.length){fail();return;}
  var u=SRC[i]+'?t='+Date.now(),x=new XMLHttpRequest(),done=false;   /* ?t= so no browser or proxy cache hands back an old copy */
  var t=setTimeout(function(){if(done)return;done=true;try{x.abort();}catch(e){}notes.push(SRC[i]+': timed out');get(i+1);},12000);
  x.onload=function(){if(done)return;done=true;clearTimeout(t);var h=x.responseText||'';
   if(x.status>=200&&x.status<300&&h.indexOf('Flatbed Die-Cutter Simulator')>=0)show(h);else{notes.push(SRC[i]+': '+x.status);get(i+1);}};
  x.onerror=function(){if(done)return;done=true;clearTimeout(t);notes.push(SRC[i]+': blocked or no connection');get(i+1);};
  try{x.open('GET',u,true);x.send();}catch(e){done=true;clearTimeout(t);notes.push(e.message);get(i+1);}}
 get(0);
})();
