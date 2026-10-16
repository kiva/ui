import{g as h}from"./entry-index-CWclSTHHJk.js";import{V as y}from"./entry-KvUserAvatar-Z92k8Ijfqa.js";import{u as C,_ as N}from"./entry-useMultiMatching-DMW-uZksXR.js";import{C as k}from"./entry-CollapsibleSection-OHWsGtSBfF.js";import{o,c as l,d,e as a,F as M,r as P,b as I,f as x,M as A,a as r,t as c,j as m,g as D,I as V,h as f}from"./entry-vue.esm-bundler-DN41AgNdM7.js";import{_ as B}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const g={name:"ContributingPartners",components:{CollapsibleSection:k,KvUserAvatar:y},inject:["apollo","cookieStore"],props:{loanId:{type:Number,default:0},collapsible:{type:Boolean,default:!1}},setup(){const{enableMultiMatching:n}=C();return{enableMultiMatching:n}},data(){return{status:"",simultaneousMatching:[]}},apollo:{query:h`
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
		`,preFetch:!1,variables(){return{loanId:this.loanId}},result({data:n}){var s;const e=(s=n==null?void 0:n.lend)==null?void 0:s.loan;this.status=(e==null?void 0:e.status)??"",this.simultaneousMatching=(e==null?void 0:e.simultaneousMatching)??[]}},computed:{showSection(){return this.enableMultiMatching&&this.simultaneousMatching.length>0&&this.status==="fundraising"}},methods:{getDisplayName(n){return n.displayName&&n.displayName!=="Anonymous"?n.displayName:"A Kiva supporter"}}},F={key:0},S={class:"tw-text-upper"},q={class:"tw-mt-0.5"};function $(n,e,s,K,_,i){const b=f("kv-user-avatar"),v=f("collapsible-section"),w=V("kv-track-event");return i.showSection?(o(),l("section",F,[d(v,{id:"bp-contributing-partners",collapsible:s.collapsible},{heading:a(()=>e[0]||(e[0]=[r("h2",{class:"tw-mb-4"}," Contributing partners ",-1)])),title:a(()=>e[1]||(e[1]=[m(" Contributing partners ")])),subtitle:a(()=>e[2]||(e[2]=[m(" Partners that matched this loan ")])),default:a(()=>[(o(!0),l(M,null,P(_.simultaneousMatching,t=>(o(),l("div",{key:t.managedAccountId,class:"tw-flex tw-items-center tw-mb-4 last:tw-mb-0"},[I((o(),x(A(t.partnerContentfulPage?"a":"div"),{href:t.partnerContentfulPage?`/impact-dashboard/${t.partnerContentfulPage}`:void 0,class:"tw-flex-none tw-w-12 tw-h-12 tw-rounded-full tw-overflow-hidden tw-shadow tw-mr-2"},{default:a(()=>{var u,p;return[d(b,{class:"tw-w-full tw-h-full","lender-name":t.displayName||"Anonymous","lender-image-url":((u=t.avatar)==null?void 0:u.url)||((p=t.logo)==null?void 0:p.url)||""},null,8,["lender-name","lender-image-url"])]},void 0,!0),_:2},1032,["href"])),[[w,t.partnerContentfulPage?["borrower-profile","click","contributing-partner-avatar",t.partnerContentfulPage]:void 0]]),r("div",null,[r("p",S,c(t.ratio)+":1 MATCHING ",1),r("p",q,c(i.getDisplayName(t)),1)])]))),128))],void 0),_:1},8,["collapsible"])])):D("",!0)}const j=B(g,[["render",$]]);g.__docgenInfo={displayName:"ContributingPartners",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"collapsible",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/ContributingPartners.vue"]};j.preFetchOperations=[...N];export{j as _};
