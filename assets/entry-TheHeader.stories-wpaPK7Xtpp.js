import{_ as ae}from"./entry-visa-BE2KfZ7ZbV.js";import{a as se}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as n}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as a}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import{_ as o}from"./entry-TheHeader-y1Gt5XF4SA.js";import"./entry-vue.esm-bundler-D8yP9bVmC4.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./iframe-Bg3M7544.js";import"./entry-index-C1c4cvJ8FT.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-kiva-logo-Bqo5R24NZM.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvWwwHeaderBasic-BB16oz4SiS.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./entry-CampaignLogoGroup-iO3lwqwgpp.js";import"./entry-KvContentfulImg-Dz7EdpaAeS.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-settingsUtils-CVQrt31Ifm.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-experimentVersion-B5y4RTPkgZ.js";import"./entry-useMyKivaHome-Dcc_c7pwbV.js";import"./entry-useApolloQuery-vwcAJ8FTrS.js";import"./entry-vue-router-CpkYp7v6za.js";import"./entry-watchApolloOperation-CRDPfiJcIR.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-headerUtils-DCYXj7N7oP.js";import"./entry-_baseMap-Y3vx4Wl8dz.js";import"./entry-keys-WbbxK4vnp3.js";import"./entry-toInteger-sFBEvOuEHH.js";import"./entry-PromoCreditBanner-NGSUuYFXJY.js";import"./entry-promoCredit-BPne-2XqN5.js";import"./entry-confettiUtils-Cu2ZQx-gOy.js";import"./entry-confetti.module-B5JVzsfHJX.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-getCacheKey-BQZEmBDkIz.js";import"./entry-urlUtils-D59-4GikCB.js";const i={my:{id:1017469,userAccount:{id:1017469,balance:"0.00",promoBalance:"0.00"},lender:{image:{id:726677,url:"https://www.kiva.org/img/s140/726677.webp"}},team:null,isBorrower:!1,mostRecentBorrowedLoan:null,trustee:null}},S={shop:{nonTrivialItemCount:123}},ne={...S,...i},ie={...i,shop:{nonTrivialItemCount:3,basket:{id:1,items:{values:[{id:1,price:"600"},{id:1,price:"500"},{id:1,price:"100"}]}}}},pe={general:{teamsMenuEnabled:{key:"teams_in_navbar",value:!0}},my:{...i.my,teams:{totalCount:1,values:[{id:1,team:{id:1,name:"Team 1",teamPublicId:"team1"}}]}}},me={general:{teamsMenuEnabled:{key:"teams_in_navbar",value:!0}},my:{...i.my,teams:{totalCount:6,values:[{id:1,team:{id:1,name:"(A+) Atheists, Agnostics, Skeptics, Freethinkers, Secular Humanists and the Non-Religious",teamPublicId:"aplus"}},{id:2,team:{id:2,name:"Team 2",teamPublicId:"team2"}},{id:3,team:{id:3,name:"Team 3",teamPublicId:"team3"}},{id:4,team:{id:4,name:"Team 4",teamPublicId:"team4"}},{id:5,team:{id:5,name:"Team 5",teamPublicId:"team5"}},{id:6,team:{id:6,name:"Team 6",teamPublicId:"team6"}}]}}},s=r=>({readQuery(){return r},readFragment(){return r},query(){return Promise.resolve(r)},watchQuery(){return{subscribe(){}}}}),ce=Object.assign({"/src/assets/images/logos/visa.svg":ae}),t={hideSearchInHeader:!1,minimal:!1,corporate:!1,corporateLogoUrl:Object.keys(ce)[0]},tr={title:"WwwFrame/TheHeader",component:o,parameters:{layout:"fullscreen"},args:t},v=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[se(),n(),a],setup(){return r},template:`
        <the-header
            :minimal="minimal"
            :hide-search-in-header="hideSearchInHeader"
         />
    `}),c=v.bind(t),d=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(S)},setup(){return t},template:`
        <the-header />
    `}),l=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(i)},setup(){return t},template:`
        <the-header />
    `}),u=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(ne)},setup(){return t},template:`
        <the-header />
    `}),g=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(ie)},setup(){return t},template:`
        <the-header />
    `}),h=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(S)},setup(){return t},template:`
        <the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
    `}),y=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(i)},setup(){return t},template:`
        <the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
    `}),I=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(ne)},setup(){return t},template:`
        <the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
    `}),p=v.bind({});p.args={...t,hideSearchInHeader:!0};const m=v.bind({});m.args={...t,minimal:!0};const k=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(pe)},template:`
        <the-header />
    `}),T=(r,{argTypes:e})=>({props:Object.keys(e),components:{TheHeader:o},mixins:[n(),a],provide:{apollo:s(me)},template:`
        <the-header />
    `});var x,b,M;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:"Default.bind(args)",...(M=(b=c.parameters)==null?void 0:b.docs)==null?void 0:M.source}}};var H,_,C;d.parameters={...d.parameters,docs:{...(H=d.parameters)==null?void 0:H.docs,source:{originalSource:`(_, {
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
})`,...(C=(_=d.parameters)==null?void 0:_.docs)==null?void 0:C.source}}};var O,A,L;l.parameters={...l.parameters,docs:{...(O=l.parameters)==null?void 0:O.docs,source:{originalSource:`(_, {
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
})`,...(L=(A=l.parameters)==null?void 0:A.docs)==null?void 0:L.source}}};var j,f,U;u.parameters={...u.parameters,docs:{...(j=u.parameters)==null?void 0:j.docs,source:{originalSource:`(_, {
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
})`,...(U=(f=u.parameters)==null?void 0:f.docs)==null?void 0:U.source}}};var w,W,P;g.parameters={...g.parameters,docs:{...(w=g.parameters)==null?void 0:w.docs,source:{originalSource:`(_, {
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
})`,...(P=(W=g.parameters)==null?void 0:W.docs)==null?void 0:P.source}}};var V,B,D;h.parameters={...h.parameters,docs:{...(V=h.parameters)==null?void 0:V.docs,source:{originalSource:`(_, {
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
})`,...(D=(B=h.parameters)==null?void 0:B.docs)==null?void 0:D.source}}};var E,F,Q;y.parameters={...y.parameters,docs:{...(E=y.parameters)==null?void 0:E.docs,source:{originalSource:`(_, {
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
})`,...(Q=(F=y.parameters)==null?void 0:F.docs)==null?void 0:Q.source}}};var q,G,N;I.parameters={...I.parameters,docs:{...(q=I.parameters)==null?void 0:q.docs,source:{originalSource:`(_, {
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
})`,...(ee=($=k.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var re,oe,te;T.parameters={...T.parameters,docs:{...(re=T.parameters)==null?void 0:re.docs,source:{originalSource:`(args, {
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
})`,...(te=(oe=T.parameters)==null?void 0:oe.docs)==null?void 0:te.source}}};const nr=["Visitor","VisitorItemInCart","LoggedIn","LoggedInItemInCart","LoggedInLargeCart","CorporateVisitorItemInCart","CorporateLoggedIn","CorporateLoggedInItemInCart","HideSearchInHeader","Minimal","LoggedInWithOneTeam","LoggedInWithMultipleTeams"];export{y as CorporateLoggedIn,I as CorporateLoggedInItemInCart,h as CorporateVisitorItemInCart,p as HideSearchInHeader,l as LoggedIn,u as LoggedInItemInCart,g as LoggedInLargeCart,T as LoggedInWithMultipleTeams,k as LoggedInWithOneTeam,m as Minimal,c as Visitor,d as VisitorItemInCart,nr as __namedExportsOrder,tr as default};
