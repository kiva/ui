import{z as T,q as m,C as W,f as x,e as l,u as o,k as X,o as i,c as I,j,a as s,t as M,g as k,d as p,N as Y}from"./entry-vue.esm-bundler-D8yP9bVmC4.js";import"./entry-KvWwwHeaderBasic-BB16oz4SiS.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import{z as Z}from"./entry-KvCarousel-mVz4KExbYA.js";import{M as ee}from"./entry-KvLightbox-Bijtdqydwv.js";import"./entry-numeral-xVHG5DEP0A.js";import{u as te}from"./entry-useBreakpoints-dzJBphHj1p.js";import{f as ae}from"./entry-stringParserUtils-ltRuUwZbQA.js";import{M as z}from"./entry-MyKivaImpactInsightScreen1-B-PB-awl7N.js";import{M as A}from"./entry-MyKivaImpactInsightScreen2-tMhqZO8ktQ.js";import{M as F}from"./entry-MyKivaImpactInsightScreen3-BV3R4Zithp.js";import{M as L}from"./entry-MyKivaImpactInsightScreen4-TyHbCt3PCl.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-Bg3M7544.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-printing-DjnSCsmPoI.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const ne={key:0,class:"tw-text-headline tw-mb-3 !tw-text-left"},oe={key:0,class:"tw-text-headline tw-mb-3 !tw-text-left"},se={class:"tw-flex tw-flex-col tw-items-center tw-w-full md:!tw-relative"},le={class:"tw-static tw-w-full md:tw-w-auto md:tw-absolute tw-self-end tw-bottom-0"},ie={class:"tw-relative tw-justify-end tw-items-end tw-gap-1.5 tw-w-xs impact-insight-footer"},re={class:"tw-flex tw-justify-self-end tw-w-full tw-h-6 tw-gap-2 tw-float-end secondary-navigation-buttons"},ce=["disabled"],R={__name:"MyKivaImpactInsightModal",props:{show:{type:Boolean,default:!1},latestLoan:{type:Object,default:null}},emits:["close"],setup(n,{emit:c}){const d=n,h=c,u=X("$kvTrackEvent"),a=T(0),g=T(null),{isMobile:y}=te(),r=m(()=>{var t,e,V,K,P;return!!((e=(t=d.latestLoan)==null?void 0:t.partner)!=null&&e.loansPosted)&&!((P=(K=(V=d.latestLoan)==null?void 0:V.partner)==null?void 0:K.name)!=null&&P.toLowerCase().includes("n/a"))}),_=m(()=>r.value?4:3),S=m(()=>{var t;return ae((t=d.latestLoan)==null?void 0:t.name)||""}),C=m(()=>a.value===_.value-1),b=()=>{u("portfolio","view",`impact-education-screen-${a.value+1}`)},N=()=>{h("close"),a.value=0},G=()=>{var t;if(a.value>0){const e=a.value-1;(t=g.value)==null||t.goToSlide(e),a.value=e,u("portfolio","click","next-step-impact-education-back"),b()}},H=()=>{var t;if(a.value<_.value-1){const e=a.value+1;(t=g.value)==null||t.goToSlide(e),a.value=e}},J=()=>{C.value?N():(H(),u("portfolio","click","next-step-impact-education-next"),b())},Q=t=>{const e=t.value;typeof e=="number"&&e!==a.value&&(a.value=e,b())};return W(()=>{u("portfolio","view","impact-education-screen-1")}),(t,e)=>(i(),x(o(ee),{visible:n.show,title:"",onLightboxClosed:N,class:"impact-insight-modal"},{header:l(()=>[o(y)?k("",!0):(i(),I("h2",ne,[e[0]||(e[0]=j(" A closer look at ")),s("u",null,M(S.value)+" world",1)]))]),default:l(()=>[o(y)?(i(),I("h2",oe,[e[1]||(e[1]=j(" A closer look at ")),s("u",null,M(S.value)+" world",1)])):k("",!0),s("div",se,[p(o(Z),{ref_key:"carouselRef",ref:g,"is-dotted":!0,"slide-max-width":"","controls-top-right":!1,"fade-enabled":"","multiple-slides-visible":!1,"embla-options":{loop:!1,startIndex:0},class:"impact-insight-carousel",onChange:Q},Y({slide1:l(()=>[p(o(z),{"latest-loan":n.latestLoan},null,8,["latest-loan"])]),slide2:l(()=>[p(o(A),{"latest-loan":n.latestLoan},null,8,["latest-loan"])]),slide3:l(()=>[r.value?(i(),x(o(F),{key:0,"latest-loan":n.latestLoan},null,8,["latest-loan"])):(i(),x(o(L),{key:1,"latest-loan":n.latestLoan,"is-loan-partner":r.value},null,8,["latest-loan","is-loan-partner"]))]),_:2},[r.value?{name:"slide4",fn:l(()=>[p(o(L),{"latest-loan":n.latestLoan,"is-loan-partner":r.value},null,8,["latest-loan","is-loan-partner"])]),key:"0"}:void 0]),1536),s("div",le,[s("div",ie,[s("div",re,[a.value>0&&!o(y)?(i(),I("button",{key:0,class:"tw-w-11 tw-text-center tw-border tw-rounded-lg tw-bg-white tw-text-gray-900 tw-text-button-link",disabled:a.value===0,onClick:G}," Back ",8,ce)):k("",!0),s("button",{class:"tw-w-full md:tw-w-11 tw-text-center tw-rounded-lg tw-bg-action tw-text-white tw-text-button-link hover:tw-bg-action-highlight",onClick:J},M(C.value?"Done":"Next"),1)])])])])],void 0),_:1},8,["visible"]))}},v=R;R.__docgenInfo={exportName:"default",displayName:"MyKivaImpactInsightModal",description:"",tags:{},props:[{name:"show",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"latestLoan",type:{name:"object"},defaultValue:{func:!1,value:"null"}}],events:[{name:"close"}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/ImpactInsight/MyKivaImpactInsightModal.vue"]};v.preFetchOperations=[];v.__childComponents=[()=>z,()=>A,()=>F,()=>L];const Te={title:"MyKiva/ImpactInsight/ImpactInsightModal",component:v},q=n=>{const c=(d,{argTypes:h})=>({props:Object.keys(h),components:{MyKivaImpactInsightModal:v},setup(){return{args:n}},template:`
            <div>
                <MyKivaImpactInsightModal
                    v-bind="args"
                />
            </div>
        `});return c.args=n,c},f=q({visible:!0,latestLoan:{id:1975833,name:"Mayram",image:{hash:"9673d0722a7675b9b8d11f90849d9b44"},geocode:{country:{geocode:{latitude:-16,longitude:167},id:231,isoCode:"VU",name:"Vanuatu",ppp:"$89,599"}},amount:100,whySpecial:"She is a community leader.",gender:"female",otherLoans:[],amount:"-75.00",partner:{id:123,loansPosted:4567,__typename:"LoanPartner"}}}),w=q({visible:!0,latestLoan:{id:1975833,name:"Mayram",image:{hash:"9673d0722a7675b9b8d11f90849d9b44"},geocode:{country:{geocode:{latitude:-16,longitude:167},id:231,isoCode:"VU",name:"Vanuatu",ppp:"$89,599"}},amount:100,whySpecial:"She is a community leader.",gender:"female",otherLoans:[],amount:"-75.00",partner:null}});var B,$,D;f.parameters={...f.parameters,docs:{...(B=f.parameters)==null?void 0:B.docs,source:{originalSource:`story({
  visible: true,
  latestLoan: {
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
    },
    amount: 100,
    whySpecial: 'She is a community leader.',
    gender: 'female',
    otherLoans: [],
    amount: '-75.00',
    partner: {
      id: 123,
      loansPosted: 4567,
      __typename: 'LoanPartner'
    }
  }
})`,...(D=($=f.parameters)==null?void 0:$.docs)==null?void 0:D.source}}};var E,O,U;w.parameters={...w.parameters,docs:{...(E=w.parameters)==null?void 0:E.docs,source:{originalSource:`story({
  visible: true,
  latestLoan: {
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
    },
    amount: 100,
    whySpecial: 'She is a community leader.',
    gender: 'female',
    otherLoans: [],
    amount: '-75.00',
    partner: null
  }
})`,...(U=(O=w.parameters)==null?void 0:O.docs)==null?void 0:U.source}}};const je=["Default","NonPartner"];export{f as Default,w as NonPartner,je as __namedExportsOrder,Te as default};
