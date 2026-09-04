import{q as e}from"./entry-vue.esm-bundler-CkX4CbCAj4.js";import{u as c}from"./entry-useApolloQuery-BhW_iXEb35.js";const d=`query userId {
	my {
		id
		userAccount {
			id
		}
	}
}
`,u={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"userId"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userAccount"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:95,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:d}}},o={query:u},l=[o];function k(){const{result:r}=c(o),i=e(()=>{var n,t;return!!((t=(n=r.value)==null?void 0:n.my)!=null&&t.id)}),s=e(()=>i.value?"/mykiva":"/"),a=e(()=>i.value?"/mykiva":"/portfolio");return{homePagePath:s,portfolioPath:a}}const p=[...l];export{p as _,k as u};
