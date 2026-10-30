import{L as n}from"./entry-LendersAndTeams-DiChyTmeSs.js";import{a as r}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as a}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as i}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import{f as s,c as m}from"./entry-mockLoanFixtures-B1SEGQji3V.js";import"./entry-mdi-CvwCDwZH7q.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvButton-BtWM7FaLlj.js";import"./entry-vue.esm-bundler-DN41AgNdM7.js";import"./entry-KvLoadingSpinner-BoGXwWqv66.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-KvLightbox-BrMDhnobRV.js";import"./entry-printing-DMx4lS_4Te.js";import"./entry-KvMaterialIcon-C9eRZ9H8XM.js";import"./entry-KvLoadingPlaceholder-gPTWuMit7I.js";import"./entry-KvTextLink-6egZsjgCFG.js";import"./entry-useIsMobile-BE29pqDCM_.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-tokens-DbOC52mrdi.js";import"./entry-KvTooltip-ByFQmp4TZZ.js";import"./iframe-aLEpHjHA.js";import"./entry-kivaColors-CtWaAVoWDc.js";import"./entry-BorrowerImage-DJIMXzE9eG.js";import"./entry-imageUtils-Bap1kCOa3o.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-kiva_k-DzDbbfmjWV.js";import"./entry-CollapsibleSection-DRYFbaKK3z.js";import"./entry-KvAccordionItem-BnTm5-nVIJ.js";import"./entry-KvExpandable-BiNNDkFy8y.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-C3zJjaAqCL.js";const oe={title:"Components/BorrowerProfile/LendersAndTeams",component:n},d={...s,lenders:{totalCount:23,values:[{id:201,name:"Lucy D",publicId:"lucy",image:{id:"img1",hash:"abc123"},lenderPage:{id:"lp1",whereabouts:"Beverly Hills, CA"}},{id:202,name:"Erica",publicId:"erica",image:{id:"img2",hash:"def456"},lenderPage:{id:"lp2",whereabouts:"Anytown, CA"}},{id:203,name:"Joy",publicId:"joy",image:{id:"img3",hash:"ghi789"},lenderPage:{id:"lp3",whereabouts:"San Francisco, CA"}}],__typename:"LenderCollection"}},p={...s,teams:{totalCount:5,values:[{id:1,name:"Kiva Lending Team",teamPublicId:"kiva",category:"Common Interest",image:{id:"t1",hash:"team1"},lenderCount:500,lenderCountForLoan:3},{id:2,name:"The A Team",teamPublicId:"theateam",category:"Common Interest",image:{id:"t2",hash:"team2"},lenderCount:200,lenderCountForLoan:1}],__typename:"TeamCollection"}},l={...s,lenders:{totalCount:0,values:[],__typename:"LenderCollection"}},e=()=>({components:{LendersAndTeams:n},mixins:[r({queryResult:m(d)}),a(),i],template:`<lenders-and-teams :loan-id="${d.id}" display-type="lenders" />`}),t=()=>({components:{LendersAndTeams:n},mixins:[r({queryResult:m(p)}),a(),i],template:`<lenders-and-teams :loan-id="${p.id}" display-type="teams" />`}),o=()=>({components:{LendersAndTeams:n},mixins:[r({queryResult:m(l)}),a(),i],template:`<lenders-and-teams :loan-id="${l.id}" display-type="lenders" />`});var c,u,y;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`() => ({
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
})`,...(C=(g=o.parameters)==null?void 0:g.docs)==null?void 0:C.source}}};const ne=["LendersPopulated","TeamsPopulated","EmptyLenders"];export{o as EmptyLenders,e as LendersPopulated,t as TeamsPopulated,ne as __namedExportsOrder,oe as default};
