const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./entry-KvContentfulImg-DxafLgvmGY.js","./entry-vue.esm-bundler-Duz9TGGLcr.js","./entry-KvSecondaryNav-Bp1Uuall6y.js","./entry-numeral-DJCTM12wUX.js","./entry-_commonjsHelpers-Cpj98o6Yn6.js","./KvSecondaryNav-CbtaDzcm.css"])))=>i.map(i=>d[i]);
import{_ as S}from"./iframe-jmm4mDPu.js";import{j as y,k as _,l as M,n as j,o as T,p as x,q as h,r as z,u as B,v as l}from"./entry-KvSecondaryNav-Bp1Uuall6y.js";import{S as L,c as p,e as f,g as P,n as $,d as k,f as D,x as b,r as V,o as d}from"./entry-vue.esm-bundler-Duz9TGGLcr.js";import{_ as N}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const I=L(()=>S(()=>import("./entry-KvContentfulImg-DxafLgvmGY.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url)),w={name:"SectionWithBackgroundClassic",components:{KvContentfulImg:I},props:{backgroundContent:{type:Object,default:()=>{}},verticalPadding:{type:Object,default:()=>{}},themeName:{type:String,default:""}},data(){return{sourceSizes:[{width:1920,height:650,media:"min-width: 1441px"},{width:1440,height:620,media:"min-width: 1025px"},{width:1024,height:441,media:"min-width: 1024px"},{width:680,height:372,media:"min-width: 734px"},{width:480,height:540,media:"min-width: 0px"}]}},computed:{backgroundStyle(){var e,t;return(e=this.backgroundContent)!=null&&e.backgroundColor?{"background-color":(t=this.backgroundContent)==null?void 0:t.backgroundColor}:this.themeStyles?{"background-color":"rgb(var(--bg-primary))"}:{}},isBackgroundVideo(){var e,t,a;return(a=(t=(e=this.backgroundContent)==null?void 0:e.backgroundMedia)==null?void 0:t.file)==null?void 0:a.contentType.includes("video")},isBackgroundImage(){var e,t,a;return(a=(t=(e=this.backgroundContent)==null?void 0:e.backgroundMedia)==null?void 0:t.file)==null?void 0:a.contentType.includes("image")},backgroundMedia(){var e,t,a,s,o,n,i;return{description:((t=(e=this.backgroundContent)==null?void 0:e.backgroundMedia)==null?void 0:t.description)??"",title:((s=(a=this.backgroundContent)==null?void 0:a.backgroundMedia)==null?void 0:s.title)??"",url:((i=(n=(o=this.backgroundContent)==null?void 0:o.backgroundMedia)==null?void 0:n.file)==null?void 0:i.url)??""}},themeStyles(){const t={kivaClassicLight:l,kivaClassicMint:B,kivaClassicGreen:z,kivaClassicDark:h,imageCard:h,kivaDarkMint:x,ecoGreenLight:T,ecoGreenDark:j,ecoMarigoldLight:M,ecoStoneLight:_,ecoStoneDark:y}[this.themeName]??l;return t===l?{}:{...t,color:"rgb(var(--text-primary))"}},verticalPaddingClasses(){let e="",t=!1,a=!1;const s="tw-pt-4 tw-pb-4",o="lg:tw-pt-8 lg:tw-pb-8",n=this.verticalPadding||{},i=Object.keys(n).map(r=>{var m,g;const u=r!=="sm"?`${r}:`:"",c=typeof n[r]=="object"?n[r]:{};r==="sm"&&(t=!0),r==="lg"&&(a=!0);const C=(m=c.top)!=null&&m.toString()?`${u}tw-pt-${c.top}`:"",v=(g=c.bottom)!=null&&g.toString()?`${u}tw-pb-${c.bottom}`:"";return`${C} ${v}`});return t||(e=`${s}`),a||(e=`${e} ${o}`),e=`${e} ${i.join(" ")}`,`${e}`}}},O=["src"];function G(e,t,a,s,o,n){const i=V("kv-contentful-img");return d(),p("section",{class:"tw-relative",style:b(n.themeStyles)},[f("div",{class:$(["tw-relative tw-w-full tw-overflow-hidden tw-z-1 tw-top-0",n.verticalPaddingClasses])},[P(e.$slots,"content")],2),f("div",{class:"tw-w-full tw-h-full tw-absolute tw-top-0 tw-z--1",style:b(n.backgroundStyle)},[n.isBackgroundVideo?(d(),p("video",{key:0,class:"tw-w-full tw-h-full tw-object-cover",src:n.backgroundMedia.url,autoplay:"",loop:"",muted:"",playsinline:""},null,8,O)):k("",!0),n.isBackgroundImage?(d(),D(i,{key:1,class:"tw-w-full tw-h-full tw-object-cover",width:1440,"contentful-src":n.backgroundMedia.url,"fallback-format":"jpg",alt:n.backgroundMedia.description,"source-sizes":o.sourceSizes},null,8,["contentful-src","alt","source-sizes"])):k("",!0)],4)],4)}const R=N(w,[["render",G]]);w.__docgenInfo={displayName:"SectionWithBackgroundClassic",description:`Section Background
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

The default theme 'kivaClassicLight' will be used for any other value.`,type:{name:"string"},defaultValue:{func:!1,value:"''"}}],slots:[{name:"content"}],sourceFiles:["/home/runner/work/ui/ui/src/components/Contentful/SectionWithBackgroundClassic.vue"]};export{R as S};
