import{g as d}from"./entry-index-CWclSTHHJk.js";import{r as m}from"./entry-rich-text-html-renderer.es5-kBaKhcHuza.js";import{a as f}from"./entry-contentfulUtils-Cr2nj0VwiQ.js";const k=`query salesforceQuery (
	$id: String!,
){
	general {
		salesforceSolution(id: $id) {
			name
			note
		}
	}
}`,y={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"salesforceQuery"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"salesforceSolution"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"note"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:147,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:k}}};async function v(a,n){var l;const{data:e}=await a.query({query:y,variables:{id:n}}),t=((l=e==null?void 0:e.general)==null?void 0:l.salesforceSolution)??null;return t?{title:t.name??"",content:t.note??""}:null}const S=d`query contentfulDefinitions {
	contentful {
		entries(contentKey: "borrower-profile-definitions", contentType: "contentGroup")
	}
}`;function D(a){let n=null,e=null;async function t(){return e||(e=a.query({query:S}).then(o=>{var s,i,u,c;const r=((u=(i=(s=o.data)==null?void 0:s.contentful)==null?void 0:i.entries)==null?void 0:u.items)??null;r&&(n=((c=f(r).borrowerProfileDefinitions)==null?void 0:c.contents)??null)}).catch(o=>{throw e=null,o}),e)}async function l({cid:o,sfid:r,forceSalesforce:s=!1}){if(!s){if(n===null)try{await t()}catch{}const i=n==null?void 0:n.find(u=>u.key===o);if(i)return{title:i.name,content:m.documentToHtmlString(i.richText)}}return r?v(a,r):null}return{loadDefinitions:t,resolveDefinition:l}}export{D as u};
