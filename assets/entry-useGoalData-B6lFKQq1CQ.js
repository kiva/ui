import{h as m,j as _,k as R}from"./entry-vue.esm-bundler-BthIfLPEGH.js";import{l as w}from"./entry-logFormatter-DhjghUk5Me.js";import{g as U}from"./entry-numeral-DJCTM12wUX.js";import{l as E}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{f as k,d as G,a as L,c as C,b as F,I as O}from"./entry-useBadgeData-BC7POqnW8v.js";const Y=`query useGoalDataQuery {
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
`,x={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"useGoalDataQuery"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userPreferences"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"preferences"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"loans"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:161,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:Y}}},J=`query useGoalDataProgressQuery($loanIds: [Int!]!) {
  postCheckoutAchievements(loanIds: $loanIds) {
	allTimeProgress {
		achievementId
        totalProgress
        currentTier
        completed
	}
  }
}
`,j={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"useGoalDataProgressQuery"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"loanIds"}},type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"postCheckoutAchievements"},arguments:[{kind:"Argument",name:{kind:"Name",value:"loanIds"},value:{kind:"Variable",name:{kind:"Name",value:"loanIds"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"allTimeProgress"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"achievementId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"totalProgress"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"currentTier"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"completed"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:242,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:J}}},V=U`
	mutation createUserPreferences($preferences: String) {
		my {
			createUserPreferences(userPreferences: { preferences: $preferences }) {
				id
				preferences
			}
		}
	}
`,X=U`
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
`,B=async(l,u)=>{try{return await l.mutate({mutation:V,variables:{preferences:JSON.stringify(u)}})}catch(v){E(v,"userPreferenceUtils createUserPreferencesMutation")}},A=async(l,u,v,g)=>{try{const d={...v,...g},s=JSON.stringify(d);return await l.mutate({mutation:X,variables:{updateUserPreferencesId:u.id,preferences:s}})}catch(d){E(d,"userPreferenceUtils updateUserPreferencesMutation")}},W={[O]:"basic needs loans",[F]:"eco-friendly loans",[C]:"refugees",[k]:"loans",[L]:"U.S. entrepreneurs",[G]:"women"},z={[O]:"basic needs loan",[F]:"eco-friendly loan",[C]:"refugee",[k]:"loan",[L]:"U.S. entrepreneur",[G]:"woman"},S={COMPLETED:"completed",EXPIRED:"expired"};function H(l,u){return!l||l>1?W[u]||"loans":z[u]||"loan"}function ne({apollo:l}){const u=R("$kvTrackEvent"),v=m([]),g=m(!0),d=m(null),s=m(null),f=m(null),I=m(!1),p=m(0);async function y(t="cache-first"){var e,a,o,n,i;try{const r=await l.query({query:x,fetchPolicy:t}),c=((a=(e=r.data)==null?void 0:e.my)==null?void 0:a.userPreferences)||null;return d.value=((i=(n=(o=r.data)==null?void 0:o.my)==null?void 0:n.loans)==null?void 0:i.totalCount)||0,f.value=c,c?JSON.parse(c.preferences||"{}"):{}}catch(r){return w(r,"Failed to load preferences"),null}}async function N(t){var e,a;try{const o=t.map(i=>i.id),n=await l.query({query:j,variables:{loanIds:o}});return((a=(e=n==null?void 0:n.data)==null?void 0:e.postCheckoutAchievements)==null?void 0:a.allTimeProgress)||[]}catch(o){return w(o,"Failed to load progress"),null}}function P(t){if(!t)return;const e=t.goals||[];s.value={...e[0]}}async function D(t){var n,i;(n=f.value)!=null&&n.id||(await B(l,{goals:[]}),await y("network-only"));const e=JSON.parse(((i=f.value)==null?void 0:i.preferences)||"{}"),a=e.goals||[],o=a.findIndex(r=>r.goalName===t.goalName);o!==-1?a[o]={...a[o],...t}:a.push(t),await A(l,f.value,e,{goals:a}),P({goals:a})}const h=_(()=>{var a,o,n,i;if(((a=s.value)==null?void 0:a.category)===k){const r=d.value||0,c=((o=s.value)==null?void 0:o.loanTotalAtStart)||0;return Math.max(r-c,0)}const e=(((n=v.value.find(r=>{var c;return r.achievementId===((c=s.value)==null?void 0:c.category)}))==null?void 0:n.totalProgress)||0)-(((i=s.value)==null?void 0:i.loanTotalAtStart)||0);return Math.max(e,0)}),T=_(()=>{var t;return h.value>=((t=s.value)==null?void 0:t.target)}),q=async(t="post-checkout")=>{s.value&&T.value&&s.value.status!=="completed"&&(await D({goalName:s.value.goalName,dateStarted:s.value.dateStarted,target:s.value.target,count:s.value.count,status:"completed"}),u(t,"show","annual-goal-complete",s.value.category,s.value.target),I.value=!0)},b=async t=>{var o,n;const e=await N([t]);return((o=s.value)==null?void 0:o.category)===k?(p.value+=1,p.value):((n=e.find(i=>{var r;return i.achievementId===((r=s.value)==null?void 0:r.category)}))==null?void 0:n.totalProgress)||0},M=t=>{var o;const e=d.value||0,a=((o=s.value)==null?void 0:o.loanTotalAtStart)||0;p.value=Math.max(e-a,0)+t};async function $(t=[]){var a;g.value=!0;const e=await y();v.value=await N(t),P(e),((a=s.value)==null?void 0:a.category)===k&&!p.value&&M(t.length-1),g.value=!1}async function Q(t=new Date){const e=await y(),a=e.goals||[],o=t.getFullYear(),n=a.map(r=>(r.dateStarted?new Date(r.dateStarted).getFullYear():null)<o?{...r,status:S.EXPIRED}:r);n.some(r=>r.status===S.EXPIRED)&&(e.goals=n,e.goalsRenewed=!0,await A(l,f.value,e,{goals:n}),P({goals:n}));const i=!!n.length&&!n.some(r=>r.status===S.COMPLETED);return{expiredGoals:n,showRenewedAnnualGoalToast:i,goalsRenewed:(e==null?void 0:e.goalsRenewed)||!1}}return{getGoalDisplayName:H,goalProgress:h,loading:g,loadGoalData:$,storeGoalPreferences:D,userGoal:s,userGoalAchieved:T,userGoalAchievedNow:I,checkCompletedGoal:q,getProgressByLoan:b,userPreferences:f,renewAnnualGoal:Q}}export{ne as u};
