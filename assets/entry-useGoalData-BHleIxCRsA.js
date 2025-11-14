import{h as m,j as T,k as M}from"./entry-vue.esm-bundler-BthIfLPEGH.js";import{l as D}from"./entry-logFormatter-DhjghUk5Me.js";import{g as U}from"./entry-numeral-DJCTM12wUX.js";import{l as A}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{f as g,d as G,a as C,c as F,b as L,I as w}from"./entry-useBadgeData-BC7POqnW8v.js";const $=`query useGoalDataQuery {
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
`,Q={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"useGoalDataQuery"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userPreferences"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"preferences"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"loans"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:161,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:$}}},x=`query useGoalDataProgressQuery($loanIds: [Int!]!) {
  postCheckoutAchievements(loanIds: $loanIds) {
	allTimeProgress {
		achievementId
        totalProgress
        currentTier
        completed
	}
  }
}
`,Y={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"useGoalDataProgressQuery"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"loanIds"}},type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"postCheckoutAchievements"},arguments:[{kind:"Argument",name:{kind:"Name",value:"loanIds"},value:{kind:"Variable",name:{kind:"Name",value:"loanIds"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"allTimeProgress"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"achievementId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"totalProgress"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"currentTier"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"completed"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:242,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:x}}},J=U`
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
`,R=async(l,c)=>{try{return await l.mutate({mutation:J,variables:{preferences:JSON.stringify(c)}})}catch(v){A(v,"userPreferenceUtils createUserPreferencesMutation")}},V=async(l,c,v,f)=>{try{const d={...v,...f},t=JSON.stringify(d);return await l.mutate({mutation:j,variables:{updateUserPreferencesId:c.id,preferences:t}})}catch(d){A(d,"userPreferenceUtils updateUserPreferencesMutation")}},B={[w]:"basic needs loans",[L]:"eco-friendly loans",[F]:"refugees",[g]:"loans",[C]:"U.S. entrepreneurs",[G]:"women"},W={[w]:"basic needs loan",[L]:"eco-friendly loan",[F]:"refugee",[g]:"loan",[C]:"U.S. entrepreneur",[G]:"woman"};function z(l,c){return!l||l>1?B[c]||"loans":W[c]||"loan"}function te({apollo:l}){const c=M("$kvTrackEvent"),v=m([]),f=m(!0),d=m(null),t=m(null),k=m(null),y=m(!1),p=m(0);async function P(e="cache-first"){var r,a,n,s,i;try{const o=await l.query({query:Q,fetchPolicy:e}),u=((a=(r=o.data)==null?void 0:r.my)==null?void 0:a.userPreferences)||null;return d.value=((i=(s=(n=o.data)==null?void 0:n.my)==null?void 0:s.loans)==null?void 0:i.totalCount)||0,k.value=u,u?JSON.parse(u.preferences||"{}"):{}}catch(o){return D(o,"Failed to load preferences"),null}}async function S(e){var r,a;try{const n=e.map(i=>i.id),s=await l.query({query:Y,variables:{loanIds:n}});return((a=(r=s==null?void 0:s.data)==null?void 0:r.postCheckoutAchievements)==null?void 0:a.allTimeProgress)||[]}catch(n){return D(n,"Failed to load progress"),null}}function N(e){if(!e)return;const r=e.goals||[];t.value={...r[0]}}async function I(e){var s,i;(s=k.value)!=null&&s.id||(await R(l,{goals:[]}),await P("network-only"));const r=JSON.parse(((i=k.value)==null?void 0:i.preferences)||"{}"),a=r.goals||[],n=a.findIndex(o=>o.goalName===e.goalName);n!==-1?a[n]={...a[n],...e}:a.push(e),await V(l,k.value,r,{goals:a}),N({goals:a})}const h=T(()=>{var a,n,s,i;if(((a=t.value)==null?void 0:a.category)===g){const o=d.value||0,u=((n=t.value)==null?void 0:n.loanTotalAtStart)||0;return Math.max(o-u,0)}const r=(((s=v.value.find(o=>{var u;return o.achievementId===((u=t.value)==null?void 0:u.category)}))==null?void 0:s.totalProgress)||0)-(((i=t.value)==null?void 0:i.loanTotalAtStart)||0);return Math.max(r,0)}),_=T(()=>{var e;return h.value>=((e=t.value)==null?void 0:e.target)}),q=async(e="post-checkout")=>{t.value&&_.value&&t.value.status!=="completed"&&(await I({goalName:t.value.goalName,dateStarted:t.value.dateStarted,target:t.value.target,count:t.value.count,status:"completed"}),c(e,"show","annual-goal-complete",t.value.category,t.value.target),y.value=!0)},O=async e=>{var n,s;const r=await S([e]);return((n=t.value)==null?void 0:n.category)===g?(p.value+=1,p.value):((s=r.find(i=>{var o;return i.achievementId===((o=t.value)==null?void 0:o.category)}))==null?void 0:s.totalProgress)||0},b=e=>{var n;const r=d.value||0,a=((n=t.value)==null?void 0:n.loanTotalAtStart)||0;p.value=Math.max(r-a,0)+e};async function E(e=[]){var a;f.value=!0;const r=await P();v.value=await S(e),N(r),((a=t.value)==null?void 0:a.category)===g&&!p.value&&b(e.length-1),f.value=!1}return{getGoalDisplayName:z,goalProgress:h,loading:f,loadGoalData:E,storeGoalPreferences:I,userGoal:t,userGoalAchieved:_,userGoalAchievedNow:y,checkCompletedGoal:q,getProgressByLoan:O}}export{te as u};
