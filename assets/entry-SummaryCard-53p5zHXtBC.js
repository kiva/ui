import{g as F}from"./entry-index-CWclSTHHJk.js";import{_ as D,x as T,n as V,C as j}from"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import{H as K}from"./entry-heart-comment-CzjCck_HPB.js";import{c as g,a as m,d as r,b as A,f as w,g as y,F as B,e as I,j as P,t as _,E,h as a,K as Z,o as i}from"./entry-vue.esm-bundler-B52OYB4W0G.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import{V as O}from"./entry-KvIconButton-B_5CFf3JS2.js";import"./entry-numeral-xVHG5DEP0A.js";import{b as R}from"./entry-KvTextLink-C1IR_OG8XM.js";import{i as z}from"./entry-loanUtils-D_zTGanKUU.js";import{B as U}from"./entry-BorrowerImage-2godQmxmcR.js";import{S as H,B as Q}from"./entry-SummaryTag-CQOsfgLtHU.js";import{L as W}from"./entry-LoanProgress-ncvHoFD7g4.js";import{L as X}from"./entry-LoanBookmark-Mb1Rzg423-.js";import{_ as Y}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const G=F`fragment summaryCardFields on LoanBasic {
	id
	image {
		id
		hash
	}
	name
	status
	delinquent
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
`,q={name:"SummaryCard",inject:{apollo:{from:"apollo"},cookieStore:{from:"cookieStore"},openDefinition:{from:"openDefinition",default:()=>()=>{}}},components:{BorrowerImage:U,BorrowerName:Q,KvIconButton:O,KvMaterialIcon:T,KvTextLink:R,LoanProgress:W,SummaryTag:H,LoanBookmark:X,KvLoadingPlaceholder:D,HeartComment:K},props:{loan:{type:Object,default:()=>({})},isLoggedIn:{type:Boolean,default:!1}},data(){var t,l,f,o,n,d,u,c,s,b,p,v,k,L,x,h,C,N,M,S;const e=!!((t=this.loan)!=null&&t.id);return{isLoading:!e,activityName:((f=(l=this.loan)==null?void 0:l.activity)==null?void 0:f.name)??"",countryName:((d=(n=(o=this.loan)==null?void 0:o.geocode)==null?void 0:n.country)==null?void 0:d.name)??"",fundraisingPercent:e?((u=this.loan)==null?void 0:u.fundraisingPercent)??0:0,mdiMapMarker:j,mdiInformationOutline:V,timeLeft:((c=this.loan)==null?void 0:c.fundraisingTimeLeft)??"",unreservedAmount:((s=this.loan)==null?void 0:s.unreservedAmount)??"0",distributionModel:((b=this.loan)==null?void 0:b.distributionModel)??"",city:((v=(p=this.loan)==null?void 0:p.geocode)==null?void 0:v.city)??"",state:((L=(k=this.loan)==null?void 0:k.geocode)==null?void 0:L.state)??"",inPfp:z(this.loan),pfpMinLenders:((x=this.loan)==null?void 0:x.pfpMinLenders)??0,numLenders:((C=(h=this.loan)==null?void 0:h.lenders)==null?void 0:C.totalCount)??0,totalComments:((M=(N=this.loan)==null?void 0:N.comments)==null?void 0:M.totalCount)??0,paidAmount:((S=this.loan)==null?void 0:S.paidAmount)??"0.00"}},computed:{loanId(){var e;return((e=this.loan)==null?void 0:e.id)??0},hash(){var e,t;return((t=(e=this.loan)==null?void 0:e.image)==null?void 0:t.hash)??""},name(){var e;return((e=this.loan)==null?void 0:e.name)??""},status(){var e;return((e=this.loan)==null?void 0:e.status)??""},delinquent(){var e;return((e=this.loan)==null?void 0:e.delinquent)??!1},use(){var e;return((e=this.loan)==null?void 0:e.fullLoanUse)??""},anonymizationLevel(){var e;return((e=this.loan)==null?void 0:e.anonymizationLevel)??""},loanAmountNumber(){var e;return parseFloat(((e=this.loan)==null?void 0:e.loanAmount)??"0")},effectiveProgressPercent(){return this.status==="payingBack"?this.loanAmountNumber>0?Math.min(parseFloat(this.paidAmount)/this.loanAmountNumber,1):0:this.fundraisingPercent},moneyLeft(){return this.status==="payingBack"?Math.max(this.loanAmountNumber-parseFloat(this.paidAmount),0).toFixed(2):this.unreservedAmount},formattedLocation(){return this.distributionModel==="direct"?`${this.city}, ${this.state}, ${this.countryName}`:this.countryName==="Puerto Rico"?`${this.city}, PR`:this.countryName}},watch:{loanId(e,t){e&&e!==t&&(this.isLoading=!0)}},apollo:{query:J,preFetch:!1,variables(){return{loanId:this.loanId}},result({data:e}){var l,f,o,n,d,u,c,s;const t=(l=e==null?void 0:e.lend)==null?void 0:l.loan;this.$kvTrackEvent("Borrower profile","borrower profile status",t==null?void 0:t.status),this.inPfp=z(t),this.pfpMinLenders=(t==null?void 0:t.pfpMinLenders)??0,this.numLenders=((f=t==null?void 0:t.lenders)==null?void 0:f.totalCount)??0,this.activityName=((o=t==null?void 0:t.activity)==null?void 0:o.name)??"",this.countryName=((d=(n=t==null?void 0:t.geocode)==null?void 0:n.country)==null?void 0:d.name)??"",this.fundraisingPercent=(t==null?void 0:t.fundraisingPercent)??0,this.timeLeft=(t==null?void 0:t.fundraisingTimeLeft)??"",this.unreservedAmount=(t==null?void 0:t.unreservedAmount)??"0",this.distributionModel=(t==null?void 0:t.distributionModel)??"",this.city=((u=t==null?void 0:t.geocode)==null?void 0:u.city)??"",this.state=((c=t==null?void 0:t.geocode)==null?void 0:c.state)??"",this.unreservedAmount==="0"&&(this.fundraisingPercent=1),this.totalComments=((s=t==null?void 0:t.comments)==null?void 0:s.totalCount)??0,this.paidAmount=(t==null?void 0:t.paidAmount)??"0.00",this.isLoading=!1}}},$={class:"tw-pb-0 md:tw-bg-primary md:tw-pb-2.5 tw-py-2.5 md:tw-p-3 lg:tw-p-4 md:tw-rounded-t lg:tw-rounded"},tt={class:"tw-flex"},et={class:"tw-flex-none tw-w-8 tw-h-8 tw-mr-1.5 tw-mb-1.5 md:tw-w-9 md:tw-h-9 md:tw-mr-3 md:tw-mb-3 lg:tw-w-10 lg:tw-h-10 lg:tw-mr-4 lg:tw-mb-4"},nt={class:"tw-flex-auto"},ot={class:"tw-flex tw-items-center tw-mb-0.5"},it={key:0,class:"tw-flex tw-flex-wrap tw-mb-3"},st={key:0,href:"#bp-comments-jump-link",class:"tw-inline-block tw-text-black hover:tw-text-black"},at={class:"tw-flex-1"},rt={class:"tw-flex-none tw-w-full tw-mb-2 tw-text-headline","data-testid":"bp-summary-loan-use"},mt={class:"tw-flex-auto tw-inline-flex tw-w-full"},lt={class:"tw-flex-1","data-testid":"bp-summary-country-tag"};function dt(e,t,l,f,o,n){const d=a("borrower-image"),u=a("borrower-name"),c=a("kv-icon-button"),s=a("kv-loading-placeholder"),b=a("heart-comment"),p=a("summary-tag"),v=a("loan-progress"),k=a("kv-text-link"),L=a("kv-material-icon"),x=a("loan-bookmark"),h=Z("kv-track-event");return i(),g("section",$,[m("div",tt,[m("div",et,[r(d,{"data-testid":"bp-summary-image",class:"tw-w-full tw-rounded-full tw-bg-brand",alt:n.name,"aspect-ratio":1,"default-image":{width:80,faceZoom:50},hash:n.hash,images:[{width:80,faceZoom:50,viewSize:1024},{width:72,faceZoom:50,viewSize:734},{width:64,faceZoom:50}]},null,8,["alt","hash"])]),m("div",nt,[m("div",ot,[r(u,{"data-testid":"bp-summary-borrower-name",name:n.name},null,8,["name"]),n.anonymizationLevel==="pii"?A((i(),w(c,{key:0,icon:o.mdiInformationOutline,size:"small",class:"tw-ml-0.5 tw-shrink-0 tw--my-2 tw-text-secondary","data-testid":"bp-summary-pii-info","aria-label":"Why is this borrower anonymous?",onClick:t[0]||(t[0]=C=>n.openDefinition({cid:"bp-def-anonymized-loan",sfid:"501US00000NRTYa"}))},null,8,["icon"])),[[h,["Borrower profile","click-PII-anonymization-info","PII anonymization",n.loanId]]]):y("",!0)]),o.isLoading?(i(),g("div",it,[r(s,{class:"tw-mb-1 tw-h-2"}),r(s,{class:"tw-h-5.5",style:{width:"30%"}}),r(s,{class:"tw-h-5.5 tw-ml-auto",style:{width:"30%"}})])):(i(),g(B,{key:1},[o.totalComments>0?A((i(),g("a",st,[r(p,{class:"hover:tw-bg-brand-200 tw-mr-0","background-color":"tw-bg-brand-100"},{default:I(()=>[r(b,{class:"tw-h-3 tw-w-3 tw-mr-0.5 heart-svg"}),m("span",at,_(o.totalComments)+" Comment"+_(o.totalComments>1?"s":""),1)],void 0),_:1})])),[[h,["borrower-profile","click","jump-link","comments-pill"]]]):y("",!0),r(v,{"data-testid":"bp-summary-progress",class:"tw-mb-2 tw-mt-1.5","money-left":n.moneyLeft,"progress-percent":n.effectiveProgressPercent,"time-left":o.timeLeft,"loan-status":o.inPfp?"pfp":n.status,"is-delinquent":n.delinquent,"number-of-lenders":o.numLenders,"pfp-min-lenders":o.pfpMinLenders,loading:o.isLoading,"hide-view-profile-links":!0},null,8,["money-left","progress-percent","time-left","loan-status","is-delinquent","number-of-lenders","pfp-min-lenders","loading"])],64))])]),m("p",rt,[P(_(n.use)+" ",1),n.anonymizationLevel==="full"?A((i(),w(k,{key:0,"data-testid":"bp-summary-anonymous-learn-more",onClick:t[1]||(t[1]=C=>n.openDefinition({cid:"bp-def-anonymous-description",sfid:"50150000000SXVz"}))},{default:I(()=>t[2]||(t[2]=[P(" Learn more ")]),void 0),_:1,__:[2]})),[[h,["Borrower profile","click-anonymous-loan-use-info","Anonymous loan use",n.loanId]]]):y("",!0)]),m("div",mt,[o.isLoading?(i(),w(s,{key:0,class:"tw-h-4",style:{width:"50%"}})):(i(),g(B,{key:1},[o.countryName?(i(),w(p,{key:0},{default:I(()=>[r(L,{class:"tw-h-2.5 tw-w-2.5 tw-mr-0.5 tw-shrink-0",icon:o.mdiMapMarker},null,8,["icon"]),m("span",lt,_(n.formattedLocation),1)],void 0),_:1})):y("",!0),o.activityName?(i(),w(p,{key:1,"data-testid":"bp-summary-activity-tag"},{default:I(()=>[P(_(o.activityName),1)],void 0),_:1})):y("",!0)],64)),l.isLoggedIn?(i(),w(x,{key:2,"loan-id":n.loanId,class:"tw-hidden lg:tw-inline-flex tw-ml-auto tw-items-center","data-testid":"bp-summary-bookmark"},null,8,["loan-id"])):y("",!0)]),E(e.$slots,"sharebutton",{},void 0,!0)])}const Ct=Y(q,[["render",dt],["__scopeId","data-v-bf9ad979"]]);q.__docgenInfo={displayName:"SummaryCard",exportName:"default",description:"",tags:{},props:[{name:"loan",type:{name:"object"},defaultValue:{func:!1,value:"{}"}},{name:"isLoggedIn",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],slots:[{name:"sharebutton"}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/SummaryCard.vue"]};export{Ct as S,G as s};
