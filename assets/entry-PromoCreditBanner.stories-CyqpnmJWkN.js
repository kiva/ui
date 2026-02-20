import{P as o}from"./entry-PromoCreditBanner-CN7uFBF8a4.js";import{a}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as r}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-CWclSTHHJk.js";import"./entry-promoCredit-w2GeqDaA1T.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-confetti.module-BCnSlh9tqh.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const e={data:{my:{id:"1017469",userAccount:{id:"1017469",promoBalance:"10.00"}},shop:{id:"12",basket:{id:"12",hasFreeCredits:!0,totals:{bonusAvailableTotal:15,freeTrialAvailableTotal:0,redemptionCodeAvailableTotal:0,universalCodeAvailableTotal:0},credits:{values:[{id:"12",available:15,creditType:"bonus_credit",promoFund:{id:"12",displayName:"Test Partner"}}]}},lendingRewardOffered:!1,promoCampaign:{promoFund:{id:"12",displayName:"Test Partner"},managedAccount:{campaignInfo:{campaignPromoFundId:"12",upc:!0},id:"ma-1",managementType:"managed",pageId:null,strategicPartner:{id:"sp-1",partnerName:"Test Partner",partnerContentfulPage:"test-partner"}}}}}},Q={title:"WwwFrame/Banners/PromoCreditBanner",component:o},t=()=>({components:{PromoCreditBanner:o},mixins:[a({queryResult:e}),r()],provide:{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}},data(){return{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}}},template:`
        <promo-credit-banner />
    `}),A={data:{...e.data,shop:{...e.data.shop,promoCampaign:{promoFund:{id:"34",displayName:"Lending Promo"},managedAccount:null}}}},i=()=>({components:{PromoCreditBanner:o},mixins:[a({queryResult:A}),r()],provide:{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}},data(){return{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1},$route:{query:{fromContext:"/impact-dashboard"}}}},template:`
        <promo-credit-banner />
    `}),P={data:{...e.data,shop:{...e.data.shop,lendingRewardOffered:!0,promoCampaign:{promoFund:{id:"34",displayName:"Managed Account Promo"},managedAccount:{campaignInfo:{campaignPromoFundId:"34",upc:!1}}}}}},d=()=>({components:{PromoCreditBanner:o},mixins:[a({queryResult:P}),r()],provide:{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}},data(){return{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}}},template:`
        <promo-credit-banner />
    `}),S={data:{...e.data,shop:{...e.data.shop,promoCampaign:{promoFund:{id:"56",displayName:"Managed Account Fund"},managedAccount:{campaignInfo:{campaignPromoFundId:"56",upc:!1},id:"ma-3",managementType:"managed",pageId:"12345",strategicPartner:{id:"sp-3",partnerName:"Managed Account Partner 2",partnerContentfulPage:"managed-account-partner-2"}}}}}},s=()=>({components:{PromoCreditBanner:o},mixins:[a({queryResult:S}),r()],provide:{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}},data(){return{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}}},template:"<promo-credit-banner />"}),D={data:{my:{id:null,userAccount:null},shop:{id:"12",basket:{id:"12",hasFreeCredits:!1,totals:{bonusAvailableTotal:0,freeTrialAvailableTotal:0,redemptionCodeAvailableTotal:0,universalCodeAvailableTotal:0},credits:{values:[]}},lendingRewardOffered:!1,promoCampaign:null}}},n=c=>{const l=c.hasCookie?encodeURIComponent(JSON.stringify({amount:parseFloat(c.creditAmount)||0,campaign_id:null})):void 0,R=l?{kiva_lending_credit:l}:{};return{components:{PromoCreditBanner:o},mixins:[a({queryResult:D}),r({cookies:R})],provide:{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}},data(){return{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}}},template:"<promo-credit-banner />"}};n.args={hasCookie:!0,creditAmount:"25"};n.argTypes={hasCookie:{control:{type:"boolean"},description:"Whether the kiva_lending_credit cookie exists (from monolith)"},creditAmount:{control:{type:"text"},description:'Amount of lending credit - will be formatted as {"amount":N,"campaign_id":null}',if:{arg:"hasCookie",truthy:!0}}};var m,u,g;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`() => ({
  components: {
    PromoCreditBanner
  },
  mixins: [apolloStoryMixin({
    queryResult
  }), cookieStoreStoryMixin()],
  provide: {
    $renderConfig: {
      useCDNCaching: false,
      cdnNotedLoggedIn: false
    }
  },
  data() {
    return {
      $renderConfig: {
        useCDNCaching: false,
        cdnNotedLoggedIn: false
      }
    };
  },
  template: \`
        <promo-credit-banner />
    \`
})`,...(g=(u=t.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var p,f,C;i.parameters={...i.parameters,docs:{...(p=i.parameters)==null?void 0:p.docs,source:{originalSource:`() => ({
  components: {
    PromoCreditBanner
  },
  mixins: [apolloStoryMixin({
    queryResult: queryResultLendingPromo
  }), cookieStoreStoryMixin()],
  provide: {
    $renderConfig: {
      useCDNCaching: false,
      cdnNotedLoggedIn: false
    }
  },
  data() {
    return {
      $renderConfig: {
        useCDNCaching: false,
        cdnNotedLoggedIn: false
      },
      $route: {
        query: {
          fromContext: '/impact-dashboard'
        }
      }
    };
  },
  template: \`
        <promo-credit-banner />
    \`
})`,...(C=(f=i.parameters)==null?void 0:f.docs)==null?void 0:C.source}}};var h,N,y;d.parameters={...d.parameters,docs:{...(h=d.parameters)==null?void 0:h.docs,source:{originalSource:`() => ({
  components: {
    PromoCreditBanner
  },
  mixins: [apolloStoryMixin({
    queryResult: queryResultLendingRewardOffered
  }), cookieStoreStoryMixin()],
  provide: {
    $renderConfig: {
      useCDNCaching: false,
      cdnNotedLoggedIn: false
    }
  },
  data() {
    return {
      $renderConfig: {
        useCDNCaching: false,
        cdnNotedLoggedIn: false
      }
    };
  },
  template: \`
        <promo-credit-banner />
    \`
})`,...(y=(N=d.parameters)==null?void 0:N.docs)==null?void 0:y.source}}};var I,L,b;s.parameters={...s.parameters,docs:{...(I=s.parameters)==null?void 0:I.docs,source:{originalSource:`() => ({
  components: {
    PromoCreditBanner
  },
  mixins: [apolloStoryMixin({
    queryResult: managedAccountQueryResult
  }), cookieStoreStoryMixin()],
  provide: {
    $renderConfig: {
      useCDNCaching: false,
      cdnNotedLoggedIn: false
    }
  },
  data() {
    return {
      $renderConfig: {
        useCDNCaching: false,
        cdnNotedLoggedIn: false
      }
    };
  },
  template: \`<promo-credit-banner />\`
})`,...(b=(L=s.parameters)==null?void 0:L.docs)==null?void 0:b.source}}};var k,v,x;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`args => {
  // Only include the cookie if hasCookie is true
  // Format matches monolith: URL-encoded JSON with amount and campaign_id
  const cookieValue = args.hasCookie ? encodeURIComponent(JSON.stringify({
    amount: parseFloat(args.creditAmount) || 0,
    campaign_id: null
  })) : undefined;
  const cookies = cookieValue ? {
    kiva_lending_credit: cookieValue
  } : {};
  return {
    components: {
      PromoCreditBanner
    },
    mixins: [apolloStoryMixin({
      queryResult: loggedOutQueryResult
    }), cookieStoreStoryMixin({
      cookies
    })],
    provide: {
      $renderConfig: {
        useCDNCaching: false,
        cdnNotedLoggedIn: false
      }
    },
    data() {
      return {
        $renderConfig: {
          useCDNCaching: false,
          cdnNotedLoggedIn: false
        }
      };
    },
    template: \`<promo-credit-banner />\`
  };
}`,...(x=(v=n.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};const V=["Default","WithLendingPromoCredit","WithLendingRewardOffered","WithManagedAccountId","WithKivaLendingCreditCookie"];export{t as Default,n as WithKivaLendingCreditCookie,i as WithLendingPromoCredit,d as WithLendingRewardOffered,s as WithManagedAccountId,V as __namedExportsOrder,Q as default};
