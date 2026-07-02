import{g as I}from"./entry-index-CWclSTHHJk.js";import{L as D,x,_ as T,$ as F,Q as j}from"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import{H as q}from"./entry-heart-comment-CXj1LlOS96.js";import{p as K,v as E,c as p,b as d,a,I as v,o as r,k,e as f,g as w,F as C,f as g,h as L,t as h,E as U,r as s,j as Z}from"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-numeral-xVHG5DEP0A.js";import{b as Q}from"./entry-KvTextLink-BLbKD4J9hR.js";import{u as R}from"./entry-useBorrowerProfileDefinitions-DpuIaypFhk.js";import{B as H}from"./entry-BorrowerImage-O1dzUA2si4.js";import{S as O,B as W}from"./entry-SummaryTag-5LAr0GP2EM.js";import{C as X}from"./entry-ContentLightbox-DfYxePwSr9.js";import{L as Y}from"./entry-LoanProgress-BYJ4GKIK7w.js";import{L as G}from"./entry-LoanBookmark-DVCHnloox2.js";import{_ as J}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const $=["disabled","aria-pressed"],tt=K({__name:"KvIconButton",props:{icon:{type:String,default:D},size:{type:String,default:"large",validator(e){return["small","medium","large"].includes(e)}},showBorder:{type:Boolean,default:!1},borderColor:{type:String,default:"tertiary",validator(e){return["primary","secondary","tertiary"].includes(e)}},showBackground:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},toggleable:{type:Boolean,default:!1},modelValue:{type:Boolean,default:!1},activeIcon:{type:String,default:""}},emits:["click","update:modelValue"],setup(e,{emit:t}){const n=e,l=t,o=m=>{n.disabled||(n.toggleable&&l("update:modelValue",!n.modelValue),l("click",m))},i=E(()=>n.toggleable&&n.modelValue&&n.activeIcon?n.activeIcon:n.icon);return(m,c)=>(r(),p("button",{type:"button",disabled:e.disabled,"aria-pressed":e.toggleable?e.modelValue:void 0,class:v(["tw-flex tw-items-center tw-justify-center tw-min-w-5.5 tw-min-h-5.5 tw-bg-transparent",{"tw-opacity-low tw-cursor-default":e.disabled}]),onClick:o},[d("span",{class:v(["tw-flex tw-items-center tw-justify-center tw-transition-colors tw-duration-200 tw-rounded-full",{"tw-w-4 tw-h-4":e.size==="small","tw-w-5 tw-h-5":e.size==="medium","tw-w-6 tw-h-6":e.size==="large","tw-bg-white hover:tw-bg-gray-100 active:tw-bg-gray-200":e.showBackground,"tw-border":e.showBorder,"tw-border-primary":e.showBorder&&e.borderColor==="primary","tw-border-secondary":e.showBorder&&e.borderColor==="secondary","tw-border-tertiary":e.showBorder&&e.borderColor==="tertiary"}])},[a(x,{icon:i.value,class:v({"tw-w-2.5 tw-h-2.5":e.size==="small"})},null,8,["icon","class"])],2)],10,$))}}),et=I`
	query summaryCard($loanId: Int!) {
		lend {
			loan(id: $loanId) {
				id
				image {
					id
					hash
				}
				name
				status
				use
				# for fullLoanUse
				anonymizationLevel
				borrowerCount
				loanAmount
				fullLoanUse @client
			}
		}
		my {
			id
			userAccount {
				id
			}
		}
	}
`,ot=I`
	query summaryCard($loanId: Int!) {
		lend {
			loan(id: $loanId) {
				id
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
				loanAmount
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
			}
		}
	}
`,B={name:"SummaryCard",inject:["apollo","cookieStore"],components:{BorrowerImage:H,BorrowerName:W,ContentLightbox:X,KvIconButton:tt,KvMaterialIcon:x,KvTextLink:Q,LoanProgress:Y,SummaryTag:O,LoanBookmark:G,KvLoadingPlaceholder:T,HeartComment:q},created(){this.definitions=R(this.apollo)},data(){return{isLoading:!0,isLoggedIn:!1,anonymizationLevel:"",activityName:"",countryName:"",fundraisingPercent:0,hash:"",mdiMapMarker:j,mdiInformationOutline:F,name:"",status:"",timeLeft:"",unreservedAmount:"0",use:"",distributionModel:"",city:"",state:"",inPfp:!1,pfpMinLenders:0,numLenders:0,totalComments:0}},computed:{loanId(){var e,t;return Number(((t=(e=this.$route)==null?void 0:e.params)==null?void 0:t.id)??0)},formattedLocation(){return this.distributionModel==="direct"?`${this.city}, ${this.state}, ${this.countryName}`:this.countryName==="Puerto Rico"?`${this.city}, PR`:this.countryName}},methods:{async fetchSummaryCardData(){var n,l,o,i,m,c,y,u;this.$kvTrackEvent("Borrower profile","borrower profile status",this.status);const{data:e}=await this.apollo.query({query:ot,variables:{loanId:this.loanId}}),t=(n=e==null?void 0:e.lend)==null?void 0:n.loan;this.inPfp=(t==null?void 0:t.inPfp)??!1,this.pfpMinLenders=(t==null?void 0:t.pfpMinLenders)??0,this.numLenders=((l=t==null?void 0:t.lenders)==null?void 0:l.totalCount)??0,this.activityName=((o=t==null?void 0:t.activity)==null?void 0:o.name)??"",this.countryName=((m=(i=t==null?void 0:t.geocode)==null?void 0:i.country)==null?void 0:m.name)??"",this.fundraisingPercent=(t==null?void 0:t.fundraisingPercent)??0,this.timeLeft=(t==null?void 0:t.fundraisingTimeLeft)??"",this.unreservedAmount=(t==null?void 0:t.unreservedAmount)??"0",this.distributionModel=(t==null?void 0:t.distributionModel)??"",this.city=((c=t==null?void 0:t.geocode)==null?void 0:c.city)??"",this.state=((y=t==null?void 0:t.geocode)==null?void 0:y.state)??"",this.unreservedAmount==="0"&&(this.fundraisingPercent=1),this.totalComments=((u=t==null?void 0:t.comments)==null?void 0:u.totalCount)??0,this.isLoading=!1},async showDefinition({cid:e,sfid:t}){const n=await this.definitions.resolveDefinition({cid:e,sfid:t});n&&this.$refs.lightbox.open(n)}},mounted(){this.fetchSummaryCardData()},watch:{"$route.params.id":{handler(){this.isLoading=!0,this.fetchSummaryCardData()}}},apollo:{query:et,preFetch:!0,preFetchVariables({route:e}){var t;return{loanId:Number(((t=e==null?void 0:e.params)==null?void 0:t.id)??0)}},variables(){return{loanId:this.loanId}},result(e){var n,l,o,i,m,c;const t=(l=(n=e==null?void 0:e.data)==null?void 0:n.lend)==null?void 0:l.loan;this.isLoggedIn=((m=(i=(o=e==null?void 0:e.data)==null?void 0:o.my)==null?void 0:i.userAccount)==null?void 0:m.id)!==void 0||!1,this.hash=((c=t==null?void 0:t.image)==null?void 0:c.hash)??"",this.name=(t==null?void 0:t.name)??"",this.status=(t==null?void 0:t.status)??"",this.use=(t==null?void 0:t.fullLoanUse)??"",this.anonymizationLevel=(t==null?void 0:t.anonymizationLevel)??""}}},nt={class:"tw-pb-0 md:tw-bg-primary md:tw-pb-2.5 tw-py-2.5 md:tw-p-3 lg:tw-p-4 md:tw-rounded-t lg:tw-rounded"},it={class:"tw-flex"},rt={class:"tw-flex-none tw-w-8 tw-h-8 tw-mr-1.5 tw-mb-1.5 md:tw-w-9 md:tw-h-9 md:tw-mr-3 md:tw-mb-3 lg:tw-w-10 lg:tw-h-10 lg:tw-mr-4 lg:tw-mb-4"},st={class:"tw-flex-auto"},at={class:"tw-flex tw-items-center tw-mb-0.5"},mt={key:0,class:"tw-flex tw-flex-wrap tw-mb-3"},lt={key:0,href:"#bp-comments-jump-link",class:"tw-inline-block tw-text-black hover:tw-text-black"},dt={class:"tw-flex-1"},ct={class:"tw-flex-none tw-w-full tw-mb-2 tw-text-headline","data-testid":"bp-summary-loan-use"},ut={class:"tw-flex-auto tw-inline-flex tw-w-full"},ft={class:"tw-flex-1","data-testid":"bp-summary-country-tag"};function wt(e,t,n,l,o,i){const m=s("borrower-image"),c=s("borrower-name"),y=s("kv-icon-button"),u=s("kv-loading-placeholder"),S=s("heart-comment"),b=s("summary-tag"),N=s("loan-progress"),z=s("kv-text-link"),P=s("kv-material-icon"),M=s("loan-bookmark"),V=s("content-lightbox"),_=Z("kv-track-event");return r(),p("section",nt,[d("div",it,[d("div",rt,[a(m,{"data-testid":"bp-summary-image",class:"tw-w-full tw-rounded-full tw-bg-brand",alt:o.name,"aspect-ratio":1,"default-image":{width:80,faceZoom:50},hash:o.hash,images:[{width:80,faceZoom:50,viewSize:1024},{width:72,faceZoom:50,viewSize:734},{width:64,faceZoom:50}]},null,8,["alt","hash"])]),d("div",st,[d("div",at,[a(c,{"data-testid":"bp-summary-borrower-name",name:o.name},null,8,["name"]),o.anonymizationLevel==="pii"?k((r(),f(y,{key:0,icon:o.mdiInformationOutline,size:"small",class:"tw-ml-0.5 tw-shrink-0 tw--my-2 tw-text-secondary","data-testid":"bp-summary-pii-info","aria-label":"Why is this borrower anonymous?",onClick:t[0]||(t[0]=A=>i.showDefinition({cid:"bp-def-anonymized-loan",sfid:"501US00000NRTYa"}))},null,8,["icon"])),[[_,["Borrower profile","click-PII-anonymization-info","PII anonymization",i.loanId]]]):w("",!0)]),o.isLoading?(r(),p("div",mt,[a(u,{class:"tw-mb-1",style:{height:"0.5rem"}}),a(u,{style:{height:"2.8rem",width:"30%"}}),a(u,{style:{height:"2.8rem",width:"30%","margin-left":"auto"}})])):(r(),p(C,{key:1},[o.totalComments>0?k((r(),p("a",lt,[a(b,{class:"hover:tw-bg-brand-200 tw-mr-0","background-color":"tw-bg-brand-100"},{default:g(()=>[a(S,{class:"tw-h-3 tw-w-3 tw-mr-0.5 heart-svg"}),d("span",dt,h(o.totalComments)+" Comment"+h(o.totalComments>1?"s":""),1)],void 0),_:1})])),[[_,["borrower-profile","click","jump-link","comments-pill"]]]):w("",!0),a(N,{"data-testid":"bp-summary-progress",class:"tw-mb-2 tw-mt-1.5","money-left":o.unreservedAmount,"progress-percent":o.fundraisingPercent,"time-left":o.timeLeft,"loan-status":o.inPfp?"pfp":"fundraising","number-of-lenders":o.numLenders,"pfp-min-lenders":o.pfpMinLenders,loading:o.isLoading},null,8,["money-left","progress-percent","time-left","loan-status","number-of-lenders","pfp-min-lenders","loading"])],64))])]),d("p",ct,[L(h(o.use)+" ",1),o.anonymizationLevel==="full"?k((r(),f(z,{key:0,"data-testid":"bp-summary-anonymous-learn-more",onClick:t[1]||(t[1]=A=>i.showDefinition({cid:"bp-def-anonymous-description",sfid:"50150000000SXVz"}))},{default:g(()=>t[2]||(t[2]=[L(" Learn more ")]),void 0),_:1,__:[2]})),[[_,["Borrower profile","click-anonymous-loan-use-info","Anonymous loan use",i.loanId]]]):w("",!0)]),d("div",ut,[o.isLoading?(r(),f(u,{key:0,style:{height:"1.9rem",width:"50%"}})):(r(),p(C,{key:1},[o.countryName?(r(),f(b,{key:0},{default:g(()=>[a(P,{class:"tw-h-2.5 tw-w-2.5 tw-mr-0.5 tw-shrink-0",icon:o.mdiMapMarker},null,8,["icon"]),d("span",ft,h(i.formattedLocation),1)],void 0),_:1})):w("",!0),o.activityName?(r(),f(b,{key:1,"data-testid":"bp-summary-activity-tag"},{default:g(()=>[L(h(o.activityName),1)],void 0),_:1})):w("",!0)],64)),o.isLoggedIn?(r(),f(M,{key:2,"loan-id":i.loanId,class:"tw-hidden lg:tw-inline-flex tw-ml-auto tw-items-center","data-testid":"bp-summary-bookmark"},null,8,["loan-id"])):w("",!0)]),U(e.$slots,"sharebutton",{},void 0,!0),a(V,{ref:"lightbox"},null,512)])}const Nt=J(B,[["render",wt],["__scopeId","data-v-70e71369"]]);B.__docgenInfo={displayName:"SummaryCard",exportName:"default",description:"",tags:{},slots:[{name:"sharebutton"}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/SummaryCard.vue"]};export{Nt as S};
