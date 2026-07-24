import{g as f}from"./entry-index-CWclSTHHJk.js";import{c as o,a,F as v,r as w,g as _,h,K as b,o as r,b as y,f as C,e as N,d as k,N as M,t as d}from"./entry-vue.esm-bundler-B52OYB4W0G.js";import{B as P}from"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-numeral-xVHG5DEP0A.js";import{u as I}from"./entry-useMultiMatching-C-DxTpkOqU.js";import{_ as x}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const c={name:"ContributingPartners",components:{KvUserAvatar:P},inject:["apollo","cookieStore"],props:{loanId:{type:Number,default:0}},setup(){const{enableMultiMatching:t}=I();return{enableMultiMatching:t}},data(){return{status:"",simultaneousMatching:[]}},apollo:{query:f`
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
		`,preFetch:!1,variables(){return{loanId:this.loanId}},result({data:t}){var s;const n=(s=t==null?void 0:t.lend)==null?void 0:s.loan;this.status=(n==null?void 0:n.status)??"",this.simultaneousMatching=(n==null?void 0:n.simultaneousMatching)??[]}},computed:{showSection(){return this.enableMultiMatching&&this.simultaneousMatching.length>0&&this.status==="fundraising"}},methods:{getDisplayName(t){return t.displayName&&t.displayName!=="Anonymous"?t.displayName:"A Kiva supporter"}}},A={key:0},B={class:"tw-text-upper"},D={class:"tw-mt-0.5"};function F(t,n,s,S,p,i){const m=h("kv-user-avatar"),g=b("kv-track-event");return i.showSection?(r(),o("section",A,[n[0]||(n[0]=a("h2",{class:"tw-mb-4"}," Contributing partners ",-1)),(r(!0),o(v,null,w(p.simultaneousMatching,e=>(r(),o("div",{key:e.managedAccountId,class:"tw-flex tw-items-center tw-mb-4 last:tw-mb-0"},[y((r(),C(M(e.partnerContentfulPage?"a":"div"),{href:e.partnerContentfulPage?`/impact-dashboard/${e.partnerContentfulPage}`:void 0,class:"tw-flex-none tw-w-12 tw-h-12 tw-rounded-full tw-overflow-hidden tw-shadow tw-mr-2"},{default:N(()=>{var l,u;return[k(m,{class:"tw-w-full tw-h-full","lender-name":e.displayName||"Anonymous","lender-image-url":((l=e.avatar)==null?void 0:l.url)||((u=e.logo)==null?void 0:u.url)||""},null,8,["lender-name","lender-image-url"])]},void 0),_:2},1032,["href"])),[[g,e.partnerContentfulPage?["borrower-profile","click","contributing-partner-avatar",e.partnerContentfulPage]:void 0]]),a("div",null,[a("p",B,d(e.ratio)+":1 MATCHING ",1),a("p",D,d(i.getDisplayName(e)),1)])]))),128))])):_("",!0)}const H=x(c,[["render",F]]);c.__docgenInfo={displayName:"ContributingPartners",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/ContributingPartners.vue"]};export{H as C};
