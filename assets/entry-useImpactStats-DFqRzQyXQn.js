import{o as r,c as u,a as c,F as v,r as x,t as g,n as C,f as D,u as B,j as p,B as O,w as G,q as s}from"./entry-vue.esm-bundler-DN41AgNdM7.js";import{b as P}from"./entry-KvLoadingText-CxmXdfCoIk.js";import{l as f}from"./entry-logReadQueryError-BL2yt7MPC5.js";import{p as m}from"./entry-numberUtils-fsNTpyFeOk.js";import{s as I,h as L}from"./entry-givingFundUtils-DbBAppaSM4.js";import{u as k}from"./entry-useApolloQuery-DzwiBjTbWW.js";const $={class:"tw-flex tw-flex-wrap tw-items-center tw-gap-2 md:tw-gap-3 tw-bg-white tw-rounded tw-shadow-lg tw-p-2.5 md:tw-p-3"},Q={class:"tw-grid tw-grid-cols-2 tw-gap-2 md:tw-gap-3 tw-min-w-0 tw-grow-[999] tw-basis-[18rem]"},E={class:"tw-text-label tw-text-tertiary"},R=["data-testid"],V={class:"tw-flex tw-grow tw-basis-[10rem]"},j=Object.assign({name:"AccountStatCard"},{__name:"AccountStatCard",props:{stats:{type:Array,required:!0},loading:{type:Boolean,default:!1}},setup(a){return(o,l)=>(r(),u("div",$,[c("dl",Q,[(r(!0),u(v,null,x(a.stats,i=>(r(),u("div",{key:i.testId,class:"tw-flex tw-flex-col tw-gap-0.5 tw-min-w-0"},[c("dt",E,g(i.label),1),c("dd",{class:C(["tw-text-title",i.highlight?"tw-text-action":"tw-text-primary"]),"data-testid":i.testId},[a.loading?(r(),D(B(P),{key:0})):i.value===null?(r(),u(v,{key:1},[p(" — ")],64)):(r(),u(v,{key:2},[p(g(o.$filters.numeral(i.value,"$0,0.00")),1)],64))],10,R)]))),128))]),c("div",V,[O(o.$slots,"default")])]))}});j.__docgenInfo={name:"AccountStatCard",exportName:"default",displayName:"AccountStatCard",description:"",tags:{},props:[{name:"stats",description:"Each stat's label, amount (null when unknown), value test id, and whether the amount takes the action color",type:{name:"array"},required:!0},{name:"loading",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/src/components/Portfolio/ImpactStats/AccountStatCard.vue"]};const T=`query impactStats {
	my {
		id
		userAccount {
			id
			firstName
			balance
			promoBalance
		}
		userStats {
			amount_outstanding
		}
	}
}
`,z={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"impactStats"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userAccount"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"firstName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"balance"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"promoBalance"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"userStats"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"amount_outstanding"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:180,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:T}}},M=`query impactStatsGivingFunds {
	my {
		id
		givingFundParticipation {
			totalAmount
			totalCount
		}
		givingFunds {
			totalCount
			values {
				id
				currentAmountDonated
			}
		}
	}
}
`,H={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"impactStatsGivingFunds"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"givingFundParticipation"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalAmount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"givingFunds"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"currentAmountDonated"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:229,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:M}}},S={query:z},w={query:H,fetchPolicy:"cache-only",preFetch:(a,o)=>o.query({query:a.query,fetchPolicy:"network-only",errorPolicy:"none"}).catch(l=>f(l,"useImpactStats impactStatsGivingFunds"))},J=[S,w];function ee(){const{result:a,loading:o,error:l}=k(S),{result:i,loading:y}=k(w);G(l,e=>{e&&f(e,"useImpactStats impactStats")});const F=s(()=>{var e,t,n,d;return((d=(n=(t=(e=a.value)==null?void 0:e.my)==null?void 0:t.userAccount)==null?void 0:n.firstName)==null?void 0:d.trim())??""}),h=s(()=>{var t,n;const e=(n=(t=a.value)==null?void 0:t.my)==null?void 0:n.userAccount;return(e==null?void 0:e.balance)===null||(e==null?void 0:e.balance)===void 0?null:m(e.balance)+m(e.promoBalance)}),N=s(()=>{var t,n;const e=(n=(t=a.value)==null?void 0:t.my)==null?void 0:n.userStats;return e?m(e.amount_outstanding):null}),_=s(()=>{var t,n;const e=(n=(t=i.value)==null?void 0:t.my)==null?void 0:n.givingFundParticipation;return e?m(e.totalAmount):null}),b=s(()=>{var t,n,d;const e=(d=(n=(t=i.value)==null?void 0:t.my)==null?void 0:n.givingFunds)==null?void 0:d.values;return e?I(e):null}),q=s(()=>{var e,t,n;return(((n=(t=(e=i.value)==null?void 0:e.my)==null?void 0:t.givingFunds)==null?void 0:n.totalCount)??0)>0}),A=s(()=>{var e;return L((e=i.value)==null?void 0:e.my)});return{firstName:F,availableToLend:h,lentOut:N,givingFundDeposits:_,fundraisersRaised:b,ownsGivingFunds:q,showGivingFund:A,loading:o,givingFundLoading:y,error:l}}const te=[...J];export{j as _,te as a,ee as u};
