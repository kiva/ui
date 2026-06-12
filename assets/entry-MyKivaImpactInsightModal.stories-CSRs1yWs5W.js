import{y as P,q as m,B as G,h as b,j as l,u as o,l as H,o as i,c as I,N as B,b as s,t as M,e as x,a as p,M as J}from"./entry-vue.esm-bundler-D6rjCHbx5a.js";import"./entry-KvWwwHeaderBasic-4oh2xxIPzA.js";import"./entry-tailwind.config-DnDN25xoV6.js";import{z as Q}from"./entry-KvCarousel-VKkpZVfkDj.js";import{M as W}from"./entry-KvLightbox-DIEHD1eQCo.js";import"./entry-numeral-xVHG5DEP0A.js";import{u as X}from"./entry-useBreakpoints-C2NBIsKhxe.js";import{f as Y}from"./entry-stringParserUtils-DNVsfKTBwa.js";import{M as Z}from"./entry-MyKivaImpactInsightScreen1-CRM4QX_PcP.js";import{M as ee}from"./entry-MyKivaImpactInsightScreen2-CQW-Rvm--X.js";import{M as te}from"./entry-MyKivaImpactInsightScreen3-CC0lXzu9zx.js";import{M as T}from"./entry-MyKivaImpactInsightScreen4-DU-nJfHl_t.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-B_VjIxz4TE.js";import"./iframe-CU7a1Js9.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const ae={key:0,class:"tw-text-headline tw-mb-3 !tw-text-left"},ne={key:0,class:"tw-text-headline tw-mb-3 !tw-text-left"},oe={class:"tw-flex tw-flex-col tw-items-center tw-w-full md:!tw-relative"},se={class:"tw-static tw-w-full md:tw-w-auto md:tw-absolute tw-self-end tw-bottom-0"},le={class:"tw-relative tw-justify-end tw-items-end tw-gap-1.5 tw-w-xs impact-insight-footer"},ie={class:"tw-flex tw-justify-self-end tw-w-full tw-h-6 tw-gap-2 tw-float-end secondary-navigation-buttons"},re=["disabled"],k={__name:"MyKivaImpactInsightModal",props:{show:{type:Boolean,default:!1},latestLoan:{type:Object,default:null}},emits:["close"],setup(n,{emit:d}){const c=n,v=d,u=H("$kvTrackEvent"),a=P(0),h=P(null),{isMobile:g}=X(),r=m(()=>{var t,e,V,C,K;return!!((e=(t=c.latestLoan)==null?void 0:t.partner)!=null&&e.loansPosted)&&!((K=(C=(V=c.latestLoan)==null?void 0:V.partner)==null?void 0:C.name)!=null&&K.toLowerCase().includes("n/a"))}),L=m(()=>r.value?4:3),S=m(()=>{var t;return Y((t=c.latestLoan)==null?void 0:t.name)||""}),_=m(()=>a.value===L.value-1),y=()=>{u("portfolio","view",`impact-education-screen-${a.value+1}`)},N=()=>{v("close"),a.value=0},R=()=>{var t;if(a.value>0){const e=a.value-1;(t=h.value)==null||t.goToSlide(e),a.value=e,u("portfolio","click","next-step-impact-education-back"),y()}},q=()=>{var t;if(a.value<L.value-1){const e=a.value+1;(t=h.value)==null||t.goToSlide(e),a.value=e}},z=()=>{_.value?N():(q(),u("portfolio","click","next-step-impact-education-next"),y())},F=t=>{const e=t.value;typeof e=="number"&&e!==a.value&&(a.value=e,y())};return G(()=>{u("portfolio","view","impact-education-screen-1")}),(t,e)=>(i(),b(o(W),{visible:n.show,title:"",onLightboxClosed:N,class:"impact-insight-modal"},{header:l(()=>[o(g)?x("",!0):(i(),I("h2",ae,[e[0]||(e[0]=B(" A closer look at ")),s("u",null,M(S.value)+" world",1)]))]),default:l(()=>[o(g)?(i(),I("h2",ne,[e[1]||(e[1]=B(" A closer look at ")),s("u",null,M(S.value)+" world",1)])):x("",!0),s("div",oe,[p(o(Q),{ref_key:"carouselRef",ref:h,"is-dotted":!0,"slide-max-width":"","controls-top-right":!1,"fade-enabled":"","multiple-slides-visible":!1,"embla-options":{loop:!1,startIndex:0},class:"impact-insight-carousel",onChange:F},J({slide1:l(()=>[p(o(Z),{"latest-loan":n.latestLoan},null,8,["latest-loan"])]),slide2:l(()=>[p(o(ee),{"latest-loan":n.latestLoan},null,8,["latest-loan"])]),slide3:l(()=>[r.value?(i(),b(o(te),{key:0,"latest-loan":n.latestLoan},null,8,["latest-loan"])):(i(),b(o(T),{key:1,"latest-loan":n.latestLoan,"is-loan-partner":r.value},null,8,["latest-loan","is-loan-partner"]))]),_:2},[r.value?{name:"slide4",fn:l(()=>[p(o(T),{"latest-loan":n.latestLoan,"is-loan-partner":r.value},null,8,["latest-loan","is-loan-partner"])]),key:"0"}:void 0]),1536),s("div",se,[s("div",le,[s("div",ie,[a.value>0&&!o(g)?(i(),I("button",{key:0,class:"tw-w-11 tw-text-center tw-border tw-rounded-lg tw-bg-white tw-text-gray-900 tw-font-medium",disabled:a.value===0,onClick:R}," Back ",8,re)):x("",!0),s("button",{class:"tw-w-full md:tw-w-11 tw-text-center tw-rounded-lg tw-bg-action tw-text-white tw-font-medium hover:tw-bg-action-highlight",onClick:z},M(_.value?"Done":"Next"),1)])])])])],void 0),_:1},8,["visible"]))}};k.__docgenInfo={exportName:"default",displayName:"MyKivaImpactInsightModal",description:"",tags:{},props:[{name:"show",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"latestLoan",type:{name:"object"},defaultValue:{func:!1,value:"null"}}],events:[{name:"close"}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/ImpactInsight/MyKivaImpactInsightModal.vue"]};const Ve={title:"MyKiva/ImpactInsight/ImpactInsightModal",component:k},A=n=>{const d=(c,{argTypes:v})=>({props:Object.keys(v),components:{MyKivaImpactInsightModal:k},setup(){return{args:n}},template:`
            <div>
                <MyKivaImpactInsightModal
                    v-bind="args"
                />
            </div>
        `});return d.args=n,d},f=A({visible:!0,latestLoan:{id:1975833,name:"Mayram",image:{hash:"9673d0722a7675b9b8d11f90849d9b44"},geocode:{country:{geocode:{latitude:-16,longitude:167},id:231,isoCode:"VU",name:"Vanuatu",ppp:"$89,599"}},amount:100,whySpecial:"She is a community leader.",gender:"female",otherLoans:[],amount:"-75.00",partner:{id:123,loansPosted:4567,__typename:"LoanPartner"}}}),w=A({visible:!0,latestLoan:{id:1975833,name:"Mayram",image:{hash:"9673d0722a7675b9b8d11f90849d9b44"},geocode:{country:{geocode:{latitude:-16,longitude:167},id:231,isoCode:"VU",name:"Vanuatu",ppp:"$89,599"}},amount:100,whySpecial:"She is a community leader.",gender:"female",otherLoans:[],amount:"-75.00",partner:null}});var j,$,D;f.parameters={...f.parameters,docs:{...(j=f.parameters)==null?void 0:j.docs,source:{originalSource:`story({
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
})`,...(D=($=f.parameters)==null?void 0:$.docs)==null?void 0:D.source}}};var E,U,O;w.parameters={...w.parameters,docs:{...(E=w.parameters)==null?void 0:E.docs,source:{originalSource:`story({
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
})`,...(O=(U=w.parameters)==null?void 0:U.docs)==null?void 0:O.source}}};const Ce=["Default","NonPartner"];export{f as Default,w as NonPartner,Ce as __namedExportsOrder,Ve as default};
