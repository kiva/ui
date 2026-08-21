import{g as F}from"./entry-index-CWclSTHHJk.js";import{_ as D,x as T,n as E,C as V}from"./entry-KvWwwHeaderBasic-BB16oz4SiS.js";import{H as j}from"./entry-heart-comment-B6aZxZ_wRo.js";import{c as g,a as m,d as r,b as A,f as w,g as y,F as B,e as I,j as P,t as _,E as K,h as a,L as Z,o as i}from"./entry-vue.esm-bundler-D8yP9bVmC4.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import{V as O}from"./entry-KvIconButton-CdCW7xU74E.js";import"./entry-numeral-xVHG5DEP0A.js";import{b as R}from"./entry-KvTextLink-lPIxsG65ya.js";import{i as z}from"./entry-loanUtils-Dh5pODnjhO.js";import{B as U}from"./entry-BorrowerImage-CbPcvs9VP5.js";import{S as H,B as Q}from"./entry-SummaryTag-mOPMKj5tW5.js";import{L as W}from"./entry-LoanProgress-CuN5ok6BYw.js";import{L as X}from"./entry-LoanBookmark-B-mBpccC3L.js";import{_ as Y}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const G=F`fragment summaryCardFields on LoanBasic {
	id
	image {
		id
		hash
	}
	name
	status
	delinquent
	hasCurrencyExchangeLossLenders
	use
	anonymizationLevel
	borrowerCount
	loanAmount
	fullLoanUse @client
	activity {
		id
		name
	}
	distributionModel
	fundraisingPercent @client
	fundraisingTimeLeft @client
	fundraisingTimeLeftMilliseconds @client
	geocode {
		city
		state
		country {
			id
			name
		}
	}
	paidAmount
	loanFundraisingInfo {
		id
		fundedAmount
		reservedAmount
	}
	plannedExpirationDate
	unreservedAmount @client
	inPfp
	pfpMinLenders
	lenders {
		totalCount
	}
	comments {
		totalCount
	}
}`,J=F`
	query summaryCard($loanId: Int!) {
		lend {
			loan(id: $loanId) {
				id
				...summaryCardFields
			}
		}
	}
	${G}
`,q={name:"SummaryCard",inject:{apollo:{from:"apollo"},cookieStore:{from:"cookieStore"},openDefinition:{from:"openDefinition",default:()=>()=>{}}},components:{BorrowerImage:U,BorrowerName:Q,KvIconButton:O,KvMaterialIcon:T,KvTextLink:R,LoanProgress:W,SummaryTag:H,LoanBookmark:X,KvLoadingPlaceholder:D,HeartComment:j},props:{loan:{type:Object,default:()=>({})},isLoggedIn:{type:Boolean,default:!1}},data(){var e,l,f,o,n,d,u,c,s,b,h,v,k,L,x,p,C,N,M,S;const t=!!((e=this.loan)!=null&&e.id);return{isLoading:!t,activityName:((f=(l=this.loan)==null?void 0:l.activity)==null?void 0:f.name)??"",countryName:((d=(n=(o=this.loan)==null?void 0:o.geocode)==null?void 0:n.country)==null?void 0:d.name)??"",fundraisingPercent:t?((u=this.loan)==null?void 0:u.fundraisingPercent)??0:0,mdiMapMarker:V,mdiInformationOutline:E,timeLeft:((c=this.loan)==null?void 0:c.fundraisingTimeLeft)??"",unreservedAmount:((s=this.loan)==null?void 0:s.unreservedAmount)??"0",distributionModel:((b=this.loan)==null?void 0:b.distributionModel)??"",city:((v=(h=this.loan)==null?void 0:h.geocode)==null?void 0:v.city)??"",state:((L=(k=this.loan)==null?void 0:k.geocode)==null?void 0:L.state)??"",inPfp:z(this.loan),pfpMinLenders:((x=this.loan)==null?void 0:x.pfpMinLenders)??0,numLenders:((C=(p=this.loan)==null?void 0:p.lenders)==null?void 0:C.totalCount)??0,totalComments:((M=(N=this.loan)==null?void 0:N.comments)==null?void 0:M.totalCount)??0,paidAmount:((S=this.loan)==null?void 0:S.paidAmount)??"0.00"}},computed:{loanId(){var t;return((t=this.loan)==null?void 0:t.id)??0},hash(){var t,e;return((e=(t=this.loan)==null?void 0:t.image)==null?void 0:e.hash)??""},name(){var t;return((t=this.loan)==null?void 0:t.name)??""},status(){var t;return((t=this.loan)==null?void 0:t.status)??""},delinquent(){var t;return((t=this.loan)==null?void 0:t.delinquent)??!1},hasCurrencyExchangeLoss(){var t;return((t=this.loan)==null?void 0:t.hasCurrencyExchangeLossLenders)??!1},use(){var t;return((t=this.loan)==null?void 0:t.fullLoanUse)??""},anonymizationLevel(){var t;return((t=this.loan)==null?void 0:t.anonymizationLevel)??""},loanAmountNumber(){var t;return parseFloat(((t=this.loan)==null?void 0:t.loanAmount)??"0")},effectiveProgressPercent(){return this.status==="payingBack"?this.loanAmountNumber>0?Math.min(parseFloat(this.paidAmount)/this.loanAmountNumber,1):0:this.fundraisingPercent},moneyLeft(){return this.status==="payingBack"?Math.max(this.loanAmountNumber-parseFloat(this.paidAmount),0).toFixed(2):this.unreservedAmount},formattedLocation(){return this.distributionModel==="direct"?`${this.city}, ${this.state}, ${this.countryName}`:this.countryName==="Puerto Rico"?`${this.city}, PR`:this.countryName}},watch:{loanId(t,e){t&&t!==e&&(this.isLoading=!0)}},apollo:{query:J,preFetch:!1,variables(){return{loanId:this.loanId}},result({data:t}){var l,f,o,n,d,u,c,s;const e=(l=t==null?void 0:t.lend)==null?void 0:l.loan;this.$kvTrackEvent("Borrower profile","borrower profile status",e==null?void 0:e.status),this.inPfp=z(e),this.pfpMinLenders=(e==null?void 0:e.pfpMinLenders)??0,this.numLenders=((f=e==null?void 0:e.lenders)==null?void 0:f.totalCount)??0,this.activityName=((o=e==null?void 0:e.activity)==null?void 0:o.name)??"",this.countryName=((d=(n=e==null?void 0:e.geocode)==null?void 0:n.country)==null?void 0:d.name)??"",this.fundraisingPercent=(e==null?void 0:e.fundraisingPercent)??0,this.timeLeft=(e==null?void 0:e.fundraisingTimeLeft)??"",this.unreservedAmount=(e==null?void 0:e.unreservedAmount)??"0",this.distributionModel=(e==null?void 0:e.distributionModel)??"",this.city=((u=e==null?void 0:e.geocode)==null?void 0:u.city)??"",this.state=((c=e==null?void 0:e.geocode)==null?void 0:c.state)??"",this.unreservedAmount==="0"&&(this.fundraisingPercent=1),this.totalComments=((s=e==null?void 0:e.comments)==null?void 0:s.totalCount)??0,this.paidAmount=(e==null?void 0:e.paidAmount)??"0.00",this.isLoading=!1}}},$={class:"tw-pb-0 md:tw-bg-primary md:tw-pb-2.5 tw-py-2.5 md:tw-p-3 lg:tw-p-4 md:tw-rounded-t lg:tw-rounded"},ee={class:"tw-flex"},te={class:"tw-flex-none tw-w-8 tw-h-8 tw-mr-1.5 tw-mb-1.5 md:tw-w-9 md:tw-h-9 md:tw-mr-3 md:tw-mb-3 lg:tw-w-10 lg:tw-h-10 lg:tw-mr-4 lg:tw-mb-4"},ne={class:"tw-flex-auto"},oe={class:"tw-flex tw-items-center tw-mb-0.5"},ie={key:0,class:"tw-flex tw-flex-wrap tw-mb-3"},se={key:0,href:"#bp-comments-jump-link",class:"tw-inline-block tw-text-black hover:tw-text-black"},ae={class:"tw-flex-1"},re={class:"tw-flex-none tw-w-full tw-mb-2 tw-text-headline","data-testid":"bp-summary-loan-use"},me={class:"tw-flex-auto tw-inline-flex tw-w-full"},le={class:"tw-flex-1","data-testid":"bp-summary-country-tag"};function de(t,e,l,f,o,n){const d=a("borrower-image"),u=a("borrower-name"),c=a("kv-icon-button"),s=a("kv-loading-placeholder"),b=a("heart-comment"),h=a("summary-tag"),v=a("loan-progress"),k=a("kv-text-link"),L=a("kv-material-icon"),x=a("loan-bookmark"),p=Z("kv-track-event");return i(),g("section",$,[m("div",ee,[m("div",te,[r(d,{"data-testid":"bp-summary-image",class:"tw-w-full tw-rounded-full tw-bg-brand",alt:n.name,"aspect-ratio":1,"default-image":{width:80,faceZoom:50},hash:n.hash,images:[{width:80,faceZoom:50,viewSize:1024},{width:72,faceZoom:50,viewSize:734},{width:64,faceZoom:50}]},null,8,["alt","hash"])]),m("div",ne,[m("div",oe,[r(u,{"data-testid":"bp-summary-borrower-name",name:n.name},null,8,["name"]),n.anonymizationLevel==="pii"?A((i(),w(c,{key:0,icon:o.mdiInformationOutline,size:"small",class:"tw-ml-0.5 tw-shrink-0 tw--my-2 tw-text-secondary","data-testid":"bp-summary-pii-info","aria-label":"Why is this borrower anonymous?",onClick:e[0]||(e[0]=C=>n.openDefinition({cid:"bp-def-anonymized-loan",sfid:"501US00000NRTYa"}))},null,8,["icon"])),[[p,["Borrower profile","click-PII-anonymization-info","PII anonymization",n.loanId]]]):y("",!0)]),o.isLoading?(i(),g("div",ie,[r(s,{class:"tw-mb-1 tw-h-2"}),r(s,{class:"tw-h-5.5",style:{width:"30%"}}),r(s,{class:"tw-h-5.5 tw-ml-auto",style:{width:"30%"}})])):(i(),g(B,{key:1},[o.totalComments>0?A((i(),g("a",se,[r(h,{class:"hover:tw-bg-brand-200 tw-mr-0","background-color":"tw-bg-brand-100"},{default:I(()=>[r(b,{class:"tw-h-3 tw-w-3 tw-mr-0.5 heart-svg"}),m("span",ae,_(o.totalComments)+" Comment"+_(o.totalComments>1?"s":""),1)],void 0),_:1})])),[[p,["borrower-profile","click","jump-link","comments-pill"]]]):y("",!0),r(v,{"data-testid":"bp-summary-progress",class:"tw-mb-2 tw-mt-1.5","money-left":n.moneyLeft,"progress-percent":n.effectiveProgressPercent,"time-left":o.timeLeft,"loan-status":o.inPfp?"pfp":n.status,"is-delinquent":n.delinquent,"has-currency-exchange-loss":n.hasCurrencyExchangeLoss,"number-of-lenders":o.numLenders,"pfp-min-lenders":o.pfpMinLenders,loading:o.isLoading,"hide-view-profile-links":!0},null,8,["money-left","progress-percent","time-left","loan-status","is-delinquent","has-currency-exchange-loss","number-of-lenders","pfp-min-lenders","loading"])],64))])]),m("p",re,[P(_(n.use)+" ",1),n.anonymizationLevel==="full"?A((i(),w(k,{key:0,"data-testid":"bp-summary-anonymous-learn-more",onClick:e[1]||(e[1]=C=>n.openDefinition({cid:"bp-def-anonymous-description",sfid:"50150000000SXVz"}))},{default:I(()=>e[2]||(e[2]=[P(" Learn more ")]),void 0),_:1,__:[2]})),[[p,["Borrower profile","click-anonymous-loan-use-info","Anonymous loan use",n.loanId]]]):y("",!0)]),m("div",me,[o.isLoading?(i(),w(s,{key:0,class:"tw-h-4",style:{width:"50%"}})):(i(),g(B,{key:1},[o.countryName?(i(),w(h,{key:0},{default:I(()=>[r(L,{class:"tw-h-2.5 tw-w-2.5 tw-mr-0.5 tw-shrink-0",icon:o.mdiMapMarker},null,8,["icon"]),m("span",le,_(n.formattedLocation),1)],void 0),_:1})):y("",!0),o.activityName?(i(),w(h,{key:1,"data-testid":"bp-summary-activity-tag"},{default:I(()=>[P(_(o.activityName),1)],void 0),_:1})):y("",!0)],64)),l.isLoggedIn?(i(),w(x,{key:2,"loan-id":n.loanId,class:"tw-hidden lg:tw-inline-flex tw-ml-auto tw-items-center","data-testid":"bp-summary-bookmark"},null,8,["loan-id"])):y("",!0)]),K(t.$slots,"sharebutton",{},void 0,!0)])}const Ce=Y(q,[["render",de],["__scopeId","data-v-982e1c5d"]]);q.__docgenInfo={displayName:"SummaryCard",exportName:"default",description:"",tags:{},props:[{name:"loan",type:{name:"object"},defaultValue:{func:!1,value:"{}"}},{name:"isLoggedIn",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],slots:[{name:"sharebutton"}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/SummaryCard.vue"]};export{Ce as S,G as s};
