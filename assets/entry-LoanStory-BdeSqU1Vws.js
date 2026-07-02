import{g as m}from"./entry-index-CWclSTHHJk.js";import{L as g}from"./entry-LoanDescription-Cz6wQhWvdH.js";import{L as l}from"./entry-LoanFigureCarousel-DQsIAKb23I.js";import{c,a,r as s,o as d}from"./entry-vue.esm-bundler-Du63x9n7zJ.js";import{_ as L}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const t={name:"LoanStory",inject:["apollo","cookieStore"],components:{LoanDescription:g,LoanFigureCarousel:l},props:{loanId:{type:Number,default:0}},data(){return{anonymizationLevel:"",borrowerCount:0,borrowers:[],name:"",figures:[],description:"",descriptionInOriginalLanguage:"",originalLanguage:{},partnerName:"",reviewer:{},previousLoanId:0}},apollo:{preFetch:!0,query:m`query loanStory($loanId: Int!) {
			lend {
				loan(id: $loanId) {
					id
					anonymizationLevel
					borrowerCount
					borrowers {
						id
						firstName
					}
					description
					previousLoanId
					descriptionInOriginalLanguage
					figures {
						__typename
						... on Image {
							id
							hash
						}
						... on Video {
							youtubeId
						}
					}
					name
					originalLanguage {
						id
						name
					}
					... on LoanPartner {
						partnerName
						reviewer {
							id
							bylineName
							showName
						}
					}
				}
			}
		}`,preFetchVariables({route:o}){var e;return{loanId:Number(((e=o==null?void 0:o.params)==null?void 0:e.id)??0)}},variables(){return{loanId:this.loanId}},result(o){var n,i;const e=(i=(n=o==null?void 0:o.data)==null?void 0:n.lend)==null?void 0:i.loan;this.anonymizationLevel=(e==null?void 0:e.anonymizationLevel)??"",this.borrowerCount=(e==null?void 0:e.borrowerCount)??0,this.borrowers=(e==null?void 0:e.borrowers)??[],this.description=(e==null?void 0:e.description)??"",this.descriptionInOriginalLanguage=(e==null?void 0:e.descriptionInOriginalLanguage)??"",this.figures=(e==null?void 0:e.figures)??[],this.name=(e==null?void 0:e.name)??"",this.originalLanguage=(e==null?void 0:e.originalLanguage)??{},this.partnerName=(e==null?void 0:e.partnerName)??"",this.reviewer=(e==null?void 0:e.reviewer)??{},this.previousLoanId=(e==null?void 0:e.previousLoanId)??0}}};function w(o,e,n,i,r,f){const p=s("loan-figure-carousel"),u=s("loan-description");return d(),c("article",null,[a(p,{class:"tw--mb-1.5 md:tw--mb-1",figures:r.figures,name:r.name},null,8,["figures","name"]),a(u,{class:"tw-pt-4","loan-id":n.loanId,"anonymization-level":r.anonymizationLevel,"borrower-count":r.borrowerCount,"borrower-or-group-name":r.name,borrowers:r.borrowers,"description-in-original-language":r.descriptionInOriginalLanguage,"original-language":r.originalLanguage,"partner-name":r.partnerName,reviewer:r.reviewer,"story-description":r.description,"previous-loan-id":r.previousLoanId},null,8,["loan-id","anonymization-level","borrower-count","borrower-or-group-name","borrowers","description-in-original-language","original-language","partner-name","reviewer","story-description","previous-loan-id"])])}const h=L(t,[["render",w]]);t.__docgenInfo={displayName:"LoanStory",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/LoanStory.vue"]};export{h as L};
