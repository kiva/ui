import{g}from"./entry-index-CWclSTHHJk.js";import{o as a,c as o,a as r,F as _,r as v,b as w,f as h,e as y,d as b,O as C,t as d,g as k,M,h as N}from"./entry-vue.esm-bundler-CkX4CbCAj4.js";import{V as P}from"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-numeral-xVHG5DEP0A.js";import{u as I,_ as x}from"./entry-useMultiMatching-CLBeevnai4.js";import{_ as A}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const p={name:"ContributingPartners",components:{KvUserAvatar:P},inject:["apollo","cookieStore"],props:{loanId:{type:Number,default:0}},setup(){const{enableMultiMatching:t}=I();return{enableMultiMatching:t}},data(){return{status:"",simultaneousMatching:[]}},apollo:{query:g`
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
		`,preFetch:!1,variables(){return{loanId:this.loanId}},result({data:t}){var s;const n=(s=t==null?void 0:t.lend)==null?void 0:s.loan;this.status=(n==null?void 0:n.status)??"",this.simultaneousMatching=(n==null?void 0:n.simultaneousMatching)??[]}},computed:{showSection(){return this.enableMultiMatching&&this.simultaneousMatching.length>0&&this.status==="fundraising"}},methods:{getDisplayName(t){return t.displayName&&t.displayName!=="Anonymous"?t.displayName:"A Kiva supporter"}}},D={key:0},F={class:"tw-text-upper"},B={class:"tw-mt-0.5"};function V(t,n,s,$,c,i){const m=N("kv-user-avatar"),f=M("kv-track-event");return i.showSection?(a(),o("section",D,[n[0]||(n[0]=r("h2",{class:"tw-mb-4"}," Contributing partners ",-1)),(a(!0),o(_,null,v(c.simultaneousMatching,e=>(a(),o("div",{key:e.managedAccountId,class:"tw-flex tw-items-center tw-mb-4 last:tw-mb-0"},[w((a(),h(C(e.partnerContentfulPage?"a":"div"),{href:e.partnerContentfulPage?`/impact-dashboard/${e.partnerContentfulPage}`:void 0,class:"tw-flex-none tw-w-12 tw-h-12 tw-rounded-full tw-overflow-hidden tw-shadow tw-mr-2"},{default:y(()=>{var l,u;return[b(m,{class:"tw-w-full tw-h-full","lender-name":e.displayName||"Anonymous","lender-image-url":((l=e.avatar)==null?void 0:l.url)||((u=e.logo)==null?void 0:u.url)||""},null,8,["lender-name","lender-image-url"])]},void 0),_:2},1032,["href"])),[[f,e.partnerContentfulPage?["borrower-profile","click","contributing-partner-avatar",e.partnerContentfulPage]:void 0]]),r("div",null,[r("p",F,d(e.ratio)+":1 MATCHING ",1),r("p",B,d(i.getDisplayName(e)),1)])]))),128))])):k("",!0)}const S=A(p,[["render",V]]);p.__docgenInfo={displayName:"ContributingPartners",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/ContributingPartners.vue"]};S.preFetchOperations=[...x];export{S as _};
