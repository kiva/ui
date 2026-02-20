import{_ as U}from"./entry-JournalUpdateCard-BNsOGRy6C5.js";import{a as M}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as N}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-mdi-B1ONwcTkQ2.js";import"./entry-BorrowerImage-CdYtz78wPt.js";import"./entry-imageUtils-XCIqTGZvrk.js";import"./entry-KvWwwHeader-C1bm1YMh4q.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvMaterialIcon-C3KLX5OV-L.js";import"./entry-KvUserAvatar-DmX-R6-wYd.js";import"./entry-KvLoadingPlaceholder-B_9_tltQhY.js";import"./entry-loanUtils-DSoWkICHcw.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-get-D3xDH2SX94.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-index-CGacd2nhU3.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-index-D4S0JsTkt8.js";const te={title:"MyKiva/JournalUpdateCard",component:U},e={__typename:"Update",id:1392249,body:"<p>He managed to buy manure to boost his crop production, he is earning better from sales.</p>",subject:"Moses is happy.",date:"2025-02-07T10:16:49Z",loan:{__typename:"LoanPartner",id:2722925,name:"Moses",status:"fundraising",loanAmount:"1850.00",loanFundraisingInfo:{__typename:"LoanFundraisingInfo",fundedAmount:"150.00",reservedAmount:"0.00"},image:{__typename:"Image",id:5423429,hash:"093374973a7cfb1f18652d3aac5bbd05"},geocode:{__typename:"Geocode",country:{__typename:"Country",id:1,name:"Uganda"}}}},w={id:82629732,receipt:{id:"82629732",items:{values:[{id:2969321,basketItemType:"loan_reservation",price:"25.00"},{id:2973312,basketItemType:"loan_reservation",price:"25.00"},{id:2990447,basketItemType:"loan_reservation",price:"25.00"}]},transactionTime:"2025-06-17T19:53:53Z",totals:{itemTotal:"75.00",kivaCreditRemaining:"0.00"},checkoutTransactionId:"2686f510-66ad-4cb9-9e1e-a8ef1328c0a2"},isTransaction:!0,date:"2025-06-17T19:53:53Z",subject:"Your transaction was successfully completed! You contributed a total of $75.00 and your new balance is $0.00. This included 3 loans."},a={id:1017469,public:!0,inviterName:"Test User"},t=(d={})=>{const p=(R,{argTypes:x})=>({props:Object.keys(x),components:{JournalUpdateCard:U},mixins:[M(),N()],setup(){return{args:d}},provide:{$kvTrackEvent:()=>Promise.resolve({fn:()=>({})})},template:`
            <div class="tw-bg-eco-green-1 tw-p-1" style="max-width: 450px;">
                <journal-update-card
                    v-bind="args"
                    @read-more-clicked="onReadMoreClicked"
                    @share-loan-clicked="onShareLoanClicked"
                />
            </div>
        `,methods:{onReadMoreClicked(I){console.log(I)},onShareLoanClicked(){console.log("share loan clicked")}}});return p.args=d,p},o=t({update:e,lender:a}),r=t({update:{...e,loan:{...e.loan,status:"funded"}},lender:a}),n=t({update:e,updateNumber:"2",lender:a}),s=t({update:{...e,body:"Testing not truncated body feature."},lender:a}),i=t({update:w,lender:a});var c,m,u;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`story({
  update,
  lender
})`,...(u=(m=o.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var l,y,b;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`story({
  update: {
    ...update,
    loan: {
      ...update.loan,
      status: 'funded'
    }
  },
  lender
})`,...(b=(y=r.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var g,f,_;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`story({
  update,
  updateNumber: '2',
  lender
})`,...(_=(f=n.parameters)==null?void 0:f.docs)==null?void 0:_.source}}};var T,k,v;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`story({
  update: {
    ...update,
    body: 'Testing not truncated body feature.'
  },
  lender
})`,...(v=(k=s.parameters)==null?void 0:k.docs)==null?void 0:v.source}}};var h,S,C;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`story({
  update: transaction,
  lender
})`,...(C=(S=i.parameters)==null?void 0:S.docs)==null?void 0:C.source}}};const oe=["Default","Repaying","UpdateNumber","NotTruncatedBody","Transaction"];export{o as Default,s as NotTruncatedBody,r as Repaying,i as Transaction,n as UpdateNumber,oe as __namedExportsOrder,te as default};
