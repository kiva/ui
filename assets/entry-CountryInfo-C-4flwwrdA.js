import{g as A}from"./entry-index-CWclSTHHJk.js";import{n as I}from"./entry-numeral-xVHG5DEP0A.js";import{c as l,a as t,d,F as v,r as x,t as i,g as y,f as L,e as k,h as F,o as r,j as N}from"./entry-vue.esm-bundler-B52OYB4W0G.js";import{y as R,_ as V}from"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import{_ as M}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const B={name:"CountryInfo",inject:["apollo","cookieStore"],components:{KvLoadingPlaceholder:V,KvUiButton:R},props:{loanId:{type:Number,default:0}},data(){return{avgAnnualIncome:"",countryIsoCode:"",countryName:"",fundsLentInCountry:0,loanCurrency:"",loanCurrencyFullName:"",loading:!0,loansInRegionLink:"",numLoansFundraising:0,regionName:""}},apollo:{lazy:!0,query:A`query borrowerCountryInfo($loanId: Int!) {
			lend {
				loan(id: $loanId) {
					id
					terms {
						currency
						currencyFullName
					}
					geocode {
						latitude
						longitude
						country {
							id
							numLoansFundraising
							ppp
							isoCode
							name
							region
							fundsLentInCountry
						}
					}
				}
				countryFacets {
					country {
						id
						isoCode
						region
					}
				}
			}
		}`,variables(){return{loanId:this.loanId}},result({data:u}){var s,a,w,c,p,h,_,g,b,C;const e=(s=u==null?void 0:u.lend)==null?void 0:s.loan,n=e==null?void 0:e.geocode;this.numLoansFundraising=((a=n==null?void 0:n.country)==null?void 0:a.numLoansFundraising)??0,this.avgAnnualIncome=((w=n==null?void 0:n.country)==null?void 0:w.ppp)??"",this.countryIsoCode=((c=n==null?void 0:n.country)==null?void 0:c.isoCode)??"",this.countryName=((p=n==null?void 0:n.country)==null?void 0:p.name)??"",this.regionName=((h=n==null?void 0:n.country)==null?void 0:h.region)??"",this.fundsLentInCountry=((_=n==null?void 0:n.country)==null?void 0:_.fundsLentInCountry)??0,this.loanCurrency=((g=e==null?void 0:e.terms)==null?void 0:g.currency)??"",this.loanCurrencyFullName=((b=e==null?void 0:e.terms)==null?void 0:b.currencyFullName)??"";const f=[],o=((C=u==null?void 0:u.lend)==null?void 0:C.countryFacets)??[];if(o.length){for(let m=0;m<o.length;m+=1)o[m].country.region===this.regionName&&f.push(o[m].country.isoCode);this.loansInRegionLink=`/lend/filter?country=${f.join(",").toLowerCase()}&sortBy=newest`}this.loading=!1}},computed:{showFindMoreLoansInCountryButton(){return this.numLoansFundraising>=1},showFindMoreLoansInRegionButton(){return this.numLoansFundraising===0},avgAnnualIncomeFormatted(){return I(this.avgAnnualIncome).format("$0,0[.]00")},fundsLentInCountryFormatted(){return I(this.fundsLentInCountry).format("$0,0")},loanCurrencyLabel(){return this.loanCurrencyFullName||this.loanCurrency||""}}},j={key:0},q={class:"tw-h-4 lg:tw-h-4.5 tw-w-3/5 md:tw-w-1/4 lg:tw-w-1/5 tw-mb-4"},S={class:"tw-flex tw-mb-4"},D={class:"tw-h-3.5 lg:tw-h-4 tw-w-1/2 md:tw-w-1/4 lg:tw-w-1/6 tw-mb-0.5"},K={class:"tw-h-4 md:tw-h-2 tw-w-4/5 md:tw-w-1/2 lg:tw-w-1/3"},P={class:"tw-flex tw-mb-4"},U={class:"tw-h-3.5 lg:tw-h-4 tw-w-1/2 md:tw-w-1/4 lg:tw-w-1/6 tw-mb-0.5"},z={class:"tw-h-2 tw-w-4/5 md:tw-w-2/5 lg:tw-w-1/4"},E={class:"tw-h-6 tw-w-3/4 md:tw-w-2/5 lg:tw-w-1/4"},T={key:1},G={class:"tw-mb-3","data-testid":"bp-country-header"},H={class:"tw-flex tw-gap-2 tw-mb-4"},J={class:"tw-flex-1","data-testid":"bp-country-aai"},O={class:"tw-block tw-text-headline-two","data-testid":"bp-country-aai-value"},Q={class:"tw-flex-1","data-testid":"bp-country-loans-fundraising"},W={class:"tw-block tw-text-headline-two","data-testid":"bp-country-loans-fundraising-value"},X={key:0,class:"tw-flex tw-gap-2 tw-mb-4"},Y={key:0,class:"tw-flex-1","data-testid":"bp-country-funds-lent"},Z={class:"tw-block tw-text-headline-two","data-testid":"bp-country-funds-lent-value"},$={key:1,class:"tw-flex-1","data-testid":"bp-country-loan-currency"},tt={class:"tw-block tw-text-headline-two","data-testid":"bp-country-loan-currency-value"};function nt(u,e,n,f,o,s){const a=F("kv-loading-placeholder"),w=F("kv-ui-button");return r(),l("section",null,[o.loading?(r(),l("div",j,[t("div",q,[d(a)]),t("div",S,[(r(),l(v,null,x(2,c=>t("div",{key:c,class:"tw-flex-1"},[t("div",D,[d(a)]),t("div",K,[d(a)])])),64))]),t("div",P,[(r(),l(v,null,x(2,c=>t("div",{key:c,class:"tw-flex-1"},[t("div",U,[d(a)]),t("div",z,[d(a)])])),64))]),t("div",E,[d(a)])])):(r(),l("div",T,[t("h2",G,i(o.countryName)+" at a glance ",1),t("div",H,[t("p",J,[t("span",O,i(s.avgAnnualIncomeFormatted),1),e[0]||(e[0]=t("span",{class:"tw-block tw-text-upper tw-text-secondary"}," Average annual income (USD) ",-1))]),t("p",Q,[t("span",W,i(o.numLoansFundraising),1),e[1]||(e[1]=t("span",{class:"tw-block tw-text-upper tw-text-secondary"}," Loans currently fundraising ",-1))])]),o.fundsLentInCountry||s.loanCurrencyLabel?(r(),l("div",X,[o.fundsLentInCountry?(r(),l("p",Y,[t("span",Z,i(s.fundsLentInCountryFormatted),1),e[2]||(e[2]=t("span",{class:"tw-block tw-text-upper tw-text-secondary"}," Funds lent in country ",-1))])):y("",!0),s.loanCurrencyLabel?(r(),l("p",$,[t("span",tt,i(s.loanCurrencyLabel),1),e[3]||(e[3]=t("span",{class:"tw-block tw-text-upper tw-text-secondary"}," Loan transacted in ",-1))])):y("",!0)])):y("",!0),s.showFindMoreLoansInCountryButton?(r(),L(w,{key:1,class:"tw-inline-flex tw-flex-1","data-testid":"bp-country-find-loans-country",href:`/lend/filter?country=${o.countryIsoCode}`,target:"_blank"},{default:k(()=>[N(" Find more borrowers in "+i(o.countryName),1)],void 0),_:1},8,["href"])):y("",!0),s.showFindMoreLoansInRegionButton?(r(),L(w,{key:2,class:"tw-inline-flex tw-flex-1","data-testid":"bp-country-find-loans-region",href:o.loansInRegionLink,target:"_blank"},{default:k(()=>[N(" Find more borrowers in "+i(o.regionName),1)],void 0),_:1},8,["href"])):y("",!0)]))])}const ut=M(B,[["render",nt]]);B.__docgenInfo={displayName:"CountryInfo",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/CountryInfo.vue"]};export{ut as C};
