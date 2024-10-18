const __vite__fileDeps=["./entry-KvContentfulImg-QAG-LJtxRF.js","./entry-vue.esm-bundler-CCMUuEADRp.js","./entry-_plugin-vue_export-helper-DlAUqK2UKH.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{_ as v}from"./iframe-Cewr90gv.js";import{k as i}from"./entry-kivaColors-BWaQpoCddz.js";import{r as y,o as d,c as h,e as f,g as S,n as _,h as p,f as M,L as k,Q as j}from"./entry-vue.esm-bundler-CCMUuEADRp.js";import{_ as z}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const B=j(()=>v(()=>import("./entry-KvContentfulImg-QAG-LJtxRF.js"),__vite__mapDeps([0,1,2]),import.meta.url)),b={name:"SectionWithBackgroundClassic",components:{KvContentfulImg:B},props:{backgroundContent:{type:Object,default:()=>{}},verticalPadding:{type:Object,default:()=>{}},themeName:{type:String,default:""}},data(){return{sourceSizes:[{width:1920,height:650,media:"min-width: 1441px"},{width:1440,height:620,media:"min-width: 1025px"},{width:1024,height:441,media:"min-width: 1024px"},{width:680,height:372,media:"min-width: 734px"},{width:480,height:540,media:"min-width: 0px"}]}},computed:{backgroundStyle(){var e,t;return(e=this.backgroundContent)!=null&&e.backgroundColor?{"background-color":(t=this.backgroundContent)==null?void 0:t.backgroundColor}:this.themeStyles?{"background-color":"rgb(var(--bg-primary))"}:{}},isBackgroundVideo(){var e,t,a;return(a=(t=(e=this.backgroundContent)==null?void 0:e.backgroundMedia)==null?void 0:t.file)==null?void 0:a.contentType.includes("video")},isBackgroundImage(){var e,t,a;return(a=(t=(e=this.backgroundContent)==null?void 0:e.backgroundMedia)==null?void 0:t.file)==null?void 0:a.contentType.includes("image")},backgroundMedia(){var e,t,a,c,o,n,r;return{description:((t=(e=this.backgroundContent)==null?void 0:e.backgroundMedia)==null?void 0:t.description)??"",title:((c=(a=this.backgroundContent)==null?void 0:a.backgroundMedia)==null?void 0:c.title)??"",url:((r=(n=(o=this.backgroundContent)==null?void 0:o.backgroundMedia)==null?void 0:n.file)==null?void 0:r.url)??""}},themeStyles(){const t={kivaClassicLight:i.defaultTheme,kivaClassicMint:i.mintTheme,kivaClassicGreen:i.darkGreenTheme,kivaClassicDark:i.darkTheme,imageCard:i.darkTheme,kivaDarkMint:i.darkMintTheme}[this.themeName]??i.defaultTheme;return t===i.defaultTheme?{}:{...t,color:"rgb(var(--text-primary))"}},verticalPaddingClasses(){let e="",t=!1,a=!1;const c="tw-pt-4 tw-pb-4",o="lg:tw-pt-8 lg:tw-pb-8",n=this.verticalPadding||{},r=Object.keys(n).map(s=>{var m,g;const u=s!=="sm"?`${s}:`:"",l=typeof n[s]=="object"?n[s]:{};s==="sm"&&(t=!0),s==="lg"&&(a=!0);const w=(m=l.top)!=null&&m.toString()?`${u}tw-pt-${l.top}`:"",C=(g=l.bottom)!=null&&g.toString()?`${u}tw-pb-${l.bottom}`:"";return`${w} ${C}`});return t||(e=`${c}`),a||(e=`${e} ${o}`),e=`${e} ${r.join(" ")}`,`${e}`}}},x=["src"];function T(e,t,a,c,o,n){const r=y("kv-contentful-img");return d(),h("section",{class:"tw-relative",style:k(n.themeStyles)},[f("div",{class:_(["tw-relative tw-w-full tw-overflow-hidden tw-z-1 tw-top-0",n.verticalPaddingClasses])},[S(e.$slots,"content")],2),f("div",{class:"tw-w-full tw-h-full tw-absolute tw-top-0 tw-z--1",style:k(n.backgroundStyle)},[n.isBackgroundVideo?(d(),h("video",{key:0,class:"tw-w-full tw-h-full tw-object-cover",src:n.backgroundMedia.url,autoplay:"",loop:"",muted:"",playsinline:""},null,8,x)):p("",!0),n.isBackgroundImage?(d(),M(r,{key:1,class:"tw-w-full tw-h-full tw-object-cover",width:1440,"contentful-src":n.backgroundMedia.url,"fallback-format":"jpg",alt:n.backgroundMedia.description,"source-sizes":o.sourceSizes},null,8,["contentful-src","alt","source-sizes"])):p("",!0)],4)],4)}const N=z(b,[["render",T]]);b.__docgenInfo={displayName:"SectionWithBackgroundClassic",description:`Section Background
Creates a full width section with a full bleed background.`,tags:{},exportName:"default",props:[{name:"backgroundContent",description:"Content group content for background from Contentful type Background",type:{name:"object"},defaultValue:{func:!0,value:"() => {}"}},{name:"verticalPadding",description:`Padding Object for Contentful driven vertical padding classes

Important requirements:
- Receives an object with nested size objects matching our breakpoint prefixes ('md', 'xl', etc)
- Styles will only be applied for safelisted classes in tailwind.purge.safelist.txt
{
	"sm": {
		"top": 2,
		"bottom": 4
	},
	"md": {
		"top": 4,
		"bottom": 6
	}
}`,type:{name:"object"},defaultValue:{func:!0,value:"() => {}"}},{name:"themeName",description:`Theme name from Contentful settings

Can be one of:
- 'kivaClassicLight'
- 'kivaClassicMint'
- 'kivaClassicGreen'
- 'kivaClassicDark'
- 'imageCard'

The default theme 'kivaClassicLight' will be used for any other value.`,type:{name:"string"},defaultValue:{func:!1,value:"''"}}],slots:[{name:"content"}],sourceFiles:["/home/runner/work/ui/ui/src/components/Contentful/SectionWithBackgroundClassic.vue"]};export{N as S};
