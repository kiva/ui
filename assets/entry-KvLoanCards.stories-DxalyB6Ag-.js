import{b as ie,x as oe,_ as ae,F as ne}from"./entry-KvWwwHeaderBasic-BXEr46oeHh.js";import{g as Q}from"./entry-index-CWclSTHHJk.js";import{p as re}from"./entry-percent-raised-mixin-DA869t-Oxs.js";import{t as se}from"./entry-time-left-mixin-Da0n0H4KJu.js";import{B as le}from"./entry-BorrowerImage-DiILQYt3gu.js";import{S as de,B as ce}from"./entry-SummaryTag-Bs9Z4YXrQo.js";import{K as me}from"./entry-KvLoadingParagraph-B2fSmvMRzt.js";import{r as ue,w as pe}from"./entry-loanUtils-BXS_2y9zuz.js";import{c as he}from"./entry-observerUtils-DveHpw6JZJ.js";import{c as m,b as we,f as s,e as L,j as I,a as l,t as p,g as r,M as ge,h as d,o as n,d as k}from"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-numeral-xVHG5DEP0A.js";import{_ as ve}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{w as fe,a as ye}from"./entry-exports-CudK1O5XNw.js";import{a as h}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as w}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-B1d9Jrgq.js";import"./entry-getCacheKey-n-S9GzCBTJ.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-LoanStatusEnum-Cvai-0kFu9.js";const E=Q`
	fragment loanFields on LoanBasic {
		id
		distributionModel
		geocode {
			country {
				id
				name
			}
		}
		image {
			id
			hash
		}
		name
		use
		loanAmount
		loanFundraisingInfo {
			id
			fundedAmount
			reservedAmount
		}
		fundraisingPercent @client
		dedicationToKiva(publicId: $publicId)
		dedications(publicId: $publicId) {
			values {
				id
				recipientName
			}
		}
	}`,be=Q`
	${E}
	query welcomeLoanCard($loanId: Int!, $publicId: String!) {
		lend {
			loan(id: $loanId) {
				id
				...loanFields
			}
		}
	}`,z={name:"NewHomePageLoanCard",emits:["dedication-click"],props:{loanId:{type:Number,required:!0},lenderPublicId:{type:String,default:""}},inject:["apollo","cookieStore"],mixins:[re,se],components:{BorrowerImage:le,BorrowerName:ce,KvLoadingPlaceholder:ae,KvLoadingParagraph:me,KvMaterialIcon:oe,SummaryTag:de,KvProgressBar:ie},data(){return{loan:null,mdiMapMarker:ne,isLoading:!0,queryObserver:null,viewportObserver:null}},computed:{borrowerName(){var e;return((e=this.loan)==null?void 0:e.name)||""},countryISO(){var e,t,i;return((i=(t=(e=this.loan)==null?void 0:e.geocode)==null?void 0:t.country)==null?void 0:i.isoCode)||""},countryName(){var e,t,i;return((i=(t=(e=this.loan)==null?void 0:e.geocode)==null?void 0:t.country)==null?void 0:i.name)||""},distributionModel(){var e;return((e=this.loan)==null?void 0:e.distributionModel)||""},imageHash(){var e,t;return((t=(e=this.loan)==null?void 0:e.image)==null?void 0:t.hash)??""},loanUse(){var e,t,i;return((e=this.loan)==null?void 0:e.distributionModel)==="direct"?`Loan for ${(t=this.loan)==null?void 0:t.use}`:`Loan ${(i=this.loan)==null?void 0:i.use}`},fundraisingPercent(){var e,t;return(e=this.loan)!=null&&e.distributionModel?(((t=this.loan)==null?void 0:t.fundraisingPercent)??0)*100:0},unreservedAmount(){var e;return((e=this.loan)==null?void 0:e.unreservedAmount)??"0"},timeLeft(){var e;return((e=this.loan)==null?void 0:e.fundraisingTimeLeft)??""},allSharesReserved(){var e;return parseFloat((e=this.loan)==null?void 0:e.unreservedAmount)===0},inBorrowerProfilePage(){return this.$route.path.includes("funded")},loanAmount(){var e;return(e=this.loan)==null?void 0:e.loanAmount},dedications(){var i,c,o;const e=((c=(i=this.loan)==null?void 0:i.dedications)==null?void 0:c.values)??[];return(((o=this.loan)==null?void 0:o.dedicationToKiva)??!1)&&e.push({recipientName:"Kiva"}),e},dedicationsCopy(){return this.dedications.length>1?"Multiple recipients":this.dedications[0].recipientName}},methods:{createViewportObserver(){this.viewportObserver=he({targets:[this.$el],callback:e=>{e.forEach(t=>{t.target===this.$el&&t.intersectionRatio>0&&this.loadData()})}}),this.viewportObserver||this.loadData()},destroyViewportObserver(){this.viewportObserver&&this.viewportObserver.disconnect()},loadData(){this.queryObserver||(this.queryObserver=pe({apollo:this.apollo,loanId:this.loanId,publicId:this.lenderPublicId,loanCardQuery:be,callback:e=>this.processQueryResult(e)}))},processQueryResult(e){var t,i;if(e.error){this.$showTipMsg("There was a problem loading your loan recommendations","error");try{fe(c=>{c.setTag("wizard_stage","results"),c.setTag("loan_id",this.loanId),ye(e.error)})}catch{}}this.loan=((i=(t=e.data)==null?void 0:t.lend)==null?void 0:i.loan)||null,this.loan&&(this.isLoading=!1)},dedicationClickEvent(){this.$emit("dedication-click",{loanId:this.loanId,dedicationCopy:this.dedicationsCopy}),this.$router.push(`/dedication/${this.loanId}`)}},created(){const e=ue({apollo:this.apollo,loanId:this.loanId,publicId:this.lenderPublicId,fragment:E});e&&(this.loan=e,this.isLoading=!1)},mounted(){this.loan?this.loadData():this.createViewportObserver()},beforeUnmount(){this.destroyViewportObserver()},watch:{loanId(e){this.queryObserver&&this.queryObserver.setVariables({loanId:e,publicId:this.lenderPublicId})}}},_e=["id"],ke={key:1,class:"tw-relative"},xe={key:0},Se={key:5,class:"tw-text-left"},Le={class:"tw-m-0 tw-overflow-hidden tw-text-ellipsis tw-line-clamp-2 tw-text-md loan-use"},Ie={key:8,class:"tw-flex-auto tw-mb-2"},Ne={class:"tw-flex"},Me={class:"tw-flex-auto tw-text-left"},Pe={class:"tw-text-title tw-m-0 progress-text tw-mb-2 tw-mt-2","data-testid":"bp-summary-amount-to-go"},Ce={class:"tw-flex-auto tw-text-right progress-text tw-mb-2 tw-mt-2","data-testid":"bp-summary-timeleft"},Re={lass:"tw-text-h3 tw-block tw-m-0"},Oe={key:0};function De(e,t,i,c,o,a){const g=d("kv-loading-placeholder"),j=d("borrower-image"),G=d("kv-material-icon"),W=d("summary-tag"),X=d("borrower-name"),Y=d("kv-loading-paragraph"),Z=d("kv-progress-bar"),$=d("router-link"),ee=ge("kv-track-event");return n(),m("div",{class:"tw-flex tw-flex-col card-container selected-card tw-rounded-xs",id:`${i.loanId}-loan-card`},[we((n(),s($,{class:"link",is:a.allSharesReserved?"span":"router-link",to:`/lend/${i.loanId}`},{default:L(()=>[o.isLoading?(n(),s(g,{key:0,class:"tw-mb-1 tw-rounded",style:{width:"240px",height:"180px"}})):r("",!0),o.isLoading?r("",!0):(n(),m("div",ke,[k(j,{class:"tw-relative tw-w-full tw-bg-black tw-rounded",alt:"photo of "+a.borrowerName,"aspect-ratio":3/4,"default-image":{width:336},hash:a.imageHash,images:[{width:336,viewSize:1024},{width:336,viewSize:768},{width:416,viewSize:480},{width:374,viewSize:414},{width:335,viewSize:375},{width:280}]},null,8,["alt","hash"]),a.countryName?(n(),m("div",xe,[k(W,{class:"tw-absolute tw-bottom-2 tw-left-1 tw-text-primary"},{default:L(()=>[k(G,{class:"tw-h-2.5 tw-w-2.5 tw-mr-0.5",icon:o.mdiMapMarker},null,8,["icon"]),I(" "+p(a.countryName),1)],void 0,!0),_:1})])):r("",!0)])),o.isLoading?(n(),s(g,{key:2,class:"tw-mb-0.5",style:{height:"2rem"}})):r("",!0),o.isLoading?r("",!0):(n(),s(X,{key:3,class:"tw-mb-1 tw-text-title tw-mt-1 tw-overflow-hidden tw-text-ellipsis tw-line-clamp-1","max-length":50,name:a.borrowerName,style:{"min-height":"2rem"}},null,8,["name"])),o.isLoading?(n(),s(Y,{key:4,class:"tw-mb-1.5 tw-flex-grow",style:{"min-height":"1rem"}})):r("",!0),o.isLoading?r("",!0):(n(),m("div",Se,[l("p",Le,p(a.loanUse),1)])),o.isLoading?(n(),s(g,{key:6,class:"tw-mb-0.5",style:{height:"1.3rem"}})):r("",!0),o.isLoading?(n(),s(g,{key:7,class:"tw-mb-1.5 tw-rounded",style:{height:"0.5rem"}})):r("",!0),o.isLoading?r("",!0):(n(),m("div",Ie,[l("figure",null,[l("figcaption",Ne,[l("div",Me,[l("p",Pe,p(Math.floor(a.fundraisingPercent))+"% FUNDED ",1)]),l("p",Ce,[l("span",Re,p(e.$filters.numeral(a.loanAmount,"$0,0[.]00")),1)])]),o.isLoading?r("",!0):(n(),s(Z,{key:0,class:"tw-mb-1.5 lg:tw-mb-1 tw-bg-tertiary",label:"Percent the loan has funded",value:a.fundraisingPercent},null,8,["value"]))])]))],void 0),_:1},8,["is","to"])),[[ee,["Lending","click-see more","card",i.loanId]]]),a.dedications.length>0?(n(),m("div",Oe,[t[1]||(t[1]=I(" 💚 ")),l("button",{class:"data-hj-suppress tw-capitalize tw-text-action hover:tw-underline",onClick:t[0]||(t[0]=(...te)=>a.dedicationClickEvent&&a.dedicationClickEvent(...te))},p(a.dedicationsCopy),1)])):r("",!0)],8,_e)}const u=ve(z,[["render",De],["__scopeId","data-v-16ff20d5"]]);z.__docgenInfo={displayName:"NewHomePageLoanCard",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},required:!0},{name:"lenderPublicId",type:{name:"string"},defaultValue:{func:!1,value:"''"}}],events:[{name:"dedication-click",type:{names:["undefined"]}}],sourceFiles:["/home/runner/work/ui/ui/src/components/LoanCards/NewHomePageLoanCard.vue"]};const x={data:{lend:{loan:{id:2440030,distributionModel:"fieldPartner",geocode:{country:{name:"Peru"}},image:{id:4916565,hash:"8e195b0d98bde6a1a1861b11ceb61188"},name:"Lolimar",use:"to buy a mixer and supplies to continue making her pastries.",loanAmount:"525.00",loanFundraisingInfo:{fundedAmount:"275.00",reservedAmount:"0.00"},fundraisingPercent:Math.floor(.5238095238095238*100)}}}},rt={title:"Loan Cards/New Home Page Loan Card",component:u},v=()=>({mixins:[h({queryResult:x}),w()],components:{NewHomePageLoanCard:u},template:`
        <div class="kv-tailwind">
            <new-home-page-loan-card :loan-id="1998250" />
        </div>
    `}),f=()=>({mixins:[h({loading:!0}),w()],components:{NewHomePageLoanCard:u},template:`
        <div class="kv-tailwind">
            <new-home-page-loan-card :loan-id="1998250" />
        </div>
    `}),J=JSON.parse(JSON.stringify(x));J.data.lend.loan.dedicationToKiva=!0;const y=()=>({mixins:[h({queryResult:J}),w()],components:{NewHomePageLoanCard:u},template:`
        <div class="kv-tailwind">
            <new-home-page-loan-card :loan-id="1998250" />
        </div>
    `}),S=JSON.parse(JSON.stringify(x));S.data.lend.loan.dedications={values:[{id:"2",recipientName:"Mom"}]};const b=()=>({mixins:[h({queryResult:S}),w()],components:{NewHomePageLoanCard:u},template:`
        <div class="kv-tailwind">
            <new-home-page-loan-card :loan-id="1998250" />
        </div>
    `}),U=JSON.parse(JSON.stringify(S));U.data.lend.loan.dedicationToKiva=!0;const _=()=>({mixins:[h({queryResult:U}),w()],components:{NewHomePageLoanCard:u},template:`
        <div class="kv-tailwind">
            <new-home-page-loan-card :loan-id="1998250" />
        </div>
    `});var N,M,P;v.parameters={...v.parameters,docs:{...(N=v.parameters)==null?void 0:N.docs,source:{originalSource:`() => ({
  mixins: [apolloStoryMixin({
    queryResult
  }), cookieStoreStoryMixin()],
  components: {
    NewHomePageLoanCard
  },
  template: \`
        <div class="kv-tailwind">
            <new-home-page-loan-card :loan-id="1998250" />
        </div>
    \`
})`,...(P=(M=v.parameters)==null?void 0:M.docs)==null?void 0:P.source}}};var C,R,O;f.parameters={...f.parameters,docs:{...(C=f.parameters)==null?void 0:C.docs,source:{originalSource:`() => ({
  mixins: [apolloStoryMixin({
    loading: true
  }), cookieStoreStoryMixin()],
  components: {
    NewHomePageLoanCard
  },
  template: \`
        <div class="kv-tailwind">
            <new-home-page-loan-card :loan-id="1998250" />
        </div>
    \`
})`,...(O=(R=f.parameters)==null?void 0:R.docs)==null?void 0:O.source}}};var D,q,K;y.parameters={...y.parameters,docs:{...(D=y.parameters)==null?void 0:D.docs,source:{originalSource:`() => ({
  mixins: [apolloStoryMixin({
    queryResult: kivaDedicationQueryResult
  }), cookieStoreStoryMixin()],
  components: {
    NewHomePageLoanCard
  },
  template: \`
        <div class="kv-tailwind">
            <new-home-page-loan-card :loan-id="1998250" />
        </div>
    \`
})`,...(K=(q=y.parameters)==null?void 0:q.docs)==null?void 0:K.source}}};var T,A,H;b.parameters={...b.parameters,docs:{...(T=b.parameters)==null?void 0:T.docs,source:{originalSource:`() => ({
  mixins: [apolloStoryMixin({
    queryResult: oneReceiptDedicationQueryResult
  }), cookieStoreStoryMixin()],
  components: {
    NewHomePageLoanCard
  },
  template: \`
        <div class="kv-tailwind">
            <new-home-page-loan-card :loan-id="1998250" />
        </div>
    \`
})`,...(H=(A=b.parameters)==null?void 0:A.docs)==null?void 0:H.source}}};var B,F,V;_.parameters={..._.parameters,docs:{...(B=_.parameters)==null?void 0:B.docs,source:{originalSource:`() => ({
  mixins: [apolloStoryMixin({
    queryResult: multipleRecipientsDedicationQueryResult
  }), cookieStoreStoryMixin()],
  components: {
    NewHomePageLoanCard
  },
  template: \`
        <div class="kv-tailwind">
            <new-home-page-loan-card :loan-id="1998250" />
        </div>
    \`
})`,...(V=(F=_.parameters)==null?void 0:F.docs)==null?void 0:V.source}}};const st=["Default","Loading","KivaDedication","OneRecipientDedication","MultipleRecipientsDedication"];export{v as Default,y as KivaDedication,f as Loading,_ as MultipleRecipientsDedication,b as OneRecipientDedication,st as __namedExportsOrder,rt as default};
