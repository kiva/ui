import{q as i,Q as D,w}from"./entry-vue.esm-bundler-DH3zKjNq_R.js";import{l as S}from"./entry-logReadQueryError-BL2yt7MPC5.js";import{p as r}from"./entry-numberUtils-fsNTpyFeOk.js";import{s as G,h as O}from"./entry-givingFundUtils-DbBAppaSM4.js";import{u as g}from"./entry-useApolloQuery-Dvuff6giSC.js";import{b as x}from"./entry-settingsUtils-DmiCd-vQln.js";const P=`query impactStats {
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
			amount_donated
			amount_of_loans
		}
		lendingStats {
			id
			lentTo {
				borrowers {
					totalCount
				}
				countries {
					totalCount
				}
			}
		}
	}
	lend {
		countryFacets {
			country {
				id
				isoCode
			}
		}
	}
	general {
		excluded_countries: uiConfigSetting(key: "excluded_countries") {
			key
			value
		}
	}
}
`,T={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"impactStats"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userAccount"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"firstName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"balance"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"promoBalance"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"userStats"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"amount_outstanding"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"amount_donated"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"amount_of_loans"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"lendingStats"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"lentTo"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"borrowers"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"countries"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}}]}}]}}]}},{kind:"Field",name:{kind:"Name",value:"lend"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"countryFacets"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"country"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isoCode"},arguments:[],directives:[]}]}}]}}]}},{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"excluded_countries"},name:{kind:"Name",value:"uiConfigSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"excluded_countries",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:508,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:P}}},L=`query impactStatsGivingFunds {
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
`,Q={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"impactStatsGivingFunds"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"givingFundParticipation"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalAmount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"givingFunds"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"currentAmountDonated"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:229,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:L}}};function I(a){const d=i(()=>{var v;const s=D(a),m=(v=s==null?void 0:s.lend)==null?void 0:v.countryFacets;if(!m)return null;const k=new Set(x(s,"general.excluded_countries.value"));return m.map(l=>l==null?void 0:l.country).filter(l=>l&&!k.has(l.isoCode))}),u=i(()=>{var s;return((s=d.value)==null?void 0:s.length)??null});return{availableCountries:d,availableCountryCount:u}}const F={query:T},y={query:Q,fetchPolicy:"cache-only",preFetch:(a,d)=>d.query({query:a.query,fetchPolicy:"network-only",errorPolicy:"none"}).catch(u=>S(u,"useImpactStats impactStatsGivingFunds"))},R=[F,y];function z(){const{result:a,loading:d,error:u}=g(F),{result:s,loading:m}=g(y);w(u,e=>{e&&S(e,"useImpactStats impactStats")});const k=i(()=>{var e,n,t,o;return((o=(t=(n=(e=a.value)==null?void 0:e.my)==null?void 0:n.userAccount)==null?void 0:t.firstName)==null?void 0:o.trim())??""}),v=i(()=>{var n,t;const e=(t=(n=a.value)==null?void 0:n.my)==null?void 0:t.userAccount;return(e==null?void 0:e.balance)===null||(e==null?void 0:e.balance)===void 0?null:r(e.balance)+r(e.promoBalance)}),l=i(()=>{var n,t;const e=(t=(n=a.value)==null?void 0:n.my)==null?void 0:t.userStats;return e?r(e.amount_outstanding):null}),N=i(()=>{var e,n,t,o,c;return((c=(o=(t=(n=(e=a.value)==null?void 0:e.my)==null?void 0:n.lendingStats)==null?void 0:t.lentTo)==null?void 0:o.borrowers)==null?void 0:c.totalCount)??null}),p=i(()=>{var e,n,t,o,c;return((c=(o=(t=(n=(e=a.value)==null?void 0:e.my)==null?void 0:n.lendingStats)==null?void 0:t.lentTo)==null?void 0:o.countries)==null?void 0:c.totalCount)??null}),{availableCountryCount:f}=I(()=>a.value),_=i(()=>{var n,t;const e=(t=(n=a.value)==null?void 0:n.my)==null?void 0:t.userStats;return e?r(e.amount_donated):null}),C=i(()=>{var n,t;const e=(t=(n=a.value)==null?void 0:n.my)==null?void 0:t.userStats;return e?r(e.amount_of_loans):null}),b=i(()=>{var n,t;const e=(t=(n=s.value)==null?void 0:n.my)==null?void 0:t.givingFundParticipation;return e?r(e.totalAmount):null}),h=i(()=>{var n,t,o;const e=(o=(t=(n=s.value)==null?void 0:n.my)==null?void 0:t.givingFunds)==null?void 0:o.values;return e?G(e):null}),q=i(()=>{var e,n,t;return(((t=(n=(e=s.value)==null?void 0:e.my)==null?void 0:n.givingFunds)==null?void 0:t.totalCount)??0)>0}),A=i(()=>{var e;return O((e=s.value)==null?void 0:e.my)});return{firstName:k,availableToLend:v,lentOut:l,givingFundDeposits:b,fundraisersRaised:h,ownsGivingFunds:q,showGivingFund:A,livesTouched:N,countriesLentTo:p,countriesAvailable:f,donations:_,totalImpact:C,loading:d,givingFundLoading:m,error:u}}const H=[...R];export{H as _,I as a,z as u};
