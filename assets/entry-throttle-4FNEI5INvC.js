function c(n,o){let t=0;return function(...u){const e=new Date().getTime();e-t>=o&&(n(...u),t=e)}}export{c as u};
