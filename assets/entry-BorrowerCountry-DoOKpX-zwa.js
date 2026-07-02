import{g as f}from"./entry-index-CWclSTHHJk.js";import{c as u,a as m,r as s,o as p}from"./entry-vue.esm-bundler-Du63x9n7zJ.js";import{_ as y}from"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-numeral-xVHG5DEP0A.js";import{K as h}from"./entry-KvMap-DBW1EmsCuL.js";import{l as _}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{C as g}from"./entry-CountryInfo-vcqRUpwAgr.js";import{_ as w}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const c={name:"BorrowerCountry",inject:["apollo","cookieStore"],components:{CountryInfo:g,KvLoadingPlaceholder:y,KvMap:h},props:{loanId:{type:Number,default:0}},data(){return{mapZoomLevel:5,mapInitialZoom:4,mapAutoZoomDelay:500,mapAspectRatio:1.3,mapLat:null,mapLong:null,loading:!0}},watch:{loanId(e,o){e!==o&&e&&this.loadCoordinates()}},mounted(){this.loadCoordinates()},methods:{loadCoordinates(){if(this.loanId)return this.apollo.query({query:f`query borrowerCountryCoords($loanId: Int!) {
					lend {
						loan(id: $loanId) {
							id
							geocode {
								latitude
								longitude
								country {
									id
									geocode {
										latitude
										longitude
									}
								}
							}
						}
					}
				}`,variables:{loanId:this.loanId}}).then(({data:e})=>{var n,l,t,i,r,a;const o=(l=(n=e==null?void 0:e.lend)==null?void 0:n.loan)==null?void 0:l.geocode;this.mapLat=(o==null?void 0:o.latitude)??null,this.mapLong=(o==null?void 0:o.longitude)??null,(!this.mapLat||!this.mapLong)&&(this.mapLat=((i=(t=o==null?void 0:o.country)==null?void 0:t.geocode)==null?void 0:i.latitude)??null,this.mapLong=((a=(r=o==null?void 0:o.country)==null?void 0:r.geocode)==null?void 0:a.longitude)??null),this.loading=!1}).catch(e=>{_(e,"borrowerProfileSideSheetQuery")})}}},v={key:0},L={key:1};function I(e,o,n,l,t,i){const r=s("KvLoadingPlaceholder"),a=s("kv-map"),d=s("country-info");return t.loading?(p(),u("article",v,[m(r,{class:"tw-w-full tw-h-full tw-mt-2",style:{"aspect-ratio":"8 / 5"}})])):(p(),u("article",L,[m(a,{"data-testid":"bp-country-map",class:"tw-rounded tw-overflow-hidden tw-mb-6","auto-zoom-delay":t.mapAutoZoomDelay,"aspect-ratio":t.mapAspectRatio,lat:t.mapLat,long:t.mapLong,"zoom-level":t.mapZoomLevel,"initial-zoom":t.mapInitialZoom},null,8,["auto-zoom-delay","aspect-ratio","lat","long","zoom-level","initial-zoom"]),m(d,{"loan-id":n.loanId},null,8,["loan-id"])]))}const x=w(c,[["render",I]]);c.__docgenInfo={displayName:"BorrowerCountry",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/BorrowerCountry.vue"]};export{x as B};
