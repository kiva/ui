import{G as S}from"./entry-GenericPromoBanner-Dmxk20Osi6.js";import{n as b}from"./entry-numeral-BEwyVwpTZh.js";import{g as I}from"./entry-index-CKVkeXup4D.js";import{l as g}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{b as _,d as w,h as L,a as T,o as R}from"./entry-vue.esm-bundler-Bbq66B_iPn.js";import{_ as N}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const l={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"configSetting"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"key"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"configSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"Variable",name:{kind:"Name",value:"key"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:132}};l.loc.source={body:`
                query configSetting($key: String!) {
	general {
		configSetting(key: $key) {
			key
			value
		}
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const m=(e,t)=>{if(e.kind==="FragmentSpread")t.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&t.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){m(n,t)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){m(n,t)}),e.definitions&&e.definitions.forEach(function(n){m(n,t)})},p={},D=e=>{e.definitions.forEach(function(t){if(t.name){const n=new Set;m(t,n),p[t.name.value]=n}})};D(l);const k=(e,t)=>{for(let n=0;n<e.definitions.length;n++){const s=e.definitions[n];if(s.name&&s.name.value==t)return s}},B=(e,t)=>{const n={kind:e.kind,definitions:[k(e,t)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const s=p[t]||new Set,o=new Set;let a=new Set;for(s.forEach(r=>{a.add(r)});a.size>0;){const r=a;a=new Set,r.forEach(c=>{o.has(c)||(o.add(c),(p[c]||new Set).forEach(d=>{a.add(d)}))})}return o.forEach(r=>{const c=k(e,r);c&&n.definitions.push(c)}),n};B(l,"configSetting");const v="deposit_incentive_active_campaign_id",y=I`
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
`,h={name:"DepositIncentiveBanner",components:{GenericPromoBanner:S},data(){return{hasCampaignReward:!1,amountToLend:0,isLoggedIn:!1,basketTotal:0}},inject:["apollo","cookieStore"],apollo:{preFetch(e,t){return t.query({query:l,variables:{key:v}}).then(n=>{var o,a,r;const s=JSON.parse(((r=(a=(o=n==null?void 0:n.data)==null?void 0:o.general)==null?void 0:a.configSetting)==null?void 0:r.value)??'""');return s?t.query({query:y,variables:{campaignId:s}}):null})}},created(){var t,n,s,o,a,r,c,u,d,f;let e;try{e=JSON.parse(((s=(n=(t=this.apollo.readQuery({query:l,variables:{key:v}}))==null?void 0:t.general)==null?void 0:n.configSetting)==null?void 0:s.value)??'""')}catch(i){g(i,"DepositIncentiveBanner configSettingQuery")}if(e)try{const i=this.apollo.readQuery({query:y,variables:{campaignId:e,basketId:this.cookieStore.get("kvbskt")}});this.amountToLend=parseFloat(((o=i==null?void 0:i.my)==null?void 0:o.depositIncentiveAmountToLend)??0),this.isLoggedIn=!!((a=i==null?void 0:i.my)!=null&&a.id),this.basketTotal=parseFloat(((u=(c=(r=i==null?void 0:i.shop)==null?void 0:r.basket)==null?void 0:c.totals)==null?void 0:u.loanReservationTotal)??0),this.hasCampaignReward=!!((f=(d=i==null?void 0:i.my)==null?void 0:d.userAccount)!=null&&f.hasCampaignReward)}catch(i){g(i,"DepositIncentiveBanner amountToLendQuery")}},computed:{promoBannerContent(){const e=this.isLoggedIn?`Just for you! Lend ${b(this.amountToLend).format("$0,0")} and get a $25 lending credit!¹`:"Lend & get a free lending credit reward!¹ Log in or sign up to get started →",t=this.isLoggedIn?"/lend/filter":"/ui-login?force=true&doneUrl=/lend/filter";return{richText:e,link:t,disclaimer:""}}}},q={key:0};function F(e,t,n,s,o,a){const r=T("generic-promo-banner");return!o.isLoggedIn||!o.hasCampaignReward?(R(),_("div",q,[w(r,{class:"tw-text-center","promo-banner-content":a.promoBannerContent,"enable-deposit-incentive-exp":o.isLoggedIn,"progress-bar-value":o.basketTotal,"amount-to-lend":o.amountToLend},null,8,["promo-banner-content","enable-deposit-incentive-exp","progress-bar-value","amount-to-lend"])])):L("",!0)}const V=N(h,[["render",F]]);h.__docgenInfo={displayName:"DepositIncentiveBanner",exportName:"default",description:"",tags:{},sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/PromotionalBanner/Banners/DepositIncentiveBanner.vue"]};export{V as D};
