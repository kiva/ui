import{l as p}from"./entry-logFormatter-DhjghUk5Me.js";import{_ as A}from"./entry-loanAddComment-DvQEPf3nxH.js";import{h as g,j as _,k as L}from"./entry-vue.esm-bundler-Bf_Yeyugwo.js";import{g as U}from"./entry-numeral-DJCTM12wUX.js";import{l as D}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{e as M,d as O,f as w,b as F,c as $,I as q}from"./entry-useBadgeData-BVPFKdTbm4.js";const k="guestCommentComment",C="guestCommentLoanId",ae={mounted(){var d,e;const r=this.cookieStore.get(k),c=this.cookieStore.get(C);(((e=(d=this.$route)==null?void 0:d.params)==null?void 0:e.id)??0).toString()===c&&r&&this.submitComment()},methods:{submitComment(){var r,c;this.apollo.mutate({mutation:A,variables:{id:Number(((c=(r=this.$route)==null?void 0:r.params)==null?void 0:c.id)??0),body:this.cookieStore.get(k)}}).then(({data:l})=>{if(l.loan.addComment)this.$showTipMsg("Thank you for leaving a comment!"),this.cookieStore.remove(k),this.cookieStore.remove(C);else throw new Error("Comment not added")}).catch(l=>{p(l,"error"),this.$showTipMsg("There was a problem commenting on this loan","error")})}}},Q=`query useGoalDataQuery {
  my {
    id
	userPreferences {
      id
      preferences
    }
	loans {
	  totalCount
	}
  }
}
`,x={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"useGoalDataQuery"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userPreferences"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"preferences"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"loans"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:161,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:Q}}},B=`query useGoalDataProgressQuery($loanIds: [Int!]!) {
  postCheckoutAchievements(loanIds: $loanIds) {
	allTimeProgress {
		achievementId
        totalProgress
        currentTier
        completed
	}
  }
}
`,J={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"useGoalDataProgressQuery"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"loanIds"}},type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"postCheckoutAchievements"},arguments:[{kind:"Argument",name:{kind:"Name",value:"loanIds"},value:{kind:"Variable",name:{kind:"Name",value:"loanIds"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"allTimeProgress"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"achievementId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"totalProgress"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"currentTier"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"completed"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:242,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:B}}},Y=U`
	mutation createUserPreferences($preferences: String) {
		my {
			createUserPreferences(userPreferences: { preferences: $preferences }) {
				id
				preferences
			}
		}
	}
`,j=U`
	mutation UpdateUserPreferences(
		$updateUserPreferencesId: Int!,
		$preferences: String
	) {
		my {
			updateUserPreferences(id: $updateUserPreferencesId, userPreferences: {
				preferences: $preferences
		}) {
				id
				preferences
			}
		}
	}
`,R=async(r,c)=>{try{return await r.mutate({mutation:Y,variables:{preferences:JSON.stringify(c)}})}catch(l){D(l,"userPreferenceUtils createUserPreferencesMutation")}},V=async(r,c,l,f)=>{try{const d={...l,...f},e=JSON.stringify(d);return await r.mutate({mutation:j,variables:{updateUserPreferencesId:c.id,preferences:e}})}catch(d){D(d,"userPreferenceUtils updateUserPreferencesMutation")}},W={[q]:"basic needs loans",[$]:"eco-friendly loans",[F]:"refugees",[w]:"loans",[O]:"U.S. entrepreneurs",[M]:"women"};function z(r){return W[r]||"loans"}function ne({apollo:r}){const c=L("$kvTrackEvent"),l=g([]),f=g(!0),d=g(null),e=g(null),v=g(null),y=g(!1);async function P(t="cache-first"){var s,a,n,o,i;try{const u=await r.query({query:x,fetchPolicy:t}),m=((a=(s=u.data)==null?void 0:s.my)==null?void 0:a.userPreferences)||null;return d.value=((i=(o=(n=u.data)==null?void 0:n.my)==null?void 0:o.loans)==null?void 0:i.totalCount)||0,v.value=m,m?JSON.parse(m.preferences||"{}"):{}}catch(u){return p(u,"Failed to load preferences"),null}}async function S(t){var s,a;try{const n=t.map(i=>i.id),o=await r.query({query:J,variables:{loanIds:n}});return((a=(s=o==null?void 0:o.data)==null?void 0:s.postCheckoutAchievements)==null?void 0:a.allTimeProgress)||[]}catch(n){return p(n,"Failed to load progress"),null}}function h(t){if(!t)return;const s=t.goals||[];e.value={...s[0]}}async function N(t){var o,i;(o=v.value)!=null&&o.id||(await R(r,{goals:[]}),await P("network-only"));const s=JSON.parse(((i=v.value)==null?void 0:i.preferences)||"{}"),a=s.goals||[],n=a.findIndex(u=>u.goalName===t.goalName);n!==-1?a[n]={...a[n],...t}:a.push(t),await V(r,v.value,s,{goals:a}),h({goals:a})}const I=_(()=>{var a,n,o,i;if(((a=e.value)==null?void 0:a.category)===w){const u=d.value||0,m=((n=e.value)==null?void 0:n.loanTotalAtStart)||0;return Math.max(u-m,0)}const s=(((o=l.value.find(u=>{var m;return u.achievementId===((m=e.value)==null?void 0:m.category)}))==null?void 0:o.totalProgress)||0)-(((i=e.value)==null?void 0:i.loanTotalAtStart)||0);return Math.max(s,0)}),T=_(()=>{var t;return I.value>=((t=e.value)==null?void 0:t.target)}),E=async(t="post-checkout")=>{e.value&&T.value&&e.value.status!=="completed"&&(await N({goalName:e.value.goalName,dateStarted:e.value.dateStarted,target:e.value.target,count:e.value.count,status:"completed"}),c(t,"show","annual-goal-complete",e.value.category,e.value.target),y.value=!0)},G=async t=>{var n;return((n=(await S([t])).find(o=>{var i;return o.achievementId===((i=e.value)==null?void 0:i.category)}))==null?void 0:n.totalProgress)||0};async function b(t=[]){f.value=!0;const s=await P();l.value=await S(t),h(s),f.value=!1}return{getGoalDisplayName:z,goalProgress:I,loading:f,loadGoalData:b,storeGoalPreferences:N,userGoal:e,userGoalAchieved:T,userGoalAchievedNow:y,checkCompletedGoal:E,getProgressByLoan:G}}export{k as G,C as a,ae as g,ne as u};
