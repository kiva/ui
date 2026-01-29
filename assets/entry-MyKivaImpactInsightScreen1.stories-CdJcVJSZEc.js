import{g as s,c as C,q as a,M as D,L as y,a as P,u as T,o as A}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-KvWwwHeader-K_aXJrsvke.js";import{k as B}from"./entry-KvBorrowerImage-C1KP-1K_gH.js";import{n as u}from"./entry-numeral-xVHG5DEP0A.js";import{f as O}from"./entry-stringParserUtils-DNVsfKTBwa.js";import{_ as z}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-CWclSTHHJk.js";import"./entry-imageUtils-XCIqTGZvrk.js";const E={class:"tw-w-full tw-px-2 md:!tw-py-10 md:!tw-px-10"},H={class:"tw-mx-auto tw-max-w-6xl"},q={class:""},F={class:"tw-mt-10 tw-flex tw-flex-col tw-items-center tw-gap-10 md:tw-mt-14 md:tw-flex-row md:tw-items-center md:!tw-justify-center"},Y={class:"tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border-4 tw-border-brand-500 tw-bg-eco-green-1 tw-text-center min-circle-size"},G={class:"tw-items-center tw-gap-3"},J={class:"borrower-img-size tw-overflow-hidden tw-rounded-full tw-border-4 tw-border-white tw-my-0 tw-mx-auto"},Q={class:"tw-text-lg tw-font-semibold tw-text-slate-900"},R={class:"tw-w-full tw-max-w-xl tw-px-4 md:!tw-px-0"},W=["innerHTML"],S={__name:"MyKivaImpactInsightScreen1",props:{latestLoan:{type:Object,default:null}},setup(c){const e=c,m=s(()=>{var t;return O((t=e.latestLoan)==null?void 0:t.name)||""}),l=s(()=>{var t;return((t=e.latestLoan)==null?void 0:t.name)||""}),K=s(()=>{var t,n;return((n=(t=e.latestLoan)==null?void 0:t.image)==null?void 0:n.hash)||""}),N=s(()=>{var t,n,o;return((o=(n=(t=e.latestLoan)==null?void 0:t.geocode)==null?void 0:n.country)==null?void 0:o.name)||""}),p=s(()=>{var t,n,o;return(o=(n=(t=e.latestLoan)==null?void 0:t.geocode)==null?void 0:n.country)!=null&&o.ppp?u(e.latestLoan.geocode.country.ppp).format("$0,0[.]00"):null}),U=s(()=>{var n,o,w,g,h;const t=Math.abs((n=e.latestLoan)==null?void 0:n.amount)||0;if(((w=(o=e.latestLoan)==null?void 0:o.otherLoans)==null?void 0:w.length)>0&&((g=e.latestLoan)!=null&&g.id)){const k=e.latestLoan.otherLoans.reduce((f,r)=>{var v;return((v=e.latestLoan)==null?void 0:v.id)===(r==null?void 0:r.loan.id)?f+Math.abs((r==null?void 0:r.loan.amount)||0):f},t);return u(k).format("$0,0[.]00")}return(h=e.latestLoan)!=null&&h.amount?u(t).format("$0,0[.]00"):null}),j=s(()=>{let t=`Your ${U.value} loan helps ${l.value} build stability and success in <strong class="tw-text-brand">${N.value}</strong>`;return p.value&&(t+=`, where the average <strong class="tw-text-brand">annual income is ${p.value} USD</strong>`),t+=".",t});return(t,n)=>(A(),C("section",E,[a("div",H,[a("h2",q,[n[0]||(n[0]=D(" A closer look at ")),a("u",null,y(m.value)+" world",1)]),a("div",F,[a("div",Y,[a("div",G,[a("div",J,[P(T(B),{class:"tw-w-full tw-h-full tw-object-cover",alt:l.value,hash:K.value,"aspect-ratio":2/2,"default-image":{width:60},images:[{width:60}],"photo-path":t.$appConfig.photoPath},null,8,["alt","hash","photo-path"])]),a("div",Q,[a("strong",null,y(l.value),1)])])]),a("div",R,[a("p",{innerHTML:j.value,class:"tw-rounded-2xl tw-bg-slate-100 tw-py-2 tw-px-2 md:!tw-px-3 tw-text-base tw-leading-relaxed tw-bg-gray-100 tw-rounded-md md:tw-text-lg"},null,8,W)])])])]))}},$=z(S,[["__scopeId","data-v-fac763b4"]]);S.__docgenInfo={exportName:"default",displayName:"MyKivaImpactInsightScreen1",description:"",tags:{},props:[{name:"latestLoan",type:{name:"object"},defaultValue:{func:!1,value:"null"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/ImpactInsight/MyKivaImpactInsightScreen1.vue"]};const lt={title:"MyKiva/ImpactInsight/MyKivaImpactInsightScreen1",component:$},V=(c={})=>{const e=(m,{argTypes:l})=>({props:Object.keys(l),components:{MyKivaImpactInsightScreen1:$},setup(){return{args:c}},template:`
            <div style="max-width: 888px; max-height:400px">
                <MyKivaImpactInsightScreen1 v-bind="args" />
            </div>
        `});return e.args=c,e},i=V({latestLoan:{amount:"-75.00",id:1975833,name:"Mayram",image:{hash:"9673d0722a7675b9b8d11f90849d9b44"},geocode:{country:{geocode:{latitude:-16,longitude:167},id:231,isoCode:"VU",name:"Vanuatu",ppp:"$89,599"}}}}),d=V({latestLoan:{amount:"-20.00",id:1975833,name:"Mimir",image:{hash:"e3976547cb6d30ff631e616c18a62dad"},geocode:{country:{geocode:{latitude:-16,longitude:167},id:231,isoCode:"VU",name:"Uganda",ppp:"$53,129"}},otherLoans:[{loan:{amount:"-5.00",id:1975833}},{loan:{amount:"-25.00",id:1975833}},{loan:{amount:"-3.00",id:1975834}},{loan:{amount:"-25.00",id:1975835}}]}});var x,_,b;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`story({
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
})`,...(b=(_=i.parameters)==null?void 0:_.docs)==null?void 0:b.source}}};var L,I,M;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`story({
  latestLoan: {
    amount: '-20.00',
    id: 1975833,
    name: 'Mimir',
    image: {
      hash: 'e3976547cb6d30ff631e616c18a62dad'
    },
    geocode: {
      country: {
        geocode: {
          latitude: -16,
          longitude: 167
        },
        id: 231,
        isoCode: 'VU',
        name: 'Uganda',
        ppp: '$53,129'
      }
    },
    otherLoans: [{
      loan: {
        amount: '-5.00',
        id: 1975833
      }
    }, {
      loan: {
        amount: '-25.00',
        id: 1975833
      }
    }, {
      loan: {
        amount: '-3.00',
        id: 1975834
      }
    }, {
      loan: {
        amount: '-25.00',
        id: 1975835
      }
    }]
  }
})`,...(M=(I=d.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};const ct=["Default","SplitTransaction"];export{i as Default,d as SplitTransaction,ct as __namedExportsOrder,lt as default};
