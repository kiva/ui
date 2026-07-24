import{g as l}from"./entry-index-CWclSTHHJk.js";import{L as s}from"./entry-LoanDescription-pSddjDLJ88.js";import{L as u}from"./entry-LoanFigureCarousel-CntH30xmiC.js";import{c as m,d as n,h as o,o as g}from"./entry-vue.esm-bundler-B52OYB4W0G.js";import{_ as c}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const I=l`fragment loanStoryFields on LoanBasic {
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
			id
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
}`,a={name:"LoanStory",components:{LoanDescription:s,LoanFigureCarousel:u},props:{loan:{type:Object,default:()=>({})}},computed:{loanId(){var r;return((r=this.loan)==null?void 0:r.id)??0},anonymizationLevel(){var r;return((r=this.loan)==null?void 0:r.anonymizationLevel)??""},borrowerCount(){var r;return((r=this.loan)==null?void 0:r.borrowerCount)??0},borrowers(){var r;return((r=this.loan)==null?void 0:r.borrowers)??[]},description(){var r;return((r=this.loan)==null?void 0:r.description)??""},descriptionInOriginalLanguage(){var r;return((r=this.loan)==null?void 0:r.descriptionInOriginalLanguage)??""},figures(){var r;return((r=this.loan)==null?void 0:r.figures)??[]},name(){var r;return((r=this.loan)==null?void 0:r.name)??""},originalLanguage(){var r;return((r=this.loan)==null?void 0:r.originalLanguage)??{}},partnerName(){var r;return((r=this.loan)==null?void 0:r.partnerName)??""},reviewer(){var r;return((r=this.loan)==null?void 0:r.reviewer)??{}},previousLoanId(){var r;return((r=this.loan)==null?void 0:r.previousLoanId)??0}}};function d(r,p,L,f,w,e){const i=o("loan-figure-carousel"),t=o("loan-description");return g(),m("article",null,[n(i,{class:"tw--mb-1.5 md:tw--mb-1",figures:e.figures,name:e.name},null,8,["figures","name"]),n(t,{class:"tw-pt-4","loan-id":e.loanId,"anonymization-level":e.anonymizationLevel,"borrower-count":e.borrowerCount,"borrower-or-group-name":e.name,borrowers:e.borrowers,"description-in-original-language":e.descriptionInOriginalLanguage,"original-language":e.originalLanguage,"partner-name":e.partnerName,reviewer:e.reviewer,"story-description":e.description,"previous-loan-id":e.previousLoanId},null,8,["loan-id","anonymization-level","borrower-count","borrower-or-group-name","borrowers","description-in-original-language","original-language","partner-name","reviewer","story-description","previous-loan-id"])])}const N=c(a,[["render",d]]);a.__docgenInfo={displayName:"LoanStory",exportName:"default",description:"",tags:{},props:[{name:"loan",type:{name:"object"},defaultValue:{func:!1,value:"{}"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/LoanStory.vue"]};export{N as L,I as l};
