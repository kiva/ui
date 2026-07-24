import{c,a as B,F as N,r as D,t as T,g as j,n as d,h as P,o as r,f as U,L as E}from"./entry-vue.esm-bundler-B52OYB4W0G.js";import{B as L,p as V}from"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-numeral-xVHG5DEP0A.js";import{_ as Z}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-BW8Ws25b.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";const A={name:"SupportedByLenders",components:{KvUserAvatar:L},props:{participants:{type:Object,required:!0,default:()=>({})},isChallenge:{type:Boolean,default:!1},minimal:{type:Boolean,default:!1}},computed:{participantsNumber(){var a,e,t;return this.isChallenge?((a=this.participants)==null?void 0:a.totalCount)??0:((t=(e=this.participants)==null?void 0:e.values)==null?void 0:t.length)??0},participantsText(){return this.isChallenge?this.participantsNumber===1?`${this.participantsNumber} member`:`${this.participantsNumber} members`:this.participantsNumber===1?`${this.participantsNumber} person`:`${this.participantsNumber} people`},supportText(){return this.isChallenge?`${this.participantsText} participating`:`Supported by ${this.participantsText}`},participationLendersDisplayed(){var a;return(((a=this.participants)==null?void 0:a.values)??[]).map(e=>{var n;return{...(e==null?void 0:e.lender)??e,isLegacyPlaceholder:V((n=e.image)==null?void 0:n.url.split("/").pop())}}).filter(e=>e.image).slice(0,5)}}},z={class:"tw-flex tw-shrink-0 tw-items-end","data-testid":"participation-lenders"},F={key:0,class:"tw-px-1 tw-text-base"};function I(a,e,t,n,O,l){const k=P("kv-user-avatar");return r(),c("div",{class:d(["tw-flex tw-items-center",{"tw-mb-1.5":!t.minimal}])},[B("div",z,[(r(!0),c(N,null,D(l.participationLendersDisplayed,(p,u)=>(r(),U(k,{key:p.id,"lender-name":p.name,"lender-image-url":p.image.url,"is-small":"",class:d({"tw--ml-1":u>0,"tw-w-3 tw-h-3":!t.isChallenge,"tw-w-4 tw-h-4":t.isChallenge}),style:E({"z-index":l.participationLendersDisplayed.length-u})},null,8,["lender-name","lender-image-url","class","style"]))),128))]),t.minimal?j("",!0):(r(),c("p",F,T(l.supportText),1))],2)}const S=Z(A,[["render",I]]);A.__docgenInfo={displayName:"SupportedByLenders",exportName:"default",description:"",tags:{},props:[{name:"participants",type:{name:"object"},required:!0,defaultValue:{func:!1,value:"{}"}},{name:"isChallenge",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"minimal",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/SupportedByLenders.vue"]};const x={lend:{loan:{lendingActions:{values:[{latestSharePurchaseDate:"2023-11-13T10:51:10Z",lender:{name:"Erica",image:{url:"https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg"}},shareAmount:"5.00",__typename:"LendingAction"},{latestSharePurchaseDate:"2023-11-08T02:32:20Z",lender:{name:"Joy",image:{url:"https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg"}},shareAmount:"25.00",__typename:"LendingAction"}],__typename:"LendingActionCollection"}}}},$={title:"Components/SupportedByLenders",component:S},m=a=>(t,{argTypes:n})=>({props:Object.keys(n),components:{SupportedByLenders:S,KvUserAvatar:L},setup(){return a},template:`
            <supported-by-lenders
                :participants="participants"
            />
        `}),s=m({participants:x.lend.loan.lendingActions}),i=m({participants:{values:[],__typename:"LendingActionCollection"}}),o=m({participants:{values:[{latestSharePurchaseDate:"2023-11-15T08:00:00Z",lender:{name:"You",image:{url:"https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg"},publicId:"current-user"},shareAmount:"50.00",isCurrentUser:!0,__typename:"LendingAction"},...x.lend.loan.lendingActions.values],__typename:"LendingActionCollection"}});var g,h,y;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`story({
  participants: activities.lend.loan.lendingActions
})`,...(y=(h=s.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var _,v,f;i.parameters={...i.parameters,docs:{...(_=i.parameters)==null?void 0:_.docs,source:{originalSource:`story({
  participants: {
    values: [],
    __typename: 'LendingActionCollection'
  }
})`,...(f=(v=i.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var w,b,C;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`story({
  participants: {
    values: [{
      latestSharePurchaseDate: '2023-11-15T08:00:00Z',
      lender: {
        name: 'You',
        image: {
          url: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg'
        },
        publicId: 'current-user'
      },
      shareAmount: '50.00',
      isCurrentUser: true,
      __typename: 'LendingAction'
    }, ...activities.lend.loan.lendingActions.values],
    __typename: 'LendingActionCollection'
  }
})`,...(C=(b=o.parameters)==null?void 0:b.docs)==null?void 0:C.source}}};const ee=["Default","Empty","CurrentUserHighlighted"];export{o as CurrentUserHighlighted,s as Default,i as Empty,ee as __namedExportsOrder,$ as default};
