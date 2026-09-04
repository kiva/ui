import{L as o}from"./entry-LendersAndTeams-CDlrI53hcc.js";import{a as r}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as a}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as s}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import{f as i,c as m}from"./entry-mockLoanFixtures-B1SEGQji3V.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-D22wPJfH.js";import"./entry-KvTextLink-MXkuOZP6Vy.js";import"./entry-useIsMobile-BBZTwuJosm.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-BorrowerImage-l4VVjAcZ0b.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-kiva_k-DzDbbfmjWV.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-C3zJjaAqCL.js";const N={title:"Components/BorrowerProfile/LendersAndTeams",component:o},d={...i,lenders:{totalCount:23,values:[{id:201,name:"Lucy D",publicId:"lucy",image:{id:"img1",hash:"abc123"},lenderPage:{id:"lp1",whereabouts:"Beverly Hills, CA"}},{id:202,name:"Erica",publicId:"erica",image:{id:"img2",hash:"def456"},lenderPage:{id:"lp2",whereabouts:"Anytown, CA"}},{id:203,name:"Joy",publicId:"joy",image:{id:"img3",hash:"ghi789"},lenderPage:{id:"lp3",whereabouts:"San Francisco, CA"}}],__typename:"LenderCollection"}},l={...i,teams:{totalCount:5,values:[{id:1,name:"Kiva Lending Team",teamPublicId:"kiva",category:"Common Interest",image:{id:"t1",hash:"team1"},lenderCount:500,lenderCountForLoan:3},{id:2,name:"The A Team",teamPublicId:"theateam",category:"Common Interest",image:{id:"t2",hash:"team2"},lenderCount:200,lenderCountForLoan:1}],__typename:"TeamCollection"}},p={...i,lenders:{totalCount:0,values:[],__typename:"LenderCollection"}},e=()=>({components:{LendersAndTeams:o},mixins:[r({queryResult:m(d)}),a(),s],template:`<lenders-and-teams :loan-id="${d.id}" display-type="lenders" />`}),t=()=>({components:{LendersAndTeams:o},mixins:[r({queryResult:m(l)}),a(),s],template:`<lenders-and-teams :loan-id="${l.id}" display-type="teams" />`}),n=()=>({components:{LendersAndTeams:o},mixins:[r({queryResult:m(p)}),a(),s],template:`<lenders-and-teams :loan-id="${p.id}" display-type="lenders" />`});var c,u,y;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`() => ({
  components: {
    LendersAndTeams
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(lendersLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<lenders-and-teams :loan-id="\${lendersLoan.id}" display-type="lenders" />\`
})`,...(y=(u=e.parameters)==null?void 0:u.docs)==null?void 0:y.source}}};var L,h,x;t.parameters={...t.parameters,docs:{...(L=t.parameters)==null?void 0:L.docs,source:{originalSource:`() => ({
  components: {
    LendersAndTeams
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(teamsLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<lenders-and-teams :loan-id="\${teamsLoan.id}" display-type="teams" />\`
})`,...(x=(h=t.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var S,g,C;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`() => ({
  components: {
    LendersAndTeams
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(emptyLendersLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<lenders-and-teams :loan-id="\${emptyLendersLoan.id}" display-type="lenders" />\`
})`,...(C=(g=n.parameters)==null?void 0:g.docs)==null?void 0:C.source}}};const U=["LendersPopulated","TeamsPopulated","EmptyLenders"];export{n as EmptyLenders,e as LendersPopulated,t as TeamsPopulated,U as __namedExportsOrder,N as default};
