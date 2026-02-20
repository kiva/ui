import{G as x}from"./entry-GenericPromoBanner-CbAKwaWum3.js";import{n as D}from"./entry-numeral-xVHG5DEP0A.js";import{g as q}from"./entry-index-CWclSTHHJk.js";import{l as v}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{c as w,m as F,a as Q,r as A,o as C}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import{_ as O}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{c as B}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-KvIcon-BUhAos7YaB.js";import"./iframe-Cc_r_Bkf.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-KvWwwHeader-C1bm1YMh4q.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvProgressBar-FMYdx0i-mf.js";import"./entry-logFormatter-DhjghUk5Me.js";const R=`query configSetting($key: String!) {
	general {
		configSetting(key: $key) {
			key
			value
		}
	}
}
`,k={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"configSetting"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"key"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"configSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"Variable",name:{kind:"Name",value:"key"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:140,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:R}}},y="deposit_incentive_active_campaign_id",f=q`
	query amountToLendQuery ($basketId: String, $campaignId: String) {
		shop(basketId: $basketId) {
			id
			basket {
				id
				totals {
					loanReservationTotal
				}
			}
		}
		my {
			id
			depositIncentiveAmountToLend
			userAccount {
				id
				hasCampaignReward(campaignId: $campaignId)
			}
		}
	}
`,L={name:"DepositIncentiveBanner",components:{GenericPromoBanner:x},data(){return{hasCampaignReward:!1,amountToLend:0,isLoggedIn:!1,basketTotal:0}},inject:["apollo","cookieStore"],apollo:{preFetch(n,o){return o.query({query:k,variables:{key:y}}).then(i=>{var t,r,a;const s=JSON.parse(((a=(r=(t=i==null?void 0:i.data)==null?void 0:t.general)==null?void 0:r.configSetting)==null?void 0:a.value)??'""');return s?o.query({query:f,variables:{campaignId:s}}):null})}},created(){var o,i,s,t,r,a,d,m,u,g;let n;try{n=JSON.parse(((s=(i=(o=this.apollo.readQuery({query:k,variables:{key:y}}))==null?void 0:o.general)==null?void 0:i.configSetting)==null?void 0:s.value)??'""')}catch(e){v(e,"DepositIncentiveBanner configSettingQuery")}if(n)try{const e=this.apollo.readQuery({query:f,variables:{campaignId:n,basketId:this.cookieStore.get("kvbskt")}});this.amountToLend=parseFloat(((t=e==null?void 0:e.my)==null?void 0:t.depositIncentiveAmountToLend)??0),this.isLoggedIn=!!((r=e==null?void 0:e.my)!=null&&r.id),this.basketTotal=parseFloat(((m=(d=(a=e==null?void 0:e.shop)==null?void 0:a.basket)==null?void 0:d.totals)==null?void 0:m.loanReservationTotal)??0),this.hasCampaignReward=!!((g=(u=e==null?void 0:e.my)==null?void 0:u.userAccount)!=null&&g.hasCampaignReward)}catch(e){v(e,"DepositIncentiveBanner amountToLendQuery")}},computed:{promoBannerContent(){const n=this.isLoggedIn?`Just for you! Lend ${D(this.amountToLend).format("$0,0")} and get a $25 lending credit!¹`:"Lend & get a free lending credit reward!¹ Log in or sign up to get started →",o=this.isLoggedIn?"/lend/filter":"/ui-login?force=true&doneUrl=/lend/filter";return{richText:n,link:o,disclaimer:""}}}},$={key:0};function M(n,o,i,s,t,r){const a=A("generic-promo-banner");return!t.isLoggedIn||!t.hasCampaignReward?(C(),w("div",$,[Q(a,{class:"tw-text-center","promo-banner-content":r.promoBannerContent,"enable-deposit-incentive-exp":t.isLoggedIn,"progress-bar-value":t.basketTotal,"amount-to-lend":t.amountToLend},null,8,["promo-banner-content","enable-deposit-incentive-exp","progress-bar-value","amount-to-lend"])])):F("",!0)}const l=O(L,[["render",M]]);L.__docgenInfo={displayName:"DepositIncentiveBanner",exportName:"default",description:"",tags:{},sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/PromotionalBanner/Banners/DepositIncentiveBanner.vue"]};const ne={title:"WwwFrame/Banners/DepositIncentiveBanner",component:l},N=n=>({readQuery(){return n},query(){return Promise.resolve(n)},watchQuery(){return{subscribe(){}}}}),j={my:{id:1017469,depositIncentiveAmountToLend:25},shop:{id:1,basket:{id:1,totals:{loanReservationTotal:15}},__typename:"Shop"}},c=(n,{argTypes:o})=>({props:Object.keys(o),mixins:[B()],components:{DepositIncentiveBanner:l},provide:{apollo:N({})},template:`
        <deposit-incentive-banner />
    `}),p=(n,{argTypes:o})=>({props:Object.keys(o),mixins:[B()],components:{DepositIncentiveBanner:l},provide:{apollo:N(j)},template:`
        <deposit-incentive-banner />
    `});var b,S,h;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  mixins: [cookieStoreStoryMixin()],
  components: {
    DepositIncentiveBanner
  },
  provide: {
    apollo: provideMockedApollo({})
  },
  template: \`
        <deposit-incentive-banner />
    \`
})`,...(h=(S=c.parameters)==null?void 0:S.docs)==null?void 0:h.source}}};var I,_,T;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  mixins: [cookieStoreStoryMixin()],
  components: {
    DepositIncentiveBanner
  },
  provide: {
    apollo: provideMockedApollo(userInfo)
  },
  template: \`
        <deposit-incentive-banner />
    \`
})`,...(T=(_=p.parameters)==null?void 0:_.docs)==null?void 0:T.source}}};const oe=["Default","WithBalance"];export{c as Default,p as WithBalance,oe as __namedExportsOrder,ne as default};
