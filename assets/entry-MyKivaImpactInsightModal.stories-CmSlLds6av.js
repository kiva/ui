import{d as R,j as C,g as c,k as q,b as F,z as b,C as l,u as o,o as i,c as I,m as M,q as s,M as N,L as x,a as m,H}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-KvWwwHeader-K_aXJrsvke.js";import{z as G}from"./entry-KvCarousel-COlzrehvVw.js";import{M as J}from"./entry-KvLightbox-BxCWsUHAzq.js";import"./entry-numeral-xVHG5DEP0A.js";import{u as Q}from"./entry-useBreakpoints-DW_voPCJcp.js";import{f as W}from"./entry-stringParserUtils-DNVsfKTBwa.js";import{M as X}from"./entry-MyKivaImpactInsightScreen1-Dc-g5DlmEP.js";import{M as Y}from"./entry-MyKivaImpactInsightScreen2-DnVMmhXyo5.js";import{M as Z}from"./entry-MyKivaImpactInsightScreen3-C29qQUojp_.js";import{M as K}from"./entry-MyKivaImpactInsightScreen4-D9fnIU9b_6.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-CWclSTHHJk.js";import"./entry-mdi-B1ONwcTkQ2.js";import"./entry-throttle-4FNEI5INvC.js";import"./entry-KvMaterialIcon-B1UgUIVXS0.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-KvBorrowerImage-C1KP-1K_gH.js";import"./entry-imageUtils-XCIqTGZvrk.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const ee={key:0,class:"tw-mb-3 !tw-text-left"},te={key:0,class:"tw-mb-3 !tw-text-left"},ae={class:"tw-flex tw-flex-col tw-items-center tw-w-full md:!tw-relative"},ne={class:"tw-static tw-w-full md:tw-w-auto md:tw-absolute tw-self-end tw-bottom-0"},oe={class:"tw-relative tw-justify-end tw-items-end tw-gap-1.5 tw-w-xs impact-insight-footer"},se={class:"tw-flex tw-justify-self-end tw-w-full tw-h-6 tw-gap-2 tw-float-end secondary-navigation-buttons"},le=["disabled"],k=R({__name:"MyKivaImpactInsightModal",props:{show:{type:Boolean,default:!1},latestLoan:{type:Object,default:null}},emits:["close"],setup(n,{emit:r}){const f=n,w=r,d=F("$kvTrackEvent"),a=C(0),v=C(null),{isMobile:h}=Q(),g=c(()=>{var t,e;return!!((e=(t=f.latestLoan)==null?void 0:t.partner)!=null&&e.loansPosted)}),L=c(()=>g.value?4:3),S=c(()=>{var t;return W((t=f.latestLoan)==null?void 0:t.name)||""}),_=c(()=>a.value===L.value-1),y=()=>{d("portfolio","view",`impact-education-screen-${a.value+1}`)},V=()=>{w("close"),a.value=0},U=()=>{var t;if(a.value>0){const e=a.value-1;(t=v.value)==null||t.goToSlide(e),a.value=e,d("portfolio","click","next-step-impact-education-back"),y()}},O=()=>{var t;if(a.value<L.value-1){const e=a.value+1;(t=v.value)==null||t.goToSlide(e),a.value=e}},z=()=>{_.value?V():(O(),d("portfolio","click","next-step-impact-education-next"),y())},A=t=>{const e=t.value;typeof e=="number"&&e!==a.value&&(a.value=e,y())};return q(()=>{d("portfolio","view","impact-education-screen-1")}),(t,e)=>(i(),b(o(J),{visible:n.show,title:"",onLightboxClosed:V,class:"impact-insight-modal"},{header:l(()=>[o(h)?M("",!0):(i(),I("h2",ee,[e[0]||(e[0]=N(" A closer look at ")),s("u",null,x(S.value)+" world",1)]))]),default:l(()=>[o(h)?(i(),I("h2",te,[e[1]||(e[1]=N(" A closer look at ")),s("u",null,x(S.value)+" world",1)])):M("",!0),s("div",ae,[m(o(G),{ref_key:"carouselRef",ref:v,"is-dotted":!0,"new-index":t.carouselIndex,"slide-max-width":"","controls-top-right":!1,"multiple-slides-visible":!1,"embla-options":{loop:!1,startIndex:0},class:"impact-insight-carousel",onChange:A},H({slide1:l(()=>[m(o(X),{"latest-loan":n.latestLoan},null,8,["latest-loan"])]),slide2:l(()=>[m(o(Y),{"latest-loan":n.latestLoan},null,8,["latest-loan"])]),slide3:l(()=>[g.value?(i(),b(o(Z),{key:0,"latest-loan":n.latestLoan},null,8,["latest-loan"])):(i(),b(o(K),{key:1,"latest-loan":n.latestLoan},null,8,["latest-loan"]))]),_:2},[g.value?{name:"slide4",fn:l(()=>[m(o(K),{"latest-loan":n.latestLoan},null,8,["latest-loan"])]),key:"0"}:void 0]),1032,["new-index"]),s("div",ne,[s("div",oe,[s("div",se,[a.value>0&&!o(h)?(i(),I("button",{key:0,class:"tw-w-11 tw-text-center tw-border tw-rounded-lg tw-bg-white tw-text-gray-900 tw-font-medium",disabled:a.value===0,onClick:U}," Back ",8,le)):M("",!0),s("button",{class:"tw-w-full md:tw-w-11 tw-text-center tw-rounded-lg tw-bg-action tw-text-white tw-font-medium hover:tw-bg-action-highlight",onClick:z},x(_.value?"Done":"Next"),1)])])])])],void 0),_:1},8,["visible"]))}});k.__docgenInfo={exportName:"default",displayName:"MyKivaImpactInsightModal",description:"",tags:{},props:[{name:"show",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"latestLoan",type:{name:"object"},defaultValue:{func:!1,value:"null"}}],events:[{name:"close"}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/ImpactInsight/MyKivaImpactInsightModal.vue"]};const Ce={title:"MyKiva/ImpactInsight/ImpactInsightModal",component:k},E=n=>{const r=(f,{argTypes:w})=>({props:Object.keys(w),components:{MyKivaImpactInsightModal:k},setup(){return{args:n}},template:`
            <div>
                <MyKivaImpactInsightModal
                    v-bind="args"
                />
            </div>
        `});return r.args=n,r},u=E({visible:!0,latestLoan:{id:1975833,name:"Mayram",image:{hash:"9673d0722a7675b9b8d11f90849d9b44"},geocode:{country:{geocode:{latitude:-16,longitude:167},id:231,isoCode:"VU",name:"Vanuatu",ppp:"$89,599"}},amount:100,whySpecial:"She is a community leader.",gender:"female",otherLoans:[],amount:"-75.00",partner:{id:123,loansPosted:4567,__typename:"LoanPartner"}}}),p=E({visible:!0,latestLoan:{id:1975833,name:"Mayram",image:{hash:"9673d0722a7675b9b8d11f90849d9b44"},geocode:{country:{geocode:{latitude:-16,longitude:167},id:231,isoCode:"VU",name:"Vanuatu",ppp:"$89,599"}},amount:100,whySpecial:"She is a community leader.",gender:"female",otherLoans:[],amount:"-75.00",partner:null}});var P,T,j;u.parameters={...u.parameters,docs:{...(P=u.parameters)==null?void 0:P.docs,source:{originalSource:`story({
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
})`,...(j=(T=u.parameters)==null?void 0:T.docs)==null?void 0:j.source}}};var B,$,D;p.parameters={...p.parameters,docs:{...(B=p.parameters)==null?void 0:B.docs,source:{originalSource:`story({
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
})`,...(D=($=p.parameters)==null?void 0:$.docs)==null?void 0:D.source}}};const Ne=["Default","NonPartner"];export{u as Default,p as NonPartner,Ne as __namedExportsOrder,Ce as default};
