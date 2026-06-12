import{g as m}from"./entry-index-CWclSTHHJk.js";import{c as s,b as r,F as g,d as f,e as w,r as v,f as _,o,g as h,h as b,j as C,a as k,k as y,t as i}from"./entry-vue.esm-bundler-D6rjCHbx5a.js";import{B as M}from"./entry-KvWwwHeaderBasic-4oh2xxIPzA.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-numeral-xVHG5DEP0A.js";import{u as P}from"./entry-useMultiMatching-BiI1aeyHJI.js";import{_ as I}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const l={name:"ContributingPartners",components:{KvUserAvatar:M},inject:["apollo","cookieStore"],props:{loanId:{type:Number,default:0}},setup(){const{enableMultiMatching:n}=P();return{enableMultiMatching:n}},data(){return{status:"",simultaneousMatching:[]}},apollo:{query:m`
			query contributingPartners($loanId: Int!) {
				lend {
					loan(id: $loanId) {
						id
						status
						simultaneousMatching {
							managedAccountId
							displayName
							ratio
							partnerContentfulPage
							logo {
								id
								url
							}
						}
					}
				}
			}
		`,preFetch:!1,variables(){return{loanId:this.loanId}},result({data:n}){var a;const t=(a=n==null?void 0:n.lend)==null?void 0:a.loan;this.status=(t==null?void 0:t.status)??"",this.simultaneousMatching=(t==null?void 0:t.simultaneousMatching)??[]}},computed:{showSection(){return this.enableMultiMatching&&this.simultaneousMatching.length>0&&this.status==="fundraising"}}},N={key:0},x={class:"tw-text-upper"},A={class:"tw-mt-0.5"};function B(n,t,a,$,u,c){const d=v("kv-user-avatar"),p=_("kv-track-event");return c.showSection?(o(),s("section",N,[t[0]||(t[0]=r("h2",{class:"tw-text-headline tw-mb-4"}," Contributing partners ",-1)),(o(!0),s(g,null,f(u.simultaneousMatching,e=>(o(),s("div",{key:e.managedAccountId,class:"tw-flex tw-items-center tw-mb-4 last:tw-mb-0"},[h((o(),b(y(e.partnerContentfulPage?"a":"div"),{href:e.partnerContentfulPage?`/impact-dashboard/${e.partnerContentfulPage}`:void 0,class:"tw-flex-none tw-w-12 tw-h-12 tw-rounded-full tw-overflow-hidden tw-shadow tw-mr-2"},{default:C(()=>[k(d,{class:"tw-w-full tw-h-full","lender-name":e.displayName||"Anonymous","lender-image-url":e.logo&&e.logo.url?e.logo.url:""},null,8,["lender-name","lender-image-url"])],void 0),_:2},1032,["href"])),[[p,e.partnerContentfulPage?["borrower-profile","click","contributing-partner-avatar",e.partnerContentfulPage]:void 0]]),r("div",null,[r("p",x,i((e.ratio??0)+1)+"X MATCHING ",1),r("p",A,i(e.displayName||"A Kiva supporter"),1)])]))),128))])):w("",!0)}const E=I(l,[["render",B]]);l.__docgenInfo={displayName:"ContributingPartners",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/ContributingPartners.vue"]};export{E as C};
