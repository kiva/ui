import{_ as ae}from"./entry-visa-DWWVo1-Pke.js";import{a as se}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as n}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as a}from"./entry-kv-auth0-story-mixin-oCE1UF2FwX.js";import{T as o}from"./entry-syncDate-DgJGMr1N5c.js";import"./entry-vue.esm-bundler-gh2KZVgkoT.js";import"./iframe-Dx2jLTsk.js";import"../sb-preview/runtime.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-_baseIsEqual-C5d7jA8_ba.js";import"./entry-get-DbzAqeWMpB.js";import"./entry-isSymbol-Cs2hrTnPnb.js";import"./entry-keys-CExFC6Ir8Q.js";import"./entry-orderBy-CgIWn3DwCr.js";import"./entry-_baseIteratee-BeIMgQFEge.js";import"./entry-_baseAssignValue-CcnEM7UKty.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-imageUtils-DMLkgPJKqw.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-index-CKVkeXup4D.js";import"./entry-tslib.es6-CxsSpKd0p8.js";import"./entry-kiva-logo-NRy5R3u-0j.js";import"./entry-touchEvents-D1_bE1maXx.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvMaterialIcon-YL3bYtTma_.js";import"./entry-CampaignLogoGroup-BhiPFcyGDw.js";import"./entry-KvContentfulImg-Cm39WJfvm7.js";import"./entry-throttle-C_gUPZjI8B.js";import"./entry-toNumber-BfkLXMgxIK.js";import"./entry-settingsUtils-DSo0EGYi0D.js";import"./entry-index-COmIkRYU2t.js";import"./entry-experimentVersion-DPC15KwAMV.js";import"./entry-KvUserAvatar-BLOyz4GlA3.js";import"./entry-KvButton-DkbqxWSep7.js";import"./entry-KvLoadingSpinner-Bhg3Wp0Pd3.js";import"./entry-KvPageContainer-BuwtoyQ9BL.js";import"./entry-toInteger-ByE7uYhomK.js";import"./entry-fuse.common-CY1jHVywCQ.js";import"./entry-comparators-Dl7wUbGSK1.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-getCacheKey-DdWPpab2Dh.js";import"./entry-filterConfig-s0DIh97LEr.js";import"./entry-numberUtils-CJK53TfNzV.js";import"./entry-filterUtils-BWJxxCZN1l.js";import"./entry-sortOptions-NhTxYkJDzt.js";import"./entry-regions-Bn06nUZAPJ.js";import"./entry-KvTextInput-ejHkSbTFTu.js";import"./entry-chunk-3HK4G4NT-BNowqM5Bqg.js";import"./entry-PromoCreditBanner-DPKc152_Gj.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";const i={my:{userAccount:{id:1017469,balance:"0.00",promoBalance:"0.00"},lender:{image:{id:726677,url:"https://www-dev-kiva-org.freetls.fastly.net/img/s140/726677.jpg"}},team:null,isBorrower:!1,mostRecentBorrowedLoan:null,trustee:null}},v={shop:{nonTrivialItemCount:123}},ne={...v,...i},ie={...i,shop:{nonTrivialItemCount:3,basket:{id:1,items:{values:[{id:1,price:"600"},{id:1,price:"500"},{id:1,price:"100"}]}}}},pe={general:{teamsMenuEnabled:{key:"teams_in_navbar",value:!0}},my:{...i.my,teams:{totalCount:1,values:[{id:1,team:{id:1,name:"Team 1",teamPublicId:"team1"}}]}}},me={general:{teamsMenuEnabled:{key:"teams_in_navbar",value:!0}},my:{...i.my,teams:{totalCount:6,values:[{id:1,team:{id:1,name:"(A+) Atheists, Agnostics, Skeptics, Freethinkers, Secular Humanists and the Non-Religious",teamPublicId:"aplus"}},{id:2,team:{id:2,name:"Team 2",teamPublicId:"team2"}},{id:3,team:{id:3,name:"Team 3",teamPublicId:"team3"}},{id:4,team:{id:4,name:"Team 4",teamPublicId:"team4"}},{id:5,team:{id:5,name:"Team 5",teamPublicId:"team5"}},{id:6,team:{id:6,name:"Team 6",teamPublicId:"team6"}}]}}},s=r=>({readQuery(){return r},readFragment(){return r},query(){return Promise.resolve(r)},watchQuery(){return{subscribe(){}}}}),ce=Object.assign({"/src/assets/images/logos/visa.svg":ae}),t={hideSearchInHeader:!1,minimal:!1,corporate:!1,corporateLogoUrl:Object.keys(ce)[0]},pr={title:"WwwFrame/TheHeader",component:o,parameters:{layout:"fullscreen"},args:t},T=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[se(),n(),a],setup(){return r},template:`
        <the-header
            :minimal="minimal"
            :hide-search-in-header="hideSearchInHeader"
         />
    `}),c=T.bind(t),d=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(v)},setup(){return t},template:`
        <the-header />
    `}),l=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(i)},setup(){return t},template:`
        <the-header />
    `}),u=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(ne)},setup(){return t},template:`
        <the-header />
    `}),g=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(ie)},setup(){return t},template:`
        <the-header />
    `}),h=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(v)},setup(){return t},template:`
        <the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
    `}),y=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(i)},setup(){return t},template:`
        <the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
    `}),I=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(ne)},setup(){return t},template:`
        <the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
    `}),p=T.bind({});p.args={...t,hideSearchInHeader:!0};const m=T.bind({});m.args={...t,minimal:!0};const k=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(pe)},template:`
        <the-header />
    `}),S=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(me)},template:`
        <the-header />
    `});var x,M,b;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:"Default.bind(args)",...(b=(M=c.parameters)==null?void 0:M.docs)==null?void 0:b.source}}};var C,O,_;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    TheHeader
  },
  mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
  provide: {
    apollo: provideMockedApollo(itemInCart)
  },
  setup() {
    return args;
  },
  template: \`
        <the-header />
    \`
})`,...(_=(O=d.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};var A,L,j;l.parameters={...l.parameters,docs:{...(A=l.parameters)==null?void 0:A.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    TheHeader
  },
  mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
  provide: {
    apollo: provideMockedApollo(loggedIn)
  },
  setup() {
    return args;
  },
  template: \`
        <the-header />
    \`
})`,...(j=(L=l.parameters)==null?void 0:L.docs)==null?void 0:j.source}}};var H,f,U;u.parameters={...u.parameters,docs:{...(H=u.parameters)==null?void 0:H.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    TheHeader
  },
  mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
  provide: {
    apollo: provideMockedApollo(loggedInUserItemInCart)
  },
  setup() {
    return args;
  },
  template: \`
        <the-header />
    \`
})`,...(U=(f=u.parameters)==null?void 0:f.docs)==null?void 0:U.source}}};var W,w,P;g.parameters={...g.parameters,docs:{...(W=g.parameters)==null?void 0:W.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    TheHeader
  },
  mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
  provide: {
    apollo: provideMockedApollo(loggedInLargeCart)
  },
  setup() {
    return args;
  },
  template: \`
        <the-header />
    \`
})`,...(P=(w=g.parameters)==null?void 0:w.docs)==null?void 0:P.source}}};var V,B,E;h.parameters={...h.parameters,docs:{...(V=h.parameters)==null?void 0:V.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    TheHeader
  },
  mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
  provide: {
    apollo: provideMockedApollo(itemInCart)
  },
  setup() {
    return args;
  },
  template: \`
        <the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
    \`
})`,...(E=(B=h.parameters)==null?void 0:B.docs)==null?void 0:E.source}}};var F,D,Q;y.parameters={...y.parameters,docs:{...(F=y.parameters)==null?void 0:F.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    TheHeader
  },
  mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
  provide: {
    apollo: provideMockedApollo(loggedIn)
  },
  setup() {
    return args;
  },
  template: \`
        <the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
    \`
})`,...(Q=(D=y.parameters)==null?void 0:D.docs)==null?void 0:Q.source}}};var q,G,N;I.parameters={...I.parameters,docs:{...(q=I.parameters)==null?void 0:q.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    TheHeader
  },
  mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
  provide: {
    apollo: provideMockedApollo(loggedInUserItemInCart)
  },
  setup() {
    return args;
  },
  template: \`
        <the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
    \`
})`,...(N=(G=I.parameters)==null?void 0:G.docs)==null?void 0:N.source}}};var z,J,K;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    TheHeader
  },
  mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  setup() {
    return args;
  },
  template: \`
        <the-header
            :minimal="minimal"
            :hide-search-in-header="hideSearchInHeader"
         />
    \`
})`,...(K=(J=p.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var R,X,Y;m.parameters={...m.parameters,docs:{...(R=m.parameters)==null?void 0:R.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    TheHeader
  },
  mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  setup() {
    return args;
  },
  template: \`
        <the-header
            :minimal="minimal"
            :hide-search-in-header="hideSearchInHeader"
         />
    \`
})`,...(Y=(X=m.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,$,ee;k.parameters={...k.parameters,docs:{...(Z=k.parameters)==null?void 0:Z.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    TheHeader
  },
  mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
  provide: {
    apollo: provideMockedApollo(loggedInWithOneTeam)
  },
  template: \`
        <the-header />
    \`
})`,...(ee=($=k.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var re,oe,te;S.parameters={...S.parameters,docs:{...(re=S.parameters)==null?void 0:re.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    TheHeader
  },
  mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
  provide: {
    apollo: provideMockedApollo(loggedInWithMultipleTeams)
  },
  template: \`
        <the-header />
    \`
})`,...(te=(oe=S.parameters)==null?void 0:oe.docs)==null?void 0:te.source}}};const mr=["Visitor","VisitorItemInCart","LoggedIn","LoggedInItemInCart","LoggedInLargeCart","CorporateVisitorItemInCart","CorporateLoggedIn","CorporateLoggedInItemInCart","HideSearchInHeader","Minimal","LoggedInWithOneTeam","LoggedInWithMultipleTeams"];export{y as CorporateLoggedIn,I as CorporateLoggedInItemInCart,h as CorporateVisitorItemInCart,p as HideSearchInHeader,l as LoggedIn,u as LoggedInItemInCart,g as LoggedInLargeCart,S as LoggedInWithMultipleTeams,k as LoggedInWithOneTeam,m as Minimal,c as Visitor,d as VisitorItemInCart,mr as __namedExportsOrder,pr as default};
