import{D as de}from"./entry-DetailsTabs-FJt9Wb2NW7.js";import{a as le}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as Le}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as Te}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import{c as ge,f as r,d as b,a as C}from"./entry-mockLoanFixtures-B1SEGQji3V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-D22wPJfH.js";import"./entry-KvTabs-k3G03jR3lV.js";import"./entry-KvTabPanel-DmMRklW429.js";import"./entry-DescriptionListLoading-yPDwrdAhmZ.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-FieldPartnerDetails-7HbYaFJiky.js";import"./entry-dateUtils-qZzGtZF0jQ.js";import"./entry-DescriptionListItem-BCpLS42R0Z.js";import"./entry-KvTextLink-MXkuOZP6Vy.js";import"./entry-LoanDetails-BNAItwYpjO.js";import"./entry-RepaymentSchedule-CUaguWwJXS.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-TrusteeDetails-PGxkuylwZR.js";import"./entry-index-7WUD3idviV.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-C3zJjaAqCL.js";const t=["borrowerProfileLoanDetails","borrowerProfileFieldPartner","borrowerProfileTrustee"];function e(D,{loading:ce=!1,condensed:ue=!1,loadingQueries:me=[],initialTab:pe="loanDetails"}={}){return()=>({components:{DetailsTabs:de},mixins:[le({queryResult:ge(D),loading:ce,loadingQueries:me}),Le(),Te],template:`
            <details-tabs
                :loan-id="${D.id}"
                name="details-${D.id}"
                :condensed="${ue}"
                initial-tab="${pe}"
            />
        `})}const Ke={title:"Components/BorrowerProfile/DetailsTabs",component:de},a=e(r,{condensed:!0,initialTab:"partner"});a.storyName="Condensed — Partner Loan";const o=e(r,{condensed:!0,loadingQueries:t,initialTab:"partner"});o.storyName="Condensed — Partner Loan — Tab Content Loading";const n=e(b,{condensed:!0,initialTab:"trustee"});n.storyName="Condensed — Direct Loan (Trustee)";const s=e(b,{condensed:!0,loadingQueries:t,initialTab:"trustee"});s.storyName="Condensed — Direct Loan (Trustee) — Tab Content Loading";const i=e(C,{condensed:!0});i.storyName="Condensed — Direct Loan (No Trustee)";const d=e(C,{condensed:!0,loadingQueries:t});d.storyName="Condensed — Direct Loan (No Trustee) — Tab Content Loading";const c=e(r,{loading:!0,condensed:!0});c.storyName="Condensed — Loading Skeleton";const u=e(b,{initialTab:"trustee"});u.storyName="Direct Loan (Trustee)";const m=e(b,{loadingQueries:t,initialTab:"trustee"});m.storyName="Direct Loan (Trustee) — Tab Content Loading";const p=e(C);p.storyName="Direct Loan (No Trustee)";const l=e(C,{loadingQueries:t});l.storyName="Direct Loan (No Trustee) — Tab Content Loading";const L=e(r,{loading:!0});L.storyName="Loading Skeleton";const T=e(r,{initialTab:"partner"});T.storyName="Partner Loan";const g=e(r,{loadingQueries:t,initialTab:"partner"});g.storyName="Partner Loan — Tab Content Loading";var S,y,f;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:`detailsTabsStory(fundraisingPartnerLoan, {
  condensed: true,
  initialTab: 'partner'
})`,...(f=(y=a.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};var N,P,Q;o.parameters={...o.parameters,docs:{...(N=o.parameters)==null?void 0:N.docs,source:{originalSource:`detailsTabsStory(fundraisingPartnerLoan, {
  condensed: true,
  loadingQueries: tabContentQueries,
  initialTab: 'partner'
})`,...(Q=(P=o.parameters)==null?void 0:P.docs)==null?void 0:Q.source}}};var h,W,x;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`detailsTabsStory(directLoanWithTrustee, {
  condensed: true,
  initialTab: 'trustee'
})`,...(x=(W=n.parameters)==null?void 0:W.docs)==null?void 0:x.source}}};var k,w,$;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`detailsTabsStory(directLoanWithTrustee, {
  condensed: true,
  loadingQueries: tabContentQueries,
  initialTab: 'trustee'
})`,...($=(w=s.parameters)==null?void 0:w.docs)==null?void 0:$.source}}};var M,_,R;i.parameters={...i.parameters,docs:{...(M=i.parameters)==null?void 0:M.docs,source:{originalSource:`detailsTabsStory(fundraisingDirectLoan, {
  condensed: true
})`,...(R=(_=i.parameters)==null?void 0:_.docs)==null?void 0:R.source}}};var q,v,A;d.parameters={...d.parameters,docs:{...(q=d.parameters)==null?void 0:q.docs,source:{originalSource:`detailsTabsStory(fundraisingDirectLoan, {
  condensed: true,
  loadingQueries: tabContentQueries
})`,...(A=(v=d.parameters)==null?void 0:v.docs)==null?void 0:A.source}}};var B,E,F;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`detailsTabsStory(fundraisingPartnerLoan, {
  loading: true,
  condensed: true
})`,...(F=(E=c.parameters)==null?void 0:E.docs)==null?void 0:F.source}}};var O,j,z;u.parameters={...u.parameters,docs:{...(O=u.parameters)==null?void 0:O.docs,source:{originalSource:`detailsTabsStory(directLoanWithTrustee, {
  initialTab: 'trustee'
})`,...(z=(j=u.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};var G,H,I;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`detailsTabsStory(directLoanWithTrustee, {
  loadingQueries: tabContentQueries,
  initialTab: 'trustee'
})`,...(I=(H=m.parameters)==null?void 0:H.docs)==null?void 0:I.source}}};var J,K,U;p.parameters={...p.parameters,docs:{...(J=p.parameters)==null?void 0:J.docs,source:{originalSource:"detailsTabsStory(fundraisingDirectLoan)",...(U=(K=p.parameters)==null?void 0:K.docs)==null?void 0:U.source}}};var V,X,Y;l.parameters={...l.parameters,docs:{...(V=l.parameters)==null?void 0:V.docs,source:{originalSource:`detailsTabsStory(fundraisingDirectLoan, {
  loadingQueries: tabContentQueries
})`,...(Y=(X=l.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,re;L.parameters={...L.parameters,docs:{...(Z=L.parameters)==null?void 0:Z.docs,source:{originalSource:`detailsTabsStory(fundraisingPartnerLoan, {
  loading: true
})`,...(re=(ee=L.parameters)==null?void 0:ee.docs)==null?void 0:re.source}}};var te,ae,oe;T.parameters={...T.parameters,docs:{...(te=T.parameters)==null?void 0:te.docs,source:{originalSource:`detailsTabsStory(fundraisingPartnerLoan, {
  initialTab: 'partner'
})`,...(oe=(ae=T.parameters)==null?void 0:ae.docs)==null?void 0:oe.source}}};var ne,se,ie;g.parameters={...g.parameters,docs:{...(ne=g.parameters)==null?void 0:ne.docs,source:{originalSource:`detailsTabsStory(fundraisingPartnerLoan, {
  loadingQueries: tabContentQueries,
  initialTab: 'partner'
})`,...(ie=(se=g.parameters)==null?void 0:se.docs)==null?void 0:ie.source}}};const Ue=["CondensedPartnerLoan","CondensedPartnerContentLoading","CondensedDirectLoanWithTrustee","CondensedDirectLoanWithTrusteeContentLoading","CondensedDirectLoanNoTrustee","CondensedDirectLoanNoTrusteeContentLoading","CondensedLoading","DirectLoanWithTrustee","DirectLoanWithTrusteeContentLoading","DirectLoanNoTrustee","DirectLoanNoTrusteeContentLoading","Loading","PartnerLoan","PartnerLoanContentLoading"];export{i as CondensedDirectLoanNoTrustee,d as CondensedDirectLoanNoTrusteeContentLoading,n as CondensedDirectLoanWithTrustee,s as CondensedDirectLoanWithTrusteeContentLoading,c as CondensedLoading,o as CondensedPartnerContentLoading,a as CondensedPartnerLoan,p as DirectLoanNoTrustee,l as DirectLoanNoTrusteeContentLoading,u as DirectLoanWithTrustee,m as DirectLoanWithTrusteeContentLoading,L as Loading,T as PartnerLoan,g as PartnerLoanContentLoading,Ue as __namedExportsOrder,Ke as default};
