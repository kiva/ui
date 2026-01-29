import{P as n}from"./entry-PromoCreditBanner-XUiEvDBm5F.js";import{a as d}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as i}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-CWclSTHHJk.js";import"./entry-promoCredit-w2GeqDaA1T.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-confetti.module-BCnSlh9tqh.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const e={data:{my:{id:"1017469",userAccount:{id:"1017469",promoBalance:"10.00"}},shop:{id:"12",basket:{id:"12",hasFreeCredits:!0,totals:{bonusAvailableTotal:15,freeTrialAvailableTotal:0,redemptionCodeAvailableTotal:0,universalCodeAvailableTotal:0},credits:{values:[{id:"12",available:15,creditType:"bonus_credit",promoFund:{id:"12",displayName:"Test Partner"}}]}},lendingRewardOffered:!1,promoCampaign:{promoFund:{id:"12",displayName:"Test Partner"},managedAccount:{campaignInfo:{campaignPromoFundId:"12",upc:!0},id:"ma-1",managementType:"managed",pageId:null,strategicPartner:{id:"sp-1",partnerName:"Test Partner",partnerContentfulPage:"test-partner"}}}}}},F={title:"WwwFrame/Banners/PromoCreditBanner",component:n},a=()=>({components:{PromoCreditBanner:n},mixins:[d({queryResult:e}),i()],provide:{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}},data(){return{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}}},template:`
        <promo-credit-banner />
    `}),I={data:{...e.data,shop:{...e.data.shop,promoCampaign:{promoFund:{id:"34",displayName:"Lending Promo"},managedAccount:null}}}},r=()=>({components:{PromoCreditBanner:n},mixins:[d({queryResult:I}),i()],provide:{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}},data(){return{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1},$route:{query:{fromContext:"/impact-dashboard"}}}},template:`
        <promo-credit-banner />
    `}),L={data:{...e.data,shop:{...e.data.shop,lendingRewardOffered:!0,promoCampaign:{promoFund:{id:"34",displayName:"Managed Account Promo"},managedAccount:{campaignInfo:{campaignPromoFundId:"34",upc:!1}}}}}},o=()=>({components:{PromoCreditBanner:n},mixins:[d({queryResult:L}),i()],provide:{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}},data(){return{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}}},template:`
        <promo-credit-banner />
    `}),P={data:{...e.data,shop:{...e.data.shop,promoCampaign:{promoFund:{id:"56",displayName:"Managed Account Fund"},managedAccount:{campaignInfo:{campaignPromoFundId:"56",upc:!1},id:"ma-3",managementType:"managed",pageId:"12345",strategicPartner:{id:"sp-3",partnerName:"Managed Account Partner 2",partnerContentfulPage:"managed-account-partner-2"}}}}}},t=()=>({components:{PromoCreditBanner:n},mixins:[d({queryResult:P}),i()],provide:{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}},data(){return{$renderConfig:{useCDNCaching:!1,cdnNotedLoggedIn:!1}}},template:"<promo-credit-banner />"});var s,c,m;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:`() => ({
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
})`,...(m=(c=a.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var p,g,u;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`() => ({
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
})`,...(u=(g=r.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};var l,f,C;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`() => ({
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
})`,...(C=(f=o.parameters)==null?void 0:f.docs)==null?void 0:C.source}}};var N,y,h;t.parameters={...t.parameters,docs:{...(N=t.parameters)==null?void 0:N.docs,source:{originalSource:`() => ({
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
})`,...(h=(y=t.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};const T=["Default","WithLendingPromoCredit","WithLendingRewardOffered","WithManagedAccountId"];export{a as Default,r as WithLendingPromoCredit,o as WithLendingRewardOffered,t as WithManagedAccountId,T as __namedExportsOrder,F as default};
