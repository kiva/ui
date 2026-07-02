import{g as f}from"./entry-index-CWclSTHHJk.js";import{c as o,b as a,F as v,d as w,g as _,r as h,j as b,o as r,k as y,e as C,f as k,a as N,L as M,t as d}from"./entry-vue.esm-bundler-Du63x9n7zJ.js";import{B as P}from"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-numeral-xVHG5DEP0A.js";import{u as I}from"./entry-useMultiMatching-DS7Hwy-tZ7.js";import{_ as x}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const c={name:"ContributingPartners",components:{KvUserAvatar:P},inject:["apollo","cookieStore"],props:{loanId:{type:Number,default:0}},setup(){const{enableMultiMatching:t}=I();return{enableMultiMatching:t}},data(){return{status:"",simultaneousMatching:[]}},apollo:{query:f`
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
							avatar {
								id
								url
							}
							logo {
								id
								url
							}
						}
					}
				}
			}
		`,preFetch:!1,variables(){return{loanId:this.loanId}},result({data:t}){var s;const n=(s=t==null?void 0:t.lend)==null?void 0:s.loan;this.status=(n==null?void 0:n.status)??"",this.simultaneousMatching=(n==null?void 0:n.simultaneousMatching)??[]}},computed:{showSection(){return this.enableMultiMatching&&this.simultaneousMatching.length>0&&this.status==="fundraising"}},methods:{getDisplayName(t){return t.displayName&&t.displayName!=="Anonymous"?t.displayName:"A Kiva supporter"}}},A={key:0},B={class:"tw-text-upper"},D={class:"tw-mt-0.5"};function F(t,n,s,S,p,i){const m=h("kv-user-avatar"),g=b("kv-track-event");return i.showSection?(r(),o("section",A,[n[0]||(n[0]=a("h2",{class:"tw-mb-4"}," Contributing partners ",-1)),(r(!0),o(v,null,w(p.simultaneousMatching,e=>(r(),o("div",{key:e.managedAccountId,class:"tw-flex tw-items-center tw-mb-4 last:tw-mb-0"},[y((r(),C(M(e.partnerContentfulPage?"a":"div"),{href:e.partnerContentfulPage?`/impact-dashboard/${e.partnerContentfulPage}`:void 0,class:"tw-flex-none tw-w-12 tw-h-12 tw-rounded-full tw-overflow-hidden tw-shadow tw-mr-2"},{default:k(()=>{var l,u;return[N(m,{class:"tw-w-full tw-h-full","lender-name":e.displayName||"Anonymous","lender-image-url":((l=e.avatar)==null?void 0:l.url)||((u=e.logo)==null?void 0:u.url)||""},null,8,["lender-name","lender-image-url"])]},void 0),_:2},1032,["href"])),[[g,e.partnerContentfulPage?["borrower-profile","click","contributing-partner-avatar",e.partnerContentfulPage]:void 0]]),a("div",null,[a("p",B,d((e.ratio??0)+1)+"X MATCHING ",1),a("p",D,d(i.getDisplayName(e)),1)])]))),128))])):_("",!0)}const G=x(c,[["render",F]]);c.__docgenInfo={displayName:"ContributingPartners",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/ContributingPartners.vue"]};export{G as C};
