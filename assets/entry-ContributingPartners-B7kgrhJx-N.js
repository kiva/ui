import{g}from"./entry-index-CWclSTHHJk.js";import{V as _}from"./entry-KvUserAvatar-mdUNSv4mkO.js";import{u as v,_ as w}from"./entry-useMultiMatching-DsGXZdPz3i.js";import{o as a,c as o,a as r,F as h,r as y,b,f as C,e as k,d as M,M as N,t as d,g as I,I as P,h as x}from"./entry-vue.esm-bundler-ED6DvobC3-.js";import{_ as A}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const c={name:"ContributingPartners",components:{KvUserAvatar:_},inject:["apollo","cookieStore"],props:{loanId:{type:Number,default:0}},setup(){const{enableMultiMatching:t}=v();return{enableMultiMatching:t}},data(){return{status:"",simultaneousMatching:[]}},apollo:{query:g`
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
		`,preFetch:!1,variables(){return{loanId:this.loanId}},result({data:t}){var s;const n=(s=t==null?void 0:t.lend)==null?void 0:s.loan;this.status=(n==null?void 0:n.status)??"",this.simultaneousMatching=(n==null?void 0:n.simultaneousMatching)??[]}},computed:{showSection(){return this.enableMultiMatching&&this.simultaneousMatching.length>0&&this.status==="fundraising"}},methods:{getDisplayName(t){return t.displayName&&t.displayName!=="Anonymous"?t.displayName:"A Kiva supporter"}}},D={key:0},F={class:"tw-text-upper"},B={class:"tw-mt-0.5"};function V(t,n,s,$,p,i){const m=x("kv-user-avatar"),f=P("kv-track-event");return i.showSection?(a(),o("section",D,[n[0]||(n[0]=r("h2",{class:"tw-mb-4"}," Contributing partners ",-1)),(a(!0),o(h,null,y(p.simultaneousMatching,e=>(a(),o("div",{key:e.managedAccountId,class:"tw-flex tw-items-center tw-mb-4 last:tw-mb-0"},[b((a(),C(N(e.partnerContentfulPage?"a":"div"),{href:e.partnerContentfulPage?`/impact-dashboard/${e.partnerContentfulPage}`:void 0,class:"tw-flex-none tw-w-12 tw-h-12 tw-rounded-full tw-overflow-hidden tw-shadow tw-mr-2"},{default:k(()=>{var l,u;return[M(m,{class:"tw-w-full tw-h-full","lender-name":e.displayName||"Anonymous","lender-image-url":((l=e.avatar)==null?void 0:l.url)||((u=e.logo)==null?void 0:u.url)||""},null,8,["lender-name","lender-image-url"])]},void 0),_:2},1032,["href"])),[[f,e.partnerContentfulPage?["borrower-profile","click","contributing-partner-avatar",e.partnerContentfulPage]:void 0]]),r("div",null,[r("p",F,d(e.ratio)+":1 MATCHING ",1),r("p",B,d(i.getDisplayName(e)),1)])]))),128))])):I("",!0)}const S=A(c,[["render",V]]);c.__docgenInfo={displayName:"ContributingPartners",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/ContributingPartners.vue"]};S.preFetchOperations=[...w];export{S as _};
