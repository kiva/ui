import{g as L}from"./entry-index-CWclSTHHJk.js";import{n as N}from"./entry-numeral-xVHG5DEP0A.js";import{c as B}from"./entry-observerUtils-DveHpw6JZJ.js";import{c as m,a as y,n as f,b as e,F as M,d as A,t as d,e as v,f as I,g as k,r as x,o as r,h as F}from"./entry-vue.esm-bundler-Du63x9n7zJ.js";import{y as R,_ as D}from"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-tailwind.config-DnDN25xoV6.js";import{_ as O}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const C={name:"CountryInfo",inject:["apollo","cookieStore"],components:{KvLoadingPlaceholder:D,KvUiButton:R},props:{loanId:{type:Number,default:0}},data(){return{avgAnnualIncome:"",countryIsoCode:"",countryName:"",loading:!0,loansInRegionLink:"",numLoansFundraising:0,regionName:""}},computed:{showFindMoreLoansInCountryButton(){return this.numLoansFundraising>=1},showFindMoreLoansInRegionButton(){return this.numLoansFundraising===0},avgAnnualIncomeFormatted(){return N(this.avgAnnualIncome).format("$0,0[.]00")}},methods:{createObserver(){this.observer=B({targets:[this.$el],callback:o=>{o.forEach(n=>{n.target===this.$el&&n.intersectionRatio>0&&this.loadData()})}}),this.observer||this.loadData()},destroyObserver(){this.observer&&this.observer.disconnect()},loadData(){this.apollo.query({query:L`query borrowerCountryInfo($loanId: Int!) {
					lend {
						loan(id: $loanId) {
							id
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
				}`,variables:{loanId:this.loanId}}).then(o=>{var t,a,s,l,u,p,g,w,b,_;const n=(s=(a=(t=o==null?void 0:o.data)==null?void 0:t.lend)==null?void 0:a.loan)==null?void 0:s.geocode;this.numLoansFundraising=((l=n==null?void 0:n.country)==null?void 0:l.numLoansFundraising)??0,this.avgAnnualIncome=((u=n==null?void 0:n.country)==null?void 0:u.ppp)??"",this.countryIsoCode=((p=n==null?void 0:n.country)==null?void 0:p.isoCode)??"",this.countryName=((g=n==null?void 0:n.country)==null?void 0:g.name)??"",this.regionName=((w=n==null?void 0:n.country)==null?void 0:w.region)??"";const h=[],i=((_=(b=o==null?void 0:o.data)==null?void 0:b.lend)==null?void 0:_.countryFacets)??[];if(i.length){for(let c=0;c<i.length;c+=1)i[c].country.region===this.regionName&&h.push(i[c].country.isoCode);this.loansInRegionLink=`/lend/filter?country=${h.join(",").toLowerCase()}&sortBy=newest`}this.loading=!1})}},mounted(){this.createObserver()},beforeUnmount(){this.destroyObserver()}},V={key:0,class:""},q={class:"tw-flex lg:tw-mb-3"},S={key:1},U={class:"tw-mb-4","data-testid":"bp-country-header"},j={class:"tw-flex tw-mb-4"},E={class:"tw-flex-auto","data-testid":"bp-country-aai"},K={class:"tw-block tw-text-headline","data-testid":"bp-country-aai-value"},P={class:"tw-flex-auto","data-testid":"bp-country-loans-fundraising"},z={class:"tw-block tw-text-headline","data-testid":"bp-country-loans-fundraising-value"};function T(o,n,h,i,t,a){const s=x("kv-loading-placeholder"),l=x("kv-ui-button");return r(),m("section",null,[t.loading?(r(),m("div",V,[y(s,{class:"tw-mb-2",style:f({width:30+Math.random()*15+"%",height:"1.6rem"})},null,8,["style"]),e("div",q,[(r(),m(M,null,A(2,u=>e("div",{key:u,class:"tw-flex-auto"},[y(s,{class:"tw-block tw-mb-2",style:f({width:10+Math.random()*15+"%",height:"1.6rem"})},null,8,["style"]),y(s,{class:"tw-block tw-mb-2",style:f({width:40+Math.random()*15+"%",height:"1.0rem"})},null,8,["style"])])),64))])])):(r(),m("div",S,[e("h2",U,d(t.countryName)+" at a glance ",1),e("div",j,[e("p",E,[e("span",K,d(a.avgAnnualIncomeFormatted),1),n[0]||(n[0]=e("span",{class:"tw-block tw-text-upper tw-text-secondary"}," Average annual income (USD) ",-1))]),e("p",P,[e("span",z,d(t.numLoansFundraising),1),n[1]||(n[1]=e("span",{class:"tw-block tw-text-upper tw-text-secondary"}," Loans currently fundraising ",-1))])]),a.showFindMoreLoansInCountryButton?(r(),v(l,{key:0,class:"tw-inline-flex tw-flex-1","data-testid":"bp-country-find-loans-country",href:`/lend/filter?country=${t.countryIsoCode}`,target:"_blank"},{default:I(()=>[F(" Find more borrowers in "+d(t.countryName),1)],void 0),_:1},8,["href"])):k("",!0),a.showFindMoreLoansInRegionButton?(r(),v(l,{key:1,class:"tw-inline-flex tw-flex-1","data-testid":"bp-country-find-loans-region",href:t.loansInRegionLink,target:"_blank"},{default:I(()=>[F(" Find more borrowers in "+d(t.regionName),1)],void 0),_:1},8,["href"])):k("",!0)]))])}const Y=O(C,[["render",T]]);C.__docgenInfo={displayName:"CountryInfo",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/CountryInfo.vue"]};export{Y as C};
