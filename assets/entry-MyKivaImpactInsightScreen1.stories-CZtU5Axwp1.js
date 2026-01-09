import{g as s,c as p,q as a,M as i,L as n,a as L,u as M,m as S,J as K,o as w}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-KvWwwHeader-K_aXJrsvke.js";import{k as N}from"./entry-KvBorrowerImage-C1KP-1K_gH.js";import{n as h}from"./entry-numeral-xVHG5DEP0A.js";import{f as V}from"./entry-stringParserUtils-DNVsfKTBwa.js";import{_ as k}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-CWclSTHHJk.js";import"./entry-imageUtils-XCIqTGZvrk.js";const j={class:"tw-w-full tw-px-2 md:!tw-py-10 md:!tw-px-10"},P={class:"tw-mx-auto tw-max-w-6xl"},$={class:""},C={class:"tw-mt-10 tw-flex tw-flex-col tw-items-center tw-gap-10 md:tw-mt-14 md:tw-flex-row md:tw-items-center md:!tw-justify-center"},D={class:"tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border-4 tw-border-brand-500 tw-bg-eco-green-1 tw-text-center min-circle-size"},B={class:"tw-items-center tw-gap-3"},O={class:"tw-h-6.5 tw-w-6.5 tw-overflow-hidden tw-rounded-full tw-border-4 tw-border-white tw-my-0 tw-mx-auto"},U={class:"tw-text-lg tw-font-semibold tw-text-slate-900"},E={class:"tw-w-full tw-max-w-xl tw-px-4 md:!tw-px-0"},F={class:"tw-rounded-2xl tw-bg-slate-100 tw-py-2 tw-px-2 md:!tw-px-3 tw-text-base tw-leading-relaxed tw-bg-gray-100 tw-rounded-md md:tw-text-lg"},q={class:"tw-text-brand"},z={class:"tw-text-brand"},x={__name:"MyKivaImpactInsightScreen1",props:{latestLoan:{type:Object,default:null}},setup(c){const o=c,m=s(()=>{var t;return V((t=o.latestLoan)==null?void 0:t.name)||""}),r=s(()=>{var t;return((t=o.latestLoan)==null?void 0:t.name)||""}),_=s(()=>{var t,e;return((e=(t=o.latestLoan)==null?void 0:t.image)==null?void 0:e.hash)||""}),b=s(()=>{var t,e,l;return((l=(e=(t=o.latestLoan)==null?void 0:t.geocode)==null?void 0:e.country)==null?void 0:l.name)||""}),u=s(()=>{var t,e,l;return(l=(e=(t=o.latestLoan)==null?void 0:t.geocode)==null?void 0:e.country)!=null&&l.ppp?h(o.latestLoan.geocode.country.ppp).format("$0,0[.]00"):null}),I=s(()=>{var t;return(t=o.latestLoan)!=null&&t.amount?h(Math.abs(o.latestLoan.amount)).format("$0,0[.]00"):null});return(t,e)=>(w(),p("section",j,[a("div",P,[a("h2",$,[e[0]||(e[0]=i(" A closer look at ")),a("u",null,n(m.value)+" world",1)]),a("div",C,[a("div",D,[a("div",B,[a("div",O,[L(M(N),{class:"tw-w-full tw-h-full tw-object-cover",alt:r.value,hash:_.value,"aspect-ratio":2/2,"default-image":{width:60},images:[{width:60}],"photo-path":t.$appConfig.photoPath},null,8,["alt","hash","photo-path"])]),a("div",U,[a("strong",null,n(r.value),1)])])]),a("div",E,[a("p",F,[i(" Your "+n(I.value)+" loan helps "+n(r.value)+" build stability and success in ",1),a("strong",q,n(b.value),1),u.value?(w(),p(K,{key:0},[e[1]||(e[1]=i(" , where the average ")),a("strong",z,"annual income is "+n(u.value)+" USD",1)],64)):S("",!0),e[2]||(e[2]=i(". "))])])])])]))}},y=k(x,[["__scopeId","data-v-cd39d5a3"]]);x.__docgenInfo={exportName:"default",displayName:"MyKivaImpactInsightScreen1",description:"",tags:{},props:[{name:"latestLoan",type:{name:"object"},defaultValue:{func:!1,value:"null"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/ImpactInsight/MyKivaImpactInsightScreen1.vue"]};const Z={title:"MyKiva/ImpactInsight/MyKivaImpactInsightScreen1",component:y},A=(c={})=>{const o=(m,{argTypes:r})=>({props:Object.keys(r),components:{MyKivaImpactInsightScreen1:y},setup(){return{args:c}},template:`
            <div style="max-width: 888px; max-height:400px">
                <MyKivaImpactInsightScreen1 v-bind="args" />
            </div>
        `});return o.args=c,o},d=A({latestLoan:{amount:"-75.00",id:1975833,name:"Mayram",image:{hash:"9673d0722a7675b9b8d11f90849d9b44"},geocode:{country:{geocode:{latitude:-16,longitude:167},id:231,isoCode:"VU",name:"Vanuatu",ppp:"$89,599"}}}});var g,f,v;d.parameters={...d.parameters,docs:{...(g=d.parameters)==null?void 0:g.docs,source:{originalSource:`story({
  latestLoan: {
    amount: '-75.00',
    id: 1975833,
    name: 'Mayram',
    image: {
      hash: '9673d0722a7675b9b8d11f90849d9b44'
    },
    geocode: {
      country: {
        geocode: {
          latitude: -16,
          longitude: 167
        },
        id: 231,
        isoCode: 'VU',
        name: 'Vanuatu',
        ppp: '$89,599'
      }
    }
  }
})`,...(v=(f=d.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};const tt=["Default"];export{d as Default,tt as __namedExportsOrder,Z as default};
