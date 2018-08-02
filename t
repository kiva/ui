[1mdiff --git a/src/components/Kv/KvPagination.vue b/src/components/Kv/KvPagination.vue[m
[1mindex fcf9eac..5648df8 100644[m
[1m--- a/src/components/Kv/KvPagination.vue[m
[1m+++ b/src/components/Kv/KvPagination.vue[m
[36m@@ -52,7 +52,7 @@[m
 </template>[m
 [m
 <script>[m
[31m-import _clone from 'lodash/clone';[m
[32m+[m[32mimport _cloneDeep from 'lodash/cloneDeep';[m
 import _range from 'lodash/range';[m
 import _uniq from 'lodash/uniq';[m
 import KvIcon from './KvIcon';[m
[36m@@ -138,7 +138,7 @@[m [mexport default {[m
 	},[m
 	methods: {[m
 		routeForPage(number) {[m
[31m-			const query = _clone(this.$route.query);[m
[32m+[m			[32mconst query = _cloneDeep(this.$route.query);[m
 			if (number > 1) {[m
 				query.page = number;[m
 			} else {[m
[1mdiff --git a/src/graphql/query/lendByCategory.graphql b/src/graphql/query/lendByCategory.graphql[m
[1mindex 5e9c386..728d7a1 100644[m
[1m--- a/src/graphql/query/lendByCategory.graphql[m
[1m+++ b/src/graphql/query/lendByCategory.graphql[m
[36m@@ -9,7 +9,7 @@[m [mquery {[m
 		}[m
 	}[m
 	general {[m
[31m-		setting(setting: "uicats") {[m
[32m+[m		[32msetting(setting: "ui.category_rows") {[m
 			value[m
 		}[m
 	}[m
[1mdiff --git a/src/pages/Lend/CategoryAdminControls.vue b/src/pages/Lend/CategoryAdminControls.vue[m
[1mindex b8d0782..954a0db 100644[m
[1m--- a/src/pages/Lend/CategoryAdminControls.vue[m
[1m+++ b/src/pages/Lend/CategoryAdminControls.vue[m
[36m@@ -27,8 +27,9 @@[m
 </template>[m
 [m
 <script>[m
[31m-import _clone from 'lodash/clone';[m
[32m+[m[32mimport _cloneDeep from 'lodash/cloneDeep';[m
 import _isEqual from 'lodash/isEqual';[m
[32m+[m[32mimport setRowsMutation from '@/graphql/mutation/setCategoryRows.graphql';[m
 import KvButton from '@/components/Kv/KvButton';[m
 import ExperimentControlSlide from './ExperimentControlSlide';[m
 import ExperimentVariantSlide from './ExperimentVariantSlide';[m
[36m@@ -70,11 +71,16 @@[m [mexport default {[m
 	},[m
 	methods: {[m
 		save() {[m
[31m-			console.log(this.defaultCategories);[m
[31m-		}[m
[32m+[m			[32mthis.apollo.mutate({[m
[32m+[m				[32mmutation: setRowsMutation,[m
[32m+[m				[32mvariables: {[m
[32m+[m					[32mcategories: JSON.stringify(this.defaultCategories)[m
[32m+[m				[32m},[m
[32m+[m			[32m}).then(result => console.log(result));[m
[32m+[m		[32m},[m
 	},[m
 	created() {[m
[31m-		this.defaultCategories = _clone(this.categories);[m
[32m+[m		[32mthis.defaultCategories = _cloneDeep(this.categories);[m
 	},[m
 };[m
 </script>[m
[1mdiff --git a/src/pages/Lend/CategorySet.vue b/src/pages/Lend/CategorySet.vue[m
[1mindex 1fce277..cf6aa83 100644[m
[1m--- a/src/pages/Lend/CategorySet.vue[m
[1m+++ b/src/pages/Lend/CategorySet.vue[m
[36m@@ -27,7 +27,7 @@[m
 </template>[m
 [m
 <script>[m
[31m-import _clone from 'lodash/clone';[m
[32m+[m[32mimport _cloneDeep from 'lodash/cloneDeep';[m
 import _isEqual from 'lodash/isEqual';[m
 import _filter from 'lodash/filter';[m
 import draggable from 'vuedraggable';[m
[36m@@ -77,7 +77,7 @@[m [mexport default {[m
 			handler(categories) {[m
 				if (categories.length) {[m
 					if (!_isEqual(this.filtered, categories)) {[m
[31m-						this.list = _clone(categories);[m
[32m+[m						[32mthis.list = _cloneDeep(categories);[m
 					}[m
 				} else {[m
 					this.list = [{ id: '' }];[m
[1mdiff --git a/src/pages/Lend/ExperimentSlide.vue b/src/pages/Lend/ExperimentSlide.vue[m
[1mindex b1ad28f..7d5cdde 100644[m
[1m--- a/src/pages/Lend/ExperimentSlide.vue[m
[1m+++ b/src/pages/Lend/ExperimentSlide.vue[m
[36m@@ -8,7 +8,7 @@[m
 </template>[m
 [m
 <script>[m
[31m-import _clone from 'lodash/clone';[m
[32m+[m[32mimport _cloneDeep from 'lodash/cloneDeep';[m
 import _isEqual from 'lodash/isEqual';[m
 import CategorySet from './CategorySet';[m
 [m
[36m@@ -40,7 +40,7 @@[m [mexport default {[m
 		categories: {[m
 			handler(categories) {[m
 				if (!_isEqual(this.list, categories)) {[m
[31m-					this.list = _clone(categories);[m
[32m+[m					[32mthis.list = _cloneDeep(categories);[m
 				}[m
 			},[m
 			immediate: true,[m
[1mdiff --git a/src/pages/Lend/LendByCategoryPage.vue b/src/pages/Lend/LendByCategoryPage.vue[m
[1mindex ada3f67..e46e82a 100644[m
[1m--- a/src/pages/Lend/LendByCategoryPage.vue[m
[1m+++ b/src/pages/Lend/LendByCategoryPage.vue[m
[36m@@ -99,7 +99,6 @@[m [mexport default {[m
 				client.query({[m
 					query: lendByCategoryQuery[m
 				}).then(({ data }) => {[m
[31m-					console.log('almost');[m
 					let result;[m
 					try {[m
 						result = JSON.parse(JSON.parse(_get(data, 'general.setting.value')));[m
[36m@@ -110,10 +109,7 @@[m [mexport default {[m
 					client.query({[m
 						query: categoriesByIdQuery,[m
 						variables: { ids },[m
[31m-					}).then(() => {[m
[31m-						console.log('made it');[m
[31m-						resolve();[m
[31m-					}).catch(reject);[m
[32m+[m					[32m}).then(resolve).catch(reject);[m
 				}).catch(reject);[m
 			});[m
 		}[m
