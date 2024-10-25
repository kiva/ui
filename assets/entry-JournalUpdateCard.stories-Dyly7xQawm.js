import{J as x}from"./entry-JournalUpdateCard-rUIpJKOCSe.js";import{m as B}from"./entry-utils-DPTlI_yqzd.js";import{a as C}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as L}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-vue.esm-bundler-CCMUuEADRp.js";import"./entry-mdi-BqhcKrkTVU.js";import"./entry-BorrowerImage-B3GWN-qTdY.js";import"./entry-imageUtils-DMLkgPJKqw.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvMaterialIcon-D8DnGkc65h.js";import"./entry-loanUtils-C0BTH8jzD8.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-get-pjbUt-rccH.js";import"./entry-isSymbol-Cs2hrTnPnb.js";import"./entry-index-DMzEMPK2qH.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-loan-data-mock-K6LggmKLGT.js";const H={title:"MyKiva/JournalUpdateCard",component:x},a=B(1),n={id:1365244,body:`I’m thrilled to update you on our progress! Thanks to your support, we’ve entered the next phase of our journey—choosing the perfect fabric for our new bust-friendly styles. The swatches are on their way, and we’re evaluating two amazing options:<br />\r
<br />\r
Cotton Spandex Jersey<br />\r
Bamboo Viscose Spandex<br />\r
<br />\r
Both fabrics are not only comfortable and functional, but they are also natural and better for the environment. Choosing natural fabrics like cotton and bamboo is important to us because they are biodegradable, unlike synthetic materials that contribute to long-term pollution. Additionally, natural fabrics require fewer chemicals in their production, and bamboo in particular grows rapidly without the need for pesticides, making it a more sustainable option.<br />\r
<br />\r
We prioritize breathability and comfort, but also want to do our part in reducing the fashion industry’s environmental footprint. By choosing natural fabrics, we’re working toward creating sustainable, eco-friendly clothing that looks good, feels good, and is better for the planet.<br />\r
<br />\r
Thank you once again for your belief in our mission and for your support in helping us bring these new styles to life. I’ll keep you updated on our final choice, and as always, we are grateful for your continued support!<br />\r
<br />\r
Warm regards,<br />\r
Kristen Allen<br />\r
Founder, Exclusively Kristen`,subject:"Exciting Update: Fabric Swatches Are on the Way!",date:"2024-09-21T11:37:31Z",image:null},s={id:1017469,public:!0,inviterName:"Test User"},i=(c={})=>{const d=(N,{argTypes:S})=>({props:Object.keys(S),components:{JournalUpdateCard:x},mixins:[C(),L()],setup(){return{args:c}},provide:{$kvTrackEvent:()=>Promise.resolve({fn:()=>({})})},template:`
            <div class="tw-bg-eco-green-1 tw-p-1" style="max-width: 450px;">
                <journal-update-card
                    v-bind="args"
                    @read-more-clicked="onReadMoreClicked"
                    @share-loan-clicked="onShareLoanClicked"
                />
            </div>
        `,methods:{onReadMoreClicked(T){console.log(T)},onShareLoanClicked(){console.log("share loan clicked")}}});return d.args=c,d},e=i({loan:a[0],update:n,lender:s}),r=i({loan:{...a[0],status:"payingBack"},update:n,lender:s}),o=i({loan:a[0],update:n,updateNumber:"2",lender:s}),t=i({loan:{...a[0],status:"payingBack"},update:{...n,body:"Testing not truncated body feature."},lender:s});var p,l,u;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:`story({
  loan: mockLoans[0],
  update,
  lender
})`,...(u=(l=e.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var m,b,y;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: 'payingBack'
  },
  update,
  lender
})`,...(y=(b=r.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};var g,h,f;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`story({
  loan: mockLoans[0],
  update,
  updateNumber: '2',
  lender
})`,...(f=(h=o.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var k,w,v;t.parameters={...t.parameters,docs:{...(k=t.parameters)==null?void 0:k.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: 'payingBack'
  },
  update: {
    ...update,
    body: 'Testing not truncated body feature.'
  },
  lender
})`,...(v=(w=t.parameters)==null?void 0:w.docs)==null?void 0:v.source}}};const Q=["Default","Repaying","UpdateNumber","NotTruncatedBody"];export{e as Default,t as NotTruncatedBody,r as Repaying,o as UpdateNumber,Q as __namedExportsOrder,H as default};
