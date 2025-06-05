import{J as v}from"./entry-JournalUpdateCard-BRUYMnQlIP.js";import{a as U}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as x}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-vue.esm-bundler-DRMQxQJg8r.js";import"./entry-mdi-CMeqivaQKM.js";import"./entry-BorrowerImage-B50fwNCO-O.js";import"./entry-imageUtils-DMLkgPJKqw.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvMaterialIcon-Bzq2cnQaw_.js";import"./entry-KvAtbModal-DBQkdQ0mEi.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-loanUtils-5D9a5yj3H7.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-get-D3xDH2SX94.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-index-CGacd2nhU3.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-index-D4S0JsTkt8.js";const z={title:"MyKiva/JournalUpdateCard",component:v},e={__typename:"Update",id:1392249,body:"<p>He managed to buy manure to boost his crop production, he is earning better from sales.</p>",subject:"Moses is happy.",date:"2025-02-07T10:16:49Z",loan:{__typename:"LoanPartner",id:2722925,name:"Moses",status:"fundraising",loanAmount:"1850.00",loanFundraisingInfo:{__typename:"LoanFundraisingInfo",fundedAmount:"150.00",reservedAmount:"0.00"},image:{__typename:"Image",id:5423429,hash:"093374973a7cfb1f18652d3aac5bbd05"},geocode:{__typename:"Geocode",country:{__typename:"Country",id:1,name:"Uganda"}}}},n={id:1017469,public:!0,inviterName:"Test User"},s=(d={})=>{const p=(M,{argTypes:S})=>({props:Object.keys(S),components:{JournalUpdateCard:v},mixins:[U(),x()],setup(){return{args:d}},provide:{$kvTrackEvent:()=>Promise.resolve({fn:()=>({})})},template:`
            <div class="tw-bg-eco-green-1 tw-p-1" style="max-width: 450px;">
                <journal-update-card
                    v-bind="args"
                    @read-more-clicked="onReadMoreClicked"
                    @share-loan-clicked="onShareLoanClicked"
                />
            </div>
        `,methods:{onReadMoreClicked(C){console.log(C)},onShareLoanClicked(){console.log("share loan clicked")}}});return p.args=d,p},o=s({update:e,lender:n}),r=s({update:{...e,loan:{...e.loan,status:"funded"}},lender:n}),t=s({update:e,updateNumber:"2",lender:n}),a=s({update:{...e,body:"Testing not truncated body feature."},lender:n});var i,m,c;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`story({
  update,
  lender
})`,...(c=(m=o.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};var u,l,y;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`story({
  update: {
    ...update,
    loan: {
      ...update.loan,
      status: 'funded'
    }
  },
  lender
})`,...(y=(l=r.parameters)==null?void 0:l.docs)==null?void 0:y.source}}};var g,b,f;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`story({
  update,
  updateNumber: '2',
  lender
})`,...(f=(b=t.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var _,h,k;a.parameters={...a.parameters,docs:{...(_=a.parameters)==null?void 0:_.docs,source:{originalSource:`story({
  update: {
    ...update,
    body: 'Testing not truncated body feature.'
  },
  lender
})`,...(k=(h=a.parameters)==null?void 0:h.docs)==null?void 0:k.source}}};const Q=["Default","Repaying","UpdateNumber","NotTruncatedBody"];export{o as Default,a as NotTruncatedBody,r as Repaying,t as UpdateNumber,Q as __namedExportsOrder,z as default};
