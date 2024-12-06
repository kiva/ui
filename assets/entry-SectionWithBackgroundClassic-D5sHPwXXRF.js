const __vite__fileDeps=["./entry-KvContentfulImg-Cm39WJfvm7.js","./entry-vue.esm-bundler-gh2KZVgkoT.js","./entry-_plugin-vue_export-helper-DlAUqK2UKH.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{_ as v}from"./iframe-CP4Mwuto.js";import{k as a}from"./entry-kivaColors-CIeIWlcc7e.js";import{r as S,o as d,c as h,e as f,g as y,n as _,h as p,f as T,M as k,Q as M}from"./entry-vue.esm-bundler-gh2KZVgkoT.js";import{_ as j}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const z=M(()=>v(()=>import("./entry-KvContentfulImg-Cm39WJfvm7.js"),__vite__mapDeps([0,1,2]),import.meta.url)),b={name:"SectionWithBackgroundClassic",components:{KvContentfulImg:z},props:{backgroundContent:{type:Object,default:()=>{}},verticalPadding:{type:Object,default:()=>{}},themeName:{type:String,default:""}},data(){return{sourceSizes:[{width:1920,height:650,media:"min-width: 1441px"},{width:1440,height:620,media:"min-width: 1025px"},{width:1024,height:441,media:"min-width: 1024px"},{width:680,height:372,media:"min-width: 734px"},{width:480,height:540,media:"min-width: 0px"}]}},computed:{backgroundStyle(){var e,t;return(e=this.backgroundContent)!=null&&e.backgroundColor?{"background-color":(t=this.backgroundContent)==null?void 0:t.backgroundColor}:this.themeStyles?{"background-color":"rgb(var(--bg-primary))"}:{}},isBackgroundVideo(){var e,t,o;return(o=(t=(e=this.backgroundContent)==null?void 0:e.backgroundMedia)==null?void 0:t.file)==null?void 0:o.contentType.includes("video")},isBackgroundImage(){var e,t,o;return(o=(t=(e=this.backgroundContent)==null?void 0:e.backgroundMedia)==null?void 0:t.file)==null?void 0:o.contentType.includes("image")},backgroundMedia(){var e,t,o,c,i,n,r;return{description:((t=(e=this.backgroundContent)==null?void 0:e.backgroundMedia)==null?void 0:t.description)??"",title:((c=(o=this.backgroundContent)==null?void 0:o.backgroundMedia)==null?void 0:c.title)??"",url:((r=(n=(i=this.backgroundContent)==null?void 0:i.backgroundMedia)==null?void 0:n.file)==null?void 0:r.url)??""}},themeStyles(){const t={kivaClassicLight:a.defaultTheme,kivaClassicMint:a.mintTheme,kivaClassicGreen:a.darkGreenTheme,kivaClassicDark:a.darkTheme,imageCard:a.darkTheme,kivaDarkMint:a.darkMintTheme,ecoGreenLight:a.greenLightTheme,ecoGreenDark:a.greenDarkTheme,ecoMarigoldLight:a.marigoldLightTheme,ecoStoneLight:a.stoneLightTheme,ecoStoneDark:a.stoneDarkTheme}[this.themeName]??a.defaultTheme;return t===a.defaultTheme?{}:{...t,color:"rgb(var(--text-primary))"}},verticalPaddingClasses(){let e="",t=!1,o=!1;const c="tw-pt-4 tw-pb-4",i="lg:tw-pt-8 lg:tw-pb-8",n=this.verticalPadding||{},r=Object.keys(n).map(s=>{var m,g;const u=s!=="sm"?`${s}:`:"",l=typeof n[s]=="object"?n[s]:{};s==="sm"&&(t=!0),s==="lg"&&(o=!0);const w=(m=l.top)!=null&&m.toString()?`${u}tw-pt-${l.top}`:"",C=(g=l.bottom)!=null&&g.toString()?`${u}tw-pb-${l.bottom}`:"";return`${w} ${C}`});return t||(e=`${c}`),o||(e=`${e} ${i}`),e=`${e} ${r.join(" ")}`,`${e}`}}},B=["src"];function x(e,t,o,c,i,n){const r=S("kv-contentful-img");return d(),h("section",{class:"tw-relative",style:k(n.themeStyles)},[f("div",{class:_(["tw-relative tw-w-full tw-overflow-hidden tw-z-1 tw-top-0",n.verticalPaddingClasses])},[y(e.$slots,"content")],2),f("div",{class:"tw-w-full tw-h-full tw-absolute tw-top-0 tw-z--1",style:k(n.backgroundStyle)},[n.isBackgroundVideo?(d(),h("video",{key:0,class:"tw-w-full tw-h-full tw-object-cover",src:n.backgroundMedia.url,autoplay:"",loop:"",muted:"",playsinline:""},null,8,B)):p("",!0),n.isBackgroundImage?(d(),T(r,{key:1,class:"tw-w-full tw-h-full tw-object-cover",width:1440,"contentful-src":n.backgroundMedia.url,"fallback-format":"jpg",alt:n.backgroundMedia.description,"source-sizes":i.sourceSizes},null,8,["contentful-src","alt","source-sizes"])):p("",!0)],4)],4)}const V=j(b,[["render",x]]);b.__docgenInfo={displayName:"SectionWithBackgroundClassic",description:`Section Background
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

The default theme 'kivaClassicLight' will be used for any other value.`,type:{name:"string"},defaultValue:{func:!1,value:"''"}}],slots:[{name:"content"}],sourceFiles:["/home/runner/work/ui/ui/src/components/Contentful/SectionWithBackgroundClassic.vue"]};export{V as S};
