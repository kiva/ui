import{L as n}from"./entry-LendersAndTeams-DI2GKXUnfl.js";import{a as r}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as a}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as s}from"./entry-kv-auth0-story-mixin-BLZ7YbBSGk.js";import{f as i,c as m}from"./entry-mockLoanFixtures-CI6h-mgldC.js";import"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-B52OYB4W0G.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-BW8Ws25b.js";import"./entry-KvLightbox-DepMJA2Aa3.js";import"./entry-printing-BcRIHVBU-U.js";import"./entry-KvTextLink-C1IR_OG8XM.js";import"./entry-useIsMobile-BYiWeE-S8I.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-BorrowerImage-2godQmxmcR.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-kiva_k-DzDbbfmjWV.js";import"./entry-syncDate-B_-s0TM4YD.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-DhjghUk5Me.js";const V={title:"Components/BorrowerProfile/LendersAndTeams",component:n},d={...i,lenders:{totalCount:23,values:[{id:201,name:"Lucy D",publicId:"lucy",image:{id:"img1",hash:"abc123"},lenderPage:{id:"lp1",whereabouts:"Beverly Hills, CA"}},{id:202,name:"Erica",publicId:"erica",image:{id:"img2",hash:"def456"},lenderPage:{id:"lp2",whereabouts:"Anytown, CA"}},{id:203,name:"Joy",publicId:"joy",image:{id:"img3",hash:"ghi789"},lenderPage:{id:"lp3",whereabouts:"San Francisco, CA"}}],__typename:"LenderCollection"}},l={...i,teams:{totalCount:5,values:[{id:1,name:"Kiva Lending Team",teamPublicId:"kiva",category:"Common Interest",image:{id:"t1",hash:"team1"},lenderCount:500,lenderCountForLoan:3},{id:2,name:"The A Team",teamPublicId:"theateam",category:"Common Interest",image:{id:"t2",hash:"team2"},lenderCount:200,lenderCountForLoan:1}],__typename:"TeamCollection"}},p={...i,lenders:{totalCount:0,values:[],__typename:"LenderCollection"}},e=()=>({components:{LendersAndTeams:n},mixins:[r({queryResult:m(d)}),a(),s],template:`<lenders-and-teams :loan-id="${d.id}" display-type="lenders" />`}),t=()=>({components:{LendersAndTeams:n},mixins:[r({queryResult:m(l)}),a(),s],template:`<lenders-and-teams :loan-id="${l.id}" display-type="teams" />`}),o=()=>({components:{LendersAndTeams:n},mixins:[r({queryResult:m(p)}),a(),s],template:`<lenders-and-teams :loan-id="${p.id}" display-type="lenders" />`});var c,u,y;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`() => ({
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
})`,...(x=(h=t.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var S,g,C;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`() => ({
  components: {
    LendersAndTeams
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(emptyLendersLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<lenders-and-teams :loan-id="\${emptyLendersLoan.id}" display-type="lenders" />\`
})`,...(C=(g=o.parameters)==null?void 0:g.docs)==null?void 0:C.source}}};const W=["LendersPopulated","TeamsPopulated","EmptyLenders"];export{o as EmptyLenders,e as LendersPopulated,t as TeamsPopulated,W as __namedExportsOrder,V as default};
