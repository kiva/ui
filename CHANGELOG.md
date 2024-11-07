## [3.4.0-rc.1](https://github.com/kiva/ui/compare/v3.3.0...v3.4.0-rc.1) (2024-11-06)

### 🎉 New Features

* add buttons to modal and fix padding issues ([887014a](https://github.com/kiva/ui/commit/887014ac8bb2fed54f965df5171730ea6ad89f91))
* added loader for badge modal async components ([0a9d43b](https://github.com/kiva/ui/commit/0a9d43bbe589cd53d888e3b075727b7970400350))
* footnote support for borrower status cards in MyKiva ([8a40ef9](https://github.com/kiva/ui/commit/8a40ef9aa6e31d18f7b36cd93578c0e57db7e931))
* optional run & wait time recordings in vue worker pool ([202b393](https://github.com/kiva/ui/commit/202b393aa4c016dbd7552d15931d1cc14a16d318))
* setup apollo http link to switch to stellate uri for cachable operations ([7cf60d2](https://github.com/kiva/ui/commit/7cf60d2c9ec22277f8e7a394368dfb8e9a2e3218))
* use share info in badge earned modal ([9686771](https://github.com/kiva/ui/commit/9686771e223205534b0135e08fd4d76dc50f7b65))

### 🐛 Bugfixes

* add fallback for retries and remove console logs ([c0a5ac8](https://github.com/kiva/ui/commit/c0a5ac82c60d8bb825b03e2d37b13a3882b60132))
* adjust retry query with optional chaining, make operations list configurable ([01c9db4](https://github.com/kiva/ui/commit/01c9db4709dbf1c680ccdbcac0f3f10da9d69d6a))
* another adjustment to hiding UI while waiting for data ([17c065b](https://github.com/kiva/ui/commit/17c065b0b959d5486df61df32a5c1e97aa8a3c1f))
* borrower carousel in MyKiva should have consistent height ([831f899](https://github.com/kiva/ui/commit/831f89953d172d23620c8164c01f94dcf7b64fc5))
* conflicts ([f0d9d59](https://github.com/kiva/ui/commit/f0d9d592e63b62330679d5e3a4307ba2842cdabb))
* create separate options object, temporarily bypass csp for stellate for experimentation ([da63ed8](https://github.com/kiva/ui/commit/da63ed86ac7f634db6c94432c55f5477cfe40738))
* do not show back button on earned section ([59735a7](https://github.com/kiva/ui/commit/59735a7f566098a76d4c362a30fec561d2bd7434))
* padding and back action ([e614992](https://github.com/kiva/ui/commit/e614992d139903d4690f48bca5237791644cd11b))
* remove click from non-tiered badges ([2c4bdae](https://github.com/kiva/ui/commit/2c4bdaea57c417e0a292cfafc8c1645d8de2990a))
* remove small design on modal ([6d25095](https://github.com/kiva/ui/commit/6d2509505d848c417f933a71f7c5637309ea8443))
* resolve MyKiva settings menu location issue ([ab01531](https://github.com/kiva/ui/commit/ab015318c59eb80ed93dcf3c8c7f80ef5c57a958))
* update gifts url in the footer to new path ([13d71b6](https://github.com/kiva/ui/commit/13d71b6d214fe824279eb75575ea33b783223fac))
* update string to array conversion ([4608ff4](https://github.com/kiva/ui/commit/4608ff4d803b818b5e16ee5726d0db5459ac3d77))

### 🧹 Chores

* add stellate testing values to local config ([aed39e1](https://github.com/kiva/ui/commit/aed39e11f75175422c49cc2858b8f1709dffd7f4))
* update build/docs url to our new graph uris ([5393ea5](https://github.com/kiva/ui/commit/5393ea5bd801993ad18bc6dfadeb9ec1aa4265c3))

## [3.3.0](https://github.com/kiva/ui/compare/v3.2.0...v3.3.0) (2024-11-04)

### 🎉 New Features

* add mock data for achievement without completed tiers but with loan progress ([98e05e8](https://github.com/kiva/ui/commit/98e05e84ba10d737a0546814e973adfd597ebebf))
* connect badge data correctly to journey, resolve merge conflicts ([3dc85ef](https://github.com/kiva/ui/commit/3dc85effd855fa743a0837fdc0fb2d38cf82b672))
* connect data to badge modal in-progress state ([9818f1b](https://github.com/kiva/ui/commit/9818f1b36da4ad1dc907724a1e115379fbc03914))
* loan id prop in HeroBackground for pages besides borrower profile ([b9531bd](https://github.com/kiva/ui/commit/b9531bdd521ea5737659f6a15107587a83530692))
* method for displaying visible tiers and simplified active tier method ([b102561](https://github.com/kiva/ui/commit/b102561711ebc020b81a1a842c6615fcc4c2f214))
* moving logic to onMounted and add condition to impact dashboard to show my kiva page ([81e6488](https://github.com/kiva/ui/commit/81e6488510ae82b3939beeb4b9bc79c919d647e4))
* my kiva earned badges section ([#5631](https://github.com/kiva/ui/issues/5631)) ([9f0a25a](https://github.com/kiva/ui/commit/9f0a25a5085cdc626fbfd7d11dfe3ad10b8918fe))
* my kiva earned badges section modal ([#5639](https://github.com/kiva/ui/issues/5639)) ([b488ff4](https://github.com/kiva/ui/commit/b488ff429949af1eeb6dd1bd0165e7878c6c8302))
* save if user was part of my kiva experiment in preferences ([0c604c1](https://github.com/kiva/ui/commit/0c604c10c336cbebbc70b66eb501da022fd5822e))
* use description from achievement service in badge journey ([67759e5](https://github.com/kiva/ui/commit/67759e56ac4d4975ae500fe1fa2939166b7bee4b))
* use FixedQueue for better performance in the vue worker pool ([5db12f6](https://github.com/kiva/ui/commit/5db12f66d8f763635654707052c25c0f915a9583))
* use new badge Contentful levelName in UI ([51aa638](https://github.com/kiva/ui/commit/51aa638656f5dcf24482770e8acf1244cb664297))
* use new Contentful levelName for badges, updated journey to use it ([97bfb98](https://github.com/kiva/ui/commit/97bfb98c869267a5bcc3c3d4a941fbb2d28ae7b6))
* use only visible tiers in badge section and journey ([94b82f0](https://github.com/kiva/ui/commit/94b82f01cfd1b33f915847d12a0f8efff4d1ae3e))
* using totalProgressToAchiviement to evaluate if journey started ([1975fed](https://github.com/kiva/ui/commit/1975fed36539ca768234c48bd1a98af7d74263b4))

### 🐛 Bugfixes

* add loan use for borrower status cards ([9edbec3](https://github.com/kiva/ui/commit/9edbec39ba260a30542a642c1a97319d566040dc))
* add safety around contentful fields for displayed tier name ([26e9062](https://github.com/kiva/ui/commit/26e9062792e3cfebb88eba12d173931e2b788fb8))
* added missing comment ([13eafb3](https://github.com/kiva/ui/commit/13eafb3d95700b7b1e55bc4e574feba2241b47d4))
* badge closed event wasn't required and closed event gets called twice by lightbox ([e2aaadb](https://github.com/kiva/ui/commit/e2aaadb2311b1b12da6f9e486f4e9ac5304d9ae7))
* badge section to use correct challenge name prop ([1bda16e](https://github.com/kiva/ui/commit/1bda16e0780fd3c4a6000893478f2189c46774f9))
* borrower carousel card full width in mobile ([1d06362](https://github.com/kiva/ui/commit/1d06362ce8ec9c0c0a0205f92ed67612252b1432))
* center align stat text for mobile ([d2674de](https://github.com/kiva/ui/commit/d2674dea3d2c5e5082907eda6371b39aeb769fc3))
* clicking badge should open journey modal initially ([dbe94b9](https://github.com/kiva/ui/commit/dbe94b9dc0b302bf859420754ce688a4e565afe7))
* clicking entire badge should open modal ([170ebe9](https://github.com/kiva/ui/commit/170ebe920ad1e9481f642b9829c969506bc40800))
* contentful standard banner rendering ([030e133](https://github.com/kiva/ui/commit/030e1339ff9be6221ad0baa23c5b60b7a937b031))
* get new image for hero background when isoCode changes ([953acf7](https://github.com/kiva/ui/commit/953acf742974872c5955cb1c2fa28320a6496a80))
* guest account flow store name in userAccount instead of lender ([c1dac87](https://github.com/kiva/ui/commit/c1dac87ddb9158089b9154aebac6a4b04977a203))
* hide MyKiva content further down page as achievement data loads ([ec3ec15](https://github.com/kiva/ui/commit/ec3ec15013d4351c062ad6a4ec6a9b1525a21af3))
* indentation ([07262ac](https://github.com/kiva/ui/commit/07262ac8e49007469a34c0553438833eff3cbc12))
* lending stat item mobile styles ([9be713e](https://github.com/kiva/ui/commit/9be713e3bde59a1ee210eba7db3cff6cbd760836))
* may challenge should only be a header not the full view ([94a0d89](https://github.com/kiva/ui/commit/94a0d89f253f368b84a377c6e8b11b492a2e2c08))
* method name misspelling ([6b7fbfa](https://github.com/kiva/ui/commit/6b7fbfab98f6d96d4d2d4a833f677c02753fceb4))
* move back circle after other styling changes ([93615ee](https://github.com/kiva/ui/commit/93615eea9a5efa0741cc9cf6635cb2bb3b502286))
* my kiva query indentation ([6461f95](https://github.com/kiva/ui/commit/6461f95ebe4c9ee7d16f90f740f1b326ae73d857))
* order badge journeys by order of default badges ([b33a5b8](https://github.com/kiva/ui/commit/b33a5b8db6dda69ef07fb11b15e85a548d01b2a7))
* resolve issues with badge modal click analytics ([9e63b57](https://github.com/kiva/ui/commit/9e63b57a9f3af96aab4f3d319973048ab640efcd))
* resolve minor issues with earned modal ([9d50c46](https://github.com/kiva/ui/commit/9d50c46eac9a57c1d76ce540616515121ca60773))
* resolve missing bottom padding in desktop ([08c1914](https://github.com/kiva/ui/commit/08c1914e544fc4da7b6c9670e31d53b4b0087930))
* resolve new issue with journey arrows from longer level names and other changes ([9bc6c41](https://github.com/kiva/ui/commit/9bc6c41785c30c37257c0763a3bbed906ce649ec))
* simplify prop ([972dcd4](https://github.com/kiva/ui/commit/972dcd462f6a432cf8e1599e018dea82931d15c6))
* small adjustment to circle position ([74e0c3b](https://github.com/kiva/ui/commit/74e0c3b9e09ba67bfef76859391e6b3a8934f7a4))
* small adjustment to locked badge ([df55520](https://github.com/kiva/ui/commit/df55520bf6664e9c478a61bbf467c79045b37739))
* solve comments ([7d135c1](https://github.com/kiva/ui/commit/7d135c1a1791d567cbf76fe8620d3db034caf0bc))
* underline full word of "lives" ([5fd906b](https://github.com/kiva/ui/commit/5fd906bb954fdd58125799629c11c7d82295cfa9))
* update kv-components with new lender profile map data ([6afcf4c](https://github.com/kiva/ui/commit/6afcf4c1f19f20d91be7b190cabbb29833c143ad))
* use the active tier level in badges section ([0f80f37](https://github.com/kiva/ui/commit/0f80f37fdcc4ff34f6c1ac9ee99c672be26506b9))
* use the contentful level names in the badge journey ([636d5f8](https://github.com/kiva/ui/commit/636d5f847830ec7383d6f5d125a9c58f8c78c079))

### 🧹 Chores

* **deps:** upgrade piscina to v4.7.0 ([cfd1e0e](https://github.com/kiva/ui/commit/cfd1e0e459011c77716609250866c2e775812105))
* **release:** 3.3.0-rc.1 [skip ci] ([ab9ef86](https://github.com/kiva/ui/commit/ab9ef8692800e24379613415a8f65fe48e17b00f)), closes [#5631](https://github.com/kiva/ui/issues/5631) [#5639](https://github.com/kiva/ui/issues/5639)

## [3.3.0-rc.1](https://github.com/kiva/ui/compare/v3.2.0...v3.3.0-rc.1) (2024-11-04)

### 🎉 New Features

* add mock data for achievement without completed tiers but with loan progress ([98e05e8](https://github.com/kiva/ui/commit/98e05e84ba10d737a0546814e973adfd597ebebf))
* connect badge data correctly to journey, resolve merge conflicts ([3dc85ef](https://github.com/kiva/ui/commit/3dc85effd855fa743a0837fdc0fb2d38cf82b672))
* connect data to badge modal in-progress state ([9818f1b](https://github.com/kiva/ui/commit/9818f1b36da4ad1dc907724a1e115379fbc03914))
* loan id prop in HeroBackground for pages besides borrower profile ([b9531bd](https://github.com/kiva/ui/commit/b9531bdd521ea5737659f6a15107587a83530692))
* method for displaying visible tiers and simplified active tier method ([b102561](https://github.com/kiva/ui/commit/b102561711ebc020b81a1a842c6615fcc4c2f214))
* moving logic to onMounted and add condition to impact dashboard to show my kiva page ([81e6488](https://github.com/kiva/ui/commit/81e6488510ae82b3939beeb4b9bc79c919d647e4))
* my kiva earned badges section ([#5631](https://github.com/kiva/ui/issues/5631)) ([9f0a25a](https://github.com/kiva/ui/commit/9f0a25a5085cdc626fbfd7d11dfe3ad10b8918fe))
* my kiva earned badges section modal ([#5639](https://github.com/kiva/ui/issues/5639)) ([b488ff4](https://github.com/kiva/ui/commit/b488ff429949af1eeb6dd1bd0165e7878c6c8302))
* save if user was part of my kiva experiment in preferences ([0c604c1](https://github.com/kiva/ui/commit/0c604c10c336cbebbc70b66eb501da022fd5822e))
* use description from achievement service in badge journey ([67759e5](https://github.com/kiva/ui/commit/67759e56ac4d4975ae500fe1fa2939166b7bee4b))
* use FixedQueue for better performance in the vue worker pool ([5db12f6](https://github.com/kiva/ui/commit/5db12f66d8f763635654707052c25c0f915a9583))
* use new badge Contentful levelName in UI ([51aa638](https://github.com/kiva/ui/commit/51aa638656f5dcf24482770e8acf1244cb664297))
* use new Contentful levelName for badges, updated journey to use it ([97bfb98](https://github.com/kiva/ui/commit/97bfb98c869267a5bcc3c3d4a941fbb2d28ae7b6))
* use only visible tiers in badge section and journey ([94b82f0](https://github.com/kiva/ui/commit/94b82f01cfd1b33f915847d12a0f8efff4d1ae3e))
* using totalProgressToAchiviement to evaluate if journey started ([1975fed](https://github.com/kiva/ui/commit/1975fed36539ca768234c48bd1a98af7d74263b4))

### 🐛 Bugfixes

* add loan use for borrower status cards ([9edbec3](https://github.com/kiva/ui/commit/9edbec39ba260a30542a642c1a97319d566040dc))
* add safety around contentful fields for displayed tier name ([26e9062](https://github.com/kiva/ui/commit/26e9062792e3cfebb88eba12d173931e2b788fb8))
* added missing comment ([13eafb3](https://github.com/kiva/ui/commit/13eafb3d95700b7b1e55bc4e574feba2241b47d4))
* badge closed event wasn't required and closed event gets called twice by lightbox ([e2aaadb](https://github.com/kiva/ui/commit/e2aaadb2311b1b12da6f9e486f4e9ac5304d9ae7))
* badge section to use correct challenge name prop ([1bda16e](https://github.com/kiva/ui/commit/1bda16e0780fd3c4a6000893478f2189c46774f9))
* borrower carousel card full width in mobile ([1d06362](https://github.com/kiva/ui/commit/1d06362ce8ec9c0c0a0205f92ed67612252b1432))
* center align stat text for mobile ([d2674de](https://github.com/kiva/ui/commit/d2674dea3d2c5e5082907eda6371b39aeb769fc3))
* clicking badge should open journey modal initially ([dbe94b9](https://github.com/kiva/ui/commit/dbe94b9dc0b302bf859420754ce688a4e565afe7))
* clicking entire badge should open modal ([170ebe9](https://github.com/kiva/ui/commit/170ebe920ad1e9481f642b9829c969506bc40800))
* contentful standard banner rendering ([030e133](https://github.com/kiva/ui/commit/030e1339ff9be6221ad0baa23c5b60b7a937b031))
* get new image for hero background when isoCode changes ([953acf7](https://github.com/kiva/ui/commit/953acf742974872c5955cb1c2fa28320a6496a80))
* guest account flow store name in userAccount instead of lender ([c1dac87](https://github.com/kiva/ui/commit/c1dac87ddb9158089b9154aebac6a4b04977a203))
* hide MyKiva content further down page as achievement data loads ([ec3ec15](https://github.com/kiva/ui/commit/ec3ec15013d4351c062ad6a4ec6a9b1525a21af3))
* indentation ([07262ac](https://github.com/kiva/ui/commit/07262ac8e49007469a34c0553438833eff3cbc12))
* lending stat item mobile styles ([9be713e](https://github.com/kiva/ui/commit/9be713e3bde59a1ee210eba7db3cff6cbd760836))
* may challenge should only be a header not the full view ([94a0d89](https://github.com/kiva/ui/commit/94a0d89f253f368b84a377c6e8b11b492a2e2c08))
* method name misspelling ([6b7fbfa](https://github.com/kiva/ui/commit/6b7fbfab98f6d96d4d2d4a833f677c02753fceb4))
* move back circle after other styling changes ([93615ee](https://github.com/kiva/ui/commit/93615eea9a5efa0741cc9cf6635cb2bb3b502286))
* my kiva query indentation ([6461f95](https://github.com/kiva/ui/commit/6461f95ebe4c9ee7d16f90f740f1b326ae73d857))
* order badge journeys by order of default badges ([b33a5b8](https://github.com/kiva/ui/commit/b33a5b8db6dda69ef07fb11b15e85a548d01b2a7))
* resolve issues with badge modal click analytics ([9e63b57](https://github.com/kiva/ui/commit/9e63b57a9f3af96aab4f3d319973048ab640efcd))
* resolve minor issues with earned modal ([9d50c46](https://github.com/kiva/ui/commit/9d50c46eac9a57c1d76ce540616515121ca60773))
* resolve missing bottom padding in desktop ([08c1914](https://github.com/kiva/ui/commit/08c1914e544fc4da7b6c9670e31d53b4b0087930))
* resolve new issue with journey arrows from longer level names and other changes ([9bc6c41](https://github.com/kiva/ui/commit/9bc6c41785c30c37257c0763a3bbed906ce649ec))
* simplify prop ([972dcd4](https://github.com/kiva/ui/commit/972dcd462f6a432cf8e1599e018dea82931d15c6))
* small adjustment to circle position ([74e0c3b](https://github.com/kiva/ui/commit/74e0c3b9e09ba67bfef76859391e6b3a8934f7a4))
* small adjustment to locked badge ([df55520](https://github.com/kiva/ui/commit/df55520bf6664e9c478a61bbf467c79045b37739))
* solve comments ([7d135c1](https://github.com/kiva/ui/commit/7d135c1a1791d567cbf76fe8620d3db034caf0bc))
* underline full word of "lives" ([5fd906b](https://github.com/kiva/ui/commit/5fd906bb954fdd58125799629c11c7d82295cfa9))
* update kv-components with new lender profile map data ([6afcf4c](https://github.com/kiva/ui/commit/6afcf4c1f19f20d91be7b190cabbb29833c143ad))
* use the active tier level in badges section ([0f80f37](https://github.com/kiva/ui/commit/0f80f37fdcc4ff34f6c1ac9ee99c672be26506b9))
* use the contentful level names in the badge journey ([636d5f8](https://github.com/kiva/ui/commit/636d5f847830ec7383d6f5d125a9c58f8c78c079))

### 🧹 Chores

* **deps:** upgrade piscina to v4.7.0 ([cfd1e0e](https://github.com/kiva/ui/commit/cfd1e0e459011c77716609250866c2e775812105))

## [3.2.0](https://github.com/kiva/ui/compare/v3.1.0...v3.2.0) (2024-10-29)

### 🎉 New Features

* badge in progress content component ([652de6f](https://github.com/kiva/ui/commit/652de6ffc58f7fa8e6c584f5d71e98ce2adc07b1))
* composable for tiered badge data ([90a5086](https://github.com/kiva/ui/commit/90a5086bba0ea5ebdf3f99ef79b27acdaffd7b8c))
* integrate badge modal with completed state ([b998eaf](https://github.com/kiva/ui/commit/b998eafb8ca172be4d4da1f415239e66ee057ec6))
* mechanism for getting and displaying current tier badge data ([3fbc8d3](https://github.com/kiva/ui/commit/3fbc8d3d69e2614276aee0cf4d325cd084249d74))
* modify component to match new badge structure ([e5874ab](https://github.com/kiva/ui/commit/e5874aba85c79a59b60a6ffae850cc51614a2842))
* stories for all current badges and styles adjusted accordingly ([50e41a0](https://github.com/kiva/ui/commit/50e41a07df7d489a4038dc00469f06951eac1a71))
* user achievements query updated ([#5615](https://github.com/kiva/ui/issues/5615)) ([71160c0](https://github.com/kiva/ui/commit/71160c02ec5e9675250809f1a3eb6d28c861b6a7))

### 🐛 Bugfixes

* add additional error signature filter for pinterest tag ([ea98843](https://github.com/kiva/ui/commit/ea98843806b66bbcdec95f28c50d65a83192758e))
* add more tests and todo description ([309ba85](https://github.com/kiva/ui/commit/309ba85fc5ca45ee068ebb2300e296004d43fea9))
* added basic testing for new badge composable, consolidated tier date fixing ([9e31b28](https://github.com/kiva/ui/commit/9e31b28edf1ae5cc098472dab7060ff68e89ad8a))
* adjust to new square badges ([6f251c0](https://github.com/kiva/ui/commit/6f251c0704b0c0dfa5c7e0b27a21e9a0834727b8))
* combine old and new badge data ([1e07b9d](https://github.com/kiva/ui/commit/1e07b9dcf7074575bdb50985319cd74da2cd3171))
* conflicts ([2040c1a](https://github.com/kiva/ui/commit/2040c1a42fbe33eb885d5d8ea45ac18c0c6ec980))
* hide title in badge completed state ([d15c5f3](https://github.com/kiva/ui/commit/d15c5f3d15d2100eef4c0817120e72c9054f167a))
* hold all achievement data ([fa64544](https://github.com/kiva/ui/commit/fa6454467ce9005a915f1d747045e033fe505e4c))
* lint ([b720162](https://github.com/kiva/ui/commit/b720162f38877525e538f4055e658685951934b0))
* remove px filter, filter out external failed load sentry events ([f5425d0](https://github.com/kiva/ui/commit/f5425d08fe697c70bfc50b840750299d72edddb3))
* renamed file appropriately ([338cc28](https://github.com/kiva/ui/commit/338cc28e5f289dd027ccd3dc2f52183ccd406f13))
* resolve comments and add todos ([72e8fbf](https://github.com/kiva/ui/commit/72e8fbf1d0e57f3cc5fc0d0cbd8542ad2da0cca1))
* small adjustment ([494b698](https://github.com/kiva/ui/commit/494b698961b3fe0912e505ee53e3b722b5e72ed9))
* solve comments ([b105684](https://github.com/kiva/ui/commit/b1056841bf70e332eea2559419d37638ef63899f))
* update method name ([f9ce0b0](https://github.com/kiva/ui/commit/f9ce0b0aedfbc658d7f0692a0a1b5f8562119efb))
* update params for climate action and basic needs ([a74f0ab](https://github.com/kiva/ui/commit/a74f0ab7215188033c96f6efc9d9d6bd9ea1ec19))

### 🪚 Refactors

* create new method to get specific level data from badge ([598f59b](https://github.com/kiva/ui/commit/598f59bfd3d467fe58b125abb213786a25e74c91))

### 🧹 Chores

* filter out addition Failed to fetch calls from 3rd party scripts ([f4d802a](https://github.com/kiva/ui/commit/f4d802acff13ddb7def94154a839990bcacb4efd))
* **release:** 3.2.0-rc.1 [skip ci] ([0753a51](https://github.com/kiva/ui/commit/0753a51a521ea8b8a3dd871db94b5169125c0030)), closes [#5615](https://github.com/kiva/ui/issues/5615)

## [3.2.0-rc.1](https://github.com/kiva/ui/compare/v3.1.0...v3.2.0-rc.1) (2024-10-29)

### 🎉 New Features

* badge in progress content component ([652de6f](https://github.com/kiva/ui/commit/652de6ffc58f7fa8e6c584f5d71e98ce2adc07b1))
* composable for tiered badge data ([90a5086](https://github.com/kiva/ui/commit/90a5086bba0ea5ebdf3f99ef79b27acdaffd7b8c))
* integrate badge modal with completed state ([b998eaf](https://github.com/kiva/ui/commit/b998eafb8ca172be4d4da1f415239e66ee057ec6))
* mechanism for getting and displaying current tier badge data ([3fbc8d3](https://github.com/kiva/ui/commit/3fbc8d3d69e2614276aee0cf4d325cd084249d74))
* modify component to match new badge structure ([e5874ab](https://github.com/kiva/ui/commit/e5874aba85c79a59b60a6ffae850cc51614a2842))
* stories for all current badges and styles adjusted accordingly ([50e41a0](https://github.com/kiva/ui/commit/50e41a07df7d489a4038dc00469f06951eac1a71))
* user achievements query updated ([#5615](https://github.com/kiva/ui/issues/5615)) ([71160c0](https://github.com/kiva/ui/commit/71160c02ec5e9675250809f1a3eb6d28c861b6a7))

### 🐛 Bugfixes

* add additional error signature filter for pinterest tag ([ea98843](https://github.com/kiva/ui/commit/ea98843806b66bbcdec95f28c50d65a83192758e))
* add more tests and todo description ([309ba85](https://github.com/kiva/ui/commit/309ba85fc5ca45ee068ebb2300e296004d43fea9))
* added basic testing for new badge composable, consolidated tier date fixing ([9e31b28](https://github.com/kiva/ui/commit/9e31b28edf1ae5cc098472dab7060ff68e89ad8a))
* adjust to new square badges ([6f251c0](https://github.com/kiva/ui/commit/6f251c0704b0c0dfa5c7e0b27a21e9a0834727b8))
* combine old and new badge data ([1e07b9d](https://github.com/kiva/ui/commit/1e07b9dcf7074575bdb50985319cd74da2cd3171))
* conflicts ([2040c1a](https://github.com/kiva/ui/commit/2040c1a42fbe33eb885d5d8ea45ac18c0c6ec980))
* hide title in badge completed state ([d15c5f3](https://github.com/kiva/ui/commit/d15c5f3d15d2100eef4c0817120e72c9054f167a))
* hold all achievement data ([fa64544](https://github.com/kiva/ui/commit/fa6454467ce9005a915f1d747045e033fe505e4c))
* lint ([b720162](https://github.com/kiva/ui/commit/b720162f38877525e538f4055e658685951934b0))
* remove px filter, filter out external failed load sentry events ([f5425d0](https://github.com/kiva/ui/commit/f5425d08fe697c70bfc50b840750299d72edddb3))
* renamed file appropriately ([338cc28](https://github.com/kiva/ui/commit/338cc28e5f289dd027ccd3dc2f52183ccd406f13))
* resolve comments and add todos ([72e8fbf](https://github.com/kiva/ui/commit/72e8fbf1d0e57f3cc5fc0d0cbd8542ad2da0cca1))
* small adjustment ([494b698](https://github.com/kiva/ui/commit/494b698961b3fe0912e505ee53e3b722b5e72ed9))
* solve comments ([b105684](https://github.com/kiva/ui/commit/b1056841bf70e332eea2559419d37638ef63899f))
* update method name ([f9ce0b0](https://github.com/kiva/ui/commit/f9ce0b0aedfbc658d7f0692a0a1b5f8562119efb))
* update params for climate action and basic needs ([a74f0ab](https://github.com/kiva/ui/commit/a74f0ab7215188033c96f6efc9d9d6bd9ea1ec19))

### 🪚 Refactors

* create new method to get specific level data from badge ([598f59b](https://github.com/kiva/ui/commit/598f59bfd3d467fe58b125abb213786a25e74c91))

### 🧹 Chores

* filter out addition Failed to fetch calls from 3rd party scripts ([f4d802a](https://github.com/kiva/ui/commit/f4d802acff13ddb7def94154a839990bcacb4efd))

## [3.1.0](https://github.com/kiva/ui/compare/v3.0.3...v3.1.0) (2024-10-24)

### 🎉 New Features

* [MP-767] mykiva lending stats ([#5576](https://github.com/kiva/ui/issues/5576)) ([b006486](https://github.com/kiva/ui/commit/b006486e295c741201b2536ef9a2c6a47b692019))
* add badge container with new states to journey ([d492880](https://github.com/kiva/ui/commit/d49288090e238b1ca395eecf4bd88750dfa5dd23))
* add badge tier captions and earn badge button ([3b1ee17](https://github.com/kiva/ui/commit/3b1ee1770361d750754dd3700f5d68292e28047a))
* add initial locked badge version with lock wiggle on click ([bf98056](https://github.com/kiva/ui/commit/bf98056dc3d47a1c7f477e9be3f1097121052306))
* add loan counter on badge image ([37c4664](https://github.com/kiva/ui/commit/37c466409b47114b99e573ff9e952de2fc8d34d0))
* add metadata content in lender profile for badge share ([8887658](https://github.com/kiva/ui/commit/88876585af8e1b8ab8aa18b816a89cf87dcec2c6))
* add outline to in-progress badge and solid shape to locked ([780fc97](https://github.com/kiva/ui/commit/780fc9775b743836d7cb934ef858ea25939ccb98))
* add test to composable ([2f40fa2](https://github.com/kiva/ui/commit/2f40fa22dba81afad7190ed39dfc64d22b0a1a9f))
* borrower and trustee links added to my kiva hero ([#5597](https://github.com/kiva/ui/issues/5597)) ([7f526fe](https://github.com/kiva/ui/commit/7f526fe545e3590bf8a4c8e1269d56708375e59b))
* configurable idle timeout for vue workers ([00b5249](https://github.com/kiva/ui/commit/00b5249023ca860ef102435bf8bde14295773ea4))
* connect badge modal to real data ([aefc166](https://github.com/kiva/ui/commit/aefc1669a60b86d9dd658729225abf9737c1dd05))
* generic modal added for badge states ([#5600](https://github.com/kiva/ui/issues/5600)) ([88b496c](https://github.com/kiva/ui/commit/88b496ce59fd2d6a81cd9407f6723975cc7b81ae))
* implemented badge journey lines ([fd6d061](https://github.com/kiva/ui/commit/fd6d06101aca9e18913007841965e9da43ba9219))
* initial my kiva journey modal content ([d0de14d](https://github.com/kiva/ui/commit/d0de14d0ba45dd2aa022349eed12258bba15d5d5))
* modal content for completed badges ([18fb9d3](https://github.com/kiva/ui/commit/18fb9d3ef9a99f4753ffaf08033d47657985a0d0))
* my kiva badges section ([#5607](https://github.com/kiva/ui/issues/5607)) ([65c5b04](https://github.com/kiva/ui/commit/65c5b046a9f2e0d9f4b024ce600b2f832a621dae))
* my kiva updates section ([#5584](https://github.com/kiva/ui/issues/5584)) ([b24145f](https://github.com/kiva/ui/commit/b24145f5f1013bc16e8d58a2c552dfdb865896c7))
* prevent double-clicking complete registration CTA MP-938 ([c39d113](https://github.com/kiva/ui/commit/c39d113015b17615242e450a6db33a748844361a))
* thanks view tracking MP-921 ([d6eb9c0](https://github.com/kiva/ui/commit/d6eb9c08f1200bbf29e825c366e3121a9fa981c4))
* use kv-components KvLoadingSpinner for KvLoadingOverlay ([c8ed306](https://github.com/kiva/ui/commit/c8ed30619d540b74be0b3fa80c9fbe4089cd6eef))
* validate badge key exist ([3ea45a4](https://github.com/kiva/ui/commit/3ea45a43f55965c724162a7d56ecccbe73fd6885))

### 🐛 Bugfixes

* add badge journey analytics ([454558e](https://github.com/kiva/ui/commit/454558eabfbc2bc0c1e48ca7f8cc316347cbc9a0))
* add composable file ([a751667](https://github.com/kiva/ui/commit/a75166721f5139c27ea30719590c5dc72b1c3d77))
* add correct data to story ([efa1006](https://github.com/kiva/ui/commit/efa1006a1cc38194a16e7ef7652a2e85ae8e7891))
* add missing country id and emits declaration to pass linting ([76776f3](https://github.com/kiva/ui/commit/76776f3ed4338ecae64d2fa88c49c19101d1b6b7))
* add unit tests for composables, fix issues discovered with testing ([8875b53](https://github.com/kiva/ui/commit/8875b5341ac9caadc79dd11f69882cb56379ba08))
* adjusted with most recent changes ([0f14e4f](https://github.com/kiva/ui/commit/0f14e4f491406532b019ff781983ddb9327acdcd))
* classes need to be applied to KvBaseInput wrapper MP-938 ([9b068bb](https://github.com/kiva/ui/commit/9b068bbc5fe924fb21f0c1d9eb32c5914e433d39))
* ensure journey re-renders correctly when different badges are opened ([9875910](https://github.com/kiva/ui/commit/98759104b3c6ea32c060917aa632f7a85adcfbc5))
* ensure test more stable ([dfeb0f6](https://github.com/kiva/ui/commit/dfeb0f6d0f0a2b7a17e9f2938e6502a5550ae29f))
* first name box should only show when names required MP-938 ([1d0bbcb](https://github.com/kiva/ui/commit/1d0bbcb55548125a71cc7f6ca2cda617c2a469f2))
* get loan number in title from badge target ([37c3d66](https://github.com/kiva/ui/commit/37c3d66372135f4107a73b10fafcf98eb550debe))
* handle date format ([63ed680](https://github.com/kiva/ui/commit/63ed680cee199268434a4b87d10de577e31e46cf))
* hasDespositedBefore cookie not used where it should be ([a8c9906](https://github.com/kiva/ui/commit/a8c99063bc8d1e0f3e69c29105e66663969b9c5e))
* hide journey lines until badge image loads ([7fde30d](https://github.com/kiva/ui/commit/7fde30d88b15ba109cddf3891fe11e3fbf9b7335))
* linting ([9b19d8d](https://github.com/kiva/ui/commit/9b19d8d4422293adb973df96c2ebb0784d058f8b))
* merge badge story data ([49777c4](https://github.com/kiva/ui/commit/49777c42f04a9de363f349ad545b55277ac18874))
* missing file ([accbc87](https://github.com/kiva/ui/commit/accbc87cd076ad64350ee089d2d0203998eb4431))
* random issues resolved with my kiva work ([a598b57](https://github.com/kiva/ui/commit/a598b575cb72aac4b328d91bde6f93d41d5028a9))
* remove embed exp ([771bff0](https://github.com/kiva/ui/commit/771bff0c15867a2035751a15280c6e6deee3e096))
* resolve a couple console warnings and errors ([302c034](https://github.com/kiva/ui/commit/302c03476cd1a32b24864fc565085fe09526c029))
* resolve console warning for carousel ([4756361](https://github.com/kiva/ui/commit/475636106ed9a9f395e8300d9b69375c6aef8559))
* solve comments ([3226745](https://github.com/kiva/ui/commit/3226745989f0634f7b5f1cf02ee48b1a130c34c0))
* update new event tag names MP-921 ([c7adb1d](https://github.com/kiva/ui/commit/c7adb1d473e1a847fc0122e10b2bc4ee36853055))
* validation checks were changed to invalid when they should have stayed error MP-938 ([f664ead](https://github.com/kiva/ui/commit/f664ead5a3e7dcf38d429a38dcf7c30995068b1a))

### 🪚 Refactors

* move thanks visible view logic from template to computed value MP-921 ([ede678b](https://github.com/kiva/ui/commit/ede678bd6a1268736abd97c2f9ee0bd75b5b1a9f))
* separate lending achievement mock to different file ([96741dc](https://github.com/kiva/ui/commit/96741dcf53e4e9d6ef7da359e999879cec28f8f7))
* use composable for loading badge info ([874c2d5](https://github.com/kiva/ui/commit/874c2d54d9d9374abcabb04b69a1c50916b65f2d))

### 🧹 Chores

* **release:** 3.1.0-rc.1 [skip ci] ([85be008](https://github.com/kiva/ui/commit/85be00821406ecadb371b1fba0d477af9ab07f1d)), closes [#5576](https://github.com/kiva/ui/issues/5576) [#5597](https://github.com/kiva/ui/issues/5597) [#5600](https://github.com/kiva/ui/issues/5600) [#5607](https://github.com/kiva/ui/issues/5607) [#5584](https://github.com/kiva/ui/issues/5584)

## [3.1.0-rc.1](https://github.com/kiva/ui/compare/v3.0.3...v3.1.0-rc.1) (2024-10-24)

### 🎉 New Features

* [MP-767] mykiva lending stats ([#5576](https://github.com/kiva/ui/issues/5576)) ([b006486](https://github.com/kiva/ui/commit/b006486e295c741201b2536ef9a2c6a47b692019))
* add badge container with new states to journey ([d492880](https://github.com/kiva/ui/commit/d49288090e238b1ca395eecf4bd88750dfa5dd23))
* add badge tier captions and earn badge button ([3b1ee17](https://github.com/kiva/ui/commit/3b1ee1770361d750754dd3700f5d68292e28047a))
* add initial locked badge version with lock wiggle on click ([bf98056](https://github.com/kiva/ui/commit/bf98056dc3d47a1c7f477e9be3f1097121052306))
* add loan counter on badge image ([37c4664](https://github.com/kiva/ui/commit/37c466409b47114b99e573ff9e952de2fc8d34d0))
* add metadata content in lender profile for badge share ([8887658](https://github.com/kiva/ui/commit/88876585af8e1b8ab8aa18b816a89cf87dcec2c6))
* add outline to in-progress badge and solid shape to locked ([780fc97](https://github.com/kiva/ui/commit/780fc9775b743836d7cb934ef858ea25939ccb98))
* add test to composable ([2f40fa2](https://github.com/kiva/ui/commit/2f40fa22dba81afad7190ed39dfc64d22b0a1a9f))
* borrower and trustee links added to my kiva hero ([#5597](https://github.com/kiva/ui/issues/5597)) ([7f526fe](https://github.com/kiva/ui/commit/7f526fe545e3590bf8a4c8e1269d56708375e59b))
* configurable idle timeout for vue workers ([00b5249](https://github.com/kiva/ui/commit/00b5249023ca860ef102435bf8bde14295773ea4))
* connect badge modal to real data ([aefc166](https://github.com/kiva/ui/commit/aefc1669a60b86d9dd658729225abf9737c1dd05))
* generic modal added for badge states ([#5600](https://github.com/kiva/ui/issues/5600)) ([88b496c](https://github.com/kiva/ui/commit/88b496ce59fd2d6a81cd9407f6723975cc7b81ae))
* implemented badge journey lines ([fd6d061](https://github.com/kiva/ui/commit/fd6d06101aca9e18913007841965e9da43ba9219))
* initial my kiva journey modal content ([d0de14d](https://github.com/kiva/ui/commit/d0de14d0ba45dd2aa022349eed12258bba15d5d5))
* modal content for completed badges ([18fb9d3](https://github.com/kiva/ui/commit/18fb9d3ef9a99f4753ffaf08033d47657985a0d0))
* my kiva badges section ([#5607](https://github.com/kiva/ui/issues/5607)) ([65c5b04](https://github.com/kiva/ui/commit/65c5b046a9f2e0d9f4b024ce600b2f832a621dae))
* my kiva updates section ([#5584](https://github.com/kiva/ui/issues/5584)) ([b24145f](https://github.com/kiva/ui/commit/b24145f5f1013bc16e8d58a2c552dfdb865896c7))
* prevent double-clicking complete registration CTA MP-938 ([c39d113](https://github.com/kiva/ui/commit/c39d113015b17615242e450a6db33a748844361a))
* thanks view tracking MP-921 ([d6eb9c0](https://github.com/kiva/ui/commit/d6eb9c08f1200bbf29e825c366e3121a9fa981c4))
* use kv-components KvLoadingSpinner for KvLoadingOverlay ([c8ed306](https://github.com/kiva/ui/commit/c8ed30619d540b74be0b3fa80c9fbe4089cd6eef))
* validate badge key exist ([3ea45a4](https://github.com/kiva/ui/commit/3ea45a43f55965c724162a7d56ecccbe73fd6885))

### 🐛 Bugfixes

* add badge journey analytics ([454558e](https://github.com/kiva/ui/commit/454558eabfbc2bc0c1e48ca7f8cc316347cbc9a0))
* add composable file ([a751667](https://github.com/kiva/ui/commit/a75166721f5139c27ea30719590c5dc72b1c3d77))
* add correct data to story ([efa1006](https://github.com/kiva/ui/commit/efa1006a1cc38194a16e7ef7652a2e85ae8e7891))
* add missing country id and emits declaration to pass linting ([76776f3](https://github.com/kiva/ui/commit/76776f3ed4338ecae64d2fa88c49c19101d1b6b7))
* add unit tests for composables, fix issues discovered with testing ([8875b53](https://github.com/kiva/ui/commit/8875b5341ac9caadc79dd11f69882cb56379ba08))
* adjusted with most recent changes ([0f14e4f](https://github.com/kiva/ui/commit/0f14e4f491406532b019ff781983ddb9327acdcd))
* classes need to be applied to KvBaseInput wrapper MP-938 ([9b068bb](https://github.com/kiva/ui/commit/9b068bbc5fe924fb21f0c1d9eb32c5914e433d39))
* ensure journey re-renders correctly when different badges are opened ([9875910](https://github.com/kiva/ui/commit/98759104b3c6ea32c060917aa632f7a85adcfbc5))
* ensure test more stable ([dfeb0f6](https://github.com/kiva/ui/commit/dfeb0f6d0f0a2b7a17e9f2938e6502a5550ae29f))
* first name box should only show when names required MP-938 ([1d0bbcb](https://github.com/kiva/ui/commit/1d0bbcb55548125a71cc7f6ca2cda617c2a469f2))
* get loan number in title from badge target ([37c3d66](https://github.com/kiva/ui/commit/37c3d66372135f4107a73b10fafcf98eb550debe))
* handle date format ([63ed680](https://github.com/kiva/ui/commit/63ed680cee199268434a4b87d10de577e31e46cf))
* hasDespositedBefore cookie not used where it should be ([a8c9906](https://github.com/kiva/ui/commit/a8c99063bc8d1e0f3e69c29105e66663969b9c5e))
* hide journey lines until badge image loads ([7fde30d](https://github.com/kiva/ui/commit/7fde30d88b15ba109cddf3891fe11e3fbf9b7335))
* linting ([9b19d8d](https://github.com/kiva/ui/commit/9b19d8d4422293adb973df96c2ebb0784d058f8b))
* merge badge story data ([49777c4](https://github.com/kiva/ui/commit/49777c42f04a9de363f349ad545b55277ac18874))
* missing file ([accbc87](https://github.com/kiva/ui/commit/accbc87cd076ad64350ee089d2d0203998eb4431))
* random issues resolved with my kiva work ([a598b57](https://github.com/kiva/ui/commit/a598b575cb72aac4b328d91bde6f93d41d5028a9))
* remove embed exp ([771bff0](https://github.com/kiva/ui/commit/771bff0c15867a2035751a15280c6e6deee3e096))
* resolve a couple console warnings and errors ([302c034](https://github.com/kiva/ui/commit/302c03476cd1a32b24864fc565085fe09526c029))
* resolve console warning for carousel ([4756361](https://github.com/kiva/ui/commit/475636106ed9a9f395e8300d9b69375c6aef8559))
* solve comments ([3226745](https://github.com/kiva/ui/commit/3226745989f0634f7b5f1cf02ee48b1a130c34c0))
* update new event tag names MP-921 ([c7adb1d](https://github.com/kiva/ui/commit/c7adb1d473e1a847fc0122e10b2bc4ee36853055))
* validation checks were changed to invalid when they should have stayed error MP-938 ([f664ead](https://github.com/kiva/ui/commit/f664ead5a3e7dcf38d429a38dcf7c30995068b1a))

### 🪚 Refactors

* move thanks visible view logic from template to computed value MP-921 ([ede678b](https://github.com/kiva/ui/commit/ede678bd6a1268736abd97c2f9ee0bd75b5b1a9f))
* separate lending achievement mock to different file ([96741dc](https://github.com/kiva/ui/commit/96741dcf53e4e9d6ef7da359e999879cec28f8f7))
* use composable for loading badge info ([874c2d5](https://github.com/kiva/ui/commit/874c2d54d9d9374abcabb04b69a1c50916b65f2d))

## [3.0.3](https://github.com/kiva/ui/compare/v3.0.2...v3.0.3) (2024-10-09)

### 🐛 Bugfixes

* analytics directive ([da29cc4](https://github.com/kiva/ui/commit/da29cc4f992d5267b0b62dd1a2d0933591c66297))

### 🧹 Chores

* identify themes issue MP-921 ([3e05e03](https://github.com/kiva/ui/commit/3e05e03bb3131ba7453b7e72cf3b5c87e759d3d0))
* **release:** 3.0.3-rc.1 [skip ci] ([c6d52fd](https://github.com/kiva/ui/commit/c6d52fd3e6dabe1a0b6e6fe46e14bc9410743b91))
* remove debug log MP-921 ([9e1a7f7](https://github.com/kiva/ui/commit/9e1a7f7f81c867f3eca9e9ea24d231ccd7a0d5cf))

## [3.0.3-rc.1](https://github.com/kiva/ui/compare/v3.0.2...v3.0.3-rc.1) (2024-10-09)

### 🐛 Bugfixes

* analytics directive ([da29cc4](https://github.com/kiva/ui/commit/da29cc4f992d5267b0b62dd1a2d0933591c66297))

### 🧹 Chores

* identify themes issue MP-921 ([3e05e03](https://github.com/kiva/ui/commit/3e05e03bb3131ba7453b7e72cf3b5c87e759d3d0))
* remove debug log MP-921 ([9e1a7f7](https://github.com/kiva/ui/commit/9e1a7f7f81c867f3eca9e9ea24d231ccd7a0d5cf))

## [3.0.2](https://github.com/kiva/ui/compare/v3.0.1...v3.0.2) (2024-10-08)

### 🐛 Bugfixes

* add client version of route to preFetch methods that use it ([3e65159](https://github.com/kiva/ui/commit/3e65159d3ef7332794e558991a0952f18fe3907f))
* remove lender route console log ([3838999](https://github.com/kiva/ui/commit/383899904bb90530d69c0be1f64ed7c8f9c929bd))

### 🧹 Chores

* **release:** 3.0.2-rc.1 [skip ci] ([abea71d](https://github.com/kiva/ui/commit/abea71d6eb2f4b0e193d272c4fadfe17f6baa650))
* update kv-shop + kv-components ([0732c07](https://github.com/kiva/ui/commit/0732c073bf42e0c42da7e362e2e753e4d0eefd02))

## [3.0.2-rc.1](https://github.com/kiva/ui/compare/v3.0.1...v3.0.2-rc.1) (2024-10-08)

### 🐛 Bugfixes

* add client version of route to preFetch methods that use it ([3e65159](https://github.com/kiva/ui/commit/3e65159d3ef7332794e558991a0952f18fe3907f))
* remove lender route console log ([3838999](https://github.com/kiva/ui/commit/383899904bb90530d69c0be1f64ed7c8f9c929bd))

### 🧹 Chores

* update kv-shop + kv-components ([0732c07](https://github.com/kiva/ui/commit/0732c073bf42e0c42da7e362e2e753e4d0eefd02))

## [3.0.1](https://github.com/kiva/ui/compare/v3.0.0...v3.0.1) (2024-10-08)

### 🐛 Bugfixes

* ensure route values during client page load ([af36ceb](https://github.com/kiva/ui/commit/af36cebaca460ce4300c61042aebd9ed2a253f01))
* guard printableKivaCards with kivaCards ([4044b51](https://github.com/kiva/ui/commit/4044b51581d6a8d2cadaf253601c0c56dc3de73b))
* the server uses route.value, client uses route due to in-page transition ([b02a50c](https://github.com/kiva/ui/commit/b02a50cc45a81c7681fc6125c4674abc036a53cf))
* use default page number of 0 if no page number is passed in ([e78b4b6](https://github.com/kiva/ui/commit/e78b4b684b17cdac5e7b14a13b299fb36f7fe16c))

### 🧹 Chores

* **release:** 3.0.1-rc.1 [skip ci] ([be0b789](https://github.com/kiva/ui/commit/be0b7893859b91178194427e7a6ae217f3bc51bf))

## [3.0.1-rc.1](https://github.com/kiva/ui/compare/v3.0.0...v3.0.1-rc.1) (2024-10-08)

### 🐛 Bugfixes

* ensure route values during client page load ([af36ceb](https://github.com/kiva/ui/commit/af36cebaca460ce4300c61042aebd9ed2a253f01))
* guard printableKivaCards with kivaCards ([4044b51](https://github.com/kiva/ui/commit/4044b51581d6a8d2cadaf253601c0c56dc3de73b))
* the server uses route.value, client uses route due to in-page transition ([b02a50c](https://github.com/kiva/ui/commit/b02a50cc45a81c7681fc6125c4674abc036a53cf))
* use default page number of 0 if no page number is passed in ([e78b4b6](https://github.com/kiva/ui/commit/e78b4b684b17cdac5e7b14a13b299fb36f7fe16c))

## [3.0.0](https://github.com/kiva/ui/compare/v2.759.0...v3.0.0) (2024-10-07)

### ⚠ BREAKING CHANGES

* import.meta support required. Baidu, QQ, UC, and KaiOs browsers not supported.
* only supports Vue 3 APIs and only provides Vue 3 components

### 🎉 New Features

* adding new condition to redirect to challenge page ([a562fc9](https://github.com/kiva/ui/commit/a562fc986c6bae23db330815b01466c8c534239e))
* create borrower status card ([1cfeb70](https://github.com/kiva/ui/commit/1cfeb702c2f4c93ed0a2cea3445ce42231d8680b))
* create component to show in progress badge ([10d7af1](https://github.com/kiva/ui/commit/10d7af1939971e83a898013dfee59c3bec28f7d6))
* edit sitemap path params MP-880 ([e74aad4](https://github.com/kiva/ui/commit/e74aad492bc9a60672f5555d95401ba12f78ac93))
* get active loans ([894d4c5](https://github.com/kiva/ui/commit/894d4c557bfcbf3c09c404822f60228ce748fb86))
* message added for failed message sent ([#5567](https://github.com/kiva/ui/issues/5567)) ([1bf66ef](https://github.com/kiva/ui/commit/1bf66ef765c49274c491805e21e7d8dffcd2043d))
* migrate to vue 3 ([ef9cd09](https://github.com/kiva/ui/commit/ef9cd09163aa37b9ea8a20ed217838c014d67d5c))
* move redirect routes to own section of sitemap MP-880 ([ece45b6](https://github.com/kiva/ui/commit/ece45b68231069fa5807be28eb7bb9e69703343c))
* my kiva carousel component for borrower status card ([abbc34d](https://github.com/kiva/ui/commit/abbc34d0846f2be8cab76a0736d6b4c141d7be8e))
* my kiva navigation ([#5521](https://github.com/kiva/ui/issues/5521)) ([02ddb2e](https://github.com/kiva/ui/commit/02ddb2ee625de8a383c9ff713f869e35bd07f60f))
* mykiva components switched to composition api ([#5543](https://github.com/kiva/ui/issues/5543)) ([a225fbb](https://github.com/kiva/ui/commit/a225fbbb258b7738a1202688b1592709d0d1f3a5))
* only support modern browsers ([78fdf26](https://github.com/kiva/ui/commit/78fdf26230b6a383956cc579aaa26e2ccee29f74))
* render preload links for js and css used during render ([61e80af](https://github.com/kiva/ui/commit/61e80af6bf33275258d27b8b990931b5b1ff59dd))
* use custom dash ([4ee0470](https://github.com/kiva/ui/commit/4ee0470ec79494dd030b17cb99f959e33413077b))

### 🐛 Bugfixes

* $isServer no longer exists in Vue 3 ([125e330](https://github.com/kiva/ui/commit/125e330040199d1389785c38bb1955d2e5405e46))
* a small collection of stories fixed, added support for the async component in KvIcon ([2b9f0f1](https://github.com/kiva/ui/commit/2b9f0f1ddbde7851e7b38787dd7287aba4e7b003))
* access correct async page view method (encountered when changing filters on category page) ([80a6be8](https://github.com/kiva/ui/commit/80a6be8f5b6f2b4942e7e54d9164f97c2c13d56e))
* add back in old vuelidate library so project still builds/validates ([03d3a63](https://github.com/kiva/ui/commit/03d3a630afc6a12943910304511fffe4f70222f8))
* add filters support for storybook ([90b3657](https://github.com/kiva/ui/commit/90b3657495067c085a5a06cce2ba3dc33baeb8f2))
* add padding to ad update form date ([2a3a0f5](https://github.com/kiva/ui/commit/2a3a0f51dca3ddf8da44089d24e830fc972d75af))
* add request for new ID field on userAchievementProgress ([c16b6c6](https://github.com/kiva/ui/commit/c16b6c699495c007bad873d9140b0b818197a2fa))
* add SVGs to HTML for KvIcon ([688422d](https://github.com/kiva/ui/commit/688422dc6ce58178f2a669dae2d0b97f48e98804))
* add watcher to update state when lightbox opens, remove deprecated click attribute ([04cf84f](https://github.com/kiva/ui/commit/04cf84f7d577b04f20289592484bbd2f28620aa0))
* adding optional chaining for counting loans method ([e03918d](https://github.com/kiva/ui/commit/e03918d9adf7a0a4ce9fe6a616480143eb80daac))
* additional ESM work related to jest testing ([c4b1a9e](https://github.com/kiva/ui/commit/c4b1a9ece9e0fee85531725e30e255943369080e))
* additional unit test spec fixes and component fixes ([5cbb962](https://github.com/kiva/ui/commit/5cbb96279881019123d3390d1d4969eff3a1d53e))
* additional unit testing fixes ([e819357](https://github.com/kiva/ui/commit/e8193576d6eb7ed83443e1e970af12fc7b07baf6))
* address errors/warnings with story ([7f9290a](https://github.com/kiva/ui/commit/7f9290a644029e2da0ffc5e08b0a1d794c737dd5))
* adjust Caddy to support vite HMR ([12cf02b](https://github.com/kiva/ui/commit/12cf02be285ce7011f52568cc3ce8fcd92916a5a))
* adjust css bg image urls ([359387b](https://github.com/kiva/ui/commit/359387b058747749a7546ba6a482c90229d54ece))
* adjust manifest URLs to prevent errors in dev (full URL still needed for built app) ([c172d31](https://github.com/kiva/ui/commit/c172d31807f515ed4db2fe6becd1a4675bd22413))
* adjust some deep selectors ([15f31cb](https://github.com/kiva/ui/commit/15f31cbc2032913d301da29c1b35761d40dfdaac))
* another deep ([5a52a51](https://github.com/kiva/ui/commit/5a52a519ac20f103c3481382d5b2d8021c9eae72))
* another deep css tweak ([0de1bb3](https://github.com/kiva/ui/commit/0de1bb3e59dd91e661ac8359f77530619e6b3fdb))
* another form update ([c53fbdd](https://github.com/kiva/ui/commit/c53fbdd7e043611bcf8ff7845758ffe713f5d90a))
* attempt retry after network error before logging the error ([d5db0a9](https://github.com/kiva/ui/commit/d5db0a9110d5e663fb215b2bd78f485caffbbc78))
* borrower profile lend cta animation wasn't working correctly ([d94477c](https://github.com/kiva/ui/commit/d94477c16ec7a3e722769345f4c23d5c1efbfc55))
* borrower profile route access needed to be changed ([d1a77a1](https://github.com/kiva/ui/commit/d1a77a1d1fb976c67de0c4204676c98d3acaa703))
* braintree css overrides weren't working ([6a32b97](https://github.com/kiva/ui/commit/6a32b973a1e4c9b0e3f0f22db814fdef2cf7077d))
* cache set error when typesJSON is undefined ([24efeb5](https://github.com/kiva/ui/commit/24efeb5f0a059f151402c847de5bbd5215ecfa98))
* calculate next payment date ([096637a](https://github.com/kiva/ui/commit/096637a9e8c2369c1afb9b67bb0eeed11334292a))
* cause selector input needs to declare events emitted MP-873 ([d2cf2c8](https://github.com/kiva/ui/commit/d2cf2c8b513b4de4b2d13d3e262ca3ceaf17c90b))
* change logic to avoid redirect if experiment is active ([2a9de74](https://github.com/kiva/ui/commit/2a9de746ac05970e5090c657f9711806bda1d7cb))
* change storybook build generated js filenames so they do not start with underscores ([d244f08](https://github.com/kiva/ui/commit/d244f081ee25ca3691648c1dd49efc5c99d67ea4))
* change video import to work in storybook without new alias ([d053994](https://github.com/kiva/ui/commit/d053994249305cdf4511973b422cc307d0446673))
* checkboxes weren't working like expected (solved for the email settings page specifically) ([1ed955a](https://github.com/kiva/ui/commit/1ed955a2a97d01e0c974f429217fc18137eef074))
* checking status to know if a loan is fundraising ([abc2c50](https://github.com/kiva/ui/commit/abc2c50174302ed71a5de9c753555ef8c5b4a555))
* cleaned up story mock data ([da61990](https://github.com/kiva/ui/commit/da61990a579017f5752734373d661a012df0ec4d))
* client entry name in index.html ([e0a179f](https://github.com/kiva/ui/commit/e0a179f7a462f9c17eee4898e3297234b6ccf4ca))
* comment out vue router in storybook preview ([b3f3ad5](https://github.com/kiva/ui/commit/b3f3ad51d582e2cd10dad2d56a36d8cbe7fa3ea2))
* custom radio button wasn't working (found on payment settings page) ([9baaae5](https://github.com/kiva/ui/commit/9baaae5cb5c2a32dc30838a65fe9f61b8f5f3781))
* default slot is now a method ([bc22c53](https://github.com/kiva/ui/commit/bc22c5333eae0d34ee90d28263cb875c30ea23f4))
* default value for themes and tags ([b120c5b](https://github.com/kiva/ui/commit/b120c5bcda49ae8446af75fbc2099a4695b05a38))
* definition of completed loans ([b730d3b](https://github.com/kiva/ui/commit/b730d3bcb1d3007513b67b37804dc756604c90d4))
* disable was needed for unit tests in pipeline ([2d98e46](https://github.com/kiva/ui/commit/2d98e467ae38f68930a1f156b66362298ccfca98))
* done url after auth guard, done url not being empty string, team filter to url ([85109d0](https://github.com/kiva/ui/commit/85109d03b61c5b15a3ac9053632711ae228bcb1c))
* dynamic rich text rendering ([ba24489](https://github.com/kiva/ui/commit/ba24489c1ac723d08c60f3e1545264780d091499))
* emitted events need to be declared in components for vue to handle them correctly MP-901 ([621935a](https://github.com/kiva/ui/commit/621935a759f5c53a08399e964799afc709b40fa7))
* ensure category page loads correctly via browser back/forward buttons ([8e5c83f](https://github.com/kiva/ui/commit/8e5c83fde6b364c046ea9932fe29b11cf2197d5f))
* ensure icons load on category page ([97fd051](https://github.com/kiva/ui/commit/97fd0516262a73cc7def65247b6ecd989382a570))
* ensure responsive image component renders correctly ([2dd7155](https://github.com/kiva/ui/commit/2dd71553ca344976b7be6b05806985b8e0625a5d))
* event names for listeners must be hyphenated ([067e3a7](https://github.com/kiva/ui/commit/067e3a79dba97a2b140f57a11c88a9415f0b7c50))
* file disables didn't work for push eslint ([e62aaa2](https://github.com/kiva/ui/commit/e62aaa2ebadb98c70ab9ec485c72141c22a35bc2))
* filter out null values from queries used on LBC ([ec8b170](https://github.com/kiva/ui/commit/ec8b170f5265fac42b7326aa1b3da3cf7c49558d))
* fix default thanks page rendering ([ee1fab3](https://github.com/kiva/ui/commit/ee1fab366b839fd584ef1c2ff000d25a6e3ac981))
* fix how treemap commonjs module was being imported ([cbb906d](https://github.com/kiva/ui/commit/cbb906d106b451341176d16d67c862546fc74c0b))
* fixed height ([7e30676](https://github.com/kiva/ui/commit/7e306769f60ff45408331641f0e627b312c02d90))
* get unit tests passing again ([8adede0](https://github.com/kiva/ui/commit/8adede05200ac0c2c00663030ad78061c96ea2e1))
* get vue router to work with overriding query string in stories ([c163d85](https://github.com/kiva/ui/commit/c163d8598dc12bbb4273d30d0b4d9c8ac0f02ead))
* **getDeepComponents:** handle vue 3 async components ([9d16b5f](https://github.com/kiva/ui/commit/9d16b5f1ae22d31587abeb116d44d4a831032cda))
* getGqlPossibleTypes expects a memcache instance ([6cc890c](https://github.com/kiva/ui/commit/6cc890c4512b7b15a4764d29d9993c8f1df2a109))
* handle no match found warnings with catch-all route ([11abec5](https://github.com/kiva/ui/commit/11abec58206872d88d8617e4f3fd72c6a4d33bc8))
* horizontal overflow hidden in my kiva nav ([#5533](https://github.com/kiva/ui/issues/5533)) ([c23b6b9](https://github.com/kiva/ui/commit/c23b6b9836e44e5cbd2fc55031783d33467f8725))
* hydration and missing content on mg page ([08b3bbb](https://github.com/kiva/ui/commit/08b3bbb5a44e2f9e9e31d22691d81a06fe62a63d))
* image glob instead of require for thanks page component ([5cffd44](https://github.com/kiva/ui/commit/5cffd44fb45f3464fa18de98ba01c2c341857759))
* import svg urls for image sources ([855bf5b](https://github.com/kiva/ui/commit/855bf5b659c6d796f2abc852ad95bdc2e2323926))
* install mitt event bus, update dev-inspect command with tailwind-watch ([fc4f2e4](https://github.com/kiva/ui/commit/fc4f2e4da0b1a59019bc0c25d3a3193f2dada040))
* iwd has false value causing the redirect ([1d66315](https://github.com/kiva/ui/commit/1d66315ce1983e46780c9a86973978ba31d3a96f))
* lend/filter page now loads successfully and can be interacted with ([515ac80](https://github.com/kiva/ui/commit/515ac801ae9f8f27c5ee0110af8f56fe0f0aeca1))
* lender profile stats bugs fixed ([#5564](https://github.com/kiva/ui/issues/5564)) ([74cac0b](https://github.com/kiva/ui/commit/74cac0be2908d98445da4e6afa6c62bd986c57b5))
* lint ([fa7d7f3](https://github.com/kiva/ui/commit/fa7d7f33bebf8bf28043cfb0926e8aad8c349383))
* lint ([d1f80c2](https://github.com/kiva/ui/commit/d1f80c2d3f1822cc0a91a2b3f8c7986318cb9d3e))
* linting ([bf6fca2](https://github.com/kiva/ui/commit/bf6fca213fa08e07bdb6c266a58adece99cdab42))
* linting ([bfd3bbd](https://github.com/kiva/ui/commit/bfd3bbddd7f211c12a3bda8a16231468f7dda0cc))
* linting again ([bd3dcd9](https://github.com/kiva/ui/commit/bd3dcd997705bc9eca543e584bbbd48b744d8ea0))
* linting issues ([2e8b31f](https://github.com/kiva/ui/commit/2e8b31f01ba6eba7ee6bc358517e2143e4ce59d2))
* load app logo svgs with ?url ([feba00d](https://github.com/kiva/ui/commit/feba00d491d59362783ed8f3e3f561e44d062678))
* load lending stats even with gql error ([1d8a56f](https://github.com/kiva/ui/commit/1d8a56f3e0234a537c01135437292a2b5aa38048))
* loading placeholder and handle negative dates ([4becfd9](https://github.com/kiva/ui/commit/4becfd968553baaefb314468b3051f4b1965b3cb))
* location filters on lend-by-category ([86b52c5](https://github.com/kiva/ui/commit/86b52c536b26aebfdcf8e921161349f9d98275b6))
* make replacing tracer quicker ([ae0c70a](https://github.com/kiva/ui/commit/ae0c70ad6345f2ec5cddef8d3167865a14560ea6))
* make vite load everything behind the static path in dev mode, helps fix tilt ([60f7ec3](https://github.com/kiva/ui/commit/60f7ec32a3c1c6b1e5fd7952904cd28edfa90a58))
* matching text component fix for category page help me choose section ([e1f8ccc](https://github.com/kiva/ui/commit/e1f8ccccf150f4707d52f41b6c2ae554e155044f))
* migrate all vuelidate forms to the new pattern ([9a9b6eb](https://github.com/kiva/ui/commit/9a9b6eb4058b9fa0cb603aebcd2c741e1bb0b0b9))
* missed a server change update on checkout page ([8ee0aaf](https://github.com/kiva/ui/commit/8ee0aaffb4a37265bd32d876bfbd3c815a657730))
* missing final package changes from merge ([252495b](https://github.com/kiva/ui/commit/252495b3e8e042b3492d6d69de75805363b1dfd5))
* missing tracking and buttons ([8a1ba24](https://github.com/kiva/ui/commit/8a1ba24ce5569c887e33423bccf3f8d8218319f2))
* monthly good and auto deposit calculations doing string concat instead of addition MP-882 ([51411c5](https://github.com/kiva/ui/commit/51411c5bd4979c3f2396c60d0b3ea4ef29b2cc9a))
* more icons now work (sprites didn't work in storybook before either) ([329f527](https://github.com/kiva/ui/commit/329f527138eb162df9cd58316dbc74d273bd7a41))
* more linting fixes ([afee5a4](https://github.com/kiva/ui/commit/afee5a4a6f2d3912cf2d3446b91be6ee7afaaed0))
* more story fixes ([dace761](https://github.com/kiva/ui/commit/dace761dfb08dc1f17abc9b774b5e73699fd15ab))
* more story fixes ([0b7002d](https://github.com/kiva/ui/commit/0b7002d1769f06822a14ca11307e673477927ece))
* more story issues resolved ([0d1054d](https://github.com/kiva/ui/commit/0d1054d65d2872ee5386cf10a7165be195eed3f2))
* more story updates ([cd2f0f3](https://github.com/kiva/ui/commit/cd2f0f3d67cc5caf7b4ade636ce74629f022c714))
* more unit test fixes ([9cbee44](https://github.com/kiva/ui/commit/9cbee44885a631b3499b1448a6267959ac3987e2))
* my kiva experiment setup fixed ([#5551](https://github.com/kiva/ui/issues/5551)) ([66ecd71](https://github.com/kiva/ui/commit/66ecd7190228069f8530b8a7a0f58203d77cbc5e))
* new vue render method removes whitespace ([1d14a86](https://github.com/kiva/ui/commit/1d14a8694ac8d64fdac87217d7dfbdb01e4878bc))
* one last linting error ([88c84b9](https://github.com/kiva/ui/commit/88c84b92af58fff7ad9e8115711e5caacb1afe34))
* pass error to next to ensure auth guard redirect, remove lodash usage ([1f40682](https://github.com/kiva/ui/commit/1f406821f910e2629d83c253b83696dd9abaac0d))
* pass null instead of all, which is not an enum option, in team leaderboard category field ([486db0f](https://github.com/kiva/ui/commit/486db0fc75e56519c6bd5de247c6c6b79f6226aa))
* prefetch route is now a ref ([e5d4325](https://github.com/kiva/ui/commit/e5d43255f2c276c37c42bc8cb1e5f9feb151a7ba))
* prefetch wasn't working correctly for navigation with the vue router ([af4a0ff](https://github.com/kiva/ui/commit/af4a0ffee87f332684b4364127f005cf7f6213dc))
* props and attrs not set correctly on buttons MP-858 ([92faca3](https://github.com/kiva/ui/commit/92faca371933028ace07649f8df72862d207aa27))
* qr code prop was wrong type ([72d3144](https://github.com/kiva/ui/commit/72d3144c554a2d2639ab9c97fec5ac69f133257a))
* quiet console.warn for live loan fetch tests ([0e1fbd5](https://github.com/kiva/ui/commit/0e1fbd5689fbbb86b252caa12205ab15481205aa))
* radio can default as null ([46479e4](https://github.com/kiva/ui/commit/46479e4853030cf552ededc9b5ad0a2f085d6224))
* reactive loans ([9971d6d](https://github.com/kiva/ui/commit/9971d6d0a1ee306777f27168104dc7f680fa0a1e))
* redirect to error if contentful entry is missing, fix dynamic rendering mode in the client ([12a9210](https://github.com/kiva/ui/commit/12a921028dea46bedb5765e9af9339f4b219e071))
* register social page/form now working ([3312852](https://github.com/kiva/ui/commit/331285235542882bdff950c7b97f93cb5f1cb4d8))
* remaining changes to enable all logged-out features of lend/filter ([1716cc0](https://github.com/kiva/ui/commit/1716cc0a399250cc5a2f860ecc1a315bfcf0bc4d))
* remaining initial story tweaks for storybook 8 ([e51e82a](https://github.com/kiva/ui/commit/e51e82ab2da9c81cb2004235311e5e97b3cf1987))
* remove another this reference in a template ([b66ae01](https://github.com/kiva/ui/commit/b66ae01a59f7888b3875e1d63f4f6291fb9ef784))
* remove ci branch option ([4eae068](https://github.com/kiva/ui/commit/4eae068757c69a35b14db71cedfacfcc0104d8aa))
* remove component no longer used ([627fbf1](https://github.com/kiva/ui/commit/627fbf1583e0957257d2836f24667d92c686fb46))
* remove depreacted .native modifier ([24375b3](https://github.com/kiva/ui/commit/24375b3055ae5ceaaf4b95b2845c4dbbbac0152a))
* remove deprecated filter ([524819c](https://github.com/kiva/ui/commit/524819c9a9eb059098792042fed8fdc2fef9063f))
* remove duplicate id=app ([16b0555](https://github.com/kiva/ui/commit/16b055522ee0c5be716d45e7a8c278900b99c3d8))
* remove extra template tags creating render issues ([153fee4](https://github.com/kiva/ui/commit/153fee43605394c976c496be2e49e21b4acb80c2))
* remove old postcss deep syntax ([f995b32](https://github.com/kiva/ui/commit/f995b3212c5138ac9019caf55e0bc6694c16eb25))
* remove this reference from template ([3ac0bac](https://github.com/kiva/ui/commit/3ac0bac33fea843e24d4f8ea74b78b206c0e78fe))
* remove this. from templates, resolve issue with transition having more than one child ([5fc685d](https://github.com/kiva/ui/commit/5fc685d3f2a3466988ca80782e21033242b846cf))
* remove unused KvRangeSlider component ([909b5cc](https://github.com/kiva/ui/commit/909b5cc049e461376549f0497b3c79d9cf4a7273))
* remove unused listener and fix monthly good stories ([e8c0c05](https://github.com/kiva/ui/commit/e8c0c05a0bcc2b68321b6c7a3f867128e8667475))
* remove unused purge css code ([e7e52c7](https://github.com/kiva/ui/commit/e7e52c75be221da791f6cbf37c7c9d567411ba24))
* remove unused v-model from KvVerificationCodeInput to cleanup events MP-901 ([91aea77](https://github.com/kiva/ui/commit/91aea77131cba29ebb5e84efa3419b2243eb7cbc))
* removed unneeded linting disable ([6cd5910](https://github.com/kiva/ui/commit/6cd5910e0d0fc4d43a8a37fa04773dd98dee319e))
* removed unneeded require from server index ([7f2f204](https://github.com/kiva/ui/commit/7f2f204f405c444863e0ff88ef48ca92b4f218b6))
* rename format-lh-for-s3 file ([2ce0c0d](https://github.com/kiva/ui/commit/2ce0c0d069861dc9d3a0b600405441dcd0c23b58))
* rename lighthouse files according to failure log in github action ([59c689a](https://github.com/kiva/ui/commit/59c689a299cec818a95220881eb92f3e977a1b61))
* rename refresh-totals -> refreshtotals for consistency and define missing emits ([113a6de](https://github.com/kiva/ui/commit/113a6de447984765917cea754b592b17520ac645))
* replace .sync with v-model:value ([7102be7](https://github.com/kiva/ui/commit/7102be79aad5fa9e931bb616a50f1074996561d3))
* replace deprecated beforeDestroy with beforeUnmount ([072ddcb](https://github.com/kiva/ui/commit/072ddcb8921e954b8937fb36cabdfa70ff75144e))
* replace deprecated destroyed with unmounted ([e62801a](https://github.com/kiva/ui/commit/e62801af734f75385cb53d364a28923b79aa1d20))
* resolve a couple register page issues ([a6fb9fa](https://github.com/kiva/ui/commit/a6fb9fa68d1769d757b59ee15d0cfc4dd5c3957b))
* resolve deep style issues with legal pages ([2e48331](https://github.com/kiva/ui/commit/2e483310d8f755af973cfadcc66d41260c6218e2))
* resolve errors to get category page initially loading ([9ba0a44](https://github.com/kiva/ui/commit/9ba0a449c825911c37e08a21b93de4b4d0b0cb0e))
* resolve errors with loading the borrower profile initially ([dd0d37a](https://github.com/kiva/ui/commit/dd0d37a1f92ff58dbcbb242a52b3bb4ad19273f3))
* resolve form element issues with autolending settings ([eafa46c](https://github.com/kiva/ui/commit/eafa46cd55aa98bd88c418c09c8808994d3a769e))
* resolve issue with carousel slots ([d3a8901](https://github.com/kiva/ui/commit/d3a89013f4609857003231bf260d840353674dfb))
* resolve issue with cc page deep css ([30c35ba](https://github.com/kiva/ui/commit/30c35baa13524d9fbb304cae4e5f0a4c2a6821db))
* resolve issue with import in component library ([d24aa8a](https://github.com/kiva/ui/commit/d24aa8a6e5ed1684d207004a3f681a0084aa8f63))
* resolve issue with lend page ([7d041f6](https://github.com/kiva/ui/commit/7d041f68eaf434a2f1c0794f88319676daf22775))
* resolve issue with older carousel component ([374f44e](https://github.com/kiva/ui/commit/374f44e5293d0513bff0b54aaffcac54a2d942b8))
* resolve issue with popper when is initialized hidden ([a3155ca](https://github.com/kiva/ui/commit/a3155cacde7e298b7a81dd814d5f1ed4b04ef616))
* resolve issues found by linting ([da59885](https://github.com/kiva/ui/commit/da598857f57aa7681d97b5c65637c20ad6794c72))
* resolve issues on a couple newer pages with image glob ([5a8d692](https://github.com/kiva/ui/commit/5a8d692e3cc25a0fb70aca154bec0cb67536fe97))
* resolve issues with build page ([2e9fff1](https://github.com/kiva/ui/commit/2e9fff168783b1cde1e15a02314e74abf6cfd3d2))
* resolve issues with button component ([b029860](https://github.com/kiva/ui/commit/b02986088816c7eca4bed321280e833ebd385d45))
* resolve issues with campaign page ([96ee90f](https://github.com/kiva/ui/commit/96ee90f101039a920d8e478efd093329d0afbe6e))
* resolve issues with category page help me choose section ([6312494](https://github.com/kiva/ui/commit/6312494474ac45ee2d4c29d8bcaf9cc30078527f))
* resolve issues with category page quick filters ([a37d0f2](https://github.com/kiva/ui/commit/a37d0f2f3b6545d7ab45fef1cdfdf55382944f0d))
* resolve issues with client entry init ([0839846](https://github.com/kiva/ui/commit/08398466806752f179f98b828f07e57807fbd12a))
* resolve issues with flag icons not rendering ([d6871f5](https://github.com/kiva/ui/commit/d6871f54c5bbf0f90ef45baa40b8916ac573529c))
* resolve issues with grid story ([047aed5](https://github.com/kiva/ui/commit/047aed5849ee08bf1af8b765bfb9c10add216e52))
* resolve issues with html img src values ([8c871c4](https://github.com/kiva/ui/commit/8c871c449823dde3a4b815fcea2517858be14f40))
* resolve issues with image globs with subfolders ([f950d13](https://github.com/kiva/ui/commit/f950d13fd32657a78feed6f319411975a1fc75ff))
* resolve issues with monthly good page ([901ec9b](https://github.com/kiva/ui/commit/901ec9bf7db16f598936c904a28307e7a1ff1f6b))
* resolve issues with phone input (formatting update didn't work before either) ([f39f737](https://github.com/kiva/ui/commit/f39f73787091d8404aa74fabc13a0c445e37f84e))
* resolve issues with process instant lending ([71bf2be](https://github.com/kiva/ui/commit/71bf2be59dc909f1e6a475ddb8cb13f0c5741195))
* resolve issues with process join team ([8953d19](https://github.com/kiva/ui/commit/8953d19b024b6db7e945a45f22b36d71ce180fd0))
* resolve issues with router navigation specifically for lend/filter ([1498fa1](https://github.com/kiva/ui/commit/1498fa18bb794b613d9bc25f997172cf97686a87))
* resolve linting errors ([19f6ff9](https://github.com/kiva/ui/commit/19f6ff9bd492d16b91842db69b21377a388fec7f))
* resolve linting warnings ([f527ad7](https://github.com/kiva/ui/commit/f527ad786cb39493dc9db4943209b86c883dc87b))
* resolve merge coverage error in GH action ([0a0da7d](https://github.com/kiva/ui/commit/0a0da7d3a330a8e50e4397a37a2dd9b0737e7720))
* resolve more issues with base input and checkboxes ([9c0ad27](https://github.com/kiva/ui/commit/9c0ad27ed83a5f93f26daccf525d1aee99f98bca))
* resolve preFetchVariables route issues ([196f7c8](https://github.com/kiva/ui/commit/196f7c87a248723551cf81b24f8fdf0c0e3e8baf))
* resolve remaining issues with category page (clicking to load monthly good page) ([f0155e8](https://github.com/kiva/ui/commit/f0155e865ac931be26608c1272dd45933cb49e69))
* resolve story issue with correct default ([c8aa9a0](https://github.com/kiva/ui/commit/c8aa9a0ee0b2f38a4fac82bdc349b2c69e754c98))
* resolve transition needs single child error ([2851975](https://github.com/kiva/ui/commit/2851975e627fe78df1d18ae31be882cf4f0a2717))
* resolve warnings and errors when quick filters changed on category page ([ca13156](https://github.com/kiva/ui/commit/ca13156a67b7c04cb6310f90cb146e5f5f2a556d))
* resolved click outside directive issues with Vue 3 ([7125c22](https://github.com/kiva/ui/commit/7125c221592ff0d8015b83246eb8c3ed99c9ca2d))
* resolved issue with flag icons (removed sprite usage) ([1c5923b](https://github.com/kiva/ui/commit/1c5923b492d1e2d21ef48fc5254da59080273f41))
* resolved issue with the loan carousel on the lend-by-category page ([0558288](https://github.com/kiva/ui/commit/0558288ae9d412fa2b36e0c9737b704f99b94f66))
* resolved issue with tip message component ([2e678ed](https://github.com/kiva/ui/commit/2e678ed78f4ab9d85f14f79969aeef61d9767979))
* resolved issues with auto deposit form and added needed optional chaining to all forms ([f316567](https://github.com/kiva/ui/commit/f316567e7ae545a698ba2beab8ce075999633e8b))
* resolved issues with banner stories ([f999262](https://github.com/kiva/ui/commit/f99926291932c90f23aef383a68ad93f16b9f1f7))
* resolved issues with cc pages ([4530fc8](https://github.com/kiva/ui/commit/4530fc8a0de0a7cefebe8756390e77064ae45ef1))
* resolved issues with more stories (one of the BP stories was broken before as well) ([c618a8e](https://github.com/kiva/ui/commit/c618a8e4d833caeb64b91c30a0c4cfd9d6dc7f7c))
* resolved issues with unit tests (all pass without warnings/errors now) ([b7e7ab5](https://github.com/kiva/ui/commit/b7e7ab5e5b86c2c2fadec466109489163ee82b27))
* root element of transition needs to have v-if or v-show ([0ed6e1e](https://github.com/kiva/ui/commit/0ed6e1e0a3e0a744f7238fad512303c5676d6957))
* server side error where this file wasn't found with relative path ([3f3ba76](https://github.com/kiva/ui/commit/3f3ba76407e5b15ffafe0ac6bfe4c29fb1553747))
* set inital input value in legacy KvRadio component, remove unused watch in autolending status ([f02626d](https://github.com/kiva/ui/commit/f02626d86c0babf88ed5f822fcd83c10aa81aafb))
* slide width in badge experiment ([9d6effe](https://github.com/kiva/ui/commit/9d6effee48e5ff986b7d9c7a2675439211ac80d7))
* small spelling fix ([b0836c9](https://github.com/kiva/ui/commit/b0836c9fcf7877f938c76eb125e7753c4375c57c))
* solve comments ([a7648ab](https://github.com/kiva/ui/commit/a7648abc1f12325c7f3588accd3c2d93fbdef4f4))
* solve conflicts ([1fa0046](https://github.com/kiva/ui/commit/1fa00460520e930ccbec3ea1f9a41f4a57df1012))
* some changes following previous commits ([ae78046](https://github.com/kiva/ui/commit/ae780469fff778482918c029655c48118dd52a3d))
* style issues and loading placeholder ([c905197](https://github.com/kiva/ui/commit/c90519714c2684210a23251939ee4be77573b631))
* tabs for package.json indentation ([13c0fb3](https://github.com/kiva/ui/commit/13c0fb369c372095cd3c635bce2cac213071c8f9))
* turn off SSR for local dev to prevent CSS pop-in for components ([2016a22](https://github.com/kiva/ui/commit/2016a22f0f265de5420b69cbb93b95ee9f05f617))
* turn on source maps when not in production, helps with server debugger ([1009d62](https://github.com/kiva/ui/commit/1009d6229a902c6703f4f58609c24194c0604131))
* unit tests now all pass (fixed issue with KvCheckboxList) ([dcba7a7](https://github.com/kiva/ui/commit/dcba7a70509db3495dbfec5f1ff5eead9fe21520))
* update component lib to get updated select ([2954b83](https://github.com/kiva/ui/commit/2954b8386df127782a04a986bc85f4247da87fc1))
* update gql import ([f37f1aa](https://github.com/kiva/ui/commit/f37f1aa26652e665bbd95139015363aba043cb1e))
* update path to lighthouse upload file ([afc41d1](https://github.com/kiva/ui/commit/afc41d1ba0a182d4981c10b21b70d7d1dcb3b6e1))
* update paths for static assets ([df9a2dc](https://github.com/kiva/ui/commit/df9a2dc87442375dd1d708a23d925147710dec69))
* update selects to work in vue3 ([df8b2ee](https://github.com/kiva/ui/commit/df8b2ee78340764b68128a52ad00366a3f88c6ea))
* update static asset path for docker build action ([ff013ab](https://github.com/kiva/ui/commit/ff013abad88686cf82e49572c710d34e5167bfb4))
* update static asset source path ([e7cb1b7](https://github.com/kiva/ui/commit/e7cb1b7a960e04778c25491e0aa15899dccd672f))
* update storybook deployment node version ([9631960](https://github.com/kiva/ui/commit/96319605dfcadf517ff56e18a703a1d9c35c8e8a))
* update storybook preview for vue 3 app & remove unused build config ([9241689](https://github.com/kiva/ui/commit/92416898294f18ccf938da3d100bee8dbdcd8521))
* upgrade kv-shop with tweaks that allow apollo dependency to load ([8cdd3da](https://github.com/kiva/ui/commit/8cdd3da94ddecd45eef797757a57f4825382d58a))
* upgrade node auth0 package to resolve authentication related errors ([82825b8](https://github.com/kiva/ui/commit/82825b87235960907ada2109def34b60e99e5f05))
* upgrade to vue3 ([0f89ec3](https://github.com/kiva/ui/commit/0f89ec3d65f580d44e8dc11cab1e7023ffabd610))
* upgraded cypress and confirmed tests running locally ([6f71180](https://github.com/kiva/ui/commit/6f71180edb73679eaaedef2324943e7241202aa2))
* use "head" instead of "metaInfo" ([8df4a08](https://github.com/kiva/ui/commit/8df4a08cd026e35e20a856a5283eff3ffc68de12))
* use absolute paths from project root for import.meta.glob ([0dcb945](https://github.com/kiva/ui/commit/0dcb945d9e5f7b6f88646ba2769b16b33bf240df))
* use direct aysnc import for router components ([69e0585](https://github.com/kiva/ui/commit/69e058523d92db259b67b17bb5be7b0745790d14))
* use event emitter for dynamic events out of contentful content, fix basket hash ([cd249f6](https://github.com/kiva/ui/commit/cd249f67187f482400feaab64825cde27ebfd309))
* use head instead of metaInfo in UiSiteMap ([c2c1b05](https://github.com/kiva/ui/commit/c2c1b057467eef6bb369345ea334069403812ee0))
* use import.meta.glob to load flag svgs ([80fe5ca](https://github.com/kiva/ui/commit/80fe5caf37f5330172e51e4ded0ee80a353f8112))
* validation in monthly good setup form ([82249d0](https://github.com/kiva/ui/commit/82249d0f1e8ff6aed65c73f14b0b28415ddc050c))
* webmanifest with vite build ([ac02114](https://github.com/kiva/ui/commit/ac02114b02295870a4696dc66622b513d3ea8e7b))

### 🏗️ Build System

* allow importing of temporary file ([470e4d4](https://github.com/kiva/ui/commit/470e4d468630955dc8693fb615ce3d614140c826))
* client path should be set in source directory so that /static is the public asset root ([a1f6ba2](https://github.com/kiva/ui/commit/a1f6ba265194f461ea8be5cbd57ee3fd3f107691))
* ensure image build happens if github release was published ([4dfdffe](https://github.com/kiva/ui/commit/4dfdffe2af66fc069ffd05da5bf675a3a1d1d80c))

### 🪚 Refactors

* async functions and cache helper for getGqlPossibleTypes ([93eeb7d](https://github.com/kiva/ui/commit/93eeb7da60dcde50dac24ab89c177ffc2192e6fd))

### 📚 Documentation Changes

* remove outdated comment ([1b2df91](https://github.com/kiva/ui/commit/1b2df9184acb5f58076e3aed3808e65198842caa))

### 🔍 Tests

* apply vue3 linting rules ([a428be8](https://github.com/kiva/ui/commit/a428be87fae96a88925c8f3848d355862189dbd0))
* suppress console warnings from live-loan test ([4b0e6f9](https://github.com/kiva/ui/commit/4b0e6f9debd088348dc8106f9ae211ff81bb9b21))
* update click event count expected in LoanSearchFilterChips ([d3925f5](https://github.com/kiva/ui/commit/d3925f5e21605bf2af473fc13eecff5cb5fa40eb))

### 🧹 Chores

* add ci branch option to vue-3 branch ([36f65a7](https://github.com/kiva/ui/commit/36f65a78f7ae7f7ad5d76562959d2813fc258f59))
* **deps:** upgrade kv-components to v3.102.4 and kv-shop to 1.12.50 ([eeae06b](https://github.com/kiva/ui/commit/eeae06b8503c52a51db31275599929b62a51e383))
* **release:** 3.0.0-rc.1 [skip ci] ([5c68d95](https://github.com/kiva/ui/commit/5c68d9538ec213bb186d1a7c8b09535faab06a78)), closes [#5521](https://github.com/kiva/ui/issues/5521) [#5543](https://github.com/kiva/ui/issues/5543) [#5533](https://github.com/kiva/ui/issues/5533) [#5551](https://github.com/kiva/ui/issues/5551)
* **release:** 3.0.0-rc.2 [skip ci] ([bda86fe](https://github.com/kiva/ui/commit/bda86fe25973b81c5e31963f2dbe3c33796dff1b)), closes [#5567](https://github.com/kiva/ui/issues/5567) [#5564](https://github.com/kiva/ui/issues/5564)
* remove console log ([1c649c7](https://github.com/kiva/ui/commit/1c649c719bc23d1056d009eb6d44e9ef5d26da11))
* remove unused loanDisplayComponent computed prop ([07ab4bc](https://github.com/kiva/ui/commit/07ab4bcae8778f5d25cb11ab860e6eaae9893d43))
* remove unused script include ([b33260b](https://github.com/kiva/ui/commit/b33260b9f6237bfd9dd69e907ceb5068c8c6e6f5))
* update lighthouse filename in github action ([03ba94b](https://github.com/kiva/ui/commit/03ba94b90106ac6e23773468dd139e8641e7490a))
* use vue3 branch of marketplace-web-ui-ci with updated Dockerfile ([b0b1eb0](https://github.com/kiva/ui/commit/b0b1eb0c5feb90773a1d466e7eff2c538780ae8c))

## [3.0.0-rc.2](https://github.com/kiva/ui/compare/v3.0.0-rc.1...v3.0.0-rc.2) (2024-10-07)

### 🎉 New Features

* adding new condition to redirect to challenge page ([a562fc9](https://github.com/kiva/ui/commit/a562fc986c6bae23db330815b01466c8c534239e))
* create component to show in progress badge ([10d7af1](https://github.com/kiva/ui/commit/10d7af1939971e83a898013dfee59c3bec28f7d6))
* edit sitemap path params MP-880 ([e74aad4](https://github.com/kiva/ui/commit/e74aad492bc9a60672f5555d95401ba12f78ac93))
* get active loans ([894d4c5](https://github.com/kiva/ui/commit/894d4c557bfcbf3c09c404822f60228ce748fb86))
* message added for failed message sent ([#5567](https://github.com/kiva/ui/issues/5567)) ([1bf66ef](https://github.com/kiva/ui/commit/1bf66ef765c49274c491805e21e7d8dffcd2043d))
* move redirect routes to own section of sitemap MP-880 ([ece45b6](https://github.com/kiva/ui/commit/ece45b68231069fa5807be28eb7bb9e69703343c))
* my kiva carousel component for borrower status card ([abbc34d](https://github.com/kiva/ui/commit/abbc34d0846f2be8cab76a0736d6b4c141d7be8e))
* use custom dash ([4ee0470](https://github.com/kiva/ui/commit/4ee0470ec79494dd030b17cb99f959e33413077b))

### 🐛 Bugfixes

* add padding to ad update form date ([2a3a0f5](https://github.com/kiva/ui/commit/2a3a0f51dca3ddf8da44089d24e830fc972d75af))
* add request for new ID field on userAchievementProgress ([c16b6c6](https://github.com/kiva/ui/commit/c16b6c699495c007bad873d9140b0b818197a2fa))
* add watcher to update state when lightbox opens, remove deprecated click attribute ([04cf84f](https://github.com/kiva/ui/commit/04cf84f7d577b04f20289592484bbd2f28620aa0))
* adding optional chaining for counting loans method ([e03918d](https://github.com/kiva/ui/commit/e03918d9adf7a0a4ce9fe6a616480143eb80daac))
* calculate next payment date ([096637a](https://github.com/kiva/ui/commit/096637a9e8c2369c1afb9b67bb0eeed11334292a))
* cause selector input needs to declare events emitted MP-873 ([d2cf2c8](https://github.com/kiva/ui/commit/d2cf2c8b513b4de4b2d13d3e262ca3ceaf17c90b))
* change logic to avoid redirect if experiment is active ([2a9de74](https://github.com/kiva/ui/commit/2a9de746ac05970e5090c657f9711806bda1d7cb))
* checking status to know if a loan is fundraising ([abc2c50](https://github.com/kiva/ui/commit/abc2c50174302ed71a5de9c753555ef8c5b4a555))
* default value for themes and tags ([b120c5b](https://github.com/kiva/ui/commit/b120c5bcda49ae8446af75fbc2099a4695b05a38))
* definition of completed loans ([b730d3b](https://github.com/kiva/ui/commit/b730d3bcb1d3007513b67b37804dc756604c90d4))
* done url after auth guard, done url not being empty string, team filter to url ([85109d0](https://github.com/kiva/ui/commit/85109d03b61c5b15a3ac9053632711ae228bcb1c))
* dynamic rich text rendering ([ba24489](https://github.com/kiva/ui/commit/ba24489c1ac723d08c60f3e1545264780d091499))
* emitted events need to be declared in components for vue to handle them correctly MP-901 ([621935a](https://github.com/kiva/ui/commit/621935a759f5c53a08399e964799afc709b40fa7))
* event names for listeners must be hyphenated ([067e3a7](https://github.com/kiva/ui/commit/067e3a79dba97a2b140f57a11c88a9415f0b7c50))
* filter out null values from queries used on LBC ([ec8b170](https://github.com/kiva/ui/commit/ec8b170f5265fac42b7326aa1b3da3cf7c49558d))
* hydration and missing content on mg page ([08b3bbb](https://github.com/kiva/ui/commit/08b3bbb5a44e2f9e9e31d22691d81a06fe62a63d))
* install mitt event bus, update dev-inspect command with tailwind-watch ([fc4f2e4](https://github.com/kiva/ui/commit/fc4f2e4da0b1a59019bc0c25d3a3193f2dada040))
* iwd has false value causing the redirect ([1d66315](https://github.com/kiva/ui/commit/1d66315ce1983e46780c9a86973978ba31d3a96f))
* lender profile stats bugs fixed ([#5564](https://github.com/kiva/ui/issues/5564)) ([74cac0b](https://github.com/kiva/ui/commit/74cac0be2908d98445da4e6afa6c62bd986c57b5))
* lint ([fa7d7f3](https://github.com/kiva/ui/commit/fa7d7f33bebf8bf28043cfb0926e8aad8c349383))
* lint ([d1f80c2](https://github.com/kiva/ui/commit/d1f80c2d3f1822cc0a91a2b3f8c7986318cb9d3e))
* loading placeholder and handle negative dates ([4becfd9](https://github.com/kiva/ui/commit/4becfd968553baaefb314468b3051f4b1965b3cb))
* location filters on lend-by-category ([86b52c5](https://github.com/kiva/ui/commit/86b52c536b26aebfdcf8e921161349f9d98275b6))
* make vite load everything behind the static path in dev mode, helps fix tilt ([60f7ec3](https://github.com/kiva/ui/commit/60f7ec32a3c1c6b1e5fd7952904cd28edfa90a58))
* missing tracking and buttons ([8a1ba24](https://github.com/kiva/ui/commit/8a1ba24ce5569c887e33423bccf3f8d8218319f2))
* monthly good and auto deposit calculations doing string concat instead of addition MP-882 ([51411c5](https://github.com/kiva/ui/commit/51411c5bd4979c3f2396c60d0b3ea4ef29b2cc9a))
* pass error to next to ensure auth guard redirect, remove lodash usage ([1f40682](https://github.com/kiva/ui/commit/1f406821f910e2629d83c253b83696dd9abaac0d))
* pass null instead of all, which is not an enum option, in team leaderboard category field ([486db0f](https://github.com/kiva/ui/commit/486db0fc75e56519c6bd5de247c6c6b79f6226aa))
* reactive loans ([9971d6d](https://github.com/kiva/ui/commit/9971d6d0a1ee306777f27168104dc7f680fa0a1e))
* redirect to error if contentful entry is missing, fix dynamic rendering mode in the client ([12a9210](https://github.com/kiva/ui/commit/12a921028dea46bedb5765e9af9339f4b219e071))
* remove depreacted .native modifier ([24375b3](https://github.com/kiva/ui/commit/24375b3055ae5ceaaf4b95b2845c4dbbbac0152a))
* remove deprecated filter ([524819c](https://github.com/kiva/ui/commit/524819c9a9eb059098792042fed8fdc2fef9063f))
* remove duplicate id=app ([16b0555](https://github.com/kiva/ui/commit/16b055522ee0c5be716d45e7a8c278900b99c3d8))
* remove unused KvRangeSlider component ([909b5cc](https://github.com/kiva/ui/commit/909b5cc049e461376549f0497b3c79d9cf4a7273))
* remove unused v-model from KvVerificationCodeInput to cleanup events MP-901 ([91aea77](https://github.com/kiva/ui/commit/91aea77131cba29ebb5e84efa3419b2243eb7cbc))
* rename format-lh-for-s3 file ([2ce0c0d](https://github.com/kiva/ui/commit/2ce0c0d069861dc9d3a0b600405441dcd0c23b58))
* rename refresh-totals -> refreshtotals for consistency and define missing emits ([113a6de](https://github.com/kiva/ui/commit/113a6de447984765917cea754b592b17520ac645))
* replace .sync with v-model:value ([7102be7](https://github.com/kiva/ui/commit/7102be79aad5fa9e931bb616a50f1074996561d3))
* replace deprecated beforeDestroy with beforeUnmount ([072ddcb](https://github.com/kiva/ui/commit/072ddcb8921e954b8937fb36cabdfa70ff75144e))
* replace deprecated destroyed with unmounted ([e62801a](https://github.com/kiva/ui/commit/e62801af734f75385cb53d364a28923b79aa1d20))
* root element of transition needs to have v-if or v-show ([0ed6e1e](https://github.com/kiva/ui/commit/0ed6e1e0a3e0a744f7238fad512303c5676d6957))
* set inital input value in legacy KvRadio component, remove unused watch in autolending status ([f02626d](https://github.com/kiva/ui/commit/f02626d86c0babf88ed5f822fcd83c10aa81aafb))
* slide width in badge experiment ([9d6effe](https://github.com/kiva/ui/commit/9d6effee48e5ff986b7d9c7a2675439211ac80d7))
* solve conflicts ([1fa0046](https://github.com/kiva/ui/commit/1fa00460520e930ccbec3ea1f9a41f4a57df1012))
* style issues and loading placeholder ([c905197](https://github.com/kiva/ui/commit/c90519714c2684210a23251939ee4be77573b631))
* turn on source maps when not in production, helps with server debugger ([1009d62](https://github.com/kiva/ui/commit/1009d6229a902c6703f4f58609c24194c0604131))
* update path to lighthouse upload file ([afc41d1](https://github.com/kiva/ui/commit/afc41d1ba0a182d4981c10b21b70d7d1dcb3b6e1))
* use event emitter for dynamic events out of contentful content, fix basket hash ([cd249f6](https://github.com/kiva/ui/commit/cd249f67187f482400feaab64825cde27ebfd309))
* validation in monthly good setup form ([82249d0](https://github.com/kiva/ui/commit/82249d0f1e8ff6aed65c73f14b0b28415ddc050c))

### 📚 Documentation Changes

* remove outdated comment ([1b2df91](https://github.com/kiva/ui/commit/1b2df9184acb5f58076e3aed3808e65198842caa))

### 🔍 Tests

* apply vue3 linting rules ([a428be8](https://github.com/kiva/ui/commit/a428be87fae96a88925c8f3848d355862189dbd0))
* suppress console warnings from live-loan test ([4b0e6f9](https://github.com/kiva/ui/commit/4b0e6f9debd088348dc8106f9ae211ff81bb9b21))
* update click event count expected in LoanSearchFilterChips ([d3925f5](https://github.com/kiva/ui/commit/d3925f5e21605bf2af473fc13eecff5cb5fa40eb))

### 🧹 Chores

* **deps:** upgrade kv-components to v3.102.4 and kv-shop to 1.12.50 ([eeae06b](https://github.com/kiva/ui/commit/eeae06b8503c52a51db31275599929b62a51e383))
* remove console log ([1c649c7](https://github.com/kiva/ui/commit/1c649c719bc23d1056d009eb6d44e9ef5d26da11))
* remove unused loanDisplayComponent computed prop ([07ab4bc](https://github.com/kiva/ui/commit/07ab4bcae8778f5d25cb11ab860e6eaae9893d43))

## [3.0.0-rc.1](https://github.com/kiva/ui/compare/v2.759.0...v3.0.0-rc.1) (2024-09-26)

### ⚠ BREAKING CHANGES

* import.meta support required. Baidu, QQ, UC, and KaiOs browsers not supported.
* only supports Vue 3 APIs and only provides Vue 3 components

### 🎉 New Features

* create borrower status card ([1cfeb70](https://github.com/kiva/ui/commit/1cfeb702c2f4c93ed0a2cea3445ce42231d8680b))
* migrate to vue 3 ([ef9cd09](https://github.com/kiva/ui/commit/ef9cd09163aa37b9ea8a20ed217838c014d67d5c))
* my kiva navigation ([#5521](https://github.com/kiva/ui/issues/5521)) ([02ddb2e](https://github.com/kiva/ui/commit/02ddb2ee625de8a383c9ff713f869e35bd07f60f))
* mykiva components switched to composition api ([#5543](https://github.com/kiva/ui/issues/5543)) ([a225fbb](https://github.com/kiva/ui/commit/a225fbbb258b7738a1202688b1592709d0d1f3a5))
* only support modern browsers ([78fdf26](https://github.com/kiva/ui/commit/78fdf26230b6a383956cc579aaa26e2ccee29f74))
* render preload links for js and css used during render ([61e80af](https://github.com/kiva/ui/commit/61e80af6bf33275258d27b8b990931b5b1ff59dd))

### 🐛 Bugfixes

* $isServer no longer exists in Vue 3 ([125e330](https://github.com/kiva/ui/commit/125e330040199d1389785c38bb1955d2e5405e46))
* a small collection of stories fixed, added support for the async component in KvIcon ([2b9f0f1](https://github.com/kiva/ui/commit/2b9f0f1ddbde7851e7b38787dd7287aba4e7b003))
* access correct async page view method (encountered when changing filters on category page) ([80a6be8](https://github.com/kiva/ui/commit/80a6be8f5b6f2b4942e7e54d9164f97c2c13d56e))
* add back in old vuelidate library so project still builds/validates ([03d3a63](https://github.com/kiva/ui/commit/03d3a630afc6a12943910304511fffe4f70222f8))
* add filters support for storybook ([90b3657](https://github.com/kiva/ui/commit/90b3657495067c085a5a06cce2ba3dc33baeb8f2))
* add SVGs to HTML for KvIcon ([688422d](https://github.com/kiva/ui/commit/688422dc6ce58178f2a669dae2d0b97f48e98804))
* additional ESM work related to jest testing ([c4b1a9e](https://github.com/kiva/ui/commit/c4b1a9ece9e0fee85531725e30e255943369080e))
* additional unit test spec fixes and component fixes ([5cbb962](https://github.com/kiva/ui/commit/5cbb96279881019123d3390d1d4969eff3a1d53e))
* additional unit testing fixes ([e819357](https://github.com/kiva/ui/commit/e8193576d6eb7ed83443e1e970af12fc7b07baf6))
* address errors/warnings with story ([7f9290a](https://github.com/kiva/ui/commit/7f9290a644029e2da0ffc5e08b0a1d794c737dd5))
* adjust Caddy to support vite HMR ([12cf02b](https://github.com/kiva/ui/commit/12cf02be285ce7011f52568cc3ce8fcd92916a5a))
* adjust css bg image urls ([359387b](https://github.com/kiva/ui/commit/359387b058747749a7546ba6a482c90229d54ece))
* adjust manifest URLs to prevent errors in dev (full URL still needed for built app) ([c172d31](https://github.com/kiva/ui/commit/c172d31807f515ed4db2fe6becd1a4675bd22413))
* adjust some deep selectors ([15f31cb](https://github.com/kiva/ui/commit/15f31cbc2032913d301da29c1b35761d40dfdaac))
* another deep ([5a52a51](https://github.com/kiva/ui/commit/5a52a519ac20f103c3481382d5b2d8021c9eae72))
* another deep css tweak ([0de1bb3](https://github.com/kiva/ui/commit/0de1bb3e59dd91e661ac8359f77530619e6b3fdb))
* another form update ([c53fbdd](https://github.com/kiva/ui/commit/c53fbdd7e043611bcf8ff7845758ffe713f5d90a))
* attempt retry after network error before logging the error ([d5db0a9](https://github.com/kiva/ui/commit/d5db0a9110d5e663fb215b2bd78f485caffbbc78))
* borrower profile lend cta animation wasn't working correctly ([d94477c](https://github.com/kiva/ui/commit/d94477c16ec7a3e722769345f4c23d5c1efbfc55))
* borrower profile route access needed to be changed ([d1a77a1](https://github.com/kiva/ui/commit/d1a77a1d1fb976c67de0c4204676c98d3acaa703))
* braintree css overrides weren't working ([6a32b97](https://github.com/kiva/ui/commit/6a32b973a1e4c9b0e3f0f22db814fdef2cf7077d))
* cache set error when typesJSON is undefined ([24efeb5](https://github.com/kiva/ui/commit/24efeb5f0a059f151402c847de5bbd5215ecfa98))
* change storybook build generated js filenames so they do not start with underscores ([d244f08](https://github.com/kiva/ui/commit/d244f081ee25ca3691648c1dd49efc5c99d67ea4))
* change video import to work in storybook without new alias ([d053994](https://github.com/kiva/ui/commit/d053994249305cdf4511973b422cc307d0446673))
* checkboxes weren't working like expected (solved for the email settings page specifically) ([1ed955a](https://github.com/kiva/ui/commit/1ed955a2a97d01e0c974f429217fc18137eef074))
* cleaned up story mock data ([da61990](https://github.com/kiva/ui/commit/da61990a579017f5752734373d661a012df0ec4d))
* client entry name in index.html ([e0a179f](https://github.com/kiva/ui/commit/e0a179f7a462f9c17eee4898e3297234b6ccf4ca))
* comment out vue router in storybook preview ([b3f3ad5](https://github.com/kiva/ui/commit/b3f3ad51d582e2cd10dad2d56a36d8cbe7fa3ea2))
* custom radio button wasn't working (found on payment settings page) ([9baaae5](https://github.com/kiva/ui/commit/9baaae5cb5c2a32dc30838a65fe9f61b8f5f3781))
* default slot is now a method ([bc22c53](https://github.com/kiva/ui/commit/bc22c5333eae0d34ee90d28263cb875c30ea23f4))
* disable was needed for unit tests in pipeline ([2d98e46](https://github.com/kiva/ui/commit/2d98e467ae38f68930a1f156b66362298ccfca98))
* ensure category page loads correctly via browser back/forward buttons ([8e5c83f](https://github.com/kiva/ui/commit/8e5c83fde6b364c046ea9932fe29b11cf2197d5f))
* ensure icons load on category page ([97fd051](https://github.com/kiva/ui/commit/97fd0516262a73cc7def65247b6ecd989382a570))
* ensure responsive image component renders correctly ([2dd7155](https://github.com/kiva/ui/commit/2dd71553ca344976b7be6b05806985b8e0625a5d))
* file disables didn't work for push eslint ([e62aaa2](https://github.com/kiva/ui/commit/e62aaa2ebadb98c70ab9ec485c72141c22a35bc2))
* fix default thanks page rendering ([ee1fab3](https://github.com/kiva/ui/commit/ee1fab366b839fd584ef1c2ff000d25a6e3ac981))
* fix how treemap commonjs module was being imported ([cbb906d](https://github.com/kiva/ui/commit/cbb906d106b451341176d16d67c862546fc74c0b))
* fixed height ([7e30676](https://github.com/kiva/ui/commit/7e306769f60ff45408331641f0e627b312c02d90))
* get unit tests passing again ([8adede0](https://github.com/kiva/ui/commit/8adede05200ac0c2c00663030ad78061c96ea2e1))
* get vue router to work with overriding query string in stories ([c163d85](https://github.com/kiva/ui/commit/c163d8598dc12bbb4273d30d0b4d9c8ac0f02ead))
* **getDeepComponents:** handle vue 3 async components ([9d16b5f](https://github.com/kiva/ui/commit/9d16b5f1ae22d31587abeb116d44d4a831032cda))
* getGqlPossibleTypes expects a memcache instance ([6cc890c](https://github.com/kiva/ui/commit/6cc890c4512b7b15a4764d29d9993c8f1df2a109))
* handle no match found warnings with catch-all route ([11abec5](https://github.com/kiva/ui/commit/11abec58206872d88d8617e4f3fd72c6a4d33bc8))
* horizontal overflow hidden in my kiva nav ([#5533](https://github.com/kiva/ui/issues/5533)) ([c23b6b9](https://github.com/kiva/ui/commit/c23b6b9836e44e5cbd2fc55031783d33467f8725))
* image glob instead of require for thanks page component ([5cffd44](https://github.com/kiva/ui/commit/5cffd44fb45f3464fa18de98ba01c2c341857759))
* import svg urls for image sources ([855bf5b](https://github.com/kiva/ui/commit/855bf5b659c6d796f2abc852ad95bdc2e2323926))
* lend/filter page now loads successfully and can be interacted with ([515ac80](https://github.com/kiva/ui/commit/515ac801ae9f8f27c5ee0110af8f56fe0f0aeca1))
* linting ([bf6fca2](https://github.com/kiva/ui/commit/bf6fca213fa08e07bdb6c266a58adece99cdab42))
* linting ([bfd3bbd](https://github.com/kiva/ui/commit/bfd3bbddd7f211c12a3bda8a16231468f7dda0cc))
* linting again ([bd3dcd9](https://github.com/kiva/ui/commit/bd3dcd997705bc9eca543e584bbbd48b744d8ea0))
* linting issues ([2e8b31f](https://github.com/kiva/ui/commit/2e8b31f01ba6eba7ee6bc358517e2143e4ce59d2))
* load app logo svgs with ?url ([feba00d](https://github.com/kiva/ui/commit/feba00d491d59362783ed8f3e3f561e44d062678))
* load lending stats even with gql error ([1d8a56f](https://github.com/kiva/ui/commit/1d8a56f3e0234a537c01135437292a2b5aa38048))
* make replacing tracer quicker ([ae0c70a](https://github.com/kiva/ui/commit/ae0c70ad6345f2ec5cddef8d3167865a14560ea6))
* matching text component fix for category page help me choose section ([e1f8ccc](https://github.com/kiva/ui/commit/e1f8ccccf150f4707d52f41b6c2ae554e155044f))
* migrate all vuelidate forms to the new pattern ([9a9b6eb](https://github.com/kiva/ui/commit/9a9b6eb4058b9fa0cb603aebcd2c741e1bb0b0b9))
* missed a server change update on checkout page ([8ee0aaf](https://github.com/kiva/ui/commit/8ee0aaffb4a37265bd32d876bfbd3c815a657730))
* missing final package changes from merge ([252495b](https://github.com/kiva/ui/commit/252495b3e8e042b3492d6d69de75805363b1dfd5))
* more icons now work (sprites didn't work in storybook before either) ([329f527](https://github.com/kiva/ui/commit/329f527138eb162df9cd58316dbc74d273bd7a41))
* more linting fixes ([afee5a4](https://github.com/kiva/ui/commit/afee5a4a6f2d3912cf2d3446b91be6ee7afaaed0))
* more story fixes ([dace761](https://github.com/kiva/ui/commit/dace761dfb08dc1f17abc9b774b5e73699fd15ab))
* more story fixes ([0b7002d](https://github.com/kiva/ui/commit/0b7002d1769f06822a14ca11307e673477927ece))
* more story issues resolved ([0d1054d](https://github.com/kiva/ui/commit/0d1054d65d2872ee5386cf10a7165be195eed3f2))
* more story updates ([cd2f0f3](https://github.com/kiva/ui/commit/cd2f0f3d67cc5caf7b4ade636ce74629f022c714))
* more unit test fixes ([9cbee44](https://github.com/kiva/ui/commit/9cbee44885a631b3499b1448a6267959ac3987e2))
* my kiva experiment setup fixed ([#5551](https://github.com/kiva/ui/issues/5551)) ([66ecd71](https://github.com/kiva/ui/commit/66ecd7190228069f8530b8a7a0f58203d77cbc5e))
* new vue render method removes whitespace ([1d14a86](https://github.com/kiva/ui/commit/1d14a8694ac8d64fdac87217d7dfbdb01e4878bc))
* one last linting error ([88c84b9](https://github.com/kiva/ui/commit/88c84b92af58fff7ad9e8115711e5caacb1afe34))
* prefetch route is now a ref ([e5d4325](https://github.com/kiva/ui/commit/e5d43255f2c276c37c42bc8cb1e5f9feb151a7ba))
* prefetch wasn't working correctly for navigation with the vue router ([af4a0ff](https://github.com/kiva/ui/commit/af4a0ffee87f332684b4364127f005cf7f6213dc))
* props and attrs not set correctly on buttons MP-858 ([92faca3](https://github.com/kiva/ui/commit/92faca371933028ace07649f8df72862d207aa27))
* qr code prop was wrong type ([72d3144](https://github.com/kiva/ui/commit/72d3144c554a2d2639ab9c97fec5ac69f133257a))
* quiet console.warn for live loan fetch tests ([0e1fbd5](https://github.com/kiva/ui/commit/0e1fbd5689fbbb86b252caa12205ab15481205aa))
* radio can default as null ([46479e4](https://github.com/kiva/ui/commit/46479e4853030cf552ededc9b5ad0a2f085d6224))
* register social page/form now working ([3312852](https://github.com/kiva/ui/commit/331285235542882bdff950c7b97f93cb5f1cb4d8))
* remaining changes to enable all logged-out features of lend/filter ([1716cc0](https://github.com/kiva/ui/commit/1716cc0a399250cc5a2f860ecc1a315bfcf0bc4d))
* remaining initial story tweaks for storybook 8 ([e51e82a](https://github.com/kiva/ui/commit/e51e82ab2da9c81cb2004235311e5e97b3cf1987))
* remove another this reference in a template ([b66ae01](https://github.com/kiva/ui/commit/b66ae01a59f7888b3875e1d63f4f6291fb9ef784))
* remove ci branch option ([4eae068](https://github.com/kiva/ui/commit/4eae068757c69a35b14db71cedfacfcc0104d8aa))
* remove component no longer used ([627fbf1](https://github.com/kiva/ui/commit/627fbf1583e0957257d2836f24667d92c686fb46))
* remove extra template tags creating render issues ([153fee4](https://github.com/kiva/ui/commit/153fee43605394c976c496be2e49e21b4acb80c2))
* remove old postcss deep syntax ([f995b32](https://github.com/kiva/ui/commit/f995b3212c5138ac9019caf55e0bc6694c16eb25))
* remove this reference from template ([3ac0bac](https://github.com/kiva/ui/commit/3ac0bac33fea843e24d4f8ea74b78b206c0e78fe))
* remove this. from templates, resolve issue with transition having more than one child ([5fc685d](https://github.com/kiva/ui/commit/5fc685d3f2a3466988ca80782e21033242b846cf))
* remove unused listener and fix monthly good stories ([e8c0c05](https://github.com/kiva/ui/commit/e8c0c05a0bcc2b68321b6c7a3f867128e8667475))
* remove unused purge css code ([e7e52c7](https://github.com/kiva/ui/commit/e7e52c75be221da791f6cbf37c7c9d567411ba24))
* removed unneeded linting disable ([6cd5910](https://github.com/kiva/ui/commit/6cd5910e0d0fc4d43a8a37fa04773dd98dee319e))
* removed unneeded require from server index ([7f2f204](https://github.com/kiva/ui/commit/7f2f204f405c444863e0ff88ef48ca92b4f218b6))
* rename lighthouse files according to failure log in github action ([59c689a](https://github.com/kiva/ui/commit/59c689a299cec818a95220881eb92f3e977a1b61))
* resolve a couple register page issues ([a6fb9fa](https://github.com/kiva/ui/commit/a6fb9fa68d1769d757b59ee15d0cfc4dd5c3957b))
* resolve deep style issues with legal pages ([2e48331](https://github.com/kiva/ui/commit/2e483310d8f755af973cfadcc66d41260c6218e2))
* resolve errors to get category page initially loading ([9ba0a44](https://github.com/kiva/ui/commit/9ba0a449c825911c37e08a21b93de4b4d0b0cb0e))
* resolve errors with loading the borrower profile initially ([dd0d37a](https://github.com/kiva/ui/commit/dd0d37a1f92ff58dbcbb242a52b3bb4ad19273f3))
* resolve form element issues with autolending settings ([eafa46c](https://github.com/kiva/ui/commit/eafa46cd55aa98bd88c418c09c8808994d3a769e))
* resolve issue with carousel slots ([d3a8901](https://github.com/kiva/ui/commit/d3a89013f4609857003231bf260d840353674dfb))
* resolve issue with cc page deep css ([30c35ba](https://github.com/kiva/ui/commit/30c35baa13524d9fbb304cae4e5f0a4c2a6821db))
* resolve issue with import in component library ([d24aa8a](https://github.com/kiva/ui/commit/d24aa8a6e5ed1684d207004a3f681a0084aa8f63))
* resolve issue with lend page ([7d041f6](https://github.com/kiva/ui/commit/7d041f68eaf434a2f1c0794f88319676daf22775))
* resolve issue with older carousel component ([374f44e](https://github.com/kiva/ui/commit/374f44e5293d0513bff0b54aaffcac54a2d942b8))
* resolve issue with popper when is initialized hidden ([a3155ca](https://github.com/kiva/ui/commit/a3155cacde7e298b7a81dd814d5f1ed4b04ef616))
* resolve issues found by linting ([da59885](https://github.com/kiva/ui/commit/da598857f57aa7681d97b5c65637c20ad6794c72))
* resolve issues on a couple newer pages with image glob ([5a8d692](https://github.com/kiva/ui/commit/5a8d692e3cc25a0fb70aca154bec0cb67536fe97))
* resolve issues with build page ([2e9fff1](https://github.com/kiva/ui/commit/2e9fff168783b1cde1e15a02314e74abf6cfd3d2))
* resolve issues with button component ([b029860](https://github.com/kiva/ui/commit/b02986088816c7eca4bed321280e833ebd385d45))
* resolve issues with campaign page ([96ee90f](https://github.com/kiva/ui/commit/96ee90f101039a920d8e478efd093329d0afbe6e))
* resolve issues with category page help me choose section ([6312494](https://github.com/kiva/ui/commit/6312494474ac45ee2d4c29d8bcaf9cc30078527f))
* resolve issues with category page quick filters ([a37d0f2](https://github.com/kiva/ui/commit/a37d0f2f3b6545d7ab45fef1cdfdf55382944f0d))
* resolve issues with client entry init ([0839846](https://github.com/kiva/ui/commit/08398466806752f179f98b828f07e57807fbd12a))
* resolve issues with flag icons not rendering ([d6871f5](https://github.com/kiva/ui/commit/d6871f54c5bbf0f90ef45baa40b8916ac573529c))
* resolve issues with grid story ([047aed5](https://github.com/kiva/ui/commit/047aed5849ee08bf1af8b765bfb9c10add216e52))
* resolve issues with html img src values ([8c871c4](https://github.com/kiva/ui/commit/8c871c449823dde3a4b815fcea2517858be14f40))
* resolve issues with image globs with subfolders ([f950d13](https://github.com/kiva/ui/commit/f950d13fd32657a78feed6f319411975a1fc75ff))
* resolve issues with monthly good page ([901ec9b](https://github.com/kiva/ui/commit/901ec9bf7db16f598936c904a28307e7a1ff1f6b))
* resolve issues with phone input (formatting update didn't work before either) ([f39f737](https://github.com/kiva/ui/commit/f39f73787091d8404aa74fabc13a0c445e37f84e))
* resolve issues with process instant lending ([71bf2be](https://github.com/kiva/ui/commit/71bf2be59dc909f1e6a475ddb8cb13f0c5741195))
* resolve issues with process join team ([8953d19](https://github.com/kiva/ui/commit/8953d19b024b6db7e945a45f22b36d71ce180fd0))
* resolve issues with router navigation specifically for lend/filter ([1498fa1](https://github.com/kiva/ui/commit/1498fa18bb794b613d9bc25f997172cf97686a87))
* resolve linting errors ([19f6ff9](https://github.com/kiva/ui/commit/19f6ff9bd492d16b91842db69b21377a388fec7f))
* resolve linting warnings ([f527ad7](https://github.com/kiva/ui/commit/f527ad786cb39493dc9db4943209b86c883dc87b))
* resolve merge coverage error in GH action ([0a0da7d](https://github.com/kiva/ui/commit/0a0da7d3a330a8e50e4397a37a2dd9b0737e7720))
* resolve more issues with base input and checkboxes ([9c0ad27](https://github.com/kiva/ui/commit/9c0ad27ed83a5f93f26daccf525d1aee99f98bca))
* resolve preFetchVariables route issues ([196f7c8](https://github.com/kiva/ui/commit/196f7c87a248723551cf81b24f8fdf0c0e3e8baf))
* resolve remaining issues with category page (clicking to load monthly good page) ([f0155e8](https://github.com/kiva/ui/commit/f0155e865ac931be26608c1272dd45933cb49e69))
* resolve story issue with correct default ([c8aa9a0](https://github.com/kiva/ui/commit/c8aa9a0ee0b2f38a4fac82bdc349b2c69e754c98))
* resolve transition needs single child error ([2851975](https://github.com/kiva/ui/commit/2851975e627fe78df1d18ae31be882cf4f0a2717))
* resolve warnings and errors when quick filters changed on category page ([ca13156](https://github.com/kiva/ui/commit/ca13156a67b7c04cb6310f90cb146e5f5f2a556d))
* resolved click outside directive issues with Vue 3 ([7125c22](https://github.com/kiva/ui/commit/7125c221592ff0d8015b83246eb8c3ed99c9ca2d))
* resolved issue with flag icons (removed sprite usage) ([1c5923b](https://github.com/kiva/ui/commit/1c5923b492d1e2d21ef48fc5254da59080273f41))
* resolved issue with the loan carousel on the lend-by-category page ([0558288](https://github.com/kiva/ui/commit/0558288ae9d412fa2b36e0c9737b704f99b94f66))
* resolved issue with tip message component ([2e678ed](https://github.com/kiva/ui/commit/2e678ed78f4ab9d85f14f79969aeef61d9767979))
* resolved issues with auto deposit form and added needed optional chaining to all forms ([f316567](https://github.com/kiva/ui/commit/f316567e7ae545a698ba2beab8ce075999633e8b))
* resolved issues with banner stories ([f999262](https://github.com/kiva/ui/commit/f99926291932c90f23aef383a68ad93f16b9f1f7))
* resolved issues with cc pages ([4530fc8](https://github.com/kiva/ui/commit/4530fc8a0de0a7cefebe8756390e77064ae45ef1))
* resolved issues with more stories (one of the BP stories was broken before as well) ([c618a8e](https://github.com/kiva/ui/commit/c618a8e4d833caeb64b91c30a0c4cfd9d6dc7f7c))
* resolved issues with unit tests (all pass without warnings/errors now) ([b7e7ab5](https://github.com/kiva/ui/commit/b7e7ab5e5b86c2c2fadec466109489163ee82b27))
* server side error where this file wasn't found with relative path ([3f3ba76](https://github.com/kiva/ui/commit/3f3ba76407e5b15ffafe0ac6bfe4c29fb1553747))
* small spelling fix ([b0836c9](https://github.com/kiva/ui/commit/b0836c9fcf7877f938c76eb125e7753c4375c57c))
* solve comments ([a7648ab](https://github.com/kiva/ui/commit/a7648abc1f12325c7f3588accd3c2d93fbdef4f4))
* some changes following previous commits ([ae78046](https://github.com/kiva/ui/commit/ae780469fff778482918c029655c48118dd52a3d))
* tabs for package.json indentation ([13c0fb3](https://github.com/kiva/ui/commit/13c0fb369c372095cd3c635bce2cac213071c8f9))
* turn off SSR for local dev to prevent CSS pop-in for components ([2016a22](https://github.com/kiva/ui/commit/2016a22f0f265de5420b69cbb93b95ee9f05f617))
* unit tests now all pass (fixed issue with KvCheckboxList) ([dcba7a7](https://github.com/kiva/ui/commit/dcba7a70509db3495dbfec5f1ff5eead9fe21520))
* update component lib to get updated select ([2954b83](https://github.com/kiva/ui/commit/2954b8386df127782a04a986bc85f4247da87fc1))
* update gql import ([f37f1aa](https://github.com/kiva/ui/commit/f37f1aa26652e665bbd95139015363aba043cb1e))
* update paths for static assets ([df9a2dc](https://github.com/kiva/ui/commit/df9a2dc87442375dd1d708a23d925147710dec69))
* update selects to work in vue3 ([df8b2ee](https://github.com/kiva/ui/commit/df8b2ee78340764b68128a52ad00366a3f88c6ea))
* update static asset path for docker build action ([ff013ab](https://github.com/kiva/ui/commit/ff013abad88686cf82e49572c710d34e5167bfb4))
* update static asset source path ([e7cb1b7](https://github.com/kiva/ui/commit/e7cb1b7a960e04778c25491e0aa15899dccd672f))
* update storybook deployment node version ([9631960](https://github.com/kiva/ui/commit/96319605dfcadf517ff56e18a703a1d9c35c8e8a))
* update storybook preview for vue 3 app & remove unused build config ([9241689](https://github.com/kiva/ui/commit/92416898294f18ccf938da3d100bee8dbdcd8521))
* upgrade kv-shop with tweaks that allow apollo dependency to load ([8cdd3da](https://github.com/kiva/ui/commit/8cdd3da94ddecd45eef797757a57f4825382d58a))
* upgrade node auth0 package to resolve authentication related errors ([82825b8](https://github.com/kiva/ui/commit/82825b87235960907ada2109def34b60e99e5f05))
* upgrade to vue3 ([0f89ec3](https://github.com/kiva/ui/commit/0f89ec3d65f580d44e8dc11cab1e7023ffabd610))
* upgraded cypress and confirmed tests running locally ([6f71180](https://github.com/kiva/ui/commit/6f71180edb73679eaaedef2324943e7241202aa2))
* use "head" instead of "metaInfo" ([8df4a08](https://github.com/kiva/ui/commit/8df4a08cd026e35e20a856a5283eff3ffc68de12))
* use absolute paths from project root for import.meta.glob ([0dcb945](https://github.com/kiva/ui/commit/0dcb945d9e5f7b6f88646ba2769b16b33bf240df))
* use direct aysnc import for router components ([69e0585](https://github.com/kiva/ui/commit/69e058523d92db259b67b17bb5be7b0745790d14))
* use head instead of metaInfo in UiSiteMap ([c2c1b05](https://github.com/kiva/ui/commit/c2c1b057467eef6bb369345ea334069403812ee0))
* use import.meta.glob to load flag svgs ([80fe5ca](https://github.com/kiva/ui/commit/80fe5caf37f5330172e51e4ded0ee80a353f8112))
* webmanifest with vite build ([ac02114](https://github.com/kiva/ui/commit/ac02114b02295870a4696dc66622b513d3ea8e7b))

### 🏗️ Build System

* allow importing of temporary file ([470e4d4](https://github.com/kiva/ui/commit/470e4d468630955dc8693fb615ce3d614140c826))
* client path should be set in source directory so that /static is the public asset root ([a1f6ba2](https://github.com/kiva/ui/commit/a1f6ba265194f461ea8be5cbd57ee3fd3f107691))
* ensure image build happens if github release was published ([4dfdffe](https://github.com/kiva/ui/commit/4dfdffe2af66fc069ffd05da5bf675a3a1d1d80c))

### 🪚 Refactors

* async functions and cache helper for getGqlPossibleTypes ([93eeb7d](https://github.com/kiva/ui/commit/93eeb7da60dcde50dac24ab89c177ffc2192e6fd))

### 🧹 Chores

* add ci branch option to vue-3 branch ([36f65a7](https://github.com/kiva/ui/commit/36f65a78f7ae7f7ad5d76562959d2813fc258f59))
* remove unused script include ([b33260b](https://github.com/kiva/ui/commit/b33260b9f6237bfd9dd69e907ceb5068c8c6e6f5))
* update lighthouse filename in github action ([03ba94b](https://github.com/kiva/ui/commit/03ba94b90106ac6e23773468dd139e8641e7490a))
* use vue3 branch of marketplace-web-ui-ci with updated Dockerfile ([b0b1eb0](https://github.com/kiva/ui/commit/b0b1eb0c5feb90773a1d466e7eff2c538780ae8c))

## [2.759.0](https://github.com/kiva/ui/compare/v2.758.1...v2.759.0) (2024-09-24)


### 🎉 New Features

* daf thanks page variation ([71b095f](https://github.com/kiva/ui/commit/71b095f6333e994ea40fab94934ced212b73561c))
* my kiva header ([f1bd0eb](https://github.com/kiva/ui/commit/f1bd0eb10cde2be6842699b754152a6b33a6919d))
* redirect to new lender page ([cffd656](https://github.com/kiva/ui/commit/cffd65659b9b8168598d62b3544f8e630d7973b2))
* use FLSS for live loan image filter searches when supported MP-732 ([27768b8](https://github.com/kiva/ui/commit/27768b8004463f441730762caf720cf05c8ccb14))


### 🐛 Bugfixes

* avatar size for desktop ([84499d6](https://github.com/kiva/ui/commit/84499d684c6c80739d9e996e75be398d21d82600))
* border in avatar ([425529c](https://github.com/kiva/ui/commit/425529c06f660705320a583e95f59cb430ee04c0))
* center user first letter in avatar ([91d57a2](https://github.com/kiva/ui/commit/91d57a2409e1066662e112cef97f5a06d7e305b3))
* container size ([0820e2f](https://github.com/kiva/ui/commit/0820e2f56b7fd3193e519b7587d8fb352654deea))
* empty object as default ([ffbf491](https://github.com/kiva/ui/commit/ffbf491f4b2e71449f39a1383c92f82cd8326ea4))
* error in parsing user preferences as json ([92c06e5](https://github.com/kiva/ui/commit/92c06e5f13fa8e959a79d1a695126dc513e5b312))
* linting ([ae166f4](https://github.com/kiva/ui/commit/ae166f4dfaafb27317165519cac60c7ffcc7301a))
* parseSortString does not need to be async MP-732 ([28654fc](https://github.com/kiva/ui/commit/28654fc3ac5c4b58f876ea7414e46a439f6c210b))
* preference needs to be an string ([2e6913d](https://github.com/kiva/ui/commit/2e6913d81429a6c95031e84f0290d4f8110f086b))
* remove ref ([61cfd8c](https://github.com/kiva/ui/commit/61cfd8c684c3db41b3ba0d568e7cf379825f414d))
* remove robots rule ([bf02af3](https://github.com/kiva/ui/commit/bf02af34a55cd4759cdb1658811c35ca997ccfc7))
* styles and alignment ([3137b01](https://github.com/kiva/ui/commit/3137b0172ebe2975829dc0914e03386115d3f59d))
* typo errors in profile ([d71a05d](https://github.com/kiva/ui/commit/d71a05d19d14ae7397cb8118ccf2494d09f5ad78))
* update live-loan tests and no-filter default ([14fccde](https://github.com/kiva/ui/commit/14fccdebe8cf6e19f8e2b886d85e1eee906a08ef))


### 🪚 Refactors

* new container for my kiva ([71ef961](https://github.com/kiva/ui/commit/71ef961b97bb2bec97c5e3579bbe4036fce9e240))
* split into components ([23e76ba](https://github.com/kiva/ui/commit/23e76babbe11d4ef746b57bded7bb2f0c9abc2ed))


### 🧹 Chores

* allow input of optional ci build branch ([e44feaf](https://github.com/kiva/ui/commit/e44feaf16a9df51ac76fbb03e129d711eeca1f70))
* **release:** 2.759.0-rc.1 [skip ci] ([d2d1d44](https://github.com/kiva/ui/commit/d2d1d4469c8ed55807c7f7174065f1c39fdb4032))

## [2.759.0-rc.1](https://github.com/kiva/ui/compare/v2.758.1...v2.759.0-rc.1) (2024-09-23)


### 🎉 New Features

* daf thanks page variation ([71b095f](https://github.com/kiva/ui/commit/71b095f6333e994ea40fab94934ced212b73561c))
* my kiva header ([f1bd0eb](https://github.com/kiva/ui/commit/f1bd0eb10cde2be6842699b754152a6b33a6919d))
* redirect to new lender page ([cffd656](https://github.com/kiva/ui/commit/cffd65659b9b8168598d62b3544f8e630d7973b2))
* use FLSS for live loan image filter searches when supported MP-732 ([27768b8](https://github.com/kiva/ui/commit/27768b8004463f441730762caf720cf05c8ccb14))


### 🐛 Bugfixes

* avatar size for desktop ([84499d6](https://github.com/kiva/ui/commit/84499d684c6c80739d9e996e75be398d21d82600))
* border in avatar ([425529c](https://github.com/kiva/ui/commit/425529c06f660705320a583e95f59cb430ee04c0))
* center user first letter in avatar ([91d57a2](https://github.com/kiva/ui/commit/91d57a2409e1066662e112cef97f5a06d7e305b3))
* container size ([0820e2f](https://github.com/kiva/ui/commit/0820e2f56b7fd3193e519b7587d8fb352654deea))
* empty object as default ([ffbf491](https://github.com/kiva/ui/commit/ffbf491f4b2e71449f39a1383c92f82cd8326ea4))
* error in parsing user preferences as json ([92c06e5](https://github.com/kiva/ui/commit/92c06e5f13fa8e959a79d1a695126dc513e5b312))
* linting ([ae166f4](https://github.com/kiva/ui/commit/ae166f4dfaafb27317165519cac60c7ffcc7301a))
* parseSortString does not need to be async MP-732 ([28654fc](https://github.com/kiva/ui/commit/28654fc3ac5c4b58f876ea7414e46a439f6c210b))
* preference needs to be an string ([2e6913d](https://github.com/kiva/ui/commit/2e6913d81429a6c95031e84f0290d4f8110f086b))
* remove ref ([61cfd8c](https://github.com/kiva/ui/commit/61cfd8c684c3db41b3ba0d568e7cf379825f414d))
* remove robots rule ([bf02af3](https://github.com/kiva/ui/commit/bf02af34a55cd4759cdb1658811c35ca997ccfc7))
* styles and alignment ([3137b01](https://github.com/kiva/ui/commit/3137b0172ebe2975829dc0914e03386115d3f59d))
* typo errors in profile ([d71a05d](https://github.com/kiva/ui/commit/d71a05d19d14ae7397cb8118ccf2494d09f5ad78))
* update live-loan tests and no-filter default ([14fccde](https://github.com/kiva/ui/commit/14fccdebe8cf6e19f8e2b886d85e1eee906a08ef))


### 🪚 Refactors

* new container for my kiva ([71ef961](https://github.com/kiva/ui/commit/71ef961b97bb2bec97c5e3579bbe4036fce9e240))
* split into components ([23e76ba](https://github.com/kiva/ui/commit/23e76babbe11d4ef746b57bded7bb2f0c9abc2ed))


### 🧹 Chores

* allow input of optional ci build branch ([e44feaf](https://github.com/kiva/ui/commit/e44feaf16a9df51ac76fbb03e129d711eeca1f70))

## [2.758.1](https://github.com/kiva/ui/compare/v2.758.0...v2.758.1) (2024-09-13)


### 🐛 Bugfixes

* latest lib with potential memory leak fix ([8255a24](https://github.com/kiva/ui/commit/8255a2448f5567e8687e73a07a2be0094b27744b))
* revert changes from memory leak investigations ([8af2d5c](https://github.com/kiva/ui/commit/8af2d5c059b13a39bbcacc4e6283ab96a3f2de2a))
* used firstLoan variable was not considering if the user was a guest ([a2ee1c6](https://github.com/kiva/ui/commit/a2ee1c6f850b6b960178f1802d6505924b7229b3))


### 🧹 Chores

* **release:** 2.758.1-rc.1 [skip ci] ([3554847](https://github.com/kiva/ui/commit/3554847a16db6fe9ecce8939e567493c60314a47))

## [2.758.1-rc.1](https://github.com/kiva/ui/compare/v2.758.0...v2.758.1-rc.1) (2024-09-13)


### 🐛 Bugfixes

* latest lib with potential memory leak fix ([8255a24](https://github.com/kiva/ui/commit/8255a2448f5567e8687e73a07a2be0094b27744b))
* revert changes from memory leak investigations ([8af2d5c](https://github.com/kiva/ui/commit/8af2d5c059b13a39bbcacc4e6283ab96a3f2de2a))
* used firstLoan variable was not considering if the user was a guest ([a2ee1c6](https://github.com/kiva/ui/commit/a2ee1c6f850b6b960178f1802d6505924b7229b3))

## [2.758.0](https://github.com/kiva/ui/compare/v2.757.0...v2.758.0) (2024-09-13)


### 🎉 New Features

* add support for new equity badge in lending stats ([484efef](https://github.com/kiva/ui/commit/484efef9663c9a685c7ba68130d9b658a1a82464))


### 🐛 Bugfixes

* another lib version check ([7fdb065](https://github.com/kiva/ui/commit/7fdb065cfe8d4693d6bed112f98a1144e8f7cfec))


### 🧹 Chores

* **release:** 2.758.0-rc.1 [skip ci] ([0508a0e](https://github.com/kiva/ui/commit/0508a0ebd1250c6cf094c18c1cb196025b78fde4))

## [2.758.0-rc.1](https://github.com/kiva/ui/compare/v2.757.0...v2.758.0-rc.1) (2024-09-13)


### 🎉 New Features

* add support for new equity badge in lending stats ([484efef](https://github.com/kiva/ui/commit/484efef9663c9a685c7ba68130d9b658a1a82464))


### 🐛 Bugfixes

* another lib version check ([7fdb065](https://github.com/kiva/ui/commit/7fdb065cfe8d4693d6bed112f98a1144e8f7cfec))

## [2.757.0](https://github.com/kiva/ui/compare/v2.756.4...v2.757.0) (2024-09-12)


### 🎉 New Features

* change of copy in revealed badge description ([f9e95d6](https://github.com/kiva/ui/commit/f9e95d6c19d85656f48956917e6cb51f064d14b1))


### 🐛 Bugfixes

* try next component lib version ([59b9523](https://github.com/kiva/ui/commit/59b9523df2626c23faac0667415f8bd433182825))


### 🧹 Chores

* **release:** 2.757.0-rc.1 [skip ci] ([0949737](https://github.com/kiva/ui/commit/0949737755bb966e4417d8ddda99acaba4718cd1))

## [2.757.0-rc.1](https://github.com/kiva/ui/compare/v2.756.4...v2.757.0-rc.1) (2024-09-12)


### 🎉 New Features

* change of copy in revealed badge description ([f9e95d6](https://github.com/kiva/ui/commit/f9e95d6c19d85656f48956917e6cb51f064d14b1))


### 🐛 Bugfixes

* try next component lib version ([59b9523](https://github.com/kiva/ui/commit/59b9523df2626c23faac0667415f8bd433182825))

## [2.756.4](https://github.com/kiva/ui/compare/v2.756.3...v2.756.4) (2024-09-12)


### 🐛 Bugfixes

* try next component lib version for memory leak ([74d9520](https://github.com/kiva/ui/commit/74d9520c16ce20bd517275be0afec87f4490fd2d))


### 🧹 Chores

* **release:** 2.756.4-rc.1 [skip ci] ([0e2e91d](https://github.com/kiva/ui/commit/0e2e91db9c253a475e8a5c13de29e88c9e819356))

## [2.756.4-rc.1](https://github.com/kiva/ui/compare/v2.756.3...v2.756.4-rc.1) (2024-09-12)


### 🐛 Bugfixes

* try next component lib version for memory leak ([74d9520](https://github.com/kiva/ui/commit/74d9520c16ce20bd517275be0afec87f4490fd2d))

## [2.756.3](https://github.com/kiva/ui/compare/v2.756.2...v2.756.3) (2024-09-12)


### 🐛 Bugfixes

* try next component lib version for memory leak ([a6c04f4](https://github.com/kiva/ui/commit/a6c04f42de65863924c4a9aff3c64c2eb56f4188))


### 🧹 Chores

* **release:** 2.756.3-rc.1 [skip ci] ([53cf2df](https://github.com/kiva/ui/commit/53cf2dfdab42826cd40cf8997f3ad28338d2dac6))

## [2.756.3-rc.1](https://github.com/kiva/ui/compare/v2.756.2...v2.756.3-rc.1) (2024-09-12)


### 🐛 Bugfixes

* try next component lib version for memory leak ([a6c04f4](https://github.com/kiva/ui/commit/a6c04f42de65863924c4a9aff3c64c2eb56f4188))

## [2.756.2](https://github.com/kiva/ui/compare/v2.756.1...v2.756.2) (2024-09-12)


### 🐛 Bugfixes

* next package version while investigating memory leak ([711551f](https://github.com/kiva/ui/commit/711551fdcd566e5883f6399892e325a9bbca8eb0))


### 🧹 Chores

* **release:** 2.756.2-rc.1 [skip ci] ([3422943](https://github.com/kiva/ui/commit/3422943cdc64e50f5cfa387ac9f30ee1e4cb99bd))

## [2.756.2-rc.1](https://github.com/kiva/ui/compare/v2.756.1...v2.756.2-rc.1) (2024-09-12)


### 🐛 Bugfixes

* next package version while investigating memory leak ([711551f](https://github.com/kiva/ui/commit/711551fdcd566e5883f6399892e325a9bbca8eb0))

## [2.756.1](https://github.com/kiva/ui/compare/v2.756.0...v2.756.1) (2024-09-11)


### 🐛 Bugfixes

* version in lock was wrong ([1728d00](https://github.com/kiva/ui/commit/1728d00966b82df8054a409ea7605217fc11950d))
* walk up component lib version ([bca7390](https://github.com/kiva/ui/commit/bca7390a0a6e15a16e426e3d3efb48d67d93f258))


### 🧹 Chores

* **release:** 2.756.1-rc.1 [skip ci] ([d9b33c4](https://github.com/kiva/ui/commit/d9b33c460a35e2ea1606b3528d59e8d515f0061f))

## [2.756.1-rc.1](https://github.com/kiva/ui/compare/v2.756.0...v2.756.1-rc.1) (2024-09-11)


### 🐛 Bugfixes

* version in lock was wrong ([1728d00](https://github.com/kiva/ui/commit/1728d00966b82df8054a409ea7605217fc11950d))
* walk up component lib version ([bca7390](https://github.com/kiva/ui/commit/bca7390a0a6e15a16e426e3d3efb48d67d93f258))

## [2.756.0](https://github.com/kiva/ui/compare/v2.755.0...v2.756.0) (2024-09-11)


### 🎉 New Features

* exclude from badge experiments users that has lent before ([bff4917](https://github.com/kiva/ui/commit/bff491760205c78c358b6aa8ca5d09f868e029b2))
* showing old ty page for print-in-yourself kiva card in basket ([74f4843](https://github.com/kiva/ui/commit/74f4843d000c32ec1d96f7758bfd5447d670b5c6))


### 🐛 Bugfixes

* linting ([5eb37ae](https://github.com/kiva/ui/commit/5eb37ae42a13d71d0e1aa02886c03c62f6f6f87a))
* print kiva cards should have more priority on visible section ([0e4d746](https://github.com/kiva/ui/commit/0e4d7467425fb1a9b2dcd031a35d0abd4d3886da))
* rollback component lib further ([4deb59c](https://github.com/kiva/ui/commit/4deb59c393048150d6d84e0fc31be9734f529e17))


### 🧹 Chores

* **release:** 2.756.0-rc.1 [skip ci] ([9c64669](https://github.com/kiva/ui/commit/9c646695489743236cde45a103f6b273e0d02e51))

## [2.756.0-rc.1](https://github.com/kiva/ui/compare/v2.755.0...v2.756.0-rc.1) (2024-09-11)


### 🎉 New Features

* exclude from badge experiments users that has lent before ([bff4917](https://github.com/kiva/ui/commit/bff491760205c78c358b6aa8ca5d09f868e029b2))
* showing old ty page for print-in-yourself kiva card in basket ([74f4843](https://github.com/kiva/ui/commit/74f4843d000c32ec1d96f7758bfd5447d670b5c6))


### 🐛 Bugfixes

* linting ([5eb37ae](https://github.com/kiva/ui/commit/5eb37ae42a13d71d0e1aa02886c03c62f6f6f87a))
* print kiva cards should have more priority on visible section ([0e4d746](https://github.com/kiva/ui/commit/0e4d7467425fb1a9b2dcd031a35d0abd4d3886da))
* rollback component lib further ([4deb59c](https://github.com/kiva/ui/commit/4deb59c393048150d6d84e0fc31be9734f529e17))

## [2.755.0](https://github.com/kiva/ui/compare/v2.754.2...v2.755.0) (2024-09-11)


### 🎉 New Features

* footer updated ([#5496](https://github.com/kiva/ui/issues/5496)) ([1ca7a26](https://github.com/kiva/ui/commit/1ca7a26b5d84153c8f7dd651b1655bdb22737022))


### 🐛 Bugfixes

* try rolling back components library for memory leak ([872ba69](https://github.com/kiva/ui/commit/872ba69e940ae91d1f6388097620d690fdd1361e))


### 🧹 Chores

* **release:** 2.755.0-rc.1 [skip ci] ([1b6e543](https://github.com/kiva/ui/commit/1b6e543cccb5a4f000cdfbc8e071f5dffbcc3be8)), closes [#5496](https://github.com/kiva/ui/issues/5496)

## [2.755.0-rc.1](https://github.com/kiva/ui/compare/v2.754.2...v2.755.0-rc.1) (2024-09-11)


### 🎉 New Features

* footer updated ([#5496](https://github.com/kiva/ui/issues/5496)) ([1ca7a26](https://github.com/kiva/ui/commit/1ca7a26b5d84153c8f7dd651b1655bdb22737022))


### 🐛 Bugfixes

* try rolling back components library for memory leak ([872ba69](https://github.com/kiva/ui/commit/872ba69e940ae91d1f6388097620d690fdd1361e))

## [2.754.2](https://github.com/kiva/ui/compare/v2.754.1...v2.754.2) (2024-09-10)


### 🐛 Bugfixes

* linting ([58a96e6](https://github.com/kiva/ui/commit/58a96e6a3dc2e06c8ac178a185408c04f72002a5))
* linting ([bea8f01](https://github.com/kiva/ui/commit/bea8f01fd3f69b81186aa40d1576ade914166253))
* try old charts while tracking down memory leak ([642cc1b](https://github.com/kiva/ui/commit/642cc1b6f0bf95d8cc028c8d3f6358fab296811d))


### 🧹 Chores

* **release:** 2.754.2-rc.1 [skip ci] ([ea8f09e](https://github.com/kiva/ui/commit/ea8f09ee2787fd5b4254fcde63a18057d89b9285))

## [2.754.2-rc.1](https://github.com/kiva/ui/compare/v2.754.1...v2.754.2-rc.1) (2024-09-10)


### 🐛 Bugfixes

* linting ([58a96e6](https://github.com/kiva/ui/commit/58a96e6a3dc2e06c8ac178a185408c04f72002a5))
* linting ([bea8f01](https://github.com/kiva/ui/commit/bea8f01fd3f69b81186aa40d1576ade914166253))
* try old charts while tracking down memory leak ([642cc1b](https://github.com/kiva/ui/commit/642cc1b6f0bf95d8cc028c8d3f6358fab296811d))

## [2.754.1](https://github.com/kiva/ui/compare/v2.754.0...v2.754.1) (2024-09-10)


### 🐛 Bugfixes

* linting ([3de8068](https://github.com/kiva/ui/commit/3de8068018580ff9e8ab675fa88881decb432579))
* reenable features for demo ([1a53750](https://github.com/kiva/ui/commit/1a53750b3de3b50c04b05cb95618862fa8e68a7b))
* try disabling ty badge experience to track down memory leak ([ac0fb20](https://github.com/kiva/ui/commit/ac0fb20dd40a4fb925fa4bc96773ecc6970cf82c))


### 🧹 Chores

* **release:** 2.754.1-rc.1 [skip ci] ([d702703](https://github.com/kiva/ui/commit/d702703f660fa0eeccf41c2ec505fa118d781156))

## [2.754.1-rc.1](https://github.com/kiva/ui/compare/v2.754.0...v2.754.1-rc.1) (2024-09-10)


### 🐛 Bugfixes

* linting ([3de8068](https://github.com/kiva/ui/commit/3de8068018580ff9e8ab675fa88881decb432579))
* reenable features for demo ([1a53750](https://github.com/kiva/ui/commit/1a53750b3de3b50c04b05cb95618862fa8e68a7b))
* try disabling ty badge experience to track down memory leak ([ac0fb20](https://github.com/kiva/ui/commit/ac0fb20dd40a4fb925fa4bc96773ecc6970cf82c))

## [2.754.0](https://github.com/kiva/ui/compare/v2.753.1...v2.754.0) (2024-09-10)


### 🎉 New Features

* exclude users that uses kiva card on checkout ([f683109](https://github.com/kiva/ui/commit/f683109645f7dbe7ae0abaab48d7421b466895f1))


### 🐛 Bugfixes

* hide badge experiment when user checkouts with a printable card ([f765b23](https://github.com/kiva/ui/commit/f765b234e8fab6945a8e194fa94cb32d4d81034c))
* try disabling new lender profile page ([7911980](https://github.com/kiva/ui/commit/7911980a787bb87255794ebe555ebc0b1b6c7059))


### 🧹 Chores

* **release:** 2.754.0-rc.1 [skip ci] ([a2daadb](https://github.com/kiva/ui/commit/a2daadbcf012b0ff061d801a7059c80d57a28795))

## [2.754.0-rc.1](https://github.com/kiva/ui/compare/v2.753.1...v2.754.0-rc.1) (2024-09-10)


### 🎉 New Features

* exclude users that uses kiva card on checkout ([f683109](https://github.com/kiva/ui/commit/f683109645f7dbe7ae0abaab48d7421b466895f1))


### 🐛 Bugfixes

* hide badge experiment when user checkouts with a printable card ([f765b23](https://github.com/kiva/ui/commit/f765b234e8fab6945a8e194fa94cb32d4d81034c))
* try disabling new lender profile page ([7911980](https://github.com/kiva/ui/commit/7911980a787bb87255794ebe555ebc0b1b6c7059))

## [2.753.1](https://github.com/kiva/ui/compare/v2.753.0...v2.753.1) (2024-09-09)


### 🐛 Bugfixes

* try disabling lender map for memory leak ([6862692](https://github.com/kiva/ui/commit/68626929c2173bf855ecad3bb7697428f7dda408))


### 🧹 Chores

* **release:** 2.753.1-rc.1 [skip ci] ([0d0d6be](https://github.com/kiva/ui/commit/0d0d6be536b142fc4157b05e0066f1a0abb78c4b))

## [2.753.1-rc.1](https://github.com/kiva/ui/compare/v2.753.0...v2.753.1-rc.1) (2024-09-09)


### 🐛 Bugfixes

* try disabling lender map for memory leak ([6862692](https://github.com/kiva/ui/commit/68626929c2173bf855ecad3bb7697428f7dda408))

## [2.753.0](https://github.com/kiva/ui/compare/v2.752.0...v2.753.0) (2024-09-09)


### 🎉 New Features

* add loan display snowplow events to funded bp ([93bb3b6](https://github.com/kiva/ui/commit/93bb3b62f56794743a9b36bae92a363f2218db03))
* handle goal in portfolio for all users in experiment ([05a7f04](https://github.com/kiva/ui/commit/05a7f046e3caaff15300ec600a370a98e76ac123))
* my kiva experiment setup added ([#5480](https://github.com/kiva/ui/issues/5480)) ([beb8b23](https://github.com/kiva/ui/commit/beb8b23cc309ae69b9d444111d5dea1efb882a94))
* roll out TY page experiment ([2765bb6](https://github.com/kiva/ui/commit/2765bb62889d762b8f276566f92ba4060c70f1c4))
* tracking events added to lender profile ([#5472](https://github.com/kiva/ui/issues/5472)) ([bf30028](https://github.com/kiva/ui/commit/bf30028ffc486ecd8857ed2396297f4e0ae2475d))


### 🐛 Bugfixes

* add number of loans within badge category in anaylitics ([3799cd4](https://github.com/kiva/ui/commit/3799cd468894becc58c9744f526d91b39c0befc8))
* bg was wrong when user not opted in and no loans in checkout ([52367d0](https://github.com/kiva/ui/commit/52367d03d62142c8e602e3e36bd299eec82780e9))
* carousel design ([c386c31](https://github.com/kiva/ui/commit/c386c31314b403b3e9744182fdfb2991876fb750))
* conflict ([c228fdb](https://github.com/kiva/ui/commit/c228fdb82fb12be724381a22d86d7d9a858d6966))
* design tweaks ([541f95c](https://github.com/kiva/ui/commit/541f95c2b70aff6c7fbd4aa9f4bc888fa79fd092))
* ensure show available upsell loan ([#5485](https://github.com/kiva/ui/issues/5485)) ([8eee617](https://github.com/kiva/ui/commit/8eee6177e395eedd1043efdfbb771e3df5165ce1))
* evaluate some tags and themes ([80f3b3b](https://github.com/kiva/ui/commit/80f3b3b6bf45abb9f1c1e5cdfcbfbd8016687bf0))
* goal name and handling create user preference before storing goal ([03af218](https://github.com/kiva/ui/commit/03af2187d8eb6e6956e6e238a7ca1c03ff2ba677))
* index was incorrect on recommended loan on funded BP for interaction snowplow ([9ebc14c](https://github.com/kiva/ui/commit/9ebc14ceb812f95eae2c5d6d08aeb3ff4c14734b))
* line length ([3e864cb](https://github.com/kiva/ui/commit/3e864cbe8fcd75e025c504c769913ff9c3c8a1b4))
* lint ([386b92d](https://github.com/kiva/ui/commit/386b92d563fea5faa2525e2f482ab74c413dd739))
* long line ([aed018f](https://github.com/kiva/ui/commit/aed018fe721265c355357fff03965d6bc766288b))
* missing tracking information ([6ad1d97](https://github.com/kiva/ui/commit/6ad1d970c3fa2b4658256f1fec88026c51e7bb5b))
* moving logic to mounted ([fa2d9d9](https://github.com/kiva/ui/commit/fa2d9d9959d7de50b2ab524c25e6d7236558d1b5))
* remove optional chaining ([56397b9](https://github.com/kiva/ui/commit/56397b91489b3ce871f3e7c24b5690f964ea73fe))
* resolve potential loan country undefined server error ([8ff58dd](https://github.com/kiva/ui/commit/8ff58dd101f4f753c58efaafcd03bd57db863337))
* show new TY experience for more users ([ec62bb9](https://github.com/kiva/ui/commit/ec62bb927aba37c1a0776f9b88cb3ebf4f12d597))
* show old ty page for non-loan purchases ([5cd8808](https://github.com/kiva/ui/commit/5cd88085a5891ce95001914025a9f4b91a27e1ce))
* try commenting out unshift in effort to track down memory leak ([bf9a23a](https://github.com/kiva/ui/commit/bf9a23ac79c8d97e515a53bb249d877e7a826094))
* upgrading components library to make sure tree map still works ([b7f6ebf](https://github.com/kiva/ui/commit/b7f6ebffd798351a069f3cafb9cb56a0b79439c2))


### 🧹 Chores

* **release:** 2.753.0-rc.1 [skip ci] ([3ed52de](https://github.com/kiva/ui/commit/3ed52debab90c727283fd6d557d1bfca3c38f165)), closes [#5480](https://github.com/kiva/ui/issues/5480) [#5472](https://github.com/kiva/ui/issues/5472) [#5485](https://github.com/kiva/ui/issues/5485)

## [2.753.0-rc.1](https://github.com/kiva/ui/compare/v2.752.0...v2.753.0-rc.1) (2024-09-09)


### 🎉 New Features

* add loan display snowplow events to funded bp ([93bb3b6](https://github.com/kiva/ui/commit/93bb3b62f56794743a9b36bae92a363f2218db03))
* handle goal in portfolio for all users in experiment ([05a7f04](https://github.com/kiva/ui/commit/05a7f046e3caaff15300ec600a370a98e76ac123))
* my kiva experiment setup added ([#5480](https://github.com/kiva/ui/issues/5480)) ([beb8b23](https://github.com/kiva/ui/commit/beb8b23cc309ae69b9d444111d5dea1efb882a94))
* roll out TY page experiment ([2765bb6](https://github.com/kiva/ui/commit/2765bb62889d762b8f276566f92ba4060c70f1c4))
* tracking events added to lender profile ([#5472](https://github.com/kiva/ui/issues/5472)) ([bf30028](https://github.com/kiva/ui/commit/bf30028ffc486ecd8857ed2396297f4e0ae2475d))


### 🐛 Bugfixes

* add number of loans within badge category in anaylitics ([3799cd4](https://github.com/kiva/ui/commit/3799cd468894becc58c9744f526d91b39c0befc8))
* bg was wrong when user not opted in and no loans in checkout ([52367d0](https://github.com/kiva/ui/commit/52367d03d62142c8e602e3e36bd299eec82780e9))
* carousel design ([c386c31](https://github.com/kiva/ui/commit/c386c31314b403b3e9744182fdfb2991876fb750))
* conflict ([c228fdb](https://github.com/kiva/ui/commit/c228fdb82fb12be724381a22d86d7d9a858d6966))
* design tweaks ([541f95c](https://github.com/kiva/ui/commit/541f95c2b70aff6c7fbd4aa9f4bc888fa79fd092))
* ensure show available upsell loan ([#5485](https://github.com/kiva/ui/issues/5485)) ([8eee617](https://github.com/kiva/ui/commit/8eee6177e395eedd1043efdfbb771e3df5165ce1))
* evaluate some tags and themes ([80f3b3b](https://github.com/kiva/ui/commit/80f3b3b6bf45abb9f1c1e5cdfcbfbd8016687bf0))
* goal name and handling create user preference before storing goal ([03af218](https://github.com/kiva/ui/commit/03af2187d8eb6e6956e6e238a7ca1c03ff2ba677))
* index was incorrect on recommended loan on funded BP for interaction snowplow ([9ebc14c](https://github.com/kiva/ui/commit/9ebc14ceb812f95eae2c5d6d08aeb3ff4c14734b))
* line length ([3e864cb](https://github.com/kiva/ui/commit/3e864cbe8fcd75e025c504c769913ff9c3c8a1b4))
* lint ([386b92d](https://github.com/kiva/ui/commit/386b92d563fea5faa2525e2f482ab74c413dd739))
* long line ([aed018f](https://github.com/kiva/ui/commit/aed018fe721265c355357fff03965d6bc766288b))
* missing tracking information ([6ad1d97](https://github.com/kiva/ui/commit/6ad1d970c3fa2b4658256f1fec88026c51e7bb5b))
* moving logic to mounted ([fa2d9d9](https://github.com/kiva/ui/commit/fa2d9d9959d7de50b2ab524c25e6d7236558d1b5))
* remove optional chaining ([56397b9](https://github.com/kiva/ui/commit/56397b91489b3ce871f3e7c24b5690f964ea73fe))
* resolve potential loan country undefined server error ([8ff58dd](https://github.com/kiva/ui/commit/8ff58dd101f4f753c58efaafcd03bd57db863337))
* show new TY experience for more users ([ec62bb9](https://github.com/kiva/ui/commit/ec62bb927aba37c1a0776f9b88cb3ebf4f12d597))
* show old ty page for non-loan purchases ([5cd8808](https://github.com/kiva/ui/commit/5cd88085a5891ce95001914025a9f4b91a27e1ce))
* try commenting out unshift in effort to track down memory leak ([bf9a23a](https://github.com/kiva/ui/commit/bf9a23ac79c8d97e515a53bb249d877e7a826094))
* upgrading components library to make sure tree map still works ([b7f6ebf](https://github.com/kiva/ui/commit/b7f6ebffd798351a069f3cafb9cb56a0b79439c2))

## [2.752.0](https://github.com/kiva/ui/compare/v2.751.0...v2.752.0) (2024-08-29)


### 🎉 New Features

* add helper text to braintree dropin ([58920d3](https://github.com/kiva/ui/commit/58920d3c709b2854e25c3b0a86719737d9297482))
* lender stats data import updated ([#5467](https://github.com/kiva/ui/issues/5467)) ([77106c1](https://github.com/kiva/ui/commit/77106c144edbffcef90ef2ec3513a0974fa07652))
* redirect guest users to register form ([a546090](https://github.com/kiva/ui/commit/a54609058eb6a2fd8baeeb0e6cf59ae2ad009722))
* show tip on error ([7eb123f](https://github.com/kiva/ui/commit/7eb123fad43238b707424ce0e2793b85fa8d5f94))
* update user preferences when saving goal ([d439700](https://github.com/kiva/ui/commit/d43970003502f02eb9d298121ebfd354e282a399))


### 🐛 Bugfixes

* json parse error ([c275ef6](https://github.com/kiva/ui/commit/c275ef657cd46cd623b7bcc7f01c32b028386396))
* linting ([94de904](https://github.com/kiva/ui/commit/94de904b083b4cc017db316725bce3bb0aea75fc))
* router ([763c2f7](https://github.com/kiva/ui/commit/763c2f7eff7e4f229d4439221f639e948cb1802a))
* using console instead of throw when catching error ([af3dc0e](https://github.com/kiva/ui/commit/af3dc0ee091b2374ae868a9bd2321980bca9d56c))


### 🧹 Chores

* **release:** 2.752.0-rc.1 [skip ci] ([46fe664](https://github.com/kiva/ui/commit/46fe664deb0809d595c26bf99571c07339f04a0f)), closes [#5467](https://github.com/kiva/ui/issues/5467)

## [2.752.0-rc.1](https://github.com/kiva/ui/compare/v2.751.0...v2.752.0-rc.1) (2024-08-29)


### 🎉 New Features

* add helper text to braintree dropin ([58920d3](https://github.com/kiva/ui/commit/58920d3c709b2854e25c3b0a86719737d9297482))
* lender stats data import updated ([#5467](https://github.com/kiva/ui/issues/5467)) ([77106c1](https://github.com/kiva/ui/commit/77106c144edbffcef90ef2ec3513a0974fa07652))
* redirect guest users to register form ([a546090](https://github.com/kiva/ui/commit/a54609058eb6a2fd8baeeb0e6cf59ae2ad009722))
* show tip on error ([7eb123f](https://github.com/kiva/ui/commit/7eb123fad43238b707424ce0e2793b85fa8d5f94))
* update user preferences when saving goal ([d439700](https://github.com/kiva/ui/commit/d43970003502f02eb9d298121ebfd354e282a399))


### 🐛 Bugfixes

* json parse error ([c275ef6](https://github.com/kiva/ui/commit/c275ef657cd46cd623b7bcc7f01c32b028386396))
* linting ([94de904](https://github.com/kiva/ui/commit/94de904b083b4cc017db316725bce3bb0aea75fc))
* router ([763c2f7](https://github.com/kiva/ui/commit/763c2f7eff7e4f229d4439221f639e948cb1802a))
* using console instead of throw when catching error ([af3dc0e](https://github.com/kiva/ui/commit/af3dc0ee091b2374ae868a9bd2321980bca9d56c))

## [2.751.0](https://github.com/kiva/ui/compare/v2.750.0...v2.751.0) (2024-08-27)


### 🎉 New Features

* 404 page added ([#5444](https://github.com/kiva/ui/issues/5444)) ([c477382](https://github.com/kiva/ui/commit/c47738239b58f143aa5e770f58ae2e8954105f40))
* charts replaced with shared ones from kv components ([#5458](https://github.com/kiva/ui/issues/5458)) ([251c64b](https://github.com/kiva/ui/commit/251c64b6b6921c31074396f725e968f7a8e6972e))
* create an intermediate screen after badge is revealed to enhance transition between screens ([8d69893](https://github.com/kiva/ui/commit/8d69893c20196c0bba056b986716104c422ad32d))
* handle unknown lender on profile page ([#5455](https://github.com/kiva/ui/issues/5455)) ([a4c1986](https://github.com/kiva/ui/commit/a4c1986d67f6a4ca77f7c78a831fa8551990642d))
* integrate kv-carousel for badges ([5dada33](https://github.com/kiva/ui/commit/5dada334a0178534366c9035e17f0bb092a5587c))
* lender profile headings updated ([#5459](https://github.com/kiva/ui/issues/5459)) ([d25806d](https://github.com/kiva/ui/commit/d25806dbddc22f5fadc6d81380355e3a2ead7f7e))
* loading states adding to lender profile sections ([#5451](https://github.com/kiva/ui/issues/5451)) ([c17e0fd](https://github.com/kiva/ui/commit/c17e0fd2f89bb5d73f847ab2e23cc1a6de93644d))
* loans map added to lender profile ([#5438](https://github.com/kiva/ui/issues/5438)) ([55ba677](https://github.com/kiva/ui/commit/55ba677cf82de55adda65587aa5ebb40d5f4398e))
* meta data updated in lender profile ([#5445](https://github.com/kiva/ui/issues/5445)) ([f0a1d70](https://github.com/kiva/ui/commit/f0a1d70352ff7ac565389e3b824fae0efc145c32))
* pie chart mobile view fixed ([#5447](https://github.com/kiva/ui/issues/5447)) ([e230642](https://github.com/kiva/ui/commit/e23064296159b1da64d3e8a5a74b72fba934d168))
* reorganize structure and create discover component view ([b308c78](https://github.com/kiva/ui/commit/b308c78700c606fdd41263f6050c3cf572a9b88b))
* set badge fullscreen on click and fade in elements ([c8ed11c](https://github.com/kiva/ui/commit/c8ed11c31447079ce64074e22032f5f0bc6b1c0a))
* set new deposit incentive end date MP-692 ([83bba41](https://github.com/kiva/ui/commit/83bba41a9d276edea74b8f90fc11b0a9a0ad1c10))
* smooth badge unblur ([ed9af43](https://github.com/kiva/ui/commit/ed9af433a1a83cdc709dca647d774ec0621f1cc1))


### 🐛 Bugfixes

* 3 cols for desktop ([4a6b1aa](https://github.com/kiva/ui/commit/4a6b1aafa3b42996fa3e906f31aed889bdd69a45))
* change refugee badge name to plural ([8e10d76](https://github.com/kiva/ui/commit/8e10d76ef2b6255c41156f275f1be1b2cc60d618))
* extract async checkout error object with primary format ([2746096](https://github.com/kiva/ui/commit/27460969f0ad836266e8869b8ffeba90a148cff4))
* fix optional chaining for fallback error states ([8c586ff](https://github.com/kiva/ui/commit/8c586ff78b8be2b16eb9557a0c2169a8e3ed2d21))
* grow new bg to fullscreen except for header and footer ([59f941a](https://github.com/kiva/ui/commit/59f941a29b95d6ed53367e636220a444b409e5ba))
* hide name using badge id ([11e992d](https://github.com/kiva/ui/commit/11e992de8ca41b18b54217e7bfcb12ef493581c7))
* lint ([d637937](https://github.com/kiva/ui/commit/d63793718eac79af35b8bcd47b6179dcd237318a))
* lint ([49bb940](https://github.com/kiva/ui/commit/49bb940b725c61032d82c7881257cdc575dc1f69))
* lint ([2f5852a](https://github.com/kiva/ui/commit/2f5852ae94612ebe900645cead47316e4fe5f33d))
* lint ([67e819e](https://github.com/kiva/ui/commit/67e819e98d5693a9c4653a3dbc19791463404cf3))
* mfa api token auth requires using authorize call, not checkSession MP-479 ([56f4fc5](https://github.com/kiva/ui/commit/56f4fc53aac82baef73a96f0e03d6d3427bd3356))
* missing region in ty page query ([b778aab](https://github.com/kiva/ui/commit/b778aab59a3c801ee6a1337a5b4465bb770a4317))
* missing track property ([f357a9b](https://github.com/kiva/ui/commit/f357a9bfd5c9242a05ca4644c7d325dba62024c4))
* remove checkout sticky code ([a40e081](https://github.com/kiva/ui/commit/a40e08131e480dd6e11b360e93553285f1b62960))
* remove unused args in story ([b8810f9](https://github.com/kiva/ui/commit/b8810f913f4e4e24f63e27ebccb315042ff1fb9e))
* state is in hash and show error page for error conditions MP-479 ([59d3186](https://github.com/kiva/ui/commit/59d3186f160368afc464d5a7826d676f1cfaad4c))
* state param not generated before authorize call MP-479 ([88d0eff](https://github.com/kiva/ui/commit/88d0eff94a828bb9696eb708ed1c33ea2f528376))
* tw class ([657250f](https://github.com/kiva/ui/commit/657250f2b8c753b4d767f04993d71ab772476539))
* update component library ([bb5513b](https://github.com/kiva/ui/commit/bb5513bc0eb0faaa07737e336c1a86c70e2bc4de))
* update selected comms value check ([8517ecd](https://github.com/kiva/ui/commit/8517ecdaa0f5b4824c97c52ff8ea6eab8bc0755f))


### 🪚 Refactors

* remove unused code ([fc166d0](https://github.com/kiva/ui/commit/fc166d038a8b452f495fa6e20cbb3b624db30156))
* remove unused code ([5067f12](https://github.com/kiva/ui/commit/5067f12d2af4e760e1c487704df8c94ccd9e5f2c))
* revert changes from WwwPage component ([88ee076](https://github.com/kiva/ui/commit/88ee0768537df040b0881d446cf6421f159ecf15))
* sections to improve transition ([98af79f](https://github.com/kiva/ui/commit/98af79f32b8670a92e3afe1b4eab9d8b26436a69))
* variable names ([800c207](https://github.com/kiva/ui/commit/800c207bfcf27800ff415d65cdbf066c4e4582d5))


### 🧹 Chores

* **release:** 2.751.0-rc.1 [skip ci] ([817e0c9](https://github.com/kiva/ui/commit/817e0c9da3d53f40132de454705dad9c046caa0a)), closes [#5444](https://github.com/kiva/ui/issues/5444) [#5458](https://github.com/kiva/ui/issues/5458) [#5455](https://github.com/kiva/ui/issues/5455) [#5459](https://github.com/kiva/ui/issues/5459) [#5451](https://github.com/kiva/ui/issues/5451) [#5438](https://github.com/kiva/ui/issues/5438) [#5445](https://github.com/kiva/ui/issues/5445) [#5447](https://github.com/kiva/ui/issues/5447)

## [2.751.0-rc.1](https://github.com/kiva/ui/compare/v2.750.0...v2.751.0-rc.1) (2024-08-27)


### 🎉 New Features

* 404 page added ([#5444](https://github.com/kiva/ui/issues/5444)) ([c477382](https://github.com/kiva/ui/commit/c47738239b58f143aa5e770f58ae2e8954105f40))
* charts replaced with shared ones from kv components ([#5458](https://github.com/kiva/ui/issues/5458)) ([251c64b](https://github.com/kiva/ui/commit/251c64b6b6921c31074396f725e968f7a8e6972e))
* create an intermediate screen after badge is revealed to enhance transition between screens ([8d69893](https://github.com/kiva/ui/commit/8d69893c20196c0bba056b986716104c422ad32d))
* handle unknown lender on profile page ([#5455](https://github.com/kiva/ui/issues/5455)) ([a4c1986](https://github.com/kiva/ui/commit/a4c1986d67f6a4ca77f7c78a831fa8551990642d))
* integrate kv-carousel for badges ([5dada33](https://github.com/kiva/ui/commit/5dada334a0178534366c9035e17f0bb092a5587c))
* lender profile headings updated ([#5459](https://github.com/kiva/ui/issues/5459)) ([d25806d](https://github.com/kiva/ui/commit/d25806dbddc22f5fadc6d81380355e3a2ead7f7e))
* loading states adding to lender profile sections ([#5451](https://github.com/kiva/ui/issues/5451)) ([c17e0fd](https://github.com/kiva/ui/commit/c17e0fd2f89bb5d73f847ab2e23cc1a6de93644d))
* loans map added to lender profile ([#5438](https://github.com/kiva/ui/issues/5438)) ([55ba677](https://github.com/kiva/ui/commit/55ba677cf82de55adda65587aa5ebb40d5f4398e))
* meta data updated in lender profile ([#5445](https://github.com/kiva/ui/issues/5445)) ([f0a1d70](https://github.com/kiva/ui/commit/f0a1d70352ff7ac565389e3b824fae0efc145c32))
* pie chart mobile view fixed ([#5447](https://github.com/kiva/ui/issues/5447)) ([e230642](https://github.com/kiva/ui/commit/e23064296159b1da64d3e8a5a74b72fba934d168))
* reorganize structure and create discover component view ([b308c78](https://github.com/kiva/ui/commit/b308c78700c606fdd41263f6050c3cf572a9b88b))
* set badge fullscreen on click and fade in elements ([c8ed11c](https://github.com/kiva/ui/commit/c8ed11c31447079ce64074e22032f5f0bc6b1c0a))
* set new deposit incentive end date MP-692 ([83bba41](https://github.com/kiva/ui/commit/83bba41a9d276edea74b8f90fc11b0a9a0ad1c10))
* smooth badge unblur ([ed9af43](https://github.com/kiva/ui/commit/ed9af433a1a83cdc709dca647d774ec0621f1cc1))


### 🐛 Bugfixes

* 3 cols for desktop ([4a6b1aa](https://github.com/kiva/ui/commit/4a6b1aafa3b42996fa3e906f31aed889bdd69a45))
* change refugee badge name to plural ([8e10d76](https://github.com/kiva/ui/commit/8e10d76ef2b6255c41156f275f1be1b2cc60d618))
* extract async checkout error object with primary format ([2746096](https://github.com/kiva/ui/commit/27460969f0ad836266e8869b8ffeba90a148cff4))
* fix optional chaining for fallback error states ([8c586ff](https://github.com/kiva/ui/commit/8c586ff78b8be2b16eb9557a0c2169a8e3ed2d21))
* grow new bg to fullscreen except for header and footer ([59f941a](https://github.com/kiva/ui/commit/59f941a29b95d6ed53367e636220a444b409e5ba))
* hide name using badge id ([11e992d](https://github.com/kiva/ui/commit/11e992de8ca41b18b54217e7bfcb12ef493581c7))
* lint ([d637937](https://github.com/kiva/ui/commit/d63793718eac79af35b8bcd47b6179dcd237318a))
* lint ([49bb940](https://github.com/kiva/ui/commit/49bb940b725c61032d82c7881257cdc575dc1f69))
* lint ([2f5852a](https://github.com/kiva/ui/commit/2f5852ae94612ebe900645cead47316e4fe5f33d))
* lint ([67e819e](https://github.com/kiva/ui/commit/67e819e98d5693a9c4653a3dbc19791463404cf3))
* mfa api token auth requires using authorize call, not checkSession MP-479 ([56f4fc5](https://github.com/kiva/ui/commit/56f4fc53aac82baef73a96f0e03d6d3427bd3356))
* missing region in ty page query ([b778aab](https://github.com/kiva/ui/commit/b778aab59a3c801ee6a1337a5b4465bb770a4317))
* missing track property ([f357a9b](https://github.com/kiva/ui/commit/f357a9bfd5c9242a05ca4644c7d325dba62024c4))
* remove checkout sticky code ([a40e081](https://github.com/kiva/ui/commit/a40e08131e480dd6e11b360e93553285f1b62960))
* remove unused args in story ([b8810f9](https://github.com/kiva/ui/commit/b8810f913f4e4e24f63e27ebccb315042ff1fb9e))
* state is in hash and show error page for error conditions MP-479 ([59d3186](https://github.com/kiva/ui/commit/59d3186f160368afc464d5a7826d676f1cfaad4c))
* state param not generated before authorize call MP-479 ([88d0eff](https://github.com/kiva/ui/commit/88d0eff94a828bb9696eb708ed1c33ea2f528376))
* tw class ([657250f](https://github.com/kiva/ui/commit/657250f2b8c753b4d767f04993d71ab772476539))
* update component library ([bb5513b](https://github.com/kiva/ui/commit/bb5513bc0eb0faaa07737e336c1a86c70e2bc4de))
* update selected comms value check ([8517ecd](https://github.com/kiva/ui/commit/8517ecdaa0f5b4824c97c52ff8ea6eab8bc0755f))


### 🪚 Refactors

* remove unused code ([fc166d0](https://github.com/kiva/ui/commit/fc166d038a8b452f495fa6e20cbb3b624db30156))
* remove unused code ([5067f12](https://github.com/kiva/ui/commit/5067f12d2af4e760e1c487704df8c94ccd9e5f2c))
* revert changes from WwwPage component ([88ee076](https://github.com/kiva/ui/commit/88ee0768537df040b0881d446cf6421f159ecf15))
* sections to improve transition ([98af79f](https://github.com/kiva/ui/commit/98af79f32b8670a92e3afe1b4eab9d8b26436a69))
* variable names ([800c207](https://github.com/kiva/ui/commit/800c207bfcf27800ff415d65cdbf066c4e4582d5))

## [2.750.0](https://github.com/kiva/ui/compare/v2.749.1...v2.750.0) (2024-08-16)


### 🎉 New Features

* set new deposit incentive end date MP-692 ([2305a4f](https://github.com/kiva/ui/commit/2305a4f0fc40b8e3bf5f7c192a133e5872aed9a5))


### 🧹 Chores

* **release:** 2.750.0-rc.1 [skip ci] ([ec93e5a](https://github.com/kiva/ui/commit/ec93e5a4d794c81bbf0c452d515177f699c38984))

## [2.750.0-rc.1](https://github.com/kiva/ui/compare/v2.749.1...v2.750.0-rc.1) (2024-08-16)


### 🎉 New Features

* set new deposit incentive end date MP-692 ([2305a4f](https://github.com/kiva/ui/commit/2305a4f0fc40b8e3bf5f7c192a133e5872aed9a5))

## [2.749.1](https://github.com/kiva/ui/compare/v2.749.0...v2.749.1) (2024-08-13)


### 🐛 Bugfixes

* revert recent activity score while backend is fixed MP-674 ([b8ed5e6](https://github.com/kiva/ui/commit/b8ed5e6557064e0528f14b0400f06aa5dc2e95dd))


### 🧹 Chores

* **release:** 2.749.1-rc.1 [skip ci] ([69091d0](https://github.com/kiva/ui/commit/69091d07343141b7f0a6ba37ca30a5dab59f9e92))

## [2.749.1-rc.1](https://github.com/kiva/ui/compare/v2.749.0...v2.749.1-rc.1) (2024-08-13)


### 🐛 Bugfixes

* revert recent activity score while backend is fixed MP-674 ([b8ed5e6](https://github.com/kiva/ui/commit/b8ed5e6557064e0528f14b0400f06aa5dc2e95dd))

## [2.749.0](https://github.com/kiva/ui/compare/v2.748.0...v2.749.0) (2024-08-12)


### 🎉 New Features

* badge wiggle animation ([81642a3](https://github.com/kiva/ui/commit/81642a35eff9519452f3353924fa758f2efb6c0c))
* badges section for lender page ([0fa4979](https://github.com/kiva/ui/commit/0fa49796409273d201cebcc7748c3966092b561e))
* create badge customization page ([8ded7e0](https://github.com/kiva/ui/commit/8ded7e0de0624454135fde2028afc38c354790fd))
* lender dedications list added to lender profile ([#5422](https://github.com/kiva/ui/issues/5422)) ([92da400](https://github.com/kiva/ui/commit/92da400463e6111ad7bb1ac0a349c8b100a3ba61))
* lender invitees added to lender profile ([#5423](https://github.com/kiva/ui/issues/5423)) ([0d5bf7b](https://github.com/kiva/ui/commit/0d5bf7ba307a528a7c94956dc3a24869867d104e))
* lender profile tweaks ([#5425](https://github.com/kiva/ui/issues/5425)) ([ea2e103](https://github.com/kiva/ui/commit/ea2e1033ed78863cfeec6b88aec20581f6abf808))
* message lightbox added to lender profile ([#5427](https://github.com/kiva/ui/issues/5427)) ([cf3c05b](https://github.com/kiva/ui/commit/cf3c05b03e55b080ef8910c41580f61a4d97ab80))
* teams page sort option updated ([#5439](https://github.com/kiva/ui/issues/5439)) ([38823c0](https://github.com/kiva/ui/commit/38823c00617d9d2ea21e175c28d177aa081e166a))
* teams page sort updated ([#5421](https://github.com/kiva/ui/issues/5421)) ([e63921b](https://github.com/kiva/ui/commit/e63921bd2f4c8a353411c588b3c76e998052fe13))


### 🐛 Bugfixes

* conflicts and comments ([3cb598a](https://github.com/kiva/ui/commit/3cb598a86226bf70cf47fde2bc20c7ff143a3cb4))
* fallback to UNKNOWN_ERROR_CODE and stringified response for unparsabled errors ([7fc0686](https://github.com/kiva/ui/commit/7fc0686c661b78afd53e4014fea5d127e63a556b))
* lint ([a22085d](https://github.com/kiva/ui/commit/a22085dfb4bec4fcd98b4499422fa4bc580743d5))
* lint and tracking ticket number ([f850590](https://github.com/kiva/ui/commit/f850590243a926a0d9bb8cb573214c4185a829ce))
* missing default badge ([b21c71b](https://github.com/kiva/ui/commit/b21c71b09872c3997e2314041ed1be8d2db87c75))
* redirect to /checkout/thanks if optedIn is set ([d0380c8](https://github.com/kiva/ui/commit/d0380c833f76128814984880d6bcbfd989474bbc))
* remove exp comment ([ebebeab](https://github.com/kiva/ui/commit/ebebeab613e05aabf186a5e63bce6867997f81c1))
* show default badge ([9d83c2c](https://github.com/kiva/ui/commit/9d83c2c889d4c2ddd806844c057ce7f815d358c6))
* title and order of the component ([da2bcb9](https://github.com/kiva/ui/commit/da2bcb96b4bb14febded0a7f17af0c7831237c6c))


### 🧹 Chores

* **release:** 2.749.0-rc.1 [skip ci] ([ce15cdf](https://github.com/kiva/ui/commit/ce15cdf1b998ce9a9d460a3c6bff471b0ae69b88)), closes [#5422](https://github.com/kiva/ui/issues/5422) [#5423](https://github.com/kiva/ui/issues/5423) [#5425](https://github.com/kiva/ui/issues/5425) [#5427](https://github.com/kiva/ui/issues/5427) [#5421](https://github.com/kiva/ui/issues/5421)
* **release:** 2.749.0-rc.2 [skip ci] ([845136d](https://github.com/kiva/ui/commit/845136ddbb3fc93bb60613f354f15bb6d9e3d774)), closes [#5439](https://github.com/kiva/ui/issues/5439)
* revert prior test class additions, update kv-components with new global loan-card class ([82f5d2c](https://github.com/kiva/ui/commit/82f5d2c82f393a6fb717ac46e864ef30232ae0db))

## [2.749.0-rc.2](https://github.com/kiva/ui/compare/v2.749.0-rc.1...v2.749.0-rc.2) (2024-08-12)


### 🎉 New Features

* teams page sort option updated ([#5439](https://github.com/kiva/ui/issues/5439)) ([38823c0](https://github.com/kiva/ui/commit/38823c00617d9d2ea21e175c28d177aa081e166a))

## [2.749.0-rc.1](https://github.com/kiva/ui/compare/v2.748.0...v2.749.0-rc.1) (2024-08-08)


### 🎉 New Features

* badge wiggle animation ([81642a3](https://github.com/kiva/ui/commit/81642a35eff9519452f3353924fa758f2efb6c0c))
* badges section for lender page ([0fa4979](https://github.com/kiva/ui/commit/0fa49796409273d201cebcc7748c3966092b561e))
* create badge customization page ([8ded7e0](https://github.com/kiva/ui/commit/8ded7e0de0624454135fde2028afc38c354790fd))
* lender dedications list added to lender profile ([#5422](https://github.com/kiva/ui/issues/5422)) ([92da400](https://github.com/kiva/ui/commit/92da400463e6111ad7bb1ac0a349c8b100a3ba61))
* lender invitees added to lender profile ([#5423](https://github.com/kiva/ui/issues/5423)) ([0d5bf7b](https://github.com/kiva/ui/commit/0d5bf7ba307a528a7c94956dc3a24869867d104e))
* lender profile tweaks ([#5425](https://github.com/kiva/ui/issues/5425)) ([ea2e103](https://github.com/kiva/ui/commit/ea2e1033ed78863cfeec6b88aec20581f6abf808))
* message lightbox added to lender profile ([#5427](https://github.com/kiva/ui/issues/5427)) ([cf3c05b](https://github.com/kiva/ui/commit/cf3c05b03e55b080ef8910c41580f61a4d97ab80))
* teams page sort updated ([#5421](https://github.com/kiva/ui/issues/5421)) ([e63921b](https://github.com/kiva/ui/commit/e63921bd2f4c8a353411c588b3c76e998052fe13))


### 🐛 Bugfixes

* conflicts and comments ([3cb598a](https://github.com/kiva/ui/commit/3cb598a86226bf70cf47fde2bc20c7ff143a3cb4))
* fallback to UNKNOWN_ERROR_CODE and stringified response for unparsabled errors ([7fc0686](https://github.com/kiva/ui/commit/7fc0686c661b78afd53e4014fea5d127e63a556b))
* lint ([a22085d](https://github.com/kiva/ui/commit/a22085dfb4bec4fcd98b4499422fa4bc580743d5))
* lint and tracking ticket number ([f850590](https://github.com/kiva/ui/commit/f850590243a926a0d9bb8cb573214c4185a829ce))
* missing default badge ([b21c71b](https://github.com/kiva/ui/commit/b21c71b09872c3997e2314041ed1be8d2db87c75))
* redirect to /checkout/thanks if optedIn is set ([d0380c8](https://github.com/kiva/ui/commit/d0380c833f76128814984880d6bcbfd989474bbc))
* remove exp comment ([ebebeab](https://github.com/kiva/ui/commit/ebebeab613e05aabf186a5e63bce6867997f81c1))
* show default badge ([9d83c2c](https://github.com/kiva/ui/commit/9d83c2c889d4c2ddd806844c057ce7f815d358c6))
* title and order of the component ([da2bcb9](https://github.com/kiva/ui/commit/da2bcb96b4bb14febded0a7f17af0c7831237c6c))


### 🧹 Chores

* revert prior test class additions, update kv-components with new global loan-card class ([82f5d2c](https://github.com/kiva/ui/commit/82f5d2c82f393a6fb717ac46e864ef30232ae0db))

## [2.748.0](https://github.com/kiva/ui/compare/v2.747.1...v2.748.0) (2024-07-29)


### 🎉 New Features

* add experiment to lend/filter page ([aab69c8](https://github.com/kiva/ui/commit/aab69c8bae7350caf72d1c9434cd69b6df0e128f))
* adding addToBasket exp to lend-by-category page ([cb19ac3](https://github.com/kiva/ui/commit/cb19ac3b2a37288032ef9b592cf103dda92284c0))
* dedications added to lender loans list ([#5413](https://github.com/kiva/ui/issues/5413)) ([816289f](https://github.com/kiva/ui/commit/816289f2b31e2ad7d85d1d79538c2491f26d9252))
* get deposit incentive banner campaign ID from settings manager ([0de7ae1](https://github.com/kiva/ui/commit/0de7ae14209e083370451c81fce4222ea7095b34))
* get updated loan card from kv-components ([7e94654](https://github.com/kiva/ui/commit/7e9465473bfe00fd1ce24a8a5dc155f9890d621a))
* hide cart modal after second loan ([0263a4f](https://github.com/kiva/ui/commit/0263a4fe232322978e0103922b41ad7cc51959f1))
* lender profile kiva card cta ([#5408](https://github.com/kiva/ui/issues/5408)) ([a092d69](https://github.com/kiva/ui/commit/a092d6954a536c614fc7538a5a3051e362507122))
* lender profile loan list added ([#5409](https://github.com/kiva/ui/issues/5409)) ([916c348](https://github.com/kiva/ui/commit/916c348c0190757a68c55bfbdbf2d7f31ac3cc9b))
* lender profile summary component added ([#5405](https://github.com/kiva/ui/issues/5405)) ([c77c2f8](https://github.com/kiva/ui/commit/c77c2f8ff33c9771c245b2a633497a88731f365b))
* million goal added to appeal banner component ([#5420](https://github.com/kiva/ui/issues/5420)) ([ee822b1](https://github.com/kiva/ui/commit/ee822b1e5f8459a8dfefa068c11ea5dc77751bc7))
* mobile new add to basket experiment bubble and header change ([5007707](https://github.com/kiva/ui/commit/5007707ccdbcf2e13d54c9a83b3b02b8dfcc4540))
* move lender bubble to the basket ([abc3992](https://github.com/kiva/ui/commit/abc3992e24fe1dd8639e7539a49f9c5baaebc1e1))
* new lender profile page added ([#5403](https://github.com/kiva/ui/issues/5403)) ([65ad2d5](https://github.com/kiva/ui/commit/65ad2d5586358318bd82013690b2e07bc5d1efb6))
* remove clickable tags exp ([eb60056](https://github.com/kiva/ui/commit/eb60056a0fd125056930c60b48dd7be8efaa388f))
* show modal after bubble animation and tracking events ([62e5a5e](https://github.com/kiva/ui/commit/62e5a5eed5a4f5de4c8fa204dfa114703dbe14bd))
* stats in lender profile ([453ae73](https://github.com/kiva/ui/commit/453ae73b6ed93f88b35f73ee78502a02be2fde04))
* teams section added to lender profile page ([#5410](https://github.com/kiva/ui/issues/5410)) ([56711c7](https://github.com/kiva/ui/commit/56711c7aedcec04d0b3573181e14d36d6350f4b2))
* update kv-components ([8a6fa77](https://github.com/kiva/ui/commit/8a6fa77d6f2235ebb601bc3a0ee449e01d3e0ce6))
* use different qr code that's vue 2 compatible ([2372ada](https://github.com/kiva/ui/commit/2372adad9ed482f29a8ded95955f0861ea86f4fd))


### 🐛 Bugfixes

* bubble hiding behind loan image ([9108398](https://github.com/kiva/ui/commit/910839837998acc66679759544f73ddb8467c08a))
* cart modal in tablet and margin on lend filter when header is sticky ([9dce178](https://github.com/kiva/ui/commit/9dce17804943495097b1be10d97ba8594362efc0))
* change from running npm install locally ([e5d4703](https://github.com/kiva/ui/commit/e5d470315acb158db5cfbf15e8dad0022f62f2e7))
* cleanup QR code location ([6def469](https://github.com/kiva/ui/commit/6def469eaedff1b17b4e049d73668bc8675be60c))
* conflicts ([f6b9871](https://github.com/kiva/ui/commit/f6b9871eba6dfa6c0e25a6ec787f85a00a04cba1))
* handle errors ([7b7db37](https://github.com/kiva/ui/commit/7b7db375a1ea5e6e0d5052bc4e32b961b64b63b5))
* lender profile components fix ([#5418](https://github.com/kiva/ui/issues/5418)) ([05198b7](https://github.com/kiva/ui/commit/05198b7473844a0a6ce97ffc0d0b8cb951f814af))
* lint ([421f4e7](https://github.com/kiva/ui/commit/421f4e75aec2fe2c89954023d6402667e6e7358c))
* lint ([b72139d](https://github.com/kiva/ui/commit/b72139dfa7d619dca1f38608cc399c2da14580cb))
* load margin problem in lend by category page and remove saving exp variant ([6bfb101](https://github.com/kiva/ui/commit/6bfb1014a00cf69963bcbbd0832e0996c8c1f61a))
* make header sticky in add to basket exp ([4c4c1f5](https://github.com/kiva/ui/commit/4c4c1f5e2130573a1e823d19508bad90b5d93a63))
* missing props and emits for components and design tweaks ([20bf789](https://github.com/kiva/ui/commit/20bf7894f0183f36989e9f0e3fdaa643330fe497))
* package version ([45ce53b](https://github.com/kiva/ui/commit/45ce53bcc59ceb7f4f77eb500d74a73dc6960d57))
* partner list in autolending settings now show all active partners ([a4886ff](https://github.com/kiva/ui/commit/a4886ff783dc506af771927dcc8773cfeced56d2))
* remove comment ([73d48c4](https://github.com/kiva/ui/commit/73d48c4cdf0a14cb185eff21f99c8d13d08b7635))
* remove full height ([3ec20ec](https://github.com/kiva/ui/commit/3ec20ecb4e0b9eb328e2cdfef0f98c87ff50bf9b))
* remove tw-h-auto ([999f079](https://github.com/kiva/ui/commit/999f079eb114a89a2a56ba2998b15bd439ce2626))
* removed unused qrcode package ([8628880](https://github.com/kiva/ui/commit/86288803e903c59f400a2aa51f6b8b6a4672dbed))
* revert file ([cfd3a46](https://github.com/kiva/ui/commit/cfd3a46abf9286a093106998678aa47f33bbac5c))
* run experiment in lend-by-category and lend/filter pages ([6f4ee00](https://github.com/kiva/ui/commit/6f4ee006894f9987fa6536ee3052008efb4324bb))
* set cart modal position to be bellow header ([a9d1e17](https://github.com/kiva/ui/commit/a9d1e174ac96e15d4703b203498df08316d7f25d))
* set value of exp for sticky header ([19a354c](https://github.com/kiva/ui/commit/19a354c2d53d6e137c930144d1edf794af55d7aa))
* solve conflicts ([27cdb2c](https://github.com/kiva/ui/commit/27cdb2ca04cfc9ed307e46ca806eb97f25157ade))
* sudden jump when loan is added to the basket ([85d211b](https://github.com/kiva/ui/commit/85d211b461e0d35b7d81611512addc38b45b869c))
* update deposit incentive experiment ([8485caa](https://github.com/kiva/ui/commit/8485caadc8dca25f1e71f67e4bb080ca55fd0765))
* update deposit incentive experiment ([18c2fbf](https://github.com/kiva/ui/commit/18c2fbffdc5f21dd51e8420cafa433d9b011cbc5))
* updated comments ([c363ce0](https://github.com/kiva/ui/commit/c363ce0a4cc09bf1b38b873898de341b11f664de))


### 🪚 Refactors

* move exp tracking to header ([a067e1c](https://github.com/kiva/ui/commit/a067e1c9275b01437166dbebc79a9d1108d0b6c7))


### 🧹 Chores

* **release:** 2.747.2-rc.1 [skip ci] ([e107682](https://github.com/kiva/ui/commit/e1076823eb523befaab55521c8aedc689a0604b5))
* **release:** 2.748.0-rc.1 [skip ci] ([8cb37d3](https://github.com/kiva/ui/commit/8cb37d3aedf05fdb7e57abdabac2b60bfe84b9f0)), closes [#5413](https://github.com/kiva/ui/issues/5413) [#5408](https://github.com/kiva/ui/issues/5408) [#5409](https://github.com/kiva/ui/issues/5409) [#5405](https://github.com/kiva/ui/issues/5405) [#5420](https://github.com/kiva/ui/issues/5420) [#5403](https://github.com/kiva/ui/issues/5403) [#5410](https://github.com/kiva/ui/issues/5410) [#5418](https://github.com/kiva/ui/issues/5418) [#5403](https://github.com/kiva/ui/issues/5403)
* **release:** 2.748.0-rc.1 [skip ci] ([4354d3f](https://github.com/kiva/ui/commit/4354d3f0dc2c0a8b70df8db97bdead3b9c4f29a1)), closes [#5403](https://github.com/kiva/ui/issues/5403)
* remove ddTrace converting that tracer implementation to a pass through for now ([a3c5dfa](https://github.com/kiva/ui/commit/a3c5dfa12e323e637595ce17f5f2cae7881cbc8b))

## [2.748.0-rc.1](https://github.com/kiva/ui/compare/v2.747.1...v2.748.0-rc.1) (2024-07-29)


### 🎉 New Features

* add experiment to lend/filter page ([aab69c8](https://github.com/kiva/ui/commit/aab69c8bae7350caf72d1c9434cd69b6df0e128f))
* adding addToBasket exp to lend-by-category page ([cb19ac3](https://github.com/kiva/ui/commit/cb19ac3b2a37288032ef9b592cf103dda92284c0))
* dedications added to lender loans list ([#5413](https://github.com/kiva/ui/issues/5413)) ([816289f](https://github.com/kiva/ui/commit/816289f2b31e2ad7d85d1d79538c2491f26d9252))
* get deposit incentive banner campaign ID from settings manager ([0de7ae1](https://github.com/kiva/ui/commit/0de7ae14209e083370451c81fce4222ea7095b34))
* get updated loan card from kv-components ([7e94654](https://github.com/kiva/ui/commit/7e9465473bfe00fd1ce24a8a5dc155f9890d621a))
* hide cart modal after second loan ([0263a4f](https://github.com/kiva/ui/commit/0263a4fe232322978e0103922b41ad7cc51959f1))
* lender profile kiva card cta ([#5408](https://github.com/kiva/ui/issues/5408)) ([a092d69](https://github.com/kiva/ui/commit/a092d6954a536c614fc7538a5a3051e362507122))
* lender profile loan list added ([#5409](https://github.com/kiva/ui/issues/5409)) ([916c348](https://github.com/kiva/ui/commit/916c348c0190757a68c55bfbdbf2d7f31ac3cc9b))
* lender profile summary component added ([#5405](https://github.com/kiva/ui/issues/5405)) ([c77c2f8](https://github.com/kiva/ui/commit/c77c2f8ff33c9771c245b2a633497a88731f365b))
* million goal added to appeal banner component ([#5420](https://github.com/kiva/ui/issues/5420)) ([ee822b1](https://github.com/kiva/ui/commit/ee822b1e5f8459a8dfefa068c11ea5dc77751bc7))
* mobile new add to basket experiment bubble and header change ([5007707](https://github.com/kiva/ui/commit/5007707ccdbcf2e13d54c9a83b3b02b8dfcc4540))
* move lender bubble to the basket ([abc3992](https://github.com/kiva/ui/commit/abc3992e24fe1dd8639e7539a49f9c5baaebc1e1))
* new lender profile page added ([#5403](https://github.com/kiva/ui/issues/5403)) ([65ad2d5](https://github.com/kiva/ui/commit/65ad2d5586358318bd82013690b2e07bc5d1efb6))
* remove clickable tags exp ([eb60056](https://github.com/kiva/ui/commit/eb60056a0fd125056930c60b48dd7be8efaa388f))
* show modal after bubble animation and tracking events ([62e5a5e](https://github.com/kiva/ui/commit/62e5a5eed5a4f5de4c8fa204dfa114703dbe14bd))
* stats in lender profile ([453ae73](https://github.com/kiva/ui/commit/453ae73b6ed93f88b35f73ee78502a02be2fde04))
* teams section added to lender profile page ([#5410](https://github.com/kiva/ui/issues/5410)) ([56711c7](https://github.com/kiva/ui/commit/56711c7aedcec04d0b3573181e14d36d6350f4b2))
* update kv-components ([8a6fa77](https://github.com/kiva/ui/commit/8a6fa77d6f2235ebb601bc3a0ee449e01d3e0ce6))
* use different qr code that's vue 2 compatible ([2372ada](https://github.com/kiva/ui/commit/2372adad9ed482f29a8ded95955f0861ea86f4fd))


### 🐛 Bugfixes

* bubble hiding behind loan image ([9108398](https://github.com/kiva/ui/commit/910839837998acc66679759544f73ddb8467c08a))
* cart modal in tablet and margin on lend filter when header is sticky ([9dce178](https://github.com/kiva/ui/commit/9dce17804943495097b1be10d97ba8594362efc0))
* change from running npm install locally ([e5d4703](https://github.com/kiva/ui/commit/e5d470315acb158db5cfbf15e8dad0022f62f2e7))
* cleanup QR code location ([6def469](https://github.com/kiva/ui/commit/6def469eaedff1b17b4e049d73668bc8675be60c))
* conflicts ([f6b9871](https://github.com/kiva/ui/commit/f6b9871eba6dfa6c0e25a6ec787f85a00a04cba1))
* handle errors ([7b7db37](https://github.com/kiva/ui/commit/7b7db375a1ea5e6e0d5052bc4e32b961b64b63b5))
* lender profile components fix ([#5418](https://github.com/kiva/ui/issues/5418)) ([05198b7](https://github.com/kiva/ui/commit/05198b7473844a0a6ce97ffc0d0b8cb951f814af))
* lint ([421f4e7](https://github.com/kiva/ui/commit/421f4e75aec2fe2c89954023d6402667e6e7358c))
* lint ([b72139d](https://github.com/kiva/ui/commit/b72139dfa7d619dca1f38608cc399c2da14580cb))
* load margin problem in lend by category page and remove saving exp variant ([6bfb101](https://github.com/kiva/ui/commit/6bfb1014a00cf69963bcbbd0832e0996c8c1f61a))
* make header sticky in add to basket exp ([4c4c1f5](https://github.com/kiva/ui/commit/4c4c1f5e2130573a1e823d19508bad90b5d93a63))
* missing props and emits for components and design tweaks ([20bf789](https://github.com/kiva/ui/commit/20bf7894f0183f36989e9f0e3fdaa643330fe497))
* package version ([45ce53b](https://github.com/kiva/ui/commit/45ce53bcc59ceb7f4f77eb500d74a73dc6960d57))
* partner list in autolending settings now show all active partners ([a4886ff](https://github.com/kiva/ui/commit/a4886ff783dc506af771927dcc8773cfeced56d2))
* remove comment ([73d48c4](https://github.com/kiva/ui/commit/73d48c4cdf0a14cb185eff21f99c8d13d08b7635))
* remove full height ([3ec20ec](https://github.com/kiva/ui/commit/3ec20ecb4e0b9eb328e2cdfef0f98c87ff50bf9b))
* remove tw-h-auto ([999f079](https://github.com/kiva/ui/commit/999f079eb114a89a2a56ba2998b15bd439ce2626))
* removed unused qrcode package ([8628880](https://github.com/kiva/ui/commit/86288803e903c59f400a2aa51f6b8b6a4672dbed))
* revert file ([cfd3a46](https://github.com/kiva/ui/commit/cfd3a46abf9286a093106998678aa47f33bbac5c))
* run experiment in lend-by-category and lend/filter pages ([6f4ee00](https://github.com/kiva/ui/commit/6f4ee006894f9987fa6536ee3052008efb4324bb))
* set cart modal position to be bellow header ([a9d1e17](https://github.com/kiva/ui/commit/a9d1e174ac96e15d4703b203498df08316d7f25d))
* set value of exp for sticky header ([19a354c](https://github.com/kiva/ui/commit/19a354c2d53d6e137c930144d1edf794af55d7aa))
* solve conflicts ([27cdb2c](https://github.com/kiva/ui/commit/27cdb2ca04cfc9ed307e46ca806eb97f25157ade))
* sudden jump when loan is added to the basket ([85d211b](https://github.com/kiva/ui/commit/85d211b461e0d35b7d81611512addc38b45b869c))
* update deposit incentive experiment ([8485caa](https://github.com/kiva/ui/commit/8485caadc8dca25f1e71f67e4bb080ca55fd0765))
* update deposit incentive experiment ([18c2fbf](https://github.com/kiva/ui/commit/18c2fbffdc5f21dd51e8420cafa433d9b011cbc5))
* updated comments ([c363ce0](https://github.com/kiva/ui/commit/c363ce0a4cc09bf1b38b873898de341b11f664de))


### 🪚 Refactors

* move exp tracking to header ([a067e1c](https://github.com/kiva/ui/commit/a067e1c9275b01437166dbebc79a9d1108d0b6c7))


### 🧹 Chores

* **release:** 2.747.2-rc.1 [skip ci] ([e107682](https://github.com/kiva/ui/commit/e1076823eb523befaab55521c8aedc689a0604b5))
* **release:** 2.748.0-rc.1 [skip ci] ([4354d3f](https://github.com/kiva/ui/commit/4354d3f0dc2c0a8b70df8db97bdead3b9c4f29a1)), closes [#5403](https://github.com/kiva/ui/issues/5403)
* remove ddTrace converting that tracer implementation to a pass through for now ([a3c5dfa](https://github.com/kiva/ui/commit/a3c5dfa12e323e637595ce17f5f2cae7881cbc8b))

## [2.747.1](https://github.com/kiva/ui/compare/v2.747.0...v2.747.1) (2024-07-16)


### 🐛 Bugfixes

* minor change to re-trigger actions with permissions ([6ad5cdd](https://github.com/kiva/ui/commit/6ad5cdd0b738a94e026a068023e92eb470efdede))
* minor change to restart actions with correct permissions ([1ca5ec6](https://github.com/kiva/ui/commit/1ca5ec6673dcf3ab4b151d6ae5db1785d518ee92))


### 🧹 Chores

* **deps-dev:** bump @babel/plugin-transform-modules-commonjs ([bbbb722](https://github.com/kiva/ui/commit/bbbb7227f38439834761247a0448516fa8471d76))
* **deps-dev:** bump @testing-library/vue from 5.8.2 to 5.9.0 ([597875b](https://github.com/kiva/ui/commit/597875bd9c6daae109a350b865ceb0975943c3aa))
* **deps-dev:** bump autoprefixer from 10.4.2 to 10.4.19 ([6454733](https://github.com/kiva/ui/commit/645473300e7e7b3883cc5461bb5e925d82c5f5ce))
* **deps-dev:** bump semver from 7.6.0 to 7.6.2 ([701e412](https://github.com/kiva/ui/commit/701e412ee7aa7b415b840c357d1533fe98e1c541))
* **deps-dev:** bump stylelint-config-standard from 20.0.0 to 21.0.0 ([4034aeb](https://github.com/kiva/ui/commit/4034aebe274c71cad94c6894827a31c438870834))
* **deps:** bump gsap from 3.6.0 to 3.12.5 ([dbeceaf](https://github.com/kiva/ui/commit/dbeceaf6f8e3fe8a7a52434c0d0e13c286425c54))
* **deps:** bump undici and @graphql-tools/url-loader ([3d5d3ad](https://github.com/kiva/ui/commit/3d5d3ad3edca12414cb8130174c15bf9257ec286))
* **release:** 2.747.1-rc.1 [skip ci] ([d24e8b0](https://github.com/kiva/ui/commit/d24e8b095e797618ada3609ffd9e6e4d008706a0))

## [2.747.1-rc.1](https://github.com/kiva/ui/compare/v2.747.0...v2.747.1-rc.1) (2024-07-15)


### 🐛 Bugfixes

* minor change to re-trigger actions with permissions ([6ad5cdd](https://github.com/kiva/ui/commit/6ad5cdd0b738a94e026a068023e92eb470efdede))
* minor change to restart actions with correct permissions ([1ca5ec6](https://github.com/kiva/ui/commit/1ca5ec6673dcf3ab4b151d6ae5db1785d518ee92))


### 🧹 Chores

* **deps-dev:** bump @babel/plugin-transform-modules-commonjs ([bbbb722](https://github.com/kiva/ui/commit/bbbb7227f38439834761247a0448516fa8471d76))
* **deps-dev:** bump @testing-library/vue from 5.8.2 to 5.9.0 ([597875b](https://github.com/kiva/ui/commit/597875bd9c6daae109a350b865ceb0975943c3aa))
* **deps-dev:** bump autoprefixer from 10.4.2 to 10.4.19 ([6454733](https://github.com/kiva/ui/commit/645473300e7e7b3883cc5461bb5e925d82c5f5ce))
* **deps-dev:** bump semver from 7.6.0 to 7.6.2 ([701e412](https://github.com/kiva/ui/commit/701e412ee7aa7b415b840c357d1533fe98e1c541))
* **deps-dev:** bump stylelint-config-standard from 20.0.0 to 21.0.0 ([4034aeb](https://github.com/kiva/ui/commit/4034aebe274c71cad94c6894827a31c438870834))
* **deps:** bump gsap from 3.6.0 to 3.12.5 ([dbeceaf](https://github.com/kiva/ui/commit/dbeceaf6f8e3fe8a7a52434c0d0e13c286425c54))
* **deps:** bump undici and @graphql-tools/url-loader ([3d5d3ad](https://github.com/kiva/ui/commit/3d5d3ad3edca12414cb8130174c15bf9257ec286))

## [2.747.0](https://github.com/kiva/ui/compare/v2.746.0...v2.747.0) (2024-07-11)


### 🎉 New Features

* animated sparkles component updated ([#5370](https://github.com/kiva/ui/issues/5370)) ([946c485](https://github.com/kiva/ui/commit/946c4851a2078ea9b98dfaeb3133a5c63dfe8938))


### 🐛 Bugfixes

* apply updateConfiguration for paypalCredit, update watcher to be immediate ([bef01f3](https://github.com/kiva/ui/commit/bef01f3b3ad694088a1bd52589f64eed206e02cb))
* callback needed for logout ([2fe20b8](https://github.com/kiva/ui/commit/2fe20b8fc0dfe6ce4b43621635f289d6a7bbe0f0))
* convert passwordless checks to use partnerContentId to detect corporate partners ([23c2180](https://github.com/kiva/ui/commit/23c2180ada43a12492c26a97e188124f3347d830))
* delay overlay removal while nested components update ([be52f57](https://github.com/kiva/ui/commit/be52f5777a822996d0f4a8b6b24c097f2d2a7ac7))
* exclude corporate partners using sso from radio button experiment ([c1f6694](https://github.com/kiva/ui/commit/c1f66942aa83824dd4b0be2b2efa81769bd6d880))
* hide sort by quick filter for new loan channels ([eef0e9c](https://github.com/kiva/ui/commit/eef0e9c761c4c0fdcaefa6f0835026600296cee0))
* missing newAcctTerms and newsConsent form values for opt-in-comms exp ([b86b01c](https://github.com/kiva/ui/commit/b86b01c2a94dbb1bdbc851298414bb7d7ec07eb5))
* more special casing for sort in new channels ([8022724](https://github.com/kiva/ui/commit/80227244aa54abef39c69880bcc07ea415ad80a7))
* remove this in template variable ([69eda8f](https://github.com/kiva/ui/commit/69eda8f4cedf4ebb59b73e76a1918f0b65a86ce4))
* simplify setTimeout usage ([6c34ba0](https://github.com/kiva/ui/commit/6c34ba01dd778ad090ced1a1f50cd4bf9e2c23e9))
* update cypress library to resolve peer dependency error ([5469517](https://github.com/kiva/ui/commit/546951770382c3bafd1effc854c9f39cb5765ec3))
* update dev server to work with v4+ of webpack-dev-middleware ([fc2ca76](https://github.com/kiva/ui/commit/fc2ca761bfaef89a1424badeb20fae8524896be9))


### 🏗️ Build System

* **deps-dev:** bump babel-loader from 8.2.2 to 8.3.0 ([03bc34a](https://github.com/kiva/ui/commit/03bc34a3208519dc64f23816f121247ffec10d20))
* **deps:** bump @grpc/grpc-js from 1.9.13 to 1.10.9 ([ba464f5](https://github.com/kiva/ui/commit/ba464f5fe81228e8c9d032483eba5a1a7b8ef161))
* **deps:** bump @kiva/kv-shop from 1.8.1 to 1.12.8 ([68797d8](https://github.com/kiva/ui/commit/68797d8b6cb550658d5d9cefae8a84e60dcb6657))
* **deps:** bump libphonenumber-js from 1.10.7 to 1.11.4 ([32e2277](https://github.com/kiva/ui/commit/32e227725de78ead3e7642c3c79a7bc9fa71ee8f))
* **deps:** bump passport from 0.4.1 to 0.7.0 ([7285313](https://github.com/kiva/ui/commit/72853138090dfa2ce1fd13cf9a69c924e908eebf))
* **deps:** bump pug from 3.0.2 to 3.0.3 ([c0f068d](https://github.com/kiva/ui/commit/c0f068df81eb51c7454ce6efc23a7e41076ad765))
* **deps:** bump vue-router from 3.5.1 to 3.6.5 ([cb7e8c2](https://github.com/kiva/ui/commit/cb7e8c23bb7623919672f14fdd0692c83b03690f))


### 🧹 Chores

* **deps-dev:** bump webpack-dev-middleware from 3.7.3 to 5.3.4 ([171f8f1](https://github.com/kiva/ui/commit/171f8f16dcae4e01084c4ca000849a7329f1888d))
* **deps:** bump @cypress/request and cypress ([5391b1c](https://github.com/kiva/ui/commit/5391b1c16c5c6e6bfd67c9ccd73826f9fc2efc17))
* **deps:** bump express from 4.18.2 to 4.19.2 ([cb668a6](https://github.com/kiva/ui/commit/cb668a648c7d4e1ae5f0e81d81ed3e4423e47a8b))
* **deps:** bump jsonwebtoken from 8.5.1 to 9.0.2 ([805ef48](https://github.com/kiva/ui/commit/805ef4835ca90d3e29512e8ed3a623ae8acc9d6a))
* **deps:** bump serialize-javascript from 5.0.1 to 6.0.2 ([07e5072](https://github.com/kiva/ui/commit/07e5072b44fe1a7b48617ec0db9bb73766df83bf))
* **deps:** bump vue-focus-lock from 1.4.1 to 2.0.6 ([287306d](https://github.com/kiva/ui/commit/287306d9215e9db03b0fa996b1dde47206fb8be0))
* **deps:** bump vue-observe-visibility from 0.4.6 to 1.0.0 ([22dcec4](https://github.com/kiva/ui/commit/22dcec4815d573f2bcaa470d577281df552882a8))
* **release:** 2.747.0-rc.1 [skip ci] ([0845021](https://github.com/kiva/ui/commit/084502151ca76d2311b9f3b9d835b12f54ae68a9)), closes [#5370](https://github.com/kiva/ui/issues/5370)
* **release:** 2.747.0-rc.2 [skip ci] ([8c0e845](https://github.com/kiva/ui/commit/8c0e845c1180c2de22ea0f88d1b0ac896c7aa00a))

## [2.747.0-rc.2](https://github.com/kiva/ui/compare/v2.747.0-rc.1...v2.747.0-rc.2) (2024-07-11)


### 🐛 Bugfixes

* missing newAcctTerms and newsConsent form values for opt-in-comms exp ([b86b01c](https://github.com/kiva/ui/commit/b86b01c2a94dbb1bdbc851298414bb7d7ec07eb5))


### 🏗️ Build System

* **deps:** bump libphonenumber-js from 1.10.7 to 1.11.4 ([32e2277](https://github.com/kiva/ui/commit/32e227725de78ead3e7642c3c79a7bc9fa71ee8f))
* **deps:** bump vue-router from 3.5.1 to 3.6.5 ([cb7e8c2](https://github.com/kiva/ui/commit/cb7e8c23bb7623919672f14fdd0692c83b03690f))

## [2.747.0-rc.1](https://github.com/kiva/ui/compare/v2.746.0...v2.747.0-rc.1) (2024-07-11)


### 🎉 New Features

* animated sparkles component updated ([#5370](https://github.com/kiva/ui/issues/5370)) ([946c485](https://github.com/kiva/ui/commit/946c4851a2078ea9b98dfaeb3133a5c63dfe8938))


### 🐛 Bugfixes

* apply updateConfiguration for paypalCredit, update watcher to be immediate ([bef01f3](https://github.com/kiva/ui/commit/bef01f3b3ad694088a1bd52589f64eed206e02cb))
* callback needed for logout ([2fe20b8](https://github.com/kiva/ui/commit/2fe20b8fc0dfe6ce4b43621635f289d6a7bbe0f0))
* convert passwordless checks to use partnerContentId to detect corporate partners ([23c2180](https://github.com/kiva/ui/commit/23c2180ada43a12492c26a97e188124f3347d830))
* delay overlay removal while nested components update ([be52f57](https://github.com/kiva/ui/commit/be52f5777a822996d0f4a8b6b24c097f2d2a7ac7))
* exclude corporate partners using sso from radio button experiment ([c1f6694](https://github.com/kiva/ui/commit/c1f66942aa83824dd4b0be2b2efa81769bd6d880))
* hide sort by quick filter for new loan channels ([eef0e9c](https://github.com/kiva/ui/commit/eef0e9c761c4c0fdcaefa6f0835026600296cee0))
* more special casing for sort in new channels ([8022724](https://github.com/kiva/ui/commit/80227244aa54abef39c69880bcc07ea415ad80a7))
* remove this in template variable ([69eda8f](https://github.com/kiva/ui/commit/69eda8f4cedf4ebb59b73e76a1918f0b65a86ce4))
* simplify setTimeout usage ([6c34ba0](https://github.com/kiva/ui/commit/6c34ba01dd778ad090ced1a1f50cd4bf9e2c23e9))
* update cypress library to resolve peer dependency error ([5469517](https://github.com/kiva/ui/commit/546951770382c3bafd1effc854c9f39cb5765ec3))
* update dev server to work with v4+ of webpack-dev-middleware ([fc2ca76](https://github.com/kiva/ui/commit/fc2ca761bfaef89a1424badeb20fae8524896be9))


### 🏗️ Build System

* **deps-dev:** bump babel-loader from 8.2.2 to 8.3.0 ([03bc34a](https://github.com/kiva/ui/commit/03bc34a3208519dc64f23816f121247ffec10d20))
* **deps:** bump @grpc/grpc-js from 1.9.13 to 1.10.9 ([ba464f5](https://github.com/kiva/ui/commit/ba464f5fe81228e8c9d032483eba5a1a7b8ef161))
* **deps:** bump @kiva/kv-shop from 1.8.1 to 1.12.8 ([68797d8](https://github.com/kiva/ui/commit/68797d8b6cb550658d5d9cefae8a84e60dcb6657))
* **deps:** bump passport from 0.4.1 to 0.7.0 ([7285313](https://github.com/kiva/ui/commit/72853138090dfa2ce1fd13cf9a69c924e908eebf))
* **deps:** bump pug from 3.0.2 to 3.0.3 ([c0f068d](https://github.com/kiva/ui/commit/c0f068df81eb51c7454ce6efc23a7e41076ad765))


### 🧹 Chores

* **deps-dev:** bump webpack-dev-middleware from 3.7.3 to 5.3.4 ([171f8f1](https://github.com/kiva/ui/commit/171f8f16dcae4e01084c4ca000849a7329f1888d))
* **deps:** bump @cypress/request and cypress ([5391b1c](https://github.com/kiva/ui/commit/5391b1c16c5c6e6bfd67c9ccd73826f9fc2efc17))
* **deps:** bump express from 4.18.2 to 4.19.2 ([cb668a6](https://github.com/kiva/ui/commit/cb668a648c7d4e1ae5f0e81d81ed3e4423e47a8b))
* **deps:** bump jsonwebtoken from 8.5.1 to 9.0.2 ([805ef48](https://github.com/kiva/ui/commit/805ef4835ca90d3e29512e8ed3a623ae8acc9d6a))
* **deps:** bump serialize-javascript from 5.0.1 to 6.0.2 ([07e5072](https://github.com/kiva/ui/commit/07e5072b44fe1a7b48617ec0db9bb73766df83bf))
* **deps:** bump vue-focus-lock from 1.4.1 to 2.0.6 ([287306d](https://github.com/kiva/ui/commit/287306d9215e9db03b0fa996b1dde47206fb8be0))
* **deps:** bump vue-observe-visibility from 0.4.6 to 1.0.0 ([22dcec4](https://github.com/kiva/ui/commit/22dcec4815d573f2bcaa470d577281df552882a8))

## [2.746.0](https://github.com/kiva/ui/compare/v2.745.0...v2.746.0) (2024-07-02)


### 🎉 New Features

* remove double donation feature from donation-only thanks page ([4708b3c](https://github.com/kiva/ui/commit/4708b3cd7435c727f46bce40ea4bf26a773f2942))
* replace BE FLSS key ([991d78f](https://github.com/kiva/ui/commit/991d78f3b06d6593becc0b90c86fb500eab6bd84))
* update footer link to new page ([ea9fd3d](https://github.com/kiva/ui/commit/ea9fd3d97c03017b79d835d1d294d94ab7d56936))


### 🐛 Bugfixes

* ensure the login section isn't shown when a receipt is present ([66592e0](https://github.com/kiva/ui/commit/66592e02d88dc518c4f25df305bc2f71912e1071))


### 🧹 Chores

* **release:** 2.746.0-rc.1 [skip ci] ([523d870](https://github.com/kiva/ui/commit/523d87020b4c652f5eabc3c4bd5b6a7f4252f5fb))

## [2.746.0-rc.1](https://github.com/kiva/ui/compare/v2.745.0...v2.746.0-rc.1) (2024-07-02)


### 🎉 New Features

* remove double donation feature from donation-only thanks page ([4708b3c](https://github.com/kiva/ui/commit/4708b3cd7435c727f46bce40ea4bf26a773f2942))
* replace BE FLSS key ([991d78f](https://github.com/kiva/ui/commit/991d78f3b06d6593becc0b90c86fb500eab6bd84))
* update footer link to new page ([ea9fd3d](https://github.com/kiva/ui/commit/ea9fd3d97c03017b79d835d1d294d94ab7d56936))


### 🐛 Bugfixes

* ensure the login section isn't shown when a receipt is present ([66592e0](https://github.com/kiva/ui/commit/66592e02d88dc518c4f25df305bc2f71912e1071))

## [2.745.0](https://github.com/kiva/ui/compare/v2.744.0...v2.745.0) (2024-07-01)


### 🎉 New Features

* [MP-310] hide incentive banner ([e6ce3f6](https://github.com/kiva/ui/commit/e6ce3f6ceb17efc4e7344d1c86d9892327979a55))
* [MP-310] hide incentive banner ([c50a8fb](https://github.com/kiva/ui/commit/c50a8fb8cf9405074e02c4e7050d14dd30b4d5a3))
* [MP-310] hide incentive banner ([cdf251d](https://github.com/kiva/ui/commit/cdf251d80e1f1286a2d1d6ff1dc568e9ba2e38b7))
* [MP-362] update lending credit link ([99ae8de](https://github.com/kiva/ui/commit/99ae8de960df1f86846a1aa45a7807ad746a5547))
* added experiment setting for checkout sticky exp ([b41101e](https://github.com/kiva/ui/commit/b41101e7ba8f3a3f94548e137f27e38061c66ab3))
* animate sparkles for thanks page ([33afe52](https://github.com/kiva/ui/commit/33afe5251cbf6814bd88399c76faa73966312757))
* bp activity feed hidden for sticky cta ([#5362](https://github.com/kiva/ui/issues/5362)) ([d7618c4](https://github.com/kiva/ui/commit/d7618c4d65521a04a3a827b0986059fc0baf6ff9))
* bp matching component size fixed for tablets ([#5365](https://github.com/kiva/ui/issues/5365)) ([898bdcf](https://github.com/kiva/ui/commit/898bdcffa1b3e09d05cdbe8118651ad72c04298e))
* desktop checkout actions experiment ([3349900](https://github.com/kiva/ui/commit/3349900f50050e68e5cb51cf61fbb635178b7b5b))
* disable sticky checkout and log experiment assignment in desktop ([5802cc9](https://github.com/kiva/ui/commit/5802cc913c6c979f8be938b7e987ca9559d44d04))
* hide non receipt elements for print ([44c6ce7](https://github.com/kiva/ui/commit/44c6ce71563eb98faa1bf3937d21ac262b350405))
* initial mocks ([f52ba35](https://github.com/kiva/ui/commit/f52ba350b9d6e670c324d475f596e0956a826914))
* missing animation and update email opt in choice ([43a434a](https://github.com/kiva/ui/commit/43a434a28ac53bfc56e891b1a9cd0dddfe62f4e7))
* new thanks page for opt-in experiment ([27d64dc](https://github.com/kiva/ui/commit/27d64dc7a466c8ad1baec1c0d41c98515b68a7c9))
* overall checkout button experiment ready ([35e41e9](https://github.com/kiva/ui/commit/35e41e9d9bb39f418a9de972cabbb2b124694cba))
* pie chart design for distribution tables MP-434 ([5a7ea34](https://github.com/kiva/ui/commit/5a7ea34b34e1e1ecf123c910d233d1d8c978a3fe))
* refactor new ty page and different variants depending on number of loans ([e8e87d4](https://github.com/kiva/ui/commit/e8e87d404ae58bf5d684c71957da4b8131b8692c))
* shorter version and exp tracking ([bda7120](https://github.com/kiva/ui/commit/bda7120884bd1cf5c72a93dc525e6093c3f00682))
* thank you page behind feature flag ([37d197a](https://github.com/kiva/ui/commit/37d197af99510f5b6ac652aa67f201769c85b109))
* tracking events and fixes ([899be8f](https://github.com/kiva/ui/commit/899be8f23113e9dccfadfa39ffc176ef7c214e99))


### 🐛 Bugfixes

* add parenthesis to arrow function inline return value ([be88548](https://github.com/kiva/ui/commit/be8854811c180209c20b506cf470b8c215d3e31f))
* always evaluate if user landed on a us loan ([d7676a4](https://github.com/kiva/ui/commit/d7676a498f25a4382e8f93c265d76251857f57a5))
* bottom position fixed ([#5363](https://github.com/kiva/ui/issues/5363)) ([a56900e](https://github.com/kiva/ui/commit/a56900e9527827c79c399b0c534d8f02b2e64e72))
* cache value to ensure scroll works ([791403c](https://github.com/kiva/ui/commit/791403cac67f8e53de8cdd3bef59d28d847aa70e))
* cleanup basket classes application ([a7f5b6e](https://github.com/kiva/ui/commit/a7f5b6e9af379229aa6e6ed8be2bbbc7936f8045))
* copy ([6f599c8](https://github.com/kiva/ui/commit/6f599c87852d12a54d0a6643b1dab7cccbc51d6f))
* copy change ([e6704af](https://github.com/kiva/ui/commit/e6704af693d3068bf99c08a46a560db75b7f4a0d))
* design tweaks ([032d86d](https://github.com/kiva/ui/commit/032d86d7955f3b835c632df98436fb6052fd1650))
* enable new ty page when guest checkout happens ([11c206a](https://github.com/kiva/ui/commit/11c206a90305d69a41cc50317072ad602f4c76e1))
* fire hotjar event if the user sees the check sticky experiment, gray bg for desktop ([641fd26](https://github.com/kiva/ui/commit/641fd263ff60c4c3ae584b14c1a67d920630e121))
* firstLoan condition was false in guest checkout ([9482147](https://github.com/kiva/ui/commit/9482147fec8724877b0d5526644db9963753614b))
* hide new ty page if usa loan ([3405e9d](https://github.com/kiva/ui/commit/3405e9dfc26573b2fb5669f11e5f39aa16de8ea1))
* hide top horizontal rule for mobile ([e9dfcb7](https://github.com/kiva/ui/commit/e9dfcb715b30dd20edd4598c5f6aaec19a15044e))
* initilize experiment above firing hotjar event condition ([ebacf3b](https://github.com/kiva/ui/commit/ebacf3b238038738df892e6930d6fc0eba97b161))
* isDesktop no longer needed with logged-out only version ([251c6ae](https://github.com/kiva/ui/commit/251c6ae3b9e32f3e6d0bfabdfea296a32f252d3f))
* lint ([dbc95e2](https://github.com/kiva/ui/commit/dbc95e2b7d3dffcdeb3c81b4af4f6db1a30efda3))
* lint ([0912049](https://github.com/kiva/ui/commit/0912049bf819a892c6f81f9505af54328af826de))
* lint ([edfa50a](https://github.com/kiva/ui/commit/edfa50ae07a25c4a0d7dc68f694e4b311ea9e34f))
* lint ([092fb7f](https://github.com/kiva/ui/commit/092fb7f5b5cbeb66f5d50bf5c3d0935eef6707b1))
* lint ([0142986](https://github.com/kiva/ui/commit/014298641e3e0d15cf8cfc9e72ad87cb3814f33c))
* lint and auto height using tw ([f0c1247](https://github.com/kiva/ui/commit/f0c1247997a0ecdd8efd224cdc8258e59b4ddbce))
* linting fixes ([ca3000b](https://github.com/kiva/ui/commit/ca3000b983099bd239bc110861e5dea53c312e7c))
* log warning when prefetch or readQuery are skipped due to missing transaction id ([e344ec7](https://github.com/kiva/ui/commit/e344ec75b6f2359c860d879c64f1b89c3076e1a0))
* logic between different paths ([32d0f75](https://github.com/kiva/ui/commit/32d0f75c15d0435352b82c233a9b2c3d71c55cca))
* method handler with onlick ([119b3b8](https://github.com/kiva/ui/commit/119b3b824e7b159779ed8ff9fdb7f7e09212e598))
* missing component ([8533482](https://github.com/kiva/ui/commit/8533482abea886f2e6bcf0e4a496b50bcbccdcef))
* move scroll method to component to not break other smooth scroll usages ([b75bd1a](https://github.com/kiva/ui/commit/b75bd1a435ce613ff3e04142a3eb22eb06c16b99))
* moving firstLoan condition change to new ty page ([cd2dd70](https://github.com/kiva/ui/commit/cd2dd70db95cb20641d251ffd4111e5efd92dc1f))
* only basket items need to be adjusted for logged out version of experiment ([e72f408](https://github.com/kiva/ui/commit/e72f4080c0a070a7079e8f1b83bac4c822ca2b43))
* only log experiment assignment if the user is not logged in ([159c2d5](https://github.com/kiva/ui/commit/159c2d53aabf44af9a406fefa3e9f6a3d116d8f7))
* only sticky actions when logged out ([fe6e5ef](https://github.com/kiva/ui/commit/fe6e5ef4badedbf4282453ae6c07bbe8948056a7))
* prevent massive error logs due to failed receipt query when no transactionId is present ([4f0091e](https://github.com/kiva/ui/commit/4f0091ecc859640a329100c348b9a1c7af849f0b))
* remove currentStep assignation ([b11f7de](https://github.com/kiva/ui/commit/b11f7de34dcb6d76659218dab8b599de7a2291f0))
* remove unnecessary comments and log ([43b86a9](https://github.com/kiva/ui/commit/43b86a95ffdb72721b4b7f4036055c22f7deefdd))
* remove unneeded mounted on loan next steps ([3748c49](https://github.com/kiva/ui/commit/3748c493e4f327963c6038d3b8bf5e8c8febc325))
* reposition animated sparkles around borrower image MP-376 ([8a5819d](https://github.com/kiva/ui/commit/8a5819de39e9116a701b0d3d3b749caa3c04a31b))
* resolve comments ([71b9349](https://github.com/kiva/ui/commit/71b93496872f75c92f2911a15069f2d1ba503b9e))
* revert upsell changes for logged-out only version ([0a1de4a](https://github.com/kiva/ui/commit/0a1de4a84f8de43505f5b0b777d60cabb127a767))
* show new page logic ([ef25786](https://github.com/kiva/ui/commit/ef2578641e4b89126bdd9eebbed35956004268e2))
* show new thank you page to users who made first transaction and do not opted in ([1b516cb](https://github.com/kiva/ui/commit/1b516cb0b0063979222603356b56bb1c28b90a5c))
* solve comments and change steps component name ([92cda34](https://github.com/kiva/ui/commit/92cda34c846199d15119be3aae4b1654196b5f2a))
* steps animation ([4a0a5b1](https://github.com/kiva/ui/commit/4a0a5b12691c5f3fd1e26d409c310e42fe25f7c7))
* sticky buttons on scroll for better user experience ([67c3ea8](https://github.com/kiva/ui/commit/67c3ea8e555861322cd877fb4a413c62a8e9f082))
* temp workaround for sticky buttons covering part of footer ([fe23ae0](https://github.com/kiva/ui/commit/fe23ae01993ee760e798655f93ac47618f5ebcd1))
* weeks to repay logic ([fe7fd20](https://github.com/kiva/ui/commit/fe7fd20f492c421cc7a256c6b2dad44b6da5d0c1))


### 🪚 Refactors

* simplify logic ([8798f3e](https://github.com/kiva/ui/commit/8798f3ed1ac5067be9bb621eba77f7e90d53359a))
* tailwind classses ([270a50f](https://github.com/kiva/ui/commit/270a50f58fb4471b91a88d8e696bcb2281c8c703))


### 🧹 Chores

* **release:** 2.745.0-rc.1 [skip ci] ([2b6eba6](https://github.com/kiva/ui/commit/2b6eba6ba7a83c3b6ad3a29eb308ef7e124e2f16)), closes [#5362](https://github.com/kiva/ui/issues/5362) [#5365](https://github.com/kiva/ui/issues/5365) [#5363](https://github.com/kiva/ui/issues/5363)
* update local dev with caddy docs ([f19bcda](https://github.com/kiva/ui/commit/f19bcda7f7c7d4290c86e6146d7849021c8a91f6))

## [2.745.0-rc.1](https://github.com/kiva/ui/compare/v2.744.0...v2.745.0-rc.1) (2024-07-01)


### 🎉 New Features

* [MP-310] hide incentive banner ([e6ce3f6](https://github.com/kiva/ui/commit/e6ce3f6ceb17efc4e7344d1c86d9892327979a55))
* [MP-310] hide incentive banner ([c50a8fb](https://github.com/kiva/ui/commit/c50a8fb8cf9405074e02c4e7050d14dd30b4d5a3))
* [MP-310] hide incentive banner ([cdf251d](https://github.com/kiva/ui/commit/cdf251d80e1f1286a2d1d6ff1dc568e9ba2e38b7))
* [MP-362] update lending credit link ([99ae8de](https://github.com/kiva/ui/commit/99ae8de960df1f86846a1aa45a7807ad746a5547))
* added experiment setting for checkout sticky exp ([b41101e](https://github.com/kiva/ui/commit/b41101e7ba8f3a3f94548e137f27e38061c66ab3))
* animate sparkles for thanks page ([33afe52](https://github.com/kiva/ui/commit/33afe5251cbf6814bd88399c76faa73966312757))
* bp activity feed hidden for sticky cta ([#5362](https://github.com/kiva/ui/issues/5362)) ([d7618c4](https://github.com/kiva/ui/commit/d7618c4d65521a04a3a827b0986059fc0baf6ff9))
* bp matching component size fixed for tablets ([#5365](https://github.com/kiva/ui/issues/5365)) ([898bdcf](https://github.com/kiva/ui/commit/898bdcffa1b3e09d05cdbe8118651ad72c04298e))
* desktop checkout actions experiment ([3349900](https://github.com/kiva/ui/commit/3349900f50050e68e5cb51cf61fbb635178b7b5b))
* disable sticky checkout and log experiment assignment in desktop ([5802cc9](https://github.com/kiva/ui/commit/5802cc913c6c979f8be938b7e987ca9559d44d04))
* hide non receipt elements for print ([44c6ce7](https://github.com/kiva/ui/commit/44c6ce71563eb98faa1bf3937d21ac262b350405))
* initial mocks ([f52ba35](https://github.com/kiva/ui/commit/f52ba350b9d6e670c324d475f596e0956a826914))
* missing animation and update email opt in choice ([43a434a](https://github.com/kiva/ui/commit/43a434a28ac53bfc56e891b1a9cd0dddfe62f4e7))
* new thanks page for opt-in experiment ([27d64dc](https://github.com/kiva/ui/commit/27d64dc7a466c8ad1baec1c0d41c98515b68a7c9))
* overall checkout button experiment ready ([35e41e9](https://github.com/kiva/ui/commit/35e41e9d9bb39f418a9de972cabbb2b124694cba))
* pie chart design for distribution tables MP-434 ([5a7ea34](https://github.com/kiva/ui/commit/5a7ea34b34e1e1ecf123c910d233d1d8c978a3fe))
* refactor new ty page and different variants depending on number of loans ([e8e87d4](https://github.com/kiva/ui/commit/e8e87d404ae58bf5d684c71957da4b8131b8692c))
* shorter version and exp tracking ([bda7120](https://github.com/kiva/ui/commit/bda7120884bd1cf5c72a93dc525e6093c3f00682))
* thank you page behind feature flag ([37d197a](https://github.com/kiva/ui/commit/37d197af99510f5b6ac652aa67f201769c85b109))
* tracking events and fixes ([899be8f](https://github.com/kiva/ui/commit/899be8f23113e9dccfadfa39ffc176ef7c214e99))


### 🐛 Bugfixes

* add parenthesis to arrow function inline return value ([be88548](https://github.com/kiva/ui/commit/be8854811c180209c20b506cf470b8c215d3e31f))
* always evaluate if user landed on a us loan ([d7676a4](https://github.com/kiva/ui/commit/d7676a498f25a4382e8f93c265d76251857f57a5))
* bottom position fixed ([#5363](https://github.com/kiva/ui/issues/5363)) ([a56900e](https://github.com/kiva/ui/commit/a56900e9527827c79c399b0c534d8f02b2e64e72))
* cache value to ensure scroll works ([791403c](https://github.com/kiva/ui/commit/791403cac67f8e53de8cdd3bef59d28d847aa70e))
* cleanup basket classes application ([a7f5b6e](https://github.com/kiva/ui/commit/a7f5b6e9af379229aa6e6ed8be2bbbc7936f8045))
* copy ([6f599c8](https://github.com/kiva/ui/commit/6f599c87852d12a54d0a6643b1dab7cccbc51d6f))
* copy change ([e6704af](https://github.com/kiva/ui/commit/e6704af693d3068bf99c08a46a560db75b7f4a0d))
* design tweaks ([032d86d](https://github.com/kiva/ui/commit/032d86d7955f3b835c632df98436fb6052fd1650))
* enable new ty page when guest checkout happens ([11c206a](https://github.com/kiva/ui/commit/11c206a90305d69a41cc50317072ad602f4c76e1))
* fire hotjar event if the user sees the check sticky experiment, gray bg for desktop ([641fd26](https://github.com/kiva/ui/commit/641fd263ff60c4c3ae584b14c1a67d920630e121))
* firstLoan condition was false in guest checkout ([9482147](https://github.com/kiva/ui/commit/9482147fec8724877b0d5526644db9963753614b))
* hide new ty page if usa loan ([3405e9d](https://github.com/kiva/ui/commit/3405e9dfc26573b2fb5669f11e5f39aa16de8ea1))
* hide top horizontal rule for mobile ([e9dfcb7](https://github.com/kiva/ui/commit/e9dfcb715b30dd20edd4598c5f6aaec19a15044e))
* initilize experiment above firing hotjar event condition ([ebacf3b](https://github.com/kiva/ui/commit/ebacf3b238038738df892e6930d6fc0eba97b161))
* isDesktop no longer needed with logged-out only version ([251c6ae](https://github.com/kiva/ui/commit/251c6ae3b9e32f3e6d0bfabdfea296a32f252d3f))
* lint ([dbc95e2](https://github.com/kiva/ui/commit/dbc95e2b7d3dffcdeb3c81b4af4f6db1a30efda3))
* lint ([0912049](https://github.com/kiva/ui/commit/0912049bf819a892c6f81f9505af54328af826de))
* lint ([edfa50a](https://github.com/kiva/ui/commit/edfa50ae07a25c4a0d7dc68f694e4b311ea9e34f))
* lint ([092fb7f](https://github.com/kiva/ui/commit/092fb7f5b5cbeb66f5d50bf5c3d0935eef6707b1))
* lint ([0142986](https://github.com/kiva/ui/commit/014298641e3e0d15cf8cfc9e72ad87cb3814f33c))
* lint and auto height using tw ([f0c1247](https://github.com/kiva/ui/commit/f0c1247997a0ecdd8efd224cdc8258e59b4ddbce))
* linting fixes ([ca3000b](https://github.com/kiva/ui/commit/ca3000b983099bd239bc110861e5dea53c312e7c))
* log warning when prefetch or readQuery are skipped due to missing transaction id ([e344ec7](https://github.com/kiva/ui/commit/e344ec75b6f2359c860d879c64f1b89c3076e1a0))
* logic between different paths ([32d0f75](https://github.com/kiva/ui/commit/32d0f75c15d0435352b82c233a9b2c3d71c55cca))
* method handler with onlick ([119b3b8](https://github.com/kiva/ui/commit/119b3b824e7b159779ed8ff9fdb7f7e09212e598))
* missing component ([8533482](https://github.com/kiva/ui/commit/8533482abea886f2e6bcf0e4a496b50bcbccdcef))
* move scroll method to component to not break other smooth scroll usages ([b75bd1a](https://github.com/kiva/ui/commit/b75bd1a435ce613ff3e04142a3eb22eb06c16b99))
* moving firstLoan condition change to new ty page ([cd2dd70](https://github.com/kiva/ui/commit/cd2dd70db95cb20641d251ffd4111e5efd92dc1f))
* only basket items need to be adjusted for logged out version of experiment ([e72f408](https://github.com/kiva/ui/commit/e72f4080c0a070a7079e8f1b83bac4c822ca2b43))
* only log experiment assignment if the user is not logged in ([159c2d5](https://github.com/kiva/ui/commit/159c2d53aabf44af9a406fefa3e9f6a3d116d8f7))
* only sticky actions when logged out ([fe6e5ef](https://github.com/kiva/ui/commit/fe6e5ef4badedbf4282453ae6c07bbe8948056a7))
* prevent massive error logs due to failed receipt query when no transactionId is present ([4f0091e](https://github.com/kiva/ui/commit/4f0091ecc859640a329100c348b9a1c7af849f0b))
* remove currentStep assignation ([b11f7de](https://github.com/kiva/ui/commit/b11f7de34dcb6d76659218dab8b599de7a2291f0))
* remove unnecessary comments and log ([43b86a9](https://github.com/kiva/ui/commit/43b86a95ffdb72721b4b7f4036055c22f7deefdd))
* remove unneeded mounted on loan next steps ([3748c49](https://github.com/kiva/ui/commit/3748c493e4f327963c6038d3b8bf5e8c8febc325))
* reposition animated sparkles around borrower image MP-376 ([8a5819d](https://github.com/kiva/ui/commit/8a5819de39e9116a701b0d3d3b749caa3c04a31b))
* resolve comments ([71b9349](https://github.com/kiva/ui/commit/71b93496872f75c92f2911a15069f2d1ba503b9e))
* revert upsell changes for logged-out only version ([0a1de4a](https://github.com/kiva/ui/commit/0a1de4a84f8de43505f5b0b777d60cabb127a767))
* show new page logic ([ef25786](https://github.com/kiva/ui/commit/ef2578641e4b89126bdd9eebbed35956004268e2))
* show new thank you page to users who made first transaction and do not opted in ([1b516cb](https://github.com/kiva/ui/commit/1b516cb0b0063979222603356b56bb1c28b90a5c))
* solve comments and change steps component name ([92cda34](https://github.com/kiva/ui/commit/92cda34c846199d15119be3aae4b1654196b5f2a))
* steps animation ([4a0a5b1](https://github.com/kiva/ui/commit/4a0a5b12691c5f3fd1e26d409c310e42fe25f7c7))
* sticky buttons on scroll for better user experience ([67c3ea8](https://github.com/kiva/ui/commit/67c3ea8e555861322cd877fb4a413c62a8e9f082))
* temp workaround for sticky buttons covering part of footer ([fe23ae0](https://github.com/kiva/ui/commit/fe23ae01993ee760e798655f93ac47618f5ebcd1))
* weeks to repay logic ([fe7fd20](https://github.com/kiva/ui/commit/fe7fd20f492c421cc7a256c6b2dad44b6da5d0c1))


### 🪚 Refactors

* simplify logic ([8798f3e](https://github.com/kiva/ui/commit/8798f3ed1ac5067be9bb621eba77f7e90d53359a))
* tailwind classses ([270a50f](https://github.com/kiva/ui/commit/270a50f58fb4471b91a88d8e696bcb2281c8c703))


### 🧹 Chores

* update local dev with caddy docs ([f19bcda](https://github.com/kiva/ui/commit/f19bcda7f7c7d4290c86e6146d7849021c8a91f6))

## [2.744.0](https://github.com/kiva/ui/compare/v2.743.0...v2.744.0) (2024-06-18)


### 🎉 New Features

* add banner link back to imnpact dash if user came from impact dash ([b5544bf](https://github.com/kiva/ui/commit/b5544bf6ed2e591af11fa51e6bfb6a8455cf5b5c))


### 🐛 Bugfixes

* copy change on from impact dash banner ([b0588bd](https://github.com/kiva/ui/commit/b0588bd08936f61811278c5533b1636f0016192a))


### 🧹 Chores

* **release:** 2.744.0-rc.1 [skip ci] ([70c398c](https://github.com/kiva/ui/commit/70c398c48e6f46ba5a663659acebab1843a3294d))

## [2.744.0-rc.1](https://github.com/kiva/ui/compare/v2.743.0...v2.744.0-rc.1) (2024-06-17)


### 🎉 New Features

* add banner link back to imnpact dash if user came from impact dash ([b5544bf](https://github.com/kiva/ui/commit/b5544bf6ed2e591af11fa51e6bfb6a8455cf5b5c))


### 🐛 Bugfixes

* copy change on from impact dash banner ([b0588bd](https://github.com/kiva/ui/commit/b0588bd08936f61811278c5533b1636f0016192a))

## [2.743.0](https://github.com/kiva/ui/compare/v2.742.0...v2.743.0) (2024-06-06)


### 🎉 New Features

* email repayment settings update ([#5342](https://github.com/kiva/ui/issues/5342)) ([122dc99](https://github.com/kiva/ui/commit/122dc998e822ba5c209e58ca6e88869c8d7abc26))


### 🐛 Bugfixes

* terms and conditions copy on exp v2 ([9ec9684](https://github.com/kiva/ui/commit/9ec9684f6db20b1bda1e127b59c0da4384bb9852))


### 🏗️ Build System

* use main branch of marketplace-web-ui-ci ([4fe17ca](https://github.com/kiva/ui/commit/4fe17ca1dc3b595e7baea833252bd5a70caf73bb))


### 🧹 Chores

* **release:** 2.743.0-rc.1 [skip ci] ([04f1d77](https://github.com/kiva/ui/commit/04f1d77e758963be5a5a4930b54f682aa8692086)), closes [#5342](https://github.com/kiva/ui/issues/5342)

## [2.743.0-rc.1](https://github.com/kiva/ui/compare/v2.742.0...v2.743.0-rc.1) (2024-06-06)


### 🎉 New Features

* email repayment settings update ([#5342](https://github.com/kiva/ui/issues/5342)) ([122dc99](https://github.com/kiva/ui/commit/122dc998e822ba5c209e58ca6e88869c8d7abc26))


### 🐛 Bugfixes

* terms and conditions copy on exp v2 ([9ec9684](https://github.com/kiva/ui/commit/9ec9684f6db20b1bda1e127b59c0da4384bb9852))


### 🏗️ Build System

* use main branch of marketplace-web-ui-ci ([4fe17ca](https://github.com/kiva/ui/commit/4fe17ca1dc3b595e7baea833252bd5a70caf73bb))

## [2.742.0](https://github.com/kiva/ui/compare/v2.741.0...v2.742.0) (2024-06-03)


### 🎉 New Features

* [MP-136] borrower funded email lend ui ([61d3e92](https://github.com/kiva/ui/commit/61d3e92e14de2c0f342a68ae3e41ae9c5faf65f9))
* [MP-136] borrower funded email lend ui ([0cd2b10](https://github.com/kiva/ui/commit/0cd2b10fd5f8af44a42588643690589b8d733794))
* [MP-136] borrower funded email lend ui ([95f0729](https://github.com/kiva/ui/commit/95f072906981a6283b21e376a46c77d369d91212))
* add tracking events ([b87edb2](https://github.com/kiva/ui/commit/b87edb2c80a06be25675e0ca75f1450549ed7b90))
* copy changes ([fc4de3d](https://github.com/kiva/ui/commit/fc4de3d0c08e6fa136b82034f98b30648804a84c))
* lent amount removed in activity feed ([#5341](https://github.com/kiva/ui/issues/5341)) ([9e03e6e](https://github.com/kiva/ui/commit/9e03e6e670746477aa84f631912c403f1d9b7bb3))
* opt-in comms with radio button ([e319449](https://github.com/kiva/ui/commit/e319449debfa1b3f7c571ad89e1bf0684af3fb72))
* run experiment only when loans in basket ([59e4528](https://github.com/kiva/ui/commit/59e4528ade374ad31658639ca544a359d4ed9e7c))


### 🐛 Bugfixes

* conflict ([33ac6b6](https://github.com/kiva/ui/commit/33ac6b60735656f3674185a37e73c567edd081ce))
* conflict between invalid inputs because of the variants and adding missing TOS copy ([52efb35](https://github.com/kiva/ui/commit/52efb35b60d48e59c15d7f6ea41f8249c7179876))
* enable experiment only if news consent is needed ([f8d95e5](https://github.com/kiva/ui/commit/f8d95e595772bf979098da9b15f8d933953d068a))
* fetch experiment data ([872ce4d](https://github.com/kiva/ui/commit/872ce4de63c9b881e568feb64c15419dab3733b6))
* lint ([98988bf](https://github.com/kiva/ui/commit/98988bf5ada071916065a1f1438a4b5059aa305d))
* radio button was not displayed and validation issues ([b8bb684](https://github.com/kiva/ui/commit/b8bb68438b7f6f2d78728e9eca1ff6db19cd92e1))
* removed required rule by mistake ([f583527](https://github.com/kiva/ui/commit/f583527399b59a86fe86e1ae6bc6343111b3c11e))
* set exp flag to false ([afa2b8b](https://github.com/kiva/ui/commit/afa2b8be4011b6c3d5d9e79501285fe69be3435d))
* set tao to true for second variant in RegisterSocial comp ([5e69622](https://github.com/kiva/ui/commit/5e69622b6fda38abff8c6712d4611ec6eeb15d47))
* set tracking category as a prop for user updates preference ([839da67](https://github.com/kiva/ui/commit/839da670ceb827cf692e62b890eb87f39b8963cb))
* tracking ([a1774bc](https://github.com/kiva/ui/commit/a1774bca9cc301128efdbc57224d9d82fe0eed3b))
* update emailUpdates and newsConsent values in radio btn experiment ([ba35294](https://github.com/kiva/ui/commit/ba35294d51c9e13f44eba8563486b7009ee4e85b))


### 🪚 Refactors

* user preference component ([7a60576](https://github.com/kiva/ui/commit/7a60576cbe5fc504dca1be54865e22a9cb7167b0))
* using requiredIf to validate radio input ([470fb58](https://github.com/kiva/ui/commit/470fb581a7bc60ef4da99e6c958e7cee931c1fe5))


### 🧹 Chores

* **release:** 2.742.0-rc.1 [skip ci] ([0fc7fcb](https://github.com/kiva/ui/commit/0fc7fcb3c6c8a9a4d707392b50ad0ed3439e809e)), closes [#5341](https://github.com/kiva/ui/issues/5341)

## [2.742.0-rc.1](https://github.com/kiva/ui/compare/v2.741.0...v2.742.0-rc.1) (2024-06-03)


### 🎉 New Features

* [MP-136] borrower funded email lend ui ([61d3e92](https://github.com/kiva/ui/commit/61d3e92e14de2c0f342a68ae3e41ae9c5faf65f9))
* [MP-136] borrower funded email lend ui ([0cd2b10](https://github.com/kiva/ui/commit/0cd2b10fd5f8af44a42588643690589b8d733794))
* [MP-136] borrower funded email lend ui ([95f0729](https://github.com/kiva/ui/commit/95f072906981a6283b21e376a46c77d369d91212))
* add tracking events ([b87edb2](https://github.com/kiva/ui/commit/b87edb2c80a06be25675e0ca75f1450549ed7b90))
* copy changes ([fc4de3d](https://github.com/kiva/ui/commit/fc4de3d0c08e6fa136b82034f98b30648804a84c))
* lent amount removed in activity feed ([#5341](https://github.com/kiva/ui/issues/5341)) ([9e03e6e](https://github.com/kiva/ui/commit/9e03e6e670746477aa84f631912c403f1d9b7bb3))
* opt-in comms with radio button ([e319449](https://github.com/kiva/ui/commit/e319449debfa1b3f7c571ad89e1bf0684af3fb72))
* run experiment only when loans in basket ([59e4528](https://github.com/kiva/ui/commit/59e4528ade374ad31658639ca544a359d4ed9e7c))


### 🐛 Bugfixes

* conflict ([33ac6b6](https://github.com/kiva/ui/commit/33ac6b60735656f3674185a37e73c567edd081ce))
* conflict between invalid inputs because of the variants and adding missing TOS copy ([52efb35](https://github.com/kiva/ui/commit/52efb35b60d48e59c15d7f6ea41f8249c7179876))
* enable experiment only if news consent is needed ([f8d95e5](https://github.com/kiva/ui/commit/f8d95e595772bf979098da9b15f8d933953d068a))
* fetch experiment data ([872ce4d](https://github.com/kiva/ui/commit/872ce4de63c9b881e568feb64c15419dab3733b6))
* lint ([98988bf](https://github.com/kiva/ui/commit/98988bf5ada071916065a1f1438a4b5059aa305d))
* radio button was not displayed and validation issues ([b8bb684](https://github.com/kiva/ui/commit/b8bb68438b7f6f2d78728e9eca1ff6db19cd92e1))
* removed required rule by mistake ([f583527](https://github.com/kiva/ui/commit/f583527399b59a86fe86e1ae6bc6343111b3c11e))
* set exp flag to false ([afa2b8b](https://github.com/kiva/ui/commit/afa2b8be4011b6c3d5d9e79501285fe69be3435d))
* set tao to true for second variant in RegisterSocial comp ([5e69622](https://github.com/kiva/ui/commit/5e69622b6fda38abff8c6712d4611ec6eeb15d47))
* set tracking category as a prop for user updates preference ([839da67](https://github.com/kiva/ui/commit/839da670ceb827cf692e62b890eb87f39b8963cb))
* tracking ([a1774bc](https://github.com/kiva/ui/commit/a1774bca9cc301128efdbc57224d9d82fe0eed3b))
* update emailUpdates and newsConsent values in radio btn experiment ([ba35294](https://github.com/kiva/ui/commit/ba35294d51c9e13f44eba8563486b7009ee4e85b))


### 🪚 Refactors

* user preference component ([7a60576](https://github.com/kiva/ui/commit/7a60576cbe5fc504dca1be54865e22a9cb7167b0))
* using requiredIf to validate radio input ([470fb58](https://github.com/kiva/ui/commit/470fb581a7bc60ef4da99e6c958e7cee931c1fe5))

## [2.741.0](https://github.com/kiva/ui/compare/v2.740.0...v2.741.0) (2024-05-28)


### 🎉 New Features

* footer disclaimer date update ([#5331](https://github.com/kiva/ui/issues/5331)) ([6e57053](https://github.com/kiva/ui/commit/6e5705350f1395c79f990fcd9ff7a67f3ff409c1))
* multiple clickable pills ([#5327](https://github.com/kiva/ui/issues/5327)) ([4085cf1](https://github.com/kiva/ui/commit/4085cf13460d40fc9771fd793128d222847b246a))
* opt-in copy experiment in guest checkout ([ca8d892](https://github.com/kiva/ui/commit/ca8d8923c185f11e8ecbed09e3a97ccd1359403a))
* opt-in copy experiment in register social ([07e0726](https://github.com/kiva/ui/commit/07e07265bcfd29f129d85fa0efcc517b9e31d331))
* send exp version to track in auth0 interface ([3f4c89d](https://github.com/kiva/ui/commit/3f4c89d722a6d13e858f609f8d790641e025a96f))
* set experiment version in cookie to be read on server ([262a861](https://github.com/kiva/ui/commit/262a8616a5fd0ccd1cdb99d194e7138b7adf39de))


### 🐛 Bugfixes

* add check for new access_denied error ([05576eb](https://github.com/kiva/ui/commit/05576ebb80214891257790bfa794369f280dbe14))
* category ([188f874](https://github.com/kiva/ui/commit/188f874ad8a7fb75d62c78cdc4dff83dcaea8a17))
* prevent saving cookie if version is not defined ([4a17817](https://github.com/kiva/ui/commit/4a17817b47735cb16f3d7cec65387674e8f20c95))
* resolve comments ([5c6d250](https://github.com/kiva/ui/commit/5c6d2509c8782c72675b85968ff040cb21f92bb6))
* revert tracking event in policy link ([930d788](https://github.com/kiva/ui/commit/930d7888853f3935c2c1841f6b62ff72e3276a7e))
* skip exp when passwordless is active and remove exp query ([5aa73f5](https://github.com/kiva/ui/commit/5aa73f5d83380fa713195521cd97dbf49422ceaa))
* specify Kiva in terms of use ([df275d4](https://github.com/kiva/ui/commit/df275d440ffa8161968eaefbb250d20fc43bd26c))
* updates copy and tracking ([5fd0aa9](https://github.com/kiva/ui/commit/5fd0aa9639bb35f9e5987e42fc7e8ab7c92ec247))
* upload static assets for staging and production releases MP-289 ([3452fac](https://github.com/kiva/ui/commit/3452facec3ac995d95d7048d189288702a6fd125))
* use desc instead ([5573ca6](https://github.com/kiva/ui/commit/5573ca64e2151665abacf2b1421e4b174ae1411e))


### 🧹 Chores

* **release:** 2.741.0-rc.1 [skip ci] ([f3122fa](https://github.com/kiva/ui/commit/f3122fa4097006e14d43f26a767251628ac48154)), closes [#5331](https://github.com/kiva/ui/issues/5331) [#5327](https://github.com/kiva/ui/issues/5327)

## [2.741.0-rc.1](https://github.com/kiva/ui/compare/v2.740.0...v2.741.0-rc.1) (2024-05-28)


### 🎉 New Features

* footer disclaimer date update ([#5331](https://github.com/kiva/ui/issues/5331)) ([6e57053](https://github.com/kiva/ui/commit/6e5705350f1395c79f990fcd9ff7a67f3ff409c1))
* multiple clickable pills ([#5327](https://github.com/kiva/ui/issues/5327)) ([4085cf1](https://github.com/kiva/ui/commit/4085cf13460d40fc9771fd793128d222847b246a))
* opt-in copy experiment in guest checkout ([ca8d892](https://github.com/kiva/ui/commit/ca8d8923c185f11e8ecbed09e3a97ccd1359403a))
* opt-in copy experiment in register social ([07e0726](https://github.com/kiva/ui/commit/07e07265bcfd29f129d85fa0efcc517b9e31d331))
* send exp version to track in auth0 interface ([3f4c89d](https://github.com/kiva/ui/commit/3f4c89d722a6d13e858f609f8d790641e025a96f))
* set experiment version in cookie to be read on server ([262a861](https://github.com/kiva/ui/commit/262a8616a5fd0ccd1cdb99d194e7138b7adf39de))


### 🐛 Bugfixes

* add check for new access_denied error ([05576eb](https://github.com/kiva/ui/commit/05576ebb80214891257790bfa794369f280dbe14))
* category ([188f874](https://github.com/kiva/ui/commit/188f874ad8a7fb75d62c78cdc4dff83dcaea8a17))
* prevent saving cookie if version is not defined ([4a17817](https://github.com/kiva/ui/commit/4a17817b47735cb16f3d7cec65387674e8f20c95))
* resolve comments ([5c6d250](https://github.com/kiva/ui/commit/5c6d2509c8782c72675b85968ff040cb21f92bb6))
* revert tracking event in policy link ([930d788](https://github.com/kiva/ui/commit/930d7888853f3935c2c1841f6b62ff72e3276a7e))
* skip exp when passwordless is active and remove exp query ([5aa73f5](https://github.com/kiva/ui/commit/5aa73f5d83380fa713195521cd97dbf49422ceaa))
* specify Kiva in terms of use ([df275d4](https://github.com/kiva/ui/commit/df275d440ffa8161968eaefbb250d20fc43bd26c))
* updates copy and tracking ([5fd0aa9](https://github.com/kiva/ui/commit/5fd0aa9639bb35f9e5987e42fc7e8ab7c92ec247))
* upload static assets for staging and production releases MP-289 ([3452fac](https://github.com/kiva/ui/commit/3452facec3ac995d95d7048d189288702a6fd125))
* use desc instead ([5573ca6](https://github.com/kiva/ui/commit/5573ca64e2151665abacf2b1421e4b174ae1411e))

## [2.740.0](https://github.com/kiva/ui/compare/v2.739.2...v2.740.0) (2024-05-20)


### 🎉 New Features

* activity support on filter page ([#5302](https://github.com/kiva/ui/issues/5302)) ([01b1fdb](https://github.com/kiva/ui/commit/01b1fdbdabec73c49c6478ee7086d9295dc223d0))
* add feature flag to teams navbar ([adb36cc](https://github.com/kiva/ui/commit/adb36cc514615c8f2a8a2988a83d41ab74347fb0))
* add teams to navbar on desktop ([fd85813](https://github.com/kiva/ui/commit/fd858138629f566630761997e49ca3f7a116fe9d))
* added prefetch ([6fb95fb](https://github.com/kiva/ui/commit/6fb95fb76db330d020fad4259a4148a74c1b619e))
* assign team to loan in bp ([ff22bc9](https://github.com/kiva/ui/commit/ff22bc9315a3448f50d10ed729e8d91c0e852cce))
* build & upload static assets before docker image ([d143a80](https://github.com/kiva/ui/commit/d143a801e792ad56d325e450ed09de16a0a1f5e6))
* content changes to registration form for passwordless case ([aa4f387](https://github.com/kiva/ui/commit/aa4f387bbd5ac619297ef996386f73e09760d845))
* edits to get logo data in right ([996020d](https://github.com/kiva/ui/commit/996020d68fd53c29d44fa4d99fcc413245fa0fc6))
* kv components package updated ([#5303](https://github.com/kiva/ui/issues/5303)) ([903d3bd](https://github.com/kiva/ui/commit/903d3bdd21b6b36cc9ab3cad341b27a0b7ef998d))
* logo rendering ([418aa3f](https://github.com/kiva/ui/commit/418aa3f2bd3700947e6d2a3dcbc9cd2eaca646e7))
* logo rendering on register form for passwordless ([b7571ea](https://github.com/kiva/ui/commit/b7571eabdafa7c6885659101c5438a5b837605d7))
* Navbar copy and event changes in teams ([07f6e44](https://github.com/kiva/ui/commit/07f6e441f87f29121adf7226d56b254ea9cb8d4f))
* remove border on reg form ([1c3922a](https://github.com/kiva/ui/commit/1c3922a8043f1b0ef0db3adc516ccc8f4386dd1f))
* restart upload process with new action changes MP-226 ([7bdff13](https://github.com/kiva/ui/commit/7bdff13398f5fc8d3717596e31a8ea218952230f))
* try new upload to s3 optional functionality ([f2805b6](https://github.com/kiva/ui/commit/f2805b6296297616afdf1db14684694e3feb2e02))


### 🐛 Bugfixes

* add team id to event ([7122a92](https://github.com/kiva/ui/commit/7122a92c7131f28cc562d1036ec86cba3a219440))
* altered prefetch ([de11d68](https://github.com/kiva/ui/commit/de11d6870697d36d1df363f14166e975f34c63dd))
* amount lent value ([d99ae7c](https://github.com/kiva/ui/commit/d99ae7c9a300e32b8ec000e67fa55825765b1160))
* change to one line header ([999ca7b](https://github.com/kiva/ui/commit/999ca7b32c1523dc1f394cffa383236d6d188063))
* comment out upload file glob pattern for now ([0eef181](https://github.com/kiva/ui/commit/0eef1817305da4d605571b787a45059a70d47368))
* convert amountLent to number ([250fff8](https://github.com/kiva/ui/commit/250fff84bd94c702835ffe330e7c9dcbc0b74953))
* count month days for teams challenge days left ([f073f37](https://github.com/kiva/ui/commit/f073f37fdb5a73502ac9e2e02b8c7137a347c45e))
* debugger ([0c004b3](https://github.com/kiva/ui/commit/0c004b32b65bab44cd7bd142b8ab9a188c6de0cf))
* differenceInDays doesn't count fractional days ([f932f62](https://github.com/kiva/ui/commit/f932f62c1701ff58b4b59ba4a825df7f2e23977b))
* disable file compression MP-212 ([b69ef8a](https://github.com/kiva/ui/commit/b69ef8ac386c8967b01602338e9ea62b12a9d31d))
* disable new upload step ([6c193c8](https://github.com/kiva/ui/commit/6c193c86fb9c577ac12ee07bceae580eb1c27bd8))
* edit to prefetch ([cd9723d](https://github.com/kiva/ui/commit/cd9723dd1781fcc5ff317160bc3be81b119628ab))
* edits to address pr comments ([ececeb2](https://github.com/kiva/ui/commit/ececeb23014f4249e7f379a545ad1f6092a6f669))
* following exclusion rules to show banner ([d4c232e](https://github.com/kiva/ui/commit/d4c232e527e9b6d3aa1a451f91fcd2dcd2baf239))
* get borrower applicant cookie again ([3dfe864](https://github.com/kiva/ui/commit/3dfe864f9e14cca68ce407d0bca31ed534a9ea9c))
* ignore server bundle and client manifest when uploading static files MP-212 ([350155b](https://github.com/kiva/ui/commit/350155b015c9356a770099b633b66c53a6fb7aa9))
* lint ([20ee074](https://github.com/kiva/ui/commit/20ee0743ceb167f939b5c3ce9fc3a09366b9dc98))
* make change to terms checkboxes global ([59378a7](https://github.com/kiva/ui/commit/59378a77d2f477bbc3513234c5f59e16cfd3acc2))
* moved fetch to prefetch query ([0b717c2](https://github.com/kiva/ui/commit/0b717c25b6a78039caca9b8509bfe640f2c6f366))
* prefetch edit ([c635376](https://github.com/kiva/ui/commit/c6353768b2020ba48f3280acd91ddf0876a5d4f6))
* prefetch edit ([0f14d70](https://github.com/kiva/ui/commit/0f14d7087ff0f7ca30b6bc1301500938c51f8a5d))
* really small dropdown being shown in no teams scenario ([36c3900](https://github.com/kiva/ui/commit/36c3900d97c15421e1e7f495fe3e1889569a415d))
* reinstate registration message for passwordless ([1d5760b](https://github.com/kiva/ui/commit/1d5760b1ddd789ac4541293e6cc664b20ed79881))
* remove extra slash from input ([afc7e31](https://github.com/kiva/ui/commit/afc7e31d307efe50b2b69f1b7640eaee8ce31f26))
* remove lines that were added for local testing ([7d55e6a](https://github.com/kiva/ui/commit/7d55e6a19461c132f7f5f7ac44c81cbda034a36c))
* remove punctuation from event ([2e47f96](https://github.com/kiva/ui/commit/2e47f96ba966bcf00eaa559805236efbf1ac8db0))
* revert checking for kvborrowerapplicant ([a678f5e](https://github.com/kiva/ui/commit/a678f5e21cbf3725e76431dd5817e637c7dee545))
* set api audience for tilt ([cff8f54](https://github.com/kiva/ui/commit/cff8f544a12702d02d072ecc1599fcebc7428d46))
* solidify prefetch method and data access, guard for missing partnerContentId, add route prop ([dc343d3](https://github.com/kiva/ui/commit/dc343d37bf91d07ab0db7ce2ad756a35aed04091))
* team public id for links ([0abb803](https://github.com/kiva/ui/commit/0abb803527356c1b96682aeb9af67de10f2ce85b))
* teamId should be a number ([97b9563](https://github.com/kiva/ui/commit/97b9563260e31b7f820642ab184bd9643cb9d215))
* use docker file from feature branch ([fc9ef01](https://github.com/kiva/ui/commit/fc9ef01df43dad5a630557f1a6c97311ef4914d8))
* use upload_include to select static assets for upload MP-212 ([f4d0a14](https://github.com/kiva/ui/commit/f4d0a140d643d340be48988bd8b71e642644e025))


### 🏗️ Build System

* correct output directory for uploading MP-212 ([3da55e5](https://github.com/kiva/ui/commit/3da55e5f4794eec281315830d33fcbeaf39125ea))
* switch to use-existing-assets branch for docker image until release ([833f879](https://github.com/kiva/ui/commit/833f879af96df5a3cbdc0bf12c809050c48e36db))
* use main dockerfile ([388b14b](https://github.com/kiva/ui/commit/388b14b5722f638639bb8af980b86918ad3dabf9))


### 🪚 Refactors

* using difference in days ([f398fd0](https://github.com/kiva/ui/commit/f398fd0ba710a6c4324e2ad51d7d3254d9416383))
* using formatDistanceToNowStrict to get days left ([ebca918](https://github.com/kiva/ui/commit/ebca91833e3708b19002a22a181ceb1c43156677))


### 🧹 Chores

* add README for Graphql to help understand our preFetch mechansims ([ef6d6d7](https://github.com/kiva/ui/commit/ef6d6d73a6bc6cd2ee5459e5d74360bd7e4d9774))
* **release:** 2.740.0-rc.1 [skip ci] ([3774ffa](https://github.com/kiva/ui/commit/3774ffa16e2f15c9a800813082b34033e1464be7)), closes [#5302](https://github.com/kiva/ui/issues/5302) [#5303](https://github.com/kiva/ui/issues/5303)
* update kv-components ([9f1ff27](https://github.com/kiva/ui/commit/9f1ff2746b6081bf893a1b171ccd349717793490))

## [2.740.0-rc.1](https://github.com/kiva/ui/compare/v2.739.2...v2.740.0-rc.1) (2024-05-20)


### 🎉 New Features

* activity support on filter page ([#5302](https://github.com/kiva/ui/issues/5302)) ([01b1fdb](https://github.com/kiva/ui/commit/01b1fdbdabec73c49c6478ee7086d9295dc223d0))
* add feature flag to teams navbar ([adb36cc](https://github.com/kiva/ui/commit/adb36cc514615c8f2a8a2988a83d41ab74347fb0))
* add teams to navbar on desktop ([fd85813](https://github.com/kiva/ui/commit/fd858138629f566630761997e49ca3f7a116fe9d))
* added prefetch ([6fb95fb](https://github.com/kiva/ui/commit/6fb95fb76db330d020fad4259a4148a74c1b619e))
* assign team to loan in bp ([ff22bc9](https://github.com/kiva/ui/commit/ff22bc9315a3448f50d10ed729e8d91c0e852cce))
* build & upload static assets before docker image ([d143a80](https://github.com/kiva/ui/commit/d143a801e792ad56d325e450ed09de16a0a1f5e6))
* content changes to registration form for passwordless case ([aa4f387](https://github.com/kiva/ui/commit/aa4f387bbd5ac619297ef996386f73e09760d845))
* edits to get logo data in right ([996020d](https://github.com/kiva/ui/commit/996020d68fd53c29d44fa4d99fcc413245fa0fc6))
* kv components package updated ([#5303](https://github.com/kiva/ui/issues/5303)) ([903d3bd](https://github.com/kiva/ui/commit/903d3bdd21b6b36cc9ab3cad341b27a0b7ef998d))
* logo rendering ([418aa3f](https://github.com/kiva/ui/commit/418aa3f2bd3700947e6d2a3dcbc9cd2eaca646e7))
* logo rendering on register form for passwordless ([b7571ea](https://github.com/kiva/ui/commit/b7571eabdafa7c6885659101c5438a5b837605d7))
* Navbar copy and event changes in teams ([07f6e44](https://github.com/kiva/ui/commit/07f6e441f87f29121adf7226d56b254ea9cb8d4f))
* remove border on reg form ([1c3922a](https://github.com/kiva/ui/commit/1c3922a8043f1b0ef0db3adc516ccc8f4386dd1f))
* restart upload process with new action changes MP-226 ([7bdff13](https://github.com/kiva/ui/commit/7bdff13398f5fc8d3717596e31a8ea218952230f))
* try new upload to s3 optional functionality ([f2805b6](https://github.com/kiva/ui/commit/f2805b6296297616afdf1db14684694e3feb2e02))


### 🐛 Bugfixes

* add team id to event ([7122a92](https://github.com/kiva/ui/commit/7122a92c7131f28cc562d1036ec86cba3a219440))
* altered prefetch ([de11d68](https://github.com/kiva/ui/commit/de11d6870697d36d1df363f14166e975f34c63dd))
* amount lent value ([d99ae7c](https://github.com/kiva/ui/commit/d99ae7c9a300e32b8ec000e67fa55825765b1160))
* change to one line header ([999ca7b](https://github.com/kiva/ui/commit/999ca7b32c1523dc1f394cffa383236d6d188063))
* comment out upload file glob pattern for now ([0eef181](https://github.com/kiva/ui/commit/0eef1817305da4d605571b787a45059a70d47368))
* convert amountLent to number ([250fff8](https://github.com/kiva/ui/commit/250fff84bd94c702835ffe330e7c9dcbc0b74953))
* count month days for teams challenge days left ([f073f37](https://github.com/kiva/ui/commit/f073f37fdb5a73502ac9e2e02b8c7137a347c45e))
* debugger ([0c004b3](https://github.com/kiva/ui/commit/0c004b32b65bab44cd7bd142b8ab9a188c6de0cf))
* differenceInDays doesn't count fractional days ([f932f62](https://github.com/kiva/ui/commit/f932f62c1701ff58b4b59ba4a825df7f2e23977b))
* disable file compression MP-212 ([b69ef8a](https://github.com/kiva/ui/commit/b69ef8ac386c8967b01602338e9ea62b12a9d31d))
* disable new upload step ([6c193c8](https://github.com/kiva/ui/commit/6c193c86fb9c577ac12ee07bceae580eb1c27bd8))
* edit to prefetch ([cd9723d](https://github.com/kiva/ui/commit/cd9723dd1781fcc5ff317160bc3be81b119628ab))
* edits to address pr comments ([ececeb2](https://github.com/kiva/ui/commit/ececeb23014f4249e7f379a545ad1f6092a6f669))
* following exclusion rules to show banner ([d4c232e](https://github.com/kiva/ui/commit/d4c232e527e9b6d3aa1a451f91fcd2dcd2baf239))
* get borrower applicant cookie again ([3dfe864](https://github.com/kiva/ui/commit/3dfe864f9e14cca68ce407d0bca31ed534a9ea9c))
* ignore server bundle and client manifest when uploading static files MP-212 ([350155b](https://github.com/kiva/ui/commit/350155b015c9356a770099b633b66c53a6fb7aa9))
* lint ([20ee074](https://github.com/kiva/ui/commit/20ee0743ceb167f939b5c3ce9fc3a09366b9dc98))
* make change to terms checkboxes global ([59378a7](https://github.com/kiva/ui/commit/59378a77d2f477bbc3513234c5f59e16cfd3acc2))
* moved fetch to prefetch query ([0b717c2](https://github.com/kiva/ui/commit/0b717c25b6a78039caca9b8509bfe640f2c6f366))
* prefetch edit ([c635376](https://github.com/kiva/ui/commit/c6353768b2020ba48f3280acd91ddf0876a5d4f6))
* prefetch edit ([0f14d70](https://github.com/kiva/ui/commit/0f14d7087ff0f7ca30b6bc1301500938c51f8a5d))
* really small dropdown being shown in no teams scenario ([36c3900](https://github.com/kiva/ui/commit/36c3900d97c15421e1e7f495fe3e1889569a415d))
* reinstate registration message for passwordless ([1d5760b](https://github.com/kiva/ui/commit/1d5760b1ddd789ac4541293e6cc664b20ed79881))
* remove extra slash from input ([afc7e31](https://github.com/kiva/ui/commit/afc7e31d307efe50b2b69f1b7640eaee8ce31f26))
* remove lines that were added for local testing ([7d55e6a](https://github.com/kiva/ui/commit/7d55e6a19461c132f7f5f7ac44c81cbda034a36c))
* remove punctuation from event ([2e47f96](https://github.com/kiva/ui/commit/2e47f96ba966bcf00eaa559805236efbf1ac8db0))
* revert checking for kvborrowerapplicant ([a678f5e](https://github.com/kiva/ui/commit/a678f5e21cbf3725e76431dd5817e637c7dee545))
* set api audience for tilt ([cff8f54](https://github.com/kiva/ui/commit/cff8f544a12702d02d072ecc1599fcebc7428d46))
* solidify prefetch method and data access, guard for missing partnerContentId, add route prop ([dc343d3](https://github.com/kiva/ui/commit/dc343d37bf91d07ab0db7ce2ad756a35aed04091))
* team public id for links ([0abb803](https://github.com/kiva/ui/commit/0abb803527356c1b96682aeb9af67de10f2ce85b))
* teamId should be a number ([97b9563](https://github.com/kiva/ui/commit/97b9563260e31b7f820642ab184bd9643cb9d215))
* use docker file from feature branch ([fc9ef01](https://github.com/kiva/ui/commit/fc9ef01df43dad5a630557f1a6c97311ef4914d8))
* use upload_include to select static assets for upload MP-212 ([f4d0a14](https://github.com/kiva/ui/commit/f4d0a140d643d340be48988bd8b71e642644e025))


### 🏗️ Build System

* correct output directory for uploading MP-212 ([3da55e5](https://github.com/kiva/ui/commit/3da55e5f4794eec281315830d33fcbeaf39125ea))
* switch to use-existing-assets branch for docker image until release ([833f879](https://github.com/kiva/ui/commit/833f879af96df5a3cbdc0bf12c809050c48e36db))
* use main dockerfile ([388b14b](https://github.com/kiva/ui/commit/388b14b5722f638639bb8af980b86918ad3dabf9))


### 🪚 Refactors

* using difference in days ([f398fd0](https://github.com/kiva/ui/commit/f398fd0ba710a6c4324e2ad51d7d3254d9416383))
* using formatDistanceToNowStrict to get days left ([ebca918](https://github.com/kiva/ui/commit/ebca91833e3708b19002a22a181ceb1c43156677))


### 🧹 Chores

* add README for Graphql to help understand our preFetch mechansims ([ef6d6d7](https://github.com/kiva/ui/commit/ef6d6d73a6bc6cd2ee5459e5d74360bd7e4d9774))
* update kv-components ([9f1ff27](https://github.com/kiva/ui/commit/9f1ff2746b6081bf893a1b171ccd349717793490))

## [2.739.2](https://github.com/kiva/ui/compare/v2.739.1...v2.739.2) (2024-05-17)


### 🐛 Bugfixes

* amount lent value ([f19b462](https://github.com/kiva/ui/commit/f19b462121f2a8b681d44f95918aface834fdc36))
* convert amountLent to number ([754b762](https://github.com/kiva/ui/commit/754b76259ba799e824597a4f8ea62bb103ed7f47))


### 🧹 Chores

* **release:** 2.739.2-rc.1 [skip ci] ([3e27938](https://github.com/kiva/ui/commit/3e27938972484509a624104f54d3904f535b2511))

## [2.739.2-rc.1](https://github.com/kiva/ui/compare/v2.739.1...v2.739.2-rc.1) (2024-05-17)


### 🐛 Bugfixes

* amount lent value ([f19b462](https://github.com/kiva/ui/commit/f19b462121f2a8b681d44f95918aface834fdc36))
* convert amountLent to number ([754b762](https://github.com/kiva/ui/commit/754b76259ba799e824597a4f8ea62bb103ed7f47))

## [2.739.1](https://github.com/kiva/ui/compare/v2.739.0...v2.739.1) (2024-05-15)


### 🐛 Bugfixes

* count month days for teams challenge days left ([ff2ce8b](https://github.com/kiva/ui/commit/ff2ce8b119c07aa0c4f2abc46881e4bdf4fc8b2b))
* differenceInDays doesn't count fractional days ([6acff95](https://github.com/kiva/ui/commit/6acff95788d17329697385403951ed8e9d43b91e))


### 🪚 Refactors

* using difference in days ([ee36d54](https://github.com/kiva/ui/commit/ee36d54582cebf8cf0b59735c261f071e36cfffd))
* using formatDistanceToNowStrict to get days left ([c98bf16](https://github.com/kiva/ui/commit/c98bf16ebbe68c935c79221558c96e5407b92847))


### 🧹 Chores

* **release:** 2.739.1-rc.1 [skip ci] ([5918666](https://github.com/kiva/ui/commit/5918666eb82a762434ea52258f6e0f370fa9cc58))

## [2.739.1-rc.1](https://github.com/kiva/ui/compare/v2.739.0...v2.739.1-rc.1) (2024-05-15)


### 🐛 Bugfixes

* count month days for teams challenge days left ([ff2ce8b](https://github.com/kiva/ui/commit/ff2ce8b119c07aa0c4f2abc46881e4bdf4fc8b2b))
* differenceInDays doesn't count fractional days ([6acff95](https://github.com/kiva/ui/commit/6acff95788d17329697385403951ed8e9d43b91e))


### 🪚 Refactors

* using difference in days ([ee36d54](https://github.com/kiva/ui/commit/ee36d54582cebf8cf0b59735c261f071e36cfffd))
* using formatDistanceToNowStrict to get days left ([c98bf16](https://github.com/kiva/ui/commit/c98bf16ebbe68c935c79221558c96e5407b92847))

## [2.739.0](https://github.com/kiva/ui/compare/v2.738.0...v2.739.0) (2024-05-14)


### 🎉 New Features

* assign team to loan in bp ([6866316](https://github.com/kiva/ui/commit/6866316d03e6fad8caebc73943c8f05f24d498a3))


### 🧹 Chores

* **release:** 2.739.0-rc.1 [skip ci] ([50bbd3c](https://github.com/kiva/ui/commit/50bbd3ca85cc0a461039652e4840261b2c4a38df))

## [2.739.0-rc.1](https://github.com/kiva/ui/compare/v2.738.0...v2.739.0-rc.1) (2024-05-14)


### 🎉 New Features

* assign team to loan in bp ([6866316](https://github.com/kiva/ui/commit/6866316d03e6fad8caebc73943c8f05f24d498a3))

## [2.738.0](https://github.com/kiva/ui/compare/v2.737.1...v2.738.0) (2024-05-07)


### 🎉 New Features

* add disclaimer text for deposit incentive experiment MP-176 ([20dc231](https://github.com/kiva/ui/commit/20dc2312c8f8073e29d133a5b316b3cc50cc0202))
* add exp tracking to users that see the deposit incentive banner ([bf97c41](https://github.com/kiva/ui/commit/bf97c4136c7e3bf485728b6c134cab5ecf41b535))
* add progress bar to incentive banner exp ([768cb79](https://github.com/kiva/ui/commit/768cb79edbd3d4430d502d372c10e6db97c6ef41))
* add value options up to 10000 ([ba7ec8d](https://github.com/kiva/ui/commit/ba7ec8d7e8130d9de7b539ea7aefc06cb67dccbe))
* clickable loan card tags added to filter page ([0bda5ea](https://github.com/kiva/ui/commit/0bda5ea7c87649d92916d7344e48604e7b21e5c1))
* deposit incentive banner component and story ([bf4d3d9](https://github.com/kiva/ui/commit/bf4d3d99be54a0c9fb1acf9ba85dc08c0ba2d8c1))
* fid web vital tracking replaced with inp ([#5262](https://github.com/kiva/ui/issues/5262)) ([f82b3de](https://github.com/kiva/ui/commit/f82b3de82e2c1d4a918371972c3b415b92cddeef))
* Forward partnerContentfulPageId setting ([033035a](https://github.com/kiva/ui/commit/033035a11ddf8b35cee0f2d6046cdfece6e2988f))
* forward passwordless setting in ui repo ([de8ac5d](https://github.com/kiva/ui/commit/de8ac5df494b3ddfaf95ce341aac4debf0b30434))
* install dovetail css font include ([68adfd0](https://github.com/kiva/ui/commit/68adfd0f70df3e3d4ca42c83d22442d2a5c57648))
* install latest kv-tokens with new typeface configurations ([5da7ca8](https://github.com/kiva/ui/commit/5da7ca8a8adce1a61152438bf01cdaa4bbc9f3fa))
* live loans powered by flss ([#5261](https://github.com/kiva/ui/issues/5261)) ([36d7af3](https://github.com/kiva/ui/commit/36d7af3a68e3c034a99ac991daf44b89941271f9))
* loan upsell in checkout for deposit incentive experiment MP-95 ([d33b44f](https://github.com/kiva/ui/commit/d33b44fd14674af8eab56bf22109c16ef02225b3))
* move exp query to another hook ([7a1d78d](https://github.com/kiva/ui/commit/7a1d78d3dcc89c818fea1476c8a37274e231f239))
* send uiab experiment assignments in x-uiab header to graphql api ([f673c6b](https://github.com/kiva/ui/commit/f673c6b8ebcad3b7877ead08618e2e9a59750edc))
* show link to borrower application ([196525b](https://github.com/kiva/ui/commit/196525b37568a4dfa64d0bcf06affdcfc33ed495))
* tags and themes data fetched for loans ([#5279](https://github.com/kiva/ui/issues/5279)) ([d825eb9](https://github.com/kiva/ui/commit/d825eb97526941e4bb708fd608d90ea56f179286))


### 🐛 Bugfixes

* add branch name for github-actions ([d9ee401](https://github.com/kiva/ui/commit/d9ee40198da90c5e681df69402553fe7f9a67425))
* add superscript for disclaimer to deposit incentive upsell MP-176 ([5fa2961](https://github.com/kiva/ui/commit/5fa2961fb112052ad65f33ba03a13d1c76a408ff))
* apollo query format error ([9c6f80a](https://github.com/kiva/ui/commit/9c6f80a17293c4fee783b47dee78d7ac1340a60b))
* ensure we keep kv-tokens as a primary dep ([787cf31](https://github.com/kiva/ui/commit/787cf31a6567a2f0b273254b0c4b147e46b6a44e))
* event info ([c60318f](https://github.com/kiva/ui/commit/c60318f992a4cf42853ac43ddb05ee7b83349e8b))
* guest upsell wasn't showing for challenge ([5ee83e5](https://github.com/kiva/ui/commit/5ee83e5b56c13822f7cb1e9c73edf901b71e00e9))
* hold off on checking for new applicant cookie ([79b6406](https://github.com/kiva/ui/commit/79b6406867d1a07bb3a82772e01bce5ced9df9f1))
* lint ([6870718](https://github.com/kiva/ui/commit/6870718e14aa1460b3b523a95a4fe3fbee12f56c))
* move mounted logic to prefetch to set query values ([d77175e](https://github.com/kiva/ui/commit/d77175e74c6167d0eeaeac21e397565b3bff2a8b))
* naming fix ([#5280](https://github.com/kiva/ui/issues/5280)) ([172f9a1](https://github.com/kiva/ui/commit/172f9a124f68fda7e9df4bd53c006d7abfdccba3))
* number formatting issue with promo banner ([f00dfde](https://github.com/kiva/ui/commit/f00dfdea0e3eb80284c28ac543033c92797dd670))
* prefetch query ([88fa7b1](https://github.com/kiva/ui/commit/88fa7b133fea4e24a0aa8700d06a44de70d08263))
* remove watch basket code already handled by apollo plugin ([3dda3f1](https://github.com/kiva/ui/commit/3dda3f1cd1c13b31b778e3eca46e3d13abadfea4))
* resolved issues and extended analytics data ([57a38f4](https://github.com/kiva/ui/commit/57a38f4adbec38289311296a7a4776b5475dca4b))
* shortened partnerContentId field ([17b8540](https://github.com/kiva/ui/commit/17b854072642c484c4305179fcda076bdd5d3eca))
* stop adding uiab header to api calls pending header approval ([c1a8832](https://github.com/kiva/ui/commit/c1a88320c9248bc09fb7f7df5ed5045b79354f61))
* track exp for all users ([4ab7eaf](https://github.com/kiva/ui/commit/4ab7eaf72b28773922ea81b42fe6e71472c866d7))
* tracked down general PAT usage ([d79bb60](https://github.com/kiva/ui/commit/d79bb60ddafcce5ad4fedf50b889f44fb45fc67d))
* try setting token for dependabot PRs ([60bb103](https://github.com/kiva/ui/commit/60bb103842a87637ce2572bb03a588ef91def36d))
* try token fix for title linting ([1ea6601](https://github.com/kiva/ui/commit/1ea660116ae4c1db1d845916425278e71cce8fc4))
* update components for loan card increments ([0da3de6](https://github.com/kiva/ui/commit/0da3de68ed00a8a93e2cc99bc96d89eb19994a6a))
* update kv-tokens with h2 line-height fixes ([dc6dc08](https://github.com/kiva/ui/commit/dc6dc08f72cd83487e457f0ac4f3c15f5bee81e2))
* updated comment ([f0f5e81](https://github.com/kiva/ui/commit/f0f5e814c3d453735e86d42dac9394c8fa614b53))
* updated components package to enable clickable categories in some cases ([6529a1b](https://github.com/kiva/ui/commit/6529a1b0c5b004656cc528357ec634dac89d332e))
* use number instead of string comparison for incentive upsell MP-95 ([fa5113d](https://github.com/kiva/ui/commit/fa5113d78c9f87213eb92b3b5be8e57c935d3c8d))


### 🪚 Refactors

* add exp query to banner query ([13dd3f0](https://github.com/kiva/ui/commit/13dd3f07ad714e06a4a14314179ea3f2bfb5b3db))
* using loanReservationTotal to get basket total ([958cdc5](https://github.com/kiva/ui/commit/958cdc5b330cee5bef24b6248d222966fa738b5c))


### 🧹 Chores

* **deps-dev:** bump @babel/core from 7.15.5 to 7.24.5 ([1869066](https://github.com/kiva/ui/commit/1869066429bbcc8cbead62d0d792fe0a38d0c89c))
* **deps-dev:** bump @babel/preset-env from 7.13.9 to 7.24.5 ([57135e3](https://github.com/kiva/ui/commit/57135e3bafe162d72efb2f707ee9c49e1f513674))
* **deps-dev:** bump postcss from 8.4.6 to 8.4.38 ([e045f36](https://github.com/kiva/ui/commit/e045f3682f3b6ce4fbf1627f675b63df7f4aa9de))
* **deps-dev:** bump semver from 7.3.7 to 7.6.0 ([a4b418d](https://github.com/kiva/ui/commit/a4b418da2693ffb6b373ff4749a3d1e9c63d7728))
* **deps:** bump @babel/traverse from 7.18.6 to 7.24.1 ([55c2310](https://github.com/kiva/ui/commit/55c23100b3a464109fb5538f73c14d7d3e8abd8c))
* **deps:** bump @sideway/formula from 3.0.0 to 3.0.1 ([05cbee4](https://github.com/kiva/ui/commit/05cbee41a671af615bf1c95265208f38ec9102d8))
* **deps:** bump apollo-server-core from 2.21.1 to 2.26.2 ([a13f900](https://github.com/kiva/ui/commit/a13f900e79fefa969bca3767c3fe0f1f053a8170))
* **deps:** bump browserify-sign from 4.2.1 to 4.2.3 ([702c0d2](https://github.com/kiva/ui/commit/702c0d28d0122957587804292d450c8b0b803298))
* **deps:** bump cookiejar from 2.1.2 to 2.1.4 ([ba9aa50](https://github.com/kiva/ui/commit/ba9aa50b122a2680bca4a486f8e13bb80e99fa3b))
* **deps:** bump crypto-js from 4.1.1 to 4.2.0 ([347473d](https://github.com/kiva/ui/commit/347473d51a4c4fd57db19a0683a1dd132164a9f2))
* **deps:** bump decode-uri-component from 0.2.0 to 0.2.2 ([a2e3634](https://github.com/kiva/ui/commit/a2e3634776366305060d2db8ebd2cce33bebce2f))
* **deps:** bump follow-redirects from 1.14.9 to 1.15.6 ([0d9a1a9](https://github.com/kiva/ui/commit/0d9a1a90c45a16b237b96c6757b755f2f92e4340))
* **deps:** bump http-cache-semantics from 4.1.0 to 4.1.1 ([46300f9](https://github.com/kiva/ui/commit/46300f91381be5a7356d2527443a618d5b0900d7))
* **deps:** bump loader-utils from 1.4.1 to 1.4.2 ([244fea8](https://github.com/kiva/ui/commit/244fea81fff9411543b6d3e6d42cab89af782af7))
* **deps:** bump parse-path and @storybook/storybook-deployer ([8d0973f](https://github.com/kiva/ui/commit/8d0973f1dc79e5b0ccf4521f9c1affdfef34fce4))
* **deps:** bump qs from 6.5.2 to 6.5.3 ([c268634](https://github.com/kiva/ui/commit/c2686349f7d58b5d5ed872b625a982c92dbf9039))
* **deps:** bump tar from 6.1.15 to 6.2.1 ([8c16a9c](https://github.com/kiva/ui/commit/8c16a9cd89c53960daea2cd6e348f37859aa714e))
* **deps:** bump word-wrap from 1.2.3 to 1.2.5 ([a6cb775](https://github.com/kiva/ui/commit/a6cb7752ce3ee9a6e93a82390b2b61c6218f0479))
* **release:** 2.738.0-rc.1 [skip ci] ([ebc07b3](https://github.com/kiva/ui/commit/ebc07b35a7c35d80e9d208e62352809a2035701a)), closes [#5262](https://github.com/kiva/ui/issues/5262) [#5261](https://github.com/kiva/ui/issues/5261) [#5279](https://github.com/kiva/ui/issues/5279) [#5280](https://github.com/kiva/ui/issues/5280)
* **release:** 2.738.0-rc.2 [skip ci] ([f66a732](https://github.com/kiva/ui/commit/f66a7325b82a6edba181d4c4ec87a624fabe478a))

## [2.738.0-rc.2](https://github.com/kiva/ui/compare/v2.738.0-rc.1...v2.738.0-rc.2) (2024-05-07)


### 🐛 Bugfixes

* hold off on checking for new applicant cookie ([79b6406](https://github.com/kiva/ui/commit/79b6406867d1a07bb3a82772e01bce5ced9df9f1))

## [2.738.0-rc.1](https://github.com/kiva/ui/compare/v2.737.1...v2.738.0-rc.1) (2024-05-06)


### 🎉 New Features

* add disclaimer text for deposit incentive experiment MP-176 ([20dc231](https://github.com/kiva/ui/commit/20dc2312c8f8073e29d133a5b316b3cc50cc0202))
* add exp tracking to users that see the deposit incentive banner ([bf97c41](https://github.com/kiva/ui/commit/bf97c4136c7e3bf485728b6c134cab5ecf41b535))
* add progress bar to incentive banner exp ([768cb79](https://github.com/kiva/ui/commit/768cb79edbd3d4430d502d372c10e6db97c6ef41))
* add value options up to 10000 ([ba7ec8d](https://github.com/kiva/ui/commit/ba7ec8d7e8130d9de7b539ea7aefc06cb67dccbe))
* clickable loan card tags added to filter page ([0bda5ea](https://github.com/kiva/ui/commit/0bda5ea7c87649d92916d7344e48604e7b21e5c1))
* deposit incentive banner component and story ([bf4d3d9](https://github.com/kiva/ui/commit/bf4d3d99be54a0c9fb1acf9ba85dc08c0ba2d8c1))
* fid web vital tracking replaced with inp ([#5262](https://github.com/kiva/ui/issues/5262)) ([f82b3de](https://github.com/kiva/ui/commit/f82b3de82e2c1d4a918371972c3b415b92cddeef))
* Forward partnerContentfulPageId setting ([033035a](https://github.com/kiva/ui/commit/033035a11ddf8b35cee0f2d6046cdfece6e2988f))
* forward passwordless setting in ui repo ([de8ac5d](https://github.com/kiva/ui/commit/de8ac5df494b3ddfaf95ce341aac4debf0b30434))
* install dovetail css font include ([68adfd0](https://github.com/kiva/ui/commit/68adfd0f70df3e3d4ca42c83d22442d2a5c57648))
* install latest kv-tokens with new typeface configurations ([5da7ca8](https://github.com/kiva/ui/commit/5da7ca8a8adce1a61152438bf01cdaa4bbc9f3fa))
* live loans powered by flss ([#5261](https://github.com/kiva/ui/issues/5261)) ([36d7af3](https://github.com/kiva/ui/commit/36d7af3a68e3c034a99ac991daf44b89941271f9))
* loan upsell in checkout for deposit incentive experiment MP-95 ([d33b44f](https://github.com/kiva/ui/commit/d33b44fd14674af8eab56bf22109c16ef02225b3))
* move exp query to another hook ([7a1d78d](https://github.com/kiva/ui/commit/7a1d78d3dcc89c818fea1476c8a37274e231f239))
* send uiab experiment assignments in x-uiab header to graphql api ([f673c6b](https://github.com/kiva/ui/commit/f673c6b8ebcad3b7877ead08618e2e9a59750edc))
* show link to borrower application ([196525b](https://github.com/kiva/ui/commit/196525b37568a4dfa64d0bcf06affdcfc33ed495))
* tags and themes data fetched for loans ([#5279](https://github.com/kiva/ui/issues/5279)) ([d825eb9](https://github.com/kiva/ui/commit/d825eb97526941e4bb708fd608d90ea56f179286))


### 🐛 Bugfixes

* add branch name for github-actions ([d9ee401](https://github.com/kiva/ui/commit/d9ee40198da90c5e681df69402553fe7f9a67425))
* add superscript for disclaimer to deposit incentive upsell MP-176 ([5fa2961](https://github.com/kiva/ui/commit/5fa2961fb112052ad65f33ba03a13d1c76a408ff))
* apollo query format error ([9c6f80a](https://github.com/kiva/ui/commit/9c6f80a17293c4fee783b47dee78d7ac1340a60b))
* ensure we keep kv-tokens as a primary dep ([787cf31](https://github.com/kiva/ui/commit/787cf31a6567a2f0b273254b0c4b147e46b6a44e))
* event info ([c60318f](https://github.com/kiva/ui/commit/c60318f992a4cf42853ac43ddb05ee7b83349e8b))
* guest upsell wasn't showing for challenge ([5ee83e5](https://github.com/kiva/ui/commit/5ee83e5b56c13822f7cb1e9c73edf901b71e00e9))
* lint ([6870718](https://github.com/kiva/ui/commit/6870718e14aa1460b3b523a95a4fe3fbee12f56c))
* move mounted logic to prefetch to set query values ([d77175e](https://github.com/kiva/ui/commit/d77175e74c6167d0eeaeac21e397565b3bff2a8b))
* naming fix ([#5280](https://github.com/kiva/ui/issues/5280)) ([172f9a1](https://github.com/kiva/ui/commit/172f9a124f68fda7e9df4bd53c006d7abfdccba3))
* number formatting issue with promo banner ([f00dfde](https://github.com/kiva/ui/commit/f00dfdea0e3eb80284c28ac543033c92797dd670))
* prefetch query ([88fa7b1](https://github.com/kiva/ui/commit/88fa7b133fea4e24a0aa8700d06a44de70d08263))
* remove watch basket code already handled by apollo plugin ([3dda3f1](https://github.com/kiva/ui/commit/3dda3f1cd1c13b31b778e3eca46e3d13abadfea4))
* resolved issues and extended analytics data ([57a38f4](https://github.com/kiva/ui/commit/57a38f4adbec38289311296a7a4776b5475dca4b))
* shortened partnerContentId field ([17b8540](https://github.com/kiva/ui/commit/17b854072642c484c4305179fcda076bdd5d3eca))
* stop adding uiab header to api calls pending header approval ([c1a8832](https://github.com/kiva/ui/commit/c1a88320c9248bc09fb7f7df5ed5045b79354f61))
* track exp for all users ([4ab7eaf](https://github.com/kiva/ui/commit/4ab7eaf72b28773922ea81b42fe6e71472c866d7))
* tracked down general PAT usage ([d79bb60](https://github.com/kiva/ui/commit/d79bb60ddafcce5ad4fedf50b889f44fb45fc67d))
* try setting token for dependabot PRs ([60bb103](https://github.com/kiva/ui/commit/60bb103842a87637ce2572bb03a588ef91def36d))
* try token fix for title linting ([1ea6601](https://github.com/kiva/ui/commit/1ea660116ae4c1db1d845916425278e71cce8fc4))
* update components for loan card increments ([0da3de6](https://github.com/kiva/ui/commit/0da3de68ed00a8a93e2cc99bc96d89eb19994a6a))
* update kv-tokens with h2 line-height fixes ([dc6dc08](https://github.com/kiva/ui/commit/dc6dc08f72cd83487e457f0ac4f3c15f5bee81e2))
* updated comment ([f0f5e81](https://github.com/kiva/ui/commit/f0f5e814c3d453735e86d42dac9394c8fa614b53))
* updated components package to enable clickable categories in some cases ([6529a1b](https://github.com/kiva/ui/commit/6529a1b0c5b004656cc528357ec634dac89d332e))
* use number instead of string comparison for incentive upsell MP-95 ([fa5113d](https://github.com/kiva/ui/commit/fa5113d78c9f87213eb92b3b5be8e57c935d3c8d))


### 🪚 Refactors

* add exp query to banner query ([13dd3f0](https://github.com/kiva/ui/commit/13dd3f07ad714e06a4a14314179ea3f2bfb5b3db))
* using loanReservationTotal to get basket total ([958cdc5](https://github.com/kiva/ui/commit/958cdc5b330cee5bef24b6248d222966fa738b5c))


### 🧹 Chores

* **deps-dev:** bump @babel/core from 7.15.5 to 7.24.5 ([1869066](https://github.com/kiva/ui/commit/1869066429bbcc8cbead62d0d792fe0a38d0c89c))
* **deps-dev:** bump @babel/preset-env from 7.13.9 to 7.24.5 ([57135e3](https://github.com/kiva/ui/commit/57135e3bafe162d72efb2f707ee9c49e1f513674))
* **deps-dev:** bump postcss from 8.4.6 to 8.4.38 ([e045f36](https://github.com/kiva/ui/commit/e045f3682f3b6ce4fbf1627f675b63df7f4aa9de))
* **deps-dev:** bump semver from 7.3.7 to 7.6.0 ([a4b418d](https://github.com/kiva/ui/commit/a4b418da2693ffb6b373ff4749a3d1e9c63d7728))
* **deps:** bump @babel/traverse from 7.18.6 to 7.24.1 ([55c2310](https://github.com/kiva/ui/commit/55c23100b3a464109fb5538f73c14d7d3e8abd8c))
* **deps:** bump @sideway/formula from 3.0.0 to 3.0.1 ([05cbee4](https://github.com/kiva/ui/commit/05cbee41a671af615bf1c95265208f38ec9102d8))
* **deps:** bump apollo-server-core from 2.21.1 to 2.26.2 ([a13f900](https://github.com/kiva/ui/commit/a13f900e79fefa969bca3767c3fe0f1f053a8170))
* **deps:** bump browserify-sign from 4.2.1 to 4.2.3 ([702c0d2](https://github.com/kiva/ui/commit/702c0d28d0122957587804292d450c8b0b803298))
* **deps:** bump cookiejar from 2.1.2 to 2.1.4 ([ba9aa50](https://github.com/kiva/ui/commit/ba9aa50b122a2680bca4a486f8e13bb80e99fa3b))
* **deps:** bump crypto-js from 4.1.1 to 4.2.0 ([347473d](https://github.com/kiva/ui/commit/347473d51a4c4fd57db19a0683a1dd132164a9f2))
* **deps:** bump decode-uri-component from 0.2.0 to 0.2.2 ([a2e3634](https://github.com/kiva/ui/commit/a2e3634776366305060d2db8ebd2cce33bebce2f))
* **deps:** bump follow-redirects from 1.14.9 to 1.15.6 ([0d9a1a9](https://github.com/kiva/ui/commit/0d9a1a90c45a16b237b96c6757b755f2f92e4340))
* **deps:** bump http-cache-semantics from 4.1.0 to 4.1.1 ([46300f9](https://github.com/kiva/ui/commit/46300f91381be5a7356d2527443a618d5b0900d7))
* **deps:** bump loader-utils from 1.4.1 to 1.4.2 ([244fea8](https://github.com/kiva/ui/commit/244fea81fff9411543b6d3e6d42cab89af782af7))
* **deps:** bump parse-path and @storybook/storybook-deployer ([8d0973f](https://github.com/kiva/ui/commit/8d0973f1dc79e5b0ccf4521f9c1affdfef34fce4))
* **deps:** bump qs from 6.5.2 to 6.5.3 ([c268634](https://github.com/kiva/ui/commit/c2686349f7d58b5d5ed872b625a982c92dbf9039))
* **deps:** bump tar from 6.1.15 to 6.2.1 ([8c16a9c](https://github.com/kiva/ui/commit/8c16a9cd89c53960daea2cd6e348f37859aa714e))
* **deps:** bump word-wrap from 1.2.3 to 1.2.5 ([a6cb775](https://github.com/kiva/ui/commit/a6cb7752ce3ee9a6e93a82390b2b61c6218f0479))

## [2.737.1](https://github.com/kiva/ui/compare/v2.737.0...v2.737.1) (2024-05-01)


### 🐛 Bugfixes

* stop adding uiab header to api calls pending header approval ([62cb72f](https://github.com/kiva/ui/commit/62cb72f10699f157b9bce0d702a19029fd265bb0))


### 🧹 Chores

* **release:** 2.737.1-rc.1 [skip ci] ([34498aa](https://github.com/kiva/ui/commit/34498aac913f2e26091359d25bc20c19388bb0a2))

## [2.737.1-rc.1](https://github.com/kiva/ui/compare/v2.737.0...v2.737.1-rc.1) (2024-05-01)


### 🐛 Bugfixes

* stop adding uiab header to api calls pending header approval ([62cb72f](https://github.com/kiva/ui/commit/62cb72f10699f157b9bce0d702a19029fd265bb0))

## [2.737.0](https://github.com/kiva/ui/compare/v2.736.0...v2.737.0) (2024-05-01)


### 🎉 New Features

* add disclaimer text for deposit incentive experiment MP-176 ([bcc18dd](https://github.com/kiva/ui/commit/bcc18dd9d65ee90385b4d57fc5ac1b1f63b06b7f))
* deposit incentive banner component and story ([ee62c97](https://github.com/kiva/ui/commit/ee62c97d6a555e4064a939d91683c71ceb8cd941))
* loan upsell in checkout for deposit incentive experiment MP-95 ([f439b99](https://github.com/kiva/ui/commit/f439b99d994cd59ce7a6e85ba27bc47b246c0c34))
* move exp query to another hook ([3be1cf2](https://github.com/kiva/ui/commit/3be1cf2bd84520ff9dbe94b872ea9743d9ddf6c2))
* send uiab experiment assignments in x-uiab header to graphql api ([1c3e046](https://github.com/kiva/ui/commit/1c3e0469ab51a18f371b4f11c6db3a51c349cf57))


### 🐛 Bugfixes

* add superscript for disclaimer to deposit incentive upsell MP-176 ([9ae4e1d](https://github.com/kiva/ui/commit/9ae4e1d45a79fe084690ef67e16fa59b9e5b1fe4))
* apollo query format error ([d0cbf4d](https://github.com/kiva/ui/commit/d0cbf4dab0463a9595ec413c5ce93e8d58bcae92))
* move mounted logic to prefetch to set query values ([a3a6e67](https://github.com/kiva/ui/commit/a3a6e67440c965699e3898389a5eedd74db2c55c))
* prefetch query ([3841df6](https://github.com/kiva/ui/commit/3841df64c6ebc04bc93940279e08410f6b9becb7))
* use number instead of string comparison for incentive upsell MP-95 ([cf810f5](https://github.com/kiva/ui/commit/cf810f5f531651b6ec2c4abdd4dcaa4b3533e51c))


### 🪚 Refactors

* add exp query to banner query ([50a817b](https://github.com/kiva/ui/commit/50a817ba3849d8e31cc878988fd7608ead75437b))


### 🧹 Chores

* **release:** 2.737.0-rc.1 [skip ci] ([84752a9](https://github.com/kiva/ui/commit/84752a982d6cfb0c3afe825fe79508dd5853adff))

## [2.737.0-rc.1](https://github.com/kiva/ui/compare/v2.736.0...v2.737.0-rc.1) (2024-05-01)


### 🎉 New Features

* add disclaimer text for deposit incentive experiment MP-176 ([bcc18dd](https://github.com/kiva/ui/commit/bcc18dd9d65ee90385b4d57fc5ac1b1f63b06b7f))
* deposit incentive banner component and story ([ee62c97](https://github.com/kiva/ui/commit/ee62c97d6a555e4064a939d91683c71ceb8cd941))
* loan upsell in checkout for deposit incentive experiment MP-95 ([f439b99](https://github.com/kiva/ui/commit/f439b99d994cd59ce7a6e85ba27bc47b246c0c34))
* move exp query to another hook ([3be1cf2](https://github.com/kiva/ui/commit/3be1cf2bd84520ff9dbe94b872ea9743d9ddf6c2))
* send uiab experiment assignments in x-uiab header to graphql api ([1c3e046](https://github.com/kiva/ui/commit/1c3e0469ab51a18f371b4f11c6db3a51c349cf57))


### 🐛 Bugfixes

* add superscript for disclaimer to deposit incentive upsell MP-176 ([9ae4e1d](https://github.com/kiva/ui/commit/9ae4e1d45a79fe084690ef67e16fa59b9e5b1fe4))
* apollo query format error ([d0cbf4d](https://github.com/kiva/ui/commit/d0cbf4dab0463a9595ec413c5ce93e8d58bcae92))
* move mounted logic to prefetch to set query values ([a3a6e67](https://github.com/kiva/ui/commit/a3a6e67440c965699e3898389a5eedd74db2c55c))
* prefetch query ([3841df6](https://github.com/kiva/ui/commit/3841df64c6ebc04bc93940279e08410f6b9becb7))
* use number instead of string comparison for incentive upsell MP-95 ([cf810f5](https://github.com/kiva/ui/commit/cf810f5f531651b6ec2c4abdd4dcaa4b3533e51c))


### 🪚 Refactors

* add exp query to banner query ([50a817b](https://github.com/kiva/ui/commit/50a817ba3849d8e31cc878988fd7608ead75437b))

## [2.736.0](https://github.com/kiva/ui/compare/v2.735.0...v2.736.0) (2024-04-22)


### 🎉 New Features

* add teamId as a prop in challenge bubble ([6cbf338](https://github.com/kiva/ui/commit/6cbf338c572d67c799601b6c1504a04643c1866d))
* add tracking events to callout and invite ([f22dd1c](https://github.com/kiva/ui/commit/f22dd1cbca99d75b568b2b690965c349876f3d8f))
* dropdown huge lend amount enabled for logged in users ([#5247](https://github.com/kiva/ui/issues/5247)) ([b7827a8](https://github.com/kiva/ui/commit/b7827a88769f357dd08dd533e742a95d91c85f25))
* goal mixin updated ([#5253](https://github.com/kiva/ui/issues/5253)) ([244cc72](https://github.com/kiva/ui/commit/244cc72250bad6c078abad47f195c2baada1148e))
* make challenge bubble dismissable ([8d33fd6](https://github.com/kiva/ui/commit/8d33fd6e007fc78d3b7bbef0e6a2aa390f806498))
* move challenge data to mounted in bp ([3f495d5](https://github.com/kiva/ui/commit/3f495d5d8a1e70a4959ac829f190de8aae533836))
* persist add to basket in challenge callout component ([dae98b1](https://github.com/kiva/ui/commit/dae98b17a85e04c6306f2356cc5f412aa6bbc2fb))
* place callout on top of borrower profile ([e6fcec9](https://github.com/kiva/ui/commit/e6fcec91b40db3fd63b6b470058af360c70ecb98))
* remove active login check at checkout MP-87 ([bb45bfa](https://github.com/kiva/ui/commit/bb45bfaecb17cb66f313fd9c080b00c6816e054b))
* remove active login check from cc landing pages MP-87 ([57a9a69](https://github.com/kiva/ui/commit/57a9a69cf3a7db676e1a0a3425c2c942d265dbbb))
* separate challenge lend filter and borrower profile components ([36c7588](https://github.com/kiva/ui/commit/36c7588c0819d3efdb5b0d68be429fab7f3964cb))
* sticky tooltip on lend filter and copy change ([73f125f](https://github.com/kiva/ui/commit/73f125f243e46f2fd25fcd038c41ccc6a047fc78))
* team picks panel copy updated ([#5248](https://github.com/kiva/ui/issues/5248)) ([e45302e](https://github.com/kiva/ui/commit/e45302e334ff933b3aef69b5b56c75ca6e8b9591))
* teams challenge header updates ([#5252](https://github.com/kiva/ui/issues/5252)) ([4129ff0](https://github.com/kiva/ui/commit/4129ff03f88e6ca1a187adba13435e9a8091f8ba))
* use default invite url ([136a6d1](https://github.com/kiva/ui/commit/136a6d1a9b3269a9849062adb20ce8672e56020b))
* use toast for bp callout ([e25c8df](https://github.com/kiva/ui/commit/e25c8df5b8081c725b56c090c88e6087703ae29c))
* using KvToast to handle adding to cart on lend filter ([08ab7ce](https://github.com/kiva/ui/commit/08ab7cec2f263a3278570612c446690d6c14a723))


### 🐛 Bugfixes

* add no wrap class only when there are goal participants and borrowerName exists ([6d840dc](https://github.com/kiva/ui/commit/6d840dce3e7d5971f0424ae32106ec09009785cb))
* align avatars to center ([2c07dad](https://github.com/kiva/ui/commit/2c07dad171d0c64794a4a527d290ddebbb5a1808))
* default message for no participants ([d06cd0c](https://github.com/kiva/ui/commit/d06cd0c828e410959c8e2240db8edc653acd8c94))
* default publicId ([25cfe24](https://github.com/kiva/ui/commit/25cfe24b4162f7bf16d434ca548f7b585a1aa3c6))
* event standard ([856c545](https://github.com/kiva/ui/commit/856c5453f2c4608c8246995eea812a39134cb4b1))
* hiding borrower name when only 1 participant ([09e8980](https://github.com/kiva/ui/commit/09e8980827d0a1f701ac0763005e8c0604b0fbd1))
* lint ([894bf72](https://github.com/kiva/ui/commit/894bf72d1acd5c34980396d4fc7907d35d9fdaab))
* missing ID from previous work ([b5c15c3](https://github.com/kiva/ui/commit/b5c15c3c0cd6f8db7255f0aaf5dbc7556f60ef0f))
* only show tip message if the message has content ([fd3f05b](https://github.com/kiva/ui/commit/fd3f05b12003c0c1b464799334b1b6447387002c))
* padding within callout component ([5a9a330](https://github.com/kiva/ui/commit/5a9a3306ef4e7b0335845e846ae872c92ff9c021))
* remove lender condition to make default callout message appear ([cc52758](https://github.com/kiva/ui/commit/cc5275809add06d2fd932fa7196c641cc9991cc8))
* remove log ([be489c4](https://github.com/kiva/ui/commit/be489c4231593b54d75cae7ddd2b39f9d539af33))
* remove promise.all and validate empty object for teamData ([d625752](https://github.com/kiva/ui/commit/d625752107259a86c07171e24934046c3ae67eb2))
* remove readQuery trycatch and unnecessary then statement on preFetch ([164e3ae](https://github.com/kiva/ui/commit/164e3ae9f13326687c5cb6e655b338234ea0e194))
* remove teamPublicId from promise ([c09057b](https://github.com/kiva/ui/commit/c09057b6d204453c0cfe4b4a75dd5ccb34154d43))
* show add to cart bubble when loan is added to basket ([15cec8d](https://github.com/kiva/ui/commit/15cec8d8c4bfa92efc0650096fda8ab8e5451e84))
* slightly safer solution ([60f079b](https://github.com/kiva/ui/commit/60f079b5491e7a4fac5326a72209f481c89cfac9))
* team invite tests ([5e426bb](https://github.com/kiva/ui/commit/5e426bba306e600b2a1be489a3cfb2c79b7328a7))
* teamLink and revert lendCta component ([bd6a07c](https://github.com/kiva/ui/commit/bd6a07c4d8e0d7344058b9eea3fe36c9f3e2038b))
* tests ([e6f4aef](https://github.com/kiva/ui/commit/e6f4aefc2a00887b67e4f6c31c73749925eb06f1))
* tests ([9057e66](https://github.com/kiva/ui/commit/9057e66dcb022a7df4b8395473c6d239aa9f681a))
* toast design ([43903b7](https://github.com/kiva/ui/commit/43903b71f384fdcb5b5b17ad07ec56d0224676f9))
* update test to handle toast ([7c10b44](https://github.com/kiva/ui/commit/7c10b4428633e3bcc2a15339d86e4978e94558ea))


### 🪚 Refactors

* keep code just for notification bubble ([3e2189e](https://github.com/kiva/ui/commit/3e2189e7fc275f830b26a352d8f649e6b7fca0af))
* new component to handle bp callout ([3d243f9](https://github.com/kiva/ui/commit/3d243f94ba37dd29d07590da41231204b57f1bab))


### 🧹 Chores

* **release:** 2.736.0-rc.1 [skip ci] ([5fd78e6](https://github.com/kiva/ui/commit/5fd78e6fa6783da210cad266a74e7c50fb415b79)), closes [#5247](https://github.com/kiva/ui/issues/5247) [#5253](https://github.com/kiva/ui/issues/5253) [#5248](https://github.com/kiva/ui/issues/5248) [#5252](https://github.com/kiva/ui/issues/5252)

## [2.736.0-rc.1](https://github.com/kiva/ui/compare/v2.735.0...v2.736.0-rc.1) (2024-04-22)


### 🎉 New Features

* add teamId as a prop in challenge bubble ([6cbf338](https://github.com/kiva/ui/commit/6cbf338c572d67c799601b6c1504a04643c1866d))
* add tracking events to callout and invite ([f22dd1c](https://github.com/kiva/ui/commit/f22dd1cbca99d75b568b2b690965c349876f3d8f))
* dropdown huge lend amount enabled for logged in users ([#5247](https://github.com/kiva/ui/issues/5247)) ([b7827a8](https://github.com/kiva/ui/commit/b7827a88769f357dd08dd533e742a95d91c85f25))
* goal mixin updated ([#5253](https://github.com/kiva/ui/issues/5253)) ([244cc72](https://github.com/kiva/ui/commit/244cc72250bad6c078abad47f195c2baada1148e))
* make challenge bubble dismissable ([8d33fd6](https://github.com/kiva/ui/commit/8d33fd6e007fc78d3b7bbef0e6a2aa390f806498))
* move challenge data to mounted in bp ([3f495d5](https://github.com/kiva/ui/commit/3f495d5d8a1e70a4959ac829f190de8aae533836))
* persist add to basket in challenge callout component ([dae98b1](https://github.com/kiva/ui/commit/dae98b17a85e04c6306f2356cc5f412aa6bbc2fb))
* place callout on top of borrower profile ([e6fcec9](https://github.com/kiva/ui/commit/e6fcec91b40db3fd63b6b470058af360c70ecb98))
* remove active login check at checkout MP-87 ([bb45bfa](https://github.com/kiva/ui/commit/bb45bfaecb17cb66f313fd9c080b00c6816e054b))
* remove active login check from cc landing pages MP-87 ([57a9a69](https://github.com/kiva/ui/commit/57a9a69cf3a7db676e1a0a3425c2c942d265dbbb))
* separate challenge lend filter and borrower profile components ([36c7588](https://github.com/kiva/ui/commit/36c7588c0819d3efdb5b0d68be429fab7f3964cb))
* sticky tooltip on lend filter and copy change ([73f125f](https://github.com/kiva/ui/commit/73f125f243e46f2fd25fcd038c41ccc6a047fc78))
* team picks panel copy updated ([#5248](https://github.com/kiva/ui/issues/5248)) ([e45302e](https://github.com/kiva/ui/commit/e45302e334ff933b3aef69b5b56c75ca6e8b9591))
* teams challenge header updates ([#5252](https://github.com/kiva/ui/issues/5252)) ([4129ff0](https://github.com/kiva/ui/commit/4129ff03f88e6ca1a187adba13435e9a8091f8ba))
* use default invite url ([136a6d1](https://github.com/kiva/ui/commit/136a6d1a9b3269a9849062adb20ce8672e56020b))
* use toast for bp callout ([e25c8df](https://github.com/kiva/ui/commit/e25c8df5b8081c725b56c090c88e6087703ae29c))
* using KvToast to handle adding to cart on lend filter ([08ab7ce](https://github.com/kiva/ui/commit/08ab7cec2f263a3278570612c446690d6c14a723))


### 🐛 Bugfixes

* add no wrap class only when there are goal participants and borrowerName exists ([6d840dc](https://github.com/kiva/ui/commit/6d840dce3e7d5971f0424ae32106ec09009785cb))
* align avatars to center ([2c07dad](https://github.com/kiva/ui/commit/2c07dad171d0c64794a4a527d290ddebbb5a1808))
* default message for no participants ([d06cd0c](https://github.com/kiva/ui/commit/d06cd0c828e410959c8e2240db8edc653acd8c94))
* default publicId ([25cfe24](https://github.com/kiva/ui/commit/25cfe24b4162f7bf16d434ca548f7b585a1aa3c6))
* event standard ([856c545](https://github.com/kiva/ui/commit/856c5453f2c4608c8246995eea812a39134cb4b1))
* hiding borrower name when only 1 participant ([09e8980](https://github.com/kiva/ui/commit/09e8980827d0a1f701ac0763005e8c0604b0fbd1))
* lint ([894bf72](https://github.com/kiva/ui/commit/894bf72d1acd5c34980396d4fc7907d35d9fdaab))
* missing ID from previous work ([b5c15c3](https://github.com/kiva/ui/commit/b5c15c3c0cd6f8db7255f0aaf5dbc7556f60ef0f))
* only show tip message if the message has content ([fd3f05b](https://github.com/kiva/ui/commit/fd3f05b12003c0c1b464799334b1b6447387002c))
* padding within callout component ([5a9a330](https://github.com/kiva/ui/commit/5a9a3306ef4e7b0335845e846ae872c92ff9c021))
* remove lender condition to make default callout message appear ([cc52758](https://github.com/kiva/ui/commit/cc5275809add06d2fd932fa7196c641cc9991cc8))
* remove log ([be489c4](https://github.com/kiva/ui/commit/be489c4231593b54d75cae7ddd2b39f9d539af33))
* remove promise.all and validate empty object for teamData ([d625752](https://github.com/kiva/ui/commit/d625752107259a86c07171e24934046c3ae67eb2))
* remove readQuery trycatch and unnecessary then statement on preFetch ([164e3ae](https://github.com/kiva/ui/commit/164e3ae9f13326687c5cb6e655b338234ea0e194))
* remove teamPublicId from promise ([c09057b](https://github.com/kiva/ui/commit/c09057b6d204453c0cfe4b4a75dd5ccb34154d43))
* show add to cart bubble when loan is added to basket ([15cec8d](https://github.com/kiva/ui/commit/15cec8d8c4bfa92efc0650096fda8ab8e5451e84))
* slightly safer solution ([60f079b](https://github.com/kiva/ui/commit/60f079b5491e7a4fac5326a72209f481c89cfac9))
* team invite tests ([5e426bb](https://github.com/kiva/ui/commit/5e426bba306e600b2a1be489a3cfb2c79b7328a7))
* teamLink and revert lendCta component ([bd6a07c](https://github.com/kiva/ui/commit/bd6a07c4d8e0d7344058b9eea3fe36c9f3e2038b))
* tests ([e6f4aef](https://github.com/kiva/ui/commit/e6f4aefc2a00887b67e4f6c31c73749925eb06f1))
* tests ([9057e66](https://github.com/kiva/ui/commit/9057e66dcb022a7df4b8395473c6d239aa9f681a))
* toast design ([43903b7](https://github.com/kiva/ui/commit/43903b71f384fdcb5b5b17ad07ec56d0224676f9))
* update test to handle toast ([7c10b44](https://github.com/kiva/ui/commit/7c10b4428633e3bcc2a15339d86e4978e94558ea))


### 🪚 Refactors

* keep code just for notification bubble ([3e2189e](https://github.com/kiva/ui/commit/3e2189e7fc275f830b26a352d8f649e6b7fca0af))
* new component to handle bp callout ([3d243f9](https://github.com/kiva/ui/commit/3d243f94ba37dd29d07590da41231204b57f1bab))

## [2.735.0](https://github.com/kiva/ui/compare/v2.734.0...v2.735.0) (2024-04-08)


### 🎉 New Features

* 1 dollar bet modal removed in checkout page ([#5178](https://github.com/kiva/ui/issues/5178)) ([79c0d8a](https://github.com/kiva/ui/commit/79c0d8aec03dded204ee9d7ada82c52370a953e6))
* activity feed added to challenge header on filters page ([#5220](https://github.com/kiva/ui/issues/5220)) ([d42cf9b](https://github.com/kiva/ui/commit/d42cf9b441a3ae5fe8309ab30e4f78b1e9a91007))
* activity feed showed in loan cards on team picks case ([8253211](https://github.com/kiva/ui/commit/8253211815076ebe47b21a9349f944e58bf4708b))
* add basket total to header for large baskets ([2ca002c](https://github.com/kiva/ui/commit/2ca002ce0b858e5666d45937a505c5e0e7854865))
* add fade out to activity feed on challenge header ([cad0fc2](https://github.com/kiva/ui/commit/cad0fc2ded3f41f2dcd11fc748ac81bf19500e15))
* add track event to team toggle filter ([9d3824f](https://github.com/kiva/ui/commit/9d3824f6d8a81ca2b387f3c7068cbd6e06816a0f))
* adjust may challenge thanks page ([98d1c44](https://github.com/kiva/ui/commit/98d1c44a332b2b25bf79a88c5842a471b6962e17))
* challenge header participation avatars added ([#5221](https://github.com/kiva/ui/issues/5221)) ([e406f5e](https://github.com/kiva/ui/commit/e406f5e4147f52d5b65342b96089fdefa70e5ff3))
* emit tracking event when progress bar shows ([0646fa0](https://github.com/kiva/ui/commit/0646fa02a91d702ea0a936dbcfbdf20f24e1b400))
* experiment tracking events updated ([64823a9](https://github.com/kiva/ui/commit/64823a951c5ed80c590843276e62782e65f3e7af))
* header showed for active user team challenge ([7d8ad19](https://github.com/kiva/ui/commit/7d8ad1918d147fe4202ef37fd7386ade6cf70014))
* hiding save search for keyword and loan funding type filters ([c79bf0c](https://github.com/kiva/ui/commit/c79bf0c93eee87bbb2eaf0288c65c79232eb9385))
* kv components updated ([#5216](https://github.com/kiva/ui/issues/5216)) ([a9188a6](https://github.com/kiva/ui/commit/a9188a677e07ac4af3e24ee7ae51faa2edc314c1))
* loan search challenge header added to storybook ([#5223](https://github.com/kiva/ui/issues/5223)) ([b8cac4c](https://github.com/kiva/ui/commit/b8cac4ce8a5479959763559315d5ed50da2971e2))
* set combined activities ([84d55ae](https://github.com/kiva/ui/commit/84d55aee4eb19b99bfff455157a26aa7b3a3f2e3))
* setup challenge callout component ([52eb883](https://github.com/kiva/ui/commit/52eb883d9bb5d5fe60aca8cedb427ac60e6e6c71))
* shared method added to get user challenge ([e3939cb](https://github.com/kiva/ui/commit/e3939cbeba6d57b617d2ba81f612f8b182e8d423))
* show "added to cart" message for lend filter challenge ([5b98f53](https://github.com/kiva/ui/commit/5b98f53a975b7e2299345d0f0a8cbc42f1edb8e5))
* show correct progress for new challenge type on filter and thanks pages ([4f49a4a](https://github.com/kiva/ui/commit/4f49a4ac19d356fd973b03026388e3d6b610e9e3))
* team picks loans showed on filter page ([#5229](https://github.com/kiva/ui/issues/5229)) ([d460354](https://github.com/kiva/ui/commit/d460354845219810901356b5faae156133b4f557))
* team picks unchecked by default on filter page ([43a6d52](https://github.com/kiva/ui/commit/43a6d52d506c43314253383a44280b3dc9dc6383))
* team query params added to filtering query params ([c19f1a5](https://github.com/kiva/ui/commit/c19f1a5909fcba7e05ed4a8971344641ab2e4c35))
* team query params added to filtering query params ([#5225](https://github.com/kiva/ui/issues/5225)) ([7f57621](https://github.com/kiva/ui/commit/7f57621d6c3f5bd10a62f0e2a68ffa3a314405f3))
* track when challenge header appears on ty page ([d25dd04](https://github.com/kiva/ui/commit/d25dd048b8ae362acf666fb20e63bdd03bdf78e2))


### 🐛 Bugfixes

* adjust tests for shared avatar component ([45b27d0](https://github.com/kiva/ui/commit/45b27d04a9c50f44fff225d202413973bccb395c))
* adjust visibility for different use cases ([46e8c2d](https://github.com/kiva/ui/commit/46e8c2d6b9b5e24e51af804f6238d3cd461f89b0))
* component container bg ([9e0c97c](https://github.com/kiva/ui/commit/9e0c97c1cd735946f7941534189a1d7e83520db3))
* copyUrl calling getFullUrl twice and mixing up different params ([b4e4a33](https://github.com/kiva/ui/commit/b4e4a33a377f543cd783f9c2e25f8831a2d764bf))
* event sending goal name ([ed06d32](https://github.com/kiva/ui/commit/ed06d326fa4754351e2ad48c534b4c61db867b06))
* hide share challenge if no attributed team ([490c3e0](https://github.com/kiva/ui/commit/490c3e08069b8664588afad7b63f9bf075ac321b))
* lint ([73b6f18](https://github.com/kiva/ui/commit/73b6f1826d6490c112feeca8bca64b3adab05bff))
* lint and remove unnecessary gradient def for lg screen ([8bb007f](https://github.com/kiva/ui/commit/8bb007f9d6c9455c1c2dbf334418a660482fc7f8))
* missing optional chaining ([ebc1093](https://github.com/kiva/ui/commit/ebc1093f24e00413a49793966e30ebde18b67c01))
* padding on callout container ([4ae63ce](https://github.com/kiva/ui/commit/4ae63ce66cf587a03e3e797fb011cfbe18a04920))
* pr comments tweaks ([e01fd6c](https://github.com/kiva/ui/commit/e01fd6c546479b41858680b35b33df5bcf87abdd))
* progress bar for new challenge not complete full height ([cd246a3](https://github.com/kiva/ui/commit/cd246a39802321bdfa81f11319eef31746ee9203))
* remove nextTick ([13aa374](https://github.com/kiva/ui/commit/13aa37430afa82d66e28bf3c4f579b86bb6f04ed))
* remove test that's no longer needed ([e79c6b6](https://github.com/kiva/ui/commit/e79c6b678dd8298899b00cc1e61f7b8e896d4656))
* remove unnecessary comment ([e6f4a79](https://github.com/kiva/ui/commit/e6f4a79d17599d85171c8f045ded29e66cde5cb6))
* remove unnecessary share flag ([36721be](https://github.com/kiva/ui/commit/36721be377d91b0b6c99d43f8eca61c73e085f90))
* revert changes for challenge header and apply them in ShareChallenge component ([f7cfb46](https://github.com/kiva/ui/commit/f7cfb46e8d44f6bb36e86432bf60ddfe716e5f96))
* revert query and use tw classes ([5dd482a](https://github.com/kiva/ui/commit/5dd482a6ce44dd9cbd44a52fed3a8dd82b93e747))
* revert unneeded change ([dec58ce](https://github.com/kiva/ui/commit/dec58ce792f91117c543474e7f511743fd341105))
* round down a percentage ([484eb87](https://github.com/kiva/ui/commit/484eb871ea247a9f9a82828dc287c7ce2af593e1))
* share url args to target lend/filter and set team param ([3372f35](https://github.com/kiva/ui/commit/3372f35370e6624e3595eafc5d0001ce9b674950))
* small fixes to new challenge filter page header ([00a5425](https://github.com/kiva/ui/commit/00a542563852c27068c345a68ac2c1d94b8b468f))
* small spot between fade and activity feed ([a16f40e](https://github.com/kiva/ui/commit/a16f40ec29eb1b4939c635daac6e582d00c6460f))
* tweaks on share challenge flag and defaut values in some components ([c336165](https://github.com/kiva/ui/commit/c336165ca3bf368dc539f0e14eda0212a2bb3a88))
* update tests and stories ([232f844](https://github.com/kiva/ui/commit/232f844cd7e9d0987fd6e649099dc8f76ff5e321))
* use correct data to calculate goal progress in share challenge component on ty page ([43e42b4](https://github.com/kiva/ui/commit/43e42b4198fe46dfb8d6d71846bcd0037d97417e))
* use shared avatar component ([f0cf21f](https://github.com/kiva/ui/commit/f0cf21f1928b365d14d252dac6aeb547f6b69e81))
* validate teamPublicId is valid to show challenge header ([bcf7443](https://github.com/kiva/ui/commit/bcf744313bf336f5d038af67f2bb42f870da9113))


### 🧹 Chores

* **release:** 2.735.0-rc.1 [skip ci] ([25d7fd9](https://github.com/kiva/ui/commit/25d7fd96c0d598761c6ed1dbf040141ce3fed211)), closes [#5178](https://github.com/kiva/ui/issues/5178) [#5220](https://github.com/kiva/ui/issues/5220) [#5221](https://github.com/kiva/ui/issues/5221) [#5216](https://github.com/kiva/ui/issues/5216) [#5223](https://github.com/kiva/ui/issues/5223) [#5229](https://github.com/kiva/ui/issues/5229) [#5225](https://github.com/kiva/ui/issues/5225)

## [2.735.0-rc.1](https://github.com/kiva/ui/compare/v2.734.0...v2.735.0-rc.1) (2024-04-05)


### 🎉 New Features

* 1 dollar bet modal removed in checkout page ([#5178](https://github.com/kiva/ui/issues/5178)) ([79c0d8a](https://github.com/kiva/ui/commit/79c0d8aec03dded204ee9d7ada82c52370a953e6))
* activity feed added to challenge header on filters page ([#5220](https://github.com/kiva/ui/issues/5220)) ([d42cf9b](https://github.com/kiva/ui/commit/d42cf9b441a3ae5fe8309ab30e4f78b1e9a91007))
* activity feed showed in loan cards on team picks case ([8253211](https://github.com/kiva/ui/commit/8253211815076ebe47b21a9349f944e58bf4708b))
* add basket total to header for large baskets ([2ca002c](https://github.com/kiva/ui/commit/2ca002ce0b858e5666d45937a505c5e0e7854865))
* add fade out to activity feed on challenge header ([cad0fc2](https://github.com/kiva/ui/commit/cad0fc2ded3f41f2dcd11fc748ac81bf19500e15))
* add track event to team toggle filter ([9d3824f](https://github.com/kiva/ui/commit/9d3824f6d8a81ca2b387f3c7068cbd6e06816a0f))
* adjust may challenge thanks page ([98d1c44](https://github.com/kiva/ui/commit/98d1c44a332b2b25bf79a88c5842a471b6962e17))
* challenge header participation avatars added ([#5221](https://github.com/kiva/ui/issues/5221)) ([e406f5e](https://github.com/kiva/ui/commit/e406f5e4147f52d5b65342b96089fdefa70e5ff3))
* emit tracking event when progress bar shows ([0646fa0](https://github.com/kiva/ui/commit/0646fa02a91d702ea0a936dbcfbdf20f24e1b400))
* experiment tracking events updated ([64823a9](https://github.com/kiva/ui/commit/64823a951c5ed80c590843276e62782e65f3e7af))
* header showed for active user team challenge ([7d8ad19](https://github.com/kiva/ui/commit/7d8ad1918d147fe4202ef37fd7386ade6cf70014))
* hiding save search for keyword and loan funding type filters ([c79bf0c](https://github.com/kiva/ui/commit/c79bf0c93eee87bbb2eaf0288c65c79232eb9385))
* kv components updated ([#5216](https://github.com/kiva/ui/issues/5216)) ([a9188a6](https://github.com/kiva/ui/commit/a9188a677e07ac4af3e24ee7ae51faa2edc314c1))
* loan search challenge header added to storybook ([#5223](https://github.com/kiva/ui/issues/5223)) ([b8cac4c](https://github.com/kiva/ui/commit/b8cac4ce8a5479959763559315d5ed50da2971e2))
* set combined activities ([84d55ae](https://github.com/kiva/ui/commit/84d55aee4eb19b99bfff455157a26aa7b3a3f2e3))
* setup challenge callout component ([52eb883](https://github.com/kiva/ui/commit/52eb883d9bb5d5fe60aca8cedb427ac60e6e6c71))
* shared method added to get user challenge ([e3939cb](https://github.com/kiva/ui/commit/e3939cbeba6d57b617d2ba81f612f8b182e8d423))
* show "added to cart" message for lend filter challenge ([5b98f53](https://github.com/kiva/ui/commit/5b98f53a975b7e2299345d0f0a8cbc42f1edb8e5))
* show correct progress for new challenge type on filter and thanks pages ([4f49a4a](https://github.com/kiva/ui/commit/4f49a4ac19d356fd973b03026388e3d6b610e9e3))
* team picks loans showed on filter page ([#5229](https://github.com/kiva/ui/issues/5229)) ([d460354](https://github.com/kiva/ui/commit/d460354845219810901356b5faae156133b4f557))
* team picks unchecked by default on filter page ([43a6d52](https://github.com/kiva/ui/commit/43a6d52d506c43314253383a44280b3dc9dc6383))
* team query params added to filtering query params ([c19f1a5](https://github.com/kiva/ui/commit/c19f1a5909fcba7e05ed4a8971344641ab2e4c35))
* team query params added to filtering query params ([#5225](https://github.com/kiva/ui/issues/5225)) ([7f57621](https://github.com/kiva/ui/commit/7f57621d6c3f5bd10a62f0e2a68ffa3a314405f3))
* track when challenge header appears on ty page ([d25dd04](https://github.com/kiva/ui/commit/d25dd048b8ae362acf666fb20e63bdd03bdf78e2))


### 🐛 Bugfixes

* adjust tests for shared avatar component ([45b27d0](https://github.com/kiva/ui/commit/45b27d04a9c50f44fff225d202413973bccb395c))
* adjust visibility for different use cases ([46e8c2d](https://github.com/kiva/ui/commit/46e8c2d6b9b5e24e51af804f6238d3cd461f89b0))
* component container bg ([9e0c97c](https://github.com/kiva/ui/commit/9e0c97c1cd735946f7941534189a1d7e83520db3))
* copyUrl calling getFullUrl twice and mixing up different params ([b4e4a33](https://github.com/kiva/ui/commit/b4e4a33a377f543cd783f9c2e25f8831a2d764bf))
* event sending goal name ([ed06d32](https://github.com/kiva/ui/commit/ed06d326fa4754351e2ad48c534b4c61db867b06))
* hide share challenge if no attributed team ([490c3e0](https://github.com/kiva/ui/commit/490c3e08069b8664588afad7b63f9bf075ac321b))
* lint ([73b6f18](https://github.com/kiva/ui/commit/73b6f1826d6490c112feeca8bca64b3adab05bff))
* lint and remove unnecessary gradient def for lg screen ([8bb007f](https://github.com/kiva/ui/commit/8bb007f9d6c9455c1c2dbf334418a660482fc7f8))
* missing optional chaining ([ebc1093](https://github.com/kiva/ui/commit/ebc1093f24e00413a49793966e30ebde18b67c01))
* padding on callout container ([4ae63ce](https://github.com/kiva/ui/commit/4ae63ce66cf587a03e3e797fb011cfbe18a04920))
* pr comments tweaks ([e01fd6c](https://github.com/kiva/ui/commit/e01fd6c546479b41858680b35b33df5bcf87abdd))
* progress bar for new challenge not complete full height ([cd246a3](https://github.com/kiva/ui/commit/cd246a39802321bdfa81f11319eef31746ee9203))
* remove nextTick ([13aa374](https://github.com/kiva/ui/commit/13aa37430afa82d66e28bf3c4f579b86bb6f04ed))
* remove test that's no longer needed ([e79c6b6](https://github.com/kiva/ui/commit/e79c6b678dd8298899b00cc1e61f7b8e896d4656))
* remove unnecessary comment ([e6f4a79](https://github.com/kiva/ui/commit/e6f4a79d17599d85171c8f045ded29e66cde5cb6))
* remove unnecessary share flag ([36721be](https://github.com/kiva/ui/commit/36721be377d91b0b6c99d43f8eca61c73e085f90))
* revert changes for challenge header and apply them in ShareChallenge component ([f7cfb46](https://github.com/kiva/ui/commit/f7cfb46e8d44f6bb36e86432bf60ddfe716e5f96))
* revert query and use tw classes ([5dd482a](https://github.com/kiva/ui/commit/5dd482a6ce44dd9cbd44a52fed3a8dd82b93e747))
* revert unneeded change ([dec58ce](https://github.com/kiva/ui/commit/dec58ce792f91117c543474e7f511743fd341105))
* round down a percentage ([484eb87](https://github.com/kiva/ui/commit/484eb871ea247a9f9a82828dc287c7ce2af593e1))
* share url args to target lend/filter and set team param ([3372f35](https://github.com/kiva/ui/commit/3372f35370e6624e3595eafc5d0001ce9b674950))
* small fixes to new challenge filter page header ([00a5425](https://github.com/kiva/ui/commit/00a542563852c27068c345a68ac2c1d94b8b468f))
* small spot between fade and activity feed ([a16f40e](https://github.com/kiva/ui/commit/a16f40ec29eb1b4939c635daac6e582d00c6460f))
* tweaks on share challenge flag and defaut values in some components ([c336165](https://github.com/kiva/ui/commit/c336165ca3bf368dc539f0e14eda0212a2bb3a88))
* update tests and stories ([232f844](https://github.com/kiva/ui/commit/232f844cd7e9d0987fd6e649099dc8f76ff5e321))
* use correct data to calculate goal progress in share challenge component on ty page ([43e42b4](https://github.com/kiva/ui/commit/43e42b4198fe46dfb8d6d71846bcd0037d97417e))
* use shared avatar component ([f0cf21f](https://github.com/kiva/ui/commit/f0cf21f1928b365d14d252dac6aeb547f6b69e81))
* validate teamPublicId is valid to show challenge header ([bcf7443](https://github.com/kiva/ui/commit/bcf744313bf336f5d038af67f2bb42f870da9113))

## [2.734.0](https://github.com/kiva/ui/compare/v2.733.0...v2.734.0) (2024-03-25)


### 🎉 New Features

* ab setup added to filters page for new challenge header ([#5193](https://github.com/kiva/ui/issues/5193)) ([80f42fe](https://github.com/kiva/ui/commit/80f42fe3019cb46af69eb5e605eea29733b251bc))
* activities were not shown due to lendCta being mounted before knowing if experiment was enabled ([83eefc8](https://github.com/kiva/ui/commit/83eefc8846885ec76e56efc93fe61c774dcbebb2))
* add global tracing for express + graphql, include trace and span ids in winston logs ([d9293d0](https://github.com/kiva/ui/commit/d9293d0098203d608b7b262bc7aa7bdf98f27a2e))
* add tracking event for failing add to basket ([fa38a03](https://github.com/kiva/ui/commit/fa38a03c2790112f3be0982c420cbe8c89300bb4))
* add tracking events to missing loan activities cta ([65569b8](https://github.com/kiva/ui/commit/65569b8c99c1105f0f4f91ba5ef6b550b756fe07))
* challenge header data fetch added ([#5197](https://github.com/kiva/ui/issues/5197)) ([d97d942](https://github.com/kiva/ui/commit/d97d9426fb93fcaff16713a1f36589cac86ab2bd))
* challenge header placeholder added ([#5195](https://github.com/kiva/ui/issues/5195)) ([68f40a5](https://github.com/kiva/ui/commit/68f40a519ee1c7e11c162f4e3b7e26f0af2c35ac))
* grid width fixed on category page ([#5204](https://github.com/kiva/ui/issues/5204)) ([cee0050](https://github.com/kiva/ui/commit/cee005024ba35af44e2208621352d34675d44b20))
* header tweaks on mobile ([#5214](https://github.com/kiva/ui/issues/5214)) ([6b6dd98](https://github.com/kiva/ui/commit/6b6dd98f8688c16d8fb45dee3d977dc5179ba9b8))
* mobile tweaks ([ebb4a6a](https://github.com/kiva/ui/commit/ebb4a6afb57a107089ac119b8e4aaac46af880cf))
* modify default state and add icon at the end of progress bar in progressCampaign ([9e3aa99](https://github.com/kiva/ui/commit/9e3aa99e9769e6b1caa4c041d153e382f0c792bf))
* powered by lenders in borrower profile ([4d57f84](https://github.com/kiva/ui/commit/4d57f847e3784629981bd21fcde490d2a2ae343c))
* progress bar to challenge header ([d30996f](https://github.com/kiva/ui/commit/d30996f9eaa1e3c5355b8683d46703c7d40cb866))
* redirect challenges to lend/filter ([e9fe578](https://github.com/kiva/ui/commit/e9fe578525664ebc96647c0f0622634144de5ee5))
* remove checkout upsell white space ([#5210](https://github.com/kiva/ui/issues/5210)) ([d01d293](https://github.com/kiva/ui/commit/d01d2930be5c0f27d443851d658d2227d18ab129))
* set challenge cookie data on lend filter ([4a9cb79](https://github.com/kiva/ui/commit/4a9cb79bfd09d13e9dc93449bfc5f471d5f8f02d))
* setup of share challenge component ([0095638](https://github.com/kiva/ui/commit/009563880bfa1f27020fbdcb633ad155c0da12fe))
* store challenge loanIds in cookie ([4b6e0bb](https://github.com/kiva/ui/commit/4b6e0bbb26b24bc2c4e9528d64e070bf06c679ad))
* team challenge info added to challenge header ([#5199](https://github.com/kiva/ui/issues/5199)) ([7b0ac4d](https://github.com/kiva/ui/commit/7b0ac4dfdd7a62e5a3c899e67fb181bc3dfe752a))
* team picks handled for challenge header ([#5206](https://github.com/kiva/ui/issues/5206)) ([c74af7b](https://github.com/kiva/ui/commit/c74af7bfc120b7745ff456d95839b39885e2de84))
* team picks switch added for team challenges on filters page ([#5201](https://github.com/kiva/ui/issues/5201)) ([80782bf](https://github.com/kiva/ui/commit/80782bf5214c0ecc8ca116ca70f5ab2465dc34b1))
* using kvAvatar component instead of img ([9fd3cf8](https://github.com/kiva/ui/commit/9fd3cf89c80ca50342cd5f4e5fc4f3ffc3773b2d))


### 🐛 Bugfixes

* add an apollo retry link to handle network errors ([7809a21](https://github.com/kiva/ui/commit/7809a21d543d6383749f9cb10f7b81f35c1b0063))
* add email notification checkbox to saved search modal ([dc5718e](https://github.com/kiva/ui/commit/dc5718e425be8a64d5f461724b9f1f0b8f932ec1))
* add new filter to remove corporate lenders from BP activity feed ([8910461](https://github.com/kiva/ui/commit/89104611703ac07cf3cb411134436344f52455f5))
* add to basket from loanActivities component ([777e046](https://github.com/kiva/ui/commit/777e046f7487fd0bebda6ca6f90d590d698759ec))
* add todo for amount goal ([c5d589f](https://github.com/kiva/ui/commit/c5d589f8c4266240da14a099f3cd269cbe1f86d9))
* add white bg to progress bar on challenge header ([0888924](https://github.com/kiva/ui/commit/0888924310444f30e63b03a03cda5286ab843b18))
* center progress bar icon ([439b612](https://github.com/kiva/ui/commit/439b612e408d4c0deccd7308fb60f44d9fc50aa1))
* convert otel enabled switch to string instead of bool ([0f5b7f7](https://github.com/kiva/ui/commit/0f5b7f7615c0d776faaa611898156dd50e56d213))
* copy and filename changes ([79e9741](https://github.com/kiva/ui/commit/79e9741f3262709874b2c0bc95bfa9eefbaa9da2))
* correct size profile image on mobile ([#5215](https://github.com/kiva/ui/issues/5215)) ([d424bd3](https://github.com/kiva/ui/commit/d424bd3506baaef126b21987e379d6f54f4c7d68))
* ensure loanAmount type is Number ([d1b361f](https://github.com/kiva/ui/commit/d1b361f976ff40e415f55a187f0ba53f513d118d))
* event category ([42b578b](https://github.com/kiva/ui/commit/42b578b63ab8f71bef762babddd8cf8f98386fbd))
* event name to kebab case ([bac2ade](https://github.com/kiva/ui/commit/bac2ade14aec9a34a70f6548a8e3eb528e495352))
* invalid tracking name ([709123b](https://github.com/kiva/ui/commit/709123be6c45c5e25c1ed63d16fdb1d64b835d29))
* lint ([5071805](https://github.com/kiva/ui/commit/50718054c486455745fa45684132b44916841bfd))
* more direct check for active retry state ([c499ee1](https://github.com/kiva/ui/commit/c499ee1e1ab9658cccffd926e2d7931068a0b8bd))
* progress bar bug fixed in challenge header ([#5205](https://github.com/kiva/ui/issues/5205)) ([c80f11e](https://github.com/kiva/ui/commit/c80f11ea26927f992c1e0320fabb0cbf110b2e43))
* remove adding cookies on load lend/filter and add tests for setCookie method ([312c359](https://github.com/kiva/ui/commit/312c3597b97e12fb95745f65d965ec8f41ff2f6c))
* remove unnecessary code ([8b9ead2](https://github.com/kiva/ui/commit/8b9ead2c483b7d18ba9f974d76f3366f3c068c30))
* removing old campaign component references and shadow fix ([4fe955c](https://github.com/kiva/ui/commit/4fe955c1931b884f23988a4b14b8d86ae85960ac))
* rename network error logging link ([3c607cb](https://github.com/kiva/ui/commit/3c607cb23f43555aed1422f90e18dbeaf0da9790))
* setup config value with defaults to preserve current state ([76c3315](https://github.com/kiva/ui/commit/76c331574f4b7c9f2a8f9af591c36761cb8c6160))
* small design fixes ([2c46e3a](https://github.com/kiva/ui/commit/2c46e3aa0c2f5fa23bd5b72b67e7e4937f31177d))
* solve conflict ([71339ca](https://github.com/kiva/ui/commit/71339ca3622be4a64b1a20de5cb5b735e5ac7e62))
* solve conflicts ([a699d56](https://github.com/kiva/ui/commit/a699d5620706f061774a5b801dcde5f60a1df4c0))
* sync package-lock ([95d15bc](https://github.com/kiva/ui/commit/95d15bc81d21e3f7f2531ae4319c1068cc1c8cc0))
* typo in action ([0f2a5bb](https://github.com/kiva/ui/commit/0f2a5bb0cf57866280a650b8d2b923736d1c5418))
* update cookie when loan is added and challenge is active ([65442a0](https://github.com/kiva/ui/commit/65442a0ea2e8ebcfa56abf1345da949568f477e8))
* update var names ([2af71b9](https://github.com/kiva/ui/commit/2af71b9040c12d24432eb0417bf0d22c273d4bae))
* update with main, update package-lock ([766c7ab](https://github.com/kiva/ui/commit/766c7ab848bfa83eecbef93bcc12606438568543))
* use OTEL env vars for service name and namespace ([21a27d2](https://github.com/kiva/ui/commit/21a27d2f3c6b238a6046dcbd2995a5e5f6e0424a))


### 🪚 Refactors

* clean some unused code ([27f24b6](https://github.com/kiva/ui/commit/27f24b611c24982734d7b4630b72099b9092b3e3))
* cleaning up iwd components and small fixes ([1fa2966](https://github.com/kiva/ui/commit/1fa296610459185cee1de0171834457fcc7c7760))


### 🧹 Chores

* **release:** 2.734.0-rc.1 [skip ci] ([60967e1](https://github.com/kiva/ui/commit/60967e1a48b35892844c2f6614b219debdc92ce3)), closes [#5193](https://github.com/kiva/ui/issues/5193) [#5197](https://github.com/kiva/ui/issues/5197) [#5195](https://github.com/kiva/ui/issues/5195) [#5204](https://github.com/kiva/ui/issues/5204) [#5214](https://github.com/kiva/ui/issues/5214) [#5210](https://github.com/kiva/ui/issues/5210) [#5199](https://github.com/kiva/ui/issues/5199) [#5206](https://github.com/kiva/ui/issues/5206) [#5201](https://github.com/kiva/ui/issues/5201) [#5215](https://github.com/kiva/ui/issues/5215) [#5205](https://github.com/kiva/ui/issues/5205)
* update developers assigned to dependency updates ([92fa03a](https://github.com/kiva/ui/commit/92fa03a77beb917d0e91cb30a0c47510a1e70899))

## [2.734.0-rc.1](https://github.com/kiva/ui/compare/v2.733.0...v2.734.0-rc.1) (2024-03-22)


### 🎉 New Features

* ab setup added to filters page for new challenge header ([#5193](https://github.com/kiva/ui/issues/5193)) ([80f42fe](https://github.com/kiva/ui/commit/80f42fe3019cb46af69eb5e605eea29733b251bc))
* activities were not shown due to lendCta being mounted before knowing if experiment was enabled ([83eefc8](https://github.com/kiva/ui/commit/83eefc8846885ec76e56efc93fe61c774dcbebb2))
* add global tracing for express + graphql, include trace and span ids in winston logs ([d9293d0](https://github.com/kiva/ui/commit/d9293d0098203d608b7b262bc7aa7bdf98f27a2e))
* add tracking event for failing add to basket ([fa38a03](https://github.com/kiva/ui/commit/fa38a03c2790112f3be0982c420cbe8c89300bb4))
* add tracking events to missing loan activities cta ([65569b8](https://github.com/kiva/ui/commit/65569b8c99c1105f0f4f91ba5ef6b550b756fe07))
* challenge header data fetch added ([#5197](https://github.com/kiva/ui/issues/5197)) ([d97d942](https://github.com/kiva/ui/commit/d97d9426fb93fcaff16713a1f36589cac86ab2bd))
* challenge header placeholder added ([#5195](https://github.com/kiva/ui/issues/5195)) ([68f40a5](https://github.com/kiva/ui/commit/68f40a519ee1c7e11c162f4e3b7e26f0af2c35ac))
* grid width fixed on category page ([#5204](https://github.com/kiva/ui/issues/5204)) ([cee0050](https://github.com/kiva/ui/commit/cee005024ba35af44e2208621352d34675d44b20))
* header tweaks on mobile ([#5214](https://github.com/kiva/ui/issues/5214)) ([6b6dd98](https://github.com/kiva/ui/commit/6b6dd98f8688c16d8fb45dee3d977dc5179ba9b8))
* mobile tweaks ([ebb4a6a](https://github.com/kiva/ui/commit/ebb4a6afb57a107089ac119b8e4aaac46af880cf))
* modify default state and add icon at the end of progress bar in progressCampaign ([9e3aa99](https://github.com/kiva/ui/commit/9e3aa99e9769e6b1caa4c041d153e382f0c792bf))
* powered by lenders in borrower profile ([4d57f84](https://github.com/kiva/ui/commit/4d57f847e3784629981bd21fcde490d2a2ae343c))
* progress bar to challenge header ([d30996f](https://github.com/kiva/ui/commit/d30996f9eaa1e3c5355b8683d46703c7d40cb866))
* redirect challenges to lend/filter ([e9fe578](https://github.com/kiva/ui/commit/e9fe578525664ebc96647c0f0622634144de5ee5))
* remove checkout upsell white space ([#5210](https://github.com/kiva/ui/issues/5210)) ([d01d293](https://github.com/kiva/ui/commit/d01d2930be5c0f27d443851d658d2227d18ab129))
* set challenge cookie data on lend filter ([4a9cb79](https://github.com/kiva/ui/commit/4a9cb79bfd09d13e9dc93449bfc5f471d5f8f02d))
* setup of share challenge component ([0095638](https://github.com/kiva/ui/commit/009563880bfa1f27020fbdcb633ad155c0da12fe))
* store challenge loanIds in cookie ([4b6e0bb](https://github.com/kiva/ui/commit/4b6e0bbb26b24bc2c4e9528d64e070bf06c679ad))
* team challenge info added to challenge header ([#5199](https://github.com/kiva/ui/issues/5199)) ([7b0ac4d](https://github.com/kiva/ui/commit/7b0ac4dfdd7a62e5a3c899e67fb181bc3dfe752a))
* team picks handled for challenge header ([#5206](https://github.com/kiva/ui/issues/5206)) ([c74af7b](https://github.com/kiva/ui/commit/c74af7bfc120b7745ff456d95839b39885e2de84))
* team picks switch added for team challenges on filters page ([#5201](https://github.com/kiva/ui/issues/5201)) ([80782bf](https://github.com/kiva/ui/commit/80782bf5214c0ecc8ca116ca70f5ab2465dc34b1))
* using kvAvatar component instead of img ([9fd3cf8](https://github.com/kiva/ui/commit/9fd3cf89c80ca50342cd5f4e5fc4f3ffc3773b2d))


### 🐛 Bugfixes

* add an apollo retry link to handle network errors ([7809a21](https://github.com/kiva/ui/commit/7809a21d543d6383749f9cb10f7b81f35c1b0063))
* add email notification checkbox to saved search modal ([dc5718e](https://github.com/kiva/ui/commit/dc5718e425be8a64d5f461724b9f1f0b8f932ec1))
* add new filter to remove corporate lenders from BP activity feed ([8910461](https://github.com/kiva/ui/commit/89104611703ac07cf3cb411134436344f52455f5))
* add to basket from loanActivities component ([777e046](https://github.com/kiva/ui/commit/777e046f7487fd0bebda6ca6f90d590d698759ec))
* add todo for amount goal ([c5d589f](https://github.com/kiva/ui/commit/c5d589f8c4266240da14a099f3cd269cbe1f86d9))
* add white bg to progress bar on challenge header ([0888924](https://github.com/kiva/ui/commit/0888924310444f30e63b03a03cda5286ab843b18))
* center progress bar icon ([439b612](https://github.com/kiva/ui/commit/439b612e408d4c0deccd7308fb60f44d9fc50aa1))
* convert otel enabled switch to string instead of bool ([0f5b7f7](https://github.com/kiva/ui/commit/0f5b7f7615c0d776faaa611898156dd50e56d213))
* copy and filename changes ([79e9741](https://github.com/kiva/ui/commit/79e9741f3262709874b2c0bc95bfa9eefbaa9da2))
* correct size profile image on mobile ([#5215](https://github.com/kiva/ui/issues/5215)) ([d424bd3](https://github.com/kiva/ui/commit/d424bd3506baaef126b21987e379d6f54f4c7d68))
* ensure loanAmount type is Number ([d1b361f](https://github.com/kiva/ui/commit/d1b361f976ff40e415f55a187f0ba53f513d118d))
* event category ([42b578b](https://github.com/kiva/ui/commit/42b578b63ab8f71bef762babddd8cf8f98386fbd))
* event name to kebab case ([bac2ade](https://github.com/kiva/ui/commit/bac2ade14aec9a34a70f6548a8e3eb528e495352))
* invalid tracking name ([709123b](https://github.com/kiva/ui/commit/709123be6c45c5e25c1ed63d16fdb1d64b835d29))
* lint ([5071805](https://github.com/kiva/ui/commit/50718054c486455745fa45684132b44916841bfd))
* more direct check for active retry state ([c499ee1](https://github.com/kiva/ui/commit/c499ee1e1ab9658cccffd926e2d7931068a0b8bd))
* progress bar bug fixed in challenge header ([#5205](https://github.com/kiva/ui/issues/5205)) ([c80f11e](https://github.com/kiva/ui/commit/c80f11ea26927f992c1e0320fabb0cbf110b2e43))
* remove adding cookies on load lend/filter and add tests for setCookie method ([312c359](https://github.com/kiva/ui/commit/312c3597b97e12fb95745f65d965ec8f41ff2f6c))
* remove unnecessary code ([8b9ead2](https://github.com/kiva/ui/commit/8b9ead2c483b7d18ba9f974d76f3366f3c068c30))
* removing old campaign component references and shadow fix ([4fe955c](https://github.com/kiva/ui/commit/4fe955c1931b884f23988a4b14b8d86ae85960ac))
* rename network error logging link ([3c607cb](https://github.com/kiva/ui/commit/3c607cb23f43555aed1422f90e18dbeaf0da9790))
* setup config value with defaults to preserve current state ([76c3315](https://github.com/kiva/ui/commit/76c331574f4b7c9f2a8f9af591c36761cb8c6160))
* small design fixes ([2c46e3a](https://github.com/kiva/ui/commit/2c46e3aa0c2f5fa23bd5b72b67e7e4937f31177d))
* solve conflict ([71339ca](https://github.com/kiva/ui/commit/71339ca3622be4a64b1a20de5cb5b735e5ac7e62))
* solve conflicts ([a699d56](https://github.com/kiva/ui/commit/a699d5620706f061774a5b801dcde5f60a1df4c0))
* sync package-lock ([95d15bc](https://github.com/kiva/ui/commit/95d15bc81d21e3f7f2531ae4319c1068cc1c8cc0))
* typo in action ([0f2a5bb](https://github.com/kiva/ui/commit/0f2a5bb0cf57866280a650b8d2b923736d1c5418))
* update cookie when loan is added and challenge is active ([65442a0](https://github.com/kiva/ui/commit/65442a0ea2e8ebcfa56abf1345da949568f477e8))
* update var names ([2af71b9](https://github.com/kiva/ui/commit/2af71b9040c12d24432eb0417bf0d22c273d4bae))
* update with main, update package-lock ([766c7ab](https://github.com/kiva/ui/commit/766c7ab848bfa83eecbef93bcc12606438568543))
* use OTEL env vars for service name and namespace ([21a27d2](https://github.com/kiva/ui/commit/21a27d2f3c6b238a6046dcbd2995a5e5f6e0424a))


### 🪚 Refactors

* clean some unused code ([27f24b6](https://github.com/kiva/ui/commit/27f24b611c24982734d7b4630b72099b9092b3e3))
* cleaning up iwd components and small fixes ([1fa2966](https://github.com/kiva/ui/commit/1fa296610459185cee1de0171834457fcc7c7760))


### 🧹 Chores

* update developers assigned to dependency updates ([92fa03a](https://github.com/kiva/ui/commit/92fa03a77beb917d0e91cb30a0c47510a1e70899))

## [2.733.0](https://github.com/kiva/ui/compare/v2.732.1...v2.733.0) (2024-03-08)


### 🎉 New Features

* activity feed components added ([#5186](https://github.com/kiva/ui/issues/5186)) ([35c0016](https://github.com/kiva/ui/commit/35c001674fcfbfa71c0099f5f90ad052baa20d2f))
* add activity feed experiment to lend cta section ([d1e600a](https://github.com/kiva/ui/commit/d1e600ade47472ba0e62bd4055d1e197b406eda6))
* add query file ([0e339e5](https://github.com/kiva/ui/commit/0e339e5b3fb39bd36c890303516157fc2aea3e47))
* aggregate and filter the activity feed ([0f540c4](https://github.com/kiva/ui/commit/0f540c47aaf6b7f6609dc9040f08412136967384))
* don't save new filter to saved search ([ee66794](https://github.com/kiva/ui/commit/ee6679496276bc795df356c2c5ca643288a1a495))
* setup test for activity feed on borrower profile ([65c09b8](https://github.com/kiva/ui/commit/65c09b8c0800a23274b61acbee343d86e59a8258))
* visible url array added to global promotional banner component ([#5182](https://github.com/kiva/ui/issues/5182)) ([3db3700](https://github.com/kiva/ui/commit/3db3700e8316010a580b03358382a30bc8674ae1))


### 🐛 Bugfixes

* ensure prefetched channel data is correctly pulled from apollo cache ([42d0f63](https://github.com/kiva/ui/commit/42d0f632073fa6441fec604532c605f09fe4ded9))
* remove unnecessary exp assignment ([bfb214c](https://github.com/kiva/ui/commit/bfb214c2408a7299cf815ee050778400cecbc202))
* trying a lower limit for now ([eeae719](https://github.com/kiva/ui/commit/eeae719db17dea9c0c8cc2fa7b18ea491858f743))
* update tests ([d7d9668](https://github.com/kiva/ui/commit/d7d96687def56ec39d36b79ffc5f3c4e0b663232))


### 🧹 Chores

* **release:** 2.733.0-rc.1 [skip ci] ([870dee6](https://github.com/kiva/ui/commit/870dee6fdc9b025b07c8f0c26cfb3385b8a2ff34)), closes [#5186](https://github.com/kiva/ui/issues/5186) [#5182](https://github.com/kiva/ui/issues/5182)

## [2.733.0-rc.1](https://github.com/kiva/ui/compare/v2.732.1...v2.733.0-rc.1) (2024-03-07)


### 🎉 New Features

* activity feed components added ([#5186](https://github.com/kiva/ui/issues/5186)) ([35c0016](https://github.com/kiva/ui/commit/35c001674fcfbfa71c0099f5f90ad052baa20d2f))
* add activity feed experiment to lend cta section ([d1e600a](https://github.com/kiva/ui/commit/d1e600ade47472ba0e62bd4055d1e197b406eda6))
* add query file ([0e339e5](https://github.com/kiva/ui/commit/0e339e5b3fb39bd36c890303516157fc2aea3e47))
* aggregate and filter the activity feed ([0f540c4](https://github.com/kiva/ui/commit/0f540c47aaf6b7f6609dc9040f08412136967384))
* don't save new filter to saved search ([ee66794](https://github.com/kiva/ui/commit/ee6679496276bc795df356c2c5ca643288a1a495))
* setup test for activity feed on borrower profile ([65c09b8](https://github.com/kiva/ui/commit/65c09b8c0800a23274b61acbee343d86e59a8258))
* visible url array added to global promotional banner component ([#5182](https://github.com/kiva/ui/issues/5182)) ([3db3700](https://github.com/kiva/ui/commit/3db3700e8316010a580b03358382a30bc8674ae1))


### 🐛 Bugfixes

* ensure prefetched channel data is correctly pulled from apollo cache ([42d0f63](https://github.com/kiva/ui/commit/42d0f632073fa6441fec604532c605f09fe4ded9))
* remove unnecessary exp assignment ([bfb214c](https://github.com/kiva/ui/commit/bfb214c2408a7299cf815ee050778400cecbc202))
* trying a lower limit for now ([eeae719](https://github.com/kiva/ui/commit/eeae719db17dea9c0c8cc2fa7b18ea491858f743))
* update tests ([d7d9668](https://github.com/kiva/ui/commit/d7d96687def56ec39d36b79ffc5f3c4e0b663232))

## [2.732.1](https://github.com/kiva/ui/compare/v2.732.0...v2.732.1) (2024-03-05)


### 🐛 Bugfixes

* add fallback check for available promo from basket when promo id isn't known ([8e6db44](https://github.com/kiva/ui/commit/8e6db44aab2b89adde465f4115b8fea2784b4d37))


### 🧹 Chores

* **release:** 2.732.1-rc.1 [skip ci] ([cf12075](https://github.com/kiva/ui/commit/cf120750f60f478909fe33cad6335c7a9747c645))

## [2.732.1-rc.1](https://github.com/kiva/ui/compare/v2.732.0...v2.732.1-rc.1) (2024-03-05)


### 🐛 Bugfixes

* add fallback check for available promo from basket when promo id isn't known ([8e6db44](https://github.com/kiva/ui/commit/8e6db44aab2b89adde465f4115b8fea2784b4d37))

## [2.732.0](https://github.com/kiva/ui/compare/v2.731.0...v2.732.0) (2024-03-01)


### 🎉 New Features

* footer broken link removed ([#5177](https://github.com/kiva/ui/issues/5177)) ([5d897c5](https://github.com/kiva/ui/commit/5d897c561beb1823a809493362a522323b6a0cbb))


### 🐛 Bugfixes

* adjust thanks page for IWD ([42d19c9](https://github.com/kiva/ui/commit/42d19c9d7fb830862fd6ba4259ae9aa8cf3195da))
* ensure progress bar grows in mobile ([536a24a](https://github.com/kiva/ui/commit/536a24a9a93bcc4373204d3726266963ddd65540))
* patch in userid before pageview if available ([9140a94](https://github.com/kiva/ui/commit/9140a942fb7b8018b4af1ad714300a7c00305beb))


### 🧹 Chores

* **release:** 2.732.0-rc.1 [skip ci] ([c8f442d](https://github.com/kiva/ui/commit/c8f442d5955c4c460050dd7b9cad81a327b753ec)), closes [#5177](https://github.com/kiva/ui/issues/5177)

## [2.732.0-rc.1](https://github.com/kiva/ui/compare/v2.731.0...v2.732.0-rc.1) (2024-03-01)


### 🎉 New Features

* footer broken link removed ([#5177](https://github.com/kiva/ui/issues/5177)) ([5d897c5](https://github.com/kiva/ui/commit/5d897c561beb1823a809493362a522323b6a0cbb))


### 🐛 Bugfixes

* adjust thanks page for IWD ([42d19c9](https://github.com/kiva/ui/commit/42d19c9d7fb830862fd6ba4259ae9aa8cf3195da))
* ensure progress bar grows in mobile ([536a24a](https://github.com/kiva/ui/commit/536a24a9a93bcc4373204d3726266963ddd65540))
* patch in userid before pageview if available ([9140a94](https://github.com/kiva/ui/commit/9140a942fb7b8018b4af1ad714300a7c00305beb))

## [2.731.0](https://github.com/kiva/ui/compare/v2.730.0...v2.731.0) (2024-02-23)


### 🎉 New Features

* add iwd events in thanks page ([8c40ea1](https://github.com/kiva/ui/commit/8c40ea15726e781f87ca533e34b89c9785a0d9ad))
* fix issue with badge image stretch ([64c786c](https://github.com/kiva/ui/commit/64c786c9a0d36a9f6d4f58a5ae9b10416c01a2fd))
* get iwd experiment data to evaluate whether redirect to the challenge ty page or the regular ([32099ca](https://github.com/kiva/ui/commit/32099ca2139d483cc50205b3237f8950ba568d32))
* implement optional async checkout muatations and status check ([52f2d29](https://github.com/kiva/ui/commit/52f2d2955f7c4f849d885b31690200be40701b26))
* iwd no inviter thanks page update ([#5170](https://github.com/kiva/ui/issues/5170)) ([86ba3a4](https://github.com/kiva/ui/commit/86ba3a446b73e5242bddc1cbe9e74fa3e3d6646b))
* iwd progress bar hidden when goals reached ([#5168](https://github.com/kiva/ui/issues/5168)) ([f6eeae2](https://github.com/kiva/ui/commit/f6eeae2e9e5fae94e0286a12700f7057cb7e281e))
* make filters list collapsible on cc pages ([10a1a9a](https://github.com/kiva/ui/commit/10a1a9a359de82585a26875b741cadd6cbe58eac))
* override successPath if valetInviter is set ([b9bc4d1](https://github.com/kiva/ui/commit/b9bc4d128f4c2ecbf6906f442abd4049bd79d104))
* update utm campaign values for iwd thanks page ([993990e](https://github.com/kiva/ui/commit/993990e3a114a2935bd7318a97be5e6e8e6dacc4))


### 🐛 Bugfixes

* change exp key ([3392584](https://github.com/kiva/ui/commit/339258411029a02187c63a513579929ded869f6f))
* create reusable remainingCredit computed prop, update CampaignProgressBar to use it ([397ba10](https://github.com/kiva/ui/commit/397ba1090af3131227dee6c005cc4725f213c1a1))
* handle missing checkoutId, fix indents ([0d4bacd](https://github.com/kiva/ui/commit/0d4bacd22849ccc1490447a5d9bff299c5d05531))
* initiate success handler only once for the appropriate type of checkout ([c578ce0](https://github.com/kiva/ui/commit/c578ce04d2d0f43f983a32aab41e213a1de3f724))
* iwd thanks page height fixed ([#5176](https://github.com/kiva/ui/issues/5176)) ([129cb8c](https://github.com/kiva/ui/commit/129cb8c7b5f1f12564bcb8924cbb5d522faf694b))
* lint errors ([e8cbdca](https://github.com/kiva/ui/commit/e8cbdcad9ea840cc0d35bd770c985b70decebc44))
* logic was incorrect for showing IWD progress ([4d8442e](https://github.com/kiva/ui/commit/4d8442e56a2c457af25ffd0f6d57dd144c013753))
* missing slash in redirect url ([db559ca](https://github.com/kiva/ui/commit/db559cacb2f77377eb405bf178ba9234f3f4704c))
* new method to format checkoutStatus error, send braintree errors to sentry ([3dfab48](https://github.com/kiva/ui/commit/3dfab4874fceb72f999b6b0d50b1ba9b785d8283))
* post-purchase was not handing over valet inviter query ([81c61ed](https://github.com/kiva/ui/commit/81c61ed8e5ba96e26389dad537564c9c13a6bcda))
* remove unused query import ([c78bbcf](https://github.com/kiva/ui/commit/c78bbcf37b049dea13805ce1e1e85b49e60f3675))
* solve conflict ([65d6f08](https://github.com/kiva/ui/commit/65d6f08747c7fdab659de8e07b464ed3ae16576a))
* unused experimentVersionFragment on typage ([625e09e](https://github.com/kiva/ui/commit/625e09edc2011ff7cd7bd3795bea8f6b92b52dd6))
* update async checkout error formatting to match expected format ([5fe7c76](https://github.com/kiva/ui/commit/5fe7c7607e0a8a8deeac2c719d6b3febd0b3e904))
* update kv-shop, extract checkoutId string for new kv-shop method ([ab5cb8a](https://github.com/kiva/ui/commit/ab5cb8a17ecc46bb507b1b86aa3d019948893dc3))
* use kv-shop version of pollForFinishedCheckout ([4887639](https://github.com/kiva/ui/commit/4887639d1845e9799e443621a3287b2f8f0c6fdb))
* valet_inviter opt chaining ([212947d](https://github.com/kiva/ui/commit/212947d0e68eb3dec46450fa0c44218743af27ea))


### 🧹 Chores

* install kvShop library ([ed96f9d](https://github.com/kiva/ui/commit/ed96f9d0b0ae55da339eab3c0575c88e6cd3b232))
* **release:** 2.731.0-rc.1 [skip ci] ([0f2331a](https://github.com/kiva/ui/commit/0f2331a3260e46d75a3630234bcd08dc4ade3c8d)), closes [#5170](https://github.com/kiva/ui/issues/5170) [#5168](https://github.com/kiva/ui/issues/5168)
* **release:** 2.731.0-rc.2 [skip ci] ([eabd537](https://github.com/kiva/ui/commit/eabd537544b76a3176b5df22aed6b587defa2762)), closes [#5176](https://github.com/kiva/ui/issues/5176)
* remove unused checkout status polling function ([fc5e75a](https://github.com/kiva/ui/commit/fc5e75a7c0d4abdf88482d2893598376ef5c3a3c))
* update configs for custom domain and dev mode with caddy ([f0a87fd](https://github.com/kiva/ui/commit/f0a87fde74d2418b1dd5ade3151f82c9a8612d26))

## [2.731.0-rc.2](https://github.com/kiva/ui/compare/v2.731.0-rc.1...v2.731.0-rc.2) (2024-02-23)


### 🐛 Bugfixes

* iwd thanks page height fixed ([#5176](https://github.com/kiva/ui/issues/5176)) ([129cb8c](https://github.com/kiva/ui/commit/129cb8c7b5f1f12564bcb8924cbb5d522faf694b))

## [2.731.0-rc.1](https://github.com/kiva/ui/compare/v2.730.0...v2.731.0-rc.1) (2024-02-22)


### 🎉 New Features

* add iwd events in thanks page ([8c40ea1](https://github.com/kiva/ui/commit/8c40ea15726e781f87ca533e34b89c9785a0d9ad))
* fix issue with badge image stretch ([64c786c](https://github.com/kiva/ui/commit/64c786c9a0d36a9f6d4f58a5ae9b10416c01a2fd))
* get iwd experiment data to evaluate whether redirect to the challenge ty page or the regular ([32099ca](https://github.com/kiva/ui/commit/32099ca2139d483cc50205b3237f8950ba568d32))
* implement optional async checkout muatations and status check ([52f2d29](https://github.com/kiva/ui/commit/52f2d2955f7c4f849d885b31690200be40701b26))
* iwd no inviter thanks page update ([#5170](https://github.com/kiva/ui/issues/5170)) ([86ba3a4](https://github.com/kiva/ui/commit/86ba3a446b73e5242bddc1cbe9e74fa3e3d6646b))
* iwd progress bar hidden when goals reached ([#5168](https://github.com/kiva/ui/issues/5168)) ([f6eeae2](https://github.com/kiva/ui/commit/f6eeae2e9e5fae94e0286a12700f7057cb7e281e))
* make filters list collapsible on cc pages ([10a1a9a](https://github.com/kiva/ui/commit/10a1a9a359de82585a26875b741cadd6cbe58eac))
* override successPath if valetInviter is set ([b9bc4d1](https://github.com/kiva/ui/commit/b9bc4d128f4c2ecbf6906f442abd4049bd79d104))
* update utm campaign values for iwd thanks page ([993990e](https://github.com/kiva/ui/commit/993990e3a114a2935bd7318a97be5e6e8e6dacc4))


### 🐛 Bugfixes

* change exp key ([3392584](https://github.com/kiva/ui/commit/339258411029a02187c63a513579929ded869f6f))
* create reusable remainingCredit computed prop, update CampaignProgressBar to use it ([397ba10](https://github.com/kiva/ui/commit/397ba1090af3131227dee6c005cc4725f213c1a1))
* handle missing checkoutId, fix indents ([0d4bacd](https://github.com/kiva/ui/commit/0d4bacd22849ccc1490447a5d9bff299c5d05531))
* initiate success handler only once for the appropriate type of checkout ([c578ce0](https://github.com/kiva/ui/commit/c578ce04d2d0f43f983a32aab41e213a1de3f724))
* lint errors ([e8cbdca](https://github.com/kiva/ui/commit/e8cbdcad9ea840cc0d35bd770c985b70decebc44))
* logic was incorrect for showing IWD progress ([4d8442e](https://github.com/kiva/ui/commit/4d8442e56a2c457af25ffd0f6d57dd144c013753))
* missing slash in redirect url ([db559ca](https://github.com/kiva/ui/commit/db559cacb2f77377eb405bf178ba9234f3f4704c))
* new method to format checkoutStatus error, send braintree errors to sentry ([3dfab48](https://github.com/kiva/ui/commit/3dfab4874fceb72f999b6b0d50b1ba9b785d8283))
* post-purchase was not handing over valet inviter query ([81c61ed](https://github.com/kiva/ui/commit/81c61ed8e5ba96e26389dad537564c9c13a6bcda))
* remove unused query import ([c78bbcf](https://github.com/kiva/ui/commit/c78bbcf37b049dea13805ce1e1e85b49e60f3675))
* solve conflict ([65d6f08](https://github.com/kiva/ui/commit/65d6f08747c7fdab659de8e07b464ed3ae16576a))
* unused experimentVersionFragment on typage ([625e09e](https://github.com/kiva/ui/commit/625e09edc2011ff7cd7bd3795bea8f6b92b52dd6))
* update async checkout error formatting to match expected format ([5fe7c76](https://github.com/kiva/ui/commit/5fe7c7607e0a8a8deeac2c719d6b3febd0b3e904))
* update kv-shop, extract checkoutId string for new kv-shop method ([ab5cb8a](https://github.com/kiva/ui/commit/ab5cb8a17ecc46bb507b1b86aa3d019948893dc3))
* use kv-shop version of pollForFinishedCheckout ([4887639](https://github.com/kiva/ui/commit/4887639d1845e9799e443621a3287b2f8f0c6fdb))
* valet_inviter opt chaining ([212947d](https://github.com/kiva/ui/commit/212947d0e68eb3dec46450fa0c44218743af27ea))


### 🧹 Chores

* install kvShop library ([ed96f9d](https://github.com/kiva/ui/commit/ed96f9d0b0ae55da339eab3c0575c88e6cd3b232))
* remove unused checkout status polling function ([fc5e75a](https://github.com/kiva/ui/commit/fc5e75a7c0d4abdf88482d2893598376ef5c3a3c))
* update configs for custom domain and dev mode with caddy ([f0a87fd](https://github.com/kiva/ui/commit/f0a87fde74d2418b1dd5ade3151f82c9a8612d26))

## [2.730.0](https://github.com/kiva/ui/compare/v2.729.0...v2.730.0) (2024-02-09)


### 🎉 New Features

* add progress bar to campaign page ([c1b925b](https://github.com/kiva/ui/commit/c1b925b2029961266b9bb44c4618e87514fecdc0))
* added flag for IWD to thanks page, created working stories ([1205eab](https://github.com/kiva/ui/commit/1205eab895413eec760ec462446e1c43373090ee))
* added progress bar to thanks page variations ([e78f13f](https://github.com/kiva/ui/commit/e78f13fbc828653783a2bc7a13d8a7cd64a70840))
* added some finalized content to IWD header ([fc29232](https://github.com/kiva/ui/commit/fc29232a1df8dfcca2d92702022734e20d3cae1d))
* first IWD thanks page variation ([c5572b6](https://github.com/kiva/ui/commit/c5572b618c493422b547d74cd2b198604cac3c96))
* iwd activity feed added ([#5152](https://github.com/kiva/ui/issues/5152)) ([0a9424f](https://github.com/kiva/ui/commit/0a9424f387434240ff4074ec75dd19788f1a2cd2))
* remaining iwd thanks page variation ([b1a9600](https://github.com/kiva/ui/commit/b1a9600f96d7c142131b0f7cd40e909a60617494))
* update thanks page header for challenges ([7b1147b](https://github.com/kiva/ui/commit/7b1147b706bfab91c4e983109c271b6bf92c6748))


### 🐛 Bugfixes

* added missing data prop ([9c92884](https://github.com/kiva/ui/commit/9c928840181fe9b9c6c6ea459c382e3805f5cc21))
* added missing id in query ([fc7f447](https://github.com/kiva/ui/commit/fc7f44765df5663bc58a328c8d484993f492425a))
* added some missing story mixins ([f853fb5](https://github.com/kiva/ui/commit/f853fb51151895f1a9a7874659cfdd9ca2734b73))
* empty template was also creating a warning ([ffc591d](https://github.com/kiva/ui/commit/ffc591dfc659284444818ccc16db98aa1a13b405))
* ensure we cover errors from new activities query ([e8cf21a](https://github.com/kiva/ui/commit/e8cf21a9671d83d8d31c05403fc233a2c6dd35ba))
* lower activity feed items ([9b8eb53](https://github.com/kiva/ui/commit/9b8eb53cdaf36dc37e7cf7750cf11631bd993f62))
* minor cleanup ([3a97d83](https://github.com/kiva/ui/commit/3a97d83266a841cfb8596145004ff9fbe26a6cd7))
* quick resolution of server error ([85a2811](https://github.com/kiva/ui/commit/85a2811da02bfbd8854d3d7bfbc069c007e81a7d))
* round the borrower image ([68a4d24](https://github.com/kiva/ui/commit/68a4d24f3d338c94f0c86dbad8fd4168ee288c9e))
* show the checkout now button and emit to show basket on corporate landing loan cards ([d4b0819](https://github.com/kiva/ui/commit/d4b0819dbddba46d71f9747f3b594dd0844ec633))
* some missing thanks padding ([be6b8f6](https://github.com/kiva/ui/commit/be6b8f6a330a3bdcda5ef9b3bd2c69e077b41263))


### 🧹 Chores

* **release:** 2.730.0-rc.1 [skip ci] ([75581df](https://github.com/kiva/ui/commit/75581df8bd6ad925db0397fd32c0ef397110b9e9)), closes [#5152](https://github.com/kiva/ui/issues/5152)

## [2.730.0-rc.1](https://github.com/kiva/ui/compare/v2.729.0...v2.730.0-rc.1) (2024-02-09)


### 🎉 New Features

* add progress bar to campaign page ([c1b925b](https://github.com/kiva/ui/commit/c1b925b2029961266b9bb44c4618e87514fecdc0))
* added flag for IWD to thanks page, created working stories ([1205eab](https://github.com/kiva/ui/commit/1205eab895413eec760ec462446e1c43373090ee))
* added progress bar to thanks page variations ([e78f13f](https://github.com/kiva/ui/commit/e78f13fbc828653783a2bc7a13d8a7cd64a70840))
* added some finalized content to IWD header ([fc29232](https://github.com/kiva/ui/commit/fc29232a1df8dfcca2d92702022734e20d3cae1d))
* first IWD thanks page variation ([c5572b6](https://github.com/kiva/ui/commit/c5572b618c493422b547d74cd2b198604cac3c96))
* iwd activity feed added ([#5152](https://github.com/kiva/ui/issues/5152)) ([0a9424f](https://github.com/kiva/ui/commit/0a9424f387434240ff4074ec75dd19788f1a2cd2))
* remaining iwd thanks page variation ([b1a9600](https://github.com/kiva/ui/commit/b1a9600f96d7c142131b0f7cd40e909a60617494))
* update thanks page header for challenges ([7b1147b](https://github.com/kiva/ui/commit/7b1147b706bfab91c4e983109c271b6bf92c6748))


### 🐛 Bugfixes

* added missing data prop ([9c92884](https://github.com/kiva/ui/commit/9c928840181fe9b9c6c6ea459c382e3805f5cc21))
* added missing id in query ([fc7f447](https://github.com/kiva/ui/commit/fc7f44765df5663bc58a328c8d484993f492425a))
* added some missing story mixins ([f853fb5](https://github.com/kiva/ui/commit/f853fb51151895f1a9a7874659cfdd9ca2734b73))
* empty template was also creating a warning ([ffc591d](https://github.com/kiva/ui/commit/ffc591dfc659284444818ccc16db98aa1a13b405))
* ensure we cover errors from new activities query ([e8cf21a](https://github.com/kiva/ui/commit/e8cf21a9671d83d8d31c05403fc233a2c6dd35ba))
* lower activity feed items ([9b8eb53](https://github.com/kiva/ui/commit/9b8eb53cdaf36dc37e7cf7750cf11631bd993f62))
* minor cleanup ([3a97d83](https://github.com/kiva/ui/commit/3a97d83266a841cfb8596145004ff9fbe26a6cd7))
* quick resolution of server error ([85a2811](https://github.com/kiva/ui/commit/85a2811da02bfbd8854d3d7bfbc069c007e81a7d))
* round the borrower image ([68a4d24](https://github.com/kiva/ui/commit/68a4d24f3d338c94f0c86dbad8fd4168ee288c9e))
* show the checkout now button and emit to show basket on corporate landing loan cards ([d4b0819](https://github.com/kiva/ui/commit/d4b0819dbddba46d71f9747f3b594dd0844ec633))
* some missing thanks padding ([be6b8f6](https://github.com/kiva/ui/commit/be6b8f6a330a3bdcda5ef9b3bd2c69e077b41263))

## [2.729.0](https://github.com/kiva/ui/compare/v2.728.0...v2.729.0) (2024-02-01)


### 🎉 New Features

* campaign progresss bar ([4776f56](https://github.com/kiva/ui/commit/4776f5605e024030add31384ae45100d06d1c867))


### 🐛 Bugfixes

* check and coerce setCookies from the context if missing ([2741ab0](https://github.com/kiva/ui/commit/2741ab066d04330dc88109c102179bbac1b1566d))
* indentation ([05c7368](https://github.com/kiva/ui/commit/05c73685f9f732347ab6b9c9f6230de74ee0ff7c))
* indentation in component ([0caa7ff](https://github.com/kiva/ui/commit/0caa7ff6ddb8cec713bed6350efb7e578c5b0cdd))
* parse worker count vars as integers ([6fef9d6](https://github.com/kiva/ui/commit/6fef9d6a6d466ba8ee3a48b48687ff63914b0e0a))
* set cookie headers not being added to response ([6dea80d](https://github.com/kiva/ui/commit/6dea80d489f1b848f6c7e1aa96a6295232e88659))


### 🧹 Chores

* **release:** 2.729.0-rc.1 [skip ci] ([f265a0d](https://github.com/kiva/ui/commit/f265a0d1baa6d70f5b5cccf260ea74b56a735b4d))
* **release:** 2.729.0-rc.2 [skip ci] ([08d4ded](https://github.com/kiva/ui/commit/08d4ded2551a39c901d86e84f5e36561f728d257))

## [2.729.0-rc.2](https://github.com/kiva/ui/compare/v2.729.0-rc.1...v2.729.0-rc.2) (2024-02-01)


### 🐛 Bugfixes

* check and coerce setCookies from the context if missing ([2741ab0](https://github.com/kiva/ui/commit/2741ab066d04330dc88109c102179bbac1b1566d))
* set cookie headers not being added to response ([6dea80d](https://github.com/kiva/ui/commit/6dea80d489f1b848f6c7e1aa96a6295232e88659))

## [2.729.0-rc.1](https://github.com/kiva/ui/compare/v2.728.0...v2.729.0-rc.1) (2024-01-31)


### 🎉 New Features

* campaign progresss bar ([4776f56](https://github.com/kiva/ui/commit/4776f5605e024030add31384ae45100d06d1c867))


### 🐛 Bugfixes

* indentation ([05c7368](https://github.com/kiva/ui/commit/05c73685f9f732347ab6b9c9f6230de74ee0ff7c))
* indentation in component ([0caa7ff](https://github.com/kiva/ui/commit/0caa7ff6ddb8cec713bed6350efb7e578c5b0cdd))
* parse worker count vars as integers ([6fef9d6](https://github.com/kiva/ui/commit/6fef9d6a6d466ba8ee3a48b48687ff63914b0e0a))

## [2.728.0](https://github.com/kiva/ui/compare/v2.727.0...v2.728.0) (2024-01-29)


### 🎉 New Features

* add new flexibleFundraisingEnabled filter ([1fed20e](https://github.com/kiva/ui/commit/1fed20e54d9adeab3d8fc62d81182fefe09cca2e))
* add placeholder for IWD 2024 category header ([2ac0803](https://github.com/kiva/ui/commit/2ac08036a704006d8033619afd678d752ba1a39b))
* configure min/max vue worker count with env vars ([17c9138](https://github.com/kiva/ui/commit/17c9138184bd7885fe055c99ea53482562ef2e95))
* contentful comments component base in cps ([93e008c](https://github.com/kiva/ui/commit/93e008c478fb018d42b27b505f5d92b5e7a47b77))
* export worker pool metrics to monitor vue rendering ([12aebc2](https://github.com/kiva/ui/commit/12aebc2186f63b92ef7aefdffe1f425d22205234))
* get activity feed token ([398568b](https://github.com/kiva/ui/commit/398568b801609556b8e103004b8633c002558e90))
* use pool of worker threads for rendering ([45cad5e](https://github.com/kiva/ui/commit/45cad5e6bacff64f25566c95f6944aa3dc8f48ae))
* use worker threads for vue app and sitemap rendering ([999b0d3](https://github.com/kiva/ui/commit/999b0d31fe707ee1721a316168580704a907126d))


### 🐛 Bugfixes

* handle pool reinitialization by dev server ([9cdeb7a](https://github.com/kiva/ui/commit/9cdeb7aff598c58d57f2609cafc1c4ef10cf9034))
* revert new component usage ([9968551](https://github.com/kiva/ui/commit/9968551c64dee17e7c432b69391dee68a4dab53a))


### 🧹 Chores

* **deps:** install workerpool ([750f01d](https://github.com/kiva/ui/commit/750f01d4c0f7696196fd9a2862e152db345d34c8))
* **release:** 2.728.0-rc.1 [skip ci] ([224ffe2](https://github.com/kiva/ui/commit/224ffe2c29ce085fc536e25ae24605f4ff1bfd2a))
* updates for k8s-local config ([09004ef](https://github.com/kiva/ui/commit/09004ef910dbdf905f3322dcd5cb0846df312c07))

## [2.728.0-rc.1](https://github.com/kiva/ui/compare/v2.727.0...v2.728.0-rc.1) (2024-01-29)


### 🎉 New Features

* add new flexibleFundraisingEnabled filter ([1fed20e](https://github.com/kiva/ui/commit/1fed20e54d9adeab3d8fc62d81182fefe09cca2e))
* add placeholder for IWD 2024 category header ([2ac0803](https://github.com/kiva/ui/commit/2ac08036a704006d8033619afd678d752ba1a39b))
* configure min/max vue worker count with env vars ([17c9138](https://github.com/kiva/ui/commit/17c9138184bd7885fe055c99ea53482562ef2e95))
* contentful comments component base in cps ([93e008c](https://github.com/kiva/ui/commit/93e008c478fb018d42b27b505f5d92b5e7a47b77))
* export worker pool metrics to monitor vue rendering ([12aebc2](https://github.com/kiva/ui/commit/12aebc2186f63b92ef7aefdffe1f425d22205234))
* get activity feed token ([398568b](https://github.com/kiva/ui/commit/398568b801609556b8e103004b8633c002558e90))
* use pool of worker threads for rendering ([45cad5e](https://github.com/kiva/ui/commit/45cad5e6bacff64f25566c95f6944aa3dc8f48ae))
* use worker threads for vue app and sitemap rendering ([999b0d3](https://github.com/kiva/ui/commit/999b0d31fe707ee1721a316168580704a907126d))


### 🐛 Bugfixes

* handle pool reinitialization by dev server ([9cdeb7a](https://github.com/kiva/ui/commit/9cdeb7aff598c58d57f2609cafc1c4ef10cf9034))
* revert new component usage ([9968551](https://github.com/kiva/ui/commit/9968551c64dee17e7c432b69391dee68a4dab53a))


### 🧹 Chores

* **deps:** install workerpool ([750f01d](https://github.com/kiva/ui/commit/750f01d4c0f7696196fd9a2862e152db345d34c8))
* updates for k8s-local config ([09004ef](https://github.com/kiva/ui/commit/09004ef910dbdf905f3322dcd5cb0846df312c07))

## [2.727.0](https://github.com/kiva/ui/compare/v2.726.0...v2.727.0) (2024-01-23)


### 🎉 New Features

* show only the newest goal per team ([22830de](https://github.com/kiva/ui/commit/22830de4b36b6b83d6fdeb54e214c64f534c1991))


### 🐛 Bugfixes

* [ACK-959] filter goals that are not in progress for team query ([029d433](https://github.com/kiva/ui/commit/029d433dfc333d8cf5dfa38bdc307c30012b220a))
* sort using date format instead of string ([9e98ff0](https://github.com/kiva/ui/commit/9e98ff080a0229112b069099fb3fad318b52145d))


### 🏗️ Build System

* ensure only one release is running at any time ([c5a09dc](https://github.com/kiva/ui/commit/c5a09dc06455f87b1368baa91c462d984251addb))


### 🧹 Chores

* **release:** 2.727.0-rc.1 [skip ci] ([c3d6749](https://github.com/kiva/ui/commit/c3d674970ba5ed214a6a342adccfcc73a66bc69e))

## [2.727.0-rc.1](https://github.com/kiva/ui/compare/v2.726.0...v2.727.0-rc.1) (2024-01-23)


### 🎉 New Features

* show only the newest goal per team ([22830de](https://github.com/kiva/ui/commit/22830de4b36b6b83d6fdeb54e214c64f534c1991))


### 🐛 Bugfixes

* [ACK-959] filter goals that are not in progress for team query ([029d433](https://github.com/kiva/ui/commit/029d433dfc333d8cf5dfa38bdc307c30012b220a))
* sort using date format instead of string ([9e98ff0](https://github.com/kiva/ui/commit/9e98ff080a0229112b069099fb3fad318b52145d))


### 🏗️ Build System

* ensure only one release is running at any time ([c5a09dc](https://github.com/kiva/ui/commit/c5a09dc06455f87b1368baa91c462d984251addb))

## [2.726.0](https://github.com/kiva/ui/compare/v2.725.0...v2.726.0) (2024-01-19)


### 🎉 New Features

* prefetch the goals on the teams page ([84dcaf2](https://github.com/kiva/ui/commit/84dcaf2af3b3148daca2157362165510d30ec650))


### 🐛 Bugfixes

* check all loans instead of selected loan to show CTA on thanks page ([2fb81c9](https://github.com/kiva/ui/commit/2fb81c93e74e128577b014b6bf7a740c10acde03))
* compare loans ids ([30a800b](https://github.com/kiva/ui/commit/30a800bf98b6756b733f301ef59db3da24c971df))


### 🧹 Chores

* **release:** 2.726.0-rc.1 [skip ci] ([a02ae5b](https://github.com/kiva/ui/commit/a02ae5b4b8c0beb6146e372edd6cae81c7693c2a))

## [2.726.0-rc.1](https://github.com/kiva/ui/compare/v2.725.0...v2.726.0-rc.1) (2024-01-19)


### 🎉 New Features

* prefetch the goals on the teams page ([84dcaf2](https://github.com/kiva/ui/commit/84dcaf2af3b3148daca2157362165510d30ec650))


### 🐛 Bugfixes

* check all loans instead of selected loan to show CTA on thanks page ([2fb81c9](https://github.com/kiva/ui/commit/2fb81c93e74e128577b014b6bf7a740c10acde03))
* compare loans ids ([30a800b](https://github.com/kiva/ui/commit/30a800bf98b6756b733f301ef59db3da24c971df))

## [2.725.0](https://github.com/kiva/ui/compare/v2.724.0...v2.725.0) (2024-01-17)


### 🎉 New Features

* add immediate to force watcher execution ([d31c95c](https://github.com/kiva/ui/commit/d31c95c8a21c5010780e9116fd34c203ef5eb362))
* adding simple test to notify me component ([5270ecf](https://github.com/kiva/ui/commit/5270ecf63ffa3f02373ff6f948a6a1888e0b1952))


### 🐛 Bugfixes

* calling updateLoanReservation when teamId changes ([295cf22](https://github.com/kiva/ui/commit/295cf22958436755ef2347eb4bdcd85ccef51845))
* flag was returning true because comparison between null and -1 ([d69dcbd](https://github.com/kiva/ui/commit/d69dcbd1035373037f04ae1b83f6f6671a514aa0))
* lint ([7dbb517](https://github.com/kiva/ui/commit/7dbb51703b842f0ac264cc23ef45020e8497f58a))
* remove not related comment ([3ace3a1](https://github.com/kiva/ui/commit/3ace3a12b9513d1e045a07336819348a92df2110))
* team attribution is not being assigned on not log in users ([5f9a84f](https://github.com/kiva/ui/commit/5f9a84f6ec35cdc855b54ab23ce7c686d9159209))


### 🧹 Chores

* **release:** 2.725.0-rc.1 [skip ci] ([23e4f0a](https://github.com/kiva/ui/commit/23e4f0a82634f1e3cf13e82014f19f9493f0df35))

## [2.725.0-rc.1](https://github.com/kiva/ui/compare/v2.724.0...v2.725.0-rc.1) (2024-01-17)


### 🎉 New Features

* add immediate to force watcher execution ([d31c95c](https://github.com/kiva/ui/commit/d31c95c8a21c5010780e9116fd34c203ef5eb362))
* adding simple test to notify me component ([5270ecf](https://github.com/kiva/ui/commit/5270ecf63ffa3f02373ff6f948a6a1888e0b1952))


### 🐛 Bugfixes

* calling updateLoanReservation when teamId changes ([295cf22](https://github.com/kiva/ui/commit/295cf22958436755ef2347eb4bdcd85ccef51845))
* flag was returning true because comparison between null and -1 ([d69dcbd](https://github.com/kiva/ui/commit/d69dcbd1035373037f04ae1b83f6f6671a514aa0))
* lint ([7dbb517](https://github.com/kiva/ui/commit/7dbb51703b842f0ac264cc23ef45020e8497f58a))
* remove not related comment ([3ace3a1](https://github.com/kiva/ui/commit/3ace3a12b9513d1e045a07336819348a92df2110))
* team attribution is not being assigned on not log in users ([5f9a84f](https://github.com/kiva/ui/commit/5f9a84f6ec35cdc855b54ab23ce7c686d9159209))

## [2.724.0](https://github.com/kiva/ui/compare/v2.723.0...v2.724.0) (2024-01-17)


### 🎉 New Features

* ability to attribute a loan to a team from cookie value ([2812e72](https://github.com/kiva/ui/commit/2812e72ad39089fb90cbc2c1a68afb0dd85d84c5))
* add baseline otel auto-instrumentation config ([644b15a](https://github.com/kiva/ui/commit/644b15ae874da0942482ee4092564b3df4d69f96))
* add lender images to team activity ([d4f748a](https://github.com/kiva/ui/commit/d4f748a84c2549a3259241739383d1a87f0c1f44))
* add link back to team challenge page ([28cca99](https://github.com/kiva/ui/commit/28cca99f8da7da81b24b0b233cac50345d24eaaa))
* add tracking to teams page buttons ([7880334](https://github.com/kiva/ui/commit/78803340f0870b1f64ab17e577b18d82e2aad5b3))
* challenge cta image replaced ([#5123](https://github.com/kiva/ui/issues/5123)) ([3bfcf3d](https://github.com/kiva/ui/commit/3bfcf3d664e70e5f4f831ae12eab8d543e11502b))
* clean up cookie for team challenge in basket item after using ([a2548e2](https://github.com/kiva/ui/commit/a2548e2afe5c8ac89e66e97a70f4f87c60429f56))
* clear challenge cookie after completed checkout, added unit testing ([e51bca9](https://github.com/kiva/ui/commit/e51bca9a4d9ff29e975eb8f96cc0e2e0543fb024))
* create donation banner type ([672d921](https://github.com/kiva/ui/commit/672d921a5d7e859e7709ce49f9a81d056e47b94f))
* get goal info within prefetch ([517964e](https://github.com/kiva/ui/commit/517964ea667f3c56a646ddb8878a5e9d2d6c7ad5))
* notify component image replaced ([#5124](https://github.com/kiva/ui/issues/5124)) ([b0a0446](https://github.com/kiva/ui/commit/b0a0446a706636c614a40272febc696020202cb5))
* notify me component ([a6ad481](https://github.com/kiva/ui/commit/a6ad4810842499e236c046f9452befa8c405c180))
* redirect lender that has lent to the borrower to its legacy page when it is no longer in fundraising state ([95c7cd7](https://github.com/kiva/ui/commit/95c7cd77b4a2cde86ff4cba27a520e39be46fabb))
* redirect portfolio CTA to new team challenge page ([42c9870](https://github.com/kiva/ui/commit/42c9870691bcc6f6c69782856857d7c3e8ec7905))
* small styling revision on teams cta ([a960ea7](https://github.com/kiva/ui/commit/a960ea7287aaaddd6186a6c7dac3c90d5eecef71))
* teams challenge cta on teams page ([c7009bd](https://github.com/kiva/ui/commit/c7009bd185663be671785ff5cf9f577d390108e8))


### 🐛 Bugfixes

* add config for custom host local dev ([c62f65c](https://github.com/kiva/ui/commit/c62f65c16b3dcc19e11a11eacf140fcfeba75c32))
* add event to notify me cta and add secondary bg ([0e9e3b2](https://github.com/kiva/ui/commit/0e9e3b2583b654eb96e663dd955b3edf9b331eea))
* add optional env var to disable otel sdk ([0e70ec0](https://github.com/kiva/ui/commit/0e70ec0fe422ea68e4da331618d00cbea35a8eb4))
* add sentry trace rate config defaults ([13ac855](https://github.com/kiva/ui/commit/13ac8557eee2e8752653e9523fe9134c0d5519f4))
* add trace + metric exporters ([0068f5b](https://github.com/kiva/ui/commit/0068f5b8b2cbf58627ec560996710ea682404ddb))
* allow configuration for otel endpoint ([cdf1bf5](https://github.com/kiva/ui/commit/cdf1bf545431ab1b9b57fa862e46463061d28a32))
* also clear cookie on removal from basket ([c76f76a](https://github.com/kiva/ui/commit/c76f76a0bdb9fa0b9012176d1f248923a4a6a6ee))
* apollo error ([0206295](https://github.com/kiva/ui/commit/0206295a51c56313abb1647e03e6961648f1eb2a))
* basketItem test ([fc0a19d](https://github.com/kiva/ui/commit/fc0a19d9744a3ec1034aee156f76e8933d72563a))
* change tracking events values ([f774c0a](https://github.com/kiva/ui/commit/f774c0a69cdd504cb7d5bc279dd77619b6cee4bd))
* check for name before operating on it, default to empty string ([da209ab](https://github.com/kiva/ui/commit/da209abaacc974b135ad6c3aa2218582fc7ea716))
* cleanup linting errors ([0006eb9](https://github.com/kiva/ui/commit/0006eb9c5d312f3ec7c6657dd9a55e22b978791d))
* conflicts ([4406f3c](https://github.com/kiva/ui/commit/4406f3c18b242b6b84809f15773a1b8be1a999bc))
* convert indentation to spaces ([34ed9db](https://github.com/kiva/ui/commit/34ed9db46becb46b5eaf8c9cd82fa04a2b314270))
* ensure forceTeamId is not overwritten by undefined value ([d530146](https://github.com/kiva/ui/commit/d530146cffeca61f1dbcebe08ac6d5d777ee1956))
* eslint ([3eee557](https://github.com/kiva/ui/commit/3eee557e43bdb80a10342897352f280875e48350))
* eslint and wrong formed urls ([9dc530b](https://github.com/kiva/ui/commit/9dc530b98c64dd39a5c408635711bc056d4e349e))
* events values ([98e70a8](https://github.com/kiva/ui/commit/98e70a88c01d5605b57a0ad7c12c10f3cd4a0dd6))
* get teamId ([815218c](https://github.com/kiva/ui/commit/815218cd8b17d4577a0ecc337c3b991da0781e6c))
* gql whitespace ([ac0c4b4](https://github.com/kiva/ui/commit/ac0c4b47ab2b200f65641520a72839c21737454d))
* hide lender avatars in mobile ([ffc3bc0](https://github.com/kiva/ui/commit/ffc3bc029b7a956020f2bbef25dd34b483a948ab))
* hide notify me component when loan doesnt belong to a challenge ([c5b9956](https://github.com/kiva/ui/commit/c5b9956f58698109eca6638f8af2d3bbeab8b8e2))
* iterable url ([48c919b](https://github.com/kiva/ui/commit/48c919b49a56f9bf452f1ac0f208ca65e9275006))
* lint ([f786b5f](https://github.com/kiva/ui/commit/f786b5f66eca30739ea71ebeecccd7cef4e6629a))
* mutate loan reservation on mounted ([a8c5334](https://github.com/kiva/ui/commit/a8c5334ff70225ffa59f69a01d0ebc23dc5a97be))
* my teams link in portfolio ([76e8bb1](https://github.com/kiva/ui/commit/76e8bb15d53c0236ab49d5b756b15904cb87be85))
* notify icon size updated ([#5125](https://github.com/kiva/ui/issues/5125)) ([d04575d](https://github.com/kiva/ui/commit/d04575d8837635550d233d766e1abcff5fb8f741))
* only show avatars in desktop ([4adf0ff](https://github.com/kiva/ui/commit/4adf0ff7048a6b6c761d8b4d1b501320300571db))
* remove text padding in mobile ([324bb89](https://github.com/kiva/ui/commit/324bb899cd4e6f08c9ff8afcb4fd3baaef46ab7a))
* remove unnecesary prop reference ([3ccca2b](https://github.com/kiva/ui/commit/3ccca2b8d2ec3d45e2c61dc1cbaec7030137f09a))
* remove unnecessary mark ([e1394f8](https://github.com/kiva/ui/commit/e1394f81a71112282ff908bae59d979838dc2c73))
* remove unnecessary package, reduce origins to only our domain ([b973a6f](https://github.com/kiva/ui/commit/b973a6f9904b6d8f34de67ba8559d240a1fec4a7))
* safe programming ([f1ce83f](https://github.com/kiva/ui/commit/f1ce83f1c7cae9bbbfc2587dec8a6f077fd3a694))
* styling issues with photos ([4ad67cd](https://github.com/kiva/ui/commit/4ad67cd567bab5979fa4d8ca3c1ad3ac15e5b7ff))
* team attribution tests ([a15bc06](https://github.com/kiva/ui/commit/a15bc062463a6e68204d40be17c626fe55f33942))
* teamsGoals query by adding id for image ([e157896](https://github.com/kiva/ui/commit/e1578962fcb4a11070196ded841fbdcef9895ffc))
* test ([2a53a4e](https://github.com/kiva/ui/commit/2a53a4ecc2eb8277b890661cca7ee03198aef59c))
* tracking format in View challenge button ([8a3a20b](https://github.com/kiva/ui/commit/8a3a20b2973d8ed997cfbc544045c1a1d278a1f0))
* upgrade sentry ([2247d42](https://github.com/kiva/ui/commit/2247d428709f89171426f97fb2ef1050465c6956))
* use dev iterable list for testing and replace icon for materialUI ([b3e2fcd](https://github.com/kiva/ui/commit/b3e2fcdb4237e0a7538373a5737985998992e7c8))
* user that has lent to a borrower was not being redirected due to amountLeft being not zero ([88d7b05](https://github.com/kiva/ui/commit/88d7b05d6359129ac52854090bb924f6fce5dddf))
* wrapping donation banner headline ([9e57883](https://github.com/kiva/ui/commit/9e5788322daad0a0fd785b15505be5a79b68eba7))


### 🪚 Refactors

* methods to get loans and team id ([072bc57](https://github.com/kiva/ui/commit/072bc57ea0092d29def455f42c349d9d5d88e232))
* remove old donate pages code since they are now handled by cps ([6ecca6b](https://github.com/kiva/ui/commit/6ecca6bf9131d186b85e852e298a5e3957e44f29))
* use loan declaration for lentTo variable ([ca91daf](https://github.com/kiva/ui/commit/ca91dafe1266580bfedeb791f47b8e8b6cc1d94c))


### 🔍 Tests

* ensure teams are loaded on Checkout Page to get forceTeamId ([bd1ea4a](https://github.com/kiva/ui/commit/bd1ea4a82beac1b69f5f5950c0d49a56d381e097))
* getting goal info before page loads ([90b5ca1](https://github.com/kiva/ui/commit/90b5ca1f7fb67453702f674e5c3fe22a8645ec94))


### 🧹 Chores

* **release:** 2.724.0-rc.1 [skip ci] ([52365e4](https://github.com/kiva/ui/commit/52365e45f23ae082dc3e79b259f362438cc991b0)), closes [#5123](https://github.com/kiva/ui/issues/5123) [#5124](https://github.com/kiva/ui/issues/5124) [#5125](https://github.com/kiva/ui/issues/5125)
* **release:** 2.724.0-rc.2 [skip ci] ([d0577fc](https://github.com/kiva/ui/commit/d0577fcdcd822dc34b819b3f3999bcbebd8f32ef))

## [2.724.0-rc.2](https://github.com/kiva/ui/compare/v2.724.0-rc.1...v2.724.0-rc.2) (2024-01-17)


### 🐛 Bugfixes

* basketItem test ([fc0a19d](https://github.com/kiva/ui/commit/fc0a19d9744a3ec1034aee156f76e8933d72563a))
* ensure forceTeamId is not overwritten by undefined value ([d530146](https://github.com/kiva/ui/commit/d530146cffeca61f1dbcebe08ac6d5d777ee1956))
* mutate loan reservation on mounted ([a8c5334](https://github.com/kiva/ui/commit/a8c5334ff70225ffa59f69a01d0ebc23dc5a97be))
* team attribution tests ([a15bc06](https://github.com/kiva/ui/commit/a15bc062463a6e68204d40be17c626fe55f33942))
* test ([2a53a4e](https://github.com/kiva/ui/commit/2a53a4ecc2eb8277b890661cca7ee03198aef59c))

## [2.724.0-rc.1](https://github.com/kiva/ui/compare/v2.723.0...v2.724.0-rc.1) (2024-01-16)


### 🎉 New Features

* ability to attribute a loan to a team from cookie value ([2812e72](https://github.com/kiva/ui/commit/2812e72ad39089fb90cbc2c1a68afb0dd85d84c5))
* add baseline otel auto-instrumentation config ([644b15a](https://github.com/kiva/ui/commit/644b15ae874da0942482ee4092564b3df4d69f96))
* add lender images to team activity ([d4f748a](https://github.com/kiva/ui/commit/d4f748a84c2549a3259241739383d1a87f0c1f44))
* add link back to team challenge page ([28cca99](https://github.com/kiva/ui/commit/28cca99f8da7da81b24b0b233cac50345d24eaaa))
* add tracking to teams page buttons ([7880334](https://github.com/kiva/ui/commit/78803340f0870b1f64ab17e577b18d82e2aad5b3))
* challenge cta image replaced ([#5123](https://github.com/kiva/ui/issues/5123)) ([3bfcf3d](https://github.com/kiva/ui/commit/3bfcf3d664e70e5f4f831ae12eab8d543e11502b))
* clean up cookie for team challenge in basket item after using ([a2548e2](https://github.com/kiva/ui/commit/a2548e2afe5c8ac89e66e97a70f4f87c60429f56))
* clear challenge cookie after completed checkout, added unit testing ([e51bca9](https://github.com/kiva/ui/commit/e51bca9a4d9ff29e975eb8f96cc0e2e0543fb024))
* create donation banner type ([672d921](https://github.com/kiva/ui/commit/672d921a5d7e859e7709ce49f9a81d056e47b94f))
* get goal info within prefetch ([517964e](https://github.com/kiva/ui/commit/517964ea667f3c56a646ddb8878a5e9d2d6c7ad5))
* notify component image replaced ([#5124](https://github.com/kiva/ui/issues/5124)) ([b0a0446](https://github.com/kiva/ui/commit/b0a0446a706636c614a40272febc696020202cb5))
* notify me component ([a6ad481](https://github.com/kiva/ui/commit/a6ad4810842499e236c046f9452befa8c405c180))
* redirect lender that has lent to the borrower to its legacy page when it is no longer in fundraising state ([95c7cd7](https://github.com/kiva/ui/commit/95c7cd77b4a2cde86ff4cba27a520e39be46fabb))
* redirect portfolio CTA to new team challenge page ([42c9870](https://github.com/kiva/ui/commit/42c9870691bcc6f6c69782856857d7c3e8ec7905))
* small styling revision on teams cta ([a960ea7](https://github.com/kiva/ui/commit/a960ea7287aaaddd6186a6c7dac3c90d5eecef71))
* teams challenge cta on teams page ([c7009bd](https://github.com/kiva/ui/commit/c7009bd185663be671785ff5cf9f577d390108e8))


### 🐛 Bugfixes

* add config for custom host local dev ([c62f65c](https://github.com/kiva/ui/commit/c62f65c16b3dcc19e11a11eacf140fcfeba75c32))
* add event to notify me cta and add secondary bg ([0e9e3b2](https://github.com/kiva/ui/commit/0e9e3b2583b654eb96e663dd955b3edf9b331eea))
* add optional env var to disable otel sdk ([0e70ec0](https://github.com/kiva/ui/commit/0e70ec0fe422ea68e4da331618d00cbea35a8eb4))
* add sentry trace rate config defaults ([13ac855](https://github.com/kiva/ui/commit/13ac8557eee2e8752653e9523fe9134c0d5519f4))
* add trace + metric exporters ([0068f5b](https://github.com/kiva/ui/commit/0068f5b8b2cbf58627ec560996710ea682404ddb))
* allow configuration for otel endpoint ([cdf1bf5](https://github.com/kiva/ui/commit/cdf1bf545431ab1b9b57fa862e46463061d28a32))
* also clear cookie on removal from basket ([c76f76a](https://github.com/kiva/ui/commit/c76f76a0bdb9fa0b9012176d1f248923a4a6a6ee))
* apollo error ([0206295](https://github.com/kiva/ui/commit/0206295a51c56313abb1647e03e6961648f1eb2a))
* change tracking events values ([f774c0a](https://github.com/kiva/ui/commit/f774c0a69cdd504cb7d5bc279dd77619b6cee4bd))
* check for name before operating on it, default to empty string ([da209ab](https://github.com/kiva/ui/commit/da209abaacc974b135ad6c3aa2218582fc7ea716))
* cleanup linting errors ([0006eb9](https://github.com/kiva/ui/commit/0006eb9c5d312f3ec7c6657dd9a55e22b978791d))
* conflicts ([4406f3c](https://github.com/kiva/ui/commit/4406f3c18b242b6b84809f15773a1b8be1a999bc))
* convert indentation to spaces ([34ed9db](https://github.com/kiva/ui/commit/34ed9db46becb46b5eaf8c9cd82fa04a2b314270))
* eslint ([3eee557](https://github.com/kiva/ui/commit/3eee557e43bdb80a10342897352f280875e48350))
* eslint and wrong formed urls ([9dc530b](https://github.com/kiva/ui/commit/9dc530b98c64dd39a5c408635711bc056d4e349e))
* events values ([98e70a8](https://github.com/kiva/ui/commit/98e70a88c01d5605b57a0ad7c12c10f3cd4a0dd6))
* get teamId ([815218c](https://github.com/kiva/ui/commit/815218cd8b17d4577a0ecc337c3b991da0781e6c))
* gql whitespace ([ac0c4b4](https://github.com/kiva/ui/commit/ac0c4b47ab2b200f65641520a72839c21737454d))
* hide lender avatars in mobile ([ffc3bc0](https://github.com/kiva/ui/commit/ffc3bc029b7a956020f2bbef25dd34b483a948ab))
* hide notify me component when loan doesnt belong to a challenge ([c5b9956](https://github.com/kiva/ui/commit/c5b9956f58698109eca6638f8af2d3bbeab8b8e2))
* iterable url ([48c919b](https://github.com/kiva/ui/commit/48c919b49a56f9bf452f1ac0f208ca65e9275006))
* lint ([f786b5f](https://github.com/kiva/ui/commit/f786b5f66eca30739ea71ebeecccd7cef4e6629a))
* my teams link in portfolio ([76e8bb1](https://github.com/kiva/ui/commit/76e8bb15d53c0236ab49d5b756b15904cb87be85))
* notify icon size updated ([#5125](https://github.com/kiva/ui/issues/5125)) ([d04575d](https://github.com/kiva/ui/commit/d04575d8837635550d233d766e1abcff5fb8f741))
* only show avatars in desktop ([4adf0ff](https://github.com/kiva/ui/commit/4adf0ff7048a6b6c761d8b4d1b501320300571db))
* remove text padding in mobile ([324bb89](https://github.com/kiva/ui/commit/324bb899cd4e6f08c9ff8afcb4fd3baaef46ab7a))
* remove unnecesary prop reference ([3ccca2b](https://github.com/kiva/ui/commit/3ccca2b8d2ec3d45e2c61dc1cbaec7030137f09a))
* remove unnecessary mark ([e1394f8](https://github.com/kiva/ui/commit/e1394f81a71112282ff908bae59d979838dc2c73))
* remove unnecessary package, reduce origins to only our domain ([b973a6f](https://github.com/kiva/ui/commit/b973a6f9904b6d8f34de67ba8559d240a1fec4a7))
* safe programming ([f1ce83f](https://github.com/kiva/ui/commit/f1ce83f1c7cae9bbbfc2587dec8a6f077fd3a694))
* styling issues with photos ([4ad67cd](https://github.com/kiva/ui/commit/4ad67cd567bab5979fa4d8ca3c1ad3ac15e5b7ff))
* teamsGoals query by adding id for image ([e157896](https://github.com/kiva/ui/commit/e1578962fcb4a11070196ded841fbdcef9895ffc))
* tracking format in View challenge button ([8a3a20b](https://github.com/kiva/ui/commit/8a3a20b2973d8ed997cfbc544045c1a1d278a1f0))
* upgrade sentry ([2247d42](https://github.com/kiva/ui/commit/2247d428709f89171426f97fb2ef1050465c6956))
* use dev iterable list for testing and replace icon for materialUI ([b3e2fcd](https://github.com/kiva/ui/commit/b3e2fcdb4237e0a7538373a5737985998992e7c8))
* user that has lent to a borrower was not being redirected due to amountLeft being not zero ([88d7b05](https://github.com/kiva/ui/commit/88d7b05d6359129ac52854090bb924f6fce5dddf))
* wrapping donation banner headline ([9e57883](https://github.com/kiva/ui/commit/9e5788322daad0a0fd785b15505be5a79b68eba7))


### 🪚 Refactors

* methods to get loans and team id ([072bc57](https://github.com/kiva/ui/commit/072bc57ea0092d29def455f42c349d9d5d88e232))
* remove old donate pages code since they are now handled by cps ([6ecca6b](https://github.com/kiva/ui/commit/6ecca6bf9131d186b85e852e298a5e3957e44f29))
* use loan declaration for lentTo variable ([ca91daf](https://github.com/kiva/ui/commit/ca91dafe1266580bfedeb791f47b8e8b6cc1d94c))


### 🔍 Tests

* ensure teams are loaded on Checkout Page to get forceTeamId ([bd1ea4a](https://github.com/kiva/ui/commit/bd1ea4a82beac1b69f5f5950c0d49a56d381e097))
* getting goal info before page loads ([90b5ca1](https://github.com/kiva/ui/commit/90b5ca1f7fb67453702f674e5c3fe22a8645ec94))

## [2.723.0](https://github.com/kiva/ui/compare/v2.722.0...v2.723.0) (2023-12-13)


### 🎉 New Features

* add education placement in borrower profile based on region ([2c22a0e](https://github.com/kiva/ui/commit/2c22a0e21d40ccec67a37ac7c36e14dbf34de96a))
* add prometheus metrics ([adb7872](https://github.com/kiva/ui/commit/adb7872fe1794c7625009e9ae518aa0a7d1a5ad7))
* add some test ids to target in robot tests ([7096d88](https://github.com/kiva/ui/commit/7096d88b965f0d262f13d6c2d225eec74d46dd85))
* add tests ids to portfolio elements ([2bcb7b5](https://github.com/kiva/ui/commit/2bcb7b562f49b73c334d17e2325277660a9299c0))
* adding test id to bonus history ([9808860](https://github.com/kiva/ui/commit/9808860b9228e504691850e7a84f693005234aba))
* change portfolio cta art ([3f8dbc5](https://github.com/kiva/ui/commit/3f8dbc599402e4b32c8ff90cc68901ac17e8766d))
* **FakeAuthentication:** use headers for fake auth instead of url parameters CP-677 ([33fb71f](https://github.com/kiva/ui/commit/33fb71f35cb6e8e3fb8da74eae513ec89c3ddc14))
* hide loan upsell for donation-only baskets ([694c655](https://github.com/kiva/ui/commit/694c65586ad53fd3b78ddd9f1c5154385f7edc1b))
* homepage file cleaned up ([#5079](https://github.com/kiva/ui/issues/5079)) ([c5c8261](https://github.com/kiva/ui/commit/c5c8261553d516cd1dd9b6897a107847bc6c2767))
* lend menu buttons test code removed ([#5078](https://github.com/kiva/ui/issues/5078)) ([d37a627](https://github.com/kiva/ui/commit/d37a6271c73670a3eb6bbdfa28d2d0386ed83718))
* loan comment modal added to portfolio page ([#5075](https://github.com/kiva/ui/issues/5075)) ([9a47cde](https://github.com/kiva/ui/commit/9a47cde0b6e527f55c20d6d165cdb9af9abdf149))
* matched loans filter added to filter page ([#5073](https://github.com/kiva/ui/issues/5073)) ([cbc085b](https://github.com/kiva/ui/commit/cbc085b120e36e8143e1d8f84ebb5370e840cb33))
* mobile filter cta copy updated in filter page ([#5071](https://github.com/kiva/ui/issues/5071)) ([c777c7b](https://github.com/kiva/ui/commit/c777c7b179e0ac1ecd895c59a860f7da9d09a2db))
* supply donate cta test code removed ([#5076](https://github.com/kiva/ui/issues/5076)) ([249e2c6](https://github.com/kiva/ui/commit/249e2c611b2fcc8356a9602aec20ec54613ffef7))
* tip rate optimization test code removed ([#5077](https://github.com/kiva/ui/issues/5077)) ([d609987](https://github.com/kiva/ui/commit/d6099870d3c4d48cbab8b0447083b470b4707ff5))
* update events when user clicks No donation and enters /bin/zsh in the custom amount box ([1b9f6d9](https://github.com/kiva/ui/commit/1b9f6d9b4f27dca05fbd53d7bc69e180a9113c1a))


### 🐛 Bugfixes

* change variant variable ([af90786](https://github.com/kiva/ui/commit/af90786fd385c071f8b7cc20be8ad0aecc671662))
* experiment flag default value ([863e505](https://github.com/kiva/ui/commit/863e505c78e012aa4fff934d37f56f47e70d017a))
* generalize the donation tag line when no loans in basket ([8f42e60](https://github.com/kiva/ui/commit/8f42e60e8f1309e6e51c43b6eae846033cf41e15))
* guard against missing fields and draft ui-global-promo banners ([dfa8c8e](https://github.com/kiva/ui/commit/dfa8c8e712650850354f4533803831b83a046eb4))
* missing const for prometheus middleware ([3d5d5c9](https://github.com/kiva/ui/commit/3d5d5c918d1dbadfb9a19ea2ac07cce90c99fb3c))
* only reference loans if there are loans in the basket ([80ba549](https://github.com/kiva/ui/commit/80ba549ce7477eb92ac350118771ced09737f197))
* temporarily increase prod pod count and request capacity ([0e11c9d](https://github.com/kiva/ui/commit/0e11c9dce33d5a9d0963c98d5eaa100b4335807b))
* text should be shown for all time leaderboard ([2468c72](https://github.com/kiva/ui/commit/2468c72b70e0ee6526129b50df8fb3fe6a4a2ae8))


### 🏗️ Build System

* pass along release environment variable ([07a7cd8](https://github.com/kiva/ui/commit/07a7cd86d7fa718d558d36bade213a9b1fdb6932))


### 🪚 Refactors

* more comprehensible zero_upsell expire calculation ([368c8d8](https://github.com/kiva/ui/commit/368c8d8abae48026a7b7b8806e9d3ad6a2c2ede9))


### 🧹 Chores

* **release:** 2.723.0-rc.1 [skip ci] ([678f197](https://github.com/kiva/ui/commit/678f197246f265b21dfdeba658879d349b7ba6eb)), closes [#5079](https://github.com/kiva/ui/issues/5079) [#5078](https://github.com/kiva/ui/issues/5078) [#5075](https://github.com/kiva/ui/issues/5075) [#5073](https://github.com/kiva/ui/issues/5073) [#5071](https://github.com/kiva/ui/issues/5071) [#5076](https://github.com/kiva/ui/issues/5076) [#5077](https://github.com/kiva/ui/issues/5077)
* **release:** 2.723.0-rc.2 [skip ci] ([091f2fe](https://github.com/kiva/ui/commit/091f2feffbb0d1f875f0c290f304ace7323db1e3))

## [2.723.0-rc.2](https://github.com/kiva/ui/compare/v2.723.0-rc.1...v2.723.0-rc.2) (2023-12-13)


### 🎉 New Features

* add prometheus metrics ([adb7872](https://github.com/kiva/ui/commit/adb7872fe1794c7625009e9ae518aa0a7d1a5ad7))
* **FakeAuthentication:** use headers for fake auth instead of url parameters CP-677 ([33fb71f](https://github.com/kiva/ui/commit/33fb71f35cb6e8e3fb8da74eae513ec89c3ddc14))
* update events when user clicks No donation and enters /bin/zsh in the custom amount box ([1b9f6d9](https://github.com/kiva/ui/commit/1b9f6d9b4f27dca05fbd53d7bc69e180a9113c1a))


### 🐛 Bugfixes

* missing const for prometheus middleware ([3d5d5c9](https://github.com/kiva/ui/commit/3d5d5c918d1dbadfb9a19ea2ac07cce90c99fb3c))


### 🪚 Refactors

* more comprehensible zero_upsell expire calculation ([368c8d8](https://github.com/kiva/ui/commit/368c8d8abae48026a7b7b8806e9d3ad6a2c2ede9))

## [2.723.0-rc.1](https://github.com/kiva/ui/compare/v2.722.0...v2.723.0-rc.1) (2023-12-07)


### 🎉 New Features

* add education placement in borrower profile based on region ([2c22a0e](https://github.com/kiva/ui/commit/2c22a0e21d40ccec67a37ac7c36e14dbf34de96a))
* add some test ids to target in robot tests ([7096d88](https://github.com/kiva/ui/commit/7096d88b965f0d262f13d6c2d225eec74d46dd85))
* add tests ids to portfolio elements ([2bcb7b5](https://github.com/kiva/ui/commit/2bcb7b562f49b73c334d17e2325277660a9299c0))
* adding test id to bonus history ([9808860](https://github.com/kiva/ui/commit/9808860b9228e504691850e7a84f693005234aba))
* change portfolio cta art ([3f8dbc5](https://github.com/kiva/ui/commit/3f8dbc599402e4b32c8ff90cc68901ac17e8766d))
* hide loan upsell for donation-only baskets ([694c655](https://github.com/kiva/ui/commit/694c65586ad53fd3b78ddd9f1c5154385f7edc1b))
* homepage file cleaned up ([#5079](https://github.com/kiva/ui/issues/5079)) ([c5c8261](https://github.com/kiva/ui/commit/c5c8261553d516cd1dd9b6897a107847bc6c2767))
* lend menu buttons test code removed ([#5078](https://github.com/kiva/ui/issues/5078)) ([d37a627](https://github.com/kiva/ui/commit/d37a6271c73670a3eb6bbdfa28d2d0386ed83718))
* loan comment modal added to portfolio page ([#5075](https://github.com/kiva/ui/issues/5075)) ([9a47cde](https://github.com/kiva/ui/commit/9a47cde0b6e527f55c20d6d165cdb9af9abdf149))
* matched loans filter added to filter page ([#5073](https://github.com/kiva/ui/issues/5073)) ([cbc085b](https://github.com/kiva/ui/commit/cbc085b120e36e8143e1d8f84ebb5370e840cb33))
* mobile filter cta copy updated in filter page ([#5071](https://github.com/kiva/ui/issues/5071)) ([c777c7b](https://github.com/kiva/ui/commit/c777c7b179e0ac1ecd895c59a860f7da9d09a2db))
* supply donate cta test code removed ([#5076](https://github.com/kiva/ui/issues/5076)) ([249e2c6](https://github.com/kiva/ui/commit/249e2c611b2fcc8356a9602aec20ec54613ffef7))
* tip rate optimization test code removed ([#5077](https://github.com/kiva/ui/issues/5077)) ([d609987](https://github.com/kiva/ui/commit/d6099870d3c4d48cbab8b0447083b470b4707ff5))


### 🐛 Bugfixes

* change variant variable ([af90786](https://github.com/kiva/ui/commit/af90786fd385c071f8b7cc20be8ad0aecc671662))
* experiment flag default value ([863e505](https://github.com/kiva/ui/commit/863e505c78e012aa4fff934d37f56f47e70d017a))
* generalize the donation tag line when no loans in basket ([8f42e60](https://github.com/kiva/ui/commit/8f42e60e8f1309e6e51c43b6eae846033cf41e15))
* guard against missing fields and draft ui-global-promo banners ([dfa8c8e](https://github.com/kiva/ui/commit/dfa8c8e712650850354f4533803831b83a046eb4))
* only reference loans if there are loans in the basket ([80ba549](https://github.com/kiva/ui/commit/80ba549ce7477eb92ac350118771ced09737f197))
* temporarily increase prod pod count and request capacity ([0e11c9d](https://github.com/kiva/ui/commit/0e11c9dce33d5a9d0963c98d5eaa100b4335807b))
* text should be shown for all time leaderboard ([2468c72](https://github.com/kiva/ui/commit/2468c72b70e0ee6526129b50df8fb3fe6a4a2ae8))


### 🏗️ Build System

* pass along release environment variable ([07a7cd8](https://github.com/kiva/ui/commit/07a7cd86d7fa718d558d36bade213a9b1fdb6932))

## [2.722.0](https://github.com/kiva/ui/compare/v2.721.1...v2.722.0) (2023-12-06)


### 🎉 New Features

* change portfolio cta art ([099f642](https://github.com/kiva/ui/commit/099f642c820efbe7749b3c06f7bb99f39d3ccdd4))


### 🧹 Chores

* **release:** 2.722.0-rc.1 [skip ci] ([e5a582a](https://github.com/kiva/ui/commit/e5a582acb53dd82560408400b03168f955e7f96c))

## [2.722.0-rc.1](https://github.com/kiva/ui/compare/v2.721.1...v2.722.0-rc.1) (2023-12-06)


### 🎉 New Features

* change portfolio cta art ([099f642](https://github.com/kiva/ui/commit/099f642c820efbe7749b3c06f7bb99f39d3ccdd4))

## [2.721.1](https://github.com/kiva/ui/compare/v2.721.0...v2.721.1) (2023-11-29)


### 🐛 Bugfixes

* temporarily increase prod pod count and request capacity ([f41e1e1](https://github.com/kiva/ui/commit/f41e1e1acb4fbef716bca8b51833683109f62325))


### 🧹 Chores

* **release:** 2.721.1-rc.1 [skip ci] ([7d85f1a](https://github.com/kiva/ui/commit/7d85f1ac5a39e5c4a8fecd5ba81d0a2634d4877f))

## [2.721.1-rc.1](https://github.com/kiva/ui/compare/v2.721.0...v2.721.1-rc.1) (2023-11-29)


### 🐛 Bugfixes

* temporarily increase prod pod count and request capacity ([f41e1e1](https://github.com/kiva/ui/commit/f41e1e1acb4fbef716bca8b51833683109f62325))

## [2.721.0](https://github.com/kiva/ui/compare/v2.720.0...v2.721.0) (2023-11-28)


### 🎉 New Features

* hide loan upsell for donation-only baskets ([ad6ca96](https://github.com/kiva/ui/commit/ad6ca962614982cbc4c0950c78d9afa634a1ef68))


### 🐛 Bugfixes

* generalize the donation tag line when no loans in basket ([36f812a](https://github.com/kiva/ui/commit/36f812adc39d8ffe0d40aa772a08df94aaf6bc9f))
* only reference loans if there are loans in the basket ([3d40e5d](https://github.com/kiva/ui/commit/3d40e5d428c128de18d9c07408541129ebd17d6e))


### 🧹 Chores

* **release:** 2.720.1-rc.1 [skip ci] ([d8f794c](https://github.com/kiva/ui/commit/d8f794c96663aba0f3f9f43ea74985e74a1ac430))
* **release:** 2.721.0-rc.1 [skip ci] ([a246576](https://github.com/kiva/ui/commit/a24657626fd7b0104d763f077c63d0f403229deb))

## [2.721.0-rc.1](https://github.com/kiva/ui/compare/v2.720.1-rc.1...v2.721.0-rc.1) (2023-11-28)


### 🎉 New Features

* hide loan upsell for donation-only baskets ([ad6ca96](https://github.com/kiva/ui/commit/ad6ca962614982cbc4c0950c78d9afa634a1ef68))

## [2.720.1-rc.1](https://github.com/kiva/ui/compare/v2.720.0...v2.720.1-rc.1) (2023-11-27)


### 🐛 Bugfixes

* generalize the donation tag line when no loans in basket ([36f812a](https://github.com/kiva/ui/commit/36f812adc39d8ffe0d40aa772a08df94aaf6bc9f))
* only reference loans if there are loans in the basket ([3d40e5d](https://github.com/kiva/ui/commit/3d40e5d428c128de18d9c07408541129ebd17d6e))

## [2.720.0](https://github.com/kiva/ui/compare/v2.719.1...v2.720.0) (2023-11-14)


### 🎉 New Features

* increase edit donation amount from modal ([352531e](https://github.com/kiva/ui/commit/352531e85e46e4d93906d42483f8b9f29f18cd11))
* run release and release build in same workflow ([7e4c927](https://github.com/kiva/ui/commit/7e4c92740c38140bc99c3b54663b15c697d55621))
* team challenge section added to portfolio page ([#5064](https://github.com/kiva/ui/issues/5064)) ([a28266d](https://github.com/kiva/ui/commit/a28266db785fbbdcf0ca2ef04e3f2ed64e53138c))


### 🐛 Bugfixes

* add option for alternate api audience ([f210f07](https://github.com/kiva/ui/commit/f210f072c79dc48a7650eda6ce1839a1a3ce0cef))
* allow passing in full api url ([fc183ad](https://github.com/kiva/ui/commit/fc183adb3c7fd63ed0c89abff3d02d071b685aba))
* ensure docker build push runs for successful semantic releases ([ed88f23](https://github.com/kiva/ui/commit/ed88f23bdc503b54440540c713389ac4accd4786))
* ensure server api url uses passed env var too ([5fe7a95](https://github.com/kiva/ui/commit/5fe7a9528dce391a1e181ec40888fe404a0e60db))
* ensure we use cached possible types, config updates for local login state ([c7bc015](https://github.com/kiva/ui/commit/c7bc015589d888fe64a6442a2ba995ef58d10cc2))
* remove previous build process for tags ([d64c866](https://github.com/kiva/ui/commit/d64c86600e47cf0a9988264053cd6815a621072f))
* turn off apollo batching for ui in all evns including prod ([241639f](https://github.com/kiva/ui/commit/241639ff141f15f889b3e86892091d08d501cfba))
* use git tag source for docker image build ([5018170](https://github.com/kiva/ui/commit/5018170c9fbadd4dff3fc1368e13edd77ad20326))


### 🏗️ Build System

* also run semantic release on stage & production branch pushes ([c65a2f2](https://github.com/kiva/ui/commit/c65a2f2802a8fb679102bc773714a485f5cb4b0d))
* persist credentials that use the kiva robot pat ([2f4f4e9](https://github.com/kiva/ui/commit/2f4f4e93b8174aa1772ff7653c8e35f68455b42e))


### 🪚 Refactors

* remove unused field and use util to get feature flag value ([94c3468](https://github.com/kiva/ui/commit/94c3468f1cd2a18645b27c281fb3ba28636e8516))


### 🧹 Chores

* **release:** 2.720.0-rc.1 [skip ci] ([9a61fc5](https://github.com/kiva/ui/commit/9a61fc5b4c72dd7fb331e7a8e5ded8dd9af3362e)), closes [#5064](https://github.com/kiva/ui/issues/5064)
* **release:** 2.720.0-rc.2 [skip ci] ([a5a572b](https://github.com/kiva/ui/commit/a5a572b6117488770c1f732893b98d3adc40531b))
* **release:** 2.720.0-rc.3 [skip ci] ([a31089f](https://github.com/kiva/ui/commit/a31089f92422c39c7ee4307d51c9f72bbb18144a))
* **release:** 2.720.0-rc.4 [skip ci] ([1cff9a2](https://github.com/kiva/ui/commit/1cff9a2ed4694caa7f65d42c72161a0d2d245f0b))
* **release:** 2.720.0-rc.5 [skip ci] ([afbd234](https://github.com/kiva/ui/commit/afbd234ce380bd1b5d0448287726de09d24b740f))

## [2.720.0-rc.5](https://github.com/kiva/ui/compare/v2.720.0-rc.4...v2.720.0-rc.5) (2023-11-13)


### 🐛 Bugfixes

* add option for alternate api audience ([f210f07](https://github.com/kiva/ui/commit/f210f072c79dc48a7650eda6ce1839a1a3ce0cef))

## [2.720.0-rc.4](https://github.com/kiva/ui/compare/v2.720.0-rc.3...v2.720.0-rc.4) (2023-11-10)


### 🐛 Bugfixes

* ensure server api url uses passed env var too ([5fe7a95](https://github.com/kiva/ui/commit/5fe7a9528dce391a1e181ec40888fe404a0e60db))

## [2.720.0-rc.3](https://github.com/kiva/ui/compare/v2.720.0-rc.2...v2.720.0-rc.3) (2023-11-10)


### 🐛 Bugfixes

* allow passing in full api url ([fc183ad](https://github.com/kiva/ui/commit/fc183adb3c7fd63ed0c89abff3d02d071b685aba))

## [2.720.0-rc.2](https://github.com/kiva/ui/compare/v2.720.0-rc.1...v2.720.0-rc.2) (2023-11-10)


### 🐛 Bugfixes

* turn off apollo batching for ui in all evns including prod ([241639f](https://github.com/kiva/ui/commit/241639ff141f15f889b3e86892091d08d501cfba))

## [2.720.0-rc.1](https://github.com/kiva/ui/compare/v2.719.1...v2.720.0-rc.1) (2023-11-09)


### 🎉 New Features

* increase edit donation amount from modal ([352531e](https://github.com/kiva/ui/commit/352531e85e46e4d93906d42483f8b9f29f18cd11))
* run release and release build in same workflow ([7e4c927](https://github.com/kiva/ui/commit/7e4c92740c38140bc99c3b54663b15c697d55621))
* team challenge section added to portfolio page ([#5064](https://github.com/kiva/ui/issues/5064)) ([a28266d](https://github.com/kiva/ui/commit/a28266db785fbbdcf0ca2ef04e3f2ed64e53138c))


### 🐛 Bugfixes

* ensure docker build push runs for successful semantic releases ([ed88f23](https://github.com/kiva/ui/commit/ed88f23bdc503b54440540c713389ac4accd4786))
* ensure we use cached possible types, config updates for local login state ([c7bc015](https://github.com/kiva/ui/commit/c7bc015589d888fe64a6442a2ba995ef58d10cc2))
* remove previous build process for tags ([d64c866](https://github.com/kiva/ui/commit/d64c86600e47cf0a9988264053cd6815a621072f))
* use git tag source for docker image build ([5018170](https://github.com/kiva/ui/commit/5018170c9fbadd4dff3fc1368e13edd77ad20326))


### 🏗️ Build System

* also run semantic release on stage & production branch pushes ([c65a2f2](https://github.com/kiva/ui/commit/c65a2f2802a8fb679102bc773714a485f5cb4b0d))
* persist credentials that use the kiva robot pat ([2f4f4e9](https://github.com/kiva/ui/commit/2f4f4e93b8174aa1772ff7653c8e35f68455b42e))


### 🪚 Refactors

* remove unused field and use util to get feature flag value ([94c3468](https://github.com/kiva/ui/commit/94c3468f1cd2a18645b27c281fb3ba28636e8516))

## [2.719.1](https://github.com/kiva/ui/compare/v2.719.0...v2.719.1) (2023-11-07)


### 🐛 Bugfixes

* remove unused component comment ([a802ba2](https://github.com/kiva/ui/commit/a802ba24badf8ce0fb946a0f79a58e21472719f5))


### 💅 Code Style Changes

* move cache setting arguments to separate line ([36ce485](https://github.com/kiva/ui/commit/36ce4852b8064d0973976de692755f773e80850b))


### 🧹 Chores

* **release:** 2.719.1-rc.1 ([29cfbbd](https://github.com/kiva/ui/commit/29cfbbd63ee3204b1f264ef669aa1aeaf5262801))

## [2.719.1-rc.1](https://github.com/kiva/ui/compare/v2.719.0...v2.719.1-rc.1) (2023-11-07)


### 🐛 Bugfixes

* remove unused component comment ([a802ba2](https://github.com/kiva/ui/commit/a802ba24badf8ce0fb946a0f79a58e21472719f5))


### 💅 Code Style Changes

* move cache setting arguments to separate line ([36ce485](https://github.com/kiva/ui/commit/36ce4852b8064d0973976de692755f773e80850b))

## [2.719.0](https://github.com/kiva/ui/compare/v2.718.0...v2.719.0) (2023-11-07)


### 🎉 New Features

* semantic-release actions ([243ce6f](https://github.com/kiva/ui/commit/243ce6f67db3a0f6e270ce2ab1fbcbfc2c4e926c))
* use node.js config for semantic-release ([20a2b9f](https://github.com/kiva/ui/commit/20a2b9ff7d979f016cf64383ea34b6f34e69202f))


### 🐛 Bugfixes

* change query param on new teams page ([a1a47ac](https://github.com/kiva/ui/commit/a1a47aceecb05fa0d44c9fd1ed5fb655f1223d5c))
* move ftd settings query to checkoutSettings file, add basic sentry log for missing data ([646915b](https://github.com/kiva/ui/commit/646915b6b1b1b710670bf14a4d151558a775dcc0))
* remove ambiguous text color class ([619a2e2](https://github.com/kiva/ui/commit/619a2e232a5fa14a579fbe423b8f600abec16c99))
* spacing between components ([0fc1f6e](https://github.com/kiva/ui/commit/0fc1f6e4772ef18d8aa35cb4d5d92465483932f7))


### 🏗️ Build System

* stop git credentials used for checkout from persisting to other actions ([dff4721](https://github.com/kiva/ui/commit/dff4721a8e9d71c2c6f456394b9a3136469fb5ca))


### 📚 Documentation Changes

* [2.718.0-rc.1] update CHANGELOG.md for main [skip ci] ([b7ec5ad](https://github.com/kiva/ui/commit/b7ec5add827b2f0958221de6d68a6d0cafeedae9))


### 🧹 Chores

* [2.718.0-rc.1] update version in package.json for main [skip ci] ([2255f9b](https://github.com/kiva/ui/commit/2255f9baf491082f768a91655380d4f27ddeeed4))
* **release:** 2.719.0-rc.1 ([b675e95](https://github.com/kiva/ui/commit/b675e954665788adf67896426b7ed90a1b209bb1))
* **release:** 2.719.0-rc.2 ([149afb3](https://github.com/kiva/ui/commit/149afb3369a929772c6321b4ead1a0e442779716))
* update local dev endpoints ([92c3877](https://github.com/kiva/ui/commit/92c387781c449b6e6115da79ca647ece4131e504))

## [2.719.0-rc.2](https://github.com/kiva/ui/compare/v2.719.0-rc.1...v2.719.0-rc.2) (2023-11-07)


### 🐛 Bugfixes

* remove ambiguous text color class ([619a2e2](https://github.com/kiva/ui/commit/619a2e232a5fa14a579fbe423b8f600abec16c99))

## [2.719.0-rc.1](https://github.com/kiva/ui/compare/v2.718.0...v2.719.0-rc.1) (2023-11-07)


### 🎉 New Features

* semantic-release actions ([243ce6f](https://github.com/kiva/ui/commit/243ce6f67db3a0f6e270ce2ab1fbcbfc2c4e926c))
* use node.js config for semantic-release ([20a2b9f](https://github.com/kiva/ui/commit/20a2b9ff7d979f016cf64383ea34b6f34e69202f))


### 🐛 Bugfixes

* change query param on new teams page ([a1a47ac](https://github.com/kiva/ui/commit/a1a47aceecb05fa0d44c9fd1ed5fb655f1223d5c))
* move ftd settings query to checkoutSettings file, add basic sentry log for missing data ([646915b](https://github.com/kiva/ui/commit/646915b6b1b1b710670bf14a4d151558a775dcc0))
* spacing between components ([0fc1f6e](https://github.com/kiva/ui/commit/0fc1f6e4772ef18d8aa35cb4d5d92465483932f7))


### 🏗️ Build System

* stop git credentials used for checkout from persisting to other actions ([dff4721](https://github.com/kiva/ui/commit/dff4721a8e9d71c2c6f456394b9a3136469fb5ca))


### 📚 Documentation Changes

* [2.718.0-rc.1] update CHANGELOG.md for main [skip ci] ([b7ec5ad](https://github.com/kiva/ui/commit/b7ec5add827b2f0958221de6d68a6d0cafeedae9))


### 🧹 Chores

* [2.718.0-rc.1] update version in package.json for main [skip ci] ([2255f9b](https://github.com/kiva/ui/commit/2255f9baf491082f768a91655380d4f27ddeeed4))
* update local dev endpoints ([92c3877](https://github.com/kiva/ui/commit/92c387781c449b6e6115da79ca647ece4131e504))

### [2.715.1](https://github.com/kiva/ui/compare/v2.715.0...v2.715.1) (2023-10-26)


### Bug Fixes

* copy for donation description ([a4c38f9](https://github.com/kiva/ui/commit/a4c38f96a94f95b0dacac3836ac0f7a821b2e371))

## [v2.718.0-rc.1] - 2023-11-02
### :sparkles: New Features
- [`c5a5bd5`](https://github.com/kiva/ui/commit/c5a5bd53b306accb873bd2ecd79f9ed00d2fc54c) - teams page tweaks *(PR [#5054](https://github.com/kiva/ui/pull/5054) by [@roger-in-kiva](https://github.com/roger-in-kiva))*

### :bug: Bug Fixes
- [`0ba3648`](https://github.com/kiva/ui/commit/0ba3648472658934e89882477aa44907b3110ced) - boolean settings bug fixed for ftds in checkout and thanks pages *(PR [#5053](https://github.com/kiva/ui/pull/5053) by [@roger-in-kiva](https://github.com/roger-in-kiva))*
- [`310defa`](https://github.com/kiva/ui/commit/310defadd8060386b648ffcb02ca0c0c9187dae7) - add surrogate keys for ui assets *(commit by [@mcstover](https://github.com/mcstover))*

### :wrench: Chores
- [`ca8753d`](https://github.com/kiva/ui/commit/ca8753d109e47fe477a7ae738430bd472becb649) - [2.717.0-rc.1] update version in package.json for main [skip ci] *(commit by [@mcstover](https://github.com/mcstover))*


## [v2.717.0-rc.1] - 2023-10-30
### :sparkles: New Features
- [`47e0159`](https://github.com/kiva/ui/commit/47e0159ccbef53f63fd46b91c50a8e707e78a0cd) - ftd message added to checkout page for first time lenders *(PR [#5052](https://github.com/kiva/ui/pull/5052) by [@roger-in-kiva](https://github.com/roger-in-kiva))*


## [v2.716.0-rc.1] - 2023-10-27
### :sparkles: New Features
- [`fb4a783`](https://github.com/kiva/ui/commit/fb4a78376a1e932e443f60cfc366f6bd3a51634b) - integrate double the donation plugin and wrap it behind feature flag
- [`679c598`](https://github.com/kiva/ui/commit/679c598cf3b342464885dfa54b6655f1940ff404) - add link to faq

### :bug: Bug Fixes
- [`faaa99f`](https://github.com/kiva/ui/commit/faaa99f8b3a4ff748f368d368d99f016076c1874) - adding blank target to double donation links
- [`c1f04f1`](https://github.com/kiva/ui/commit/c1f04f174627b66c036000310b28754fd4cec930) - moving double donation container to header
- [`92a257e`](https://github.com/kiva/ui/commit/92a257e69a11edc2558cbb45a73c4267ac0a1f1c) - [CP-603] We shouldn't need to pass the token in for this step *(commit by [@kathrynlovett](https://github.com/kathrynlovett))*
- [`8edafa7`](https://github.com/kiva/ui/commit/8edafa7e60cd923cbe4c8e61a8b54e72fc808323) - headline design


## [v2.715.2-rc.1] - 2023-10-27
### :bug: Bug Fixes
- [`e864172`](https://github.com/kiva/ui/commit/e86417277f2956e55258ec8c0a66b44aaf38bc23) - [CP-603] Pass kiva-robot token when checking out repo *(commit by [@kathrynlovett](https://github.com/kathrynlovett))*

### :wrench: Chores
- [`fc2a7b5`](https://github.com/kiva/ui/commit/fc2a7b55537269ad3ad717401d196c294b6186e7) - [CP-603] First attempt at setting up release flow *(commit by [@kathrynlovett](https://github.com/kathrynlovett))*
- [`c6f1e24`](https://github.com/kiva/ui/commit/c6f1e24f53bf13a0fcfe1ab1406b28e6051e3b36) - [CP-603] Indentation *(commit by [@kathrynlovett](https://github.com/kathrynlovett))*
- [`0ced931`](https://github.com/kiva/ui/commit/0ced93180fe76263547ddac303296408a6ca0314) - [CP-603] pass token *(commit by [@kathrynlovett](https://github.com/kathrynlovett))*
- [`24fb2ff`](https://github.com/kiva/ui/commit/24fb2ff3e3cc30b566c59322e42d7bbc801d8715) - [CP-603] Use main branch on marketplace ui repo *(commit by [@kathrynlovett](https://github.com/kathrynlovett))*
- [`6a6afd2`](https://github.com/kiva/ui/commit/6a6afd283a057dabb5121a8227cb7fb6219052fc) - [CP-603] UI doesn't have config here *(commit by [@kathrynlovett](https://github.com/kathrynlovett))*
- [`06e8409`](https://github.com/kiva/ui/commit/06e8409cdf3d9aac46acef3ba4fc5d5447fa3e25) - [CP-603] Consolidate to a single build file and copy over Dockerfile *(commit by [@kathrynlovett](https://github.com/kathrynlovett))*
- [`c45c549`](https://github.com/kiva/ui/commit/c45c549851e31ddb59ac16b9a9104b4e521e66be) - [CP-603] add test build on PR back to workflow *(commit by [@kathrynlovett](https://github.com/kathrynlovett))*
- [`d53c575`](https://github.com/kiva/ui/commit/d53c57507b578faad91d0f3ff41fd74a053edafa) - [CP-603] Remove unneeded step *(commit by [@kathrynlovett](https://github.com/kathrynlovett))*
- [`39503c8`](https://github.com/kiva/ui/commit/39503c862318987d91c5702ba6d4b4a91fbd26d7) - [CP-603] add target for test build *(commit by [@kathrynlovett](https://github.com/kathrynlovett))*
- [`03a1ab0`](https://github.com/kiva/ui/commit/03a1ab06389e09947ad28f5158505dd6cacb8fe0) - [CP-603] Remove dockerfile and copy from marketplace repo *(commit by [@kathrynlovett](https://github.com/kathrynlovett))*
- [`7fa4da0`](https://github.com/kiva/ui/commit/7fa4da0dcd1168f2ad8038656d7789d7c95bc26c) - [CP-603] Write changelog and update package file *(commit by [@kathrynlovett](https://github.com/kathrynlovett))*


## [2.715.0](https://github.com/kiva/ui/compare/v2.714.0...v2.715.0) (2023-10-23)


### Features

* kv components package updated ([#5044](https://github.com/kiva/ui/issues/5044)) ([b9ca376](https://github.com/kiva/ui/commit/b9ca3767920c6f8dfcb8d6d01b6e6a8e7a26dc2d))

## [2.714.0](https://github.com/kiva/ui/compare/v2.713.0...v2.714.0) (2023-10-23)


### Features

* empty basket carousel powered by flss in checkout page ([#5043](https://github.com/kiva/ui/issues/5043)) ([d20e728](https://github.com/kiva/ui/commit/d20e728d1335af75b41ac536d32d74de90cdaf6a))

## [2.713.0](https://github.com/kiva/ui/compare/v2.712.0...v2.713.0) (2023-10-20)


### Features

* relending test code removed ([#5042](https://github.com/kiva/ui/issues/5042)) ([0627c07](https://github.com/kiva/ui/commit/0627c07379ce57d76dd9ae800349dc9d825e4aba))

## [2.712.0](https://github.com/kiva/ui/compare/v2.711.0...v2.712.0) (2023-10-20)


### Features

* rever donation value prop and fix lightbox error caused by no title prop ([5b1f0d8](https://github.com/kiva/ui/commit/5b1f0d8b670445abbfddaa4085c03b2145636813))

## [2.711.0](https://github.com/kiva/ui/compare/v2.710.0...v2.711.0) (2023-10-19)


### Features

* loan tags test code removed ([#5039](https://github.com/kiva/ui/issues/5039)) ([e6c4c48](https://github.com/kiva/ui/commit/e6c4c4861f2f72e2b3384805e3abdd06aed039be))

## [2.710.0](https://github.com/kiva/ui/compare/v2.709.0...v2.710.0) (2023-10-19)


### Features

* redirect to new filter page from borrower profile country finding cta ([#5038](https://github.com/kiva/ui/issues/5038)) ([918477b](https://github.com/kiva/ui/commit/918477b5af5e8c94dc447cef6dfb78f5c8efa71b))

## [2.709.0](https://github.com/kiva/ui/compare/v2.708.0...v2.709.0) (2023-10-19)


### Features

* while funds last message added to thanks page for ftds ([#5037](https://github.com/kiva/ui/issues/5037)) ([992bdf8](https://github.com/kiva/ui/commit/992bdf8404f4ea7aee0495e5cbcb27f9375f1ce1))

## [2.708.0](https://github.com/kiva/ui/compare/v2.707.1...v2.708.0) (2023-10-19)


### Features

* default sort option added to quick filters for almost funded row test ([#5036](https://github.com/kiva/ui/issues/5036)) ([0231908](https://github.com/kiva/ui/commit/0231908567954266c184d016748615f47103fecb))

### [2.707.1](https://github.com/kiva/ui/compare/v2.707.0...v2.707.1) (2023-10-19)


### Bug Fixes

* revert donation value prop ([8e70909](https://github.com/kiva/ui/commit/8e70909e549af4de011dd07733fc453393091ad4))

## [2.707.0](https://github.com/kiva/ui/compare/v2.706.0...v2.707.0) (2023-10-18)


### Features

* almost funded row test added to lending home page ([#5034](https://github.com/kiva/ui/issues/5034)) ([702b54b](https://github.com/kiva/ui/commit/702b54b9613d7eec5f5c45b586e44fc4c2474fc8))

## [2.706.0](https://github.com/kiva/ui/compare/v2.705.0...v2.706.0) (2023-10-18)


### Features

* ab setup added for new almost funded loans row in lending home ([#5032](https://github.com/kiva/ui/issues/5032)) ([48153f8](https://github.com/kiva/ui/commit/48153f8839084d6fc78b6d3e84c2ec0068cf31e1))

## [2.705.0](https://github.com/kiva/ui/compare/v2.704.0...v2.705.0) (2023-10-18)


### Features

* kv components package updated ([#5030](https://github.com/kiva/ui/issues/5030)) ([ea062ba](https://github.com/kiva/ui/commit/ea062bae4e638d60ae92655a270dde8fc6ab8756))

## [2.704.0](https://github.com/kiva/ui/compare/v2.703.0...v2.704.0) (2023-10-13)


### Features

* applying h1 styles for modal headline and other style changes ([7f83670](https://github.com/kiva/ui/commit/7f83670119eac0ed5feb9b3bb2ff6d57b720d90b))


### Bug Fixes

* removing unnecessary h1 style ([0169e6c](https://github.com/kiva/ui/commit/0169e6cc2f163ca614d2c0e0e7a44f13e1e78381))

## [2.703.0](https://github.com/kiva/ui/compare/v2.702.0...v2.703.0) (2023-10-13)


### Features

* filtering covid 19 category in settings subscription page ([b483c4d](https://github.com/kiva/ui/commit/b483c4def4ea38301544b268da368d34eb70c392))
* update default percentage to 0.18 and hide covid category to new users ([6f259c4](https://github.com/kiva/ui/commit/6f259c41eb1f3ae8df3412573a98ba50aa386604))


### Bug Fixes

* removing covid category in monthly good ([b200035](https://github.com/kiva/ui/commit/b2000350eba5cf3c3f53615838da1bba3a44583c))
* revert removing covid category and just filter it on monthly good page ([77b61b4](https://github.com/kiva/ui/commit/77b61b42ff07402a06101e4f641eb9bd13b46eac))

## [2.702.0](https://github.com/kiva/ui/compare/v2.701.0...v2.702.0) (2023-10-12)


### Features

* kv components package updated ([#5027](https://github.com/kiva/ui/issues/5027)) ([aad654f](https://github.com/kiva/ui/commit/aad654f70680988f274c20b99db5d896f1c29e75))

## [2.701.0](https://github.com/kiva/ui/compare/v2.700.0...v2.701.0) (2023-10-10)


### Features

* omit view more card for loans length less than the page limit ([#5024](https://github.com/kiva/ui/issues/5024)) ([680e669](https://github.com/kiva/ui/commit/680e6692e79c18532de48556ff2fb261930042a7))

## [2.700.0](https://github.com/kiva/ui/compare/v2.699.0...v2.700.0) (2023-10-10)


### Features

* productize value prop experiment and removing old checkout module experiment ([7cb41b2](https://github.com/kiva/ui/commit/7cb41b26c3db5899c0ef243ad7bdd9b233656ce5))

## [2.699.0](https://github.com/kiva/ui/compare/v2.698.1...v2.699.0) (2023-10-10)


### Features

* introspection queries passed to a new query file ([#5022](https://github.com/kiva/ui/issues/5022)) ([ed0cd56](https://github.com/kiva/ui/commit/ed0cd5688497f75d4ad8014ce44ba0bda64a62e8))

### [2.698.1](https://github.com/kiva/ui/compare/v2.698.0...v2.698.1) (2023-10-06)


### Bug Fixes

* [CP-548] Fixing API audience URL ([5c0527f](https://github.com/kiva/ui/commit/5c0527f8bc6bf70df9cb7f6487c1d15a709bcbc7))

## [2.698.0](https://github.com/kiva/ui/compare/v2.697.0...v2.698.0) (2023-10-06)


### Features

* tracking event added to view more button in qf mobile section ([#5020](https://github.com/kiva/ui/issues/5020)) ([f179c22](https://github.com/kiva/ui/commit/f179c22bb560107c1ecf27f190077fe961ecd021))

## [2.697.0](https://github.com/kiva/ui/compare/v2.696.2...v2.697.0) (2023-10-05)


### Features

* css code for location selector updated ([#5019](https://github.com/kiva/ui/issues/5019)) ([0041051](https://github.com/kiva/ui/commit/004105172a1b6103403f2c88ee42ee5ac83feb32))

### [2.696.2](https://github.com/kiva/ui/compare/v2.696.1...v2.696.2) (2023-10-05)


### Bug Fixes

* turn off apollo batching in stage ([8796566](https://github.com/kiva/ui/commit/8796566c1597a324093016fde60d90f9012c518d))

### [2.696.1](https://github.com/kiva/ui/compare/v2.696.0...v2.696.1) (2023-10-05)


### Bug Fixes

* chanfe lifecycle hook for loading a post in portfolio ([e766942](https://github.com/kiva/ui/commit/e766942f2bf21753f5247fce5d8abf469b3ec367))

## [2.696.0](https://github.com/kiva/ui/compare/v2.695.2...v2.696.0) (2023-10-05)


### Features

* prevent loading state while waiting for the post ([fd57166](https://github.com/kiva/ui/commit/fd571660c77e8a7011b0a5f95a160d384ad04d2c))

### [2.695.2](https://github.com/kiva/ui/compare/v2.695.1...v2.695.2) (2023-10-04)


### Bug Fixes

* subs bug fixed in old loan card ([#5014](https://github.com/kiva/ui/issues/5014)) ([12bc2a8](https://github.com/kiva/ui/commit/12bc2a8211ecce04f5d19d795d8c713d1bdd7791))

### [2.695.1](https://github.com/kiva/ui/compare/v2.695.0...v2.695.1) (2023-10-04)


### Bug Fixes

* [CP-548] Make enableHotjar configurable ([1b6e52c](https://github.com/kiva/ui/commit/1b6e52c4ce2559a483efb4887c266761ecc78aef))

## [2.695.0](https://github.com/kiva/ui/compare/v2.694.1...v2.695.0) (2023-10-04)


### Features

* [CP_548] Alphabetize ([04f6429](https://github.com/kiva/ui/commit/04f642946237ad6478738e64185bdf098d4e7d1a))
* [CP-548 ([7a961f5](https://github.com/kiva/ui/commit/7a961f579a3a50df600806db2acc8fe719201452))
* [CP-548] Adding config files for EKS stage and dev ([5c22586](https://github.com/kiva/ui/commit/5c22586e464af6fdb5dcf5b0f23a8d816f0d9474))
* [CP-548] Generic config that can be overriden ([4e43da3](https://github.com/kiva/ui/commit/4e43da33c75281eb836b6720284d8b1c1424c71c))
* [CP-548] Make auth0 app IDs configurable ([a19ca40](https://github.com/kiva/ui/commit/a19ca4007de5d827e9d126e11268b4886595fe93))
* [CP-548] Make config support configuration for prod ([d22726d](https://github.com/kiva/ui/commit/d22726d31a77bb6d4c22511239e7e0eab5ada724))
* [CP-548] Missing bracket ([f9a6f02](https://github.com/kiva/ui/commit/f9a6f025048818de6de99ad4ed904aecf751e2c1))
* [CP-548] Rename new config file ([b42bece](https://github.com/kiva/ui/commit/b42beceaa54a4ed6e533d67c936d6050eae4e81b))
* [CP-548] Set disableCluster to true ([de2789e](https://github.com/kiva/ui/commit/de2789e124c82142909afa02aeb26b0df360458b))
* [CP-548] Set up dynamic config to work for prod ([342c914](https://github.com/kiva/ui/commit/342c9142cabf8bd0633a246405c5d2084e4fb051))
* [CP-548] Simplify boolean vars ([3319d5d](https://github.com/kiva/ui/commit/3319d5da80e3846def18ad813ba3e4cdabc10c4c))

### [2.694.1](https://github.com/kiva/ui/compare/v2.694.0...v2.694.1) (2023-10-04)


### Bug Fixes

* optional chaining added to subscription in loan card container ([#5011](https://github.com/kiva/ui/issues/5011)) ([4a92ac6](https://github.com/kiva/ui/commit/4a92ac6f547a53c6a224ec7f1517280a2f102d68))

## [2.694.0](https://github.com/kiva/ui/compare/v2.693.0...v2.694.0) (2023-10-04)


### Features

* remove experiment tracking and conditions ([36d68aa](https://github.com/kiva/ui/commit/36d68aaf6704f2d8d56f44ab97c2c65075d51a02))


### Bug Fixes

* revert using portfolio/impact as portfolio link ([6a0810d](https://github.com/kiva/ui/commit/6a0810dcaa7cb7da31d640e2a1e4353b2794776f))

## [2.693.0](https://github.com/kiva/ui/compare/v2.692.0...v2.693.0) (2023-10-04)


### Features

* kv components package updated ([#5010](https://github.com/kiva/ui/issues/5010)) ([ce8a849](https://github.com/kiva/ui/commit/ce8a849a67bb2bd5b85945b903cdf661cc0abaa5))

## [2.692.0](https://github.com/kiva/ui/compare/v2.691.0...v2.692.0) (2023-10-03)


### Features

* do not truncate for promo headline and summary ([596efa1](https://github.com/kiva/ui/commit/596efa1cae203a3c06a7de63bb68a6dd4a33ffcf))

## [2.691.0](https://github.com/kiva/ui/compare/v2.690.1...v2.691.0) (2023-10-03)


### Features

* quick filters pills test code removed ([494c21e](https://github.com/kiva/ui/commit/494c21e0a4682249373bc8d167654acf401184f3))

### [2.690.1](https://github.com/kiva/ui/compare/v2.690.0...v2.690.1) (2023-10-03)


### Bug Fixes

* truncating to three lines in mobile ([3812c54](https://github.com/kiva/ui/commit/3812c5461b1a97f1ea845f2e296943f10d5d6dc9))

## [2.690.0](https://github.com/kiva/ui/compare/v2.689.0...v2.690.0) (2023-10-03)


### Features

* teams page additional features ([d3d61ba](https://github.com/kiva/ui/commit/d3d61ba2dbe442e67857e69100b4220d27a3ac68))

## [2.689.0](https://github.com/kiva/ui/compare/v2.688.0...v2.689.0) (2023-10-02)


### Features

* test setup added for mobile version in lending home quick filters section ([e4bd84a](https://github.com/kiva/ui/commit/e4bd84adfe59554cf140407e33eca36a93d5fe49))

## [2.688.0](https://github.com/kiva/ui/compare/v2.687.0...v2.688.0) (2023-09-29)


### Features

* remove lend_urgency exp code ([7ca99ae](https://github.com/kiva/ui/commit/7ca99ae1d61c2737e2cfab393d92a0b33cc4bd32))

## [2.687.0](https://github.com/kiva/ui/compare/v2.686.1...v2.687.0) (2023-09-28)


### Features

* onetime removed from ui components ([72b0fd6](https://github.com/kiva/ui/commit/72b0fd692c395e6e89ae1feac333c7ec185d63ed))

### [2.686.1](https://github.com/kiva/ui/compare/v2.686.0...v2.686.1) (2023-09-27)


### Bug Fixes

* event value should be loan count ([8742d7d](https://github.com/kiva/ui/commit/8742d7d7179cafd9c0ecfc24dfdcc41259c491f0))

## [2.686.0](https://github.com/kiva/ui/compare/v2.685.0...v2.686.0) (2023-09-27)


### Features

* add loanId filter ([1db4450](https://github.com/kiva/ui/commit/1db44500eb5e85a21ec09238b0090c967c198b9b))
* create new route to just fetch loan data ([a2057f5](https://github.com/kiva/ui/commit/a2057f5f7bb387cb317072490e2e49792c79e8d6))


### Bug Fixes

* format value to integer ([301e0a6](https://github.com/kiva/ui/commit/301e0a6aa6d4e7fc3accae64b9267e7519be2c23))
* url regex and add url and img routes ([bd268a0](https://github.com/kiva/ui/commit/bd268a00c484c0a2df36debd21ca9f0dc64ef693))

## [2.685.0](https://github.com/kiva/ui/compare/v2.684.0...v2.685.0) (2023-09-26)


### Features

* unsubscribe method added to loan card queries ([9102ede](https://github.com/kiva/ui/commit/9102edef4dff5e2dda01b4064f7820737956aef9))

## [2.684.0](https://github.com/kiva/ui/compare/v2.683.0...v2.684.0) (2023-09-25)


### Features

* kv componets updated ([7f0cfdb](https://github.com/kiva/ui/commit/7f0cfdb2b520999c0991333f5e9f1d7e5b1be586))

## [2.683.0](https://github.com/kiva/ui/compare/v2.682.1...v2.683.0) (2023-09-25)


### Features

* release teams-beta page as teams ([88c5d70](https://github.com/kiva/ui/commit/88c5d709749179fee78cae920c28bd2ea98131bd))

### [2.682.1](https://github.com/kiva/ui/compare/v2.682.0...v2.682.1) (2023-09-25)


### Bug Fixes

* team recruitment attribution fix ([3cd1e84](https://github.com/kiva/ui/commit/3cd1e84c4df8607de57b49438a16084930f7d2a5))

## [2.682.0](https://github.com/kiva/ui/compare/v2.681.0...v2.682.0) (2023-09-25)


### Features

* message for ftds added to thanks page ([8ecca1b](https://github.com/kiva/ui/commit/8ecca1b2cb1b29adf4b1b0afa4a307f066fef9e0))
* tracking events added to ftd ctas ([47cf8f4](https://github.com/kiva/ui/commit/47cf8f46652c6a00826ccbd600544aa3ce656b1b))

## [2.681.0](https://github.com/kiva/ui/compare/v2.680.0...v2.681.0) (2023-09-22)


### Features

* track basket state on load ([a15474d](https://github.com/kiva/ui/commit/a15474df57afbff933e57fd7f43a29006ccbad16))


### Bug Fixes

* replace empty string to null value ([67c7fc7](https://github.com/kiva/ui/commit/67c7fc729e5587734b14c18ad1eb412ecef92db1))

## [2.680.0](https://github.com/kiva/ui/compare/v2.679.1...v2.680.0) (2023-09-22)


### Features

* add cps visibleUrls approach ([5456813](https://github.com/kiva/ui/commit/54568134369cdbf701e5a6ea063261b887757f28))
* add tests and global deny list to hiddenUrls ([0676312](https://github.com/kiva/ui/commit/067631246201efd117130e2f327fff1847ca2b8d))


### Bug Fixes

* inactivePromo exclude url condition ([f78a61b](https://github.com/kiva/ui/commit/f78a61b26e650e89e8341aa83973d2ea2b87d3db))

### [2.679.1](https://github.com/kiva/ui/compare/v2.679.0...v2.679.1) (2023-09-21)


### Bug Fixes

* fix calling router.push too much for the teams search ([d42e73d](https://github.com/kiva/ui/commit/d42e73d094f2488ae343c88476b212a7f40529ff))

## [2.679.0](https://github.com/kiva/ui/compare/v2.678.1...v2.679.0) (2023-09-21)


### Features

* support all teams search params to/from url ([0348a81](https://github.com/kiva/ui/commit/0348a816b95985f42d24eff5b2618212d78c1401))

### [2.678.1](https://github.com/kiva/ui/compare/v2.678.0...v2.678.1) (2023-09-21)


### Bug Fixes

* revert header tag ([70e8efb](https://github.com/kiva/ui/commit/70e8efb200ffabc3264b833125a65cbe10976f3f))
* small changes in design ([c5fd254](https://github.com/kiva/ui/commit/c5fd254fdc05853aaf8ebde8b97c00b4b8f4d034))

## [2.678.0](https://github.com/kiva/ui/compare/v2.677.0...v2.678.0) (2023-09-20)


### Features

* add recruit/join/quit buttons to new teams page ([8fb3e2c](https://github.com/kiva/ui/commit/8fb3e2cab74fa6f930cad37fe65c4147e0a99c6c))

## [2.677.0](https://github.com/kiva/ui/compare/v2.676.1...v2.677.0) (2023-09-20)


### Features

* support inviter param and recruitment on team process page ([424aa60](https://github.com/kiva/ui/commit/424aa60e9cf74467e1d2cf0dae38a877c2eb36ca))


### Bug Fixes

* make join team mutation variables conditional ([2518a2c](https://github.com/kiva/ui/commit/2518a2cf2497988f2d4382aef91f4b86d20b1aa5))

### [2.676.1](https://github.com/kiva/ui/compare/v2.676.0...v2.676.1) (2023-09-20)


### Bug Fixes

* bg color ([f1d1e2b](https://github.com/kiva/ui/commit/f1d1e2b5662cebd46113ffd992f79b3488f69da2))

## [2.676.0](https://github.com/kiva/ui/compare/v2.675.0...v2.676.0) (2023-09-20)


### Features

* update lending insights module ([0ea5ce1](https://github.com/kiva/ui/commit/0ea5ce1c46d4cd25943e96587c664408d3e8bc02))


### Bug Fixes

* replace inline styles ([995e0ed](https://github.com/kiva/ui/commit/995e0edde1e9471813f3651d9f36c97b6a7564b1))

## [2.675.0](https://github.com/kiva/ui/compare/v2.674.1...v2.675.0) (2023-09-19)


### Features

* kv components package updated ([1f07dba](https://github.com/kiva/ui/commit/1f07dbaf52c7b0944e1f06ccbec30e14a8d94749))

### [2.674.1](https://github.com/kiva/ui/compare/v2.674.0...v2.674.1) (2023-09-19)


### Bug Fixes

* missing component on guest upsell no comment ask ([44844ca](https://github.com/kiva/ui/commit/44844ca7816fa865034cbe397e580368e0c146dd))

## [2.674.0](https://github.com/kiva/ui/compare/v2.673.3...v2.674.0) (2023-09-18)


### Features

* [CP-477] disabling batching so we can shift traffic to the EKS cluster ([#4969](https://github.com/kiva/ui/issues/4969)) ([1522203](https://github.com/kiva/ui/commit/15222032954743fea9fac64fd5151f9e6594e487))

### [2.673.3](https://github.com/kiva/ui/compare/v2.673.2...v2.673.3) (2023-09-18)


### Bug Fixes

* event tracking, hide receipt if zero donations ([dedf217](https://github.com/kiva/ui/commit/dedf2171a78838f500ebe871db36b6ea49e7a61a))

### [2.673.2](https://github.com/kiva/ui/compare/v2.673.1...v2.673.2) (2023-09-18)


### Bug Fixes

* missing url in education post within impact page ([4b42a70](https://github.com/kiva/ui/commit/4b42a7020b72dffd5e79e99798831428da3f516c))

### [2.673.1](https://github.com/kiva/ui/compare/v2.673.0...v2.673.1) (2023-09-15)


### Bug Fixes

* ensure icons are compressed and skip font compression MARS-288 ([158c677](https://github.com/kiva/ui/commit/158c677a86532880980c79ee398dab432e61c2b6))

## [2.673.0](https://github.com/kiva/ui/compare/v2.672.2...v2.673.0) (2023-09-14)


### Features

* create donation module in impact dashboard ([d7744ec](https://github.com/kiva/ui/commit/d7744ec1da5e5bc7b8ef89ae33ea0be3cd25be66))


### Bug Fixes

* limit value ([c96c9c9](https://github.com/kiva/ui/commit/c96c9c9205599209a3f9ea34d94564edeebd8987))
* method name type ([a287d76](https://github.com/kiva/ui/commit/a287d76c099d3f643d957bcd415e77aab0042047))
* replace inline style for tw class ([8f65360](https://github.com/kiva/ui/commit/8f6536044656915330d21e7129802c3d771b54a9))
* squeezed stats  in tablet view ([6b2cdb0](https://github.com/kiva/ui/commit/6b2cdb0f5fa290da31a9b5f731b6f8fdb3135612))

### [2.672.2](https://github.com/kiva/ui/compare/v2.672.1...v2.672.2) (2023-09-14)


### Bug Fixes

* check secondary string in google topics realated api failure ([d8337bd](https://github.com/kiva/ui/commit/d8337bd36d25509b5e5f0b2df4674baf17fdb15f))
* filter out unhanded google ads code request errors from sentry ([ba925ac](https://github.com/kiva/ui/commit/ba925ace37f920359815f4e0a947505326278776))

### [2.672.1](https://github.com/kiva/ui/compare/v2.672.0...v2.672.1) (2023-09-14)


### Bug Fixes

* ensure all assets get compressed before upload MARS-288 ([df1e65f](https://github.com/kiva/ui/commit/df1e65fd8bf3a58cd6aba1c443dc831ba4fa1b44))

## [2.672.0](https://github.com/kiva/ui/compare/v2.671.1...v2.672.0) (2023-09-14)


### Features

* [CP-477] disabling batching so we can shift traffic to the EKS cluster ([#4963](https://github.com/kiva/ui/issues/4963)) ([7a069bc](https://github.com/kiva/ui/commit/7a069bc2dc3b3145e6c90a857cd1b0ef24ece8e0))

### [2.671.1](https://github.com/kiva/ui/compare/v2.671.0...v2.671.1) (2023-09-13)


### Bug Fixes

* bad isserver check ([d287a4f](https://github.com/kiva/ui/commit/d287a4f1104264d73cd6220ee42dca0d95b0973b))

## [2.671.0](https://github.com/kiva/ui/compare/v2.670.0...v2.671.0) (2023-09-13)


### Features

* new process join team page ([6fe49de](https://github.com/kiva/ui/commit/6fe49dea7b58a8592c7e5e4e9016a05c0a4f8da3))

## [2.670.0](https://github.com/kiva/ui/compare/v2.669.0...v2.670.0) (2023-09-12)


### Features

* education module within impact dashboard ([883ceb8](https://github.com/kiva/ui/commit/883ceb8a95978e3ee22257e78f96c75b68b7bbb7))


### Bug Fixes

* loading logic ([62fdd0a](https://github.com/kiva/ui/commit/62fdd0a1e700d430e7a033b678cd1fcc63ea9d51))
* small design changes ([3c74224](https://github.com/kiva/ui/commit/3c7422407ba1a1de96e751e915929d0238aff505))

## [2.669.0](https://github.com/kiva/ui/compare/v2.668.1...v2.669.0) (2023-09-11)


### Features

* compress static assets for production MARS-429 ([08896ee](https://github.com/kiva/ui/commit/08896ee96d5fbfbf80852435af210e5515cae9cb))

### [2.668.1](https://github.com/kiva/ui/compare/v2.668.0...v2.668.1) (2023-09-06)


### Bug Fixes

* update lighthouserc-prod.js for new refugee url ([cb7f4ad](https://github.com/kiva/ui/commit/cb7f4ad5e9476bc1ed685571deffd2f71d3937c2))

## [2.668.0](https://github.com/kiva/ui/compare/v2.667.0...v2.668.0) (2023-09-06)


### Features

* flss experiment key updated ([9e7e237](https://github.com/kiva/ui/commit/9e7e237d9e1cb854befb5bcf16e2341e7211694e))

## [2.667.0](https://github.com/kiva/ui/compare/v2.666.0...v2.667.0) (2023-09-06)


### Features

* new loan card components and logic experiment removed ([33246ec](https://github.com/kiva/ui/commit/33246ec2b1687a9d0fdc409cc3f5f9848f8092aa))


### Bug Fixes

* flashmessage query fixed to avoid a lint error about missed id ([0bc3084](https://github.com/kiva/ui/commit/0bc3084431721c10a602901a38a300a1795f3f07))

## [2.666.0](https://github.com/kiva/ui/compare/v2.665.1...v2.666.0) (2023-09-05)


### Features

* add new leaderboard query and functionality ([77dd664](https://github.com/kiva/ui/commit/77dd664b82b7232b46409a0a3189c08648e80d77))
* add tracking to filters and buttons ([34ed86a](https://github.com/kiva/ui/commit/34ed86a01d6bc3e42c2bc1469367d964e77781b7))
* minor styling revisions ([bf29879](https://github.com/kiva/ui/commit/bf29879187284a00968f6d99162711a3b872ee1d))
* remove unused methods, fix team paging, add loading state for loading teams ([5918ac1](https://github.com/kiva/ui/commit/5918ac1cf24a24431f291c4505216559669d77aa))
* rename teams template and route ([2487904](https://github.com/kiva/ui/commit/2487904841845b8d6f8384d192d5e95786e2e122))
* **teams:** Start of teams landing page migration ([c550c3b](https://github.com/kiva/ui/commit/c550c3b5663d6b287af884de08a1eb78f7233d01))


### Bug Fixes

* fix layouts, fix button link, use kv elements progress bar ([36a1a38](https://github.com/kiva/ui/commit/36a1a38028e86e28c8f97778431053aa867bfe65))
* formatting issues and very minor fixes ([886efb2](https://github.com/kiva/ui/commit/886efb220579b0faf7d31633307f31d9d92ff97f))
* leaderboards error neeed to be two words ([a6f5c11](https://github.com/kiva/ui/commit/a6f5c11eb8cc12b2dfdce005667dec5741cd9e9c))
* lint clean up ([2a30592](https://github.com/kiva/ui/commit/2a305925efd0e7dc6cea73dce7cd8ef5ac373141))
* throttle mobile resizing ([e6e49d7](https://github.com/kiva/ui/commit/e6e49d70d7c628e889c6f43c591b3b115bae5e8b))

### [2.665.1](https://github.com/kiva/ui/compare/v2.665.0...v2.665.1) (2023-09-01)


### Reverts

* "fix: actual test didn't change CTA text MARS-492" ([84219b4](https://github.com/kiva/ui/commit/84219b4269270c2a22d77f1404e396f103deeab7))

## [2.665.0](https://github.com/kiva/ui/compare/v2.664.0...v2.665.0) (2023-08-31)


### Features

* code clean up for categories redirect test ([e3dc618](https://github.com/kiva/ui/commit/e3dc6181004d479a1defd089a4601a8ad40abe51))

## [2.664.0](https://github.com/kiva/ui/compare/v2.663.1...v2.664.0) (2023-08-31)


### Features

* tweak instant donate page for better conversion MARS-492 ([3559bb4](https://github.com/kiva/ui/commit/3559bb48381a493be6e77847ac54c2871b930ea0))


### Bug Fixes

* actual test didn't change CTA text MARS-492 ([f67b2d7](https://github.com/kiva/ui/commit/f67b2d7e4a7987db4d9a3e704a699394ae7c2d05))

### [2.663.1](https://github.com/kiva/ui/compare/v2.663.0...v2.663.1) (2023-08-30)


### Bug Fixes

* **TheTipMessage:** tipMessage missing from currentMessage and incorrect persist logic ([ce843ab](https://github.com/kiva/ui/commit/ce843abdfbdde57310149ca995b68f14d0dc8b88))

## [2.663.0](https://github.com/kiva/ui/compare/v2.662.0...v2.663.0) (2023-08-30)


### Features

* display flash messages for visitor in the tip message MARS-448 ([94d810e](https://github.com/kiva/ui/commit/94d810e4653e04cb48f2127a6e8d61fdc58a8904))


### Bug Fixes

* **TheTipMessage:** wait until mounted to query for flash messages ([2d5415a](https://github.com/kiva/ui/commit/2d5415a31d1441f478e1ce9fd64a4615c50ac623))

## [2.662.0](https://github.com/kiva/ui/compare/v2.661.0...v2.662.0) (2023-08-29)


### Features

* featured loan test code removed in lending home page ([0eac1a2](https://github.com/kiva/ui/commit/0eac1a2569a731bcd8b6042a10380619ede040ff))

## [2.661.0](https://github.com/kiva/ui/compare/v2.660.0...v2.661.0) (2023-08-29)


### Features

* change partner with us footer link ([db5d941](https://github.com/kiva/ui/commit/db5d941aba00fcddb628119401be5ae9e5be6e14))

## [2.660.0](https://github.com/kiva/ui/compare/v2.659.0...v2.660.0) (2023-08-28)


### Features

* add partner with us page to about dropdown ([8c794f0](https://github.com/kiva/ui/commit/8c794f0cfea7dd0a457c90779eaf163043b943d6))


### Bug Fixes

* use anchor ([29181dc](https://github.com/kiva/ui/commit/29181dca3778d2d569b453666817cdd66500a40d))

## [2.659.0](https://github.com/kiva/ui/compare/v2.658.0...v2.659.0) (2023-08-28)


### Features

* test setup added to show three loans in recommended row for lending home page ([c78aa0e](https://github.com/kiva/ui/commit/c78aa0e2b4c52998b2038dc436c5d94143b5f03f))

## [2.658.0](https://github.com/kiva/ui/compare/v2.657.0...v2.658.0) (2023-08-24)


### Features

* change about impact path ([f3ab33a](https://github.com/kiva/ui/commit/f3ab33afde81286f80d1775f0002af21bbac80f7))

## [2.657.0](https://github.com/kiva/ui/compare/v2.656.0...v2.657.0) (2023-08-23)


### Features

* initial exp setup including query/mutation files and switching based on exp version ([2f08f25](https://github.com/kiva/ui/commit/2f08f2573faca370661986f73f34bd38ea3fdf4b))


### Bug Fixes

* ensure visitorId is optional ([32008aa](https://github.com/kiva/ui/commit/32008aa4cda743bda06c1d176d21f42f74ec48a1))
* generic exp version check ([f8d2d34](https://github.com/kiva/ui/commit/f8d2d34079eefa2ca64ca609a28fcacab8e43a24))
* simplify experiment setup ([ced24c5](https://github.com/kiva/ui/commit/ced24c52efc6f9e1f3909ae309a6256484928663))

## [2.656.0](https://github.com/kiva/ui/compare/v2.655.0...v2.656.0) (2023-08-22)


### Features

* add most recent loan sort ([4dac97c](https://github.com/kiva/ui/commit/4dac97cc60ca8b9cb5c2dd01dbf8fc044fb11703))

## [2.655.0](https://github.com/kiva/ui/compare/v2.654.1...v2.655.0) (2023-08-22)


### Features

* remove Kiva card postal delivery option redemption instructions ([5625641](https://github.com/kiva/ui/commit/5625641e2256e6a0de88bcb05f904fa6441675dd))
* update Kiva card types to remove comma ([7078b7c](https://github.com/kiva/ui/commit/7078b7ced70f54d04d5851a8a7cbabda8ff7506f))

### [2.654.1](https://github.com/kiva/ui/compare/v2.654.0...v2.654.1) (2023-08-21)


### Bug Fixes

* unused var removed in saved search component ([9fd5745](https://github.com/kiva/ui/commit/9fd5745c801a4159d2db72b2e501a9880bd1c4ff))

## [2.654.0](https://github.com/kiva/ui/compare/v2.653.0...v2.654.0) (2023-08-21)


### Features

* remove number of loans in saved search page ([2591cd9](https://github.com/kiva/ui/commit/2591cd9d9e7ec60889d41d15f9d75a48d7b79653))

## [2.653.0](https://github.com/kiva/ui/compare/v2.652.0...v2.653.0) (2023-08-21)


### Features

* number of loans in lending home recommened row updated ([64cb258](https://github.com/kiva/ui/commit/64cb25860aea4c3d12f8652749390e52b4b696eb))

## [2.652.0](https://github.com/kiva/ui/compare/v2.651.0...v2.652.0) (2023-08-17)


### Features

* new loan card added for empty basket state in checkout page ([3b1d07d](https://github.com/kiva/ui/commit/3b1d07d962c8b51c63cc11826ca7ce60bb2ca17a))


### Bug Fixes

* updating totals event restored in checkout empty status ([4130eb8](https://github.com/kiva/ui/commit/4130eb82ed24e7b7d2c46a945fb493aa66c20ab9))

## [2.651.0](https://github.com/kiva/ui/compare/v2.650.4...v2.651.0) (2023-08-16)


### Features

* exclude countries from lending stats page based on an admin setting ([37e84f6](https://github.com/kiva/ui/commit/37e84f61e738106ede8600ee5f9ea1cffd045718))


### Bug Fixes

* refactor total prop ([d452836](https://github.com/kiva/ui/commit/d452836cc617997330769580cf92c02e5e58a5bd))

### [2.650.4](https://github.com/kiva/ui/compare/v2.650.3...v2.650.4) (2023-08-14)


### Bug Fixes

* truncate comment heights to fix carousel ([88490cd](https://github.com/kiva/ui/commit/88490cd2c5b5a46a56a800dd35d209d0d660235d))

### [2.650.3](https://github.com/kiva/ui/compare/v2.650.2...v2.650.3) (2023-08-10)


### Bug Fixes

* calling undefined func on borrower profile added by mistake ([f2d73fd](https://github.com/kiva/ui/commit/f2d73fdda77d359cde6963c458adcc7641c24202))

### [2.650.2](https://github.com/kiva/ui/compare/v2.650.1...v2.650.2) (2023-08-10)


### Bug Fixes

* ensure we hit legacy lend, add drupal based about page ([bfc996b](https://github.com/kiva/ui/commit/bfc996b681e037976f0b0ffc03de2413e932a707))

### [2.650.1](https://github.com/kiva/ui/compare/v2.650.0...v2.650.1) (2023-08-08)


### Bug Fixes

* small fix in cancellation flow and how to calculate the months you have been a subscriber ([68b05ff](https://github.com/kiva/ui/commit/68b05fff66fe249a6f7fc785a3e60fd3c2de29d9))

## [2.650.0](https://github.com/kiva/ui/compare/v2.649.2...v2.650.0) (2023-08-07)


### Features

* show 'just 1 dollar' modal once per 24 hours ([8d44a7f](https://github.com/kiva/ui/commit/8d44a7fe162e4d8e5ca0a6b419963e5b42b646c1))

### [2.649.2](https://github.com/kiva/ui/compare/v2.649.1...v2.649.2) (2023-08-07)


### Bug Fixes

* skipping second addToBasket mutation ([cbd7cf6](https://github.com/kiva/ui/commit/cbd7cf651cd238bcb757446b6e887437439b3f52))

### [2.649.1](https://github.com/kiva/ui/compare/v2.649.0...v2.649.1) (2023-08-04)


### Bug Fixes

* update lighthouse url set ([b5ff754](https://github.com/kiva/ui/commit/b5ff754a748a94bbd682e3aad4966f4649bdcac8))

## [2.649.0](https://github.com/kiva/ui/compare/v2.648.0...v2.649.0) (2023-08-03)


### Features

* ensure Save for later btn appears on tablet and update loan progress bar to make it visible ([7476656](https://github.com/kiva/ui/commit/747665636f8a6720990209fa819e329307a0811e))
* rearrange lend cta section to be at the top on mobile view ([b167267](https://github.com/kiva/ui/commit/b1672673466a7a1ed718d380ecea514fffad1f22))


### Bug Fixes

* remove isMobile flag from LendCta ([f31e60c](https://github.com/kiva/ui/commit/f31e60c285577d914600c4c769ba3ebdb311edbd))
* remove unused jump-link ([9d9c067](https://github.com/kiva/ui/commit/9d9c0673c0edeaaf4534dc4425e88c48316abd95))
* solve conflict ([60bced9](https://github.com/kiva/ui/commit/60bced997f9256584303167ad31eba7f1f62fb43))

## [2.648.0](https://github.com/kiva/ui/compare/v2.647.0...v2.648.0) (2023-08-03)


### Features

* kv components version updated ([a9c70c1](https://github.com/kiva/ui/commit/a9c70c110241ef4f25d6cfd4bbd4e08ac37d1380))

## [2.647.0](https://github.com/kiva/ui/compare/v2.646.0...v2.647.0) (2023-08-01)


### Features

* handle ui login kiva_corp_partner param ([a52b532](https://github.com/kiva/ui/commit/a52b53233ee42c18eaa9f2a6d98ea96ec1206ea1))

## [2.646.0](https://github.com/kiva/ui/compare/v2.645.0...v2.646.0) (2023-08-01)


### Features

* 5 dollars banner added to lending home page ([8cd2d73](https://github.com/kiva/ui/commit/8cd2d73d5f8a3908ccdd5164bcaa2643f003b3f7))
* expiration time added to five dollars banner cookie ([8432b9e](https://github.com/kiva/ui/commit/8432b9e43bda561715078727a147e5d98759a628))

## [2.645.0](https://github.com/kiva/ui/compare/v2.644.0...v2.645.0) (2023-07-28)


### Features

* remove exp code for control version ([d368368](https://github.com/kiva/ui/commit/d368368949b8f4730f6b037e36a93559380cd035))

## [2.644.0](https://github.com/kiva/ui/compare/v2.643.1...v2.644.0) (2023-07-27)


### Features

* new five dollars section added to lending home page ([064f019](https://github.com/kiva/ui/commit/064f019b777b7e21034833ad19631d308208e8a5))


### Bug Fixes

* fixes from pr comments ([a5c8048](https://github.com/kiva/ui/commit/a5c804882d5d6edeb76f457256dfc19961b0a2ce))

### [2.643.1](https://github.com/kiva/ui/compare/v2.643.0...v2.643.1) (2023-07-27)


### Bug Fixes

* auth0 repo requires camel case for these variables ([e00007e](https://github.com/kiva/ui/commit/e00007e71b48d7badcc8b3e5123b00d0004ef8f3))

## [2.643.0](https://github.com/kiva/ui/compare/v2.642.0...v2.643.0) (2023-07-26)


### Features

* prefetch hook updated in lh page ([8207329](https://github.com/kiva/ui/commit/8207329ddea9c715f5af3e439889cd986ac6b570))


### Bug Fixes

* fixes from pr comments ([8ef0d93](https://github.com/kiva/ui/commit/8ef0d93cf9cb171788de8a808debc0f4f6d7b183))

## [2.642.0](https://github.com/kiva/ui/compare/v2.641.0...v2.642.0) (2023-07-26)


### Features

* UI App Login Handler Updates ([e36e660](https://github.com/kiva/ui/commit/e36e660a94721f83eedae0e58dae6e25bc79ec77))

## [2.641.0](https://github.com/kiva/ui/compare/v2.640.0...v2.641.0) (2023-07-26)


### Features

* update source for preset options ([4a03bd3](https://github.com/kiva/ui/commit/4a03bd3258b325cec61a06fbb200c62fb0a04314))

## [2.640.0](https://github.com/kiva/ui/compare/v2.639.0...v2.640.0) (2023-07-25)


### Features

* set up tip rate optimization experiment ([0864acf](https://github.com/kiva/ui/commit/0864acf843a89c0c21ea20e089d6327875c2c218))


### Bug Fixes

* avoid exp set up for guest checkout ([8be50b2](https://github.com/kiva/ui/commit/8be50b2454df3f30c55450ac7061eaa19dfb2bf9))
* check if user is not logged in ([638e318](https://github.com/kiva/ui/commit/638e3187d685289055c409ef05cab295a010fd2a))

## [2.639.0](https://github.com/kiva/ui/compare/v2.638.0...v2.639.0) (2023-07-20)


### Features

* carousel updated for mobile version in lending home page ([ce763c4](https://github.com/kiva/ui/commit/ce763c47df526b85b6f47b5481c13eb00d360926))
* size breakpoints for single slide updated ([7628728](https://github.com/kiva/ui/commit/7628728269bfd11de9095838787b5230327551e0))


### Bug Fixes

* fixes from pr comments ([d979ef6](https://github.com/kiva/ui/commit/d979ef604497c53f81c88ce4180d4264d5174439))

## [2.638.0](https://github.com/kiva/ui/compare/v2.637.0...v2.638.0) (2023-07-20)


### Features

* adding v-else for matchingCampaign type ([a8f543a](https://github.com/kiva/ui/commit/a8f543a6b8a14128d962f42a088b91b7c94c334d))
* edited v-if statement, computed property ([8956ba0](https://github.com/kiva/ui/commit/8956ba06ce61b02dacee5d2472d85e2b61d1f109))


### Bug Fixes

* isMatchingCorporateCampaign -> isMatchingCampaign ([b5e4574](https://github.com/kiva/ui/commit/b5e45742712a5e6775673481ee955b1917094ab3))
* removal of computed property, edited v-if and component inheritance ([9a7a80b](https://github.com/kiva/ui/commit/9a7a80b16bfe47c24e0407e1c8157a9857a52aaf))
* updating based on prior commit's feedback ([6331c20](https://github.com/kiva/ui/commit/6331c200acefa5941371150185aaf6c902b7f684))

## [2.637.0](https://github.com/kiva/ui/compare/v2.636.0...v2.637.0) (2023-07-18)


### Features

* displayed loans event implemented for new featured loan test ([69f9daf](https://github.com/kiva/ui/commit/69f9dafe9c89cd53a0b02bbc263f36ca618d7c90))


### Bug Fixes

* tracking code simplified ([048d035](https://github.com/kiva/ui/commit/048d035a642cc44bb482cdc050104b52390c05c5))

## [2.636.0](https://github.com/kiva/ui/compare/v2.635.0...v2.636.0) (2023-07-18)


### Features

* resolve minor sentry issues ([489829d](https://github.com/kiva/ui/commit/489829d792265a39cfd4375bf9134c8a10e5c7bd))

## [2.635.0](https://github.com/kiva/ui/compare/v2.634.0...v2.635.0) (2023-07-18)


### Features

* resolve issues with register social e2e ([7acbdfd](https://github.com/kiva/ui/commit/7acbdfd220ae1a7eeb5fd7264487014316570189))

## [2.634.0](https://github.com/kiva/ui/compare/v2.633.1...v2.634.0) (2023-07-18)


### Features

* copy updated and welcome message removed for logged in users ([7baae66](https://github.com/kiva/ui/commit/7baae669737c4c6e7c365ff6b2559e2a854c4de8))
* featured loan test for logged in users in lending home ([e8b1e08](https://github.com/kiva/ui/commit/e8b1e08750d76d1cef5e03a510509044ffa38013))


### Bug Fixes

* fixes from pr comments ([e3f6e84](https://github.com/kiva/ui/commit/e3f6e84c270d4932b412c8707e7c772c0637df6f))

### [2.633.1](https://github.com/kiva/ui/compare/v2.633.0...v2.633.1) (2023-07-17)


### Bug Fixes

* provide default value for checkbox to override empty KvCheckbox default ([0d2eb51](https://github.com/kiva/ui/commit/0d2eb519331e2f24291d188fba2710e35c758791))

## [2.633.0](https://github.com/kiva/ui/compare/v2.632.0...v2.633.0) (2023-07-17)


### Features

* improve experience of editing or cancelling your subscription ([80bc7e9](https://github.com/kiva/ui/commit/80bc7e9014acd2e5a181e9304a2101f4d60572ea))


### Bug Fixes

* event tracking, cancellation copy and design ([3bd503f](https://github.com/kiva/ui/commit/3bd503fd14c7a9b6905e10393391c9d2470da1c1))
* mg subscription data using new service and design changes ([fe39342](https://github.com/kiva/ui/commit/fe393420ffc9df22958c1bf41aa2d5e811e938e1))
* remove old subscription management ([81290ab](https://github.com/kiva/ui/commit/81290ab4daa475435ae46b75bd769e8f8d6c0db7))
* remove title margin ([a716740](https://github.com/kiva/ui/commit/a71674034407eeaabece76b0c06554281521f4cb))
* subscriptions logic and add date utils used on monthly good ([08d8f47](https://github.com/kiva/ui/commit/08d8f47a7a04d334c4db907d6e7450be85eb5372))
* using my subscriptions data and cleaning up unnecessary code ([e7c6afc](https://github.com/kiva/ui/commit/e7c6afc6ad32c5b30d093594668da1ebfe04b07a))

## [2.632.0](https://github.com/kiva/ui/compare/v2.631.1...v2.632.0) (2023-07-17)


### Features

* updated component library for countdown edge case ([29820d0](https://github.com/kiva/ui/commit/29820d03b7ec7ca3aa8668ea2fe67b58569488d3))

### [2.631.1](https://github.com/kiva/ui/compare/v2.631.0...v2.631.1) (2023-07-17)


### Bug Fixes

* toString error in guest comment compare ([df0f94d](https://github.com/kiva/ui/commit/df0f94d0c246261c8ebc307f8accd0cefd718a5b))

## [2.631.0](https://github.com/kiva/ui/compare/v2.630.0...v2.631.0) (2023-07-17)


### Features

* new component added for a featured loan in lending home page ([d599f14](https://github.com/kiva/ui/commit/d599f149b2495174e8eaf72b8086936da7bca707))


### Bug Fixes

* fixes from pr comments ([bc4779c](https://github.com/kiva/ui/commit/bc4779c0d04a9740bef581b024d2a509c80404d3))

## [2.630.0](https://github.com/kiva/ui/compare/v2.629.2...v2.630.0) (2023-07-14)


### Features

* redirect to login with message when captcha not valid MARS-446 ([ea9376e](https://github.com/kiva/ui/commit/ea9376e4b8993c0fcd4562ebc1804e81e59ed7a1))

### [2.629.2](https://github.com/kiva/ui/compare/v2.629.1...v2.629.2) (2023-07-14)


### Bug Fixes

* register social form should use post method ([787fe67](https://github.com/kiva/ui/commit/787fe6763f1d3c8fb607231f5a3ee8497e19889b))

### [2.629.1](https://github.com/kiva/ui/compare/v2.629.0...v2.629.1) (2023-07-14)


### Bug Fixes

* set captcha value on hidden input ([acfa277](https://github.com/kiva/ui/commit/acfa277717bbe76c8ab808912defde7f907e9b75))

## [2.629.0](https://github.com/kiva/ui/compare/v2.628.1...v2.629.0) (2023-07-14)


### Features

* update components library to get countdown timer on new loan cards ([dd042e7](https://github.com/kiva/ui/commit/dd042e7e85a93e3f988f0b666db508e6b1aef25a))

### [2.628.1](https://github.com/kiva/ui/compare/v2.628.0...v2.628.1) (2023-07-14)


### Bug Fixes

* prop name typo and recaptcha loading order ([2117572](https://github.com/kiva/ui/commit/2117572a10e7683d6d5113be051e3846d6f60bf9))

## [2.628.0](https://github.com/kiva/ui/compare/v2.627.0...v2.628.0) (2023-07-14)


### Features

* option for requiring captcha on /register/social page MARS-446 ([336c50f](https://github.com/kiva/ui/commit/336c50fa078c1e93d878d9c6f06857de4d770ea4))

## [2.627.0](https://github.com/kiva/ui/compare/v2.626.0...v2.627.0) (2023-07-13)


### Features

* ab setup added to lending home page for recommended row replacement test ([7ce2342](https://github.com/kiva/ui/commit/7ce2342feae02d2009a55bcf1477bb458eae2f69))

## [2.626.0](https://github.com/kiva/ui/compare/v2.625.0...v2.626.0) (2023-07-13)


### Features

* requests comments from guests on thank you page ([a93b8db](https://github.com/kiva/ui/commit/a93b8db82022ee7541eedaeba9ca1987b6c45e24))

## [2.625.0](https://github.com/kiva/ui/compare/v2.624.1...v2.625.0) (2023-07-12)


### Features

* kv components packaged updated ([15edad5](https://github.com/kiva/ui/commit/15edad5ca99f18290be0e6b9db8abbed29f81630))
* new shared loan controller component created and added to lh components ([f5ba399](https://github.com/kiva/ui/commit/f5ba3997c863c4f31a69944f15bdef5e10d26a5f))


### Bug Fixes

* bookmark function error fixed ([c19abd0](https://github.com/kiva/ui/commit/c19abd0e166b66f4164b61320040c4f77f614268))
* email campaigns now working with new loan card container ([c34f5cf](https://github.com/kiva/ui/commit/c34f5cf4cea091ede0db501a1213efb5d25607d7))
* fixes from pr comments ([2559392](https://github.com/kiva/ui/commit/25593925f87498e1327eb641fe913c33da767931))
* pr fixes ([dfc2856](https://github.com/kiva/ui/commit/dfc28567df44751513c68adbeac136fe5400915d))
* tip message updated ([25a3034](https://github.com/kiva/ui/commit/25a303462b1276695603be696ff0ac09839c12b5))

### [2.624.1](https://github.com/kiva/ui/compare/v2.624.0...v2.624.1) (2023-07-12)


### Bug Fixes

* minor issues with comments on bp ([d714558](https://github.com/kiva/ui/commit/d71455896ceb58ae450ef3d691d286c557e06995))

## [2.624.0](https://github.com/kiva/ui/compare/v2.623.1...v2.624.0) (2023-07-11)


### Features

* support paragraphs in business description and purpose ([e0c2ec8](https://github.com/kiva/ui/commit/e0c2ec84f56246495efad315f90b6538ed2ce57a))

### [2.623.1](https://github.com/kiva/ui/compare/v2.623.0...v2.623.1) (2023-07-11)


### Bug Fixes

* custom prefetch functions need to call error handlers manually ([933a664](https://github.com/kiva/ui/commit/933a664e2cc082476a9ff22600b7422b8c87141b))

## [2.623.0](https://github.com/kiva/ui/compare/v2.622.0...v2.623.0) (2023-07-10)


### Features

* remove loan card exp from LH ([26eae65](https://github.com/kiva/ui/commit/26eae6577e8fb178698d1933e5d9f2d99433ee69))

## [2.622.0](https://github.com/kiva/ui/compare/v2.621.0...v2.622.0) (2023-07-07)


### Features

* needed changes to replace lbc by lending home page ([d2fdbe7](https://github.com/kiva/ui/commit/d2fdbe7c1599ff548b8cba490ef11053f9d20ca7))


### Bug Fixes

* exclusion from static site map added to lending home redirect ([c8ab85b](https://github.com/kiva/ui/commit/c8ab85becda59796ba3481d7aee1e5f4f09279b2))
* exclusion from static site map removed to lending home redirect ([1b9111a](https://github.com/kiva/ui/commit/1b9111a83ea328fac615ed6e57ad0833a00671d4))
* flss origin updated ([c09941e](https://github.com/kiva/ui/commit/c09941e14c34a0432a6f6f0022528357cd771182))
* more files removed from pr comments ([f7f9c24](https://github.com/kiva/ui/commit/f7f9c2429b02b46bf675193f09e940daa528c34f))

## [2.621.0](https://github.com/kiva/ui/compare/v2.620.0...v2.621.0) (2023-07-06)


### Features

* ask for comments for team members ([4b30be5](https://github.com/kiva/ui/commit/4b30be52b9ba28818cb072fb9d8141a05a6ee209))

## [2.620.0](https://github.com/kiva/ui/compare/v2.619.3...v2.620.0) (2023-07-06)


### Features

* ensure loader is hidden on validation error ([f122ce7](https://github.com/kiva/ui/commit/f122ce71001f166c1885a318c47dd7fc33e3a9a2))

### [2.619.3](https://github.com/kiva/ui/compare/v2.619.2...v2.619.3) (2023-07-06)


### Bug Fixes

* avoid zooming bug removing smallest image size ([38d22c2](https://github.com/kiva/ui/commit/38d22c2dcd3dc35285f05d76fc8ea7994878fb4c))

### [2.619.2](https://github.com/kiva/ui/compare/v2.619.1...v2.619.2) (2023-06-29)


### Bug Fixes

* only set tip to 0 when zero upsell is visible ([fefaba4](https://github.com/kiva/ui/commit/fefaba4948de2174782864047b6643416cb2a647))
* set donation tip to 0 when just 1 dollar donation modal is closed ([6f26d80](https://github.com/kiva/ui/commit/6f26d806613725e3a2224f46c8ac5a35ce88d962))

### [2.619.1](https://github.com/kiva/ui/compare/v2.619.0...v2.619.1) (2023-06-28)


### Bug Fixes

* experiment event fired for existing users only ([f5cf4dc](https://github.com/kiva/ui/commit/f5cf4dc8ac734d60c3ecd7375f5c8dfa050bbca0))

## [2.619.0](https://github.com/kiva/ui/compare/v2.618.3...v2.619.0) (2023-06-27)


### Features

* swap positions between support kiva btn and logged in profile ([20f10c0](https://github.com/kiva/ui/commit/20f10c0fd63aa0545cb166e343194f52429967fc))


### Bug Fixes

* solve conflict ([0ac3a15](https://github.com/kiva/ui/commit/0ac3a155c5831c7d80f4d2f1cd8c6256bd1edeea))

### [2.618.3](https://github.com/kiva/ui/compare/v2.618.2...v2.618.3) (2023-06-27)


### Bug Fixes

* **KvDropdown:** skip dropdown init and log error when controller missing ([f4c64de](https://github.com/kiva/ui/commit/f4c64de15b3fe3bfa216c959eb732e94f87fb6ed))

### [2.618.2](https://github.com/kiva/ui/compare/v2.618.1...v2.618.2) (2023-06-27)


### Bug Fixes

* hide support kiva button on mobile and adding required id on lender query ([83bd6b6](https://github.com/kiva/ui/commit/83bd6b62d38e2b8a0e8d83c204492857414c6553))

### [2.618.1](https://github.com/kiva/ui/compare/v2.618.0...v2.618.1) (2023-06-26)


### Bug Fixes

* clean up dumb variables ([08ce17f](https://github.com/kiva/ui/commit/08ce17f143bd8716f3a65d1e9d52d3154bb5f18a))
* eslint ([106c6e7](https://github.com/kiva/ui/commit/106c6e72b90530c62f52771502d760d5b1bea2e2))
* hide about on logged in users on a mobile screen ([d7a5e5a](https://github.com/kiva/ui/commit/d7a5e5a653c77fa3789ef6df6617cfbdcbd0621f))
* narrowed search bar for tablet and design fixes on header with balance ([08df551](https://github.com/kiva/ui/commit/08df551acbc174299e8629bae672edaa1b73938e))
* search icon not showing with basket on tablet ([9fb8bd2](https://github.com/kiva/ui/commit/9fb8bd27f1f65c1846a063c25a41e4866a6d4fb6))
* small search bar w basket ([46e84ea](https://github.com/kiva/ui/commit/46e84ea8ddd67f459b91eb710f1d056e1d26c414))
* space size between header components ([c007259](https://github.com/kiva/ui/commit/c00725987c11067ec7306fc6eeb6b9c3ec84715f))

## [2.618.0](https://github.com/kiva/ui/compare/v2.617.3...v2.618.0) (2023-06-26)


### Features

* add team name to comments on BP ([7f52878](https://github.com/kiva/ui/commit/7f52878323fbe4003dde1843889a0f25138e03a5))

### [2.617.3](https://github.com/kiva/ui/compare/v2.617.2...v2.617.3) (2023-06-23)


### Bug Fixes

* resolve a couple sentry errors ([f4e7374](https://github.com/kiva/ui/commit/f4e73740a63e2eb2d57f30aa4e873c93fcade92e))

### [2.617.2](https://github.com/kiva/ui/compare/v2.617.1...v2.617.2) (2023-06-23)


### Bug Fixes

* auto deposit landing page messaging ([b01b436](https://github.com/kiva/ui/commit/b01b436db58bd0d6c796c9a9a548cfd73b2baf8e))

### [2.617.1](https://github.com/kiva/ui/compare/v2.617.0...v2.617.1) (2023-06-22)


### Bug Fixes

* remove regex validation of emails because vuelidate is already handling this. ([d8060e2](https://github.com/kiva/ui/commit/d8060e2b6227c3a311e5ef15aad051fb6803745c))

## [2.617.0](https://github.com/kiva/ui/compare/v2.616.0...v2.617.0) (2023-06-22)


### Features

* add user avatar to comments ([bc92da0](https://github.com/kiva/ui/commit/bc92da09da503ad50cbd2569e67ab86e383b0135))

## [2.616.0](https://github.com/kiva/ui/compare/v2.615.1...v2.616.0) (2023-06-22)


### Features

* support kiva button on header ([f2bfbe4](https://github.com/kiva/ui/commit/f2bfbe4b7709f09b4183d448f1c688b1294eef2c))


### Bug Fixes

* header test ([4732d80](https://github.com/kiva/ui/commit/4732d801c47f7ba218ce47c35d03cda519c6f2a7))
* hide borrow btn for logged in users ([c12f15e](https://github.com/kiva/ui/commit/c12f15e86da2ac1719b2dd5237e54ff97c23cc02))
* resize event and log in button ([26cf262](https://github.com/kiva/ui/commit/26cf262825b4c6cbbc46dbfe8de0486b8435fa59))
* support kiva link ([c4cc154](https://github.com/kiva/ui/commit/c4cc154de3eb17382d20eb6c0606080713970737))

### [2.615.1](https://github.com/kiva/ui/compare/v2.615.0...v2.615.1) (2023-06-21)


### Bug Fixes

* changing cases for payment options ([1e124ec](https://github.com/kiva/ui/commit/1e124ecc2a0258ec7234f8dc77c6c6c1e97e2d8a))
* guest checkout controls not visible when logged in ([e3ba24c](https://github.com/kiva/ui/commit/e3ba24caa7ea907a8cad73a1e0d4acc861fb098c))

## [2.615.0](https://github.com/kiva/ui/compare/v2.614.1...v2.615.0) (2023-06-21)


### Features

* comment reporting ([fabc399](https://github.com/kiva/ui/commit/fabc39990b722402b271934bd0ae5bab3289e170))

### [2.614.1](https://github.com/kiva/ui/compare/v2.614.0...v2.614.1) (2023-06-15)


### Bug Fixes

* left align text ([446e4ad](https://github.com/kiva/ui/commit/446e4adbb8561c027a7c797647e37dc82631949b))
* remove string that states that the corp sponsor recommends loans ([3449a53](https://github.com/kiva/ui/commit/3449a530cee71d77cd912290126c368930ccd172))

## [2.614.0](https://github.com/kiva/ui/compare/v2.613.1...v2.614.0) (2023-06-15)


### Features

* guest checkout gated by feature flag in contentful ([2fc6f2d](https://github.com/kiva/ui/commit/2fc6f2da962bd3759f08c19e3cb43c306fea3396))
* guest checkout updates ([5161b44](https://github.com/kiva/ui/commit/5161b440d49ecb13d51acf8affafdf9fbaa3fc42))
* guest checkout updates ([6d24a42](https://github.com/kiva/ui/commit/6d24a42c425846e686ed02962eefc96c62b079ea))


### Bug Fixes

* added a period at the end of some copy ([e2b6b24](https://github.com/kiva/ui/commit/e2b6b24ced80de3e843f45c1d1ac2e28157691fc))
* changed check to be specific to promo guest checkout ([dcee35c](https://github.com/kiva/ui/commit/dcee35c0db217427d6733ebe58ff874ba4a37a8f))
* changing conditions for showing dropinpaymentwrapper ([537ac15](https://github.com/kiva/ui/commit/537ac153f17a0bbd6635800ddf9022c625722e6d))
* edits to checks affecting visibility of guest checkout components ([7e3c734](https://github.com/kiva/ui/commit/7e3c734b727d0bbcc18f9274ee0a311891daaca6))
* removed duplicate prop ([5d33da5](https://github.com/kiva/ui/commit/5d33da5117db179cc1c44ddfc91b7c633a254349))

### [2.613.1](https://github.com/kiva/ui/compare/v2.613.0...v2.613.1) (2023-06-15)


### Bug Fixes

* **DonationNudge:** lightbox should always have a title/label ([d627f0d](https://github.com/kiva/ui/commit/d627f0d75623e7f36cf04dda6d464ecfee7e0e8e))

## [2.613.0](https://github.com/kiva/ui/compare/v2.612.1...v2.613.0) (2023-06-15)


### Features

* **DonationNudge:** $1 donation upsell before no donation MARS-379 ([c4a359d](https://github.com/kiva/ui/commit/c4a359d3090410575b4a784518b3fcaced699823))

### [2.612.1](https://github.com/kiva/ui/compare/v2.612.0...v2.612.1) (2023-06-14)


### Bug Fixes

* remove duplicate loan query, use async await to control data and loan loading sequence ([7d79077](https://github.com/kiva/ui/commit/7d790775e056dd3d2632009ed982d64e5bc71bed))

## [2.612.0](https://github.com/kiva/ui/compare/v2.611.1...v2.612.0) (2023-06-13)


### Features

* only check filesystem for static files when the /static route is requested ([1581e11](https://github.com/kiva/ui/commit/1581e11b8c7b9f50cc638f7f96302031b927b9cd))
* remove supportkiva page ([a71a9db](https://github.com/kiva/ui/commit/a71a9db34b8678620dabc8be261cdedfd268448b))


### Bug Fixes

* remove unused component ([d51676e](https://github.com/kiva/ui/commit/d51676e42d2157e3cf8c23db508c10a6419eeea0))

### [2.611.1](https://github.com/kiva/ui/compare/v2.611.0...v2.611.1) (2023-06-12)


### Bug Fixes

* actually comment itself no longer makes sense ([79e6c2b](https://github.com/kiva/ui/commit/79e6c2b2b841ae68343a6f3f630413e9a3c47888))

## [2.611.0](https://github.com/kiva/ui/compare/v2.610.3...v2.611.0) (2023-06-12)


### Features

* add loan display events to lending home ([17020e0](https://github.com/kiva/ui/commit/17020e0da9d137296af5ef16b948751f012aea9a))


### Bug Fixes

* comment typo ([37605e2](https://github.com/kiva/ui/commit/37605e21209bc251c3706a9542b094196426fe43))

### [2.610.3](https://github.com/kiva/ui/compare/v2.610.2...v2.610.3) (2023-06-09)


### Bug Fixes

* the ATB error can be singular ([55ac4ea](https://github.com/kiva/ui/commit/55ac4eaf2bdb43d939603c7ac90b158a80699c40))

### [2.610.2](https://github.com/kiva/ui/compare/v2.610.1...v2.610.2) (2023-06-08)


### Bug Fixes

* disable tooltip for team links on mobile ([bf291c6](https://github.com/kiva/ui/commit/bf291c67442c71d91720da563fcfc0e6b00edbb0))

### [2.610.1](https://github.com/kiva/ui/compare/v2.610.0...v2.610.1) (2023-06-08)


### Bug Fixes

* only show monthly donation confirmation for monthly donations ([4e862aa](https://github.com/kiva/ui/commit/4e862aa73bb9ee03982bf06a6b1c205513d4c949))

## [2.610.0](https://github.com/kiva/ui/compare/v2.609.1...v2.610.0) (2023-06-07)


### Features

* combined logic into single test function, ensured all pages have balance available ([2c02965](https://github.com/kiva/ui/commit/2c02965f4aa26920ca4b525e852150bcd478a8ad))
* set default dropdown on new loan cards based on session cookie ([5a35439](https://github.com/kiva/ui/commit/5a35439b993211bd479cd64804bc7269e532a4ca))


### Bug Fixes

* check user balance for relending experiment ([f39e19c](https://github.com/kiva/ui/commit/f39e19cfa2297c77c8e8c981aafe904c115575df))
* cover non-logged-in user ([7650f34](https://github.com/kiva/ui/commit/7650f340b13e2afccf6cc9f27ca9f1aee7bf1845))
* merge aftermath removed ([f6b2419](https://github.com/kiva/ui/commit/f6b24197f3bc3eef1c860ad2ac22216f653eb386))
* minor cleanup from PR comments ([2c175ca](https://github.com/kiva/ui/commit/2c175ca333fe8beb9460eaf6d025d4279d17c84e))
* missed some things ([289a6e2](https://github.com/kiva/ui/commit/289a6e234bd5068dacea1b18592bea8d892bedad))
* some PR fixes ([15f4ff2](https://github.com/kiva/ui/commit/15f4ff23210f5289912096023d21e6cabf28afbd))
* unnecessary imports ([c172df9](https://github.com/kiva/ui/commit/c172df9d283a6f74f5a7e2b157bafb1767639f0b))

### [2.609.1](https://github.com/kiva/ui/compare/v2.609.0...v2.609.1) (2023-06-07)


### Bug Fixes

* mg page should show the already signed up box for modern subs ([03c1145](https://github.com/kiva/ui/commit/03c114565e2cbbb17108c1d997bab8d4a9792cc6))

## [2.609.0](https://github.com/kiva/ui/compare/v2.608.0...v2.609.0) (2023-06-07)


### Features

* live loan card image Kiva Classic styling option MARS-385 ([#4860](https://github.com/kiva/ui/issues/4860)) ([8cb3979](https://github.com/kiva/ui/commit/8cb39794218eb1fafe5e9337486165a398284e4d))

## [2.608.0](https://github.com/kiva/ui/compare/v2.607.0...v2.608.0) (2023-06-05)


### Features

* added generic thank you page for challenges from contentful ([886e8b9](https://github.com/kiva/ui/commit/886e8b98b43012e2b80ebeae633589f185e37184))

## [2.607.0](https://github.com/kiva/ui/compare/v2.606.1...v2.607.0) (2023-06-02)


### Features

* donate/supportus redirect as anchor tag ([b093eea](https://github.com/kiva/ui/commit/b093eeacfa6122fb048737d260e38852aa38f5b0))

### [2.606.1](https://github.com/kiva/ui/compare/v2.606.0...v2.606.1) (2023-06-01)


### Bug Fixes

* styles and share link logic ([702cd17](https://github.com/kiva/ui/commit/702cd17ed84c253dfe49e8c1ce65c4e4f58fa11a))

## [2.606.0](https://github.com/kiva/ui/compare/v2.605.0...v2.606.0) (2023-05-30)


### Features

* only donation thanks page ([d975367](https://github.com/kiva/ui/commit/d975367d4280432beab81e7af329afeae2e8dc9e))
* use param to show banner ([b8a07e4](https://github.com/kiva/ui/commit/b8a07e45ff16a58a90301ee9703f45cfbe37a18c))


### Bug Fixes

* eslint max-length ([3b5623c](https://github.com/kiva/ui/commit/3b5623c601aeb5e38d55c18242be00ac960146b9))
* remove component registration ([09cbeb3](https://github.com/kiva/ui/commit/09cbeb34f04b3d923a7450cb4ee8496544401639))
* remove unused component ([90efb7e](https://github.com/kiva/ui/commit/90efb7e346099f9eab158d977b27e02ba5c23c86))
* share msg and unused loanId ([bd609ea](https://github.com/kiva/ui/commit/bd609ea3bcfe57d9cb9d7cf847cfd531b320bbcc))
* thanks message test id and social colors ([c6f9838](https://github.com/kiva/ui/commit/c6f9838827fe8d8b90650f9aa6adad7e72200ac2))
* unused component ([944ae17](https://github.com/kiva/ui/commit/944ae1796fba479434998c6410aa30212fadd8e2))

## [2.605.0](https://github.com/kiva/ui/compare/v2.604.0...v2.605.0) (2023-05-30)


### Features

* populate lending stats badges section from contentful ([c389a76](https://github.com/kiva/ui/commit/c389a76ebff79a0ce169fdc0f1faf413e4886f7d))

## [2.604.0](https://github.com/kiva/ui/compare/v2.603.1...v2.604.0) (2023-05-25)


### Features

* make suggested loan comment a placeholder ([4d3ca4c](https://github.com/kiva/ui/commit/4d3ca4c2216be75fa543db5acdbd4cd182bc1690))

### [2.603.1](https://github.com/kiva/ui/compare/v2.603.0...v2.603.1) (2023-05-25)


### Bug Fixes

* summary card spacing ([7373d78](https://github.com/kiva/ui/commit/7373d786cdd29eb49f16bdf70628030cd90a7f6b))

## [2.603.0](https://github.com/kiva/ui/compare/v2.602.4...v2.603.0) (2023-05-25)


### Features

* add failed add donation to basket recovery process ([941ce48](https://github.com/kiva/ui/commit/941ce4887cc9c9b3e5c710336df989984eb8368e))


### Bug Fixes

* ensure donation amount is passed to setDonationAmount method ([b820d2e](https://github.com/kiva/ui/commit/b820d2eacd92e3691066f1ff96aab20f88eb701e))
* spelling fix ([934e5e3](https://github.com/kiva/ui/commit/934e5e3147e10b8afeeeb1be1f45268e6b950c1b))

### [2.602.4](https://github.com/kiva/ui/compare/v2.602.3...v2.602.4) (2023-05-23)


### Bug Fixes

* add success/error classes back ([3575537](https://github.com/kiva/ui/commit/3575537398e7642e4baecd399dcef5bbe7c4d221))

### [2.602.3](https://github.com/kiva/ui/compare/v2.602.2...v2.602.3) (2023-05-23)


### Bug Fixes

* add contentful based dynamic background colors to tailwind purge safelist ([9bd2582](https://github.com/kiva/ui/commit/9bd25828e34ec1ba822c77a472d5d3b5022a676a))

### [2.602.2](https://github.com/kiva/ui/compare/v2.602.1...v2.602.2) (2023-05-23)


### Bug Fixes

* zindex fix for qf ([ff84184](https://github.com/kiva/ui/commit/ff841841ff030e2c1ce47f9ada775b954dd7aa52))

### [2.602.1](https://github.com/kiva/ui/compare/v2.602.0...v2.602.1) (2023-05-19)


### Bug Fixes

* add text to time left in pfp ([d811001](https://github.com/kiva/ui/commit/d8110018341e863aaf7631e41ede517567bbf9dd))

## [2.602.0](https://github.com/kiva/ui/compare/v2.601.0...v2.602.0) (2023-05-19)


### Features

* request comments on thank you page ([#4840](https://github.com/kiva/ui/issues/4840)) ([5472b13](https://github.com/kiva/ui/commit/5472b13547f6cc501416fa01a6419cdeec51d159))

## [2.601.0](https://github.com/kiva/ui/compare/v2.600.0...v2.601.0) (2023-05-18)


### Features

* lend dropdown mobile update ([05d2b12](https://github.com/kiva/ui/commit/05d2b127dc7a7a316f9898cc3a6bf0c99e7caea7))


### Bug Fixes

* remove unnecessary code ([e8aaa37](https://github.com/kiva/ui/commit/e8aaa375bbd34003b4cf739d5e59ea2749f7342c))
* spacing fix mobile ([eaa9a24](https://github.com/kiva/ui/commit/eaa9a24d445906611e7461918d0028d3363a223a))

## [2.600.0](https://github.com/kiva/ui/compare/v2.599.0...v2.600.0) (2023-05-17)


### Features

* make the add all to basket event unique ([7c19f26](https://github.com/kiva/ui/commit/7c19f267ebfe1c6eb0cedbe14d7c3c72d1ef00d0))

## [2.599.0](https://github.com/kiva/ui/compare/v2.598.0...v2.599.0) (2023-05-16)


### Features

* add endorsements to borrower profile ([#4830](https://github.com/kiva/ui/issues/4830)) ([e8c7adf](https://github.com/kiva/ui/commit/e8c7adf06897f15885170a008868a1a8f140bb9c))

## [2.598.0](https://github.com/kiva/ui/compare/v2.597.0...v2.598.0) (2023-05-16)


### Features

* bring back synchronous add all to basket and checkout state to button ([401eed6](https://github.com/kiva/ui/commit/401eed606785db3582f977a9ca4d8a3751e87a9c))
* run all active experiment assignment on global preFetch ([ea2f14f](https://github.com/kiva/ui/commit/ea2f14f94e457d2351fab698526762c9be2ca9ac))

## [2.597.0](https://github.com/kiva/ui/compare/v2.596.1...v2.597.0) (2023-05-12)


### Features

* implement config based toggle for apollo batch link which remains on by default ([a01a1be](https://github.com/kiva/ui/commit/a01a1bec5bf529b331a352a6dc2f5c247bfd0b06))


### Bug Fixes

* wire up process.env check to config var ([b676ddc](https://github.com/kiva/ui/commit/b676ddc790242c32480989d03f08c0d7bde1a0c7))

### [2.596.1](https://github.com/kiva/ui/compare/v2.596.0...v2.596.1) (2023-05-12)


### Bug Fixes

* revert synchronous ATB ([85f5d31](https://github.com/kiva/ui/commit/85f5d31aba89bc61e38b722bc89a90e540437c32))

## [2.596.0](https://github.com/kiva/ui/compare/v2.595.0...v2.596.0) (2023-05-12)


### Features

* added more stories to cover use cases ([c72c8f0](https://github.com/kiva/ui/commit/c72c8f0077490f5744959dbdb7559ec457441230))
* fixed lend cta for five dollar notes ([b0e037e](https://github.com/kiva/ui/commit/b0e037eddd6671556d90e51620bb13334acb38f3))

## [2.595.0](https://github.com/kiva/ui/compare/v2.594.0...v2.595.0) (2023-05-11)


### Features

* fixed issue with add all race condition ([6ddd591](https://github.com/kiva/ui/commit/6ddd591c61ad2a43f961e8ab5fd4c9856260a960))


### Bug Fixes

* $5 notes exp CTA was missing ([7c25de4](https://github.com/kiva/ui/commit/7c25de42c87c6aa022a2fc2c15397e63b49c27ed))
* wrap add to basket in try catch ([4a3f269](https://github.com/kiva/ui/commit/4a3f269b94df92c764c4abd7eb82633be880ba1f))

## [2.594.0](https://github.com/kiva/ui/compare/v2.593.0...v2.594.0) (2023-05-10)


### Features

* check amount before ATB ([ec104ad](https://github.com/kiva/ui/commit/ec104ad06728af0e1dcdc725eb4a29c715b89958))

## [2.593.0](https://github.com/kiva/ui/compare/v2.592.0...v2.593.0) (2023-05-10)


### Features

* there was an edge case where a loan could be cleared by the "loading state" ([4cbdcdb](https://github.com/kiva/ui/commit/4cbdcdb3beeb22088c16ff08d08ed7a34ffcd3a9))

## [2.592.0](https://github.com/kiva/ui/compare/v2.591.0...v2.592.0) (2023-05-09)


### Features

* test setup added to filter page to redirect to new category filter page ([286463a](https://github.com/kiva/ui/commit/286463a58081379f0087bb91b433afd1fa894530))

## [2.591.0](https://github.com/kiva/ui/compare/v2.590.0...v2.591.0) (2023-05-09)


### Features

* test setup added to category page to redirect to new category filter page ([12b79b3](https://github.com/kiva/ui/commit/12b79b3380fd8ce4a71c3e2099b5b70c0ac61747))

## [2.590.0](https://github.com/kiva/ui/compare/v2.589.0...v2.590.0) (2023-05-09)


### Features

* match logic in CTA component for add all relending ([d05ada9](https://github.com/kiva/ui/commit/d05ada9219a780196fd7c1eb975fab6d6cf1e753))

## [2.589.0](https://github.com/kiva/ui/compare/v2.588.0...v2.589.0) (2023-05-09)


### Features

* fixes needed for relending experiment ([a144582](https://github.com/kiva/ui/commit/a14458281891c46ea13cb57c4a2b7818a79db87d))

## [2.588.0](https://github.com/kiva/ui/compare/v2.587.3...v2.588.0) (2023-05-08)


### Features

* copy updated for autolending pages from field partner to lending partner ([a045e52](https://github.com/kiva/ui/commit/a045e52f6ab4b5b6e02f7cd376a718767c193a97))

### [2.587.3](https://github.com/kiva/ui/compare/v2.587.2...v2.587.3) (2023-05-08)


### Bug Fixes

* team link for teams in new portfolio ([4605f5e](https://github.com/kiva/ui/commit/4605f5e402aa8f144b35217f2792f6dd31c87104))

### [2.587.2](https://github.com/kiva/ui/compare/v2.587.1...v2.587.2) (2023-05-05)


### Bug Fixes

* remove earth day id ([40cc15f](https://github.com/kiva/ui/commit/40cc15f7c5d9a7b344ee275cbf5be788d50a9526))

### [2.587.1](https://github.com/kiva/ui/compare/v2.587.0...v2.587.1) (2023-05-05)


### Reverts

* Revert "feat: add follow button to scroll to links on us loans" ([44e13f5](https://github.com/kiva/ui/commit/44e13f5b55f136b5cb45078dd1dd0cbf202a4bdf))
* Revert "feat: add feature flag for follow us loans functionality" ([dff7aa4](https://github.com/kiva/ui/commit/dff7aa450e830879c9c90f1c7d12d228e87244ed))

## [2.587.0](https://github.com/kiva/ui/compare/v2.586.0...v2.587.0) (2023-05-05)


### Features

* redirect and disabled option added to multiple button in lh ([68c9635](https://github.com/kiva/ui/commit/68c96352ae783f22a301d654bf3f125bb5cb1b64))

## [2.586.0](https://github.com/kiva/ui/compare/v2.585.0...v2.586.0) (2023-05-05)


### Features

* matched loans section moved up ([e026331](https://github.com/kiva/ui/commit/e0263316645b308199c5668b80994f9d474ca01b))
* matched loans section moved up quick filters and data prefetched ([4b0a449](https://github.com/kiva/ui/commit/4b0a44960b7e5db76533299865ac435ceac8b621))
* matched loans section position move up for relending test ([9b2bc5e](https://github.com/kiva/ui/commit/9b2bc5e6d6320b45ab716c9318be25e20eabcd1f))


### Bug Fixes

* dynamic class updated for first section ([994b162](https://github.com/kiva/ui/commit/994b162763bc0ad4a4daa8ba09f823acd74af579))
* prefetched data for matched loans section removed in lh ([4128c43](https://github.com/kiva/ui/commit/4128c435acebb304ec61e29ecf2130cd05f0b719))

## [2.585.0](https://github.com/kiva/ui/compare/v2.584.1...v2.585.0) (2023-05-04)


### Features

* property and value added to tracking event ([f5112dd](https://github.com/kiva/ui/commit/f5112dd5bcdd6b60b0dbfc686fab420dbf081999))
* tracking event added to multiple add to cart button un lending home ([7cbf867](https://github.com/kiva/ui/commit/7cbf8678a81a5359f1dbb206189dc4dce1c24c4a))


### Bug Fixes

* tracking event modified to align with our list of web events actions ([40a48e2](https://github.com/kiva/ui/commit/40a48e2a257dc9f245029deda8af7b5e7a1eca87))

### [2.584.1](https://github.com/kiva/ui/compare/v2.584.0...v2.584.1) (2023-05-04)


### Bug Fixes

* padding and spacing needed fixing for terms and conditions for SSO ([4a42fc3](https://github.com/kiva/ui/commit/4a42fc3ecfea1d449479afdea35e3f2266b83b21))

## [2.584.0](https://github.com/kiva/ui/compare/v2.583.0...v2.584.0) (2023-05-04)


### Features

* add hotjar event to US borrower profile ([d0d9528](https://github.com/kiva/ui/commit/d0d952896cf6a78255a5f8ae699df1dbe41b1a56))

## [2.583.0](https://github.com/kiva/ui/compare/v2.582.0...v2.583.0) (2023-05-04)


### Features

* welcome message removed in lending home for logged out users ([a28ac86](https://github.com/kiva/ui/commit/a28ac86bfd821a601d86df6a7fa2e3799ca129f4))


### Bug Fixes

* condition to show message improved ([add635f](https://github.com/kiva/ui/commit/add635f8fe785dd7634c02083dec306e68efd89b))

## [2.582.0](https://github.com/kiva/ui/compare/v2.581.4...v2.582.0) (2023-05-03)


### Features

* relending experience added to lending home page as a test ([6439ed0](https://github.com/kiva/ui/commit/6439ed0eea546ab2528b6d52c1879d58b7d670a2))


### Bug Fixes

* logic updated ([27e869e](https://github.com/kiva/ui/commit/27e869e7824319cafae6326011f18497664167ad))

### [2.581.4](https://github.com/kiva/ui/compare/v2.581.3...v2.581.4) (2023-05-03)


### Bug Fixes

* revert to prior node version until we can update other deps ([2fc28b6](https://github.com/kiva/ui/commit/2fc28b6842cb79ace121b2df1a5d8805177d28a1))

### [2.581.3](https://github.com/kiva/ui/compare/v2.581.2...v2.581.3) (2023-05-03)


### Bug Fixes

* update donation page copy ([82f59ae](https://github.com/kiva/ui/commit/82f59aee3c766e0831ad5a9623430d0f5a5f5798))

### [2.581.2](https://github.com/kiva/ui/compare/v2.581.1...v2.581.2) (2023-05-02)


### Bug Fixes

* changed location of the check that shows the basket when the show basket hash is present ([9759575](https://github.com/kiva/ui/commit/9759575c91ddc12afa97e6151ee4b03e5e0be53f))
* email verification form not appearing for every user ([6e687d7](https://github.com/kiva/ui/commit/6e687d7ce85d87a2077ca9ce72e7c47385098c01))

### [2.581.1](https://github.com/kiva/ui/compare/v2.581.0...v2.581.1) (2023-05-02)


### Bug Fixes

* hotjar suppression classes for PII on impact dashboard MARS-389 ([#4806](https://github.com/kiva/ui/issues/4806)) ([a60215c](https://github.com/kiva/ui/commit/a60215c02cb6a9042e45f96ebffa32a06546c9e2))

## [2.581.0](https://github.com/kiva/ui/compare/v2.580.1...v2.581.0) (2023-05-01)


### Features

* edited Kiva Classic Loan Card (dropdown menu and alignment fix) [CIT-68] ([aed48dc](https://github.com/kiva/ui/commit/aed48dc6791fea7057108a814c2fb8ceeda323ae))
* new button creadted for multiple atc actions in relending experiment ([169e8f6](https://github.com/kiva/ui/commit/169e8f6c782ad7afae828dc3fc79c880835baae2))


### Bug Fixes

* css attr replaced with tw configs ([b8c723a](https://github.com/kiva/ui/commit/b8c723a32ae5be9d832d6101d1aa5701e294c845))
* kv tokens updated ([23f4d9e](https://github.com/kiva/ui/commit/23f4d9ed5f4fab299d02eb6e8c14e83492b4a140))
* multipleactbutton simplified ([d62fbe6](https://github.com/kiva/ui/commit/d62fbe647e0d7dac8f1df81c2d5cc319a3c6223c))

### [2.580.1](https://github.com/kiva/ui/compare/v2.580.0...v2.580.1) (2023-04-27)


### Bug Fixes

* add missing initial click event for braintree type checkout button ([aeecc61](https://github.com/kiva/ui/commit/aeecc61c7089f96c925697ca936d67ea00d1d409))
* use new event format ([c703037](https://github.com/kiva/ui/commit/c703037f09e9f994a46c3ce18d3bebadf806e563))

## [2.580.0](https://github.com/kiva/ui/compare/v2.579.1...v2.580.0) (2023-04-25)


### Features

* copy updated in recommended section for relending test ([067c978](https://github.com/kiva/ui/commit/067c9782c4cd5221956dea319393f22d1ccef6f9))

### [2.579.1](https://github.com/kiva/ui/compare/v2.579.0...v2.579.1) (2023-04-25)


### Bug Fixes

* default losses needed to be negated for display and totals MARS-361 ([0d92e4b](https://github.com/kiva/ui/commit/0d92e4bb7481e556f218e5efa1e0f0ba0d5b174f))

## [2.579.0](https://github.com/kiva/ui/compare/v2.578.0...v2.579.0) (2023-04-25)


### Features

* including tests for new urlUtils function ([05a33de](https://github.com/kiva/ui/commit/05a33def322f7f82b23228cc688463eb24623cda))
* including tests for new urlUtils function ([f841bd0](https://github.com/kiva/ui/commit/f841bd04077e4ef57a0c1a29a451e1232f1a9b11))
* updated route usability ([4149b35](https://github.com/kiva/ui/commit/4149b353d374d43cadfcf812a0e7ebfedd60cbf4))


### Bug Fixes

* added global instance of route to computed property ([2239f9e](https://github.com/kiva/ui/commit/2239f9e193c404a1b1f5d550188752dded63ba73))
* adding back CampaignLoanRow.vue file; also merging remote branch of 'CIT-109.5' to local one ([b85098c](https://github.com/kiva/ui/commit/b85098c1f8c58ac967b0381d42bf98f9e9d753e0))
* adding back src/components/LoanCards/CorporateCampaignLoanCard.vue file ([507d692](https://github.com/kiva/ui/commit/507d692213d6549ad4607e0fb01395a7f4824ccb))
* additional edits ([9ddb502](https://github.com/kiva/ui/commit/9ddb502900b1047ff1d8097a2203d42dab097f99))
* minor fixes based on CIT-checkout-flow-improvemnt PR comments [CIT-110] ([bf0ba4c](https://github.com/kiva/ui/commit/bf0ba4cd151b53e0dcb5bbfa5f5000d9b335ed93))
* removed routeUtils, changed urlUtils, standardized isCCPage function acrossfiles ([e4cefc3](https://github.com/kiva/ui/commit/e4cefc304405e637b7c057883d23884423d05d1d))
* tests (CampaignLoanRow file is restored) ([dce074e](https://github.com/kiva/ui/commit/dce074e757aa2b18b3f074294e1a0cf40a3d27c6))

## [2.578.0](https://github.com/kiva/ui/compare/v2.577.1...v2.578.0) (2023-04-25)


### Features

* test setup added to lending home page for users with balance ([ce3b213](https://github.com/kiva/ui/commit/ce3b21323bd85632bcc03e123a3004875fa2c573))


### Bug Fixes

* balance validation changed in prefetch ([87a272b](https://github.com/kiva/ui/commit/87a272b1592ecd424977246b39a20cb9aa6d9079))
* userbalance const updated ([7ef5426](https://github.com/kiva/ui/commit/7ef5426ec961eee6da5eb84432dafd0fc26e623a))

### [2.577.1](https://github.com/kiva/ui/compare/v2.577.0...v2.577.1) (2023-04-25)


### Bug Fixes

* restore credit summary ([c02da8a](https://github.com/kiva/ui/commit/c02da8a3dc4d0a96ccf481500da4bc3ec02c61d4))

## [2.577.0](https://github.com/kiva/ui/compare/v2.576.0...v2.577.0) (2023-04-25)


### Features

* account balance sheet for impact dashboard MARS-361 ([7ef2d4c](https://github.com/kiva/ui/commit/7ef2d4cf16d86d08d4b8fc78734f463a8e6f087e))


### Bug Fixes

* bust component caches during development to avoid hydration mismatch ([1822bef](https://github.com/kiva/ui/commit/1822bef43543bce07be6057e4939571c1b9d718a))

## [2.576.0](https://github.com/kiva/ui/compare/v2.575.0...v2.576.0) (2023-04-24)


### Features

* ensure correct channel data is collected ([713429c](https://github.com/kiva/ui/commit/713429cd70dd11ebffc45edab842336f64933b67))

## [2.575.0](https://github.com/kiva/ui/compare/v2.574.0...v2.575.0) (2023-04-24)


### Features

* computed prop added for selected option in lend cta exp component ([f4309d0](https://github.com/kiva/ui/commit/f4309d0b5f3c2979840451854635290a1b86820a))


### Bug Fixes

* key structure updated ([37639ad](https://github.com/kiva/ui/commit/37639ad57c0f11cbf648d30ae08f72878691ff13))
* key updated in qf section to re render loan card ([34f12b1](https://github.com/kiva/ui/commit/34f12b130112f709370d9268bfe94c175ed02502))

## [2.574.0](https://github.com/kiva/ui/compare/v2.573.3...v2.574.0) (2023-04-24)


### Features

* add FLSS tracking to all pages and rename keys ([5966e5c](https://github.com/kiva/ui/commit/5966e5ceceb88ca57cd965df76431cf1783b2007))
* update ML experiment tracking ([d111bc8](https://github.com/kiva/ui/commit/d111bc8d0f8b0ad65cc8cae9f355e9aaeb0b2ef7))

### [2.573.3](https://github.com/kiva/ui/compare/v2.573.2...v2.573.3) (2023-04-21)


### Bug Fixes

* checkout screen freezes during checkout for managed lending campaign ([6ef7042](https://github.com/kiva/ui/commit/6ef7042dd9abd08a27671e2b6d8f064cff6b355e))
* linting ([59ccf9a](https://github.com/kiva/ui/commit/59ccf9ae50f78a4225634f72df841716a755e4a7))

### [2.573.2](https://github.com/kiva/ui/compare/v2.573.1...v2.573.2) (2023-04-20)


### Bug Fixes

* fixed issue with basket opening handler, ensured that after login, checkout modal state is maintained ([8091109](https://github.com/kiva/ui/commit/8091109157c59f4c9955158f6bca932b917e5867))

### [2.573.1](https://github.com/kiva/ui/compare/v2.573.0...v2.573.1) (2023-04-20)


### Bug Fixes

* testing ui dev deploy without k8s cpu limits ([3875663](https://github.com/kiva/ui/commit/38756635298aa113643047b3145bfef140dd8c8a))

## [2.573.0](https://github.com/kiva/ui/compare/v2.572.4...v2.573.0) (2023-04-20)


### Features

* update meta and add canonical link to LH ([0aeec9f](https://github.com/kiva/ui/commit/0aeec9f372b864354427b1f9a35bf6b6c3da76d9))

### [2.572.4](https://github.com/kiva/ui/compare/v2.572.3...v2.572.4) (2023-04-20)


### Bug Fixes

* here is the commit again ([0d4c55d](https://github.com/kiva/ui/commit/0d4c55d0be7543802df3c265b9844403d522d398))

### [2.572.3](https://github.com/kiva/ui/compare/v2.572.2...v2.572.3) (2023-04-20)


### Reverts

* Revert "fix: show basket button not working" ([fb39f12](https://github.com/kiva/ui/commit/fb39f12a4f0bb42e649f19f4f32c41d624c9c987))

### [2.572.2](https://github.com/kiva/ui/compare/v2.572.1...v2.572.2) (2023-04-20)


### Bug Fixes

* remove unused prop ([6b8882d](https://github.com/kiva/ui/commit/6b8882da1996285200f1357c9a809ec89b80be85))

### [2.572.1](https://github.com/kiva/ui/compare/v2.572.0...v2.572.1) (2023-04-20)


### Bug Fixes

* random small change ([b0c5cf1](https://github.com/kiva/ui/commit/b0c5cf1d5ff66ddf37bcbbdb2a344dfb0e262dbe))

## [2.572.0](https://github.com/kiva/ui/compare/v2.571.2...v2.572.0) (2023-04-20)


### Features

* additions to improve lighthouse scores in lending home ([d2eb366](https://github.com/kiva/ui/commit/d2eb3666cc0c2c7948508b2f28be0a4cfe6e1973))
* unused label removed from lend cta ([a45c1ff](https://github.com/kiva/ui/commit/a45c1ff35bb78b07a50f4694bb2e874bafc56481))


### Bug Fixes

* aria hidden changes reverted ([918f41d](https://github.com/kiva/ui/commit/918f41d528239dc36d9a9152d530353080f80140))

### [2.571.2](https://github.com/kiva/ui/compare/v2.571.1...v2.571.2) (2023-04-19)


### Bug Fixes

* changed cursor class of basket link in header ([253a474](https://github.com/kiva/ui/commit/253a4744d877fa0d16df5ea7cc5fbf2d4e4aa6bd))
* ensure scroll handler is called ([9434673](https://github.com/kiva/ui/commit/94346730900e5e52e30c7e2ee127a8b3fd94c3da))
* show basket button not working ([977e4bf](https://github.com/kiva/ui/commit/977e4bf4f5d4103942b26caa42cab701cc980ea5))

### [2.571.1](https://github.com/kiva/ui/compare/v2.571.0...v2.571.1) (2023-04-19)


### Bug Fixes

* test higher cpu request to see how it affects k8s throttling ([e206d19](https://github.com/kiva/ui/commit/e206d19f3bdcb01117319236e1040e41f203fe52))

## [2.571.0](https://github.com/kiva/ui/compare/v2.570.2...v2.571.0) (2023-04-19)


### Features

* code fixed to get recommended loans data cached to avoid loaders for visisble loans ([06dd3b4](https://github.com/kiva/ui/commit/06dd3b472d5e7633cc0d6a92e21f3f2b57ec6eeb))
* extended fragment and query added to recommended loans prefetch in lh page ([660d427](https://github.com/kiva/ui/commit/660d427073b422546a3babfca268f0d23cedb9df))
* method added to get loan callouts ([6a1c590](https://github.com/kiva/ui/commit/6a1c5905633cfc9023e32d579fdd46010e476486))

### [2.570.2](https://github.com/kiva/ui/compare/v2.570.1...v2.570.2) (2023-04-18)


### Bug Fixes

* email verification bug fix ([e679b6b](https://github.com/kiva/ui/commit/e679b6bb9ff03bf5b5bcb8736818c8c14d2445e4))

### [2.570.1](https://github.com/kiva/ui/compare/v2.570.0...v2.570.1) (2023-04-17)


### Bug Fixes

* defensive programming ([0eaef95](https://github.com/kiva/ui/commit/0eaef95c443d15d737a27f29b37b8cd7228ff3e0))
* pass query params with redirect to LH ([a3441b9](https://github.com/kiva/ui/commit/a3441b96c24f66457d7256dfa6ae03afafb6fb5a))

## [2.570.0](https://github.com/kiva/ui/compare/v2.569.0...v2.570.0) (2023-04-14)


### Features

* lending home header updated ([38e1ffb](https://github.com/kiva/ui/commit/38e1ffbdf4ce19454cff463308ae292da793874d))

## [2.569.0](https://github.com/kiva/ui/compare/v2.568.0...v2.569.0) (2023-04-13)


### Features

* add matching bubble when loan is in basket ([0e71045](https://github.com/kiva/ui/commit/0e71045fdf7e98cc5f5914ddbdc683039302b077))

## [2.568.0](https://github.com/kiva/ui/compare/v2.567.0...v2.568.0) (2023-04-13)


### Features

* min height removed from new loan cards in quick filters section in lending home ([c1a3381](https://github.com/kiva/ui/commit/c1a3381618c5797af136feef2757686bb209f240))

## [2.567.0](https://github.com/kiva/ui/compare/v2.566.0...v2.567.0) (2023-04-13)


### Features

* prioritize video on borrower profile ([f41301a](https://github.com/kiva/ui/commit/f41301aad3fe526d6ab7bc4f0bc78526764a8eae))

## [2.566.0](https://github.com/kiva/ui/compare/v2.565.0...v2.566.0) (2023-04-12)


### Features

* toast welcome message and lightbox removed from lh page ([209cb15](https://github.com/kiva/ui/commit/209cb158d94b4ec911d3702245d352da0fe199ee))


### Bug Fixes

* unused images removed ([ccf89b7](https://github.com/kiva/ui/commit/ccf89b71d0787ff9b515f62a0695005c8163095a))

## [2.565.0](https://github.com/kiva/ui/compare/v2.564.0...v2.565.0) (2023-04-12)


### Features

* make the supported button remove loans from the basket ([2434252](https://github.com/kiva/ui/commit/2434252be89472aad5000c7ec1b211aed477e342))


### Bug Fixes

* ensure that a logo height value is read even when not provided via contentful ([47c135f](https://github.com/kiva/ui/commit/47c135f7e057e3232c6c4a580678213bc6036d4e))
* removed unused prop ([d2b8548](https://github.com/kiva/ui/commit/d2b85481bc302827fba8c7356cc5047583d89a02))

## [2.564.0](https://github.com/kiva/ui/compare/v2.563.0...v2.564.0) (2023-04-12)


### Features

* lending home test added for new users and rolled out to existing users ([17ace4b](https://github.com/kiva/ui/commit/17ace4b927d66057249197f89bd33eaff6a24915))

## [2.563.0](https://github.com/kiva/ui/compare/v2.562.2...v2.563.0) (2023-04-11)


### Features

* copy updated for matched lending row in lending home when adding fallback options ([8604b8c](https://github.com/kiva/ui/commit/8604b8cc514c03a9ff7b328da49d694204bc88f3))

### [2.562.2](https://github.com/kiva/ui/compare/v2.562.1...v2.562.2) (2023-04-11)


### Bug Fixes

* experiment name needed to be consistent with previous experiment ([9ffad31](https://github.com/kiva/ui/commit/9ffad31e0bdefbbacfd8f0cdd3303e494ee74cee))

### [2.562.1](https://github.com/kiva/ui/compare/v2.562.0...v2.562.1) (2023-04-11)


### Bug Fixes

* add test ids for impact dashboard sections ([1c1bbd9](https://github.com/kiva/ui/commit/1c1bbd90af4af87bd96857f0ff245db456231729))
* tracking events for distribution graph tab clicks MARS-357 ([9a56587](https://github.com/kiva/ui/commit/9a56587872ea01d9182336bb84c5426864700ef3))

## [2.562.0](https://github.com/kiva/ui/compare/v2.561.0...v2.562.0) (2023-04-10)


### Features

* fallback loans added to matched loans if they are less than 3 in lending home ([98e01da](https://github.com/kiva/ui/commit/98e01da3b9500d3e8b87032e0ee11045f036e560))
* using fallback function when matched loans are less than 3 instead of 1 ([d475c86](https://github.com/kiva/ui/commit/d475c86dab259c1a71af9db0078ebbe914071fb4))


### Bug Fixes

* flag removed ([975653c](https://github.com/kiva/ui/commit/975653cde9266917ad581ddb56e8014ea86fd40b))

## [2.561.0](https://github.com/kiva/ui/compare/v2.560.1...v2.561.0) (2023-04-10)


### Features

* new bookmark button added to new loan card ([6593f3b](https://github.com/kiva/ui/commit/6593f3b22e85c3fdcd4aa6ab2c44fad38ce8fa93))


### Bug Fixes

* design fixes and unused code removed ([75a5f37](https://github.com/kiva/ui/commit/75a5f37b3b5ac1c81ae8c4ee99c5fc3f5e052573))

### [2.560.1](https://github.com/kiva/ui/compare/v2.560.0...v2.560.1) (2023-04-10)


### Bug Fixes

* use experiment key instead of name ([023d65d](https://github.com/kiva/ui/commit/023d65d666d3012a6f2dd16fae4d051146561917))

## [2.560.0](https://github.com/kiva/ui/compare/v2.559.1...v2.560.0) (2023-04-10)


### Features

* add sso terms to social registration page when custom sso is used ([e1672e2](https://github.com/kiva/ui/commit/e1672e247a11683695879eaa7085ef3404720819))

### [2.559.1](https://github.com/kiva/ui/compare/v2.559.0...v2.559.1) (2023-04-10)


### Bug Fixes

* don't show CTA until progress loaded ([2be99e8](https://github.com/kiva/ui/commit/2be99e89dc8448b362f3298caa85a57a2aaff808))

## [2.559.0](https://github.com/kiva/ui/compare/v2.558.0...v2.559.0) (2023-04-10)


### Features

* large loan card variation ([8e856fb](https://github.com/kiva/ui/commit/8e856fba8e5ae77d352a5484c218afa32131a13c))


### Bug Fixes

* callouts work fine without 50% restriction ([9aebe3e](https://github.com/kiva/ui/commit/9aebe3e248143e9d130497eae227fa4dce3eff68))
* portfolio stories needed updated path ([7853198](https://github.com/kiva/ui/commit/785319802d48cee5bcc5705119b0767078b682ba))

## [2.558.0](https://github.com/kiva/ui/compare/v2.557.0...v2.558.0) (2023-04-07)


### Features

* impact dashboard experiment code MARS-367 ([43ef112](https://github.com/kiva/ui/commit/43ef112b20441ea8b66c29552cc74f44bfc1b708))

## [2.557.0](https://github.com/kiva/ui/compare/v2.556.0...v2.557.0) (2023-04-07)


### Features

* earth day challenge ([0ea9acd](https://github.com/kiva/ui/commit/0ea9acd86d6c4befd9335e19f3b9f01ba5d6bb1a))

## [2.556.0](https://github.com/kiva/ui/compare/v2.555.0...v2.556.0) (2023-04-06)


### Features

* tracking event added where dropdown changes for new and old loan cards ([cf71fad](https://github.com/kiva/ui/commit/cf71fad5f7ad86051c6017106425ee1074b6015f))

## [2.555.0](https://github.com/kiva/ui/compare/v2.554.0...v2.555.0) (2023-04-06)


### Features

* grid added to filter page for new loan cards test ([e22cd0e](https://github.com/kiva/ui/commit/e22cd0e4311467b7650243682544468265a07462))
* new loan card test added to filter page ([2477a34](https://github.com/kiva/ui/commit/2477a341fbc2698056b6cbb97843d64b5d5e1c15))


### Bug Fixes

* avoid updating state for new loan card test ([a3db5ac](https://github.com/kiva/ui/commit/a3db5aca682c0edc106a3a3952cf349d09b84510))

## [2.554.0](https://github.com/kiva/ui/compare/v2.553.0...v2.554.0) (2023-04-04)


### Features

* add messaging to top of checkout modal ([71b495b](https://github.com/kiva/ui/commit/71b495b291cdc4670af154a7c479a521992e5a86))
* adding automatic allocation of excess credits ([f310af9](https://github.com/kiva/ui/commit/f310af96f049088a00132d5b025dec8c40388aa5))
* adding loan to basket when upc credit is excess ([7e5843b](https://github.com/kiva/ui/commit/7e5843bff306fc68945754cab090112024cd8a01))
* campaign progress bar edits ([d3d0186](https://github.com/kiva/ui/commit/d3d01860dc68b8223bfea1e030b7082415cdedd7))


### Bug Fixes

* add a conditional in case promo name doesn't come up ([6a0fee7](https://github.com/kiva/ui/commit/6a0fee7dc213110a7e31d45aa8b1e6a7dcd537c7))
* adding ordertotal changes in with flag indicating if we are on the campaign page, addressing basket error as well ([3c734f8](https://github.com/kiva/ui/commit/3c734f85761bdacb824a73b2511126b8721fb96d))
* addressing pr comments ([a9647ac](https://github.com/kiva/ui/commit/a9647acd979efa1ede1b6c31dc0fce1bd1d96d0d))
* addressing pr comments ([ae4251d](https://github.com/kiva/ui/commit/ae4251d28b0ca18360a574c62e8c091eb2b36aba))
* addressing some errors ([d87a5bf](https://github.com/kiva/ui/commit/d87a5bf13ee586bc8e032f1ec3a9d94448fd79fc))
* change font size and format for kiva credits ([6941b89](https://github.com/kiva/ui/commit/6941b89d4383e507fc7f0acd23e3a158691197bb))
* CIT-67 and CIT-69 ([807e6d0](https://github.com/kiva/ui/commit/807e6d0b66f159951cb9c140ad89b148ad370dc6))
* fixing jump to loans behavior ([b3f8b7a](https://github.com/kiva/ui/commit/b3f8b7ae9e42dcb5a501911db9577cd42918376a))
* get logic for adding and removing allocated excess credits right ([083af77](https://github.com/kiva/ui/commit/083af77d1b8b1e3832e42c35581fea686449b685))
* merge conflict ([10bb25e](https://github.com/kiva/ui/commit/10bb25e29d006a05ba90b7644bd55d24f3417cee))
* merge conflicts ([2f48f29](https://github.com/kiva/ui/commit/2f48f2942402e2b3b878c8ef80fbf3ab5453513c))
* only add leftover credit allocation when checkout is visible ([da6bade](https://github.com/kiva/ui/commit/da6badedb99d4a09f189e68717bc87f9ce68e427))
* package-lock.json ([606758b](https://github.com/kiva/ui/commit/606758bcea34c0aae8446f4c130e2fabf9cc0231))
* package-lock.json ([1a29d95](https://github.com/kiva/ui/commit/1a29d950035e71036d3cbb67239e26105c52db62))
* pr updates working on loading states for checkout ([7a474b6](https://github.com/kiva/ui/commit/7a474b671dab61f63d6215f94bc5229b6746e54e))
* promoName reinstated ([01d8961](https://github.com/kiva/ui/commit/01d8961160fdf31c5c9b4910bef46deb3a653aae))
* removed duplicate key ([61f5d0e](https://github.com/kiva/ui/commit/61f5d0e73b52a510e485c33e96f4acd08c7c78a4))
* removed updated npm/node ([7eba5de](https://github.com/kiva/ui/commit/7eba5de70622cae7102ad49962060bf4a57a4c41))

## [2.553.0](https://github.com/kiva/ui/compare/v2.552.2...v2.553.0) (2023-04-04)


### Features

* five dollars notes added to help me choose feat ([dd567ff](https://github.com/kiva/ui/commit/dd567ffdd2b5748e9ebe17c60ed1d137b0a90534))

### [2.552.2](https://github.com/kiva/ui/compare/v2.552.1...v2.552.2) (2023-04-03)


### Bug Fixes

* increase gap between rows of recent loans on portfolio overview MARS-350 ([c0f0cc0](https://github.com/kiva/ui/commit/c0f0cc0b6d7a774f4b120fc9ef54e6c9f9a8d752))

### [2.552.1](https://github.com/kiva/ui/compare/v2.552.0...v2.552.1) (2023-04-03)


### Bug Fixes

* don't assume HTMLElement exists globally ([a979df5](https://github.com/kiva/ui/commit/a979df518155d76db19eefed8ca8a149c305e155))

## [2.552.0](https://github.com/kiva/ui/compare/v2.551.0...v2.552.0) (2023-04-03)


### Features

* html elements as KvPopper controllers and KvTooltip drop shadow ([0bb3430](https://github.com/kiva/ui/commit/0bb3430a9495ec2f1f92fb7f2d8f87524da2ab64))
* portfolio loan count distribution graphs MARS-357 ([300eae9](https://github.com/kiva/ui/commit/300eae936a54de412df301982280acc5fa90c722))
* server caching and query failure handling for portfolio overview components ([fea3057](https://github.com/kiva/ui/commit/fea30575ccf543669a35b7b61645cfc9665396fe))
* support multiple target elements in delayUntilVisible mixin ([6ecd96d](https://github.com/kiva/ui/commit/6ecd96d42fa7e493ed79446ce14827d36975fd30))

## [2.551.0](https://github.com/kiva/ui/compare/v2.550.0...v2.551.0) (2023-03-31)


### Features

* add feature flag for follow us loans functionality ([3942c37](https://github.com/kiva/ui/commit/3942c379b00bbdc68c2927a2f62a9a7ee9246146))
* add follow button to scroll to links on us loans ([c1d5786](https://github.com/kiva/ui/commit/c1d578607795a95d2eac25133a11987e03993709))

## [2.550.0](https://github.com/kiva/ui/compare/v2.549.1...v2.550.0) (2023-03-31)


### Features

* clickable loan tags in new loan card ([eb92d0a](https://github.com/kiva/ui/commit/eb92d0a99a773cb710fce00e047b32c79ec487df))
* no underline added when link is focused ([4de6dc9](https://github.com/kiva/ui/commit/4de6dc92b90167e4e7607a768f0148c42b014548))
* prop added to new loan card to hide more cta in use component ([b469d2a](https://github.com/kiva/ui/commit/b469d2a8502b85f481c9e969a9a23571ea3a098e))


### Bug Fixes

* margins replaced by paddings to avoid cursor gaps between elements ([d5255d9](https://github.com/kiva/ui/commit/d5255d9ccfbc878d7654d208f2c1c6083918d8a8))
* resolve $5 notes issues ([8371691](https://github.com/kiva/ui/commit/83716918aa76a1ddb44ef84b354951dc43660b8e))
* some loans get the loan data immediately ([2b79502](https://github.com/kiva/ui/commit/2b795020aa9c6783226fef8020fa060cf566a522))
* unused condition removed ([663b624](https://github.com/kiva/ui/commit/663b624e65d9f76ee23e618838d349cc3253337e))

### [2.549.1](https://github.com/kiva/ui/compare/v2.549.0...v2.549.1) (2023-03-30)


### Bug Fixes

* active experiment list should be split ([f8712f5](https://github.com/kiva/ui/commit/f8712f5d6e202ea739a1f98f1ee1f6b5485d6725))

## [2.549.0](https://github.com/kiva/ui/compare/v2.548.0...v2.549.0) (2023-03-30)


### Features

* add id to experiment log message ([e040945](https://github.com/kiva/ui/commit/e04094560c5d79bb91c139076cfa55183261ba8b))

## [2.548.0](https://github.com/kiva/ui/compare/v2.547.0...v2.548.0) (2023-03-30)


### Features

* add kiva capital page to Footer ([e06ffd4](https://github.com/kiva/ui/commit/e06ffd4824c441cf800e84f14d39f5a410e4e5e1))

## [2.547.0](https://github.com/kiva/ui/compare/v2.546.2...v2.547.0) (2023-03-30)


### Features

* localized meta properties experiment ([ffa47fd](https://github.com/kiva/ui/commit/ffa47fd74502f507394fc10525b820eb48132f2f))

### [2.546.2](https://github.com/kiva/ui/compare/v2.546.1...v2.546.2) (2023-03-29)


### Bug Fixes

* wrong category ID prop was being used ([91fe0f8](https://github.com/kiva/ui/commit/91fe0f8b438906765f0e7390317d43d24a27e6e9))

### [2.546.1](https://github.com/kiva/ui/compare/v2.546.0...v2.546.1) (2023-03-29)


### Bug Fixes

* five dollar notes fixed for amounts left less than 25 dollars ([aa6742f](https://github.com/kiva/ui/commit/aa6742fd504186be7b7e776396d0d55a8fc0515e))

## [2.546.0](https://github.com/kiva/ui/compare/v2.545.0...v2.546.0) (2023-03-29)


### Features

* five dollars notes added when amount left in a loan is less than 25 dollars ([436658c](https://github.com/kiva/ui/commit/436658c43c7117763642be6994066515b17f4bef))
* five dollars notes test added to checkout page for cases with less than 25 as amount left ([c764bc3](https://github.com/kiva/ui/commit/c764bc37886c0d73d5f405258c021c5d492590ce))


### Bug Fixes

* bugs fixed for borrower profile and checkout page ([a65259c](https://github.com/kiva/ui/commit/a65259c803e0d951bc685bd81348894ce791985a))
* comments added to computed prop ([5d6baba](https://github.com/kiva/ui/commit/5d6baba917969637af8dbab9faef3e5ccfe45bae))
* prefetching five dollars test in checkout page and other issues ([7732f25](https://github.com/kiva/ui/commit/7732f25583f599a666463ff2ace5c059eda47270))
* unneeded experiment assignment removed ([7b4e399](https://github.com/kiva/ui/commit/7b4e39910656a84861d8cd7190661055c6ef4920))

## [2.545.0](https://github.com/kiva/ui/compare/v2.544.1...v2.545.0) (2023-03-29)


### Features

* allow multiple setuiab query string params in same URL ([663b9c6](https://github.com/kiva/ui/commit/663b9c66e3999cda4ec3ba580a95589a4a1cdb3a))


### Bug Fixes

* missed change jsdoc type ([1812f2e](https://github.com/kiva/ui/commit/1812f2e6ea635ed7284bc5463dc5c239976a6479))
* one test wasn't quite right ([fb2eaae](https://github.com/kiva/ui/commit/fb2eaaef87e3e175ed6a40a7e705285dd4a010c8))

### [2.544.1](https://github.com/kiva/ui/compare/v2.544.0...v2.544.1) (2023-03-29)


### Bug Fixes

* add exp assignment for matching_highlight ([5796745](https://github.com/kiva/ui/commit/5796745831b0c08dd25b222ee92d7e7bbea5f6a6))

## [2.544.0](https://github.com/kiva/ui/compare/v2.543.1...v2.544.0) (2023-03-28)


### Features

* query forced saved in cookie assignment ([99f645c](https://github.com/kiva/ui/commit/99f645c1126434cfcf53182dc48c2fcf4acd4801))

### [2.543.1](https://github.com/kiva/ui/compare/v2.543.0...v2.543.1) (2023-03-28)


### Bug Fixes

* add spacing below team koin prompt MARS-356 ([3a814b7](https://github.com/kiva/ui/commit/3a814b77639466cac60c8bc650229a474499d794))
* adjust padding and col-span for lending stats page ([edd779a](https://github.com/kiva/ui/commit/edd779ac315cb9edcbf358ca6f7f110cd9093697))
* link to my-loans page for credit stats details MARS-352 ([162c921](https://github.com/kiva/ui/commit/162c921add50872c4d565cba2229f61fa517a148))
* use numeral to format percentile stat MARS-355 ([a37786f](https://github.com/kiva/ui/commit/a37786f7ce28e8b8274dcddc43abeb08023d0633))

## [2.543.0](https://github.com/kiva/ui/compare/v2.542.1...v2.543.0) (2023-03-28)


### Features

* your teams section for portfolio overview MARS-356 ([a5cb1b5](https://github.com/kiva/ui/commit/a5cb1b5f4ed4280cc847a1164ee1dc6e8a9dc2fd))

### [2.542.1](https://github.com/kiva/ui/compare/v2.542.0...v2.542.1) (2023-03-28)


### Bug Fixes

* loans were missing from bandit data ([06ea760](https://github.com/kiva/ui/commit/06ea7601c2e2960319b5536c25a52958881688c3))

## [2.542.0](https://github.com/kiva/ui/compare/v2.541.1...v2.542.0) (2023-03-28)


### Features

* experimentation refactor with login ID assignment ([c01880b](https://github.com/kiva/ui/commit/c01880be0586415e91b5e2d7032e82e693dc1a3f))


### Bug Fixes

* get hash from forced assignment in cookie ([88af92a](https://github.com/kiva/ui/commit/88af92addcda2bf78d3ab5027e74283052bfec61))
* undefined now also passed to track event ([0d0d658](https://github.com/kiva/ui/commit/0d0d65870fe65864b667a64d9873363b31a5d4b3))

### [2.541.1](https://github.com/kiva/ui/compare/v2.541.0...v2.541.1) (2023-03-27)


### Bug Fixes

* add missing new id field ([13e4bc2](https://github.com/kiva/ui/commit/13e4bc24d78280ad915ff36e5014dfe1bedc29dc))

## [2.541.0](https://github.com/kiva/ui/compare/v2.540.0...v2.541.0) (2023-03-27)


### Features

* portfolio overview lending insights MARS-355 ([e69c465](https://github.com/kiva/ui/commit/e69c46565eba3e425ff0445e7b4d5c3e3bc786b9))


### Bug Fixes

* create variants of portfolio section for minor style differences ([f721c1b](https://github.com/kiva/ui/commit/f721c1ba48a009d936a3ca30221bc9f24ad21745))
* handle duplicate update ids MARS-354 ([20e70d7](https://github.com/kiva/ui/commit/20e70d70cfc35a308b2453540cf423d44751d6c9))

## [2.540.0](https://github.com/kiva/ui/compare/v2.539.0...v2.540.0) (2023-03-27)


### Features

* journal updates about loans on portfolio overview MARS-354 ([e5c6ba5](https://github.com/kiva/ui/commit/e5c6ba5aa418bb383dc775d00e1babecf8fa4d9c))

## [2.539.0](https://github.com/kiva/ui/compare/v2.538.0...v2.539.0) (2023-03-27)


### Features

* matching highlight experiment ([b968c90](https://github.com/kiva/ui/commit/b968c9047f81d12078366fbc5723bfe83ad90ef3))

## [2.538.0](https://github.com/kiva/ui/compare/v2.537.1...v2.538.0) (2023-03-24)


### Features

* add earth day theme ([a9fa55e](https://github.com/kiva/ui/commit/a9fa55ed082be182743834b8d06e6f1da724039b))

### [2.537.1](https://github.com/kiva/ui/compare/v2.537.0...v2.537.1) (2023-03-24)


### Bug Fixes

* copy fixes for kiva credit stats MARS-352 ([c79be68](https://github.com/kiva/ui/commit/c79be68c78402be0bb53d2c321af913ee211e0b9))
* recent loans progress bar width fixes MARS-350 ([6eea1e1](https://github.com/kiva/ui/commit/6eea1e1533f163b33e22c5f53ff0aa75e2a6fb6e))

## [2.537.0](https://github.com/kiva/ui/compare/v2.536.1...v2.537.0) (2023-03-23)


### Features

* five dollars notes test options added to checkout page ([6071d6e](https://github.com/kiva/ui/commit/6071d6e2f870ec0babe22be9dfeca2f66414fef2))


### Bug Fixes

* unused prop removed ([c9edb2e](https://github.com/kiva/ui/commit/c9edb2eaf6bb0d53566aa71fdead9cbe81c6c87e))

### [2.536.1](https://github.com/kiva/ui/compare/v2.536.0...v2.536.1) (2023-03-22)


### Bug Fixes

* temp fix for new id field on my endpoint ([6dc580c](https://github.com/kiva/ui/commit/6dc580ce3135b1cab95be8e5c0a574dff7cebfbb))

## [2.536.0](https://github.com/kiva/ui/compare/v2.535.1...v2.536.0) (2023-03-22)


### Features

* function to get dropdown options array added to loanutils file ([0b981ba](https://github.com/kiva/ui/commit/0b981ba7022b7755ae741d5a92c9799d0816fff0))
* price array updated for five dollars notes in some pages ([7b8924c](https://github.com/kiva/ui/commit/7b8924cae6c847e4674612f36600484a637ce26d))
* unit tests added for getdropdownpricearray function in loanutils file ([1bccfe1](https://github.com/kiva/ui/commit/1bccfe1d777594cc3f0cf61b31de456d4e8745e3))


### Bug Fixes

* unit test fixed for loanutils file ([d44bea1](https://github.com/kiva/ui/commit/d44bea11c54a436a677c6fd6a75a4f4bd43a2168))

### [2.535.1](https://github.com/kiva/ui/compare/v2.535.0...v2.535.1) (2023-03-21)


### Bug Fixes

* row view on new campaign pages is showing fewer loans than grid view ([e1d2873](https://github.com/kiva/ui/commit/e1d2873698d11ae2f3a3ec877a86a56980e12214))

## [2.535.0](https://github.com/kiva/ui/compare/v2.534.0...v2.535.0) (2023-03-20)


### Features

* show the focused share ask for guest checkout for us loans ([8bb6b10](https://github.com/kiva/ui/commit/8bb6b1062987a8629b63aee5d69d2d28f6bff8c8))

## [2.534.0](https://github.com/kiva/ui/compare/v2.533.0...v2.534.0) (2023-03-17)


### Features

* experiment assignment with alea pseudo random number generator ([b4fab35](https://github.com/kiva/ui/commit/b4fab35832674bb5b593acc6a4f49870094f4720))


### Bug Fixes

* eslint disable no longer needed ([7d8f809](https://github.com/kiva/ui/commit/7d8f8095cdd048129cd58d0feefbf193a370a059))
* merge issue ([1705dd1](https://github.com/kiva/ui/commit/1705dd1debdc10a1e7b5a637482aeb1558c0a866))
* unassigned string is no longer needed for comparisons ([3d596e9](https://github.com/kiva/ui/commit/3d596e991645f3d50b5a196f4253685f7599083a))

## [2.533.0](https://github.com/kiva/ui/compare/v2.532.0...v2.533.0) (2023-03-17)


### Features

* kiva credit stats for portfolio overview page MARS-352 ([eeb7262](https://github.com/kiva/ui/commit/eeb72623dfb4d73f4c3e15d6cc6da65114f353e6))

## [2.532.0](https://github.com/kiva/ui/compare/v2.531.1...v2.532.0) (2023-03-16)


### Features

* a tags for cps contentful pages ([7320d03](https://github.com/kiva/ui/commit/7320d0361b373b0312d2e21e879e1f0d42580181))

### [2.531.1](https://github.com/kiva/ui/compare/v2.531.0...v2.531.1) (2023-03-16)


### Bug Fixes

* add donate pages ([36999b7](https://github.com/kiva/ui/commit/36999b71a6f39eb867625f37514e95a229a8f390))

## [2.531.0](https://github.com/kiva/ui/compare/v2.530.1...v2.531.0) (2023-03-16)


### Features

* round down percentages to the nearest whole number of BP ([9362f67](https://github.com/kiva/ui/commit/9362f67943e221bdfa3a0813bb04ae8335fe9df5))


### Bug Fixes

* more targeted rounding ([b648e67](https://github.com/kiva/ui/commit/b648e673fe941073f839ee91f77272135f80761f))

### [2.530.1](https://github.com/kiva/ui/compare/v2.530.0...v2.530.1) (2023-03-16)


### Bug Fixes

* cleanup old experiment setting loading of thanks_share_module ([a9ee213](https://github.com/kiva/ui/commit/a9ee213f03bdeafeabc506eef856330285edf863))

## [2.530.0](https://github.com/kiva/ui/compare/v2.529.0...v2.530.0) (2023-03-15)


### Features

* recommended loans section for portfolio overiew page MARS-351 ([69d715e](https://github.com/kiva/ui/commit/69d715e5b56a25ff03bd094a9ef3debea3036138))


### Bug Fixes

* adjust loading styles to minimize CLS for AccountOverview MARS-349 ([6c3da17](https://github.com/kiva/ui/commit/6c3da1777e33dd2d5516464fea5cc3cc9395611c))
* adjust loading styles to minimize CLS for Recent Loans section MARS-350 ([88aa4ba](https://github.com/kiva/ui/commit/88aa4ba5bc2daa47df95ba91f589951e32ca4657))
* handle uncaught promise to prevent dev server crash ([3dacd40](https://github.com/kiva/ui/commit/3dacd407a813cffe3f326591b47111ff342b825f))

## [2.529.0](https://github.com/kiva/ui/compare/v2.528.2...v2.529.0) (2023-03-15)


### Features

* mixin for five dollars notes test added to some pages ([eab0b05](https://github.com/kiva/ui/commit/eab0b05990b40d3c70721f94d1be4c3dd845a6d6))

### [2.528.2](https://github.com/kiva/ui/compare/v2.528.1...v2.528.2) (2023-03-15)


### Bug Fixes

* header rendering (added a fallback option when promoName is false) ([5d7d220](https://github.com/kiva/ui/commit/5d7d220ce952d06a892a85e172c7bb5f5bdf3649))

### [2.528.1](https://github.com/kiva/ui/compare/v2.528.0...v2.528.1) (2023-03-15)


### Bug Fixes

* add missing optional chaining operator in FundedBorrowerProfile ([d756a62](https://github.com/kiva/ui/commit/d756a6277842b225af744b35df3429dbbd5e5e85))
* remove unused props and components ([e88d02d](https://github.com/kiva/ui/commit/e88d02dbe82f65121d913a0b39a58e9a54d9a55d))
* restore bp summary card loan use test id ([47fba10](https://github.com/kiva/ui/commit/47fba103f04ed73bdb72301991f3629d299cbfbd))

## [2.528.0](https://github.com/kiva/ui/compare/v2.527.2...v2.528.0) (2023-03-14)


### Features

* replace router-link for hp and comment out hp route ([a789dd0](https://github.com/kiva/ui/commit/a789dd0d79bd88833bab8ba429ee81c7a3f544f5))

### [2.527.2](https://github.com/kiva/ui/compare/v2.527.1...v2.527.2) (2023-03-14)


### Bug Fixes

* unable to read undefined props in CCLanding and LoanChannel pages ([9ebf147](https://github.com/kiva/ui/commit/9ebf147d90609d5128796749a10c65b7ccdc2c1e))

### [2.527.1](https://github.com/kiva/ui/compare/v2.527.0...v2.527.1) (2023-03-14)


### Bug Fixes

* only send optimizely events if tracked value is greater than 0 ([76eda71](https://github.com/kiva/ui/commit/76eda71043d88b51323888aa08653a49d8fafc61))

## [2.527.0](https://github.com/kiva/ui/compare/v2.526.2...v2.527.0) (2023-03-13)


### Features

* [CIT-102] changing cc landing page header to match design specs ([6a772d9](https://github.com/kiva/ui/commit/6a772d9d3a82f8fd5665b812e64cb16d76d3295e))


### Bug Fixes

* indentation and other linting issues ([f187df4](https://github.com/kiva/ui/commit/f187df4149d8641d9fc7560a42ef56bb288d423b))

### [2.526.2](https://github.com/kiva/ui/compare/v2.526.1...v2.526.2) (2023-03-10)


### Bug Fixes

* ensure e2e test uses ui header ([4e8f958](https://github.com/kiva/ui/commit/4e8f958b5ffbbeff283e4148bfc68a227940fb11))
* removed unused components ([287d2ce](https://github.com/kiva/ui/commit/287d2ce2b08061164beb20bcbd3055037210b51f))
* reserved loan cards should still be clickable ([6edd204](https://github.com/kiva/ui/commit/6edd204d06e8968ea3b63e96fa9923596048e2fc))
* use sitemap instead ([0985655](https://github.com/kiva/ui/commit/0985655dcca043668aa1260a8ea4ad5fd399953a))

### [2.526.1](https://github.com/kiva/ui/compare/v2.526.0...v2.526.1) (2023-03-10)


### Bug Fixes

* add new error code when basket.shop is null and move retry atb to mounted hook ([a419244](https://github.com/kiva/ui/commit/a4192445ec4f09df48027612b6d39445892b288d))

## [2.526.0](https://github.com/kiva/ui/compare/v2.525.1...v2.526.0) (2023-03-10)


### Features

* more link element added to loanuse component ([fe1204d](https://github.com/kiva/ui/commit/fe1204d92d81a143f8f64fcf850a431ef6a9a872))


### Bug Fixes

* prop an unused css code removed ([9b8544f](https://github.com/kiva/ui/commit/9b8544f17e4337a672fb005bbbefc0618535bd8c))

### [2.525.1](https://github.com/kiva/ui/compare/v2.525.0...v2.525.1) (2023-03-10)


### Bug Fixes

* remove organizationType due to redundancy and being not used ([1b2bc3c](https://github.com/kiva/ui/commit/1b2bc3c45e5f7ecb31d41c370e4e556d19042173))

## [2.525.0](https://github.com/kiva/ui/compare/v2.524.0...v2.525.0) (2023-03-10)


### Features

* recent loans section for Portfolio Overview page MARS-350 ([b16a796](https://github.com/kiva/ui/commit/b16a79633a599d3740e77365e3e502b40bee6f12))

## [2.524.0](https://github.com/kiva/ui/compare/v2.523.1...v2.524.0) (2023-03-10)


### Features

* handle invalid basket cookie ([4816b70](https://github.com/kiva/ui/commit/4816b70bad225d4a397668bae2042b9893051f8f))
* retry add loan to the basket when basket cookie has expired ([2871c8a](https://github.com/kiva/ui/commit/2871c8a75c7ab229c3dc4ef58948dcd36432a797))


### Bug Fixes

* cookie name and show tip msg when reloading the page ([407ff9c](https://github.com/kiva/ui/commit/407ff9c14b997b27ac5b9850c7df11454bbcbab9))
* mutation basketId type ([2a01cae](https://github.com/kiva/ui/commit/2a01caee1230508e6ae30f068fb684deda616979))
* set placeholder for shop id optimisticResponse ([390d273](https://github.com/kiva/ui/commit/390d2732007e142133c5b3698eb90b900051ce7f))

### [2.523.1](https://github.com/kiva/ui/compare/v2.523.0...v2.523.1) (2023-03-10)


### Bug Fixes

* comment out lp route handling for cms-page-server verification ([48ad0c6](https://github.com/kiva/ui/commit/48ad0c6dc0caa85c71bed8f25c7fdecfe2300f4a))

## [2.523.0](https://github.com/kiva/ui/compare/v2.522.0...v2.523.0) (2023-03-09)


### Features

* add test id based on loan type to bp ([914d0d6](https://github.com/kiva/ui/commit/914d0d64b988227ebd7f6fe10f78e8d0b5ae7a50))

## [2.522.0](https://github.com/kiva/ui/compare/v2.521.1...v2.522.0) (2023-03-09)


### Features

* new ui for quick filters showed under a test ([3ca3400](https://github.com/kiva/ui/commit/3ca34009dc06a97c069380e7c746e3b618bfc5b6))


### Bug Fixes

* padding fixed when pills are showed ([f749500](https://github.com/kiva/ui/commit/f74950021a618d3e4b400d300248644d72b890b9))
* unused prop removed from locationselector component ([1fe526c](https://github.com/kiva/ui/commit/1fe526c74d6aa029c9cc443ac6a333b32a89b05a))

### [2.521.1](https://github.com/kiva/ui/compare/v2.521.0...v2.521.1) (2023-03-09)


### Bug Fixes

* api error from querying trusteeType ([c3bf4b7](https://github.com/kiva/ui/commit/c3bf4b7eeca184066cf190ca35d402ac2268db39))
* labels ([9b8ec8b](https://github.com/kiva/ui/commit/9b8ec8bb612d6f502794b3fce278f4e8967a48f0))

## [2.521.0](https://github.com/kiva/ui/compare/v2.520.0...v2.521.0) (2023-03-09)


### Features

* mg experiment removed from lend menu ([7c7c7e2](https://github.com/kiva/ui/commit/7c7c7e2b2bad87dd7332312690b830f1261f5d4f))


### Bug Fixes

* unusued mgentrypoint instances removed ([d83c391](https://github.com/kiva/ui/commit/d83c391478a44102ac9b4964ef260b923e2f3000))

## [2.520.0](https://github.com/kiva/ui/compare/v2.519.1...v2.520.0) (2023-03-08)


### Features

* update auto deposit copy ([ef31c8e](https://github.com/kiva/ui/commit/ef31c8e931acee41857290f8ef7760ad134d9efd))

### [2.519.1](https://github.com/kiva/ui/compare/v2.519.0...v2.519.1) (2023-03-08)


### Bug Fixes

* added loan amount to ATB events on category and lend/filter pages ([71404b5](https://github.com/kiva/ui/commit/71404b5f94a346a78bfef5e1ec21e14638e7a1d2))

## [2.519.0](https://github.com/kiva/ui/compare/v2.518.0...v2.519.0) (2023-03-07)


### Features

* allow guest users who have logged in to participate in lending-home exp ([cd80a91](https://github.com/kiva/ui/commit/cd80a916ada09c5cb465074708d58ec106e6ea52))
* change LH headers for logged out users ([f9682e8](https://github.com/kiva/ui/commit/f9682e8ce6d1defd74a4c3148ad54f4251e69a03))

## [2.518.0](https://github.com/kiva/ui/compare/v2.517.0...v2.518.0) (2023-03-07)


### Features

* field partner replaced by lending partner at bottom of bp ([232c950](https://github.com/kiva/ui/commit/232c9505cae3160f636873e764457b28cecd5498))
* stop gender pills moving when selected ([2802a1b](https://github.com/kiva/ui/commit/2802a1b75ef2d4c3c4d894fcd11bb03258388097))

## [2.517.0](https://github.com/kiva/ui/compare/v2.516.0...v2.517.0) (2023-03-07)


### Features

* empty state added to category page for non-loans result ([b0c49e7](https://github.com/kiva/ui/commit/b0c49e7b8fade0cc7b86bcccc5d9d1b98ab517c9))


### Bug Fixes

* emtpy state fixed for promo card version ([994cad7](https://github.com/kiva/ui/commit/994cad77f8e1e95bf6a2a6beb9b687039857df8f))

## [2.516.0](https://github.com/kiva/ui/compare/v2.515.0...v2.516.0) (2023-03-06)


### Features

* loading state for quick filter genders ([0b58eeb](https://github.com/kiva/ui/commit/0b58eebd5066f25beff7ee04925cc8c5e0170f5a))


### Bug Fixes

* minor clean-up ([80223a3](https://github.com/kiva/ui/commit/80223a3263e2ad811eb7c837ab445e712be02500))

## [2.515.0](https://github.com/kiva/ui/compare/v2.514.1...v2.515.0) (2023-03-06)


### Features

* messages updated for already loans in lendctaexp component ([2160e02](https://github.com/kiva/ui/commit/2160e0244502eebac93907ec3b062c626fc198e8))


### Bug Fixes

* bg color replaced for funded message ([7678577](https://github.com/kiva/ui/commit/7678577cf197e6f01c8ba122825d75a0db8f6637))

### [2.514.1](https://github.com/kiva/ui/compare/v2.514.0...v2.514.1) (2023-03-06)


### Bug Fixes

* use prefetch client ([2c96783](https://github.com/kiva/ui/commit/2c96783dd1f2c75294a02ab8ca741462dcd54c9d))

## [2.514.0](https://github.com/kiva/ui/compare/v2.513.0...v2.514.0) (2023-03-06)


### Features

* mfi recommendations experiment removed from lbc page ([1b5f39c](https://github.com/kiva/ui/commit/1b5f39cfbfc03f04df30fcafe5b7d9338744967a))


### Bug Fixes

* trigger moved for spotlight observer ([5975272](https://github.com/kiva/ui/commit/597527257b9ad4cdf11d308128def2b71506eaa4))

## [2.513.0](https://github.com/kiva/ui/compare/v2.512.0...v2.513.0) (2023-03-03)


### Features

* lazy loading method added to spotlight section in lending home ([2fb4428](https://github.com/kiva/ui/commit/2fb4428894c68dd7cea0d2e8ed68c4a9ea5030de))

## [2.512.0](https://github.com/kiva/ui/compare/v2.511.0...v2.512.0) (2023-03-02)


### Features

* additional pages added to quick filter sections in lh ([6c64ef8](https://github.com/kiva/ui/commit/6c64ef88f977469c1dac61d44367a0021b9c240a))


### Bug Fixes

* unused method removed in quickfiltersection component ([45a2302](https://github.com/kiva/ui/commit/45a23028bd71dd78b5ad400335391f36d174d07b))

## [2.511.0](https://github.com/kiva/ui/compare/v2.510.2...v2.511.0) (2023-03-02)


### Features

* server cache data for first two recommended loans ([872bd23](https://github.com/kiva/ui/commit/872bd23809eb63156367b6d709580abd40e83498))

### [2.510.2](https://github.com/kiva/ui/compare/v2.510.1...v2.510.2) (2023-03-02)


### Bug Fixes

* remaining tracking ([1ec8b1b](https://github.com/kiva/ui/commit/1ec8b1bb30ef251bcef64a5a5c815a93737789ae))

### [2.510.1](https://github.com/kiva/ui/compare/v2.510.0...v2.510.1) (2023-03-02)


### Bug Fixes

* mismatched experiment key ([973a28f](https://github.com/kiva/ui/commit/973a28f0147cc75c208fba4910bed9d48e26dd2e))

## [2.510.0](https://github.com/kiva/ui/compare/v2.509.0...v2.510.0) (2023-03-02)


### Features

* portfolio overview page frame and account summary MARS-349 ([5dcda40](https://github.com/kiva/ui/commit/5dcda4077d819a9ace30dbb93c35a23b2c4e53ae))


### Bug Fixes

* remove foundation styles from portfolio & settings menus and lending stats page ([7f1ce30](https://github.com/kiva/ui/commit/7f1ce30bca3ea52d0f2f209fffb022ac4e01877c))

## [2.509.0](https://github.com/kiva/ui/compare/v2.508.1...v2.509.0) (2023-03-01)


### Features

* padding decreased for lend again button in lendctaexp component ([8d74d4d](https://github.com/kiva/ui/commit/8d74d4df27b15a62ca24cd91317bd080a1a46e49))


### Bug Fixes

* css fixed for first span in lend again button ([d4eb750](https://github.com/kiva/ui/commit/d4eb750d41ad8b56190200a1e88a6571129bbdd2))
* css updates lendctaexp ([670a291](https://github.com/kiva/ui/commit/670a2911191f9a78da3f902a3830d683f09ec11f))

### [2.508.1](https://github.com/kiva/ui/compare/v2.508.0...v2.508.1) (2023-03-01)


### Bug Fixes

* filters should be able to handle undefined facets object ([0fec7f8](https://github.com/kiva/ui/commit/0fec7f8acc1a4abb49593734b03864e89ef8c32e))
* handle undefined params for radio group options ([4a628c5](https://github.com/kiva/ui/commit/4a628c5b83e6ead4c5264406aa24c4902b65c88f))

## [2.508.0](https://github.com/kiva/ui/compare/v2.507.1...v2.508.0) (2023-03-01)


### Features

* iwd challenge redirect and thank you page ([33145e8](https://github.com/kiva/ui/commit/33145e84637b61a966679c1743eb08c2901bbfb6))

### [2.507.1](https://github.com/kiva/ui/compare/v2.507.0...v2.507.1) (2023-02-28)


### Bug Fixes

* more white space removed for product qa ([ca937f7](https://github.com/kiva/ui/commit/ca937f7a13c804df0c17239b409f4a1add004513))

## [2.507.0](https://github.com/kiva/ui/compare/v2.506.0...v2.507.0) (2023-02-28)


### Features

* progress bar copy updated when loan is already funded ([dbf0c05](https://github.com/kiva/ui/commit/dbf0c055b81907450c2a37d413d18f3fe507b39a))


### Bug Fixes

* loanprogressgroup test file updated ([405ac74](https://github.com/kiva/ui/commit/405ac74928821369f739f30e609773fe5cbd5711))

## [2.506.0](https://github.com/kiva/ui/compare/v2.505.0...v2.506.0) (2023-02-28)


### Features

* number of loans for recommended section in lh increased to 12 ([9fd5a84](https://github.com/kiva/ui/commit/9fd5a84cfcad16eff4e7429680068400f80cf220))

## [2.505.0](https://github.com/kiva/ui/compare/v2.504.0...v2.505.0) (2023-02-28)


### Features

* new ui ([5230f56](https://github.com/kiva/ui/commit/5230f56f14d4bdc0e07c4a21e8ec8dea92c66361))
* updated quick filters ui ([10acbae](https://github.com/kiva/ui/commit/10acbae7774629b79eb5909549178906059e6458))


### Bug Fixes

* another lint ([af82768](https://github.com/kiva/ui/commit/af82768d427537810cb2daa7ac9b0e99b80012d7))
* design updates, pr comments, and tw adjustments ([a11c0ab](https://github.com/kiva/ui/commit/a11c0ab088fc861e9897c3aaad193e4e08da7de9))
* linter ([802da82](https://github.com/kiva/ui/commit/802da821a51be56f0c5c64c62bef4978ca51f499))
* location dropdown min width ([31364e5](https://github.com/kiva/ui/commit/31364e5c43ca1cb505e3b05611a780b04a3a984b))
* ui updates and pr comments ([c25a287](https://github.com/kiva/ui/commit/c25a2873ae4c5c2819147cdc170b182c8ef0225e))

## [2.504.0](https://github.com/kiva/ui/compare/v2.503.0...v2.504.0) (2023-02-27)


### Features

* loanCallouts unit tests and associated fixes ([aac89b0](https://github.com/kiva/ui/commit/aac89b007f07b06265267d4f57757cff46e25873))

## [2.503.0](https://github.com/kiva/ui/compare/v2.502.0...v2.503.0) (2023-02-24)


### Features

* hover on card update, cleaned up stories ([8cb0f05](https://github.com/kiva/ui/commit/8cb0f051f4eba56b5a377d36f011709e94c30722))

## [2.502.0](https://github.com/kiva/ui/compare/v2.501.0...v2.502.0) (2023-02-24)


### Features

* flss ismatchable rolled out in lh matched loans ([1a2a231](https://github.com/kiva/ui/commit/1a2a23167b705ac260f032204c7c752af741ebc7))

## [2.501.0](https://github.com/kiva/ui/compare/v2.500.4...v2.501.0) (2023-02-24)


### Features

* tracking events added for spotlight variations in lh ([a313e5c](https://github.com/kiva/ui/commit/a313e5c26a591a508e3e795239a67204884958ad))

### [2.500.4](https://github.com/kiva/ui/compare/v2.500.3...v2.500.4) (2023-02-24)


### Bug Fixes

* duplicated data replaced for spotlightdata file ([fe34b6d](https://github.com/kiva/ui/commit/fe34b6dcd41e9d230af373570bf518c32fa76dec))

### [2.500.3](https://github.com/kiva/ui/compare/v2.500.2...v2.500.3) (2023-02-24)


### Bug Fixes

* added some safe code checks ([ad9ba4e](https://github.com/kiva/ui/commit/ad9ba4ea7ddeb1a66f49fc4b6074c322ce20ad0f))
* one more test change ([865884f](https://github.com/kiva/ui/commit/865884f6dc7456d6c12be4d8392c5e654795647d))

### [2.500.2](https://github.com/kiva/ui/compare/v2.500.1...v2.500.2) (2023-02-24)


### Bug Fixes

* add private flag to live loan image serve ([5b3c9f0](https://github.com/kiva/ui/commit/5b3c9f0def4a7a0f0ea15ab19dd76948faeb7c74))
* extract protectedRoutes and adjust checking mechanism and add new routes ([84d25b8](https://github.com/kiva/ui/commit/84d25b8aaf4392588a4b5c9f7c48cb124e8d87ea))

### [2.500.1](https://github.com/kiva/ui/compare/v2.500.0...v2.500.1) (2023-02-24)


### Bug Fixes

* resolve errors with read/write query for autolending ([1760424](https://github.com/kiva/ui/commit/17604240802889b76c1deff503b29ba5c057a7b2))

## [2.500.0](https://github.com/kiva/ui/compare/v2.499.0...v2.500.0) (2023-02-23)


### Features

* dynamic data for spotlight section added with rotation based in a cookie ([5ed2f1e](https://github.com/kiva/ui/commit/5ed2f1e2b5ef568553e5a36608aec4725d7dc31a))


### Bug Fixes

* pr fixes ([691bf16](https://github.com/kiva/ui/commit/691bf163b917bae337f80f8b86c465b2e5ca1f90))

## [2.499.0](https://github.com/kiva/ui/compare/v2.498.1...v2.499.0) (2023-02-22)


### Features

* spotlight component updated to be reusable ([b8ff074](https://github.com/kiva/ui/commit/b8ff074ebe79826597de9f3c4d0c3b8f91ae183e))


### Bug Fixes

* headline rendered as html ([b236bbb](https://github.com/kiva/ui/commit/b236bbb707d3b2a8b3b8d19208a873608621f585))
* style fixes in partner spotlight component ([f77c7cf](https://github.com/kiva/ui/commit/f77c7cf85c99229e3e2cba47dcb12a285e3a178f))

### [2.498.1](https://github.com/kiva/ui/compare/v2.498.0...v2.498.1) (2023-02-22)


### Bug Fixes

* remove algolia-poc page ([5e0c29b](https://github.com/kiva/ui/commit/5e0c29bf374a9abe710f0403c4769819d052bfcb))

## [2.498.0](https://github.com/kiva/ui/compare/v2.497.8...v2.498.0) (2023-02-21)


### Features

* new loan card click analytics ([5575922](https://github.com/kiva/ui/commit/55759229b1c56103acc06d1bc5621bb71a139c81))


### Bug Fixes

* use FLSS for matched-loans category ([2669dab](https://github.com/kiva/ui/commit/2669dab92b72c5ea0c9e365fb58b17a8916b13cc))

### [2.497.8](https://github.com/kiva/ui/compare/v2.497.7...v2.497.8) (2023-02-21)


### Bug Fixes

* lending home test setup moved to created hook avoiding to show old card when mounting ([6d33ac0](https://github.com/kiva/ui/commit/6d33ac06df53ee42bc69d96b2a8ef230d8b0bcd0))

### [2.497.7](https://github.com/kiva/ui/compare/v2.497.6...v2.497.7) (2023-02-21)


### Bug Fixes

* changing the loan grid/row view logic ([09adddf](https://github.com/kiva/ui/commit/09adddf63e080a447e9a9dbb4854abec7ef8551a))
* editing settings for loan query ([a1dec1a](https://github.com/kiva/ui/commit/a1dec1aa62ee098add6fe39de7e4cd563c1fd641))
* loan row and grid view toggle wasn't working ([70052f4](https://github.com/kiva/ui/commit/70052f4179069ecfecc6297bd40939128715a8df))

### [2.497.6](https://github.com/kiva/ui/compare/v2.497.5...v2.497.6) (2023-02-21)


### Bug Fixes

* capitalization ([fd7230d](https://github.com/kiva/ui/commit/fd7230d21a7f2681f4b1f2b0b6c383dad48bb60c))

### [2.497.5](https://github.com/kiva/ui/compare/v2.497.4...v2.497.5) (2023-02-18)


### Bug Fixes

* fallback props for autolending resolver ([4954b73](https://github.com/kiva/ui/commit/4954b73736f9fca438e1dd5a7f09339db346520e))
* revert autolending merge ([6038ad6](https://github.com/kiva/ui/commit/6038ad699639bf278dff6be42a4e14bbe1743030))
* updated Apollo updateQuery usage for downgrade ([fa3100e](https://github.com/kiva/ui/commit/fa3100eec37a18bed3c3605263542837410c4a21))

### [2.497.4](https://github.com/kiva/ui/compare/v2.497.3...v2.497.4) (2023-02-17)


### Bug Fixes

* card width fixed for carousels in lh page ([0c02d13](https://github.com/kiva/ui/commit/0c02d13346eede23057f622d53a978686c17929e))
* padding fix for new loan card in lh carousels ([5bea85a](https://github.com/kiva/ui/commit/5bea85a130337f7474387882a3e04eeb34d642a0))

### [2.497.3](https://github.com/kiva/ui/compare/v2.497.2...v2.497.3) (2023-02-16)


### Bug Fixes

* downgrade @apollo/client to v3.3.21 to address memory leak ([10f429c](https://github.com/kiva/ui/commit/10f429c13039fb7f83fe5bbdbe1899194fe23157))

### [2.497.2](https://github.com/kiva/ui/compare/v2.497.1...v2.497.2) (2023-02-16)


### Bug Fixes

* height fixed for new loan cards in lendingcategorysection component ([17192db](https://github.com/kiva/ui/commit/17192db44f612d2f2de8172e77e8c1b5c2fb29ee))

### [2.497.1](https://github.com/kiva/ui/compare/v2.497.0...v2.497.1) (2023-02-16)


### Bug Fixes

* missing optional chaining ([df8083d](https://github.com/kiva/ui/commit/df8083d6351a7e540837d38cc26d0cbdf4cddc31))

## [2.497.0](https://github.com/kiva/ui/compare/v2.496.0...v2.497.0) (2023-02-15)


### Features

* partner list updated for loan channels 33 and 68 in loan channel query map file ([20dd962](https://github.com/kiva/ui/commit/20dd9625832eb1b9080e0a3ed620be017f51f61f))

## [2.496.0](https://github.com/kiva/ui/compare/v2.495.2...v2.496.0) (2023-02-15)


### Features

* ab test added to categories page to be redirected to lbc page ([c606631](https://github.com/kiva/ui/commit/c6066311066e5fd53c9664c77f8e4bef6f15be46))


### Bug Fixes

* comma removed for consistency ([a0a5e9f](https://github.com/kiva/ui/commit/a0a5e9f1e91b6e0d608df8ee6b742c3a31f9dd4e))
* prefetch chain updated in categories page ([16f1ac5](https://github.com/kiva/ui/commit/16f1ac5839f28202c6232ed50ffa1c6974de9d85))

### [2.495.2](https://github.com/kiva/ui/compare/v2.495.1...v2.495.2) (2023-02-15)


### Bug Fixes

* missing fallback array ([a7daa55](https://github.com/kiva/ui/commit/a7daa554e9c519b0742351fb0a9e2a384008566f))

### [2.495.1](https://github.com/kiva/ui/compare/v2.495.0...v2.495.1) (2023-02-14)


### Bug Fixes

* log for when channel not found in map ([8823514](https://github.com/kiva/ui/commit/8823514cd7b94e76b39727ea13bacc7dbd588deb))
* some missing optional chaining based on logs ([71847f9](https://github.com/kiva/ui/commit/71847f9ef09ddc0c8864814268027528bbfaf882))
* touch should toggle categories menu ([67b5412](https://github.com/kiva/ui/commit/67b54124ad9c4557356d65c2ee63e0a5c4211e5c))

## [2.495.0](https://github.com/kiva/ui/compare/v2.494.1...v2.495.0) (2023-02-14)


### Features

* add user attribute for when a user has a us loan in basket ([9bb69ee](https://github.com/kiva/ui/commit/9bb69eeb65e95dd94806e6dbca1fc8e9f250e265))

### [2.494.1](https://github.com/kiva/ui/compare/v2.494.0...v2.494.1) (2023-02-14)


### Bug Fixes

* missing optional chaining ([5a4e1c3](https://github.com/kiva/ui/commit/5a4e1c337ef33d6125a02e0221291eef6f95d015))

## [2.494.0](https://github.com/kiva/ui/compare/v2.493.0...v2.494.0) (2023-02-14)


### Features

* use loan channel headline, metaTitle, metaDescription from api MARS-321 ([f8f2237](https://github.com/kiva/ui/commit/f8f2237657a46df98c066cc0860f348dc95bacef))


### Bug Fixes

* remove MARS-317 experiment code MARS-342 ([a78bb59](https://github.com/kiva/ui/commit/a78bb598fbd805449dcdf9573831d1116ca46280))

## [2.493.0](https://github.com/kiva/ui/compare/v2.492.0...v2.493.0) (2023-02-14)


### Features

* move journals up on the page ([4c730ca](https://github.com/kiva/ui/commit/4c730cacfaff68e83b433951f5525a89cafc1ecb))

## [2.492.0](https://github.com/kiva/ui/compare/v2.491.5...v2.492.0) (2023-02-14)


### Features

* data fetch update for matched loans in lh ([8ded19d](https://github.com/kiva/ui/commit/8ded19d52d011b936fabaf1fa090ab8d7ebeda68))

### [2.491.5](https://github.com/kiva/ui/compare/v2.491.4...v2.491.5) (2023-02-14)


### Bug Fixes

* progress was changing on mount, callouts now just loaded on mount ([0e08cf1](https://github.com/kiva/ui/commit/0e08cf193050f35b5d6a01e5efef1b497c68553e))
* revert change to reduce file churn ([95708ac](https://github.com/kiva/ui/commit/95708ac5a0bc4f58cf80a17c33eb34890edc229b))
* set progress bar clientside, add loader to loan callouts ([f3006e5](https://github.com/kiva/ui/commit/f3006e5911658622709151ef71ec2b11fa0922f6))

### [2.491.4](https://github.com/kiva/ui/compare/v2.491.3...v2.491.4) (2023-02-14)


### Bug Fixes

* categories button click behavior ([7544b6d](https://github.com/kiva/ui/commit/7544b6db0d83f2e8f980e54b1cd4ec5dbf7f29e5))

### [2.491.3](https://github.com/kiva/ui/compare/v2.491.2...v2.491.3) (2023-02-14)


### Bug Fixes

* ensure login links always go to login MARS-327 ([dac0fbd](https://github.com/kiva/ui/commit/dac0fbd3fbc3afd38e4c3edc8dbe79b980cc251a))

### [2.491.2](https://github.com/kiva/ui/compare/v2.491.1...v2.491.2) (2023-02-13)


### Bug Fixes

* remove MARS-124 experiment code MARS-223 ([acd780b](https://github.com/kiva/ui/commit/acd780b55d1cd8fafe93a701b187d7c61260be2c))

### [2.491.1](https://github.com/kiva/ui/compare/v2.491.0...v2.491.1) (2023-02-13)


### Bug Fixes

* add private and no-cache headers for auth routes, add more private routes ([c4119a1](https://github.com/kiva/ui/commit/c4119a1e6a8c128222de7467fab992712d22cd3b))

## [2.491.0](https://github.com/kiva/ui/compare/v2.490.1...v2.491.0) (2023-02-13)


### Features

* new loand card styles updated ([5bc4cd6](https://github.com/kiva/ui/commit/5bc4cd63339e155d612b63a8ac02b492c93e8d82))


### Bug Fixes

* consistent outer padding on cards ([f4f4d94](https://github.com/kiva/ui/commit/f4f4d948d945f2e0047f773cf309c9c819e2c523))
* linting issues ([eb02e8e](https://github.com/kiva/ui/commit/eb02e8ea2fcb9325aa861719d7ae6c0907bde246))
* minor cleanup ([6974a41](https://github.com/kiva/ui/commit/6974a412bdd40ef75e4b8cf91964cdc7bbe75052))
* old MG card sizing, center align old cards ([3c1cbaf](https://github.com/kiva/ui/commit/3c1cbaf5e2dd71792bc4ed426ebb2e198ec558f7))
* removed inGrid, fixed stories, fixed help me choose padding ([6d07480](https://github.com/kiva/ui/commit/6d0748091e6290be806cfd39b776de7731a84434))
* style fixes for new loan card ([f52a9ea](https://github.com/kiva/ui/commit/f52a9ea95b8c2cdf71d910a6c5c4a1192fcb0777))
* update old MG card to match old loan cards ([023b72d](https://github.com/kiva/ui/commit/023b72d63104f56e7d075c257a168fdd1c30cd1a))

### [2.490.1](https://github.com/kiva/ui/compare/v2.490.0...v2.490.1) (2023-02-13)


### Bug Fixes

* reverted FLSS isMatchable work ([c62a38f](https://github.com/kiva/ui/commit/c62a38f5ea44e103f806361a98befe46ed64f71a))

## [2.490.0](https://github.com/kiva/ui/compare/v2.489.0...v2.490.0) (2023-02-10)


### Features

* show the lending-home toast for 10s ([3c71db4](https://github.com/kiva/ui/commit/3c71db4e8d24bc098acd0a193e91d76afca76a2d))


### Bug Fixes

* pull matched loans from FLSS ([bd06154](https://github.com/kiva/ui/commit/bd061545cbf3ff376e196bad6e69f03ddf6f0791))

## [2.489.0](https://github.com/kiva/ui/compare/v2.488.0...v2.489.0) (2023-02-10)


### Features

* updated loan use for direct loans ([212e78a](https://github.com/kiva/ui/commit/212e78add17b73a36744c5746ca67c7aa696147b))


### Bug Fixes

* lower case first letter of use ([428f0c0](https://github.com/kiva/ui/commit/428f0c02e1b4602cd566a6d8b59cadc186bed7aa))

## [2.488.0](https://github.com/kiva/ui/compare/v2.487.0...v2.488.0) (2023-02-09)


### Features

* function to get loan callouts added to loanutils file ([1cba12c](https://github.com/kiva/ui/commit/1cba12cf9839b39ae77934470353a2618cd8d0ee))
* loan callouts on loan cards ([edaafb4](https://github.com/kiva/ui/commit/edaafb4069617b3e6e29baee4fa5f2d9a936882a))


### Bug Fixes

* lint errors ([c78f862](https://github.com/kiva/ui/commit/c78f86296702447faf0a406d27c8d22dbedc6109))
* loan callout ellipsis ([aee7ece](https://github.com/kiva/ui/commit/aee7eceff80f7e34839caa915b6baf95d39c676e))
* merge conflict ([f0190d9](https://github.com/kiva/ui/commit/f0190d97d1c479ae71e2f62cf2f4daa33c18ca11))
* pause ([bb58e59](https://github.com/kiva/ui/commit/bb58e59339986b8ff07681bab0a7277422be565f))
* pr updates ([6d21aaa](https://github.com/kiva/ui/commit/6d21aaa7b9fbb4eef00145734d82fc84473c35d1))
* remove unnecessary code ([b6194e2](https://github.com/kiva/ui/commit/b6194e26f3315d5a5b2787966c9278ba68e25674))
* unused class removed and prop passed to helpmechoosewrapper component ([c4f52d1](https://github.com/kiva/ui/commit/c4f52d1be1a3283a775fde3521125729d19622c4))

## [2.487.0](https://github.com/kiva/ui/compare/v2.486.0...v2.487.0) (2023-02-09)


### Features

* header lend menu button experiment ([27f3e6b](https://github.com/kiva/ui/commit/27f3e6bce3719b2cd805c28d7dc27609b7460fb0))


### Bug Fixes

* linting issues ([f85ff0e](https://github.com/kiva/ui/commit/f85ff0eb4ff7ce45d7c662044283949960096c1e))

## [2.486.0](https://github.com/kiva/ui/compare/v2.485.0...v2.486.0) (2023-02-09)


### Features

* modified bp share language for loans in pfp ([8682cf0](https://github.com/kiva/ui/commit/8682cf003c7ee9142a90ad2f3524d59054d1dad3))

## [2.485.0](https://github.com/kiva/ui/compare/v2.484.1...v2.485.0) (2023-02-09)


### Features

* ability to swap cards added to lending home sections ([dd04ee2](https://github.com/kiva/ui/commit/dd04ee29ce43072ed171b5ff66b5a6d7f8be6dc8))
* new loan card exp setup added to lending home page ([0a14696](https://github.com/kiva/ui/commit/0a14696b2e308ff73edb67a5349f5497ed7bb9db))


### Bug Fixes

* dynamic prop added to spotlight component ([de7b51f](https://github.com/kiva/ui/commit/de7b51fedc3d1a23783effc6b470e9eb83573b8d))

### [2.484.1](https://github.com/kiva/ui/compare/v2.484.0...v2.484.1) (2023-02-07)


### Bug Fixes

* add strict cache-control headers to private pages ([babd638](https://github.com/kiva/ui/commit/babd638701f893f07867f7a77e923813e90213d5))

## [2.484.0](https://github.com/kiva/ui/compare/v2.483.0...v2.484.0) (2023-02-07)


### Features

* new promo grid card added for new loan cards experiment ([9749863](https://github.com/kiva/ui/commit/974986340c7ec608a3a44884c4f9e73e04b78895))


### Bug Fixes

* scss code removed from new promo loan card ([024d9b9](https://github.com/kiva/ui/commit/024d9b9f0e6e52d9e0ee57e2c8e53c4301b4fde9))

## [2.483.0](https://github.com/kiva/ui/compare/v2.482.0...v2.483.0) (2023-02-07)


### Features

* use permanent 301 for redirects defined in routes.js MARS-335 ([8e7751b](https://github.com/kiva/ui/commit/8e7751bdecf088491328951804b6247b87c01418))


### Bug Fixes

* redirect old categories to current pages MARS-335 ([c1af106](https://github.com/kiva/ui/commit/c1af10664c23f6624f42e609612b69b838e938d0))
* remove duplicate route listing ([0ebd917](https://github.com/kiva/ui/commit/0ebd9178cdbc4dd07ebd3ea4be6f9a84549b3408))

## [2.482.0](https://github.com/kiva/ui/compare/v2.481.0...v2.482.0) (2023-02-07)


### Features

* add cache control headers to passport redirects ([5f506bc](https://github.com/kiva/ui/commit/5f506bcc60e3a0580555627ecd78816d6ead01f1))


### Bug Fixes

* add header to remaining routes ([55a8199](https://github.com/kiva/ui/commit/55a81991825a87982609a8163830f1efc942986a))

## [2.481.0](https://github.com/kiva/ui/compare/v2.480.1...v2.481.0) (2023-02-07)


### Features

* displaying kiva classic versions of kvradio, kvchip, etc ([9fabb39](https://github.com/kiva/ui/commit/9fabb39d1ee0cef7d7b67ce1c5a8f681922ff01a))
* migrating campaign loan filters onto Kiva Classic ([639a497](https://github.com/kiva/ui/commit/639a497eba108e777cf420b766bc9ce373ccc423))


### Bug Fixes

* alignment, padding, and display fixes ([a30815a](https://github.com/kiva/ui/commit/a30815ac0572b5a6043f49bf873363833f1f714e))
* changed filter alignment, fixed gender filters issue, and addressed CIT-100 ([6cbb325](https://github.com/kiva/ui/commit/6cbb3252eaae3b237f65af0bb667b7c62b284ce1))
* fixing issue with both gender selection ([f3fa36a](https://github.com/kiva/ui/commit/f3fa36a43fc91bca5b6a255a32c6a9da286046b9))
* linting ([36993f7](https://github.com/kiva/ui/commit/36993f7a5a341c848b84252c2d2ba3199a19d193))
* linting errors ([00699d5](https://github.com/kiva/ui/commit/00699d5e3dc24752f588c727d696c424aac156b9))
* now displaying SVG icons and gender/sortBy options ([ce124a9](https://github.com/kiva/ui/commit/ce124a9aa990a7b91878f862fcc1f9d21ec7338d))
* view layout toggling, gender and sortBy radios, other changes ([25701c3](https://github.com/kiva/ui/commit/25701c3bc6f404c40edaaef7208ea60e483a25bc))

### [2.480.1](https://github.com/kiva/ui/compare/v2.480.0...v2.480.1) (2023-02-07)


### Bug Fixes

* updated new orange ([9afb4d3](https://github.com/kiva/ui/commit/9afb4d3ce0cebb85a4abc1643e755cff5041786f))

## [2.480.0](https://github.com/kiva/ui/compare/v2.479.3...v2.480.0) (2023-02-07)


### Features

* experiment initialization for lend menu buttons ([dd32268](https://github.com/kiva/ui/commit/dd32268f1554e08b9f2ebd0c4fe117a03247e53d))


### Bug Fixes

* errors when card loading due to null loan data ([3f9753b](https://github.com/kiva/ui/commit/3f9753b0b29b4e7252ec4378a292efec5d086983))

### [2.479.3](https://github.com/kiva/ui/compare/v2.479.2...v2.479.3) (2023-02-06)


### Bug Fixes

* location QF wasn't working after first selection ([4c58769](https://github.com/kiva/ui/commit/4c58769315944357bd59f4d429bc82f9e2dfa87c))

### [2.479.2](https://github.com/kiva/ui/compare/v2.479.1...v2.479.2) (2023-02-06)


### Bug Fixes

* only log lending-home exp for logged-in users ([b6913f6](https://github.com/kiva/ui/commit/b6913f67b2acdecc2965f1fcf0f233369948898d))

### [2.479.1](https://github.com/kiva/ui/compare/v2.479.0...v2.479.1) (2023-02-03)


### Bug Fixes

* put recommended at the bottom of the sort options ([3c5bd08](https://github.com/kiva/ui/commit/3c5bd0841fcb679975696b1a1dd58d0adc854a07))

## [2.479.0](https://github.com/kiva/ui/compare/v2.478.1...v2.479.0) (2023-02-03)


### Features

* new cta component added for new loan card ([de2d255](https://github.com/kiva/ui/commit/de2d255ea7479e13b4037acdf77d1d06497e6b03))
* new lend cta component updated to work with parent data via props ([b15a663](https://github.com/kiva/ui/commit/b15a663455a5ed5e6fda5dbe06149f26370b4d20))


### Bug Fixes

* stories for new lend cta component updated ([651cb83](https://github.com/kiva/ui/commit/651cb8336145050295f20f1d3fb1f72bdd1ada65))
* story for lendctaexp component cleaned ([663a7f3](https://github.com/kiva/ui/commit/663a7f3a8d8f9fe12471d4460b42fa49e45f3557))
* unused mixins removed from lendctaexp component ([4bca3b9](https://github.com/kiva/ui/commit/4bca3b99cc0417390aeba8e68b6df51c67ad11e5))

### [2.478.1](https://github.com/kiva/ui/compare/v2.478.0...v2.478.1) (2023-02-03)


### Bug Fixes

* pass by reference issue for quick filters ([ff961b9](https://github.com/kiva/ui/commit/ff961b9fe59eef5ed580499fd7ea5fda7ba66ee5))

## [2.478.0](https://github.com/kiva/ui/compare/v2.477.0...v2.478.0) (2023-02-02)


### Features

* updated help me choose behavior ([ee9de60](https://github.com/kiva/ui/commit/ee9de60cd71ec10e1ceb668e8c590f476283a911))


### Bug Fixes

* default null sort is more appropriate ([9943d9f](https://github.com/kiva/ui/commit/9943d9f6ed38fe6a47c4effab2ab19046f985046))

## [2.477.0](https://github.com/kiva/ui/compare/v2.476.1...v2.477.0) (2023-02-02)


### Features

* helpme choose test code removed ([f8d6d20](https://github.com/kiva/ui/commit/f8d6d20dbe0261829ac7013e04d9068f91db37cf))

### [2.476.1](https://github.com/kiva/ui/compare/v2.476.0...v2.476.1) (2023-02-02)


### Bug Fixes

* hpa deprecation warning ([b9809f7](https://github.com/kiva/ui/commit/b9809f7dbc603c3213f18c069764f3a11c477c20))

## [2.476.0](https://github.com/kiva/ui/compare/v2.475.0...v2.476.0) (2023-02-02)


### Features

* add new loan tags to new loan cards ([98dac08](https://github.com/kiva/ui/commit/98dac08003ebc9b239ece913bdc8a5a0c3311dd9))


### Bug Fixes

* add clamping ([df623d4](https://github.com/kiva/ui/commit/df623d4377bf9aceeb7c21eecbda8afa9012603a))
* lint ([5df8572](https://github.com/kiva/ui/commit/5df85723cdbabd9712db1bd833145da6c48c9565))

## [2.475.0](https://github.com/kiva/ui/compare/v2.474.1...v2.475.0) (2023-02-02)


### Features

* use new loan card in help me choose during experiment ([b2c99fa](https://github.com/kiva/ui/commit/b2c99fa7afb699e5bc2d0d953f705f183c3170ba))

### [2.474.1](https://github.com/kiva/ui/compare/v2.474.0...v2.474.1) (2023-02-01)


### Bug Fixes

* tracking was missing on new page ([5915eec](https://github.com/kiva/ui/commit/5915eec8a0a16d56f99dc18dffb7e486561210ce))

## [2.474.0](https://github.com/kiva/ui/compare/v2.473.0...v2.474.0) (2023-02-01)


### Features

* update progress text when amount left is low ([7dc78fc](https://github.com/kiva/ui/commit/7dc78fcda9e285b1a4597306a268a9a4875122f5))

## [2.473.0](https://github.com/kiva/ui/compare/v2.472.1...v2.473.0) (2023-01-31)


### Features

* added support for larger loan card images when 2 cards in row ([b2f4dee](https://github.com/kiva/ui/commit/b2f4deee0381c5b09565c573af5e3baae9affb36))
* story for larger loan card image ([ddbba7f](https://github.com/kiva/ui/commit/ddbba7f733d460354133ade2d9624be70676d5ed))
* update lending-home to use new loan card throughout ([db174a0](https://github.com/kiva/ui/commit/db174a01281a352ad7820cd190d0359e44594131))


### Bug Fixes

* use a size we already provide from cloudinary ([ee402d5](https://github.com/kiva/ui/commit/ee402d5f7b9a3989bf7c98a0d4fd96a25e3eb565))
* use kv-carousel instead of classic carousel ([07390f9](https://github.com/kiva/ui/commit/07390f930184ee590b945be61ed6db53185a31b1))
* width is actually larger now that padding is removed ([131ad71](https://github.com/kiva/ui/commit/131ad7178d3b0b71bb2d0c4505f38645318e0059))

### [2.472.1](https://github.com/kiva/ui/compare/v2.472.0...v2.472.1) (2023-01-31)


### Bug Fixes

* remove track func ([d2fc91c](https://github.com/kiva/ui/commit/d2fc91cc9d39300b49ab161a9adf79ae43deb90a))
* revalidate partnerIds and add risk prop to flss ([451ac60](https://github.com/kiva/ui/commit/451ac60bee39bdb110ff173670b0a69225075bbd))

## [2.472.0](https://github.com/kiva/ui/compare/v2.471.0...v2.472.0) (2023-01-30)


### Features

* updated loan card use statement ([090c0b9](https://github.com/kiva/ui/commit/090c0b928289e0d5fc7d1edcba2130fb1baf83cd))

## [2.471.0](https://github.com/kiva/ui/compare/v2.470.0...v2.471.0) (2023-01-30)


### Features

* pagination reset added in category page ([8a752ba](https://github.com/kiva/ui/commit/8a752ba363e708efe9ebfea49fbe399bbabd9d64))


### Bug Fixes

* method changed when resetting pagination in category page ([97c4cf6](https://github.com/kiva/ui/commit/97c4cf64c39f0374957a26bc33d16379e03b961f))
* ref removed for pagination in category page ([4563bec](https://github.com/kiva/ui/commit/4563becb12691ac9cf6ebe630785d4ac540ad0a0))
* scroll to top removed in category page paginator ([c7f16d2](https://github.com/kiva/ui/commit/c7f16d24ce3de6c1831314659039aff48d22501c))

## [2.470.0](https://github.com/kiva/ui/compare/v2.469.1...v2.470.0) (2023-01-30)


### Features

* initial setup of new rounded loan card ([4943ed5](https://github.com/kiva/ui/commit/4943ed58583ca8f9092e41f8df66a3df40f860e5))
* use kiva classic loan card as base ([e0a57c2](https://github.com/kiva/ui/commit/e0a57c24a96c23f9367c25719f56617d0477cb46))


### Bug Fixes

* filled out new loan card stories and fixed some general issues with the component ([f4c1689](https://github.com/kiva/ui/commit/f4c1689d3e174e9e2872f504f5e20ca9b11e6ac3))
* focus was needed ([2e87be7](https://github.com/kiva/ui/commit/2e87be7687088efd4411443f187d79b9a13b716a))
* getTagInfo no longer exists ([69ded98](https://github.com/kiva/ui/commit/69ded987dce1a73849ccb19c813b7646dbd59455))
* move CSS following linting ([c4768be](https://github.com/kiva/ui/commit/c4768be624c926452992ef12f77ef6d900b7167d))
* remove comment following linting ([3c38911](https://github.com/kiva/ui/commit/3c389111b1c0ddc374dfa686292c66237772b00b))
* removed unneeded prop from story ([e1a6fcb](https://github.com/kiva/ui/commit/e1a6fcbc8d8265f23b61d5bb8f5aa79a29eff445))
* removed unused components ([23d8f4f](https://github.com/kiva/ui/commit/23d8f4f446558535fa887e4eb48a66119d4d9fda))
* resolve CSS order issue from linting ([f0be296](https://github.com/kiva/ui/commit/f0be2961031fcc8ac39e34e901640919f2380f89))
* use kiva classic loan card as baseline ([1ecf200](https://github.com/kiva/ui/commit/1ecf200c54822acf07ef65a4bb9940b2dabbc6d7))

### [2.469.1](https://github.com/kiva/ui/compare/v2.469.0...v2.469.1) (2023-01-27)


### Bug Fixes

* use optional chaining in isContentfulQuery ([d75ca2c](https://github.com/kiva/ui/commit/d75ca2c2e139b3c443a5fa9763257fefe09273dd))

## [2.469.0](https://github.com/kiva/ui/compare/v2.468.0...v2.469.0) (2023-01-26)


### Features

* hide help me choose feat when loans are fewer than 9 in category page ([9d049dd](https://github.com/kiva/ui/commit/9d049ddb1ecd5884a1469b95ee73fd5efb716414))


### Bug Fixes

* computed prop updated avoiding extra code ([7494b64](https://github.com/kiva/ui/commit/7494b64268c8b314509b6c25a11c3adcd56d8b9d))

## [2.468.0](https://github.com/kiva/ui/compare/v2.467.0...v2.468.0) (2023-01-25)


### Features

* rolling out help me choose feat to all category pages ([fb07c75](https://github.com/kiva/ui/commit/fb07c7576b0f848270ef1f2daf7f00a0edb0cd70))


### Bug Fixes

* unused computed prop removed in category page ([51b8661](https://github.com/kiva/ui/commit/51b8661ada51447b560f0be5ab865434968101e1))

## [2.467.0](https://github.com/kiva/ui/compare/v2.466.3...v2.467.0) (2023-01-25)


### Features

* hide reset on quick filters when no filters applied ([4d7308b](https://github.com/kiva/ui/commit/4d7308b99e5a2ff9c0ba590961475d636be29bf5))

### [2.466.3](https://github.com/kiva/ui/compare/v2.466.2...v2.466.3) (2023-01-25)


### Bug Fixes

* padding fix for quick filters feat in category page ([2c9d130](https://github.com/kiva/ui/commit/2c9d130a1b4f95f60f608c25363587589d5176f3))

### [2.466.2](https://github.com/kiva/ui/compare/v2.466.1...v2.466.2) (2023-01-24)


### Bug Fixes

* add margin to loan finding page lightbox mobile ([053c7f6](https://github.com/kiva/ui/commit/053c7f6c06083dc07f9ee3d8f28f99fa56ce6071))

### [2.466.1](https://github.com/kiva/ui/compare/v2.466.0...v2.466.1) (2023-01-24)


### Bug Fixes

* styling of share update button and updaate info on mobile ([e258fda](https://github.com/kiva/ui/commit/e258fda5a6e808627247ecbce4b0f6553cb83949))

## [2.466.0](https://github.com/kiva/ui/compare/v2.465.0...v2.466.0) (2023-01-24)


### Features

* change copy link to copy message and link in share for bp ([8ae5271](https://github.com/kiva/ui/commit/8ae5271f374a67d546febde6575c6cf86e4173d1))

## [2.465.0](https://github.com/kiva/ui/compare/v2.464.0...v2.465.0) (2023-01-24)


### Features

* add unit test for null value in loan resolver ([754180f](https://github.com/kiva/ui/commit/754180f3580b9c8d9afa7c2cb3282909173c756c))
* personalized sharing modal ([79f95a9](https://github.com/kiva/ui/commit/79f95a95250c127b64d08622449b76d60bc21ec8))

## [2.464.0](https://github.com/kiva/ui/compare/v2.463.0...v2.464.0) (2023-01-23)


### Features

* loan finding page lightbox ([79e1114](https://github.com/kiva/ui/commit/79e1114922296d18024195ce99ee66ffc703363a))

## [2.463.0](https://github.com/kiva/ui/compare/v2.462.1...v2.463.0) (2023-01-23)


### Features

* spotlight hero updated for medium screens ([9e9bb8d](https://github.com/kiva/ui/commit/9e9bb8d36f6594cb4f43786d5ed4cb3199c15083))

### [2.462.1](https://github.com/kiva/ui/compare/v2.462.0...v2.462.1) (2023-01-23)


### Bug Fixes

* use revenue tag for custom optimizely events MARS-330 ([beeeb1d](https://github.com/kiva/ui/commit/beeeb1dad82a34e325b91999d99f52770b95a65d))

## [2.462.0](https://github.com/kiva/ui/compare/v2.461.0...v2.462.0) (2023-01-23)


### Features

* remove Full Story MARS-305 ([dc6b75b](https://github.com/kiva/ui/commit/dc6b75ba16fcab7b2eddb7ce284ae3f8182ee44b))

## [2.461.0](https://github.com/kiva/ui/compare/v2.460.0...v2.461.0) (2023-01-23)


### Features

* experiment setup added to category page to show a new loan card ([eedb4a4](https://github.com/kiva/ui/commit/eedb4a4f8c3d9edf55a862a8ac042e2041698aa5))

## [2.460.0](https://github.com/kiva/ui/compare/v2.459.0...v2.460.0) (2023-01-21)


### Features

* tracking events added for lending home toast component ([e596525](https://github.com/kiva/ui/commit/e596525085594cc4c9362b9354a58d3bc06c3701))
* welcome toast added to lending home page ([8ffac83](https://github.com/kiva/ui/commit/8ffac83ccf37876dfac87d2bef60f0d84cc76df7))


### Bug Fixes

* bug fixed in toast close method ([129ab9a](https://github.com/kiva/ui/commit/129ab9acebe08b22956d465759b54c5f49d3df26))

## [2.459.0](https://github.com/kiva/ui/compare/v2.458.3...v2.459.0) (2023-01-20)


### Features

* modify sharing events ([46f29f6](https://github.com/kiva/ui/commit/46f29f6856c5d22c59c191ca466fb99ddea83d54))

### [2.458.3](https://github.com/kiva/ui/compare/v2.458.2...v2.458.3) (2023-01-19)


### Bug Fixes

* removed unused test ID ([30b7f90](https://github.com/kiva/ui/commit/30b7f9045b489febd634b8b8b219f334d95c9d8d))
* resolved issues with default sorts ([b9cf456](https://github.com/kiva/ui/commit/b9cf4569d106fef51a865dfd0e3b7f5a5a1de9e2))

### [2.458.2](https://github.com/kiva/ui/compare/v2.458.1...v2.458.2) (2023-01-19)


### Bug Fixes

* css only ([de2750c](https://github.com/kiva/ui/commit/de2750c1cb41db6589ec7a5125d5b98c51262618))
* mobile ui updates for quick filters ([3758f5c](https://github.com/kiva/ui/commit/3758f5cdc94717b67ca3178175909cf064c7da97))
* remove unused code ([3f6bff6](https://github.com/kiva/ui/commit/3f6bff64d8aab7c56fe7518b5ed354e9274b0b32))

### [2.458.1](https://github.com/kiva/ui/compare/v2.458.0...v2.458.1) (2023-01-19)


### Bug Fixes

* loan cards now always use full width ([657808a](https://github.com/kiva/ui/commit/657808a059c8d7c4f023d3e01d00d7ebdff540f3))
* location selector now only freezes scroll for sm view and md view uses large version ([627fe05](https://github.com/kiva/ui/commit/627fe0521210d90c0cb4a659bb3ba2671e7f6880))
* resolved mobile view extra horizontal scroll ([792448b](https://github.com/kiva/ui/commit/792448b07417462a0e4763cb88c83af1f7be710e))
* update primitives import path to match other usages ([13e3416](https://github.com/kiva/ui/commit/13e34167326aa5f28ddd6b5a67c48a5fc4e3d77b))
* use actual breakpoint ([f30613f](https://github.com/kiva/ui/commit/f30613f4fc508173c75fd1d445c929001f63e687))

## [2.458.0](https://github.com/kiva/ui/compare/v2.457.0...v2.458.0) (2023-01-19)


### Features

* add loan cards to lending-home ([ff33308](https://github.com/kiva/ui/commit/ff3330807b7472c05335caa7380bde1957f65f0c))
* change kiva classic loan card matching text to red ([8d0cad6](https://github.com/kiva/ui/commit/8d0cad6e75a8f396bbcd950deead429936902d75))
* new grid loan card story ([60c8341](https://github.com/kiva/ui/commit/60c8341e7e2f17e4a9d93827ac14831e4fa50982))


### Bug Fixes

* matching color reverted ([004ae4c](https://github.com/kiva/ui/commit/004ae4c154be269c2471a23e467e4c4403c1c2c9))

## [2.457.0](https://github.com/kiva/ui/compare/v2.456.1...v2.457.0) (2023-01-18)


### Features

* navigation updated in partner spotlight carousel ([b59ef70](https://github.com/kiva/ui/commit/b59ef70a7df490cdf0e58cb214e40212bf2af25e))

### [2.456.1](https://github.com/kiva/ui/compare/v2.456.0...v2.456.1) (2023-01-18)


### Bug Fixes

* journal updates in bp should use correctly sized image ([c1cf412](https://github.com/kiva/ui/commit/c1cf4123364b723809824ccb3edfe8f3956cef48))

## [2.456.0](https://github.com/kiva/ui/compare/v2.455.0...v2.456.0) (2023-01-18)


### Features

* background updated for every section in lending home page ([328fdf9](https://github.com/kiva/ui/commit/328fdf9dce57eb3bc23eaf3e1b92c49f7a358a48))


### Bug Fixes

* main class added to the loanfinding page wrapper ([5e57139](https://github.com/kiva/ui/commit/5e571399175566cde0e3d3fddba7f5fa3201e64b))
* main class prop added to www page compoent in lending home ([cf38ba0](https://github.com/kiva/ui/commit/cf38ba09182dd572ae76fba43f0a5502081e6d6e))
* redudant tw classes removed in loanfinding page ([260780d](https://github.com/kiva/ui/commit/260780de477d7316e8ac91ff7188490e25cfc993))

## [2.455.0](https://github.com/kiva/ui/compare/v2.454.1...v2.455.0) (2023-01-17)


### Features

* use legacy for matching in lending-home ([dc00a06](https://github.com/kiva/ui/commit/dc00a062ede46d0b0d35ec0392bd5fb2e2629555))

### [2.454.1](https://github.com/kiva/ui/compare/v2.454.0...v2.454.1) (2023-01-13)


### Bug Fixes

* updated order totals test ID ([c0a6870](https://github.com/kiva/ui/commit/c0a687014651dcf41ad714de23b7a6ae7e0c0537))

## [2.454.0](https://github.com/kiva/ui/compare/v2.453.0...v2.454.0) (2023-01-13)


### Features

* add ability to share updates on social media ([ecb63a2](https://github.com/kiva/ui/commit/ecb63a2d2966e79313c9bc71ab6fb3885befa307))

## [2.453.0](https://github.com/kiva/ui/compare/v2.452.1...v2.453.0) (2023-01-12)


### Features

* add read more functionality to journal entries in bp ([54d1a6a](https://github.com/kiva/ui/commit/54d1a6ab195e7fa953150ec7067767c75ea041c2))

### [2.452.1](https://github.com/kiva/ui/compare/v2.452.0...v2.452.1) (2023-01-12)


### Bug Fixes

* enable quick filters for all categories ([332f951](https://github.com/kiva/ui/commit/332f9518244c34de4c571678701e1a5d09e1ed98))
* improved category page initial load with quick filters ([2ce3d2d](https://github.com/kiva/ui/commit/2ce3d2dd411a749c5459ee7342c7f75b867b2807))

## [2.452.0](https://github.com/kiva/ui/compare/v2.451.0...v2.452.0) (2023-01-12)


### Features

* how it work section content in monthlygood page passed to contentful ([e3cd4c9](https://github.com/kiva/ui/commit/e3cd4c9d5d8f85a69e64bc552d04d982b37b471f))


### Bug Fixes

* preview flag and css syntax error removed ([f11dd2b](https://github.com/kiva/ui/commit/f11dd2b4591a8f0c769e3cc80cd4776209da9435))

## [2.451.0](https://github.com/kiva/ui/compare/v2.450.1...v2.451.0) (2023-01-11)


### Features

* add ability to link to updates section in bp ([b5828df](https://github.com/kiva/ui/commit/b5828dfb0bb0222e53945cb875c0a5518d475eb7))

### [2.450.1](https://github.com/kiva/ui/compare/v2.450.0...v2.450.1) (2023-01-11)


### Bug Fixes

* default loanId value ([7c0b445](https://github.com/kiva/ui/commit/7c0b44527829495efb8b1278edc37bca979d609f))
* loanId prop type ([7a46aa9](https://github.com/kiva/ui/commit/7a46aa93b56d7c8bf5f68d941ed0cae1a6e87539))

## [2.450.0](https://github.com/kiva/ui/compare/v2.449.2...v2.450.0) (2023-01-10)


### Features

* journal updates on borrower profile ([ab68047](https://github.com/kiva/ui/commit/ab680477cf8ca5f909dafadd84eab768c5e84a0e))

### [2.449.2](https://github.com/kiva/ui/compare/v2.449.1...v2.449.2) (2023-01-10)


### Bug Fixes

* add odd values to safelisted padding classes ([646e637](https://github.com/kiva/ui/commit/646e6379c25c92c8f2922666a24006e9748df9ee))
* remove 5 and 7 padding values from safelist ([87239b9](https://github.com/kiva/ui/commit/87239b9b16971a627a8902d1a3451f6e0d2f6827))

### [2.449.1](https://github.com/kiva/ui/compare/v2.449.0...v2.449.1) (2023-01-09)


### Bug Fixes

* updated google play icon badge to 2022 version (ui repo) [VUE-1370] ([b875ac7](https://github.com/kiva/ui/commit/b875ac7feaeffdd9289e92a847a11a979e436b0c))
* updated google play icon badge to 2022 version (ui repo) [VUE-1370] ([c250a80](https://github.com/kiva/ui/commit/c250a80368a7c9cd1b471aa8d3733f6818c7899d))
* updated google play icon badge to 2022 version (VUE-1370) ([8ca1bfb](https://github.com/kiva/ui/commit/8ca1bfb5950abe7d7eab4c9477bf03956d1ba0c3))

## [2.449.0](https://github.com/kiva/ui/compare/v2.448.0...v2.449.0) (2023-01-09)


### Features

* new tag removed from quick filters component ([7e168d4](https://github.com/kiva/ui/commit/7e168d4d7082fc85b29ccab52e98b028374de40b))


### Bug Fixes

* svg removed ([5f14841](https://github.com/kiva/ui/commit/5f14841d99bd9fa46aebda8d2cdc503b5e7caf42))

## [2.448.0](https://github.com/kiva/ui/compare/v2.447.2...v2.448.0) (2023-01-09)


### Features

* test code for quick filters removed ([a109f66](https://github.com/kiva/ui/commit/a109f661a12b2b9ed09fb87906237106eb33a4cc))

### [2.447.2](https://github.com/kiva/ui/compare/v2.447.1...v2.447.2) (2023-01-09)


### Bug Fixes

* better thanks page test ID ([81a18b8](https://github.com/kiva/ui/commit/81a18b833e3c5e45603704dc8d670b9f624be91d))
* filter faq content ([a13aeb7](https://github.com/kiva/ui/commit/a13aeb7087c1c12f6019a0ee94c74e470336c908))

### [2.447.1](https://github.com/kiva/ui/compare/v2.447.0...v2.447.1) (2023-01-09)


### Bug Fixes

* fix issue with logo alignment in cc pages ([f101c82](https://github.com/kiva/ui/commit/f101c82cb213e6dfca229b69c375c041a5669c6f))

## [2.447.0](https://github.com/kiva/ui/compare/v2.446.1...v2.447.0) (2023-01-06)


### Features

* removed "onetime" prop from monthly good ([e0a5ca1](https://github.com/kiva/ui/commit/e0a5ca1cfe1f2ef421612b32367ba54a789c8057))


### Bug Fixes

* better approach to prefetch redirect ([7f900ca](https://github.com/kiva/ui/commit/7f900ca3c79152da31416a4018361b35be3faa0c))
* removed deprecated /covid19response page ([4ae5a6f](https://github.com/kiva/ui/commit/4ae5a6feb164c619a51f6de1c2f6d8efaf7f38f6))

### [2.446.1](https://github.com/kiva/ui/compare/v2.446.0...v2.446.1) (2023-01-06)


### Bug Fixes

* create shared constant for allowed loan statues ([fb86839](https://github.com/kiva/ui/commit/fb8683956b66d7ddaaacf051656d91aef9e86ebb))
* redirect to lend-classic for unhandled loan statuses, allow raised status ([78da3e6](https://github.com/kiva/ui/commit/78da3e6fdf740d25eb3557dedc796510d8db2240))

## [2.446.0](https://github.com/kiva/ui/compare/v2.445.0...v2.446.0) (2023-01-06)


### Features

* deposit matched loans test removed from bp and checkout pages ([844c98c](https://github.com/kiva/ui/commit/844c98c99c7004c16ea12d416beebdf7c7c4de8a))


### Bug Fixes

* computed property removed in checkout page and unused files removed ([459aaf8](https://github.com/kiva/ui/commit/459aaf8e734b8eaf4f41134e03094982e48b3d5d))

## [2.445.0](https://github.com/kiva/ui/compare/v2.444.3...v2.445.0) (2023-01-06)


### Features

* add support for inactive loan status on bp ([3cd8781](https://github.com/kiva/ui/commit/3cd878196f607aabf1a25cbc5660be8c6e1fd4c8))

### [2.444.3](https://github.com/kiva/ui/compare/v2.444.2...v2.444.3) (2023-01-06)


### Bug Fixes

* remove question mark in copy ([d712a4c](https://github.com/kiva/ui/commit/d712a4cf53fcb02a7d733b5821d3289e638f034f))

### [2.444.2](https://github.com/kiva/ui/compare/v2.444.1...v2.444.2) (2023-01-05)


### Bug Fixes

* add  | Kiva suffix to meta title test ([25f1568](https://github.com/kiva/ui/commit/25f15685b40940070d43e6e1747d24668acc2df4))

### [2.444.1](https://github.com/kiva/ui/compare/v2.444.0...v2.444.1) (2023-01-05)


### Bug Fixes

* update cypress meta tests to use new lbc and category title format ([4ed1f75](https://github.com/kiva/ui/commit/4ed1f75c6c1e93d54d83a3bc929fcbe82b95544d))

## [2.444.0](https://github.com/kiva/ui/compare/v2.443.2...v2.444.0) (2023-01-05)


### Features

* upsell copy test code removed ([d00ca9c](https://github.com/kiva/ui/commit/d00ca9ca3a5d831e5f8b42cb16e93ead4fa5fcfc))

### [2.443.2](https://github.com/kiva/ui/compare/v2.443.1...v2.443.2) (2023-01-05)


### Bug Fixes

* add cmt ([2766bca](https://github.com/kiva/ui/commit/2766bcaddd3bdd7d7663c93a2d9032a30db35c2b))
* add new prop for loan cards ([716b99d](https://github.com/kiva/ui/commit/716b99d701fe016610ca4e65bf1c757cf0494f07))
* change progress bar component back and add styling ([888cfab](https://github.com/kiva/ui/commit/888cfab58da9cd84ba386b2e0f29a310329a062e))
* oops lol ([595f563](https://github.com/kiva/ui/commit/595f563561b9cd910e999feacc959e595378e0e8))
* qa fixes for quick filters on mvp landing page ([f0d1e44](https://github.com/kiva/ui/commit/f0d1e44d285cf4add45526720d3e6bc4dfeedef6))
* update edge cases for mission driven orgs and covid 19 ([aa932af](https://github.com/kiva/ui/commit/aa932afc128c41b48ce2da20b46e68c843776935))

### [2.443.1](https://github.com/kiva/ui/compare/v2.443.0...v2.443.1) (2023-01-04)


### Bug Fixes

* eslint ([0736567](https://github.com/kiva/ui/commit/0736567f8918ff810b6772a519463c735f4066bf))
* remove exp file ([cdcffdb](https://github.com/kiva/ui/commit/cdcffdb967f477a9acf403b8e7d0e23a96bbe350))

## [2.443.0](https://github.com/kiva/ui/compare/v2.442.2...v2.443.0) (2023-01-04)


### Features

* loading state added to upsell feat ([2a63988](https://github.com/kiva/ui/commit/2a63988b83d49665b21a57609f80bd8dd8ee95b5))

### [2.442.2](https://github.com/kiva/ui/compare/v2.442.1...v2.442.2) (2023-01-04)


### Bug Fixes

* support for expired loan statuses MARS-325 ([cf19a3d](https://github.com/kiva/ui/commit/cf19a3d0cf49b2889659ef7a06d95ac8880ee60f))

### [2.442.1](https://github.com/kiva/ui/compare/v2.442.0...v2.442.1) (2023-01-04)


### Bug Fixes

* add lend route to exclusion array ([bf340df](https://github.com/kiva/ui/commit/bf340df2ddd44841f12a882a6ecc197402af1aef))

## [2.442.0](https://github.com/kiva/ui/compare/v2.441.2...v2.442.0) (2023-01-04)


### Features

* test code for dynamic upsells removed ([a4213d1](https://github.com/kiva/ui/commit/a4213d1a1ea4220619c19cd653729a71c5ed5097))


### Bug Fixes

* dynamic upsell gql removed from repo ([fc8bb25](https://github.com/kiva/ui/commit/fc8bb25cadb28dbb826085c7edfb5156affe1dc7))

### [2.441.2](https://github.com/kiva/ui/compare/v2.441.1...v2.441.2) (2023-01-04)


### Bug Fixes

* assigment of ACK-440 exp was not working correctly ([6299cc8](https://github.com/kiva/ui/commit/6299cc825a143ccca90a71d7452cf1a1edfa39d5))

### [2.441.1](https://github.com/kiva/ui/compare/v2.441.0...v2.441.1) (2023-01-03)


### Bug Fixes

* paragraph spacing in expandable questions ([e63aa84](https://github.com/kiva/ui/commit/e63aa84e6a640b731865415f99c834edea4f5042))

## [2.441.0](https://github.com/kiva/ui/compare/v2.440.1...v2.441.0) (2023-01-03)


### Features

* new copy and share links for funded loans ([5af8d25](https://github.com/kiva/ui/commit/5af8d25256ea881162915db6973c8b8675e89b14))
* remove exp setup ([2204c6c](https://github.com/kiva/ui/commit/2204c6cbd572f5f19beb1021a72882a46f61a62d))


### Bug Fixes

* eslint ([61d8fa6](https://github.com/kiva/ui/commit/61d8fa6b745b1859f01622379344e2640a040404))
* solve conflicts ([0a90e8b](https://github.com/kiva/ui/commit/0a90e8b7c439b1062a4d5eba084a81e382cbbe26))
* solve conflicts ([f1cdefb](https://github.com/kiva/ui/commit/f1cdefb8625459d0bb67f17893ea859e07957f78))

### [2.440.1](https://github.com/kiva/ui/compare/v2.440.0...v2.440.1) (2022-12-22)


### Bug Fixes

* shorten year review share title for twitter requirements ([aad59c9](https://github.com/kiva/ui/commit/aad59c9bbeb7513f3e488854708fe94976e86424))

## [2.440.0](https://github.com/kiva/ui/compare/v2.439.0...v2.440.0) (2022-12-21)


### Features

* add title ([2a68c55](https://github.com/kiva/ui/commit/2a68c55f613d0b651bd375b429fffb7e8195e86b))

## [2.439.0](https://github.com/kiva/ui/compare/v2.438.0...v2.439.0) (2022-12-21)


### Features

* add jsdoc ([3836455](https://github.com/kiva/ui/commit/3836455eb380ae311b066c88474340e26308c341))
* update lbc title tags ([28ccd11](https://github.com/kiva/ui/commit/28ccd11c9d563ef166c4867d21ac2b3244d4e71a))


### Bug Fixes

* solve conflicts ([1e614de](https://github.com/kiva/ui/commit/1e614de76554f5be854391b1c72d2a60cb9e3623))
* validate lender in param ([9c65df7](https://github.com/kiva/ui/commit/9c65df72dbe2bf39c89714333a38a338b23fb25d))

## [2.438.0](https://github.com/kiva/ui/compare/v2.437.0...v2.438.0) (2022-12-21)


### Features

* icon added to location dropdown for quick filters ([6b73a91](https://github.com/kiva/ui/commit/6b73a91acfcb0e5244b5f8198547db1502dd0899))

## [2.437.0](https://github.com/kiva/ui/compare/v2.436.1...v2.437.0) (2022-12-21)


### Features

* tracking for mvp quick filters ([1e6af3e](https://github.com/kiva/ui/commit/1e6af3ef8532192884271edf327ae362128dd3bc))


### Bug Fixes

* pr comments ([95891a0](https://github.com/kiva/ui/commit/95891a0c4a952d18b73849b008c633e0d56eb97d))

### [2.436.1](https://github.com/kiva/ui/compare/v2.436.0...v2.436.1) (2022-12-20)


### Bug Fixes

* prefetch experiment data and use public lender name in share copy MARS-310 ([d5ee343](https://github.com/kiva/ui/commit/d5ee343679cdb7c596c663f7c317d8140f785f9c))

## [2.436.0](https://github.com/kiva/ui/compare/v2.435.0...v2.436.0) (2022-12-20)


### Features

* add refugees route ([f8c4730](https://github.com/kiva/ui/commit/f8c47306b5298cbf59351151a48aed7fc8a748e4))


### Bug Fixes

* redirect lp refugees page ([f91cf0d](https://github.com/kiva/ui/commit/f91cf0d58a253ebf05ae1043eb64bd4372be5bed))
* update lighthouse ([9665bfa](https://github.com/kiva/ui/commit/9665bfa63171765b79f11b4f07c598fced8478db))

## [2.435.0](https://github.com/kiva/ui/compare/v2.434.0...v2.435.0) (2022-12-20)


### Features

* tracking event added when no loans find for partner spotlight ([3030b6b](https://github.com/kiva/ui/commit/3030b6bfb57f78f29249789d30c2d4d46c9b6c5b))

## [2.434.0](https://github.com/kiva/ui/compare/v2.433.0...v2.434.0) (2022-12-19)


### Features

* logic for mvp quick filters ([0dd500c](https://github.com/kiva/ui/commit/0dd500c8539ae07362ef51a625ed9e90116ca294))


### Bug Fixes

* fix query string ([7f264d0](https://github.com/kiva/ui/commit/7f264d04cb81d94a4b44cecd551ecf607a972a1e))
* pr comment updates ([333011a](https://github.com/kiva/ui/commit/333011a2c71ce1cffd2b9c6d1471333ed14de4b8))
* update context ([82e2876](https://github.com/kiva/ui/commit/82e28765861149f546dc42b264c8d274460e02d9))

## [2.433.0](https://github.com/kiva/ui/compare/v2.432.0...v2.433.0) (2022-12-19)


### Features

* partner spotlight section added to lending page ([305994d](https://github.com/kiva/ui/commit/305994d8a890b2ce227c6283ddf83441277d6cdf))


### Bug Fixes

* url to view more partner loans updated to new stack ([58a16e2](https://github.com/kiva/ui/commit/58a16e2f5a698a8efe3d18e3eb79e2363614cade))

## [2.432.0](https://github.com/kiva/ui/compare/v2.431.1...v2.432.0) (2022-12-19)


### Features

* add unbounce script for generic pop up on certain routes ([973b233](https://github.com/kiva/ui/commit/973b23317fffd90a61cbca7b30b24ee5dd661731))

### [2.431.1](https://github.com/kiva/ui/compare/v2.431.0...v2.431.1) (2022-12-16)


### Bug Fixes

* preserve open space for checkout upsell to pop in ([955f5e6](https://github.com/kiva/ui/commit/955f5e66cae419bde2e920bdd2072f7cfffda0dc))

## [2.431.0](https://github.com/kiva/ui/compare/v2.430.2...v2.431.0) (2022-12-15)


### Features

* add general typepolicies fields ([ca297a6](https://github.com/kiva/ui/commit/ca297a677522f948972a5decb823ebeec85d5f34))
* add query argument to writeQuery ([387368d](https://github.com/kiva/ui/commit/387368d29be052a796169af1b4f0e40244131b5c))
* add remain type policies ([1795298](https://github.com/kiva/ui/commit/1795298126fc3a243a2a514fb3884197dcf4945b))
* add resolvers to typePolicies object ([25b788d](https://github.com/kiva/ui/commit/25b788d1ca17846b9395bc9e7cb935bf991f8be1))
* export typePolicies and set default state ([b3ee5d8](https://github.com/kiva/ui/commit/b3ee5d8b2ea4f6c7a77b1095d2687e8fbb335168))
* set local resolvers default value ([56b0490](https://github.com/kiva/ui/commit/56b04904e19e2039345826cf474bd3a9f4dd9959))
* set type policy for Setting ([aa2b73d](https://github.com/kiva/ui/commit/aa2b73d7fe99105006c5fed6ab8640113fd390db))
* update local resolvers typePolicies ([acb010f](https://github.com/kiva/ui/commit/acb010f39789e87df6e532eca7f09d61600991dc))
* work in progress ([d818958](https://github.com/kiva/ui/commit/d818958ae52062a1ef0e33d375f81be96903dd1b))
* work in progress migrate apollo to version 3 ([b43ca71](https://github.com/kiva/ui/commit/b43ca71211ccf91b643e86293ba805122bdbffe8))


### Bug Fixes

* add ID field to local GraphQL types and update methods for writing data to cache ([a5596fb](https://github.com/kiva/ui/commit/a5596fb748c061a30d3b3ce103b4d96e7df4cfbc))
* add missing id to autolending local resolver ([60e9e4b](https://github.com/kiva/ui/commit/60e9e4b3a6bb0d191f349d2806330159b33e4b8b))
* add missing typePolicies ([88e1ea9](https://github.com/kiva/ui/commit/88e1ea94751a1bf3612a1da1aabefe89cdbfdd9f))
* add some type polices ([ac3b283](https://github.com/kiva/ui/commit/ac3b2839785377c7bc31b378cb0deb4e587c632e))
* another missing id ([556a272](https://github.com/kiva/ui/commit/556a272c7c053cc558c03d814dcdc4bbad0f4a7e))
* bring back deleted experiment resolver tests and correct use of readJSONSetting ([70a2780](https://github.com/kiva/ui/commit/70a2780c5945d422bed2d1edbbb253afa511d1c9))
* call result function data is not null ([ff611f3](https://github.com/kiva/ui/commit/ff611f3e8eb6353ccb336b3212f876a22fb71ba9))
* change log error message ([13ae9d9](https://github.com/kiva/ui/commit/13ae9d94564d60acb1f8a0b42bc69c45b39f2b54))
* ensure local resolvers work ([accaa6e](https://github.com/kiva/ui/commit/accaa6e05b0817443850d5bc9dcdf84bbd38770b))
* eslint error ([6f7dc43](https://github.com/kiva/ui/commit/6f7dc43f6318d579443d56a96f6f04525db31ceb))
* experiment resolvers ([326cca9](https://github.com/kiva/ui/commit/326cca9b3e61b934048d7da0614da8552ed7df7b))
* more missing ids ([61483d4](https://github.com/kiva/ui/commit/61483d40c7fc37d3728d6796902c4720feb1b751))
* new gql import ([268543a](https://github.com/kiva/ui/commit/268543af265af02748c769203c46757cf1e042c2))
* remove unnecessary type policies and merge ones without ids ([48d767b](https://github.com/kiva/ui/commit/48d767b2b0ef6a44e3a369ac47bd893b4651bd9a))
* resolve conflicts ([63a7d6a](https://github.com/kiva/ui/commit/63a7d6ad4fe00ac8baf63487a47108aaaaed3d27))
* solve conflicts ([a4f6b06](https://github.com/kiva/ui/commit/a4f6b06af2f405adae0f4739ef16f0d43a22908a))
* solve conflicts ([9873cff](https://github.com/kiva/ui/commit/9873cff6ebc9cf8a46b97ddc7527356028d89aeb))
* update package-lock.json ([5297144](https://github.com/kiva/ui/commit/5297144299e356bc5a31983fd4f244b4e87a99ec))
* update some experiments and remove changed experiment tests with cookies ([8f4d8c7](https://github.com/kiva/ui/commit/8f4d8c73eaa82d2318cde6b39d3c88db0656bd98))
* use `merge:true` by default for GraphQL types without IDs ([d935795](https://github.com/kiva/ui/commit/d9357957bc22f74fcebb53674f94462bf33e0274))
* writeQuery args ([b0543db](https://github.com/kiva/ui/commit/b0543dbf0b0bf1014f5ae6d5511b63aadfc9eaa5))

### [2.430.2](https://github.com/kiva/ui/compare/v2.430.1...v2.430.2) (2022-12-15)


### Bug Fixes

* loanid computed property added to borrower profile ([91488df](https://github.com/kiva/ui/commit/91488dfebaf43b2520a7383814ed65519f567488))

### [2.430.1](https://github.com/kiva/ui/compare/v2.430.0...v2.430.1) (2022-12-15)


### Bug Fixes

* redirect visits from /lp/how-kiva-works to /about/how ([45e359c](https://github.com/kiva/ui/commit/45e359c14158c51ea9c0c97ac83490b47543af22))
* stop hitting lp/how-kiva-works from lighthouse ([31e377c](https://github.com/kiva/ui/commit/31e377ca30192e10c0ce8fae8d19b4e14ad8381c))

## [2.430.0](https://github.com/kiva/ui/compare/v2.429.1...v2.430.0) (2022-12-15)


### Features

* add loan ids to various social share events ([81d97e6](https://github.com/kiva/ui/commit/81d97e6e699a5d935456991b9763d2ef7fa00921))

### [2.429.1](https://github.com/kiva/ui/compare/v2.429.0...v2.429.1) (2022-12-15)


### Bug Fixes

* add thanks-message testid to simplify automated thanks page test ([2a14831](https://github.com/kiva/ui/commit/2a14831e2ccbfa9f06914a1ed3752d5efcede45d))

## [2.429.0](https://github.com/kiva/ui/compare/v2.428.0...v2.429.0) (2022-12-15)


### Features

* add new user attributes ([16a739d](https://github.com/kiva/ui/commit/16a739d1d674a9cfb6326aab009aef8366776f3f))


### Bug Fixes

* get loans total ([31b344a](https://github.com/kiva/ui/commit/31b344adb9edf09beb27564fb64c1590c8436d53))
* wrap condition ([a525fb2](https://github.com/kiva/ui/commit/a525fb2bb3c2bdcc541ca51764ce9877c9ba68e7))

## [2.428.0](https://github.com/kiva/ui/compare/v2.427.0...v2.428.0) (2022-12-15)


### Features

* use loan facets in e2e instead of loan data ([7f56f42](https://github.com/kiva/ui/commit/7f56f421c5eedc432994243bd6f544b0a89c5046))

## [2.427.0](https://github.com/kiva/ui/compare/v2.426.3...v2.427.0) (2022-12-15)


### Features

* matched lending section added to lending page ([93a79f3](https://github.com/kiva/ui/commit/93a79f33a2c7b98c133dcfab855ed8a5344dc46d))

### [2.426.3](https://github.com/kiva/ui/compare/v2.426.2...v2.426.3) (2022-12-15)


### Bug Fixes

* refresh the basket totals and state (includes user balance) on payment submisson error ([905b300](https://github.com/kiva/ui/commit/905b300f6724e053bef1dbc1444768fcb2180d5d))

### [2.426.2](https://github.com/kiva/ui/compare/v2.426.1...v2.426.2) (2022-12-14)


### Bug Fixes

* updated e2e for search with lend/filter navigation ([135f9d0](https://github.com/kiva/ui/commit/135f9d03c7e8810715f5ddf0ff947ac8257a58af))

### [2.426.1](https://github.com/kiva/ui/compare/v2.426.0...v2.426.1) (2022-12-14)


### Bug Fixes

* update TOU and highlight changes ([9780b04](https://github.com/kiva/ui/commit/9780b047b1600639237689c0880145990416b4f8))

## [2.426.0](https://github.com/kiva/ui/compare/v2.425.1...v2.426.0) (2022-12-14)


### Features

* add hotjar data suppress ([f764e9d](https://github.com/kiva/ui/commit/f764e9dc50e3e56153208a5b3e19e2f8bcb8b2fa))

### [2.425.1](https://github.com/kiva/ui/compare/v2.425.0...v2.425.1) (2022-12-14)


### Bug Fixes

* js error for null city/state/country when missing ([5a69d72](https://github.com/kiva/ui/commit/5a69d72e01402844747dfa202bac8651b542ce3e))

## [2.425.0](https://github.com/kiva/ui/compare/v2.424.1...v2.425.0) (2022-12-14)


### Features

* spacing and alignment pass on order totals line items ([17d91b1](https://github.com/kiva/ui/commit/17d91b16e8948f191e4b9e9ed37612cbcc2d1027))

### [2.424.1](https://github.com/kiva/ui/compare/v2.424.0...v2.424.1) (2022-12-13)


### Bug Fixes

* update fastly url in dev to use root now that the domain is running through fastly ([ca854ed](https://github.com/kiva/ui/commit/ca854ed821ed69b94aeb64e08d49c064571fc8c6))

## [2.424.0](https://github.com/kiva/ui/compare/v2.423.0...v2.424.0) (2022-12-13)


### Features

* design and ux updates for lending home page ([7aaaa45](https://github.com/kiva/ui/commit/7aaaa4572638b64edae2151cfc31b473796c17bf))

## [2.423.0](https://github.com/kiva/ui/compare/v2.422.0...v2.423.0) (2022-12-13)


### Features

* add impact statement icons ([6dde732](https://github.com/kiva/ui/commit/6dde7323269d61f6120d0b2999a8afbf4d961234))
* clientside load the loan bookmark ([dcadd62](https://github.com/kiva/ui/commit/dcadd626fc83e6d336b84883597217d578e4c561))
* first variation ([054ca30](https://github.com/kiva/ui/commit/054ca305358620e64fd1715b2d1c1bc546ff5dd8))
* lazy load summary card ([1b073db](https://github.com/kiva/ui/commit/1b073dbbbc5b282042b916775f4acd6006c70a60))
* remove some prefetched borrower profile data ([911a836](https://github.com/kiva/ui/commit/911a8365a33aa67fa8ff109a830c10c26348cf07))
* removed social elements exp ([2375f63](https://github.com/kiva/ui/commit/2375f635709e1bbc51c2577de4755089f73fa2db))


### Bug Fixes

* merge issue ([fd404ea](https://github.com/kiva/ui/commit/fd404ea36927681cfa14ad33810dc7e9bc2ffe93))
* missed removing exp flag ([0df0911](https://github.com/kiva/ui/commit/0df091174d911fa3778778c7818e412099046e04))
* missing semicolon ([5d90c57](https://github.com/kiva/ui/commit/5d90c57385ae1c652509af16d7d95eac5dc8b331))
* needs leading zero ([7ccf247](https://github.com/kiva/ui/commit/7ccf24721b68ea1355eb7d9aba4228f48fb2b115))
* remove exp data from prefetch query ([aa13cf5](https://github.com/kiva/ui/commit/aa13cf59843d6ca28a8cd2cbb5333ec84681003d))
* removed exp code ([62a7ad3](https://github.com/kiva/ui/commit/62a7ad3a3ea4510404bc5f6808cd2a7ddb6b98c0))
* removed unneeded preFetchVariables ([da258ec](https://github.com/kiva/ui/commit/da258ecdcfbb80b1374c2e56f298c59e6e013ab0))
* removed unneeded try catch ([3c5275b](https://github.com/kiva/ui/commit/3c5275b8106aff82de198f2df3738ad3ef72ac09))
* send extra data to mounted hook ([01604fe](https://github.com/kiva/ui/commit/01604fee893bf559e981f9d40cceba7f2c3580fe))

## [2.422.0](https://github.com/kiva/ui/compare/v2.421.0...v2.422.0) (2022-12-13)


### Features

* update copy and images ([9323470](https://github.com/kiva/ui/commit/9323470571165a6a95330ab2dfe7f3048ab8db53))

## [2.421.0](https://github.com/kiva/ui/compare/v2.420.0...v2.421.0) (2022-12-13)


### Features

* category dropdown logic for MVP quick filters section ([deddcef](https://github.com/kiva/ui/commit/deddcef2497232d7e58a3a3ea649a0dadc3eb1d4))


### Bug Fixes

* merge conflict ([f366d9e](https://github.com/kiva/ui/commit/f366d9e456cfb0e0293aa15e96f5a9ad4995b508))
* reset preset filters when category changes ([8f36657](https://github.com/kiva/ui/commit/8f36657cc257ad395f9c8bb964c2a20953b51b69))

## [2.420.0](https://github.com/kiva/ui/compare/v2.419.1...v2.420.0) (2022-12-12)


### Features

* tracking event added when adding to basket in recommended loans section ([88edd41](https://github.com/kiva/ui/commit/88edd41f3c792ab176b37fcede936156587fff30))

### [2.419.1](https://github.com/kiva/ui/compare/v2.419.0...v2.419.1) (2022-12-09)


### Bug Fixes

* reverted file ([0a420fa](https://github.com/kiva/ui/commit/0a420fac56cfe923a45b645fbb4e4999f40bbcaa))
* run private menu query when lend menu opened ([ef01d31](https://github.com/kiva/ui/commit/ef01d31178c13ef59cf6b74cd3adb0073eb69736))
* safer solution to running private query for lend menu ([e9213c0](https://github.com/kiva/ui/commit/e9213c0dd80c4c7a539c5cd58ec628938989a539))
* watch saved searches ([36f7f80](https://github.com/kiva/ui/commit/36f7f803ed1d3812d05a691a2321b4de537c6161))

## [2.419.0](https://github.com/kiva/ui/compare/v2.418.0...v2.419.0) (2022-12-09)


### Features

* carousel added to lendingcategorysection component ([6a3d33b](https://github.com/kiva/ui/commit/6a3d33bc7fe17ff229049594384b3be71a94c093))

## [2.418.0](https://github.com/kiva/ui/compare/v2.417.2...v2.418.0) (2022-12-09)


### Features

* match experiment targets for lenders and depositors ([3d33f58](https://github.com/kiva/ui/commit/3d33f5818802038f55ebde3af925cd1316be3b27))


### Bug Fixes

* change partner description for experiment MARS-317 ([7c6a562](https://github.com/kiva/ui/commit/7c6a5620a1d5dd97caed2264289e6d9479cb5617))
* repayment date copy and stat cycling updates MARS-317 ([b0e6f2f](https://github.com/kiva/ui/commit/b0e6f2ffcf0352cda922968fa074f11f859d7767))
* use line clamp for truncating and track clicks MARS-317 ([ef35c5e](https://github.com/kiva/ui/commit/ef35c5edc52aed5ea6fc8044fa141e06229104b4))

### [2.417.2](https://github.com/kiva/ui/compare/v2.417.1...v2.417.2) (2022-12-09)


### Bug Fixes

* country list navigate to new filter page ([d4da974](https://github.com/kiva/ui/commit/d4da9744bbc51748f49cc97460f4fabec84718ca))
* in page navigation for search ([ff86cf0](https://github.com/kiva/ui/commit/ff86cf0535d5ab8a605e55102cdfbc81005aff92))
* search box URL ([3e83ab1](https://github.com/kiva/ui/commit/3e83ab1ea9722dc0996b24f8428c7b4841b0f293))

### [2.417.1](https://github.com/kiva/ui/compare/v2.417.0...v2.417.1) (2022-12-09)


### Bug Fixes

* css for order totals ([5923ea6](https://github.com/kiva/ui/commit/5923ea6e4f71052515cd44827286ab9bee461568))

## [2.417.0](https://github.com/kiva/ui/compare/v2.416.0...v2.417.0) (2022-12-08)


### Features

* add 5th donation item variant as line item in order totals ([c3975cf](https://github.com/kiva/ui/commit/c3975cf24872657080d6511edf48f500fd8e5a35))

## [2.416.0](https://github.com/kiva/ui/compare/v2.415.0...v2.416.0) (2022-12-08)


### Features

* data fetching method added for recommeded loans in lending page ([d2d0420](https://github.com/kiva/ui/commit/d2d042092cb56fb89f5c72803d318aa65ff391c5))


### Bug Fixes

* recommended loans getter moved to mounted hook ([dbc9cbe](https://github.com/kiva/ui/commit/dbc9cbe336878e9e7e18a1452ccb0b8560088d41))

## [2.415.0](https://github.com/kiva/ui/compare/v2.414.2...v2.415.0) (2022-12-08)


### Features

* recommended loans section added to lending page ([edd90e4](https://github.com/kiva/ui/commit/edd90e40225a7ae19d8e2df858f0a63973b8862c))

### [2.414.2](https://github.com/kiva/ui/compare/v2.414.1...v2.414.2) (2022-12-08)


### Bug Fixes

* font files updated in kv-components ([0044325](https://github.com/kiva/ui/commit/0044325a89af22def3ab95314cdb7e35ac65ca2c))

### [2.414.1](https://github.com/kiva/ui/compare/v2.414.0...v2.414.1) (2022-12-07)


### Bug Fixes

* loan card key fixed to use index instead of key in quick filters section ([e25e179](https://github.com/kiva/ui/commit/e25e17902b31dcd4ba8a292eb14c59ab8b7617fc))

## [2.414.0](https://github.com/kiva/ui/compare/v2.413.0...v2.414.0) (2022-12-07)


### Features

* ui added when having zero loans result in quick filters ([6a5c42b](https://github.com/kiva/ui/commit/6a5c42be1dc816c39eaaa3596fba02542001f8ec))

## [2.413.0](https://github.com/kiva/ui/compare/v2.412.0...v2.413.0) (2022-12-06)


### Features

* kvpagination component added to new quick filter section ([0b6b5be](https://github.com/kiva/ui/commit/0b6b5be3234cfbbbfaf00a28b6f2344fa92adb94))

## [2.412.0](https://github.com/kiva/ui/compare/v2.411.3...v2.412.0) (2022-12-06)


### Features

* setting for preselected amount on donation form ([48ede68](https://github.com/kiva/ui/commit/48ede68a017da8c2b8ec83918e69b637cad2ee6d))

### [2.411.3](https://github.com/kiva/ui/compare/v2.411.2...v2.411.3) (2022-12-06)


### Bug Fixes

* correct page limit ([a9a60e3](https://github.com/kiva/ui/commit/a9a60e39ea365e7f993d020b0b8af05dad4b0571))
* merge conflict ([fd8361d](https://github.com/kiva/ui/commit/fd8361d77a9761c62ec238fbcef08e755a71e69a))
* pr comments ([a862578](https://github.com/kiva/ui/commit/a8625782aaebb6e51987c2d19b7a3e67c4b78f77))

### [2.411.2](https://github.com/kiva/ui/compare/v2.411.1...v2.411.2) (2022-12-05)


### Bug Fixes

* add additional checks for modern subscriptions ([c9f5c76](https://github.com/kiva/ui/commit/c9f5c76ebab737d7ffbbe5f489d9a8098e3e4842))

### [2.411.1](https://github.com/kiva/ui/compare/v2.411.0...v2.411.1) (2022-12-05)


### Bug Fixes

* minor styling change to donation variants ([ff60997](https://github.com/kiva/ui/commit/ff609979519cad19af4cb39aa87706b6c906cb19))

## [2.411.0](https://github.com/kiva/ui/compare/v2.410.0...v2.411.0) (2022-12-03)


### Features

* show context experiment when havent lent or deposited ([223b703](https://github.com/kiva/ui/commit/223b7033316b336f84a30b550e84cda9b5848f15))


### Bug Fixes

* categories copy ([4f74c35](https://github.com/kiva/ui/commit/4f74c357711195c751b6fc5d91f6a79ba651872f))

## [2.410.0](https://github.com/kiva/ui/compare/v2.409.4...v2.410.0) (2022-12-02)


### Features

* add support for additional bp backgrounds ([e7ab849](https://github.com/kiva/ui/commit/e7ab8496c64be5a7167dcc913c9b31a32baef36d))

### [2.409.4](https://github.com/kiva/ui/compare/v2.409.3...v2.409.4) (2022-12-02)


### Bug Fixes

* errors resolved for apollo cache on BP ([effde90](https://github.com/kiva/ui/commit/effde909ce6bc10ce9560070cb2b1f9930ccf041))
* forgot async await ([2318f87](https://github.com/kiva/ui/commit/2318f876ce3b1244295fa75febd73f7c4fc74fc8))

### [2.409.3](https://github.com/kiva/ui/compare/v2.409.2...v2.409.3) (2022-12-02)


### Bug Fixes

* medium italic is the correct font ([ede4890](https://github.com/kiva/ui/commit/ede4890c51caf75270ae65ab44acd8bd85f401dd))

### [2.409.2](https://github.com/kiva/ui/compare/v2.409.1...v2.409.2) (2022-12-02)


### Bug Fixes

* share link ([c9ed7c5](https://github.com/kiva/ui/commit/c9ed7c54e22b42a06d944754035f6168841d13b7))
* share link condition ([3a6cf03](https://github.com/kiva/ui/commit/3a6cf0341847eb9d5c6b84c16b3ae18a7dd30e0e))

### [2.409.1](https://github.com/kiva/ui/compare/v2.409.0...v2.409.1) (2022-12-01)


### Bug Fixes

* copy for agriculture, show lender name in stepper within control ([c9b9fd6](https://github.com/kiva/ui/commit/c9b9fd63d8a48b287bf640fc58ad445baf85c613))
* minor designs ([d0c499f](https://github.com/kiva/ui/commit/d0c499fbf305b198534f21f645e615285620a285))

## [2.409.0](https://github.com/kiva/ui/compare/v2.408.0...v2.409.0) (2022-12-01)


### Features

* add impact statement icons ([fad8abb](https://github.com/kiva/ui/commit/fad8abbac26706d9c338b2dde306170f129cc167))
* first variation ([4252ef1](https://github.com/kiva/ui/commit/4252ef1ae2b6a294a61691f2652ce208f298989d))
* repayment text ([1e4852e](https://github.com/kiva/ui/commit/1e4852efd50bfbd6dde12825a1e4ec1dc93e1e46))


### Bug Fixes

* error in loop cycle ([a687366](https://github.com/kiva/ui/commit/a687366fceebe46e54c245712c0f0477c7c3a9e9))
* remove exp data from prefetch query ([c0f2f2a](https://github.com/kiva/ui/commit/c0f2f2a459467b5a607c4c62209083e8d4c4539a))
* send extra data to mounted hook ([8ddd601](https://github.com/kiva/ui/commit/8ddd601a310808e52a330d98e6ece3bfbd83597d))

## [2.408.0](https://github.com/kiva/ui/compare/v2.407.0...v2.408.0) (2022-12-01)


### Features

* customized sortby dropdown updated ([586f023](https://github.com/kiva/ui/commit/586f0238a07d61a62545b0474619eaa967097dc3))

## [2.407.0](https://github.com/kiva/ui/compare/v2.406.0...v2.407.0) (2022-12-01)


### Features

* default value added to category dropdown options ([81adf25](https://github.com/kiva/ui/commit/81adf2569eef5afeb8a52c44d959780aa09547c0))

## [2.406.0](https://github.com/kiva/ui/compare/v2.405.1...v2.406.0) (2022-12-01)


### Features

* load filters for loan finding page quick filters ([de969ca](https://github.com/kiva/ui/commit/de969ca6f3cb440e16844c27b14181fd45a42c33))


### Bug Fixes

* merge conflict ([62d3dc1](https://github.com/kiva/ui/commit/62d3dc1f2946942f7be6ce6d05243e2729921e8c))
* mrg conflict ([c81e48f](https://github.com/kiva/ui/commit/c81e48fbce7e17ac50a38f4906a2a82795eca1cf))
* pr comment updates ([2014f52](https://github.com/kiva/ui/commit/2014f52ca60ce33cd376ef3bde89531a365d7d4c))

### [2.405.1](https://github.com/kiva/ui/compare/v2.405.0...v2.405.1) (2022-12-01)


### Bug Fixes

* text change on donation variant ([1783aeb](https://github.com/kiva/ui/commit/1783aeb59d9e26549e4e2931b23fbcb3dc342010))

## [2.405.0](https://github.com/kiva/ui/compare/v2.404.2...v2.405.0) (2022-12-01)


### Features

* improve loan meta preview ([2a61925](https://github.com/kiva/ui/commit/2a61925641ed20f8bcd77f5cfb12509e31e7473f))

### [2.404.2](https://github.com/kiva/ui/compare/v2.404.1...v2.404.2) (2022-11-30)


### Bug Fixes

* exp name ([ecfcc08](https://github.com/kiva/ui/commit/ecfcc08a9bf5b344a604749140102f7ffeb0673c))
* validate invited by url ([b49e3b2](https://github.com/kiva/ui/commit/b49e3b23b7fb83ae4474411788fd0727a80efd25))

### [2.404.1](https://github.com/kiva/ui/compare/v2.404.0...v2.404.1) (2022-11-30)


### Bug Fixes

* add revenue tag ([07f0fd9](https://github.com/kiva/ui/commit/07f0fd9a2509f851bb8819fe87b23b566d57661a))
* validate deposit total ([b7f0226](https://github.com/kiva/ui/commit/b7f0226e89f89e9f08201b6ff48480d25ae50898))
* validate loan total value ([9caee35](https://github.com/kiva/ui/commit/9caee359fc1c7cb7922afc83fb9c7051a0622997))

## [2.404.0](https://github.com/kiva/ui/compare/v2.403.0...v2.404.0) (2022-11-30)


### Features

* checkout page support for lender kiva cards ([13e5bde](https://github.com/kiva/ui/commit/13e5bdeea9e000b66a6754880be2460a7b115871))

## [2.403.0](https://github.com/kiva/ui/compare/v2.402.0...v2.403.0) (2022-11-30)


### Features

* removed unused exp ([2d943c8](https://github.com/kiva/ui/commit/2d943c82219473da5a7e8be7011fedd0c333c944))

## [2.402.0](https://github.com/kiva/ui/compare/v2.401.0...v2.402.0) (2022-11-30)


### Features

* modify stepper message ([12a7289](https://github.com/kiva/ui/commit/12a7289a3ebb769d837510017e834d2bf5924cde))
* set share card information ([6890000](https://github.com/kiva/ui/commit/6890000f6400fb82485eb74d67e69a0a201b3ad9))
* show category image, headline and body based on exp version ([3e5e52e](https://github.com/kiva/ui/commit/3e5e52eb77317001b549ebf3978003dca9b4af01))
* update canonical url and avoid tracking when loan doesnt belong to categories experiment ([eb80797](https://github.com/kiva/ui/commit/eb80797efc9e59cde4dbae824695ab18bd97c933))


### Bug Fixes

* minor fixes ([deda7e1](https://github.com/kiva/ui/commit/deda7e18c3619210baf27c589dd322441f883af3))
* resolve conflicts ([3c5d2e0](https://github.com/kiva/ui/commit/3c5d2e0faa36b8b758bd7216deecb61b58c02b0e))
* show lender name on stepper ([b42985f](https://github.com/kiva/ui/commit/b42985f78d771462f2e3dc4ef00aa75705d2da6f))
* solve conflict ([76c9c4e](https://github.com/kiva/ui/commit/76c9c4eaa8d576b507579bcb43ca08117ba008c6))
* unmask loan name ([d9fd2fb](https://github.com/kiva/ui/commit/d9fd2fb35678975f187cf11583f57ebd08b75c6a))

## [2.401.0](https://github.com/kiva/ui/compare/v2.400.0...v2.401.0) (2022-11-30)


### Features

* sort by dropdown updgraded in quick filters component ([439acaf](https://github.com/kiva/ui/commit/439acaf588760ff1d39d4c46bd5b4f20155dedf7))


### Bug Fixes

* css code updated in quick filter component ([e314b82](https://github.com/kiva/ui/commit/e314b8261b7d64d15213939903bcbb76df95723c))

## [2.400.0](https://github.com/kiva/ui/compare/v2.399.0...v2.400.0) (2022-11-29)


### Features

* add another donation item variant ([00198a6](https://github.com/kiva/ui/commit/00198a622bcf0efcf38b3157bc286667c8ca95f4))

## [2.399.0](https://github.com/kiva/ui/compare/v2.398.3...v2.399.0) (2022-11-29)


### Features

* new temp loan cards for MVP loan finding page ([09abc4f](https://github.com/kiva/ui/commit/09abc4f47dbbbf39b757b3d8fb4e9fb6f0eafa3a))


### Bug Fixes

* merge conflict ([3784633](https://github.com/kiva/ui/commit/3784633daaa0f2151edad4f0b59d5cacb39c7102))

### [2.398.3](https://github.com/kiva/ui/compare/v2.398.2...v2.398.3) (2022-11-28)


### Bug Fixes

* show donation item tagline when there are no loans ([cd94620](https://github.com/kiva/ui/commit/cd94620e3564cacea69be28136910d8c947aaaa7))

### [2.398.2](https://github.com/kiva/ui/compare/v2.398.1...v2.398.2) (2022-11-23)


### Bug Fixes

* ui doesn't load loans when default loan display mode is set to "grid" ([2f0dde8](https://github.com/kiva/ui/commit/2f0dde8b4d16bc50aaf2bc7d19ea8477454515fc))

### [2.398.1](https://github.com/kiva/ui/compare/v2.398.0...v2.398.1) (2022-11-23)


### Bug Fixes

* stepper title style ([01566c1](https://github.com/kiva/ui/commit/01566c1cf8fa67b6ac0656b8ab2d0abec7ce973f))

## [2.398.0](https://github.com/kiva/ui/compare/v2.397.0...v2.398.0) (2022-11-23)


### Features

* quickfilters component upgraded to include category dropdown ([2fddabc](https://github.com/kiva/ui/commit/2fddabc74aff28fc840e229dbb224172e7a242c0))

## [2.397.0](https://github.com/kiva/ui/compare/v2.396.1...v2.397.0) (2022-11-23)


### Features

* quick filter section added to lending home page ([a9af386](https://github.com/kiva/ui/commit/a9af386742bc418befb7c9378dfe1d695df711ba))

### [2.396.1](https://github.com/kiva/ui/compare/v2.396.0...v2.396.1) (2022-11-22)


### Bug Fixes

* removed TransactionInfo FB event ([6b1e725](https://github.com/kiva/ui/commit/6b1e725eebcecd97e048350cffd62574d4e2c14f))

## [2.396.0](https://github.com/kiva/ui/compare/v2.395.0...v2.396.0) (2022-11-22)


### Features

* welcome message added to lending home page ([4ea0133](https://github.com/kiva/ui/commit/4ea0133db200224ca2a4a9f29e7d214d34de2b29))


### Bug Fixes

* mask added to first name span ([706aa32](https://github.com/kiva/ui/commit/706aa328a206205d05e54925d764b4483e7ca951))

## [2.395.0](https://github.com/kiva/ui/compare/v2.394.0...v2.395.0) (2022-11-22)


### Features

* query to get user info added to lending home page ([657b958](https://github.com/kiva/ui/commit/657b958e72debc0906607e3f57f7762e5d178134))

## [2.394.0](https://github.com/kiva/ui/compare/v2.393.1...v2.394.0) (2022-11-22)


### Features

* new loan finding page setup added to lbc page ([d0a4cf4](https://github.com/kiva/ui/commit/d0a4cf4bc4eb2c6a2f38221340f458611fef0c54))
* redirection for lending page moved to prefetch method ([06458c3](https://github.com/kiva/ui/commit/06458c38fce1c48e4ab6c207570da6f404d868c4))


### Bug Fixes

* showcontent flag removed in lbc page ([acd13b3](https://github.com/kiva/ui/commit/acd13b3f9c35b108a1135afb2684428e4ad530e6))
* unused var removed ([9c320de](https://github.com/kiva/ui/commit/9c320de93b97ad309785cb04963981be30792852))

### [2.393.1](https://github.com/kiva/ui/compare/v2.393.0...v2.393.1) (2022-11-21)


### Bug Fixes

* margin button for amount selector fixed in lendcta ([6b29f06](https://github.com/kiva/ui/commit/6b29f062760d51eb59eef006d6f4a111c53a28a8))
* validation of boolean as string ([38b72d1](https://github.com/kiva/ui/commit/38b72d1dddbb08e9b1e19236a0f41b33afe48fab))

## [2.393.0](https://github.com/kiva/ui/compare/v2.392.0...v2.393.0) (2022-11-21)


### Features

* mask lender name ([76767ea](https://github.com/kiva/ui/commit/76767ea956d0531300b32a0a97e958fa9d332e53))
* stepper in thanks page share ([0c61816](https://github.com/kiva/ui/commit/0c6181610263514e29b02673dcd06dd19464dfca))


### Bug Fixes

* eslint ([0bd6962](https://github.com/kiva/ui/commit/0bd69628f20cb74bd9caed9aabd86954f1d0a431))
* remove lender first name in headline ([c591c20](https://github.com/kiva/ui/commit/c591c20d9a7874da563a0f2cad4eb6e170072cd0))
* use inline styles for possible not existing tw classes ([1db9f68](https://github.com/kiva/ui/commit/1db9f6876acc4fcfaee0a3715f849f3cc6b0678d))

## [2.392.0](https://github.com/kiva/ui/compare/v2.391.0...v2.392.0) (2022-11-21)


### Features

* remove dropdowns for excluded categories on quick filters ([c6deb4d](https://github.com/kiva/ui/commit/c6deb4d59ba68ef900d79286f014722baf2c41c2))

## [2.391.0](https://github.com/kiva/ui/compare/v2.390.5...v2.391.0) (2022-11-21)


### Features

* add og and twitter description ([1a300af](https://github.com/kiva/ui/commit/1a300affb6ea062f226671fd6375bd3e372486d0))
* add share copy ([3f4e310](https://github.com/kiva/ui/commit/3f4e31042fed72cb4d704b827f2d682043925e96))
* conditional canonical url ([c58834b](https://github.com/kiva/ui/commit/c58834b17171a6a478b3994e7f77e33155cd2763))
* conditional share card image for new year campaign ([92b0743](https://github.com/kiva/ui/commit/92b074358a6a8ad771b20b8440b14f6e249a1466))

### [2.390.5](https://github.com/kiva/ui/compare/v2.390.4...v2.390.5) (2022-11-18)


### Bug Fixes

* cta size fixed in borrower profile page ([056b7b9](https://github.com/kiva/ui/commit/056b7b94f101bd516c30de189407cae245366f6d))

### [2.390.4](https://github.com/kiva/ui/compare/v2.390.3...v2.390.4) (2022-11-17)


### Bug Fixes

* select box needs touch event ([b792ce8](https://github.com/kiva/ui/commit/b792ce84d502f7eb456d8cd2310a024e27df02e7))

### [2.390.3](https://github.com/kiva/ui/compare/v2.390.2...v2.390.3) (2022-11-17)


### Bug Fixes

* remove algolia analytics ([6d9aa86](https://github.com/kiva/ui/commit/6d9aa8646bf2dd699cec1a78addae58ee8e8d94c))
* remove duplicate FB pixel and old quantcast tracking ([dcc6adf](https://github.com/kiva/ui/commit/dcc6adffe72d424ccc5f2240acd5c4c415ec10c8))

### [2.390.2](https://github.com/kiva/ui/compare/v2.390.1...v2.390.2) (2022-11-17)


### Bug Fixes

* hide isMatchable filter ([f26ab31](https://github.com/kiva/ui/commit/f26ab31e504b5df831b6d4daebb86af12cd7347c))

### [2.390.1](https://github.com/kiva/ui/compare/v2.390.0...v2.390.1) (2022-11-16)


### Bug Fixes

* saved search link alignment ([f977ea2](https://github.com/kiva/ui/commit/f977ea21ef684d8fe874b5de0888382ba7e36133))

## [2.390.0](https://github.com/kiva/ui/compare/v2.389.0...v2.390.0) (2022-11-16)


### Features

* experiment code for complete loan feature was removed ([67aa855](https://github.com/kiva/ui/commit/67aa855ab3a9c2c16269cc75a1865ced00b1a190))

## [2.389.0](https://github.com/kiva/ui/compare/v2.388.0...v2.389.0) (2022-11-16)


### Features

* add how and press-center routes ([9585234](https://github.com/kiva/ui/commit/958523433f2952045d0df2c34e892481ef2f038e))

## [2.388.0](https://github.com/kiva/ui/compare/v2.387.0...v2.388.0) (2022-11-16)


### Features

* non 25 increment option added to amount selector in lend increment button component ([7982f5a](https://github.com/kiva/ui/commit/7982f5accefd136489858214bcda26c8768c61e9))

## [2.387.0](https://github.com/kiva/ui/compare/v2.386.0...v2.387.0) (2022-11-15)


### Features

* changed distribution model query to use and expect legacy values ([e771137](https://github.com/kiva/ui/commit/e771137dc3696ee9c5a5f7000c2d6f109082a0f2))

## [2.386.0](https://github.com/kiva/ui/compare/v2.385.0...v2.386.0) (2022-11-15)


### Features

* complete loan functions passed to loan utils file ([6124d8c](https://github.com/kiva/ui/commit/6124d8c4e695f913d28fc9b5d91857490acb7f00))


### Bug Fixes

* remove comment ([77735a4](https://github.com/kiva/ui/commit/77735a4e8b5ce8a3dd882195e1d9e0e51f1a7fa0))

## [2.385.0](https://github.com/kiva/ui/compare/v2.384.2...v2.385.0) (2022-11-14)


### Features

* overall cleanup of saved-search interface ([cac34e4](https://github.com/kiva/ui/commit/cac34e4a28067f2b9c3ae3aa76155a608706ac02))


### Bug Fixes

* cleanup merge conflicts ([8cb52fb](https://github.com/kiva/ui/commit/8cb52fb0f17b4b8d0cd4bf39b5a65c7ac055c234))
* removed !savedSearchSuccess codeline ([df8230c](https://github.com/kiva/ui/commit/df8230cde2fbc48255f0de184888051bcdc0befd))

### [2.384.2](https://github.com/kiva/ui/compare/v2.384.1...v2.384.2) (2022-11-11)


### Bug Fixes

* remove ineffective exp force versions, add cps version of support-refugees ([da87b65](https://github.com/kiva/ui/commit/da87b6535caee61cd3c6e57845a91a70823610d3))

### [2.384.1](https://github.com/kiva/ui/compare/v2.384.0...v2.384.1) (2022-11-11)


### Bug Fixes

* callback props removed from quick filters components ([7d796e2](https://github.com/kiva/ui/commit/7d796e2b6e0cec415bfa41098e41468d33fc4c9b))

## [2.384.0](https://github.com/kiva/ui/compare/v2.383.0...v2.384.0) (2022-11-11)


### Features

* make categories-beta categories page ([bf40646](https://github.com/kiva/ui/commit/bf406462da7c8613fad9bb91ebe6053bbe261b14))

## [2.383.0](https://github.com/kiva/ui/compare/v2.382.0...v2.383.0) (2022-11-08)


### Features

* isMatchable lend filter ([f7c83b1](https://github.com/kiva/ui/commit/f7c83b16407ff172cb80468cfb9d0163809d0bf1))

## [2.382.0](https://github.com/kiva/ui/compare/v2.381.0...v2.382.0) (2022-11-08)


### Features

* add additional query param functionality to borrower profile sharing and tracking ([b39327c](https://github.com/kiva/ui/commit/b39327c692ef6735be8c4f0433e665a7d63dd0f5))

## [2.381.0](https://github.com/kiva/ui/compare/v2.380.1...v2.381.0) (2022-11-08)


### Features

* donation amount added to loan share purchase event ([58b396b](https://github.com/kiva/ui/commit/58b396bbf2e33df9fd2a746978d10e4cc6b00b16))

### [2.380.1](https://github.com/kiva/ui/compare/v2.380.0...v2.380.1) (2022-11-08)


### Bug Fixes

* extend filters flag wasn't being passed to sort options ([02cd83f](https://github.com/kiva/ui/commit/02cd83f2ede278007a300f0ed3e5de649d414f60))
* key typo ([669a7be](https://github.com/kiva/ui/commit/669a7be58f13e0f52c5afe202a85a110d32879df))

## [2.380.0](https://github.com/kiva/ui/compare/v2.379.2...v2.380.0) (2022-11-07)


### Features

* loading state was added to continue buttons in checkout page ([9cff5b8](https://github.com/kiva/ui/commit/9cff5b83667de38239f45c67b04b605c89e2f4aa))

### [2.379.2](https://github.com/kiva/ui/compare/v2.379.1...v2.379.2) (2022-11-07)


### Bug Fixes

* adjust loading overlay z index to display above loan tags ([3401e74](https://github.com/kiva/ui/commit/3401e74720ac5e3782f8888b99cf89730d89cafa))

### [2.379.1](https://github.com/kiva/ui/compare/v2.379.0...v2.379.1) (2022-11-04)


### Bug Fixes

* added some extra whitespace that was missing ([c308861](https://github.com/kiva/ui/commit/c308861d592db9755d93f6eaaf3e0e02734a2b8d))
* radio group didn't pass good tracking strings for object-based filters ([7996cbc](https://github.com/kiva/ui/commit/7996cbc1d388e7a41f648f06dd3647a78c72822e))

## [2.379.0](https://github.com/kiva/ui/compare/v2.378.1...v2.379.0) (2022-11-04)


### Features

* show non binary filter ([cd0a96b](https://github.com/kiva/ui/commit/cd0a96b6ce46c8c0a5856e18586a07e78c98200f))

### [2.378.1](https://github.com/kiva/ui/compare/v2.378.0...v2.378.1) (2022-11-04)


### Bug Fixes

* noop typo fix to kick off fresh tag/build ([2e5a6f0](https://github.com/kiva/ui/commit/2e5a6f0ea61ea41f04ae8351419a90fd52a2ca4b))

## [2.378.0](https://github.com/kiva/ui/compare/v2.377.0...v2.378.0) (2022-11-04)


### Features

* new partner filters ([36c00f7](https://github.com/kiva/ui/commit/36c00f75a175ba24d3ab834031b9652586263877))

## [2.377.0](https://github.com/kiva/ui/compare/v2.376.0...v2.377.0) (2022-11-03)


### Features

* font size and padding fixed for helpmechoose trigger ([ed9049e](https://github.com/kiva/ui/commit/ed9049eb309fe7013c868d9baff9bfa47e6f6611))

## [2.376.0](https://github.com/kiva/ui/compare/v2.375.0...v2.376.0) (2022-11-03)


### Features

* extended range slider functionality ([9c0732f](https://github.com/kiva/ui/commit/9c0732f4a1a6670e8054599e0049ecbd0cd1ba96))
* new range slider stories ([5572601](https://github.com/kiva/ui/commit/5572601a7961844624b8b076553e85a70c02898c))


### Bug Fixes

* push linting fixes ([b7997ae](https://github.com/kiva/ui/commit/b7997aed8513a670194f5757252235e7896abea2))

## [2.375.0](https://github.com/kiva/ui/compare/v2.374.1...v2.375.0) (2022-11-03)


### Features

* change header login button ([a0ed90b](https://github.com/kiva/ui/commit/a0ed90b8e5a615a25939b749948cc7cc3023230f))


### Bug Fixes

* removed unnecessary class ([42dca79](https://github.com/kiva/ui/commit/42dca79bcf1666d070cf7ecdb88a96f7e0f17a99))
* reverted isVisitor validation ([55c7f44](https://github.com/kiva/ui/commit/55c7f4425193eeeb93ead13d2e6f96ae847859e3))
* use tailwind class and removed px values ([a398e21](https://github.com/kiva/ui/commit/a398e217cb7a4581f7eb8db5abc4711f11f5e5d0))
* use tailwind class instead of background hex ([e280d9a](https://github.com/kiva/ui/commit/e280d9a1350e1bab9f77d6f5b017ca1146a4f300))

### [2.374.1](https://github.com/kiva/ui/compare/v2.374.0...v2.374.1) (2022-11-03)


### Bug Fixes

* updated new home variant components ([b7ec310](https://github.com/kiva/ui/commit/b7ec31027d440f63a1ed60e2355539801fb37217))

## [2.374.0](https://github.com/kiva/ui/compare/v2.373.1...v2.374.0) (2022-11-03)


### Features

* modularized lend filter refactor ([d2bfc19](https://github.com/kiva/ui/commit/d2bfc19f498938af2437a0d5383b8c3a0a528cf8))

### [2.373.1](https://github.com/kiva/ui/compare/v2.373.0...v2.373.1) (2022-11-03)


### Bug Fixes

* remove console log ([55b80eb](https://github.com/kiva/ui/commit/55b80eb6fbf1858d74895393454e78f288a43bed))
* update some logic for loan tags ([27040c2](https://github.com/kiva/ui/commit/27040c26508144f08d74b7b8deeed00b248874f5))

## [2.373.0](https://github.com/kiva/ui/compare/v2.372.0...v2.373.0) (2022-11-03)


### Features

* added EEPR to Homepage Footer within Ui Server ([fbd9a12](https://github.com/kiva/ui/commit/fbd9a12fc1c2ec7eac94f39e244664fd496119a4))
* revised click statement (Work with us -> Get to know us) ([a6135e5](https://github.com/kiva/ui/commit/a6135e51d6d6e4f3a4f11f32687018c16419cf5f))

## [2.372.0](https://github.com/kiva/ui/compare/v2.371.1...v2.372.0) (2022-11-03)


### Features

* add tracking and update styles for loan tags ([3c41e07](https://github.com/kiva/ui/commit/3c41e078fd2803e7fc1af00815183a916c0e6eac))


### Bug Fixes

* pr updates ([72e14b8](https://github.com/kiva/ui/commit/72e14b80867939154846c16cf57c7b37eea5e85c))
* update tracking ([a43c122](https://github.com/kiva/ui/commit/a43c1220337b87c7b4731562173e25104ac7553d))

### [2.371.1](https://github.com/kiva/ui/compare/v2.371.0...v2.371.1) (2022-11-02)


### Bug Fixes

* remove unused dependnecies, fix unit test ([bd4f3da](https://github.com/kiva/ui/commit/bd4f3da7bd94315b58cc2f80ee2e2db456ab6a7f))

## [2.371.0](https://github.com/kiva/ui/compare/v2.370.2...v2.371.0) (2022-11-02)


### Features

* add share button to fundraising borrower profile ([2ae6e4f](https://github.com/kiva/ui/commit/2ae6e4f95ea037b55b5ed0ff775f6331953d1926))

### [2.370.2](https://github.com/kiva/ui/compare/v2.370.1...v2.370.2) (2022-11-01)


### Bug Fixes

* tracking code format updated ([c2769f3](https://github.com/kiva/ui/commit/c2769f3e0e578fd29375cb9311fac0e47e030f99))

### [2.370.1](https://github.com/kiva/ui/compare/v2.370.0...v2.370.1) (2022-11-01)


### Bug Fixes

* clear up warning from github around lighthouse action, there may be more ([f9201ef](https://github.com/kiva/ui/commit/f9201ef2ff011fd6aa7f3abd8bd4d2017d985098))

## [2.370.0](https://github.com/kiva/ui/compare/v2.369.1...v2.370.0) (2022-11-01)


### Features

* tracking events added to help me choose experiment ([9ffd6f2](https://github.com/kiva/ui/commit/9ffd6f2fb7333f3623bc49e81528aabd8b546dd2))


### Bug Fixes

* tracking properties updated ([9e489e6](https://github.com/kiva/ui/commit/9e489e68e7f3f681daf26c0d34a97d134e7e6126))

### [2.369.1](https://github.com/kiva/ui/compare/v2.369.0...v2.369.1) (2022-11-01)


### Bug Fixes

* update collected lend link to work with href ([a2ec89a](https://github.com/kiva/ui/commit/a2ec89ad9da67e9448b7b0592817b99efaf67bd8))

## [2.369.0](https://github.com/kiva/ui/compare/v2.368.0...v2.369.0) (2022-11-01)


### Features

* implement loan tags on category pages ([69761bc](https://github.com/kiva/ui/commit/69761bc853f308ee102b645f21cada88139227ad))


### Bug Fixes

* lint ([b3c8de6](https://github.com/kiva/ui/commit/b3c8de65342830436c830152c01e802703e6e576))
* update exp name ([376f922](https://github.com/kiva/ui/commit/376f922e38682a4bbccd1482339b0f34e9a8bb9c))

## [2.368.0](https://github.com/kiva/ui/compare/v2.367.0...v2.368.0) (2022-11-01)


### Features

* add human centric donate module for single page of loan results ([568f2b8](https://github.com/kiva/ui/commit/568f2b834416420a796ae9e66a3807a17c71c24c))

## [2.367.0](https://github.com/kiva/ui/compare/v2.366.0...v2.367.0) (2022-10-28)


### Features

* loan count added to tag filter ([fca9360](https://github.com/kiva/ui/commit/fca93606aee5558cc807addeee7d89dd5255933e))

## [2.366.0](https://github.com/kiva/ui/compare/v2.365.2...v2.366.0) (2022-10-28)


### Features

* placeholders added to help me choose experiment ([0c6c925](https://github.com/kiva/ui/commit/0c6c925d0521cb35cec306608796ae1199a817bf))

### [2.365.2](https://github.com/kiva/ui/compare/v2.365.1...v2.365.2) (2022-10-27)


### Bug Fixes

* issues with new range min max slider (FF and colors) ([0af2323](https://github.com/kiva/ui/commit/0af2323e265e4845e81645fdc761da71ce459d97))

### [2.365.1](https://github.com/kiva/ui/compare/v2.365.0...v2.365.1) (2022-10-27)


### Bug Fixes

* use category url to activate view more link and card on lend by category ([c0ae9b7](https://github.com/kiva/ui/commit/c0ae9b7674933a376c397f290e94ed2d601c0240))

## [2.365.0](https://github.com/kiva/ui/compare/v2.364.1...v2.365.0) (2022-10-27)


### Features

* loan card added for helpme choose experiment ([b93f41d](https://github.com/kiva/ui/commit/b93f41d22732db0665082caf600afa2c601a828c))

### [2.364.1](https://github.com/kiva/ui/compare/v2.364.0...v2.364.1) (2022-10-27)


### Bug Fixes

* use anchor links to avoid app routing for monolith lend/ routes ([e5701d0](https://github.com/kiva/ui/commit/e5701d00efe9988a8e15aaec5316081612462b8c))

## [2.364.0](https://github.com/kiva/ui/compare/v2.363.0...v2.364.0) (2022-10-27)


### Features

* add donate modules experiment ([c183f83](https://github.com/kiva/ui/commit/c183f837baae34c66ff06af9c93bd5d867c3ab01))

## [2.363.0](https://github.com/kiva/ui/compare/v2.362.0...v2.363.0) (2022-10-27)


### Features

* range min max slider ([b736c6c](https://github.com/kiva/ui/commit/b736c6c18549029e63f6bdf7e4aa7d0cf3f5029b))


### Bug Fixes

* automated linting fixes from trying to push ([0e6f3de](https://github.com/kiva/ui/commit/0e6f3de52ee6af811db54f05490c197a932a1207))
* more linting fixes ([97e743d](https://github.com/kiva/ui/commit/97e743d98cef9278aee4e1405cea4722eeed11ed))

## [2.362.0](https://github.com/kiva/ui/compare/v2.361.0...v2.362.0) (2022-10-26)


### Features

* computed values added for image and activity ([7b3299b](https://github.com/kiva/ui/commit/7b3299b891638e73e8d4478fdde6edfb20c45635))
* helpme choose loans getter and logic added to the experiment ([ea271ef](https://github.com/kiva/ui/commit/ea271efb69ec6769cdff3b84f01e58360a5e6c90))
* methods for getting image and activity were added ([e4e3405](https://github.com/kiva/ui/commit/e4e34057792a5fb9c9335178f624398bb3557de1))


### Bug Fixes

* extra code removed ([b4855a6](https://github.com/kiva/ui/commit/b4855a6dffa6fa079911fdbcdf9e405e6b0abfc8))

## [2.361.0](https://github.com/kiva/ui/compare/v2.360.0...v2.361.0) (2022-10-26)


### Features

* added non-binary filter option ([e730c91](https://github.com/kiva/ui/commit/e730c91057c1b90397c477a83d7c444988e6e282))
* show nonbinary filter with specific param ([6eb0c70](https://github.com/kiva/ui/commit/6eb0c70385d0d5d39ef9e499377b6b0def49f105))
* small update ([d907915](https://github.com/kiva/ui/commit/d90791563c53136d59e24d16ba1c83b6603f6a3b))


### Bug Fixes

* add remove comment ([9f01ccc](https://github.com/kiva/ui/commit/9f01ccc5f051cc0fcec95ff04b0a1507aa603d5a))
* remove hypens from filter name ([7814b7f](https://github.com/kiva/ui/commit/7814b7f141b78977f92d2dd54402d1d7c8402522))
* remove unused component ([20e0d3a](https://github.com/kiva/ui/commit/20e0d3a975cdcb9e5e33f6c0733e9031a509fec5))
* remove unused func ([8081eec](https://github.com/kiva/ui/commit/8081eec57328a597b0328aff1dc3a68207d04740))
* removed male key duplicated ([72ea163](https://github.com/kiva/ui/commit/72ea1637a8e30b1bea3c32f431a4de65ff32d507))
* resolve comments ([a2a41e4](https://github.com/kiva/ui/commit/a2a41e4aa298a2da212151f09a3ed946d78af964))
* solve conflicts ([4669054](https://github.com/kiva/ui/commit/46690547fbe5d7fd7e301fb26ef7202151584c35))
* unremoved code from merge ([6f8498b](https://github.com/kiva/ui/commit/6f8498b8981db1fefef2d1dc25521078c238235a))
* use genderDisplayMap ([0fab7f4](https://github.com/kiva/ui/commit/0fab7f475077a2a516de692377d8cbf02e9d6126))


### Reverts

* filter chips ([7d92fe5](https://github.com/kiva/ui/commit/7d92fe51568d31f700ee5d9f42042df671c10838))
* loan search filters file ([2c0281d](https://github.com/kiva/ui/commit/2c0281da8fcef9e77003cc25f320923a97de42d3))

## [2.360.0](https://github.com/kiva/ui/compare/v2.359.2...v2.360.0) (2022-10-26)


### Features

* update placement of user attributes ([f3ad8e4](https://github.com/kiva/ui/commit/f3ad8e46ea62604e889b45c3dbdab5b13dcb5f7c))

### [2.359.2](https://github.com/kiva/ui/compare/v2.359.1...v2.359.2) (2022-10-26)


### Bug Fixes

* promo code only comes up for non-dynamically rendered pages ([5bb0e43](https://github.com/kiva/ui/commit/5bb0e4392cdf53deb4a95078aa6f121be0ccd444))

### [2.359.1](https://github.com/kiva/ui/compare/v2.359.0...v2.359.1) (2022-10-26)


### Bug Fixes

* update My conversations link to lend-classic ([3a4161d](https://github.com/kiva/ui/commit/3a4161dd93e03c765a1469c242c48c2e230aa6ac))

## [2.359.0](https://github.com/kiva/ui/compare/v2.358.1...v2.359.0) (2022-10-26)


### Features

* a/b test for loan tags ([465aa56](https://github.com/kiva/ui/commit/465aa565a020edf0dcc0b690f914525ff2e2ec92))


### Bug Fixes

* update var name ([1837d36](https://github.com/kiva/ui/commit/1837d36fb8e4d57913024ade8ca19aad97ea0b7c))

### [2.358.1](https://github.com/kiva/ui/compare/v2.358.0...v2.358.1) (2022-10-26)


### Bug Fixes

* always set user attribute ([7f556dc](https://github.com/kiva/ui/commit/7f556dc4f928c448535525c712f75b988a66bd6e))

## [2.358.0](https://github.com/kiva/ui/compare/v2.357.2...v2.358.0) (2022-10-26)


### Features

* partner ID loan filter ([f10e8c3](https://github.com/kiva/ui/commit/f10e8c341d34ce5423baeb3af3040452aacfb1b4))
* updated loan channel map ([948ba0d](https://github.com/kiva/ui/commit/948ba0d9450b3f27e94f5624e2d8b98f9b2063e3))


### Bug Fixes

* mark selected items, prevent headers from being clicked ([100d438](https://github.com/kiva/ui/commit/100d4388bb4c18fc108288f38f053bdb7a7dbc64))

### [2.357.2](https://github.com/kiva/ui/compare/v2.357.1...v2.357.2) (2022-10-25)


### Bug Fixes

* loan row carousel resets whenever see more loans button is clicked ([3595a79](https://github.com/kiva/ui/commit/3595a79b0d5373f63ad82bd384e9256377020545))

### [2.357.1](https://github.com/kiva/ui/compare/v2.357.0...v2.357.1) (2022-10-25)


### Bug Fixes

* change boolean flags to strings ([3d1b985](https://github.com/kiva/ui/commit/3d1b985bad285a5f6a67d4b9d6cad4ac69a63b88))

## [2.357.0](https://github.com/kiva/ui/compare/v2.356.2...v2.357.0) (2022-10-25)


### Features

* grid and logic added for help me choose experiment to show borrower selectors ([c3b6351](https://github.com/kiva/ui/commit/c3b6351cee8612932bc5f136ab42ad31b38eac6d))
* svgs removed and replaced by mdi ([e5cffd1](https://github.com/kiva/ui/commit/e5cffd17617c9f5dbbe3a6ab8fefcdc72c416b2e))

### [2.356.2](https://github.com/kiva/ui/compare/v2.356.1...v2.356.2) (2022-10-25)


### Bug Fixes

* change custom attributes name format ([97ff3d6](https://github.com/kiva/ui/commit/97ff3d6789a6bddd038c9502ab0a30f82cf55a08))

### [2.356.1](https://github.com/kiva/ui/compare/v2.356.0...v2.356.1) (2022-10-25)


### Bug Fixes

* detect device type ([41dda3c](https://github.com/kiva/ui/commit/41dda3c5f30e16c9cac49f79c19ec9f9bc15deba))
* detect device type ([40c411b](https://github.com/kiva/ui/commit/40c411bedaed767c8d8cee529778509fe6770e7f))
* removed commented code ([7b2f0c8](https://github.com/kiva/ui/commit/7b2f0c86661dbd08a5a10d35af408e550b2e8f0f))

## [2.356.0](https://github.com/kiva/ui/compare/v2.355.0...v2.356.0) (2022-10-24)


### Features

* borrower picker was created for help me choose experiment ([ef097e1](https://github.com/kiva/ui/commit/ef097e111e369706f5e1f6ef5e4336c6c3b1c2cd))

## [2.355.0](https://github.com/kiva/ui/compare/v2.354.0...v2.355.0) (2022-10-24)


### Features

* add overlay when location dropdown open quick filters ([0cc5520](https://github.com/kiva/ui/commit/0cc55202c5cf37baefa089eadb5f9be4a3f95f79))


### Bug Fixes

* add mobile view ([da9b900](https://github.com/kiva/ui/commit/da9b90055464d7918538a8fdffa7003705f0de76))
* lint ([5d825c4](https://github.com/kiva/ui/commit/5d825c4a48350dd99a4022d3c509c8b06a67570a))

## [2.354.0](https://github.com/kiva/ui/compare/v2.353.0...v2.354.0) (2022-10-24)


### Features

* new select box component for lend filter partner ID ([5f20052](https://github.com/kiva/ui/commit/5f200526f76415ee6415010cffe04d1a71f96800))

## [2.353.0](https://github.com/kiva/ui/compare/v2.352.1...v2.353.0) (2022-10-24)


### Features

* display achievement service badge on lending stats page ([28c5190](https://github.com/kiva/ui/commit/28c5190ac03b70addd48d8153639416434fea56c))
* show category description on mobile ([7a81261](https://github.com/kiva/ui/commit/7a81261821e71cb2de451f1a589e0d5a008e4eb6))

### [2.352.1](https://github.com/kiva/ui/compare/v2.352.0...v2.352.1) (2022-10-21)


### Bug Fixes

* ensure optimizely events are gated with OneTrust call instead of auto activated in callback ([e55e216](https://github.com/kiva/ui/commit/e55e21665609752372ba206cb0f573f73281b29a))

## [2.352.0](https://github.com/kiva/ui/compare/v2.351.0...v2.352.0) (2022-10-21)


### Features

* use new funded borrower profile as default, remove exp code + fix full profile link ([24be7dc](https://github.com/kiva/ui/commit/24be7dc99302d839409b5f8bee22d359b8e607ca))


### Bug Fixes

* update funded bp full profile link to use lend-classic ([f602c50](https://github.com/kiva/ui/commit/f602c504c79dc5a1da4c4d33e0d588a128be47b1))

## [2.351.0](https://github.com/kiva/ui/compare/v2.350.2...v2.351.0) (2022-10-21)


### Features

* extract loan fragment reading as util function ([ce530ae](https://github.com/kiva/ui/commit/ce530ae646681285654d05a4e53f716d3cc2e4aa))
* prefetch 1st loan in category grid and only load selected category ([ce115b2](https://github.com/kiva/ui/commit/ce115b296ec50c709536535dfa0fd494c3d5ff18))
* provide content-group content in ContentfulPage prefetch ([b24b764](https://github.com/kiva/ui/commit/b24b764c583d4296aebb7f1e2933d5010b4acf37))
* use cached loan data in NewHomePageLoanCard ([fcd3ef9](https://github.com/kiva/ui/commit/fcd3ef98bc762c1d51464d5156fa9ce02263ae95))

### [2.350.2](https://github.com/kiva/ui/compare/v2.350.1...v2.350.2) (2022-10-21)


### Bug Fixes

* don't add background as a question in faqs ([748df73](https://github.com/kiva/ui/commit/748df73f14b6b976a340cc9ee540ac7bd7cabbf2))

### [2.350.1](https://github.com/kiva/ui/compare/v2.350.0...v2.350.1) (2022-10-20)


### Bug Fixes

* make sure game users see the FLSS loan results in carousel ([98a1d0f](https://github.com/kiva/ui/commit/98a1d0f5e4fe6cefc090556852c10988d53c1bb9))

## [2.350.0](https://github.com/kiva/ui/compare/v2.349.0...v2.350.0) (2022-10-20)


### Features

* keyword search FLSS filter ([6e5dcdb](https://github.com/kiva/ui/commit/6e5dcdbe4b65b98651b666ca47b92c151b6b9d63))

## [2.349.0](https://github.com/kiva/ui/compare/v2.348.0...v2.349.0) (2022-10-20)


### Features

* gender added to facets for location options ([10adc96](https://github.com/kiva/ui/commit/10adc96f5b53bc583ecdd6003afe72e9afe352ab))

## [2.348.0](https://github.com/kiva/ui/compare/v2.347.3...v2.348.0) (2022-10-20)


### Features

* dynamic copy was added for every category and subcategory in helpme choose exp ([cbe47a8](https://github.com/kiva/ui/commit/cbe47a84a607acbe15c475f851adaf95b9cca2b8))

### [2.347.3](https://github.com/kiva/ui/compare/v2.347.2...v2.347.3) (2022-10-19)


### Bug Fixes

* avoid skipping userData query ([7751e2d](https://github.com/kiva/ui/commit/7751e2dc8281ffc5c34a1f46cbb204ea794f3734))
* revert and add hasEverLoggedIn in header query due to performance ([4ea976e](https://github.com/kiva/ui/commit/4ea976ec3a6d9b09de60d754de92c5730be93b73))

### [2.347.2](https://github.com/kiva/ui/compare/v2.347.1...v2.347.2) (2022-10-19)


### Bug Fixes

* lint ([dfbd341](https://github.com/kiva/ui/commit/dfbd3413f37c46f14704bbfb74ba04c947d59aee))
* update regions ui ([63157af](https://github.com/kiva/ui/commit/63157af0fb2ecee1c654acc503d06a2492b4199d))

### [2.347.1](https://github.com/kiva/ui/compare/v2.347.0...v2.347.1) (2022-10-19)


### Bug Fixes

* location selector was updated ([7de1f1b](https://github.com/kiva/ui/commit/7de1f1b8e0aa86ddf2d6a4114a59060a20ed0284))
* select all countries bug was fixed for location dropdown ([57165a5](https://github.com/kiva/ui/commit/57165a57aa0016dd06366ffadc261484a34a5ae6))

## [2.347.0](https://github.com/kiva/ui/compare/v2.346.0...v2.347.0) (2022-10-19)


### Features

* body scroll was blocked when location dropdown is visible ([f1985a5](https://github.com/kiva/ui/commit/f1985a5505621b6deee185d1c00370a6310163cf))

## [2.346.0](https://github.com/kiva/ui/compare/v2.345.0...v2.346.0) (2022-10-19)


### Features

* readonly attr was added to location input ([09c4d5b](https://github.com/kiva/ui/commit/09c4d5b638fd3efeed699828941bbcefefebdfdb))

## [2.345.0](https://github.com/kiva/ui/compare/v2.344.0...v2.345.0) (2022-10-18)


### Features

* activated additional sortBy options and edited unit testing ([d688052](https://github.com/kiva/ui/commit/d68805248f04a2dd2f4e9d4e6aa80df382a16df7))
* created LendFilterFlssQuery experiment ([e600d3b](https://github.com/kiva/ui/commit/e600d3b52d851713c538589820fa24dcbccf7f4d))
* merged branch 'main' into VUE-1314 and fixed git commit conflicts ([8797f5d](https://github.com/kiva/ui/commit/8797f5d64fda80044159597ec4afd3d375ae8a9a))

## [2.344.0](https://github.com/kiva/ui/compare/v2.343.1...v2.344.0) (2022-10-18)


### Features

* triggers were added to help me choose experiment ([055eeed](https://github.com/kiva/ui/commit/055eeed8ca7e1998ddab3ad04d61e3cafcf6ff6c))

### [2.343.1](https://github.com/kiva/ui/compare/v2.343.0...v2.343.1) (2022-10-18)


### Bug Fixes

* storybook path was incorrect ([94a730e](https://github.com/kiva/ui/commit/94a730e7554379d6a166c3db0cd0f3e09713546c))

## [2.343.0](https://github.com/kiva/ui/compare/v2.342.0...v2.343.0) (2022-10-17)


### Features

* is individual and lender repayment term filters ([fcf8527](https://github.com/kiva/ui/commit/fcf8527e2f41c736e7368419cd6d11ef188114ea))


### Bug Fixes

* missing horizontal line ([3471325](https://github.com/kiva/ui/commit/3471325f1c5a152e634787f38bb1bbfed2e8bad5))
* updated channel map file, other small fixes ([6303372](https://github.com/kiva/ui/commit/63033725f1e3ee89db359abc055cf173a7c85682))

## [2.342.0](https://github.com/kiva/ui/compare/v2.341.2...v2.342.0) (2022-10-17)


### Features

* send user attributes to hotjar api ([438087c](https://github.com/kiva/ui/commit/438087c20acd186ef924985d13e43c55e62909c1))


### Bug Fixes

* add hasEverLoggedIn on thankspage query ([3734a2e](https://github.com/kiva/ui/commit/3734a2ee4d14cd97c66b594140a35ffed94abdbb))
* add user id validation ([3bb3d4b](https://github.com/kiva/ui/commit/3bb3d4b448599aad7310fd8f48d05bc1fb88754a))
* set userId from lender ([5e8e88f](https://github.com/kiva/ui/commit/5e8e88f7a5db9254f0d47b29d14fad5e82f5f9fd))

### [2.341.2](https://github.com/kiva/ui/compare/v2.341.1...v2.341.2) (2022-10-17)


### Bug Fixes

* filter route now usable again ([96ac862](https://github.com/kiva/ui/commit/96ac86262aa5dad29fef950f90f2cd9a6fb792e7))

### [2.341.1](https://github.com/kiva/ui/compare/v2.341.0...v2.341.1) (2022-10-17)


### Bug Fixes

* only import braintree dropin on initialization in the client ([bf8cd43](https://github.com/kiva/ui/commit/bf8cd43d218eb4325f66b3407696e4abb9c2ecda))

## [2.341.0](https://github.com/kiva/ui/compare/v2.340.0...v2.341.0) (2022-10-17)


### Features

* migrate /lend/:id and lend/:category route from monolith ([4b1bd32](https://github.com/kiva/ui/commit/4b1bd32529887b22738bd6c4e5baa5fbec6b86c7))
* migrate fundedBorrowerProfile page into a component to BorrowerProfile page ([5ca6f0b](https://github.com/kiva/ui/commit/5ca6f0bd9d8e8c8ae2cc700802cc4c446eee148a))


### Bug Fixes

* address borrower profile loading issues ([e407111](https://github.com/kiva/ui/commit/e407111712cc56190fdc8ec30a5289a4f062b1df))
* basketItems and funded page conditional rendering ([8695da4](https://github.com/kiva/ui/commit/8695da4f5966ca9eaddc10498054b00edc6aba6d))
* include query params in redirect ([b9380bc](https://github.com/kiva/ui/commit/b9380bc9bc869669f9b79f2fce87ee8a4e3bfe59))
* redirect to lend-classic in prefetch ([71113ea](https://github.com/kiva/ui/commit/71113eae4c5b63f8963017dc17427a0e8b799302))
* remaining money showed in funded loan ([fde4aa6](https://github.com/kiva/ui/commit/fde4aa657c31ee95887d0bd2ffbab9daa4363253))
* remove unnecessary basket func ([616a324](https://github.com/kiva/ui/commit/616a324f6e1f05e5b8b0aa423209a0ea4981d815))
* remove unused code ([4232146](https://github.com/kiva/ui/commit/423214625557b21436055e9e190e26facaea4569))
* solve conflicts ([e1237b6](https://github.com/kiva/ui/commit/e1237b639470d5b6a7041a929ffeea54e866e982))
* solve conflicts ([754a1f7](https://github.com/kiva/ui/commit/754a1f732b0721d2d5800b536a31787f488f6310))
* solve conflicts ([ea4e00a](https://github.com/kiva/ui/commit/ea4e00aa73728abc0189d7de900ec93fbf02518f))
* solve conflicts ([353261d](https://github.com/kiva/ui/commit/353261dd0a12565a3baaf53e1e7e29d3662e82a8))
* update fundedBorrowerProfile and routes ([97f86da](https://github.com/kiva/ui/commit/97f86dae0bfd51ad35cfe1d147ee5fbd3f311ad7))
* validate loan status is fundraising ([4a8a691](https://github.com/kiva/ui/commit/4a8a691df1a7f0908cb5934b7c4bea9404dabdb9))

## [2.340.0](https://github.com/kiva/ui/compare/v2.339.0...v2.340.0) (2022-10-17)


### Features

* async component prefetch support ([e48e8f2](https://github.com/kiva/ui/commit/e48e8f2f27a9fe177996520e78574ea95a45673f))
* delay loading of popper.js until needed ([41e518f](https://github.com/kiva/ui/commit/41e518f6a845ccc7b9173ce515a3fa7a7907d8e4))


### Bug Fixes

* default group required to avoid duplicating modules ([df99938](https://github.com/kiva/ui/commit/df99938092ab94f67a3bc86d4f715381cfe66b38))
* drop lodash usage in KvAuth0 ([99bbe78](https://github.com/kiva/ui/commit/99bbe7844a65f2f7dcaaed993646f209e5e1aed2))

## [2.339.0](https://github.com/kiva/ui/compare/v2.338.0...v2.339.0) (2022-10-17)


### Features

* personalized welcome message for help me choose exp ([5fb5225](https://github.com/kiva/ui/commit/5fb5225f7fa1331716bc4e97cf6ff339cbdf3b59))

## [2.338.0](https://github.com/kiva/ui/compare/v2.337.0...v2.338.0) (2022-10-17)


### Features

* quick filters tracking ([13d64d4](https://github.com/kiva/ui/commit/13d64d4918be01080727e8db5c6e1159e95ca847))


### Bug Fixes

* add activity id ([8d164fe](https://github.com/kiva/ui/commit/8d164fe1bf895944f1a076b59818f31637ac702c))
* remove line change ([f6a1d7c](https://github.com/kiva/ui/commit/f6a1d7c4d2eec751f1accdb5f9a67000a68ff5c4))
* update tracking ([b4ea410](https://github.com/kiva/ui/commit/b4ea410531c967df5b988d6931be4dcbb0384d3d))

## [2.337.0](https://github.com/kiva/ui/compare/v2.336.0...v2.337.0) (2022-10-14)


### Features

* copy updated for auto lending increment dropdown ([812fc01](https://github.com/kiva/ui/commit/812fc01a61b3301ae77d79ec125ffcc95c55594a))


### Bug Fixes

* images aren't showing up on cc page for production build ([a9bf309](https://github.com/kiva/ui/commit/a9bf30999159a8f074b614ef344d29adba6cb081))

## [2.336.0](https://github.com/kiva/ui/compare/v2.335.0...v2.336.0) (2022-10-14)


### Features

* ui and logic improvements added to quick filters exp ([edbee6e](https://github.com/kiva/ui/commit/edbee6e89d30650a778c1cf22ebe5898103cb1d4))

## [2.335.0](https://github.com/kiva/ui/compare/v2.334.0...v2.335.0) (2022-10-13)


### Features

* kiva classic loan card ([9927537](https://github.com/kiva/ui/commit/9927537966443a71a6f7a338fadc1f7962c460f7))
* kiva classic loan card in cc landing pages ([1fe854b](https://github.com/kiva/ui/commit/1fe854b896a2e520f04709ab8fa10cdeb624076c))
* swap loan row out for kiva classic loan row ([06b60e8](https://github.com/kiva/ui/commit/06b60e806068294a6c4de9d80fe1cea7c2e436a3))


### Bug Fixes

* error in ref string ([bad3ab1](https://github.com/kiva/ui/commit/bad3ab1eb4355d73617d9208da7529c27091ec97))
* fixing nits ([ec30d81](https://github.com/kiva/ui/commit/ec30d813edf0d0505f42bf13919457bbf5927c6b))
* getting grid loan cards working + bug fixes ([41410df](https://github.com/kiva/ui/commit/41410dff4701a826527ed03450bf8d76921a625f))
* handling event emission for showing loan details ([81733f8](https://github.com/kiva/ui/commit/81733f87314901bd893447a0927e4c347ef7736b))

## [2.334.0](https://github.com/kiva/ui/compare/v2.333.0...v2.334.0) (2022-10-13)


### Features

* loans grid was break in two on category page to include the help me choose wrapper ([13b5342](https://github.com/kiva/ui/commit/13b534203c6a08bc0e89b16141f28eec4dd3d3ea))


### Bug Fixes

* all loans parameter fixed ([feed05d](https://github.com/kiva/ui/commit/feed05d5ec8463aa5acd294d71a3e31fcb5c1bb8))

## [2.333.0](https://github.com/kiva/ui/compare/v2.332.1...v2.333.0) (2022-10-13)


### Features

* sort by on quick filters and reset ([764d177](https://github.com/kiva/ui/commit/764d177de6e8b12854dd2a77fe44d069858cdde2))


### Bug Fixes

* update min width to show full sort by txt ([c68fc09](https://github.com/kiva/ui/commit/c68fc09d6167e7e646dd21e1900bee765fcbb0ba))

### [2.332.1](https://github.com/kiva/ui/compare/v2.332.0...v2.332.1) (2022-10-13)


### Bug Fixes

* mobile styling issues for various part of eco_challenge ([75a4e1c](https://github.com/kiva/ui/commit/75a4e1c6e9b3b65debd5668e0a92af6765327774))

## [2.332.0](https://github.com/kiva/ui/compare/v2.331.0...v2.332.0) (2022-10-12)


### Features

* distribution model filter to new loan filter page, abstracted radio button group filter ([3f5c139](https://github.com/kiva/ui/commit/3f5c13998fb21c743cee49c96dc86e7a7d9ef9bf))


### Bug Fixes

* made all loans title configurable on new radio button group filter ([ad5c326](https://github.com/kiva/ui/commit/ad5c326f34295986ffcd59a6c3e98bac855b79a0))
* moved loan distribution filter outside of accordion and above advanced filters ([9c2b823](https://github.com/kiva/ui/commit/9c2b8232485749675c894ad030dd4941e0b75735))

## [2.331.0](https://github.com/kiva/ui/compare/v2.330.1...v2.331.0) (2022-10-12)


### Features

* add flag when data is completely loaded for optimizely experiments ([8573c95](https://github.com/kiva/ui/commit/8573c956f161d12393b5ef48dd65dfbae6a49f2a))
* get thankspage data using window object ([e3df8ee](https://github.com/kiva/ui/commit/e3df8eec35ff106bd85e85e7ad29a254aeb7ae69))

### [2.330.1](https://github.com/kiva/ui/compare/v2.330.0...v2.330.1) (2022-10-11)


### Bug Fixes

* enable some traffic to landing pages in lighthouse for ui and cps comparison ([0797568](https://github.com/kiva/ui/commit/079756820e1261fac996dd1c7c466c6d88759f89))

## [2.330.0](https://github.com/kiva/ui/compare/v2.329.0...v2.330.0) (2022-10-11)


### Features

* help me choose feature setup added to category page ([dd72543](https://github.com/kiva/ui/commit/dd7254342ebc9db69fade09d40fde2cba98e7f5e))

## [2.329.0](https://github.com/kiva/ui/compare/v2.328.0...v2.329.0) (2022-10-11)


### Features

* display filtered category loans for quick filters ([d13040c](https://github.com/kiva/ui/commit/d13040c59f5e63ea1567e3c97abc5ca5484ba8f0))
* update category pages to show selected quick filters ([8cafb3f](https://github.com/kiva/ui/commit/8cafb3f94577851c37762c70322e7eda7d412f43))


### Bug Fixes

* merge conflicts ([29ffb5d](https://github.com/kiva/ui/commit/29ffb5d97b30eb681ac3655efbc00e6897bd089c))
* pr comments ([0e6995b](https://github.com/kiva/ui/commit/0e6995b3302d85a4669e809407088078e976c708))
* unit tests ([a6d01c2](https://github.com/kiva/ui/commit/a6d01c23986a688286a0251ac35be1392b263df3))

## [2.328.0](https://github.com/kiva/ui/compare/v2.327.0...v2.328.0) (2022-10-11)


### Features

* add support for direct or partner for loan card fragment ([a9ae904](https://github.com/kiva/ui/commit/a9ae9045e40fb15e8fc1fcacea9d738fb88d1ef0))
* use loanCardFields fragment for kiva classic basic loan card ([1ef9ead](https://github.com/kiva/ui/commit/1ef9ead8501222c3afde68eb6edc3f5b4fefac24))

## [2.327.0](https://github.com/kiva/ui/compare/v2.326.0...v2.327.0) (2022-10-11)


### Features

* new badge for quick filter experiment was added ([18effb8](https://github.com/kiva/ui/commit/18effb80ccbdf769fdc7e0570eec1e2e8557de59))

## [2.326.0](https://github.com/kiva/ui/compare/v2.325.0...v2.326.0) (2022-10-10)


### Features

* add origin query param to lbc eco refactor ([1a28f6e](https://github.com/kiva/ui/commit/1a28f6e6d57d7b11314f3ae1f3619eab7915df5e))

## [2.325.0](https://github.com/kiva/ui/compare/v2.324.1...v2.325.0) (2022-10-10)


### Features

* copy change on eco thanks page ([abc2415](https://github.com/kiva/ui/commit/abc2415f14495fff03952bab687c3945052eaaff))

### [2.324.1](https://github.com/kiva/ui/compare/v2.324.0...v2.324.1) (2022-10-10)


### Bug Fixes

* add flss origin constants and use in all flss queries ([060d7a3](https://github.com/kiva/ui/commit/060d7a3e3a688cb57391b5da3a256c2a76851733))
* pass query origin context on all flss queries ([21c89ba](https://github.com/kiva/ui/commit/21c89ba5a3eed4fe0fe9953d0820699b229627c5))

## [2.324.0](https://github.com/kiva/ui/compare/v2.323.0...v2.324.0) (2022-10-07)


### Features

* add event tracking for eco challenge confirmation modal ([d0c872f](https://github.com/kiva/ui/commit/d0c872fce3981dd8689b9b40f0185cd718c28f84))

## [2.323.0](https://github.com/kiva/ui/compare/v2.322.0...v2.323.0) (2022-10-07)


### Features

* extend FLSS exp now pulled ([beba440](https://github.com/kiva/ui/commit/beba4401e9094800e8cf500688a768041161de1d))

## [2.322.0](https://github.com/kiva/ui/compare/v2.321.0...v2.322.0) (2022-10-07)


### Features

* tag loan search filter ([02861f5](https://github.com/kiva/ui/commit/02861f541628c2d9f697d20e33a2711a2c1e4356))
* updated loan map for tagId ([8a571d1](https://github.com/kiva/ui/commit/8a571d10064f46be9b9aea61406b9e1a587c1687))


### Bug Fixes

* updated map prop ([40367fc](https://github.com/kiva/ui/commit/40367fcff414ad55f7bf848f1019ea0a04d86c2d))

## [2.321.0](https://github.com/kiva/ui/compare/v2.320.1...v2.321.0) (2022-10-06)


### Features

* new advanced filters entrypoint was added for quick filters experiment ([a112703](https://github.com/kiva/ui/commit/a112703e73d52fed342f871908743b4b40b9eb67))

### [2.320.1](https://github.com/kiva/ui/compare/v2.320.0...v2.320.1) (2022-10-06)


### Bug Fixes

* fix amend to previous commit ([3213d36](https://github.com/kiva/ui/commit/3213d3600deb9ed7d967b7ec91f1a9cc42b46664))

## [2.320.0](https://github.com/kiva/ui/compare/v2.319.0...v2.320.0) (2022-10-06)


### Features

* remove querying for category info again for single category carousel ([1f9f0bc](https://github.com/kiva/ui/commit/1f9f0bc33a07378a203d5fb9122ba7f290b77c6e))

## [2.319.0](https://github.com/kiva/ui/compare/v2.318.1...v2.319.0) (2022-10-06)


### Features

* new location selector was added for quick filters experiment ([fa44fb1](https://github.com/kiva/ui/commit/fa44fb1b5d9d501d0d8d2e7eda368a20d7f7ca9c))

### [2.318.1](https://github.com/kiva/ui/compare/v2.318.0...v2.318.1) (2022-10-05)


### Bug Fixes

* remove cc/kiva-universal from dev lighthouse ([5cbd50d](https://github.com/kiva/ui/commit/5cbd50dcf77c674671fd17ed525ba9b820416397))

## [2.318.0](https://github.com/kiva/ui/compare/v2.317.6...v2.318.0) (2022-10-05)


### Features

* advanced filters accordion ([ea4df58](https://github.com/kiva/ui/commit/ea4df58f4d241857e0de5bd295f25a21e4581fe0))

### [2.317.6](https://github.com/kiva/ui/compare/v2.317.5...v2.317.6) (2022-10-05)


### Bug Fixes

* redirect to eco thanks page on eco checkout ([654c37c](https://github.com/kiva/ui/commit/654c37c31a40ac44848636ef98df9bc625e29ca3))


### Reverts

* Revert "fix: eco challenge thanks redirect" ([68fabe7](https://github.com/kiva/ui/commit/68fabe78597dd30cfb4b9f9f98a98ca2873f5843))

### [2.317.5](https://github.com/kiva/ui/compare/v2.317.4...v2.317.5) (2022-10-05)


### Bug Fixes

* computed property warning on checkoutpage ([5a78f83](https://github.com/kiva/ui/commit/5a78f83a6ea05c6ea96a3c4c0e129ac35ede9794))

### [2.317.4](https://github.com/kiva/ui/compare/v2.317.3...v2.317.4) (2022-10-04)


### Bug Fixes

* update prod lighthouse route for cps homepage ([0735e0a](https://github.com/kiva/ui/commit/0735e0a4f02044c10e9654b9ebe6175c5497ce7e))

### [2.317.3](https://github.com/kiva/ui/compare/v2.317.2...v2.317.3) (2022-10-04)


### Bug Fixes

* hasOptOut should be false when kvgdpr cookie does not exist ([bbe6d83](https://github.com/kiva/ui/commit/bbe6d83ba8d618e3b1ede3614c5d5f0f1500fc8f))
* use separate cached strings for opt-in and opt-out script tags ([b4dd6c6](https://github.com/kiva/ui/commit/b4dd6c6b2495d98dfbea861007dbd476c3439c97))

### [2.317.2](https://github.com/kiva/ui/compare/v2.317.1...v2.317.2) (2022-10-04)


### Bug Fixes

* eco challenge thanks redirect ([2bada70](https://github.com/kiva/ui/commit/2bada70a35235c0938bd5c317ad1cde7142c9f21))

### [2.317.1](https://github.com/kiva/ui/compare/v2.317.0...v2.317.1) (2022-10-04)


### Bug Fixes

* update cps temporary homepage route ([d1c08c6](https://github.com/kiva/ui/commit/d1c08c629c066b470121f611c26ee70095709273))

## [2.317.0](https://github.com/kiva/ui/compare/v2.316.1...v2.317.0) (2022-10-03)


### Features

* setup experiment scaffold to gate new flss filter additions ([a04aaed](https://github.com/kiva/ui/commit/a04aaeda60c4ceec3bf7c76a12c947d2235b80d7))

### [2.316.1](https://github.com/kiva/ui/compare/v2.316.0...v2.316.1) (2022-09-30)


### Bug Fixes

* gate lightboxes + contained component initialization, guard ref method calls ([6df76e5](https://github.com/kiva/ui/commit/6df76e57cae730a14ab23ce0201ef16c0d58b49e))

## [2.316.0](https://github.com/kiva/ui/compare/v2.315.0...v2.316.0) (2022-09-30)


### Features

* modify contentful content for donate route ([9b024cf](https://github.com/kiva/ui/commit/9b024cf2f750f4266d471a92c7684671757e7e25))

## [2.315.0](https://github.com/kiva/ui/compare/v2.314.3...v2.315.0) (2022-09-30)


### Features

* gender dropdown ui for quick filters ([5355e57](https://github.com/kiva/ui/commit/5355e574ce51548a4e7118087df94ca2c4b016e4))


### Bug Fixes

* update file structure and add conditional ([d756576](https://github.com/kiva/ui/commit/d7565763cc67c5c1a55264fe10ce368a8ed41932))

### [2.314.3](https://github.com/kiva/ui/compare/v2.314.2...v2.314.3) (2022-09-30)


### Bug Fixes

* revert module type for routes file, pass expFragment to prevent importing into routes.js ([31fc1a8](https://github.com/kiva/ui/commit/31fc1a8607461aadef62cc6bd7da4f7f9a30f957))

### [2.314.2](https://github.com/kiva/ui/compare/v2.314.1...v2.314.2) (2022-09-30)


### Bug Fixes

* prefetch ContentfulPage in Homepage if not redirecting ([81f4653](https://github.com/kiva/ui/commit/81f465302d563325590644230b41f5d4dda0a1ea))

### [2.314.1](https://github.com/kiva/ui/compare/v2.314.0...v2.314.1) (2022-09-30)


### Bug Fixes

* ensure client is passed to all prefetch variable functions ([b315348](https://github.com/kiva/ui/commit/b315348e1a39836bc5d86e06b34c3dec52426345))
* fixed flash loading home page experiment ([4d23fa8](https://github.com/kiva/ui/commit/4d23fa867e7771eeec381b451899eaaa0b913798))

## [2.314.0](https://github.com/kiva/ui/compare/v2.313.0...v2.314.0) (2022-09-29)


### Features

* add donate/supportkiva duplicate page ([3da7e65](https://github.com/kiva/ui/commit/3da7e65c5b631a071a0e9104f4c0c8315276d6d4))

## [2.313.0](https://github.com/kiva/ui/compare/v2.312.1...v2.313.0) (2022-09-29)


### Features

* add how it works to LBC climate game page ([b8c7a45](https://github.com/kiva/ui/commit/b8c7a451bce31a91fe205d94b2fa2260e8c1db04))

### [2.312.1](https://github.com/kiva/ui/compare/v2.312.0...v2.312.1) (2022-09-29)


### Bug Fixes

* temporarily remove /cc/kiva-universal from lighthouse as it is failing on most mobile loads ([28b13e5](https://github.com/kiva/ui/commit/28b13e561112c856f11746cfd5abebd728b7ac13))

## [2.312.0](https://github.com/kiva/ui/compare/v2.311.0...v2.312.0) (2022-09-28)


### Features

* add home page experiment setup and tracking ([d38dc97](https://github.com/kiva/ui/commit/d38dc9712da5fb7d0f93301d5422ab846cdc413b))
* wip new experiment setup ([875de98](https://github.com/kiva/ui/commit/875de98b729c4852f71353286a7b16a2f418c2f1))


### Bug Fixes

* added version 'c' validation ([507eed9](https://github.com/kiva/ui/commit/507eed9634a06970e55671a4f79fb03c43d514a1))
* fix issues with tracking event function ([57e6654](https://github.com/kiva/ui/commit/57e6654a05fb2c586ca9cbdc10aa093f2ca62d74))
* reduce time loading ([4a7dd59](https://github.com/kiva/ui/commit/4a7dd59f55c9b245371072c7efcb0da7a7c9f482))

## [2.311.0](https://github.com/kiva/ui/compare/v2.310.0...v2.311.0) (2022-09-28)


### Features

* options for quick filter dropdowns were added via utilities files ([300dab3](https://github.com/kiva/ui/commit/300dab3ce3a7d7d24bbc3a21a85b208899238da6))

## [2.310.0](https://github.com/kiva/ui/compare/v2.309.0...v2.310.0) (2022-09-28)


### Features

* add entry point experiment for the game challenge on lbc page ([0cb3d1b](https://github.com/kiva/ui/commit/0cb3d1b5e10f8a3adca17d97fc0fb7c424d35a26))

## [2.309.0](https://github.com/kiva/ui/compare/v2.308.1...v2.309.0) (2022-09-27)


### Features

* enable order of sections to be swapped according to order specified in contentful ([3379c50](https://github.com/kiva/ui/commit/3379c50c53a6ed97d44ca3527818e37752f3a0b2))


### Bug Fixes

* don't include testimonial cards in contentful render loop for cc pages ([0e0d85f](https://github.com/kiva/ui/commit/0e0d85f1c31a5484dcd53d083cdc411a81373557))

### [2.308.1](https://github.com/kiva/ui/compare/v2.308.0...v2.308.1) (2022-09-27)


### Bug Fixes

* copy update 3 for MARS-260 ([e9af2e9](https://github.com/kiva/ui/commit/e9af2e96637ee96721b7b1dd9eb87cae0a10eebf))

## [2.308.0](https://github.com/kiva/ui/compare/v2.307.0...v2.308.0) (2022-09-27)


### Features

* use flss for lbc page for eco game categories ([5874907](https://github.com/kiva/ui/commit/58749075aa701f6c9fcac693df3973105c5bf909))

## [2.307.0](https://github.com/kiva/ui/compare/v2.306.0...v2.307.0) (2022-09-26)


### Features

* ask consent for marketing emails when getting TOU agreement MARS-260 ([23256fc](https://github.com/kiva/ui/commit/23256fc298fc9f4b9c313ee3c332c3a8c73da06f))


### Bug Fixes

* news consent label copy update 2 MARS-260 ([ff27c75](https://github.com/kiva/ui/commit/ff27c750b5fed4217d2cfe1de149d9a1f719a8de))
* news consent label copy update MARS-260 ([62c6bf1](https://github.com/kiva/ui/commit/62c6bf1ccd3588a31d6a880ba9738b515231f0c3))

## [2.306.0](https://github.com/kiva/ui/compare/v2.305.1...v2.306.0) (2022-09-26)


### Features

* add new darkmint theme ([5827fa2](https://github.com/kiva/ui/commit/5827fa2d571b705a905ce74843791dbcfdecfd28))


### Bug Fixes

* update package.json file ([2780295](https://github.com/kiva/ui/commit/2780295a832ec2b88b1ea5a2c648f61e51e9eb7a))

### [2.305.1](https://github.com/kiva/ui/compare/v2.305.0...v2.305.1) (2022-09-26)


### Bug Fixes

* added media query to fix crashing on category loan cards ([b85b1a9](https://github.com/kiva/ui/commit/b85b1a98413b37fb7947832707e332a65e0577de))

## [2.305.0](https://github.com/kiva/ui/compare/v2.304.0...v2.305.0) (2022-09-26)


### Features

* a/b test for quick filters ([aace546](https://github.com/kiva/ui/commit/aace5461d04935654cac4e41f2fa31bd6c068dc7))


### Bug Fixes

* add exclusions ([2bd85c1](https://github.com/kiva/ui/commit/2bd85c1f660152de10c7558e970527d5c7f4407b))

## [2.304.0](https://github.com/kiva/ui/compare/v2.303.0...v2.304.0) (2022-09-26)


### Features

* add game confirmation modal when adding to basket on borrower profile ([c689b24](https://github.com/kiva/ui/commit/c689b24df2e8aaf2ee78fc39eaf0b1b63f30d64a))

## [2.303.0](https://github.com/kiva/ui/compare/v2.302.1...v2.303.0) (2022-09-23)


### Features

* move optimizely script load to server injection and setup optimizely event sequence ([c8f0da5](https://github.com/kiva/ui/commit/c8f0da52a68b24e8337def4e6a4e2fe86144dc1a))


### Bug Fixes

* ensure optimizely isn't loaded when Kiva level opt-opt is present ([d647f88](https://github.com/kiva/ui/commit/d647f88d5f990dcac15271673e67dfcd3c4490a1))

### [2.302.1](https://github.com/kiva/ui/compare/v2.302.0...v2.302.1) (2022-09-23)


### Bug Fixes

* change conditional rendered order of upsell text ([43295d1](https://github.com/kiva/ui/commit/43295d19deb09082ec9b7fdc72965d1ac0939bb1))

## [2.302.0](https://github.com/kiva/ui/compare/v2.301.1...v2.302.0) (2022-09-23)


### Features

* add query param to force dynamic upsells + tracking ([7ef24b0](https://github.com/kiva/ui/commit/7ef24b047135e731574e4f34f0de8f9a1ea2004f))


### Bug Fixes

* additional check ([01e6e5e](https://github.com/kiva/ui/commit/01e6e5e82b30a954c6f427544132a84dcae1f676))

### [2.301.1](https://github.com/kiva/ui/compare/v2.301.0...v2.301.1) (2022-09-23)


### Bug Fixes

* handle addToBasket event on expanded detailed loan card ([6ee1f3b](https://github.com/kiva/ui/commit/6ee1f3be57f8d92ead16fc33d4b257b43b4f1073))
* refresh items in basket after add to basket on lbc ([d5129b8](https://github.com/kiva/ui/commit/d5129b8f9b0a983b5b2fd2c81cce6159a1ad36b9))

## [2.301.0](https://github.com/kiva/ui/compare/v2.300.2...v2.301.0) (2022-09-22)


### Features

* render faq component ([46e9d00](https://github.com/kiva/ui/commit/46e9d003a9ae3ba0fb16bec6d7fb25be9113345c))


### Bug Fixes

* format content type and faq styles ([fcefe4e](https://github.com/kiva/ui/commit/fcefe4e3a6ff2592625adfbc6825e16de77e6553))

### [2.300.2](https://github.com/kiva/ui/compare/v2.300.1...v2.300.2) (2022-09-22)


### Bug Fixes

* items in basket array was fixed for action button in mfi loan card ([f395de8](https://github.com/kiva/ui/commit/f395de8ac7dfa579ed4b1e215f8806170df17523))

### [2.300.1](https://github.com/kiva/ui/compare/v2.300.0...v2.300.1) (2022-09-22)


### Bug Fixes

* remove deleted saved search from saved search display ([c145c88](https://github.com/kiva/ui/commit/c145c880e08dfefae360e988338324f2621b4150))

## [2.300.0](https://github.com/kiva/ui/compare/v2.299.2...v2.300.0) (2022-09-22)


### Features

* code for optional choice in mg page was removed ([9a87e80](https://github.com/kiva/ui/commit/9a87e80129520507fd186c2e9f092dc4d78f0f70))

### [2.299.2](https://github.com/kiva/ui/compare/v2.299.1...v2.299.2) (2022-09-21)


### Bug Fixes

* update KivaMultiCategoryGrid component on story book ([7dd77c9](https://github.com/kiva/ui/commit/7dd77c975e791dfa300922db089ad298611278bc))

### [2.299.1](https://github.com/kiva/ui/compare/v2.299.0...v2.299.1) (2022-09-21)


### Bug Fixes

* activate excludeIds on category service query and include hero loan id ([050c16f](https://github.com/kiva/ui/commit/050c16fda7057869e599a3369aff8c6fe6ec42b2))
* ensure RecLoanChannel is blended into Category Service channels + guard excludeIds process ([168ce26](https://github.com/kiva/ui/commit/168ce26804c3962cfbcaa54911ae4ce2bd72fc1f))
* re-instate excludeIds in lazy loaded loan channel queries ([f10da41](https://github.com/kiva/ui/commit/f10da41f10ea008be97ff948b608f8fc879e4a4e))

## [2.299.0](https://github.com/kiva/ui/compare/v2.298.0...v2.299.0) (2022-09-21)


### Features

* set green text for marks within rich text ([7dabd04](https://github.com/kiva/ui/commit/7dabd0402856c232415be7530330a36c494e6a37))


### Bug Fixes

* add semicolon to style ([340b668](https://github.com/kiva/ui/commit/340b668499c3a11e1ae74f78f100b1fb4b2eb9fa))

## [2.298.0](https://github.com/kiva/ui/compare/v2.297.0...v2.298.0) (2022-09-21)


### Features

* add new home page loan card carousel and categories ([c6d2379](https://github.com/kiva/ui/commit/c6d23791db88118bca25740c598710af7644b652))
* small updates ([d53ba11](https://github.com/kiva/ui/commit/d53ba11a82cf0bd78379e0b8720fc3ef87843a68))
* small updates ([9ccb542](https://github.com/kiva/ui/commit/9ccb54224abb65f936bf26795a904a9d57d1ccec))
* small updates ([b5218a4](https://github.com/kiva/ui/commit/b5218a44e02cccf3240a15868010277b3b979f34))


### Bug Fixes

* combine NewHomeLoanCardsCarousel and KivaCategoryCarousel components into 1 component ([094a2fb](https://github.com/kiva/ui/commit/094a2fbc2153dda484b1d854fd6e2d322bb73fe5))
* merge with main branch ([bd10822](https://github.com/kiva/ui/commit/bd1082211396a6fb064048c54af96e2b74fe2dac))
* more adjustments on new home page stuff ([2bfc9ef](https://github.com/kiva/ui/commit/2bfc9ef4cfad7a5210c8c049736ec2885c0d8ce6))
* remove grid classed and add KvGrid component ([93f8ce5](https://github.com/kiva/ui/commit/93f8ce54db7edda86c202f2ad147da7274729bb1))
* resolve conflicts ([847a9c2](https://github.com/kiva/ui/commit/847a9c291289e207d6fdee651030ccb18eb02531))
* resolved conflicts ([8017e83](https://github.com/kiva/ui/commit/8017e83d2593a1d500770b154b06479d6cad6968))
* restore carousel on category section ([4da45f2](https://github.com/kiva/ui/commit/4da45f2557fd0d8fed886ffa1906df85b965ea68))
* revert changes on NewHomeLoansByCategoryGrid.vue component ([b347e5e](https://github.com/kiva/ui/commit/b347e5e5eb5b131d7314c048e72029870c481e67))
* styling adjustments ([72ab490](https://github.com/kiva/ui/commit/72ab4901b27bb2cfdbea31989e410ac77265b3d8))
* styling and loading improvements ([5b28294](https://github.com/kiva/ui/commit/5b282943cc8d4604791a8d51a55650beffdb405f))

## [2.297.0](https://github.com/kiva/ui/compare/v2.296.0...v2.297.0) (2022-09-21)


### Features

* dynamic upsell when no loans under $50 ([132e906](https://github.com/kiva/ui/commit/132e90695517bf2c860c4c8da1e76ed8e6b538e2))


### Bug Fixes

* add check for exp ([2cdd63d](https://github.com/kiva/ui/commit/2cdd63d3011627a720380713076e9070e5125741))

## [2.296.0](https://github.com/kiva/ui/compare/v2.295.1...v2.296.0) (2022-09-21)


### Features

* dynamic upsells a/b test ([dcd2bdb](https://github.com/kiva/ui/commit/dcd2bdb618fb1bb3432705d60341d6fbad0964b8))


### Bug Fixes

* merge conflicts with main ([13b0410](https://github.com/kiva/ui/commit/13b041016e4daf1ecc647ae791e3ab22063ac2a9))
* remove extra char ([af18d14](https://github.com/kiva/ui/commit/af18d14089870b4454685e66efce1671ac32dbb5))
* update id name ([db0b02b](https://github.com/kiva/ui/commit/db0b02b52f03b44fdd4140d19e551434849937f4))

### [2.295.1](https://github.com/kiva/ui/compare/v2.295.0...v2.295.1) (2022-09-21)


### Bug Fixes

* update prod lighthouse cron to run at midnight, 8am + 4pm UTC ([c775277](https://github.com/kiva/ui/commit/c7752772acf2947cb04b80ccd4b22e2bc29e948f))

## [2.295.0](https://github.com/kiva/ui/compare/v2.294.0...v2.295.0) (2022-09-21)


### Features

* some tracking events were updated in mfi loan card ([fba6cf0](https://github.com/kiva/ui/commit/fba6cf0abadc8d89f33ba94d02f7a1eca767a040))

## [2.294.0](https://github.com/kiva/ui/compare/v2.293.0...v2.294.0) (2022-09-20)


### Features

* add carousels of missing categories in eco challenge thanks page ([c5481ef](https://github.com/kiva/ui/commit/c5481efbc937ba40235afdb8fea9dbf5459b3562))

## [2.293.0](https://github.com/kiva/ui/compare/v2.292.0...v2.293.0) (2022-09-20)


### Features

* tracking added to learn more link in mfi hero ([a49f9e6](https://github.com/kiva/ui/commit/a49f9e6b6ca1312d0dd04a637775b70462df69ab))

## [2.292.0](https://github.com/kiva/ui/compare/v2.291.0...v2.292.0) (2022-09-20)


### Features

* loans carousel was added to mfi experiment ([547ff6b](https://github.com/kiva/ui/commit/547ff6beb052114b0eb809bccf352cd5925e2c93))


### Bug Fixes

* code clean up for mfi experiment ([85bc651](https://github.com/kiva/ui/commit/85bc651a294073cc4f90dc3a9d986f5cd7390423))

## [2.291.0](https://github.com/kiva/ui/compare/v2.290.1...v2.291.0) (2022-09-20)


### Features

* allow two cols and second button ([ca6faca](https://github.com/kiva/ui/commit/ca6faca0242b7f969f9f7c9f874b2afbb018be4c))
* create hero classic story and show elements in grid ([3b6665a](https://github.com/kiva/ui/commit/3b6665aa098128111e0a34eb88a426140fdff643))
* show a grid with two genericContentBlocks ([94e44bf](https://github.com/kiva/ui/commit/94e44bf509bda8abd141ef939570dd79c4c7e4fa))


### Bug Fixes

* conditional grid and bottom margin when does not appeared ([ec08979](https://github.com/kiva/ui/commit/ec0897907fbe2990a62151b60c7b4d4231143ced))
* find last button workaround ([c5da7be](https://github.com/kiva/ui/commit/c5da7be69905614e6ff9d5a972c3436bc36598d1))
* findLast not function error ([a96b77b](https://github.com/kiva/ui/commit/a96b77b580ee7f259e95f9bf15e2eebe793e8e53))
* no return in map on false condition ([30c2789](https://github.com/kiva/ui/commit/30c2789c2051b65e150c35385191670374fab328))
* set bodyColumns to null for validation and remove unnecesary content block for grid ([25c8a19](https://github.com/kiva/ui/commit/25c8a1917c1374a7897771da450f1b802e197c21))

### [2.290.1](https://github.com/kiva/ui/compare/v2.290.0...v2.290.1) (2022-09-20)


### Bug Fixes

* turn off cluster mode for audit ([9f18a6a](https://github.com/kiva/ui/commit/9f18a6ae617c824fadec29cca04444be6e7ff045))
* update audit memcached endpoint to config endpoint ([2bebd12](https://github.com/kiva/ui/commit/2bebd123ed8f56ee38def5b258dd953558dea385))
* update to audit specific memcached cluster ([4c458a3](https://github.com/kiva/ui/commit/4c458a3f5bc99d100a3d1107b16867dd3e01eeb7))

## [2.290.0](https://github.com/kiva/ui/compare/v2.289.1...v2.290.0) (2022-09-20)


### Features

* eco challenge thanks page ([92f5e9f](https://github.com/kiva/ui/commit/92f5e9f6e9b853c95ef67d19870f54b0a10becde))

### [2.289.1](https://github.com/kiva/ui/compare/v2.289.0...v2.289.1) (2022-09-20)


### Bug Fixes

* add other file extensions so [@vueuse](https://github.com/vueuse) modules can be found ([63af411](https://github.com/kiva/ui/commit/63af411ad1621e4b090cb973371efd1e9024e622))

## [2.289.0](https://github.com/kiva/ui/compare/v2.288.1...v2.289.0) (2022-09-19)


### Features

* replace swashie how kiva works section with kiva classic rich text items ([2cacfc4](https://github.com/kiva/ui/commit/2cacfc468f67896b816b6a412706a2ebbfb9491a))

### [2.288.1](https://github.com/kiva/ui/compare/v2.288.0...v2.288.1) (2022-09-19)


### Bug Fixes

* remove jump of content when toggling FAQs ([9d736b7](https://github.com/kiva/ui/commit/9d736b70816578ac6d1d8a75f5953e165e23a2b8))

## [2.288.0](https://github.com/kiva/ui/compare/v2.287.0...v2.288.0) (2022-09-16)


### Features

* theme controls for SectionWithBackgroundClassic ([76d6003](https://github.com/kiva/ui/commit/76d6003ef66660a8744bfaac03a4bb26ddf4c41b))


### Bug Fixes

* fill out doc block for themeName prop ([5c5ff60](https://github.com/kiva/ui/commit/5c5ff602b7d313c8818ad3f8c390c98a6df1a601))

## [2.287.0](https://github.com/kiva/ui/compare/v2.286.1...v2.287.0) (2022-09-16)


### Features

* add accordion secction component ([d8f2fbd](https://github.com/kiva/ui/commit/d8f2fbdcb466d22d862c20bf067fb5b0e1dccd1d))
* create frequently asked question story and add support for only one opened question ([8230c5a](https://github.com/kiva/ui/commit/8230c5ad273535e88769ff69a97599015e768eca))


### Bug Fixes

* revert unnecessary modified and created files ([7781233](https://github.com/kiva/ui/commit/7781233ec1661caa1eb2f180140bbbbe33c47a13))

### [2.286.1](https://github.com/kiva/ui/compare/v2.286.0...v2.286.1) (2022-09-16)


### Bug Fixes

* wire-up background and vertical padding controls to StoryCardCarousel MARS-247 ([6c19d9c](https://github.com/kiva/ui/commit/6c19d9cd5912f87f777b84e9f212b35420cfe101))

## [2.286.0](https://github.com/kiva/ui/compare/v2.285.0...v2.286.0) (2022-09-15)


### Features

* add share button to eco thanks page ([d3b0d17](https://github.com/kiva/ui/commit/d3b0d17d264f267fb02ef4915498cf79eba0252b))

## [2.285.0](https://github.com/kiva/ui/compare/v2.284.3...v2.285.0) (2022-09-14)


### Features

* thanks page eco challenge template ([8f7b9da](https://github.com/kiva/ui/commit/8f7b9dac8d7ae297fdeb1f1681860ec72362384a))

### [2.284.3](https://github.com/kiva/ui/compare/v2.284.2...v2.284.3) (2022-09-14)


### Bug Fixes

* add missing injections and props for new loans-by-category grid ([a8ed466](https://github.com/kiva/ui/commit/a8ed46642ab89d6114caf7d30c30b64686ab43af))

### [2.284.2](https://github.com/kiva/ui/compare/v2.284.1...v2.284.2) (2022-09-14)


### Bug Fixes

* remove commented out code in this config ([8f34378](https://github.com/kiva/ui/commit/8f34378ff06f9dca36ab15788e3b47d635a6a3dc))

### [2.284.1](https://github.com/kiva/ui/compare/v2.284.0...v2.284.1) (2022-09-14)


### Bug Fixes

* lint err ([8203bcc](https://github.com/kiva/ui/commit/8203bccf73f6e7495be5681ac5055d4187598556))
* show saved search notif when user changes filters ([010f607](https://github.com/kiva/ui/commit/010f6072809224919c922bed340e94213762b9c4))

## [2.284.0](https://github.com/kiva/ui/compare/v2.283.2...v2.284.0) (2022-09-14)


### Features

* add LoansByCategoryGrid as Content Group type ([bacf38e](https://github.com/kiva/ui/commit/bacf38e5100bf9a7708d195819a0c5a66d12fbff))

### [2.283.2](https://github.com/kiva/ui/compare/v2.283.1...v2.283.2) (2022-09-14)


### Bug Fixes

* comment out broken ref line ([611078e](https://github.com/kiva/ui/commit/611078e3bd4a9ed116f6f8f69ccd14573a49aa20))

### [2.283.1](https://github.com/kiva/ui/compare/v2.283.0...v2.283.1) (2022-09-13)


### Bug Fixes

* update lighthouse checkout step to gain visibility to ancestor hash ([1ab360f](https://github.com/kiva/ui/commit/1ab360f1da1eb0f55a139e3124655950895c9bdd))

## [2.283.0](https://github.com/kiva/ui/compare/v2.282.0...v2.283.0) (2022-09-13)


### Features

* new hompe page loan cards ([eb7a4b6](https://github.com/kiva/ui/commit/eb7a4b669ba40904c381ec395b1b7cc2515f3260))
* remove console.log ([5071a8d](https://github.com/kiva/ui/commit/5071a8d0d11a71db34a1e1209e5fa2a58e64e635))
* stylized carousel for Story Cards MARS-241 ([ea69e31](https://github.com/kiva/ui/commit/ea69e318bddfe43d64d9f1be877d475bbf8a03e8))
* update track event data ([dfaf354](https://github.com/kiva/ui/commit/dfaf354031b4c6199bb89cd2a0daae7883927a7c))


### Bug Fixes

* move styles to tailwind classes ([88920e7](https://github.com/kiva/ui/commit/88920e773bdeb97d1799f07dad595156037282ce))
* removed unnecessary css style ([31a49c0](https://github.com/kiva/ui/commit/31a49c0aeb51d692ac96f8302a86914d7fb0a190))

## [2.282.0](https://github.com/kiva/ui/compare/v2.281.5...v2.282.0) (2022-09-13)


### Features

* add custom button ([2108aa6](https://github.com/kiva/ui/commit/2108aa6a5b29c4f795e06ee16f15d9fc09c576b3))
* create new classic grid and selector ([feb4d95](https://github.com/kiva/ui/commit/feb4d957230298e4dfd9d4b9029dfa43286daaf4))
* split components and rename them ([f61aad1](https://github.com/kiva/ui/commit/f61aad18d86bb1a5c36486031bddcb209625862b))


### Bug Fixes

* button link and revert carousel interaction tracking ([01771a1](https://github.com/kiva/ui/commit/01771a1e273e6ee1200448967252484f2292eccc))
* eslint ([9846b47](https://github.com/kiva/ui/commit/9846b471c9c6d0bcab845e77141df06937ffaef3))
* eslint ([5585fde](https://github.com/kiva/ui/commit/5585fde25c9051f48a5101fbd15f39aecfd98d25))
* eslint ([e5e01bd](https://github.com/kiva/ui/commit/e5e01bd98c514647c5c9b3ac28c82ee6088d14f3))
* eslint ([70d2362](https://github.com/kiva/ui/commit/70d23627a7f9cde0802309222fa615ce1c153816))
* missing lib ([2f9ee8e](https://github.com/kiva/ui/commit/2f9ee8eff051c9ac232c26050d90000bf2166f9c))
* style eslint ([e71732e](https://github.com/kiva/ui/commit/e71732e872f4eeb25b84798d402e0fabe03fbb55))


### Reverts

* kvButton file ([bf8a85e](https://github.com/kiva/ui/commit/bf8a85e7f6a4f16b985ee3c01c338f882342d235))

### [2.281.5](https://github.com/kiva/ui/compare/v2.281.4...v2.281.5) (2022-09-10)


### Bug Fixes

* turn off algolia analytics ([23e4ee4](https://github.com/kiva/ui/commit/23e4ee40822394cd22d9b519e97d30c26e1206a6))

### [2.281.4](https://github.com/kiva/ui/compare/v2.281.3...v2.281.4) (2022-09-09)


### Bug Fixes

* double tracking fire was avoided when closing save search modal ([3f541dd](https://github.com/kiva/ui/commit/3f541ddaaa33429a532928114f22c2b3eac96bd6))

### [2.281.3](https://github.com/kiva/ui/compare/v2.281.2...v2.281.3) (2022-09-08)


### Bug Fixes

* copy updates to TOU page ([5a48e8a](https://github.com/kiva/ui/commit/5a48e8ae52a11c95afcdf24f7b4733d42b5d20f3))

### [2.281.2](https://github.com/kiva/ui/compare/v2.281.1...v2.281.2) (2022-09-07)


### Bug Fixes

* login url encode was fixed ([cfb595c](https://github.com/kiva/ui/commit/cfb595c9ebf0a6300e63abc3fbb9457182fff7c0))

### [2.281.1](https://github.com/kiva/ui/compare/v2.281.0...v2.281.1) (2022-09-07)


### Bug Fixes

* set root level id on loanCategoriesByLoanChannelIds query ([677e59d](https://github.com/kiva/ui/commit/677e59d942709615f24aa4a71de21e760ede759c))

## [2.281.0](https://github.com/kiva/ui/compare/v2.280.0...v2.281.0) (2022-09-07)


### Features

* setup experiment to use category service to drive lend by category rows ([e80d0ad](https://github.com/kiva/ui/commit/e80d0adeafd6628656cc920b986b89d45e1ac8d8))
* use category service for featured loan query ([21c13d5](https://github.com/kiva/ui/commit/21c13d5298da41271a960c0c822001d6b180e2a0))


### Bug Fixes

* clean up repeated code items and unused code ([b96debe](https://github.com/kiva/ui/commit/b96debe1794cf15d028afb2379edb96351ef40f7))
* ensure lazy load fetch works, check savedSearch loan count to apply prefetched category ([c47d99b](https://github.com/kiva/ui/commit/c47d99bc8f1323dc66f34721884d72d1d253aea4))
* remove loan channel reassignment in exted fetchMoreLoans method ([69f42e8](https://github.com/kiva/ui/commit/69f42e874373b973d8e7025622585a8a5924463d))

## [2.280.0](https://github.com/kiva/ui/compare/v2.279.2...v2.280.0) (2022-09-07)


### Features

* login url redirect was added to saved search feature ([84d86c1](https://github.com/kiva/ui/commit/84d86c19374d459614dbb88204665f7d618dd3f2))
* save search feature expanded to logged out users ([c48da85](https://github.com/kiva/ui/commit/c48da85834a99f1ec15166b19f669f572c45b646))


### Bug Fixes

* loginUrl setup for home page was removed ([d47da97](https://github.com/kiva/ui/commit/d47da9700b6972b114fcaafb7c5661c6a888e5e2))

### [2.279.2](https://github.com/kiva/ui/compare/v2.279.1...v2.279.2) (2022-09-07)


### Bug Fixes

* load head scripts before anything else ([cf7ebae](https://github.com/kiva/ui/commit/cf7ebaed95f4e74c476df6a871c028b20a8db9e9))

### [2.279.1](https://github.com/kiva/ui/compare/v2.279.0...v2.279.1) (2022-09-07)


### Bug Fixes

* add bool to hide notif when successful ([04eebad](https://github.com/kiva/ui/commit/04eebadd6315d224ec6b2e2ea0c6f73d59491157))
* update query str and tracking on new saved search ([9f515f1](https://github.com/kiva/ui/commit/9f515f1f3c7919b69a1b9a0a2d2df60f822c2182))

## [2.279.0](https://github.com/kiva/ui/compare/v2.278.0...v2.279.0) (2022-09-06)


### Features

* loan bundle experiment removed from lbc page ([8149c4d](https://github.com/kiva/ui/commit/8149c4d9fd7eae7134f47c534d370ba496a1e9bb))
* loan bundle experiment was removed from category page ([832f435](https://github.com/kiva/ui/commit/832f43521fbd1ddd3e2f4fdb539826056ffa867c))


### Bug Fixes

* merge conflicts ([e4d2231](https://github.com/kiva/ui/commit/e4d2231dd00891e96d026f60af5f9c3282e39f1b))

## [2.278.0](https://github.com/kiva/ui/compare/v2.277.1...v2.278.0) (2022-09-06)


### Features

* add new query param to force game experiment versions ([bcd8d95](https://github.com/kiva/ui/commit/bcd8d95b138d2c811060026bfbaecc5ff93198f7))

### [2.277.1](https://github.com/kiva/ui/compare/v2.277.0...v2.277.1) (2022-09-02)


### Bug Fixes

* update lighthouse config to include cms page server home test route ([f222720](https://github.com/kiva/ui/commit/f22272027530d65e985f551a079a502d41dc7b15))

## [2.277.0](https://github.com/kiva/ui/compare/v2.276.1...v2.277.0) (2022-09-01)


### Features

* contentful page route for homepage layouts ([0a3b52a](https://github.com/kiva/ui/commit/0a3b52add85ff2278891eb768955662143035f7e))

### [2.276.1](https://github.com/kiva/ui/compare/v2.276.0...v2.276.1) (2022-09-01)


### Bug Fixes

* hide empty categories on the eco experiment layout ([27bdb9b](https://github.com/kiva/ui/commit/27bdb9b0086b033d680cdbcaa9a2fffe32f9b206))

## [2.276.0](https://github.com/kiva/ui/compare/v2.275.2...v2.276.0) (2022-09-01)


### Features

* success message for saved search ([0e5468c](https://github.com/kiva/ui/commit/0e5468ce253ae5695c51adf48209cf397190bd44))


### Bug Fixes

* pr fixes and tracking update ([6f3b355](https://github.com/kiva/ui/commit/6f3b3555f5b71f25815951eab4afbd3f1a538415))

### [2.275.2](https://github.com/kiva/ui/compare/v2.275.1...v2.275.2) (2022-09-01)


### Bug Fixes

* typo and indentation removed on mfihero component ([00fb776](https://github.com/kiva/ui/commit/00fb77657509ce0493b4ee3376690cb44d402daf))

### [2.275.1](https://github.com/kiva/ui/compare/v2.275.0...v2.275.1) (2022-09-01)


### Bug Fixes

* combine loan channel pages to avoid issues with max limit 100 in prod ([be6fc73](https://github.com/kiva/ui/commit/be6fc73115758adc72499bf0ee923ac7eb4bd873))

## [2.275.0](https://github.com/kiva/ui/compare/v2.274.0...v2.275.0) (2022-09-01)


### Features

* game version of the eco friendly category page ([bdbcdfe](https://github.com/kiva/ui/commit/bdbcdfef27d067db960af825702c6537d6b84e95))

## [2.274.0](https://github.com/kiva/ui/compare/v2.273.0...v2.274.0) (2022-08-31)


### Features

* hero component for mfi recommendation was created ([8df8ac7](https://github.com/kiva/ui/commit/8df8ac7a8249630d82ffc2a1e544249a28047037))
* mfi experiment condition was added to lbc page section ([4ee90aa](https://github.com/kiva/ui/commit/4ee90aab28ceac93e4e9bf644351a71967b336c6))


### Bug Fixes

* fundacion pro mujer image was fixed to full width ([5968187](https://github.com/kiva/ui/commit/59681873138f60f3e7fc58abd64acd2ff9d4d674))

## [2.273.0](https://github.com/kiva/ui/compare/v2.272.0...v2.273.0) (2022-08-31)


### Features

* saved search modal ([3c68d19](https://github.com/kiva/ui/commit/3c68d19f4f1efcd079faad98a4b345ef7fcb16ab))


### Bug Fixes

* add cmt ([6cb56cf](https://github.com/kiva/ui/commit/6cb56cf785ca82107ac6d40befd4c0156bcab67a))
* add disabled state for button ([381bdd5](https://github.com/kiva/ui/commit/381bdd590f2ef1568e8684071f9609ea16e06564))
* add tracking ([62cbf31](https://github.com/kiva/ui/commit/62cbf311ca36168f5df9fd9f724b44631719ad3f))
* graphql mutation ([d933f51](https://github.com/kiva/ui/commit/d933f514e45a11d63d10f688698942cdb43e2d34))
* merge conflict; ([850095b](https://github.com/kiva/ui/commit/850095b8e06ee257a92e6d8e8025abe04c3dfe08))
* pr fixes ([1efe54b](https://github.com/kiva/ui/commit/1efe54b11d46aaf22c101239bd9783ce39c3d308))
* remove unnecessary change ([ee80165](https://github.com/kiva/ui/commit/ee80165b289417043dbbbdef88c5bff24ae37f76))
* update query string ([60f0b8a](https://github.com/kiva/ui/commit/60f0b8aa51a84f8f437ab2445067d0b41091b898))

## [2.272.0](https://github.com/kiva/ui/compare/v2.271.0...v2.272.0) (2022-08-30)


### Features

* activate hotjar on prod ([07376a9](https://github.com/kiva/ui/commit/07376a97a2e8367d0f6a6f4cc2c576f24389fb37))

## [2.271.0](https://github.com/kiva/ui/compare/v2.270.6...v2.271.0) (2022-08-29)


### Features

* setup for mfi recommendations experiment was added to lbc page ([5bec2e6](https://github.com/kiva/ui/commit/5bec2e61a825b6b9fc865c9bfb8ca8ed38a4d8be))

### [2.270.6](https://github.com/kiva/ui/compare/v2.270.5...v2.270.6) (2022-08-29)


### Bug Fixes

* fix issues related to cookies and setting optimizely attribute values ([6488668](https://github.com/kiva/ui/commit/6488668a5d26358bbac71cdae7feaebf5dbfcd30))
* remove unnecessary code ([bb16469](https://github.com/kiva/ui/commit/bb1646964dea5cb508fc92febf8ef6741c615a81))

### [2.270.5](https://github.com/kiva/ui/compare/v2.270.4...v2.270.5) (2022-08-26)


### Bug Fixes

* add mfa route guard to settings/payments page ([6593194](https://github.com/kiva/ui/commit/65931946ff64848b9ee8d26113b35b0854bab2dd))

### [2.270.4](https://github.com/kiva/ui/compare/v2.270.3...v2.270.4) (2022-08-26)


### Bug Fixes

* client side routing when routing to same route, different params ([5bd05c7](https://github.com/kiva/ui/commit/5bd05c778bf552d945806939c8c60e5e6ccce237))

### [2.270.3](https://github.com/kiva/ui/compare/v2.270.2...v2.270.3) (2022-08-25)


### Bug Fixes

* event name prop ([191a969](https://github.com/kiva/ui/commit/191a969134b83224959ced5d4d4868bd83f94e26))

### [2.270.2](https://github.com/kiva/ui/compare/v2.270.1...v2.270.2) (2022-08-25)


### Bug Fixes

* small tweaks in font size and null check for lbc eco carousel page ([4c9add1](https://github.com/kiva/ui/commit/4c9add18fc1d7f402ff1b3a684b677eb3fa6a3de))

### [2.270.1](https://github.com/kiva/ui/compare/v2.270.0...v2.270.1) (2022-08-25)


### Bug Fixes

* update handling for contentful page meta ([0f6e4cb](https://github.com/kiva/ui/commit/0f6e4cb3823bbcd706b69055977eb2dffb024207))
* update og:description and twitter:description when contentful description is present ([7ebab10](https://github.com/kiva/ui/commit/7ebab10ac2cdfdd3bb62d874673516fa024d1419))

## [2.270.0](https://github.com/kiva/ui/compare/v2.269.0...v2.270.0) (2022-08-25)


### Features

* install hotjar tracking code ([0a6f03b](https://github.com/kiva/ui/commit/0a6f03b944c5624e429b218fad6a42b2e97c44f6))


### Bug Fixes

* change hotjarId for envs and enable it on dev ([45af029](https://github.com/kiva/ui/commit/45af029714dda45d7425857b8612f79188185560))

## [2.269.0](https://github.com/kiva/ui/compare/v2.268.0...v2.269.0) (2022-08-24)


### Features

* send optimizely custom events ([2aff748](https://github.com/kiva/ui/commit/2aff748f9eb5feb7d2cf6878db3335e1d598d5e7))


### Bug Fixes

* 0 default value for events ([ef279d5](https://github.com/kiva/ui/commit/ef279d59399f90e3518bc62ca03622c661042ae8))
* change event name format ([945b6f3](https://github.com/kiva/ui/commit/945b6f3583e260f920533f6ada55451e6752761a))
* push events only when value is greater than 0 ([f744e52](https://github.com/kiva/ui/commit/f744e528768cde6d1a572dfc5e6a72e3eafcf90b))

## [2.268.0](https://github.com/kiva/ui/compare/v2.267.0...v2.268.0) (2022-08-24)


### Features

* improve performance of lbc eco experiment layout and use FLSS ([28856b2](https://github.com/kiva/ui/commit/28856b24f554a960b4d0393b7603eb6c6dd2e0e1))

## [2.267.0](https://github.com/kiva/ui/compare/v2.266.1...v2.267.0) (2022-08-24)


### Features

* update share button component ([d6b5ac2](https://github.com/kiva/ui/commit/d6b5ac2752e84312f17f9e0dc566744fae053cbf))

### [2.266.1](https://github.com/kiva/ui/compare/v2.266.0...v2.266.1) (2022-08-24)


### Bug Fixes

* add link to lend-by-category and update styles in lend/filter navigation ([46e3b8a](https://github.com/kiva/ui/commit/46e3b8aca8ea56b9f87b130f067e93d93c8a0e38))
* temporarily remove amountLeft sort option until index is fixed ([10e5f97](https://github.com/kiva/ui/commit/10e5f978b00cd5e81710f4b75184f8b38c79aab3))

## [2.266.0](https://github.com/kiva/ui/compare/v2.265.0...v2.266.0) (2022-08-24)


### Features

* add loan count to saved search item Find loans button ([9d009ad](https://github.com/kiva/ui/commit/9d009ad34a9a1e67edb0cf683f4d91de11d7d1bc))


### Bug Fixes

* enable load more button, add loading state, scaffold lsc in saved search item query ([94b9a89](https://github.com/kiva/ui/commit/94b9a89b9af89de7a397feb828f644d9fcc87796))

## [2.265.0](https://github.com/kiva/ui/compare/v2.264.0...v2.265.0) (2022-08-24)


### Features

* css code was replaced with tw clasess in loansearchsavedsearch component ([df4cead](https://github.com/kiva/ui/commit/df4cead0183e58028b095698aeff5e0e643d5747))

## [2.264.0](https://github.com/kiva/ui/compare/v2.263.2...v2.264.0) (2022-08-24)


### Features

* saved search ui on lend filter page ([a3f3c72](https://github.com/kiva/ui/commit/a3f3c723953580cabe1a77bd5ca5d45b8ddec874))


### Bug Fixes

* add cmt and some pr fix ([158ff00](https://github.com/kiva/ui/commit/158ff0053d41d0e3c192c9d1f0b758cba8a04145))
* add tracking ([714782d](https://github.com/kiva/ui/commit/714782d227d188b09167d6124a41a888aa373605))
* lint errors ([a9e44cc](https://github.com/kiva/ui/commit/a9e44cc884a8538019c30636b251b3525911f6a6))
* undo change ([e7711b5](https://github.com/kiva/ui/commit/e7711b527595d66faf9a45da83fce8e9b6002b16))

### [2.263.2](https://github.com/kiva/ui/compare/v2.263.1...v2.263.2) (2022-08-24)


### Bug Fixes

* revert previous change and update the strategy to get utm_campaign version ([dc95ec0](https://github.com/kiva/ui/commit/dc95ec0f9d06f939221ba1e1f4ca9896d7271b9e))

### [2.263.1](https://github.com/kiva/ui/compare/v2.263.0...v2.263.1) (2022-08-23)


### Bug Fixes

* update utm_campaign from social_share_checkout_scle to social_share_checkout_control_scle ([66783ca](https://github.com/kiva/ui/commit/66783ca8cabb25c57fc48efdc79f5234ece0a824))

## [2.263.0](https://github.com/kiva/ui/compare/v2.262.0...v2.263.0) (2022-08-22)


### Features

* resolving merge conflicts and PR comments from VUE-1127 in VUE-1127.75 ([5f3ddb0](https://github.com/kiva/ui/commit/5f3ddb038520a3dbd2ef0fe974be980879c0f537))

## [2.262.0](https://github.com/kiva/ui/compare/v2.261.3...v2.262.0) (2022-08-22)


### Features

* handleteamform trigger was added if verification is not needed ([043c3d2](https://github.com/kiva/ui/commit/043c3d21ab91b0a831c302e2d9ef214e53665091))
* handleteamform trigger was moved after team verification ([3e64d54](https://github.com/kiva/ui/commit/3e64d54849ade139e1f05b0617ab705f0c6aff92))

### [2.261.3](https://github.com/kiva/ui/compare/v2.261.2...v2.261.3) (2022-08-22)


### Bug Fixes

* add alternate dev configs to readme ([e9912cf](https://github.com/kiva/ui/commit/e9912cfd6ac8b8cfa3d595b6d2e7fd990250a993))

### [2.261.2](https://github.com/kiva/ui/compare/v2.261.1...v2.261.2) (2022-08-22)


### Bug Fixes

* insist on pre-commit hooks ([8139441](https://github.com/kiva/ui/commit/81394414d7865728518d2b4188e18d4586eea53d))

### [2.261.1](https://github.com/kiva/ui/compare/v2.261.0...v2.261.1) (2022-08-22)


### Bug Fixes

* add alternate vscode dev tool links ([38281e8](https://github.com/kiva/ui/commit/38281e8fef2297512bad7c3ddf3121721be482c0))

## [2.261.0](https://github.com/kiva/ui/compare/v2.260.1...v2.261.0) (2022-08-19)


### Features

* track web vitals MARS-169 ([111b12e](https://github.com/kiva/ui/commit/111b12ee995cea569e223996330842f7e131f44d))
* use PageSpeed for Lightouse test and upload to S3 MARS-169 ([a6d07db](https://github.com/kiva/ui/commit/a6d07dbd67978fb5ddd187786bc3dc9656732ed8))

### [2.260.1](https://github.com/kiva/ui/compare/v2.260.0...v2.260.1) (2022-08-19)


### Bug Fixes

* kivaClassic Loan card should show checkout now button if loan is in basket ([4732408](https://github.com/kiva/ui/commit/47324080557f849be045b848caab547e639d44b7))

## [2.260.0](https://github.com/kiva/ui/compare/v2.259.2...v2.260.0) (2022-08-18)


### Features

* added setting in contentful that allows site admins to toggle ([57f1e72](https://github.com/kiva/ui/commit/57f1e720b0040e24461a91b05b69b989952157ca))


### Bug Fixes

* ensure external links open in new tabs ([82a40a5](https://github.com/kiva/ui/commit/82a40a519164d1ea6e4c57d1e5fc8c0d5a525937))
* no need to use $props to reference component props ([aacaab2](https://github.com/kiva/ui/commit/aacaab2adc7b95d959f7740f39e8e2135aeec086))

### [2.259.2](https://github.com/kiva/ui/compare/v2.259.1...v2.259.2) (2022-08-18)


### Bug Fixes

* kivaClassic Loan card should not show checkout now button ([55b16c3](https://github.com/kiva/ui/commit/55b16c35ad5a652cb18e992533e2a4e660cceb99))

### [2.259.1](https://github.com/kiva/ui/compare/v2.259.0...v2.259.1) (2022-08-18)


### Bug Fixes

* inject cookieStore in whatIsKiva modal ([0c34f66](https://github.com/kiva/ui/commit/0c34f66b8727c667a2cf207e1fc0e709575f8642))

## [2.259.0](https://github.com/kiva/ui/compare/v2.258.0...v2.259.0) (2022-08-18)


### Features

* activate saved search at it's actual url ([fb4f02a](https://github.com/kiva/ui/commit/fb4f02a86aca3df2cbc9052c0a9cde2a81428ad8))


### Bug Fixes

* remove saved-search-beta route ([0847ec7](https://github.com/kiva/ui/commit/0847ec7cc3cc4128710e61ff9ed99154ec23359d))

## [2.258.0](https://github.com/kiva/ui/compare/v2.257.3...v2.258.0) (2022-08-18)


### Features

* finish deprecating Causes product ([e811f4c](https://github.com/kiva/ui/commit/e811f4ca01a2b5d00933b1e703eeed91787c2118))

### [2.257.3](https://github.com/kiva/ui/compare/v2.257.2...v2.257.3) (2022-08-18)


### Bug Fixes

* added readQuery mock TheHeader.spec.js test ([012c03d](https://github.com/kiva/ui/commit/012c03d3e22803b2f324eda33aa8f16861273753))
* removed unnecessary promise ([928a4e6](https://github.com/kiva/ui/commit/928a4e679ea01c994d93f43e40982ac087dad61b))

### [2.257.2](https://github.com/kiva/ui/compare/v2.257.1...v2.257.2) (2022-08-17)


### Bug Fixes

* handleteamform function was added to methods section ([9126df1](https://github.com/kiva/ui/commit/9126df1c5cd6c8e8ff8961d35885efc676c91237))

### [2.257.1](https://github.com/kiva/ui/compare/v2.257.0...v2.257.1) (2022-08-17)


### Bug Fixes

* add tag param to query param utils for loan channel filter links ([645f5c5](https://github.com/kiva/ui/commit/645f5c59846d75b003121538751ba1967628dbff))

## [2.257.0](https://github.com/kiva/ui/compare/v2.256.0...v2.257.0) (2022-08-17)


### Features

* implement organization schema for Kiva MARS-217 ([31097b3](https://github.com/kiva/ui/commit/31097b3647bbd58d9cdca745860992835ce65219))


### Bug Fixes

* add standalone kiva logo ([88c0eae](https://github.com/kiva/ui/commit/88c0eae24b6bc1d0868677901bb0105b624e6cae))

## [2.256.0](https://github.com/kiva/ui/compare/v2.255.0...v2.256.0) (2022-08-16)


### Features

* add saved search exp ([be56de8](https://github.com/kiva/ui/commit/be56de8a9553527fdcba1f1fabdc7ec419472e68))
* amount limits and copy for complete loan experiment were updated ([6ae8609](https://github.com/kiva/ui/commit/6ae860935cff2303d73b4b0b80f381af97ba5a0c))
* kiva protocol copy was removed from donation item lightbox ([da0c567](https://github.com/kiva/ui/commit/da0c567195f99e583afb89eb6fed7742bf1f5c71))
* lbc experimental layout modifications ([75066c7](https://github.com/kiva/ui/commit/75066c7bc0609a25e68705447ffad0cd5cbf41b8))


### Bug Fixes

* don't require lender for social share button ([e7d87bc](https://github.com/kiva/ui/commit/e7d87bc8f7573fbd60376f3b5d137d009c1bf23a))
* update query name ([4538ee4](https://github.com/kiva/ui/commit/4538ee41d0ee9117632f141ec21c392850933cc9))

## [2.255.0](https://github.com/kiva/ui/compare/v2.254.1...v2.255.0) (2022-08-16)


### Features

* join team campaign was added to checkout page ([9fedd62](https://github.com/kiva/ui/commit/9fedd6236f9ce5529121257e43feada3acd1d61b))
* join team form was added to checkout page with a handler to show it ([c1cc52f](https://github.com/kiva/ui/commit/c1cc52f7e9be55e06e69a688244199a31c7d2162))


### Bug Fixes

* join team form was cleaned up on checkout page ([b84faf3](https://github.com/kiva/ui/commit/b84faf3dae47dc16b93dd7748fdb1d949a6dc522))

### [2.254.1](https://github.com/kiva/ui/compare/v2.254.0...v2.254.1) (2022-08-15)


### Bug Fixes

* typo in channel 90, add mixin for querymap on eco friendlly, custom route url for recommended ([af01782](https://github.com/kiva/ui/commit/af0178262730b91cdfe5780b8c916be5fa7c1b55))

## [2.254.0](https://github.com/kiva/ui/compare/v2.253.3...v2.254.0) (2022-08-14)


### Features

* swap CampaignHero component for the newer Dynamic Hero Classic component ([19d3185](https://github.com/kiva/ui/commit/19d3185215467b30dcbfe65c93cfb29163f2d9b7))


### Bug Fixes

* addressed PR comments ([df6f6c2](https://github.com/kiva/ui/commit/df6f6c21434845cd11676e902e9e55de689a0c28))

### [2.253.3](https://github.com/kiva/ui/compare/v2.253.2...v2.253.3) (2022-08-12)


### Bug Fixes

* update loan channel query map with missing categories, adapt for flss, add new excluded params ([7ad451a](https://github.com/kiva/ui/commit/7ad451a8350a104401b983ed90104e2b10897ca1))

### [2.253.2](https://github.com/kiva/ui/compare/v2.253.1...v2.253.2) (2022-08-11)


### Bug Fixes

* update query param defs for categories without them ([ab677a2](https://github.com/kiva/ui/commit/ab677a26bb4db3ba9264fc2892db9f5dae954e93))

### [2.253.1](https://github.com/kiva/ui/compare/v2.253.0...v2.253.1) (2022-08-11)


### Bug Fixes

* port filterUrl process to running experiment versions ([770ce27](https://github.com/kiva/ui/commit/770ce27c455c39dffb1c9a71d37500417d69bfbb))

## [2.253.0](https://github.com/kiva/ui/compare/v2.252.0...v2.253.0) (2022-08-11)


### Features

* [revised PR comments and merge branch 'main' of github.com:kiva/ui into VUE-1169] ([a96e55f](https://github.com/kiva/ui/commit/a96e55f6df238e0a3fbb832e8e1c487d0d8f16be))
* revised PR (wiring different buttons and design review changes [VUE 1169, 1170, 1172, 1197]) ([23f22af](https://github.com/kiva/ui/commit/23f22af0d380d4c403c731c5a63fca9910ccb20d))

## [2.252.0](https://github.com/kiva/ui/compare/v2.251.0...v2.252.0) (2022-08-11)


### Features

* show upsells module only if under 100 ([3574877](https://github.com/kiva/ui/commit/357487770c31b620dc7dd1fca12b0044811f4a75))
* update filterUrl on category pages and query param handling on lend/filter ([c75e906](https://github.com/kiva/ui/commit/c75e906eb1ba65a1cc4e32db637db14b4ebb4ad8))


### Bug Fixes

* adjust setup of category page filterUrl ([3a97ce1](https://github.com/kiva/ui/commit/3a97ce1ad5aa8e36058166c13e769bd22d9bf98d))
* merge conflict ([306a327](https://github.com/kiva/ui/commit/306a3273953abb2b1b067cd31e01f8a361ccf303))
* pr comments fix ([43634cf](https://github.com/kiva/ui/commit/43634cfca412d4e7ab5cbb2d0a6c0966685bf7f3))
* update filterUtils test now that amountLeft is supported in FLSS lend/filter ([7370d48](https://github.com/kiva/ui/commit/7370d48261d5591331a7cd385db3af59ef91a487))

## [2.251.0](https://github.com/kiva/ui/compare/v2.250.0...v2.251.0) (2022-08-11)


### Features

* tweaks to lbc carousel experiment layout ([a381edf](https://github.com/kiva/ui/commit/a381edf8f33990a2f9bb8dff5e13c816c2096167))

## [2.250.0](https://github.com/kiva/ui/compare/v2.249.0...v2.250.0) (2022-08-11)


### Features

* wiring different buttons and design review changes [VUE 1169, 1170, 1172, 1197] ([2550d29](https://github.com/kiva/ui/commit/2550d2945121da1982cffcbba71d0b16b46beb0e))

## [2.249.0](https://github.com/kiva/ui/compare/v2.248.2...v2.249.0) (2022-08-11)


### Features

* update upsell styles ([d5d7d06](https://github.com/kiva/ui/commit/d5d7d069f4942d7e634e4ab97f81428cacb11e86))


### Bug Fixes

* update handling min height for upsells ([24f46cf](https://github.com/kiva/ui/commit/24f46cfa429e2d166e42f1929600fac18f05b958))

### [2.248.2](https://github.com/kiva/ui/compare/v2.248.1...v2.248.2) (2022-08-11)


### Bug Fixes

* require loan purchase to display focused share ask on thanks page MARS-218 ([e9cabca](https://github.com/kiva/ui/commit/e9cabca3c7fa54d17a56f11051443be295503cdb))

### [2.248.1](https://github.com/kiva/ui/compare/v2.248.0...v2.248.1) (2022-08-11)


### Bug Fixes

* change lbc experiment category name ([4e6fe00](https://github.com/kiva/ui/commit/4e6fe00774db878431c79265741b8101cd7165ea))
* fixes handling of line clamp for nested html elements in safari and firefox ([cf31b0d](https://github.com/kiva/ui/commit/cf31b0dd127bac27dd4a6a8b3566be78891a8478))

## [2.248.0](https://github.com/kiva/ui/compare/v2.247.2...v2.248.0) (2022-08-11)


### Features

* add lbc eco category experimental layout ([d831c9c](https://github.com/kiva/ui/commit/d831c9cea1545828f94971eafaf3067feeb81e5f))

### [2.247.2](https://github.com/kiva/ui/compare/v2.247.1...v2.247.2) (2022-08-10)


### Bug Fixes

* file conflicts ([f7c618c](https://github.com/kiva/ui/commit/f7c618cd74feef0ddf7dbca883184a38820d5fb6))

### [2.247.1](https://github.com/kiva/ui/compare/v2.247.0...v2.247.1) (2022-08-10)


### Bug Fixes

* set conditional for modal exp ([6a87b66](https://github.com/kiva/ui/commit/6a87b6619c11e8190e3ae563eb7de7dbfa03085d))

## [2.247.0](https://github.com/kiva/ui/compare/v2.246.0...v2.247.0) (2022-08-10)


### Features

* add tracking events ([a4945c1](https://github.com/kiva/ui/commit/a4945c1b7d961d1583a5e3bdbc27b1c1d00a7dcd))
* create what is kiva modal component with mobile and desktop version ([90b16d1](https://github.com/kiva/ui/commit/90b16d131831b89815e790b470e24b37068f3301))
* setup exp tracking and condition to make it visible ([1cec02c](https://github.com/kiva/ui/commit/1cec02c9a4b7a60a3de552ca109ec0671efeb2a7))
* slide out mobile animation ([9f0f549](https://github.com/kiva/ui/commit/9f0f5497b71694d06e94f45924d7903bc4756d81))
* update package-lock.json for @kiva/kv-components upgrade ([90c1009](https://github.com/kiva/ui/commit/90c10094e844c7d3ed90c50cecb8269465e8273a))
* validate that modal has not been shown before and remove unnecessary div ([4a8cb16](https://github.com/kiva/ui/commit/4a8cb16f84ff90816f8889ddd5e5801b1f5abcd4))


### Bug Fixes

* conflicts ([8d6bcdb](https://github.com/kiva/ui/commit/8d6bcdbcb7e969adb43644a55b32be24ebfa8cda))
* css lint ([689bf01](https://github.com/kiva/ui/commit/689bf01dd8466697ab154c51201e4d74ac7627a1))
* css lint ([db53be2](https://github.com/kiva/ui/commit/db53be2143ba8928478db184436a592672b40a1b))
* experiment key name and update kv-components version ([65522ff](https://github.com/kiva/ui/commit/65522ff71ded72acdf63a76e6776e73253556094))
* get type prop as an argument ([d806d37](https://github.com/kiva/ui/commit/d806d3719a6ee2bc27728b5ba989babe9096002f))
* move lightbox body outside header ([ba02815](https://github.com/kiva/ui/commit/ba028158b2acf335bed048feae0c88444065ef7b))
* resolve conflict ([a1cad64](https://github.com/kiva/ui/commit/a1cad64f23e14551f57044cb3c4fc7247a6642e9))

## [2.246.0](https://github.com/kiva/ui/compare/v2.245.0...v2.246.0) (2022-08-09)


### Features

* added share ask copy experiment ([0b9794a](https://github.com/kiva/ui/commit/0b9794a095cc4ca0bee5f404cfade9138f1dc684))


### Bug Fixes

* added PII data masked ([09df998](https://github.com/kiva/ui/commit/09df9984c91ca5b23afb9d8b2c89184f6cdd5e2e))
* remove console.log ([337e271](https://github.com/kiva/ui/commit/337e271c39b3d86c2e0dd544ec6bd3f7ccf6b3ff))
* small change ([b3aef15](https://github.com/kiva/ui/commit/b3aef15467c3b2c9e0c15960a81da1bb67539296))
* typo in experiment key ([6ca8734](https://github.com/kiva/ui/commit/6ca87347f45552b6c7acb25835f34559eba56ff9))

## [2.245.0](https://github.com/kiva/ui/compare/v2.244.0...v2.245.0) (2022-08-09)


### Features

* use script tag for oneTrust loader and cache head script render results MARS-174 ([6e0a30f](https://github.com/kiva/ui/commit/6e0a30f896a83fe86ebe560d20ec3b6b626cdd03))


### Bug Fixes

* also check name url param for inviter public id MARS-206 ([7ef0cae](https://github.com/kiva/ui/commit/7ef0cae10f1f2151d9e4e9823452ce8334b3c0e9))

## [2.244.0](https://github.com/kiva/ui/compare/v2.243.2...v2.244.0) (2022-08-09)


### Features

* use the new flss version of lend/filter ([051ee80](https://github.com/kiva/ui/commit/051ee80f808fe13f621237670ed7cd533fd1bee7))

### [2.243.2](https://github.com/kiva/ui/compare/v2.243.1...v2.243.2) (2022-08-09)


### Bug Fixes

* change primary and secondary CTA in hero section of campaign landing page over to kiva classic ([71861f7](https://github.com/kiva/ui/commit/71861f7df410272b8b25e6271854f02df4135b05))

### [2.243.1](https://github.com/kiva/ui/compare/v2.243.0...v2.243.1) (2022-08-09)


### Bug Fixes

* add canonical url to Borrower Profile page ([0b15502](https://github.com/kiva/ui/commit/0b15502649d06acfb563deecd30e1f89edf3c729))
* small improvement and iclude all query string ([0f3d104](https://github.com/kiva/ui/commit/0f3d104c0c29ce5ffc14c481ed6e18d6f77558c8))

## [2.243.0](https://github.com/kiva/ui/compare/v2.242.1...v2.243.0) (2022-08-08)


### Features

* experiment copy for upsells on checkout ([68a5a51](https://github.com/kiva/ui/commit/68a5a517ac1d4c3151554a55e5b426adea191f09))

### [2.242.1](https://github.com/kiva/ui/compare/v2.242.0...v2.242.1) (2022-08-08)


### Bug Fixes

* fixed promise resolve ([1e18e94](https://github.com/kiva/ui/commit/1e18e949051fc25f67551e77b3bc12b21ba30fe6))

## [2.242.0](https://github.com/kiva/ui/compare/v2.241.0...v2.242.0) (2022-08-05)


### Features

* add new cookies for Optimizely experiment ([fef85e8](https://github.com/kiva/ui/commit/fef85e88bdaa3782ba903f98d8bc83778cd31fd5))
* rename cookies with underscore ([efd425b](https://github.com/kiva/ui/commit/efd425be56d6fc509c43e631042e8d67b8c0c761))
* small change on hasDepositBefore ([cf28a34](https://github.com/kiva/ui/commit/cf28a348198ff86b54c915817f70423c3cdfbae4))


### Bug Fixes

* added query condition based on cookie value ([a5d90ae](https://github.com/kiva/ui/commit/a5d90ae4c6e56c132fa587240294a26ad8795760))
* adjustments after code review ([9b2f3ba](https://github.com/kiva/ui/commit/9b2f3ba77eaffa97e3d2bf755ee8b04068ea5416))
* changed strategy to handle user metrics cookies ([a41cf19](https://github.com/kiva/ui/commit/a41cf19fec17662f46fedfe493e829419a3713b9))
* more request changes after code review ([97c5109](https://github.com/kiva/ui/commit/97c5109ce34f4a5d6a9b06ae485cb160b3c2128a))
* revert small changes ([88c65f0](https://github.com/kiva/ui/commit/88c65f01a4a3591c090da03237bae08027e3f480))
* small improvements ([d710a5a](https://github.com/kiva/ui/commit/d710a5a56f8939bd130046869519e9a458a0f0c0))
* small improvements ([319c028](https://github.com/kiva/ui/commit/319c028f29cf7dc8602a23c0eceef8c272bc2b88))
* use optimizely API features ([15ca387](https://github.com/kiva/ui/commit/15ca38760746ec3e3d0e4f0bdef27c6f827193ee))

## [2.241.0](https://github.com/kiva/ui/compare/v2.240.1...v2.241.0) (2022-08-04)


### Features

* initial updates to use gtag instead of analytics.js ([811b620](https://github.com/kiva/ui/commit/811b620e1f0dbfb27409ee5709748962c2f4d692))


### Bug Fixes

* map ecommerce calls to gtag format + cleanup unused config ([d66df6d](https://github.com/kiva/ui/commit/d66df6dc41c48b6d1838f3cc08337ea8dce2ace8))
* prevent duplicate pageview on config update + reduce eslint omissions ([0ae543d](https://github.com/kiva/ui/commit/0ae543da2f6d3155862050f382311306a7728dd4))

### [2.240.1](https://github.com/kiva/ui/compare/v2.240.0...v2.240.1) (2022-08-04)


### Bug Fixes

* update ([f09acf1](https://github.com/kiva/ui/commit/f09acf110062229c0ad5bd9185408123909642c6))
* update complete this loan price ([212e657](https://github.com/kiva/ui/commit/212e6574c313c7466746be07bfc457bfd5bdad35))

## [2.240.0](https://github.com/kiva/ui/compare/v2.239.0...v2.240.0) (2022-08-03)


### Features

* test code for checkout upsells was removed becoming a new feature on the page ([e0aa377](https://github.com/kiva/ui/commit/e0aa3775d69926bce44d1ae93cbea5794abbeb20))

## [2.239.0](https://github.com/kiva/ui/compare/v2.238.0...v2.239.0) (2022-08-03)


### Features

* montlhy good entrypoint component was a created for lend menu ([b4be0f4](https://github.com/kiva/ui/commit/b4be0f4bdc84523bb0fdaecfa4e8108d28b8bad1))
* new design for monthly good link was added to the top navigation ([7586e5b](https://github.com/kiva/ui/commit/7586e5b9302fdd0887d513176a03e94e4582841e))

## [2.238.0](https://github.com/kiva/ui/compare/v2.237.3...v2.238.0) (2022-08-03)


### Features

* create SavedSearchItem component + use for entry list (new edits) ([068d6da](https://github.com/kiva/ui/commit/068d6da79fb5e1828f3872b737f02f2a7cb4a273))

### [2.237.3](https://github.com/kiva/ui/compare/v2.237.2...v2.237.3) (2022-08-02)


### Bug Fixes

* move and trigger share card experiment in thanks page ([cad31e8](https://github.com/kiva/ui/commit/cad31e86ad103c127f4cb2466976bafec09b7be3))
* only show expected FLSS sort options ([0381605](https://github.com/kiva/ui/commit/03816056afc4d640a43ec96fee71bf2d8812034a))
* update experiment details ([5a0593e](https://github.com/kiva/ui/commit/5a0593e27f617005bcfbd35d28e54e9a1630e4fe))

### [2.237.2](https://github.com/kiva/ui/compare/v2.237.1...v2.237.2) (2022-08-01)


### Bug Fixes

* improve error message on failed experiment setting fetch ([ec073d8](https://github.com/kiva/ui/commit/ec073d8923b99228129c25c4dfc72d86097e2786))

### [2.237.1](https://github.com/kiva/ui/compare/v2.237.0...v2.237.1) (2022-08-01)


### Bug Fixes

* use env specific fastly img url for algolia loan cards ([4956067](https://github.com/kiva/ui/commit/4956067d1ae9acb913848674991a6354f7ccda6d))

## [2.237.0](https://github.com/kiva/ui/compare/v2.236.0...v2.237.0) (2022-07-25)


### Features

* enable snowplow performance timing in the snowplow context ([1ffc0c6](https://github.com/kiva/ui/commit/1ffc0c6c5cc4d92ea9ae81ab6297ee37d1eedfe8))

## [2.236.0](https://github.com/kiva/ui/compare/v2.235.11...v2.236.0) (2022-07-23)


### Features

* ab test added for new mg entrypoint on topnav ([910ca71](https://github.com/kiva/ui/commit/910ca71bde43ed249ab6629900e48cc38fd70030))
* mg entrypoint experiment was added as global experiment ([994dba1](https://github.com/kiva/ui/commit/994dba18eda6451c270ceace58e09a1b82278318))
* queries for mg entrypoint experiments were added ([61bc06a](https://github.com/kiva/ui/commit/61bc06a3cedf1fcf3435bf23e9ad71f9bac47419))

### [2.235.11](https://github.com/kiva/ui/compare/v2.235.10...v2.235.11) (2022-07-22)


### Bug Fixes

* notes on exp version extraction ([15f66b1](https://github.com/kiva/ui/commit/15f66b1f5fcd10032efe578d1e317e1687731b54))

### [2.235.10](https://github.com/kiva/ui/compare/v2.235.9...v2.235.10) (2022-07-22)


### Bug Fixes

* strip out -normal from exp version field ([ed4482c](https://github.com/kiva/ui/commit/ed4482c0a1252bd9841830f5c6159678b41a3404))

### [2.235.9](https://github.com/kiva/ui/compare/v2.235.8...v2.235.9) (2022-07-22)


### Bug Fixes

* strip out -normal from exp version field ([45ede81](https://github.com/kiva/ui/commit/45ede81c64f0b9eeda198537bcaaaeb040da356e))

### [2.235.8](https://github.com/kiva/ui/compare/v2.235.7...v2.235.8) (2022-07-22)


### Bug Fixes

* added shard card experiment tracking to funded borrower profile component ([6a1ddcb](https://github.com/kiva/ui/commit/6a1ddcb4b3b729a520a36a0ff4d508c6a2257aa1))
* code review changes ([62c977c](https://github.com/kiva/ui/commit/62c977c7ce0918249f05e052ad8e5f85ef32e1e1))
* removed scle param and move experiment to utm_campaign ([4b7e83a](https://github.com/kiva/ui/commit/4b7e83a924644c38140175ccf2e7861fdc14a7df))
* small improvement ([f95e532](https://github.com/kiva/ui/commit/f95e532469fe94f11e279289044140ce471e3132))

### [2.235.7](https://github.com/kiva/ui/compare/v2.235.6...v2.235.7) (2022-07-22)


### Bug Fixes

* kvdropdown menu scoped css is breaking padding ([d0b79b4](https://github.com/kiva/ui/commit/d0b79b4da19f7b320c34cedfeacab87e67c54732))

### [2.235.6](https://github.com/kiva/ui/compare/v2.235.5...v2.235.6) (2022-07-22)


### Bug Fixes

* kvdropdown menu showing up under borrower profile lend cta ([fe64b13](https://github.com/kiva/ui/commit/fe64b138aab4b3f1ca424a7fc90208ad0624cae2))

### [2.235.5](https://github.com/kiva/ui/compare/v2.235.4...v2.235.5) (2022-07-21)


### Bug Fixes

* remove the live-loans endpoint from our lighthouse run as it fails, dropping all other results ([15705ae](https://github.com/kiva/ui/commit/15705aeb750050c7b35836c707eecf1bfd4fe850))

### [2.235.4](https://github.com/kiva/ui/compare/v2.235.3...v2.235.4) (2022-07-21)


### Bug Fixes

* link url for anonymous users in share button ([0a413af](https://github.com/kiva/ui/commit/0a413af19bfec6288c5489ae12e952508a2a9a8e))

### [2.235.3](https://github.com/kiva/ui/compare/v2.235.2...v2.235.3) (2022-07-21)


### Bug Fixes

* various styling issues for borrower profiles ([d17b0a0](https://github.com/kiva/ui/commit/d17b0a0c639a838756c685ee40583ea14e781753))

### [2.235.2](https://github.com/kiva/ui/compare/v2.235.1...v2.235.2) (2022-07-21)


### Bug Fixes

* removes event prop that is throwing a vue warning about deprecated event prop on router link ([c532756](https://github.com/kiva/ui/commit/c532756f9b7858c18a60e6ac67d9ed7231c57eeb))

### [2.235.1](https://github.com/kiva/ui/compare/v2.235.0...v2.235.1) (2022-07-21)


### Bug Fixes

* various styling issues for pfp share button ([73139bb](https://github.com/kiva/ui/commit/73139bbaf9757b4c8167720cdc5e868d9f5c7051))

## [2.235.0](https://github.com/kiva/ui/compare/v2.234.0...v2.235.0) (2022-07-21)


### Features

* social media share button on pfp borrower profiles ([36deeb9](https://github.com/kiva/ui/commit/36deeb93295261ee4fad3c871d991874e295a2ba))


### Bug Fixes

* spacing ([ddeedbc](https://github.com/kiva/ui/commit/ddeedbc1041b85ec51a50babc6f5cfd672fc7603))

## [2.234.0](https://github.com/kiva/ui/compare/v2.233.6...v2.234.0) (2022-07-20)


### Features

* adding FAQs to categories page ([#4035](https://github.com/kiva/ui/issues/4035)) ([a53507e](https://github.com/kiva/ui/commit/a53507e9f39f477581b5f1711a2fc5a63a6290f8))

### [2.233.6](https://github.com/kiva/ui/compare/v2.233.5...v2.233.6) (2022-07-20)


### Bug Fixes

* fetch more lenders to avoid small filtered list ([9e72093](https://github.com/kiva/ui/commit/9e720932a1f82ba624449ceb1be75a35dddc5d31))

### [2.233.5](https://github.com/kiva/ui/compare/v2.233.4...v2.233.5) (2022-07-19)


### Bug Fixes

* fix incorrect utm_content param ([63064b2](https://github.com/kiva/ui/commit/63064b242ff2c9460afaa8b706004e29b01ae20c))

### [2.233.4](https://github.com/kiva/ui/compare/v2.233.3...v2.233.4) (2022-07-19)


### Bug Fixes

* remove bottom margin in mobile view ([0150104](https://github.com/kiva/ui/commit/0150104ca28ab3e712b0971847b56f8acff47b81))

### [2.233.3](https://github.com/kiva/ui/compare/v2.233.2...v2.233.3) (2022-07-19)


### Bug Fixes

* test longer lighthouse load time to try and resolve live-loan endpoint ([9e02a52](https://github.com/kiva/ui/commit/9e02a5252fccf879ba27bf0bc350185eebd1bd95))

### [2.233.2](https://github.com/kiva/ui/compare/v2.233.1...v2.233.2) (2022-07-19)


### Bug Fixes

* round first name letter image ([50acf5c](https://github.com/kiva/ui/commit/50acf5c0d8f94e693c6521c36217a0c569e4e67d))

### [2.233.1](https://github.com/kiva/ui/compare/v2.233.0...v2.233.1) (2022-07-19)


### Bug Fixes

* guard against missing updateConfiguration method ([59a250f](https://github.com/kiva/ui/commit/59a250fc30be6321586c7921dc3db284216f51ff))

## [2.233.0](https://github.com/kiva/ui/compare/v2.232.1...v2.233.0) (2022-07-19)


### Features

* add lenders list to desktop version and open lenders modal ([7e3c78f](https://github.com/kiva/ui/commit/7e3c78f077a92571c21013a0f2eff925e3019871))
* filter anonymous lenders and replace default img with first name letter ([90ef833](https://github.com/kiva/ui/commit/90ef83357a68e853cc2737ae43001cbe4a350bae))
* highlight inviter in lenders list if has lent to borrower ([b08211f](https://github.com/kiva/ui/commit/b08211f249cbd27d178907ccf2f8fb892569d16f))
* mobile version of lenders list exp ([8169723](https://github.com/kiva/ui/commit/816972388f12e296a7e70bc51236c5a26accff72))
* setting social elements experiment config ([b88e2e8](https://github.com/kiva/ui/commit/b88e2e8614c434cbd5b3cd9ea5743c8ab1257aa6))


### Bug Fixes

* adjust placement of social lender experiment elements ([739b13b](https://github.com/kiva/ui/commit/739b13b8c3051f729de37eab81a10306d4f85206))
* css style ([1775c89](https://github.com/kiva/ui/commit/1775c899f07fa06584eb76d1d7162c633a8d56db))
* duplicate prop ([9440b7e](https://github.com/kiva/ui/commit/9440b7ec1d3fec7369852a00d32bae7e68d82f7f))
* lenders count in poweredBy text ([9e4b54f](https://github.com/kiva/ui/commit/9e4b54f2d7bbbd8496668f32a89b9c51b2a92a9f))
* lint css ([1707a75](https://github.com/kiva/ui/commit/1707a75a37b6663caf3a09c35a7e0e09bc9cad4f))
* remove unused code ([1368c9a](https://github.com/kiva/ui/commit/1368c9a0270596cf8271cc45503f51b6d762f827))
* socialExpEnabled flag ([50e0bdf](https://github.com/kiva/ui/commit/50e0bdf3ce44cab03d95612c200b97e7861449db))
* solve conflicts ([69d5147](https://github.com/kiva/ui/commit/69d51473817ce580c62896225d61c7cc980d4232))
* solve conflicts ([03d0f82](https://github.com/kiva/ui/commit/03d0f82a15dabc34f4da3911e8a9dc3cac5ae1e4))
* use existing numLenders variable ([feba9b2](https://github.com/kiva/ui/commit/feba9b2f459b74fb82fd8c0276e99462238e8051))
* verify device width in parent component ([c7408fc](https://github.com/kiva/ui/commit/c7408fc49af7df1aaa416300e3793336702ae298))

### [2.232.1](https://github.com/kiva/ui/compare/v2.232.0...v2.232.1) (2022-07-19)


### Bug Fixes

* mg landing header on wide displays styling fix ([6c9cbc3](https://github.com/kiva/ui/commit/6c9cbc33d3b0db3701cc1dd2861485a3293fdbeb))

## [2.232.0](https://github.com/kiva/ui/compare/v2.231.3...v2.232.0) (2022-07-15)


### Features

* add cookie for redirect to categories-beta page ([5f25236](https://github.com/kiva/ui/commit/5f25236a91b6bad0ae54125f965ed7f6ff105358))

### [2.231.3](https://github.com/kiva/ui/compare/v2.231.2...v2.231.3) (2022-07-15)


### Bug Fixes

* update paypal config after changes to amount, stup out the same for google and apple ([44bf1ef](https://github.com/kiva/ui/commit/44bf1ef9b1f0825ac96685b17388663f7c8b559e))

### [2.231.2](https://github.com/kiva/ui/compare/v2.231.1...v2.231.2) (2022-07-14)


### Bug Fixes

* issue with montly good and loans per page ([11f496b](https://github.com/kiva/ui/commit/11f496bfc2cae84c76db83e5e909183d4a66cd18))

### [2.231.1](https://github.com/kiva/ui/compare/v2.231.0...v2.231.1) (2022-07-14)


### Bug Fixes

* category page design revisions ([#4022](https://github.com/kiva/ui/issues/4022)) ([2428951](https://github.com/kiva/ui/commit/2428951fd7f1d094e46efb40ca89b57381dfb29c))

## [2.231.0](https://github.com/kiva/ui/compare/v2.230.1...v2.231.0) (2022-07-14)


### Features

* adding meta tags to categories page and storybook enhancements ([#4021](https://github.com/kiva/ui/issues/4021)) ([3024331](https://github.com/kiva/ui/commit/302433161ec6426e3f405bb85c2a970bd26a88c0))

### [2.230.1](https://github.com/kiva/ui/compare/v2.230.0...v2.230.1) (2022-07-14)


### Bug Fixes

* added more improvements ([d2f761a](https://github.com/kiva/ui/commit/d2f761a89012fa61c63166fd887503e7e7857d3a))
* additional preconnect for anonymous crossorigin requests ([5ff5be8](https://github.com/kiva/ui/commit/5ff5be8412c5a46a3af00a6d57dd2effd487de1d))
* changes after PR review ([5222d82](https://github.com/kiva/ui/commit/5222d825a4ff4df17a8e17c2284dd05f87ead7a4))
* handle loans per page value according promo card availability ([62a290c](https://github.com/kiva/ui/commit/62a290cd309f75d2b723bf2ef2582ffe88fcaec0))
* lighthouse run fails when loan is funded, use newest sort instead ([593f450](https://github.com/kiva/ui/commit/593f4507493de89e6fff8a98e6ce86a0f930deaa))
* linting issues ([70cdc64](https://github.com/kiva/ui/commit/70cdc640ef4b8d99b383ecdfa3e1c64b8e99e85a))

## [2.230.0](https://github.com/kiva/ui/compare/v2.229.0...v2.230.0) (2022-07-13)


### Features

* add pfp borrower profile progress bar and story ([37426be](https://github.com/kiva/ui/commit/37426be9b94eabeeed1bae23463c556971e2045c))
* pfp borrower profile top banner ([82be4eb](https://github.com/kiva/ui/commit/82be4eb382409f75589ef93bbdfa64d90d727c52))


### Bug Fixes

* move borrower profile horizontal rule and align save button ([568eb13](https://github.com/kiva/ui/commit/568eb131edd810b36c552f6b6ee450041e560330))
* parseInt for diffInDays ([42f6362](https://github.com/kiva/ui/commit/42f6362506ae17ca13d831fe772b0700d6b8d8b1))

## [2.229.0](https://github.com/kiva/ui/compare/v2.228.1...v2.229.0) (2022-07-13)


### Features

* adding loan spotlight ([#4000](https://github.com/kiva/ui/issues/4000)) ([b95fedf](https://github.com/kiva/ui/commit/b95fedf26aa9bf371270236dd0b1812763c06898))

### [2.228.1](https://github.com/kiva/ui/compare/v2.228.0...v2.228.1) (2022-07-13)


### Bug Fixes

* recommended by lender menu link accessibility fix ([60f0967](https://github.com/kiva/ui/commit/60f0967c9dc5348122317ec3bdaa29e64bbfffcc))

## [2.228.0](https://github.com/kiva/ui/compare/v2.227.2...v2.228.0) (2022-07-13)


### Features

* optimize font loading process ([2cb92c9](https://github.com/kiva/ui/commit/2cb92c921df015d0af552977fe623f4db5a976c4))


### Bug Fixes

* remove old font declarations ([9a4df01](https://github.com/kiva/ui/commit/9a4df0106f577f90a081785ecd987dcd1824e46f))

### [2.227.2](https://github.com/kiva/ui/compare/v2.227.1...v2.227.2) (2022-07-13)


### Bug Fixes

* update lightbox header ([ada31c6](https://github.com/kiva/ui/commit/ada31c67d3d8eda6289e4c2aa0c140200fb41a60))

### [2.227.1](https://github.com/kiva/ui/compare/v2.227.0...v2.227.1) (2022-07-12)


### Bug Fixes

* update lightbox copy and fix info box ([b753bb4](https://github.com/kiva/ui/commit/b753bb4dd8767636e3afa221873411d8f139df1f))

## [2.227.0](https://github.com/kiva/ui/compare/v2.226.0...v2.227.0) (2022-07-12)


### Features

* created method to get saved searches ([e74f26c](https://github.com/kiva/ui/commit/e74f26ce8867516521ae25c06e62886a2d746dc3))

## [2.226.0](https://github.com/kiva/ui/compare/v2.225.0...v2.226.0) (2022-07-12)


### Features

* track lend-by-category and borrower profile page performance ([becfd4e](https://github.com/kiva/ui/commit/becfd4eb4a8b91fedf26283319cc5d8a6377c74d))

## [2.225.0](https://github.com/kiva/ui/compare/v2.224.0...v2.225.0) (2022-07-12)


### Features

* add new page frame and temporary route ([e0aa24c](https://github.com/kiva/ui/commit/e0aa24c0a1cae5cdc3d949b2f13cbcfef7ad67d9))
* adding a saved search page frame and temporary route ([006772a](https://github.com/kiva/ui/commit/006772a942cb9abcb62c493d7f730d4fbc755b46))

## [2.224.0](https://github.com/kiva/ui/compare/v2.223.0...v2.224.0) (2022-07-11)


### Features

* pager now uses new KvMaterialIcon ([eea560a](https://github.com/kiva/ui/commit/eea560a048c973c791247c3c21d292d5d31aaaa5))

## [2.223.0](https://github.com/kiva/ui/compare/v2.222.0...v2.223.0) (2022-07-11)


### Features

* combine pager components ([6d9bac1](https://github.com/kiva/ui/commit/6d9bac1994e7fda6f0f17e9e6ead029579f7e5c6))


### Bug Fixes

* added missing semicolon ([ea02c24](https://github.com/kiva/ui/commit/ea02c24b6dc851fc3c6227e7c78f82a2eb0385a3))
* load first page if offset too large for lend API and watch browser page query change ([38b81d0](https://github.com/kiva/ui/commit/38b81d08059776b8e684b705afe29576e0cd0878))
* remove unneed template string ([4c8c370](https://github.com/kiva/ui/commit/4c8c37097fb8cf0d3b8778f55a3bbf605774b469))
* removed JIT tailwind classes and change for new eslint rule ([0323e2e](https://github.com/kiva/ui/commit/0323e2e189b0ed92584b2040b3aacf8606f9f087))

## [2.222.0](https://github.com/kiva/ui/compare/v2.221.4...v2.222.0) (2022-07-11)


### Features

* readme for loan search ([03a946b](https://github.com/kiva/ui/commit/03a946bc4d03263275c940b1b5a3f5599f50ac19))
* refactored loanSearchUtils ([e1289b8](https://github.com/kiva/ui/commit/e1289b867343f7227e50ab2969c3ca42df2cda6b))


### Bug Fixes

* minor readme adjustments ([b6c7832](https://github.com/kiva/ui/commit/b6c78324a50f9a88d5a46c31cbd4fd8aa9162272))
* renamed lodash in tests for consistency ([69b58b1](https://github.com/kiva/ui/commit/69b58b1b4a02069a9488d829cc3dd4e497fb1f8b))
* whitespace issue ([acb8c11](https://github.com/kiva/ui/commit/acb8c11f848dfb7c41b55b73ec17c5e250868d9d))

### [2.221.4](https://github.com/kiva/ui/compare/v2.221.3...v2.221.4) (2022-07-08)


### Bug Fixes

* added missing loan card padding ([18c26e6](https://github.com/kiva/ui/commit/18c26e6fc9143bb0df30eae5e610a7ac5683bc78))

### [2.221.3](https://github.com/kiva/ui/compare/v2.221.2...v2.221.3) (2022-07-08)


### Bug Fixes

* change back to last page if offset too large for result set ([3850dfb](https://github.com/kiva/ui/commit/3850dfbe76c8988b3c9177c5c992c41e0cde9d79))

### [2.221.2](https://github.com/kiva/ui/compare/v2.221.1...v2.221.2) (2022-07-07)


### Bug Fixes

* initial load has all facets regardless of query params ([cf5be4e](https://github.com/kiva/ui/commit/cf5be4e35a7065de602188695205be1df2732d72))

### [2.221.1](https://github.com/kiva/ui/compare/v2.221.0...v2.221.1) (2022-07-07)


### Bug Fixes

* use optimized default make-fetch-happen agent instead of custom agent ([a44d1ab](https://github.com/kiva/ui/commit/a44d1ab66be8e8663d5e653a8d19163b87fbd2f8))

## [2.221.0](https://github.com/kiva/ui/compare/v2.220.4...v2.221.0) (2022-07-07)


### Features

* loan filter chips show/hide toggle ([29a6c71](https://github.com/kiva/ui/commit/29a6c715e93ddf4c3f1de06158648b3997a29812))


### Bug Fixes

* more specific container class ([1edd119](https://github.com/kiva/ui/commit/1edd119282a3822bc8eb11b3d3f4a189cde0e356))

### [2.220.4](https://github.com/kiva/ui/compare/v2.220.3...v2.220.4) (2022-07-07)


### Bug Fixes

* add snowplow events around employee verification and team join processes ([4269548](https://github.com/kiva/ui/commit/4269548828b61408c355471348686f9134d66c20))

### [2.220.3](https://github.com/kiva/ui/compare/v2.220.2...v2.220.3) (2022-07-06)


### Bug Fixes

* allow utm query params through into experiment ([f3996c0](https://github.com/kiva/ui/commit/f3996c0d5efdea715d22670770dfd7cdb2072095))

### [2.220.2](https://github.com/kiva/ui/compare/v2.220.1...v2.220.2) (2022-07-06)


### Bug Fixes

* add tracking to matched loans ([4c0d149](https://github.com/kiva/ui/commit/4c0d1497bf45d4f06f345ba8a93d5640cab0ac97))

### [2.220.1](https://github.com/kiva/ui/compare/v2.220.0...v2.220.1) (2022-07-06)


### Bug Fixes

* fixed copy share link params structure ([df5e50e](https://github.com/kiva/ui/commit/df5e50e141a561a06b6c2037800f50a7af4fac3a))

## [2.220.0](https://github.com/kiva/ui/compare/v2.219.0...v2.220.0) (2022-07-05)


### Features

* initial theme ID filter implementation ([61678fd](https://github.com/kiva/ui/commit/61678fdb473297d7f4d433fd4548b495369da0bb))


### Bug Fixes

* algolia attributes query param wasn't being handled ([bda6898](https://github.com/kiva/ui/commit/bda6898854582625c8741664a26f173f4ec55ba0))
* cleaned up unit tests so this changeset can be held in the branch for later ([f635ef3](https://github.com/kiva/ui/commit/f635ef380232f110127218f49bbe3426e3a0bea7))
* missing unit test, analytics bug, minor cleanup ([e9b4639](https://github.com/kiva/ui/commit/e9b463980dc4e9a287ba5375b3a7070ca52a6138))

## [2.219.0](https://github.com/kiva/ui/compare/v2.218.0...v2.219.0) (2022-07-05)


### Features

* loan filter chips tests and stories ([5e40587](https://github.com/kiva/ui/commit/5e405871a23af63079e9035b0a6a88bd8ca3ca87))

## [2.218.0](https://github.com/kiva/ui/compare/v2.217.0...v2.218.0) (2022-07-05)


### Features

* adding category mouseover effects ([#3967](https://github.com/kiva/ui/issues/3967)) ([ff887ee](https://github.com/kiva/ui/commit/ff887ee13488feb71a8068a4e0bf93726358b01e))

## [2.217.0](https://github.com/kiva/ui/compare/v2.216.1...v2.217.0) (2022-07-05)


### Features

* watcher added to track event for complete loan experiment ([414a67d](https://github.com/kiva/ui/commit/414a67da21a36c5d3fdf83276a0c5374f6d002ad))


### Bug Fixes

* pushing not included amounts to selector for all price ranges ([e855490](https://github.com/kiva/ui/commit/e8554900d23d7a35034d3769853f02242588cb23))

### [2.216.1](https://github.com/kiva/ui/compare/v2.216.0...v2.216.1) (2022-07-05)


### Bug Fixes

* bugs related to FLSS loan channel ([d6b072c](https://github.com/kiva/ui/commit/d6b072cd66000e6148980aabc15f7e45bcca0e26))

## [2.216.0](https://github.com/kiva/ui/compare/v2.215.0...v2.216.0) (2022-07-05)


### Features

* apply location to query params filtering and shared state ([7eda2a9](https://github.com/kiva/ui/commit/7eda2a9869dbbf8a02e78c747a8bbe6ba42d8984))


### Bug Fixes

* missing story for active ISO codes ([08bac1f](https://github.com/kiva/ui/commit/08bac1fe6b0f7c86a3ca2916d5f9849a8370abcc))

## [2.215.0](https://github.com/kiva/ui/compare/v2.214.2...v2.215.0) (2022-07-05)


### Features

* use canvas pool to reduce live-loan memory usage ([2e474d8](https://github.com/kiva/ui/commit/2e474d834a28cbd627fa4456068262b2d07b2b28))

### [2.214.2](https://github.com/kiva/ui/compare/v2.214.1...v2.214.2) (2022-07-05)


### Bug Fixes

* use automatic handling of memcached connection issues ([879ac88](https://github.com/kiva/ui/commit/879ac88558b185e441769be00681b202cfc9df49))

### [2.214.1](https://github.com/kiva/ui/compare/v2.214.0...v2.214.1) (2022-07-01)


### Bug Fixes

* missing punctuation ([d1271c9](https://github.com/kiva/ui/commit/d1271c90f4ad979b4efc6a3fdd7a5b325e0cfbd6))

## [2.214.0](https://github.com/kiva/ui/compare/v2.213.2...v2.214.0) (2022-07-01)


### Features

* distribution model to FLSS channel mapping ([7097c4d](https://github.com/kiva/ui/commit/7097c4d986ed6a284a83c183659810cb70a318b3))
* experiment switching loan channel data to FLSS ([0b8f365](https://github.com/kiva/ui/commit/0b8f36586958eeb380507b8bffbffa67c36a32bd))
* loan channel FLSS experiment tracking ([c95ab1a](https://github.com/kiva/ui/commit/c95ab1aaa03585462bf483334466cc84d4f57af6))


### Bug Fixes

* added defensive code and cleaned up code consistency ([1ff9883](https://github.com/kiva/ui/commit/1ff988332a1dc71c8192679b0c369f5d913ac541))
* matched the promise chain pattern ([da39b8f](https://github.com/kiva/ui/commit/da39b8f6583802d7b009cc329bacddb401b6c902))

### [2.213.2](https://github.com/kiva/ui/compare/v2.213.1...v2.213.2) (2022-06-30)


### Bug Fixes

* update copy for borrower profile share card ([2033dad](https://github.com/kiva/ui/commit/2033dad7c3fb477f3984b1d806a9708f7fd5909f))

### [2.213.1](https://github.com/kiva/ui/compare/v2.213.0...v2.213.1) (2022-06-30)


### Bug Fixes

* add inviter name to shareLink func ([5b112d2](https://github.com/kiva/ui/commit/5b112d2e986c2953591e788ea66d627a2ad0f60f))
* canonical loop issue ([cd1b224](https://github.com/kiva/ui/commit/cd1b22434fe60935c744dff55e70c026631a4ee0))
* resolve conflicts ([cf92a18](https://github.com/kiva/ui/commit/cf92a18d5d37153f6fb7e34a8ba84d586f8afe83))

## [2.213.0](https://github.com/kiva/ui/compare/v2.212.1...v2.213.0) (2022-06-30)


### Features

* recommended by lender category, category page ([dae992f](https://github.com/kiva/ui/commit/dae992f32fdf0e9f0238ede07af54384792712f5))


### Bug Fixes

* moved recommended by lenders category page to new route to avoid duplicate prefetch ([b4c255c](https://github.com/kiva/ui/commit/b4c255c10f4149b1f4bd3e363b92d8a6b84f11b4))

### [2.212.1](https://github.com/kiva/ui/compare/v2.212.0...v2.212.1) (2022-06-30)


### Bug Fixes

* move version tag to template file ([51a06b0](https://github.com/kiva/ui/commit/51a06b03371b7c7746c885c65336dc4ee36bcb04))

## [2.212.0](https://github.com/kiva/ui/compare/v2.211.0...v2.212.0) (2022-06-30)


### Features

* matched loans lightbox ([238cddf](https://github.com/kiva/ui/commit/238cddfa0fa48e0251529ca776b32af1119d5edb))
* update copy text for matched loans ([5837a04](https://github.com/kiva/ui/commit/5837a046ce0adb0085ede8b952f5fba8b15a4bdb))
* update lightbox ([552c25a](https://github.com/kiva/ui/commit/552c25a3e798783d4347797e722d28dfa62174df))

## [2.211.0](https://github.com/kiva/ui/compare/v2.210.0...v2.211.0) (2022-06-30)


### Features

* datadog unified service tagging & profiling, and limit node max old space ([569df67](https://github.com/kiva/ui/commit/569df67d411afad7a40351641cafa934b813e03a))

## [2.210.0](https://github.com/kiva/ui/compare/v2.209.0...v2.210.0) (2022-06-29)


### Features

* linking categories to category pages and additional PR comments ([#3958](https://github.com/kiva/ui/issues/3958)) ([bb59eed](https://github.com/kiva/ui/commit/bb59eed9a4201113b6d10e5154c9ae78e48d75ac))

## [2.209.0](https://github.com/kiva/ui/compare/v2.208.3...v2.209.0) (2022-06-28)


### Features

* animated sparkles were added to complete loan experiment buttons ([838e013](https://github.com/kiva/ui/commit/838e01322730607b69daa490b3b5c969e237e433))

### [2.208.3](https://github.com/kiva/ui/compare/v2.208.2...v2.208.3) (2022-06-28)


### Bug Fixes

* corporate campaign logo in footer distortion ([d414462](https://github.com/kiva/ui/commit/d4144621e167c72b85187a0b96a3701cd478e9c9))

### [2.208.2](https://github.com/kiva/ui/compare/v2.208.1...v2.208.2) (2022-06-28)


### Bug Fixes

* set missing publicId variable and only include lender info when publicId is set ([4b820c2](https://github.com/kiva/ui/commit/4b820c28973095d270519515c487d5298f070712))

### [2.208.1](https://github.com/kiva/ui/compare/v2.208.0...v2.208.1) (2022-06-28)


### Bug Fixes

* error getting cache for viewtoggle component ([437b427](https://github.com/kiva/ui/commit/437b4270157279c9ba6467771f3bcc36e9fcfaa6))

## [2.208.0](https://github.com/kiva/ui/compare/v2.207.0...v2.208.0) (2022-06-27)


### Features

* added share car language experiment ([1268710](https://github.com/kiva/ui/commit/12687108e69112e8e3cb36f6c9870f7bb8d91e68))
* change button message when loan is in basket and add dollar sign in cta button ([cf6a464](https://github.com/kiva/ui/commit/cf6a464d5bd8d3e269186886d674e5e49ec57354))
* increase number of allowed webpack chunks ([6eb05e5](https://github.com/kiva/ui/commit/6eb05e51a4b3aad354f41e19342061d39eda04c4))
* preconnect to fastly ([ab3da96](https://github.com/kiva/ui/commit/ab3da96a2cce4a39ffa6feb32a3dfe7cc32b0f2c))


### Bug Fixes

* more changes after code review ([e2748e3](https://github.com/kiva/ui/commit/e2748e351c9396397aeb3a6683ef62231e55dbc1))
* redirect to lend/id when loan status is not fundraising ([85ead44](https://github.com/kiva/ui/commit/85ead444f2d8500b08287c91439b9255b21fbd06))
* show check icon in checkout button ([4a31a95](https://github.com/kiva/ui/commit/4a31a95a9f596b50ad003e7e1ececaa04a305b6a))
* small fixes after code review ([321d6ef](https://github.com/kiva/ui/commit/321d6efa34f6a16413a92405a378f723c583d85f))
* use slot section inside kv-ui-button ([b6c1e50](https://github.com/kiva/ui/commit/b6c1e5084b3559934fdac5f1b96935310d17c41e))
* validate public path url ([e87947c](https://github.com/kiva/ui/commit/e87947c8b6c0e54b50a9b977846f77bfc1e29b6f))

## [2.207.0](https://github.com/kiva/ui/compare/v2.206.4...v2.207.0) (2022-06-24)


### Features

* upgrading @kiva/kv-components to v3.0.6 and @kiva/kv-tokens to v.2.1.0 ([#3950](https://github.com/kiva/ui/issues/3950)) ([2328259](https://github.com/kiva/ui/commit/232825995d46ffd1e2c3ded8b531177eec0fe6e2))

### [2.206.4](https://github.com/kiva/ui/compare/v2.206.3...v2.206.4) (2022-06-24)


### Bug Fixes

* show experiment thanks page for version b ([e392623](https://github.com/kiva/ui/commit/e3926235d23d4d894f031ea3d0ecf215ef3422ad))

### [2.206.3](https://github.com/kiva/ui/compare/v2.206.2...v2.206.3) (2022-06-23)


### Bug Fixes

* move exp tracking to mounted hook and remove eligibility gating around analytics on lend/filter ([f942f33](https://github.com/kiva/ui/commit/f942f33ac46f12ed86bf4f6ca6d7f5bbcc7d3b9b))

### [2.206.2](https://github.com/kiva/ui/compare/v2.206.1...v2.206.2) (2022-06-23)


### Bug Fixes

* add missing word loan ([8df10b5](https://github.com/kiva/ui/commit/8df10b535f84827975bc4e042055fbd2781a25d8))

### [2.206.1](https://github.com/kiva/ui/compare/v2.206.0...v2.206.1) (2022-06-23)


### Bug Fixes

* error handling for upsell loans ([b7d6599](https://github.com/kiva/ui/commit/b7d6599bd0dedeeb43d70ce98baae944298e9f8e))
* update tracking info ([4097e1e](https://github.com/kiva/ui/commit/4097e1e36073bf55a142f056f9946f0af94b4d38))

## [2.206.0](https://github.com/kiva/ui/compare/v2.205.0...v2.206.0) (2022-06-22)


### Features

* add utm content to share link ([f76096a](https://github.com/kiva/ui/commit/f76096a4e87558e640aaada51b889d6fec764f1a))
* add utm_content to base SocialSharev2 sharelink ([8803edc](https://github.com/kiva/ui/commit/8803edc2c5f450ef91a3f2aad08bb45ec39f71c3))
* adding utm_content for new social share version component ([72d84e6](https://github.com/kiva/ui/commit/72d84e6d89956c9912bd34ca9ed6da9fa62d6dca))
* some small updates ([1ea6650](https://github.com/kiva/ui/commit/1ea665067d99e4461c0fa187d0e53b8b09900ac8))


### Bug Fixes

* added anonymazation level validation ([072694f](https://github.com/kiva/ui/commit/072694fbbee99df51ef84f162eb717d85d46f9ce))
* small improvement ([4ecc51b](https://github.com/kiva/ui/commit/4ecc51b0b76de955d854a593d719a60f314c0e25))
* solve conflicts in Thanks Page ([8e8335d](https://github.com/kiva/ui/commit/8e8335de5259dc006e8ed036d2be8047dd291abd))
* update changes in copyLink method ([aa6d39a](https://github.com/kiva/ui/commit/aa6d39a1d305cfee95a3eddbf41722c1761fc102))
* update seo borrower profile title and description ([06a6e00](https://github.com/kiva/ui/commit/06a6e0093daec80995db69b570dfcc642a8acaf2))
* validate if inviterName prop exists in lender ([dd6fc6a](https://github.com/kiva/ui/commit/dd6fc6a82a0d10cb872ea385bcf1ddf88b27681c))

## [2.205.0](https://github.com/kiva/ui/compare/v2.204.0...v2.205.0) (2022-06-22)


### Features

* added flssLoanSearchState channel mapping ([b265e6c](https://github.com/kiva/ui/commit/b265e6c75070be7df93e2fca260f58b82d7d9451))


### Bug Fixes

* added missing FLSS mapping ([75bfa07](https://github.com/kiva/ui/commit/75bfa076c998cac2cab585f5107a74a3cc1cb223))
* added some empty FLSS mappings ([4a8665b](https://github.com/kiva/ui/commit/4a8665b4edfec6d8693bfbd727d5c310cad95e4c))
* simplified mapping name ([1c2086a](https://github.com/kiva/ui/commit/1c2086ab8717c18b90734a301ea353a05246089e))
* updated incorrect mapping URL ([8182429](https://github.com/kiva/ui/commit/8182429a20d479bd6b1b811ab32da54c9b01a37a))
* updated to sectorId and removed some incompatible channels ([27948a6](https://github.com/kiva/ui/commit/27948a6b575726023caeb02a92dc9f00d2dba851))

## [2.204.0](https://github.com/kiva/ui/compare/v2.203.0...v2.204.0) (2022-06-22)


### Features

* make LoanSearchLocationFilter reactive to loanSearchState ([eccb90e](https://github.com/kiva/ui/commit/eccb90e7662f13382616e3955a6a98ec608f4a05))
* make location filter state reactive to loanSearchState, add utils for mapping iso to name ([cf4d209](https://github.com/kiva/ui/commit/cf4d2093cf9d8250b89d5977df5bc1835edf4101))

## [2.203.0](https://github.com/kiva/ui/compare/v2.202.0...v2.203.0) (2022-06-22)


### Features

* checkout experience for matched loans ([6b0ead5](https://github.com/kiva/ui/commit/6b0ead5a2a7f3753e970e792de1cef9eb43231c6))
* implement disabled matching when credit applied ([e09cf78](https://github.com/kiva/ui/commit/e09cf789013105918566d85963a5c5f4feaa6333))


### Bug Fixes

* remove scss styles ([f510db6](https://github.com/kiva/ui/commit/f510db60352fe6c6c2dd813fe14eb880fd2b4e22))

## [2.202.0](https://github.com/kiva/ui/compare/v2.201.0...v2.202.0) (2022-06-22)


### Features

* guard added to check if the loan price is included in the prices array for non 25 increments ([e2fe53e](https://github.com/kiva/ui/commit/e2fe53edb3289f2d900ec226aa3e38b49cefc24d))

## [2.201.0](https://github.com/kiva/ui/compare/v2.200.3...v2.201.0) (2022-06-22)


### Features

* remove MARS-96 experiment code and simplify share experience ([6ad1afa](https://github.com/kiva/ui/commit/6ad1afa8ec5f26fb26828ecdf0bdaeaebadd47a3))

### [2.200.3](https://github.com/kiva/ui/compare/v2.200.2...v2.200.3) (2022-06-22)


### Bug Fixes

* fixed styles ([f747bf4](https://github.com/kiva/ui/commit/f747bf4fec6fa934c6d8a548c92929c163753e3d))

### [2.200.2](https://github.com/kiva/ui/compare/v2.200.1...v2.200.2) (2022-06-22)


### Bug Fixes

* update developer tools readme ([8a310bd](https://github.com/kiva/ui/commit/8a310bda2528bb475d95c128f83b968aac213007))

### [2.200.1](https://github.com/kiva/ui/compare/v2.200.0...v2.200.1) (2022-06-22)


### Bug Fixes

* added small changes to new share thanks page ([5b1d47b](https://github.com/kiva/ui/commit/5b1d47b431359a473138b8b7f1451992faf4265d))

## [2.200.0](https://github.com/kiva/ui/compare/v2.199.1...v2.200.0) (2022-06-21)


### Features

* add basket state + keep it up to date after add to basket actions ([a075752](https://github.com/kiva/ui/commit/a07575263f2954886235d287757abd12f2bfcc14))
* always show certain themes ([53eb420](https://github.com/kiva/ui/commit/53eb42084fddbe38da7c79cbc63354b8762319a3))

### [2.199.1](https://github.com/kiva/ui/compare/v2.199.0...v2.199.1) (2022-06-21)


### Bug Fixes

* complete loan tracking was removed from lendamount component ([f02e529](https://github.com/kiva/ui/commit/f02e529199650051065a2e0db0439eea67fe312b))

## [2.199.0](https://github.com/kiva/ui/compare/v2.198.3...v2.199.0) (2022-06-21)


### Features

* filter chip click analytics ([6d5e1e2](https://github.com/kiva/ui/commit/6d5e1e24e4816c7fb25a9438891c4de4c21f33c4))


### Bug Fixes

* simplified label format ([f107fd5](https://github.com/kiva/ui/commit/f107fd56e1f07f95f9398f41785b93e4a3b68532))

### [2.198.3](https://github.com/kiva/ui/compare/v2.198.2...v2.198.3) (2022-06-21)


### Bug Fixes

* remove promoOnly param from loan query due to empty results when applied ([18dedc4](https://github.com/kiva/ui/commit/18dedc4fcdceae4bd634feeb99c3a01fd28c6289))

### [2.198.2](https://github.com/kiva/ui/compare/v2.198.1...v2.198.2) (2022-06-21)


### Bug Fixes

* sector chips removal updated ([47d6c9f](https://github.com/kiva/ui/commit/47d6c9f190cb846b2188a03ba8305b1fd1fe3b0c))

### [2.198.1](https://github.com/kiva/ui/compare/v2.198.0...v2.198.1) (2022-06-20)


### Bug Fixes

* create specific route to handle theme_refugees/displaced path segment snafu ([66eeee9](https://github.com/kiva/ui/commit/66eeee99cf43e0658e73425b3deb7e497475d7d7))

## [2.198.0](https://github.com/kiva/ui/compare/v2.197.0...v2.198.0) (2022-06-20)


### Features

* activate filter chips for individual facet removal ([430ba78](https://github.com/kiva/ui/commit/430ba78becf360894ee8a022af518f36d3208ad1))

## [2.197.0](https://github.com/kiva/ui/compare/v2.196.1...v2.197.0) (2022-06-17)


### Features

* show note about Recommended loan sort based on login state ([e2f5d3c](https://github.com/kiva/ui/commit/e2f5d3c15c9b03d98abba9bcc6bb4d1c54a20bdb))

### [2.196.1](https://github.com/kiva/ui/compare/v2.196.0...v2.196.1) (2022-06-17)


### Bug Fixes

* exclude popularity sort as eligible for the experiment ([cba6595](https://github.com/kiva/ui/commit/cba65957976caac2be1937644f71d13b738b314e))

## [2.196.0](https://github.com/kiva/ui/compare/v2.195.0...v2.196.0) (2022-06-17)


### Features

* change isomorphic fetch to make fetch happen library in server side ([5b4257c](https://github.com/kiva/ui/commit/5b4257c63f8458b81d7dbdd9c6334967b33c89b4))
* modify createApolloClient to use fetch func library depending on server/client side ([ae12efd](https://github.com/kiva/ui/commit/ae12efde4ffe7ee4b171dc85e854384b051e9953))


### Bug Fixes

* remove redirect routes from site map ([b4d9ac2](https://github.com/kiva/ui/commit/b4d9ac2b1a5c372c271c7a05b7ec02d846be1a49))
* small improvement ([e740fae](https://github.com/kiva/ui/commit/e740fae4ea4a76f287a82f4d0b3781f213954997))

## [2.195.0](https://github.com/kiva/ui/compare/v2.194.0...v2.195.0) (2022-06-17)


### Features

* new thanks share page ([80593ba](https://github.com/kiva/ui/commit/80593ba69a0f46e0346126aece7471bd46a6c0ca))
* work in progress ([550fe07](https://github.com/kiva/ui/commit/550fe070c10db601dc607c61ff7de4d9c417f061))


### Bug Fixes

* added receipt propery data ([343751c](https://github.com/kiva/ui/commit/343751c0beedf668e5d4f62c3195554b5947e223))
* pr corrections after code review ([0f314fa](https://github.com/kiva/ui/commit/0f314fa8a9fa7eb8ed7abbe116e7b74e060a00e5))
* validate experiment variables ([e891a6d](https://github.com/kiva/ui/commit/e891a6d2585c917494649928fafc635fdc083202))

## [2.194.0](https://github.com/kiva/ui/compare/v2.193.0...v2.194.0) (2022-06-17)


### Features

* filter chips ([fbb7ee5](https://github.com/kiva/ui/commit/fbb7ee57025e265c913fd336aedd95b638c5d9ec))

## [2.193.0](https://github.com/kiva/ui/compare/v2.192.0...v2.193.0) (2022-06-17)


### Features

* add manual tracing ([ef9049e](https://github.com/kiva/ui/commit/ef9049eeef551f4ff990d2a1d7509abc1a54e981))

## [2.192.0](https://github.com/kiva/ui/compare/v2.191.2...v2.192.0) (2022-06-17)


### Features

* reset page offset when filtering, fixed analytics URL ([852c351](https://github.com/kiva/ui/commit/852c351237f26ff3b63bba8d2d88deb419ab0ade))

### [2.191.2](https://github.com/kiva/ui/compare/v2.191.1...v2.191.2) (2022-06-17)


### Bug Fixes

* accommodate overreserved loans ([194b8ed](https://github.com/kiva/ui/commit/194b8edd9f3f3b2d3ee1ec463bb46254ffb840ee))
* whoops ([3643c6e](https://github.com/kiva/ui/commit/3643c6ec7e31eb1e9afd56a88fc63a4c53630ff3))

### [2.191.1](https://github.com/kiva/ui/compare/v2.191.0...v2.191.1) (2022-06-16)


### Bug Fixes

* double tracking was fixed for complete loan experiment ([dacf346](https://github.com/kiva/ui/commit/dacf346f9dea7bda6aa7e205d42b137d78060de3))

## [2.191.0](https://github.com/kiva/ui/compare/v2.190.2...v2.191.0) (2022-06-16)


### Features

* zero loans reset analytics ([47f4c2c](https://github.com/kiva/ui/commit/47f4c2c0cf38c545fa90254b36499f2f17bf0706))

### [2.190.2](https://github.com/kiva/ui/compare/v2.190.1...v2.190.2) (2022-06-16)


### Bug Fixes

* selected amount was added to view tracking for complete loan test ([b0a5bc8](https://github.com/kiva/ui/commit/b0a5bc8e7a1c7f47c01c77d2484b5c60b0c79463))

### [2.190.1](https://github.com/kiva/ui/compare/v2.190.0...v2.190.1) (2022-06-16)


### Bug Fixes

* update layout of mobile vs desktop filter interface ([dc69963](https://github.com/kiva/ui/commit/dc6996300a7f3b74f22718ec9f3038dab3b74b07))

## [2.190.0](https://github.com/kiva/ui/compare/v2.189.0...v2.190.0) (2022-06-16)


### Features

* added 0 loans state ([95b30f9](https://github.com/kiva/ui/commit/95b30f944ddb65d675fcdf3fc41e796cb5098fad))
* added results per page analytics ([2db1d97](https://github.com/kiva/ui/commit/2db1d9790712098bea2591931f68f8c37650013c))
* results per page component ([77b4d5f](https://github.com/kiva/ui/commit/77b4d5fcc48e50b947ec9140e4bc206897c80857))

## [2.189.0](https://github.com/kiva/ui/compare/v2.188.2...v2.189.0) (2022-06-16)


### Features

* pager analytics ([caef613](https://github.com/kiva/ui/commit/caef613132144306c2702536bdb78a6739a69ab3))
* removed amountLeft sort ([d108261](https://github.com/kiva/ui/commit/d108261b83fd5961dca880d5da41dca44d06c821))
* set analytics URL on filter change ([38d1f3f](https://github.com/kiva/ui/commit/38d1f3f43f2004843cc2a5f996dce9e791152bc8))

### [2.188.2](https://github.com/kiva/ui/compare/v2.188.1...v2.188.2) (2022-06-16)


### Bug Fixes

* bugs for complete loan experiment were fixed ([3cb27df](https://github.com/kiva/ui/commit/3cb27dfd1f6c828d5822dc4fb25d24ec06fb6d57))

### [2.188.1](https://github.com/kiva/ui/compare/v2.188.0...v2.188.1) (2022-06-16)


### Bug Fixes

* do not show reserved loans for upsells on checkout ([deea573](https://github.com/kiva/ui/commit/deea5733a9885d342a5d69bd5aa50a12b71f0d6f))
* fallbacks ([65c85c3](https://github.com/kiva/ui/commit/65c85c3ef2bcea90059a46fa7f290247543135a2))
* update to use method from loan utils ([338b456](https://github.com/kiva/ui/commit/338b456d8ba489619081e3855ad43dcef4a9c23f))

## [2.188.0](https://github.com/kiva/ui/compare/v2.187.1...v2.188.0) (2022-06-15)


### Features

* page query param support ([99f603f](https://github.com/kiva/ui/commit/99f603f56bbefcd6334acba90b54a18d37834385))


### Bug Fixes

* merge issue with tests ([cd596d9](https://github.com/kiva/ui/commit/cd596d9061a0e837e6dac7162e8b91393b269986))

### [2.187.1](https://github.com/kiva/ui/compare/v2.187.0...v2.187.1) (2022-06-15)


### Bug Fixes

* hide lend button when all shared are reserved ([a5f4a38](https://github.com/kiva/ui/commit/a5f4a387aab57b2906c105ac220b63d935a7d79d))

## [2.187.0](https://github.com/kiva/ui/compare/v2.186.0...v2.187.0) (2022-06-14)


### Features

* added hits length in analytics ([a2b2d2d](https://github.com/kiva/ui/commit/a2b2d2df6f6d7c5cf0559037320fa7e1b5c5a9ed))
* updated route hook to allow skipping analytics ([484bfe9](https://github.com/kiva/ui/commit/484bfe9ddd69691eb92514870e538b602a39a0fb))

## [2.186.0](https://github.com/kiva/ui/compare/v2.185.0...v2.186.0) (2022-06-14)


### Features

* add selected and deseleted notation on filter click events ([0565027](https://github.com/kiva/ui/commit/056502729d093a67cb26a10a444b34c35fe228db))

## [2.185.0](https://github.com/kiva/ui/compare/v2.184.1...v2.185.0) (2022-06-14)


### Features

* activate redirect experiment to split traffic between lend filter pages ([9e149ef](https://github.com/kiva/ui/commit/9e149ef7053b1e9efc82a60038edd07612dc617e))

### [2.184.1](https://github.com/kiva/ui/compare/v2.184.0...v2.184.1) (2022-06-14)


### Bug Fixes

* add se_label to upsell module tracking ([3009637](https://github.com/kiva/ui/commit/300963752ce71c7e98c452f30acaf8ccb3fbc061))

## [2.184.0](https://github.com/kiva/ui/compare/v2.183.0...v2.184.0) (2022-06-14)


### Features

* new loan filter pager component ([fa04447](https://github.com/kiva/ui/commit/fa044474a0b3ff2a70d0438f0e815be5df6b11e7))


### Bug Fixes

* changed page number usage to more generic limit/offset ([35f16f4](https://github.com/kiva/ui/commit/35f16f4edc425f9e21bb8ee0182ad7668aee230a))
* minor tweaks ([78783df](https://github.com/kiva/ui/commit/78783dff3476b0f779699483259302e90a5986d8))

## [2.183.0](https://github.com/kiva/ui/compare/v2.182.0...v2.183.0) (2022-06-14)


### Features

* bp complete loan experiment was added ([72a1a9d](https://github.com/kiva/ui/commit/72a1a9d9ee69e3251c74dc8ee6684eca376fcc46))


### Bug Fixes

* tracking was fixed for lendcta button ([622e1df](https://github.com/kiva/ui/commit/622e1df8d469a3bfab72a05559a4ffd45ff7ba4b))

## [2.182.0](https://github.com/kiva/ui/compare/v2.181.0...v2.182.0) (2022-06-13)


### Features

* added a couple more filter analytics ([c5b12aa](https://github.com/kiva/ui/commit/c5b12aa862fd82b09ffd9815b97b12412cea15f6))
* added more filter analytics ([3f730d4](https://github.com/kiva/ui/commit/3f730d479acb0c68ffed186adcc03c0f7caea9a7))
* loan query results tracking ([b957c1a](https://github.com/kiva/ui/commit/b957c1aecc6dae971de026994a6b429ba5813835))


### Bug Fixes

* ensured ID order sent to analytics matches displayed order ([9825f3c](https://github.com/kiva/ui/commit/9825f3cce5d22a29b6652233894b85f560f81f0a))

## [2.181.0](https://github.com/kiva/ui/compare/v2.180.0...v2.181.0) (2022-06-13)


### Features

* add contentful page detail to processPageContent func and modify tests ([2fa4fd3](https://github.com/kiva/ui/commit/2fa4fd309a2eafc55daf74c660bc6e5b631b2c9e))
* add pageDescription and canonicalUrl fields to contentfulObject ([cf9704b](https://github.com/kiva/ui/commit/cf9704bedafb5287fc4da7f852caf39aabbeaad6))
* add seo information to borrow center ([0e2ead3](https://github.com/kiva/ui/commit/0e2ead34f48b1b97ff13fc9ba1a235c7e2f17cdc))
* fire events when user cancels, shares or gets an error in facebook share response ([8d4daed](https://github.com/kiva/ui/commit/8d4daed292c1d0a020a739d35cdd592cf4850d06))
* install optimizely and integrate with snowplow ([6f4b0e1](https://github.com/kiva/ui/commit/6f4b0e1993bc63064b479dfe9f08f7b1daf45138))

## [2.180.0](https://github.com/kiva/ui/compare/v2.179.0...v2.180.0) (2022-06-10)


### Features

* add tag to UI_REVISION page, add tag as release param in Sentry ([bd4eb9c](https://github.com/kiva/ui/commit/bd4eb9cdb033338a08f6fd63d1830e0e15755e4f))

## [2.179.0](https://github.com/kiva/ui/compare/v2.178.0...v2.179.0) (2022-06-10)


### Features

* activated advanced filter link and analytics ([d130cb0](https://github.com/kiva/ui/commit/d130cb0737fa60f65abfdfbe91d6e79d7fab3c01))
* activated reset filter and added analytics ([d39af89](https://github.com/kiva/ui/commit/d39af89b035221c2e15c25ff5e95c90f89169f71))

## [2.178.0](https://github.com/kiva/ui/compare/v2.177.0...v2.178.0) (2022-06-10)


### Features

* section loader for loans and filters ([b292907](https://github.com/kiva/ui/commit/b29290747389d19f9bcd4c8db8473947f57ea62d))


### Bug Fixes

* added prop validation ([b61f61a](https://github.com/kiva/ui/commit/b61f61add656ceb21718a26379a1d4a117f3a1f7))
* better vue class usage ([46fa1ae](https://github.com/kiva/ui/commit/46fa1ae17b22fef3ef47dd8b3980b463e6840170))

## [2.177.0](https://github.com/kiva/ui/compare/v2.176.2...v2.177.0) (2022-06-10)


### Features

* changed Braintree dropin error content to include support email ([b2b2698](https://github.com/kiva/ui/commit/b2b269829b4d1e5064d8247db13de75b81c26d2c))

### [2.176.2](https://github.com/kiva/ui/compare/v2.176.1...v2.176.2) (2022-06-10)


### Bug Fixes

* add tracking to upsells ([795c9a6](https://github.com/kiva/ui/commit/795c9a6eb23796906790c887c43db9c524d7555c))

### [2.176.1](https://github.com/kiva/ui/compare/v2.176.0...v2.176.1) (2022-06-10)


### Bug Fixes

* fixes campaign page loan carousel not scrolling on page load ([06c2a94](https://github.com/kiva/ui/commit/06c2a94317f41c97b91d4dda5d0e89ae2811c96f))

## [2.176.0](https://github.com/kiva/ui/compare/v2.175.0...v2.176.0) (2022-06-09)


### Features

* fix lint ([c9b3968](https://github.com/kiva/ui/commit/c9b39686dcd9c7b0aa283c818aa38c788fbb56a0))
* init upsell loans on checkout ([4297474](https://github.com/kiva/ui/commit/4297474e949aab9c112a53f95f0d0712d8cfe2ac))


### Bug Fixes

* merge conflict ([6e1b9f0](https://github.com/kiva/ui/commit/6e1b9f0f20eb8c20d29ab9bfeb11a71d6fc5f6d2))
* update styles ([45e0b15](https://github.com/kiva/ui/commit/45e0b15293d4e627aa31f427e2d6d422c6385dd0))
* update styles and fix NaN ([6b9c302](https://github.com/kiva/ui/commit/6b9c3027f148c831a790b1b4edc539aba772daab))

## [2.175.0](https://github.com/kiva/ui/compare/v2.174.1...v2.175.0) (2022-06-08)


### Features

* added num loan fundraising counts to sector filters ([9a24a32](https://github.com/kiva/ui/commit/9a24a32a0bbb9ecfa126eff731752622eae17aac))
* integrate theme filter with query params ([f852af7](https://github.com/kiva/ui/commit/f852af79a5676002b2e206583299618eb7dfb937))
* sector filter now updates query param and can be initialized via query param ([76b0ca7](https://github.com/kiva/ui/commit/76b0ca7dcfd2fc1341d413090e6b2f575f68fad5))


### Bug Fixes

* cleaned up method usage in tests ([120b8cc](https://github.com/kiva/ui/commit/120b8cce1b21f3061a2f8d239e76308fbe8675f2))
* combined graphql queries in runFacetsQueries ([19e439b](https://github.com/kiva/ui/commit/19e439bce918ffa7b575f3ef0fb039200943e099))

### [2.174.1](https://github.com/kiva/ui/compare/v2.174.0...v2.174.1) (2022-06-08)


### Bug Fixes

* typo in tag name ([e32a05b](https://github.com/kiva/ui/commit/e32a05b1b1c24bfd24037f8a54b5c7ea5b03045f))

## [2.174.0](https://github.com/kiva/ui/compare/v2.173.3...v2.174.0) (2022-06-08)


### Features

* matched loans lightbox ([d06be65](https://github.com/kiva/ui/commit/d06be6551da94c0c33591b82da500e1d2630baf4))
* require deposits on matched loans exp ([33acee2](https://github.com/kiva/ui/commit/33acee29351d692924056a36b56bbca4438680f7))


### Bug Fixes

* oops ([5f674ea](https://github.com/kiva/ui/commit/5f674eace3f1a6bd73ddc173bee35977deacac81))

### [2.173.3](https://github.com/kiva/ui/compare/v2.173.2...v2.173.3) (2022-06-07)


### Bug Fixes

* getter for personalized bundle was re added ([5558673](https://github.com/kiva/ui/commit/555867389147c4b383593bdac9a2f18b92155f9a))

### [2.173.2](https://github.com/kiva/ui/compare/v2.173.1...v2.173.2) (2022-06-07)


### Bug Fixes

* add subheader to recommend borrower and copy tweaks ([418b7a0](https://github.com/kiva/ui/commit/418b7a0b338a009d8a8820cd56136b34e15e79db))
* set enabledExperiment flag to false ([f613564](https://github.com/kiva/ui/commit/f613564c9d1d6460aab50da2379592894b29f758))
* solve conflicts with main ([d67765c](https://github.com/kiva/ui/commit/d67765c6b7fea72d2ccee8e57cbd771e052de293))

### [2.173.1](https://github.com/kiva/ui/compare/v2.173.0...v2.173.1) (2022-06-07)


### Bug Fixes

* avoid using tw-flex for experiment version ([a0a9962](https://github.com/kiva/ui/commit/a0a99620463e64a55a09b9448a210675367055f5))
* change div to template ([2a93215](https://github.com/kiva/ui/commit/2a93215793f08dcf3a8ab5e5b746361c9fcb63c2))

## [2.173.0](https://github.com/kiva/ui/compare/v2.172.0...v2.173.0) (2022-06-06)


### Features

* added unit tests ([08da04a](https://github.com/kiva/ui/commit/08da04a32ce4a01fa3133893de29c82de82ac1b8))

## [2.172.0](https://github.com/kiva/ui/compare/v2.171.2...v2.172.0) (2022-06-06)


### Features

* complet loan experiment setup was added to bp page ([0c16d49](https://github.com/kiva/ui/commit/0c16d491391e46abeb294cb5d2d101fc37918d3b))
* prefetch method was added to BP page ([0fa67e5](https://github.com/kiva/ui/commit/0fa67e5565ae6cbdaab6199eddeea4596d2c7e5a))

### [2.171.2](https://github.com/kiva/ui/compare/v2.171.1...v2.171.2) (2022-06-06)


### Bug Fixes

* check title undefined value ([53a43a8](https://github.com/kiva/ui/commit/53a43a88081f7cafedae9578c547f7ae94993d4d))
* use old-stack borrower profile url and hide lend button while loading ([4647440](https://github.com/kiva/ui/commit/4647440f20634b51c71c4c35811a04541ddddbf9))

### [2.171.1](https://github.com/kiva/ui/compare/v2.171.0...v2.171.1) (2022-06-04)


### Bug Fixes

* set meta information only if it defined ([fefd552](https://github.com/kiva/ui/commit/fefd552ddc0b6261ffca7b456f6ff933c2eff0af))
* update track event details ([5ce026c](https://github.com/kiva/ui/commit/5ce026c19e748707babd1f4cdcc9f0376282c879))

## [2.171.0](https://github.com/kiva/ui/compare/v2.170.1...v2.171.0) (2022-06-03)


### Features

* sortBy now supported by query params, added filter value validation ([dd00fd8](https://github.com/kiva/ui/commit/dd00fd88eaaae20f3b49b99aaf744d6dad6af249))

### [2.170.1](https://github.com/kiva/ui/compare/v2.170.0...v2.170.1) (2022-06-03)


### Bug Fixes

* fixed canonical url issues related to pagination query ([372c7b4](https://github.com/kiva/ui/commit/372c7b4bd71edc32691ed55b67bffaee98d610eb))

## [2.170.0](https://github.com/kiva/ui/compare/v2.169.0...v2.170.0) (2022-06-03)


### Features

* double tracking for len to all cta was removed ([83a7fc8](https://github.com/kiva/ui/commit/83a7fc83f9c5ba61fbceb0e39c0261df324dfcf3))

## [2.169.0](https://github.com/kiva/ui/compare/v2.168.2...v2.169.0) (2022-06-03)


### Features

* add link to borrower profile ([43db6f5](https://github.com/kiva/ui/commit/43db6f51bb6c45a79f098e0801b8ca5e4048f207))
* add page header ([06403b7](https://github.com/kiva/ui/commit/06403b790e8401b36f69c45b402055d8eeec723e))
* destroy viewport observer ([724e5e8](https://github.com/kiva/ui/commit/724e5e87fa292a06fb04e0eb78c409b5c1b1cf92))
* event tracking loans per row while loading ([17ef3ac](https://github.com/kiva/ui/commit/17ef3ac8cc0921140e1f013c3f5bf517e183276e))
* fetch loan data and modify loan card ([d65c4c2](https://github.com/kiva/ui/commit/d65c4c26f27fd493aff93f0dca66da802adff890))
* fetch real categories using intersection observer ([80dda15](https://github.com/kiva/ui/commit/80dda153dafb30679d76a65e8d879c3b2e33d94e))
* fetch recommended and remaining loans when intersection observer fails ([3ba124a](https://github.com/kiva/ui/commit/3ba124a51838fc4d9aa1318b33fcada58a0b9e44))
* load another row when bottom of the page is still in view ([89a105d](https://github.com/kiva/ui/commit/89a105d1002beb89a4ef91f2d13c43c1d3f5ac2d))
* modify basic loan card with add to basket feature ([cab097f](https://github.com/kiva/ui/commit/cab097f6fc17ea291ffe62b78603a0b8f1c1b481))
* re-fetch loan data if reference is still in the viewport ([3d3a141](https://github.com/kiva/ui/commit/3d3a141f3a8f25352f412f4176048c680fcc6d68))
* set experiment ([9b3f207](https://github.com/kiva/ui/commit/9b3f207f3e7c5a46c070272f4985c29db6f00608))


### Bug Fixes

* avoid loans rewriting, recall fetch loan function if category has no loans and fetch last category row ([4b50898](https://github.com/kiva/ui/commit/4b50898c81446a35d97dec499731fe40ad33d065))
* ensure unique row number in lend-by-category tracking events ([ec78348](https://github.com/kiva/ui/commit/ec783482cd7f31d8b4cec1019bd92dbe46f2079b))
* lint errors ([0e835cd](https://github.com/kiva/ui/commit/0e835cda4b6be98edac9530a1a51048405c1aa50))
* make copy of original category before modifying it ([0de1c3d](https://github.com/kiva/ui/commit/0de1c3d3e17947a9aaf012d81de14650923493a5))
* move experiment check to created hook ([e6723cf](https://github.com/kiva/ui/commit/e6723cf8326fa83e863f7c14ca5d34457228cede))
* move ref visible check to method instead of computed to limit how much it is called ([a51f487](https://github.com/kiva/ui/commit/a51f487159b23c1e26417a0e30b19a4660f9b1da))
* remove unused import ([d20b083](https://github.com/kiva/ui/commit/d20b08344a0d19c99fab00e60c0f75392ff0ca6c))
* remove unused import ([6fa65dd](https://github.com/kiva/ui/commit/6fa65dd1ab82ff6adf834f8e8b47baf6b773ed67))
* remove unused library's function ([5cf3fd4](https://github.com/kiva/ui/commit/5cf3fd47b74cbdc63b1710ec169d068ae99c5168))
* solve conflicts with main branch ([46ba485](https://github.com/kiva/ui/commit/46ba485be8ee0cf23e8d25a6541865d7d95f9092))
* solve conflicts with main branch ([ad7171a](https://github.com/kiva/ui/commit/ad7171a100354a896cbb487c8417f44acf25c53c))

### [2.168.2](https://github.com/kiva/ui/compare/v2.168.1...v2.168.2) (2022-06-02)


### Bug Fixes

* trackers were updated to include loans ids in lbc page ([efdbc4d](https://github.com/kiva/ui/commit/efdbc4df0751ff243b381b52d848f95a69682079))

### [2.168.1](https://github.com/kiva/ui/compare/v2.168.0...v2.168.1) (2022-06-02)


### Bug Fixes

* trackers were updated to include loans ids in lbc page ([9f3b75f](https://github.com/kiva/ui/commit/9f3b75f38dc5b2aeef5b7d4c759b7ced305de1ca))

## [2.168.0](https://github.com/kiva/ui/compare/v2.167.1...v2.168.0) (2022-06-02)


### Features

* copy was updated in the mg setup page ([32aea57](https://github.com/kiva/ui/commit/32aea57e6c25eb99196fc791a8dfaab375d8c936))

### [2.167.1](https://github.com/kiva/ui/compare/v2.167.0...v2.167.1) (2022-06-01)


### Bug Fixes

* remove cache from loan card controller ([9ce82d4](https://github.com/kiva/ui/commit/9ce82d42a2e024d5ca170f4845767527ceca8681))

## [2.167.0](https://github.com/kiva/ui/compare/v2.166.0...v2.167.0) (2022-06-01)


### Features

* update query string when filters change ([ed7c4c8](https://github.com/kiva/ui/commit/ed7c4c841c1f2125d570d1bc70a15a1139cb26f6))

## [2.166.0](https://github.com/kiva/ui/compare/v2.165.1...v2.166.0) (2022-05-31)


### Features

* pre-set the gender filter using the query string param ([acfb2db](https://github.com/kiva/ui/commit/acfb2db4c3a742cbc51de924787d1ed0b6b489d1))

### [2.165.1](https://github.com/kiva/ui/compare/v2.165.0...v2.165.1) (2022-05-31)


### Bug Fixes

* expandable bug was fixed for lbc page ([5a0e1b6](https://github.com/kiva/ui/commit/5a0e1b6fd51346d6b8c86fe23bf4dd82bc0b277e))

## [2.165.0](https://github.com/kiva/ui/compare/v2.164.0...v2.165.0) (2022-05-31)


### Features

* add lending page components caching ([bab4857](https://github.com/kiva/ui/commit/bab4857f37a9a9aff5338de1dfaa152e67bc01ce))


### Bug Fixes

* small change after code review ([5ec2296](https://github.com/kiva/ui/commit/5ec22969c542769f85c9480d314c243e606f57aa))

## [2.164.0](https://github.com/kiva/ui/compare/v2.163.0...v2.164.0) (2022-05-31)


### Features

* added loan sector filter ([17f0366](https://github.com/kiva/ui/commit/17f0366500d8c71d56e2474a4183677d3598d9e2))


### Bug Fixes

* added filter to loan search utils ([1768f3b](https://github.com/kiva/ui/commit/1768f3bfbe757644e453d397d87c8850dbc47a3a))

## [2.163.0](https://github.com/kiva/ui/compare/v2.162.1...v2.163.0) (2022-05-31)


### Features

* remove default promo banner icon ([de3746f](https://github.com/kiva/ui/commit/de3746fd90964f0b82a68ea08fb9ca2daf6edee5))

### [2.162.1](https://github.com/kiva/ui/compare/v2.162.0...v2.162.1) (2022-05-31)


### Bug Fixes

* filters now transformed case insensitive ([2f0f1c5](https://github.com/kiva/ui/commit/2f0f1c52076741962f5d78d347ed6d1e56cee2e2))

## [2.162.0](https://github.com/kiva/ui/compare/v2.161.0...v2.162.0) (2022-05-31)


### Features

* upsells checkout a/b test ([bc58fff](https://github.com/kiva/ui/commit/bc58fff8d5280455ef35598da7f16ff21aecf0b0))


### Bug Fixes

* add query to checkoutSettings ([06170c9](https://github.com/kiva/ui/commit/06170c976151e9856e05dd44a5e9299df095c9ae))
* move exp check ([6ab8c79](https://github.com/kiva/ui/commit/6ab8c790bae07122c3061ff195dda63aed96c293))

## [2.161.0](https://github.com/kiva/ui/compare/v2.160.0...v2.161.0) (2022-05-27)


### Features

* add sort by options component to lend filter alpha ([2e9e11b](https://github.com/kiva/ui/commit/2e9e11b4331b7b3fa8f69b686979627797c90c75))


### Bug Fixes

* update fetchLoans method name and associated tests ([fe21bc6](https://github.com/kiva/ui/commit/fe21bc613628b29cd49de0d6b3fa7c8aff180769))

## [2.160.0](https://github.com/kiva/ui/compare/v2.159.0...v2.160.0) (2022-05-27)


### Features

* expandable component was added to personalized bundling experiment ([56dc9e6](https://github.com/kiva/ui/commit/56dc9e63ee4da953ad5ae01a45eb702229d0587c))

## [2.159.0](https://github.com/kiva/ui/compare/v2.158.3...v2.159.0) (2022-05-26)


### Features

* implemented attribute/theme filter ([1fd37b9](https://github.com/kiva/ui/commit/1fd37b92cb69e5be36335c68c6a7c227ef60f92d))


### Bug Fixes

* added missing component name ([d5ed997](https://github.com/kiva/ui/commit/d5ed997aa0c1439d0647cecc897660cb6cead1b4))
* realized that "theme" was more appropriate for new features given that FLSS uses "theme" ([3ff09ed](https://github.com/kiva/ui/commit/3ff09ede41799235498d7d996874a35b46cb8931))

### [2.158.3](https://github.com/kiva/ui/compare/v2.158.2...v2.158.3) (2022-05-26)


### Bug Fixes

* only check experiment on experiment pages ([f8e7ca9](https://github.com/kiva/ui/commit/f8e7ca9fb0e47b7a18b672898be47dd9a3155155))

### [2.158.2](https://github.com/kiva/ui/compare/v2.158.1...v2.158.2) (2022-05-26)


### Bug Fixes

* always prefetch experiment info and redirect in other direction if necessary ([f312aed](https://github.com/kiva/ui/commit/f312aed1b7f6382ff0ee555d3f4ded9fb1d9070c))

### [2.158.1](https://github.com/kiva/ui/compare/v2.158.0...v2.158.1) (2022-05-26)


### Bug Fixes

* call trackExperimentVersion in mounted hook ([a0a1aec](https://github.com/kiva/ui/commit/a0a1aeca9ad5e3f97f58af35598c4e7a929bed83))

## [2.158.0](https://github.com/kiva/ui/compare/v2.157.0...v2.158.0) (2022-05-26)


### Features

* redirect to new variant for paid ads lp ([054a95c](https://github.com/kiva/ui/commit/054a95c72a48528fee1b37c4e2163e5187909833))

## [2.157.0](https://github.com/kiva/ui/compare/v2.156.2...v2.157.0) (2022-05-26)


### Features

* added name to kv components group 1 ([7cda7cd](https://github.com/kiva/ui/commit/7cda7cde39b887236375168ad154813793729589))
* added name to kv components group 1 ([8b2e9fb](https://github.com/kiva/ui/commit/8b2e9fb649d1f903ebc3338099c01c70fc1cc053))
* added name to kv components group 2 ([b5f76b7](https://github.com/kiva/ui/commit/b5f76b7fe42238ac2f974d378bdca12dfe6e3d2b))
* added name to kv components group 3 ([c71eaba](https://github.com/kiva/ui/commit/c71eabab1ec19cc502b636e780a8dd10840a9122))
* added name to kv components group 4 ([7319504](https://github.com/kiva/ui/commit/7319504362d964470ba5859540fe6ff6013b10b4))
* location filter options are now updated based on fundraising loans available ([4618bd0](https://github.com/kiva/ui/commit/4618bd02e3a3caebee51180b015ef8275dc201a5))


### Bug Fixes

* another whitspace fix ([dc731a8](https://github.com/kiva/ui/commit/dc731a819f08a45e4424d35fd37e18e173d0a01d))
* fix formatting on eslintrc.js file ([501d900](https://github.com/kiva/ui/commit/501d9007810853ce326f9938ab131f56ec715052))
* resolve conflicts ([d7e0843](https://github.com/kiva/ui/commit/d7e0843d6a13c24ef80e62a906cb435a1f30b660))
* whitespace fix ([11c706b](https://github.com/kiva/ui/commit/11c706be7bf8738bdf53adf0713a7e578916197a))

### [2.156.2](https://github.com/kiva/ui/compare/v2.156.1...v2.156.2) (2022-05-26)

### Bug Fixes

-   optional chaining added to the fix ([3cc61b8](https://github.com/kiva/ui/commit/3cc61b8ed0135b99b8add7ba6a54625863c4d23d))
-   validation was added for utm campaign ([8b5704e](https://github.com/kiva/ui/commit/8b5704e0943cb99e2ff3ffd65aa22b28722acf94))

### [2.156.1](https://github.com/kiva/ui/compare/v2.156.0...v2.156.1) (2022-05-26)

### Bug Fixes

-   guard for missing displayName, cleanup template syntax and use tailwind classes ([dfb1e1f](https://github.com/kiva/ui/commit/dfb1e1f5f4094d89b2ccb1fa6bd7c1aa7a65d07f))

## [2.156.0](https://github.com/kiva/ui/compare/v2.155.3...v2.156.0) (2022-05-26)

### Features

-   location filter options are now updated based on fundraising loans available ([3a48c26](https://github.com/kiva/ui/commit/3a48c26ea82d2b55a818708f2566db86edd9752c))

### Bug Fixes

-   another whitspace fix ([9d713cc](https://github.com/kiva/ui/commit/9d713ccf4d3ef43fa43e2b2729506dbc2d0ddddb))
-   whitespace fix ([fe25827](https://github.com/kiva/ui/commit/fe2582767e6c3ce1d312d167732cd7ee08c69d21))

### [2.155.3](https://github.com/kiva/ui/compare/v2.155.2...v2.155.3) (2022-05-24)

### Bug Fixes

-   a bug when adding the bundle and design fixes are done ([ab058bf](https://github.com/kiva/ui/commit/ab058bfeb28a025f5b4dc48b17d936fbb1c3ca1f))

### [2.155.2](https://github.com/kiva/ui/compare/v2.155.1...v2.155.2) (2022-05-24)

### Bug Fixes

-   pull in kv-components update to solve KvCarousel proxy error ([51222a5](https://github.com/kiva/ui/commit/51222a5dd2868fae6a3c61c932c7d4fbecc0e22f))

### [2.155.1](https://github.com/kiva/ui/compare/v2.155.0...v2.155.1) (2022-05-23)

### Bug Fixes

-   country name was showing region name after refactor ([64558c8](https://github.com/kiva/ui/commit/64558c8868618c979961a60e430661df8adc3b79))

## [2.155.0](https://github.com/kiva/ui/compare/v2.154.2...v2.155.0) (2022-05-23)

### Features

-   implemented loan search location filter and generic checkbox list ([5041501](https://github.com/kiva/ui/commit/5041501e67d26a1ab8573fc5f75f83edeecdc010))

### Bug Fixes

-   updated userEvent usage in other unit tests ([af5ea5c](https://github.com/kiva/ui/commit/af5ea5c6fb052e99741e6217b4f5f771dbf1912e))

### [2.154.2](https://github.com/kiva/ui/compare/v2.154.1...v2.154.2) (2022-05-20)

### Bug Fixes

-   fix query param check and lbc route ([ef90cc0](https://github.com/kiva/ui/commit/ef90cc00aeeb9f3e93794906aad24d742494360a))

### [2.154.1](https://github.com/kiva/ui/compare/v2.154.0...v2.154.1) (2022-05-20)

### Bug Fixes

-   map title card name for category id 5 ([78af324](https://github.com/kiva/ui/commit/78af324515b81fcd8204636b109b81daa5efa112))

## [2.154.0](https://github.com/kiva/ui/compare/v2.153.2...v2.154.0) (2022-05-20)

### Features

-   added redirects for women and education pages ([9e10d49](https://github.com/kiva/ui/commit/9e10d4980d9b9bd4cdbea96c8b00bc92779643b8))
-   set page meta description and canonical url from contentful MARS-114 ([6d8ae3b](https://github.com/kiva/ui/commit/6d8ae3bc8e182e082b044c9fd9f4f68e4f3a6fd2))

### Bug Fixes

-   fixed linting issues ([8e69a35](https://github.com/kiva/ui/commit/8e69a358b72e0012b70ea73a28f6f996a62c0044))
-   re-establish service bandit experiment query ([f7a10bf](https://github.com/kiva/ui/commit/f7a10bfc2efada886491aa37027ddbb170f9f394))
-   remove experimentAssigment query ([09248f8](https://github.com/kiva/ui/commit/09248f8053927db8624acb3c179befa57de82e5a))
-   restore Ml bandit algo experiment ([de881a3](https://github.com/kiva/ui/commit/de881a368f9d6a34cf12d6bb2d8a92cc7cb7f855))
-   small adjustment on routes ([2b50a6e](https://github.com/kiva/ui/commit/2b50a6e70173f947d0e229094c37f518f8312a8d))

### [2.153.2](https://github.com/kiva/ui/compare/v2.153.1...v2.153.2) (2022-05-19)

### Bug Fixes

-   fix kiva classic checkout promos ([6881ac9](https://github.com/kiva/ui/commit/6881ac9dadc818f38549d3fe588ee6cd2ec19193))

### [2.153.1](https://github.com/kiva/ui/compare/v2.153.0...v2.153.1) (2022-05-19)

### Bug Fixes

-   update variable name ([0abddaf](https://github.com/kiva/ui/commit/0abddaf5b79df3aa4f866257444b7c0cca21776d))

## [2.153.0](https://github.com/kiva/ui/compare/v2.152.1...v2.153.0) (2022-05-19)

### Features

-   wrong message was removed in MG thanks page ([ed31d79](https://github.com/kiva/ui/commit/ed31d7917c10c95f640cf0186b39320d0a2314ac))

### [2.152.1](https://github.com/kiva/ui/compare/v2.152.0...v2.152.1) (2022-05-18)

### Bug Fixes

-   ensure redemption code amount is shown in the list ([d07bb8f](https://github.com/kiva/ui/commit/d07bb8f7e9a59266c4f4bcabdf63790d33a8a93c))

## [2.152.0](https://github.com/kiva/ui/compare/v2.151.0...v2.152.0) (2022-05-18)

### Features

-   add tracking and fix lightbox ([dec1fe8](https://github.com/kiva/ui/commit/dec1fe80a9f64aae3667f11847e3b432d1b294b3))
-   implement mg digest lightbox ([34b9023](https://github.com/kiva/ui/commit/34b902347b6957f3908eb8a8300e4e86722dbe7a))

### Bug Fixes

-   lint error ([5dc93c4](https://github.com/kiva/ui/commit/5dc93c4d2b11d374864ac5ddc5b4783ccf712742))
-   merge conflict fix ([af223f7](https://github.com/kiva/ui/commit/af223f79b2a141482409323801670a4be377fb26))
-   remove comments ([4bcfda1](https://github.com/kiva/ui/commit/4bcfda1966e9800bbb7bf1b0677ad4f3be96d8c3))
-   some styling to match figma ([b076391](https://github.com/kiva/ui/commit/b076391f1033c20b9d9364e7086f948fe2aa3a5e))

## [2.151.0](https://github.com/kiva/ui/compare/v2.150.1...v2.151.0) (2022-05-18)

### Features

-   dynamic amount was added to loan bundle wrapper ([7426f9f](https://github.com/kiva/ui/commit/7426f9f9c0197ecda1665896371f2a2fc50dc956))
-   loans bundle experiment was added to lbc page ([eb78469](https://github.com/kiva/ui/commit/eb78469dd7eb6b8141c7cad4c061c053c5043199))

### [2.150.1](https://github.com/kiva/ui/compare/v2.150.0...v2.150.1) (2022-05-17)

### Bug Fixes

-   remove legacy redirect for promo code state when adding a promo code in new checkout ([ed076c5](https://github.com/kiva/ui/commit/ed076c5b0f28e3be60054d94820a2d55db99e73c))
-   remove redirect to legacy lightbox + associated methods ([589a3ab](https://github.com/kiva/ui/commit/589a3abe75da2d4c34c0fdc806dd1c91ba4d15f0))

## [2.150.0](https://github.com/kiva/ui/compare/v2.149.0...v2.150.0) (2022-05-17)

### Features

-   add verify remove promo credit lightbox ([21c32a6](https://github.com/kiva/ui/commit/21c32a693c7a63c4df075ac80d83ca391bfc6c5f))
-   implement campaign verif form on checkout ([b5d727b](https://github.com/kiva/ui/commit/b5d727b9bbbfa842810878775cdddf443cfd97ea))

### Bug Fixes

-   remove console log ([87cd349](https://github.com/kiva/ui/commit/87cd349f618b008abd8834430edd378e0749bcb2))

## [2.149.0](https://github.com/kiva/ui/compare/v2.148.0...v2.149.0) (2022-05-17)

### Features

-   removed header experiment code ([5914e03](https://github.com/kiva/ui/commit/5914e031bacc770fcba4913d2f26d27d1ffb7119))

### Bug Fixes

-   linting issues ([6a749c8](https://github.com/kiva/ui/commit/6a749c86285062a1adead7938209fdf48a20a506))
-   more code removed ([1514a83](https://github.com/kiva/ui/commit/1514a832fc0c976d0d07e0e6811c0fa58bb58db4))
-   remove more refereces to experiment code ([92fdecf](https://github.com/kiva/ui/commit/92fdecf8f08163ba81dc781475f4187b547ae543))
-   removed more code related to experiment ([d4b0181](https://github.com/kiva/ui/commit/d4b0181b5f666fe9c9f5bf72e0f5e56834a9c9cf))
-   restored track event ([4f9868d](https://github.com/kiva/ui/commit/4f9868d52d44f04e759f33016d7ab7d7e0c48cc4))
-   small adjustment ([67a41e4](https://github.com/kiva/ui/commit/67a41e46ac46a7188438b69b4614e19090b69e94))

## [2.148.0](https://github.com/kiva/ui/compare/v2.147.0...v2.148.0) (2022-05-17)

### Features

-   connected gender filter to new apollo cache ([127432b](https://github.com/kiva/ui/commit/127432ba508e95c6b9f04d43a2b2d10c2749228c))

## [2.147.0](https://github.com/kiva/ui/compare/v2.146.0...v2.147.0) (2022-05-17)

### Features

-   create gender-equality route and redirect /lp/own-the-change-gender-equality to this new route ([6a70b3b](https://github.com/kiva/ui/commit/6a70b3bde3f45f6ebd4a547b186cafa7cd9ceccf))

## [2.146.0](https://github.com/kiva/ui/compare/v2.145.2...v2.146.0) (2022-05-17)

### Features

-   created new loan search utils file ([c972bc4](https://github.com/kiva/ui/commit/c972bc4962d30ef737ecbba30ce48e36efb14a25))

### Bug Fixes

-   added missing mocked function for auth0 that was causing error on load locally ([a40276e](https://github.com/kiva/ui/commit/a40276e694e7510559d818a6ccc3170534e6823a))
-   changed undefined fakeAuthAllowed mock to false ([7f083f1](https://github.com/kiva/ui/commit/7f083f19211df0c2ca8361f7eb40856f25c55a3a))
-   include aria-label for lightbox but not visible title ([1b8a474](https://github.com/kiva/ui/commit/1b8a4742d42c6505d0de4427024abc1f7d19901a))
-   resolved vue errors on load: missing title and wrong boolean prop ([47de4c5](https://github.com/kiva/ui/commit/47de4c50d16e52de1940588f4b0816673e179997))

### [2.145.2](https://github.com/kiva/ui/compare/v2.145.1...v2.145.2) (2022-05-16)

### Bug Fixes

-   updated elements package for radio button fix ([1b89ba2](https://github.com/kiva/ui/commit/1b89ba2e7433b2f3ec6ac1d2ab62316ce2b26fb8))

### [2.145.1](https://github.com/kiva/ui/compare/v2.145.0...v2.145.1) (2022-05-16)

### Bug Fixes

-   remove extra margins on collapsed banner state ([5a4f0f5](https://github.com/kiva/ui/commit/5a4f0f5704c134c35ac561af51664f8d4249849f))

## [2.145.0](https://github.com/kiva/ui/compare/v2.144.0...v2.145.0) (2022-05-16)

### Features

-   kvlightbox added ([6a1dc51](https://github.com/kiva/ui/commit/6a1dc519f5e894acb35f949e9c4b84f037b8c84d))

### Bug Fixes

-   unused lines removed ([240c29d](https://github.com/kiva/ui/commit/240c29db4e4b7aa5cf8e0bfb8e0dab6367abad88))

## [2.144.0](https://github.com/kiva/ui/compare/v2.143.1...v2.144.0) (2022-05-13)

### Features

-   dedicated new gender radio filter using KvRadio ([8d7537d](https://github.com/kiva/ui/commit/8d7537d339a1b99ca55fcacf0c9cc0e606cfa1ed))

### [2.143.1](https://github.com/kiva/ui/compare/v2.143.0...v2.143.1) (2022-05-13)

### Bug Fixes

-   cleanup theme option on loanSearchState localSchema ([0c32d93](https://github.com/kiva/ui/commit/0c32d93e4a8fed488c1d28d0ba80d79f6eef8476))
-   stub out loanSearchState subscription, mark cruft for removal ([eceb335](https://github.com/kiva/ui/commit/eceb33529e1bd26288e1fa62fcdfdc5961736bc1))
-   use JSONObject type on update mutation param ([04d9c1a](https://github.com/kiva/ui/commit/04d9c1a5299d2da9e6fee2be4a3acd103f9ef146))

## [2.143.0](https://github.com/kiva/ui/compare/v2.142.0...v2.143.0) (2022-05-13)

### Features

-   setup basic local resolver for loanSearchState to help facilitate filter state transport ([874d325](https://github.com/kiva/ui/commit/874d325aa69e58f141f38eed59a8f8ba14310bc8))

### Bug Fixes

-   add query file for loanSearchState ([e286cd1](https://github.com/kiva/ui/commit/e286cd117c8492982179312a24dc1825436b06ae))
-   cleanup theme option on loanSearchState localSchema ([8e5694a](https://github.com/kiva/ui/commit/8e5694a6bb98efbe05a868b100e98bfa5ccb620f))
-   use graphql compatible JSONObject instead of object ([e8b3ca5](https://github.com/kiva/ui/commit/e8b3ca5d1c11041ea1a9b50e30ee560166b5bcaa))

## [2.142.0](https://github.com/kiva/ui/compare/v2.141.0...v2.142.0) (2022-05-13)

### Features

-   remove code related to lend_filter_v2 and lend_by_category_v2 experiments ([0f59bd7](https://github.com/kiva/ui/commit/0f59bd7ba9aa69fe0fd549f74726b162d70be9a5))
-   remove code related to lend_filter_v2 and lend_by_category_v2 experiments ([4b69820](https://github.com/kiva/ui/commit/4b698209f760335ed989e69426d1e882160b4ac8))
-   removed LoanChannelCategoryExperiment.vue component ([f6a9d02](https://github.com/kiva/ui/commit/f6a9d02b2b44162244d1fdc70931b2f84341b1b6))
-   revert small change on filterUrl function ([1643105](https://github.com/kiva/ui/commit/1643105637966910b8770fc8d4989d21e2271bec))

### Bug Fixes

-   fix wrong filter url ([17a18a1](https://github.com/kiva/ui/commit/17a18a1593c55ba520adc80ec480fb5dc0e7ad94))
-   remove variable from wrong place ([e2742ae](https://github.com/kiva/ui/commit/e2742ae2b06435942e6bb37253f6a6dbb8c613f2))
-   reverted code related to experiment lend_filter_v2 ([8aa42d4](https://github.com/kiva/ui/commit/8aa42d45f866883c9ffca8433444378565949180))
-   small missing variable in data ([80fe114](https://github.com/kiva/ui/commit/80fe114c2ca559de3430887487937f6be8096d2a))

## [2.141.0](https://github.com/kiva/ui/compare/v2.140.0...v2.141.0) (2022-05-12)

### Features

-   update event tracking for checkout/thanks page ([f35649d](https://github.com/kiva/ui/commit/f35649df248a5b6bdd715801701428f282120232))

### Bug Fixes

-   added small fixes after pr reviews ([596ece4](https://github.com/kiva/ui/commit/596ece4833edc1c11add840b75b576a5db8eca32))

## [2.140.0](https://github.com/kiva/ui/compare/v2.139.0...v2.140.0) (2022-05-12)

### Features

-   lend urgency homepage experiment ([d7621ec](https://github.com/kiva/ui/commit/d7621ece944ecf617aeffd8ae9f423d520a70270))

## [2.139.0](https://github.com/kiva/ui/compare/v2.138.0...v2.139.0) (2022-05-12)

### Features

-   performance improvement ([2bcce52](https://github.com/kiva/ui/commit/2bcce52d2308300ab6d283e2fd5a8230664ed07b))

## [2.138.0](https://github.com/kiva/ui/compare/v2.137.0...v2.138.0) (2022-05-11)

### Features

-   added property to enable rounded corners on the list loan card ([d5ec761](https://github.com/kiva/ui/commit/d5ec761ab83f9e7229619f41d887846ece4e7266))

### Bug Fixes

-   simplified conditional CSS ([2af987d](https://github.com/kiva/ui/commit/2af987de4532384cede9193672c8e4ccdf8c7d48))

## [2.137.0](https://github.com/kiva/ui/compare/v2.136.1...v2.137.0) (2022-05-11)

### Features

-   borrower profile urgency experiment ([f63ff0d](https://github.com/kiva/ui/commit/f63ff0d71617c39b0abd9cb908d104c32d1a9081))

### [2.136.1](https://github.com/kiva/ui/compare/v2.136.0...v2.136.1) (2022-05-11)

### Bug Fixes

-   fixed visual issues ([940b376](https://github.com/kiva/ui/commit/940b3764f265415350f8cd69db738044111c4f7a))

## [2.136.0](https://github.com/kiva/ui/compare/v2.135.0...v2.136.0) (2022-05-11)

### Features

-   add promo creds to checkout page ([dd0e5ea](https://github.com/kiva/ui/commit/dd0e5eaeed21d37e394f27d98a21381a457b2020))

## [2.135.0](https://github.com/kiva/ui/compare/v2.134.0...v2.135.0) (2022-05-10)

### Features

-   added e2e test ([3a50eea](https://github.com/kiva/ui/commit/3a50eea3b2f409a237bd602d9d5cf9e0e177a1ed))
-   added experiment tracking ([5f810aa](https://github.com/kiva/ui/commit/5f810aa7d96792270bfacb4042dc758156976dfb))
-   donate page seo updates ([6ddbc3d](https://github.com/kiva/ui/commit/6ddbc3dcd630ffc7125c36b582daa97bdcad70ba))
-   new thanks page sharing experience ([ba4da1b](https://github.com/kiva/ui/commit/ba4da1ba813cf6cb5e0fa69fb3508c24632028f9))
-   small adjustemt related to guest users ([6946fc7](https://github.com/kiva/ui/commit/6946fc72d4c91122625bd662b2733c2bd54319fc))
-   small fixes on experiment tracking ([41b6398](https://github.com/kiva/ui/commit/41b63981f4fea50d45e18b333dd7e425d2635dd5))

### Bug Fixes

-   import from lodash ([a72f8a9](https://github.com/kiva/ui/commit/a72f8a967104cce9661aae12458334379e2a21bc))
-   rensome variables ([920f4a7](https://github.com/kiva/ui/commit/920f4a76327e22bf1477ff872a15b991943d029a))
-   revert changes on DonateSupportUs.vue file ([5e23219](https://github.com/kiva/ui/commit/5e232197f3a0e44e5cd0f90c3fdf7c8eba046793))

## [2.134.0](https://github.com/kiva/ui/compare/v2.133.1...v2.134.0) (2022-05-10)

### Features

-   flss filter styles ([13dd6dc](https://github.com/kiva/ui/commit/13dd6dc38255328089790d79127806d1ac82827f))

### [2.133.1](https://github.com/kiva/ui/compare/v2.133.0...v2.133.1) (2022-05-10)

### Bug Fixes

-   remove conditional render preventing cards from showing ([4f80ff5](https://github.com/kiva/ui/commit/4f80ff5ab25e3dd98e164917837936b410b90a01))

## [2.133.0](https://github.com/kiva/ui/compare/v2.132.0...v2.133.0) (2022-05-10)

### Features

-   loans bundle test was added to lend by category page ([42c8318](https://github.com/kiva/ui/commit/42c8318cbc1c16547641088eaa8287b3cd78fb37))

## [2.132.0](https://github.com/kiva/ui/compare/v2.131.1...v2.132.0) (2022-05-09)

### Features

-   implement detailed loan cards on lbc ([43d44a7](https://github.com/kiva/ui/commit/43d44a784806ab15daf12b4828ac4ec0c309754f))
-   temp push, getting detailed loan info ([f951875](https://github.com/kiva/ui/commit/f951875055f2557969eeb34926831e8a92186338))

### Bug Fixes

-   comment out breaking imports ([5078062](https://github.com/kiva/ui/commit/50780626105195766cf6a461546e62a900095389))
-   lint fix ([4414230](https://github.com/kiva/ui/commit/44142308af64f636c3249de58b6cc4396b2e763e))
-   missed some stuff ([297a1b3](https://github.com/kiva/ui/commit/297a1b3295d9504b2942fea6dce208698ec44d65))
-   use tw class ([96e4f5f](https://github.com/kiva/ui/commit/96e4f5f78b31f299ad686c1ddb422ca1a14fcc53))

### [2.131.1](https://github.com/kiva/ui/compare/v2.131.0...v2.131.1) (2022-05-09)

### Bug Fixes

-   ensure only the url path is used to create the event category ([37ae6c4](https://github.com/kiva/ui/commit/37ae6c4d4fae2cfc971132541d4eb78212157e60))

## [2.131.0](https://github.com/kiva/ui/compare/v2.130.0...v2.131.0) (2022-05-05)

### Features

-   how works and about sections were updated in the mg page ([b107ef7](https://github.com/kiva/ui/commit/b107ef7c8d4b1f6c849d30feeafba66860f52f6c))

## [2.130.0](https://github.com/kiva/ui/compare/v2.129.0...v2.130.0) (2022-05-05)

### Features

-   filter menu ([d4771fc](https://github.com/kiva/ui/commit/d4771fcbf341aba7352b9e3a2ca0228901f59ad7))
-   wip ([31a8847](https://github.com/kiva/ui/commit/31a88472472b23ddce9ca7242d3b28d3541b1fca))
-   wip creating self element ([284c965](https://github.com/kiva/ui/commit/284c965063b2623450d97136ecd9c010f6607bce))

### Bug Fixes

-   cleanup page frame ([6f31c7b](https://github.com/kiva/ui/commit/6f31c7b1a5821506aa31936c63c18ef826a0d15f))
-   eslint fixes ([4209958](https://github.com/kiva/ui/commit/42099583370b73e21b3bfee10d6c4353b0c665ec))
-   font styles ([24c73b3](https://github.com/kiva/ui/commit/24c73b387f72b47218a544b31cc26030f0f5973e))
-   removed custom classes ([21725a0](https://github.com/kiva/ui/commit/21725a019f21822fa1f2e70e176f8ec60a3f12fb))

## [2.129.0](https://github.com/kiva/ui/compare/v2.128.0...v2.129.0) (2022-05-04)

### Features

-   decimal place was removed from the lendamountbutton component ([c24adcf](https://github.com/kiva/ui/commit/c24adcf975bdda1b72a62cf7f7a106963e17c83d))
-   tests were added to check both types of input in the loanamountbutton component ([02e5450](https://github.com/kiva/ui/commit/02e54503a92ecd7372e07dcc33a5878c83556049))

### Bug Fixes

-   parseInt method was added in the lendamountbutton component ([8d9f84c](https://github.com/kiva/ui/commit/8d9f84caa6989cf5c5c38cb0184ddee67b45ff2d))

## [2.128.0](https://github.com/kiva/ui/compare/v2.127.2...v2.128.0) (2022-05-04)

### Features

-   prices array was reduced in the checkout dropdown ([0282cb0](https://github.com/kiva/ui/commit/0282cb02378a26167fc622fe490e2ecfe2dbc80e))

### [2.127.2](https://github.com/kiva/ui/compare/v2.127.1...v2.127.2) (2022-05-03)

### Bug Fixes

-   add design page to lighthouse prod ([ea6a880](https://github.com/kiva/ui/commit/ea6a880531cec75a75fd24f3ddb010ff900ee934))

### [2.127.1](https://github.com/kiva/ui/compare/v2.127.0...v2.127.1) (2022-05-03)

### Performance Improvements

-   delay loading auth0 client until needed ([#3749](https://github.com/kiva/ui/issues/3749)) ([e8c1d02](https://github.com/kiva/ui/commit/e8c1d02f3d6d9bd0344dd7a9d02a86bf82b6bc4f))
-   dynamically load loan card components VUE-486 ([#3750](https://github.com/kiva/ui/issues/3750)) ([be07ee7](https://github.com/kiva/ui/commit/be07ee730aa10a25939bd657447861cd9787ee99))

## [2.127.0](https://github.com/kiva/ui/compare/v2.126.0...v2.127.0) (2022-05-02)

### Features

-   condtion for existing users was added to mg pop up ([2db4778](https://github.com/kiva/ui/commit/2db47784d27a398971ef4031e227cbcc0e79213a))

## [2.126.0](https://github.com/kiva/ui/compare/v2.125.0...v2.126.0) (2022-05-02)

### Features

-   added meta information ([a1420cf](https://github.com/kiva/ui/commit/a1420cf19e25736f4c5203409a0f1a68ac26d9a5))

### Bug Fixes

-   small adjustments on e2e test ([8ce7d95](https://github.com/kiva/ui/commit/8ce7d9534be681af8c592d6b09f89c53d0e65636))

## [2.125.0](https://github.com/kiva/ui/compare/v2.124.2...v2.125.0) (2022-04-29)

### Features

-   extract func from filteralpha to loansearch ([51f0cbb](https://github.com/kiva/ui/commit/51f0cbbfa271a1c10c0aea20af88c6faef98aefc))

### [2.124.2](https://github.com/kiva/ui/compare/v2.124.1...v2.124.2) (2022-04-28)

### Bug Fixes

-   add dollar sign on text value ([bf3de28](https://github.com/kiva/ui/commit/bf3de28470317c5e57e1e7ff800a59bfd4dc726e))
-   ensure sub 25 lend button is present for loans with less than 25 remaining ([4e0dabc](https://github.com/kiva/ui/commit/4e0dabc319813fb7cbf59508d3e0e24b1b263c24))

### [2.124.1](https://github.com/kiva/ui/compare/v2.124.0...v2.124.1) (2022-04-28)

### Bug Fixes

-   quick prop cleanup ([9f5d4d4](https://github.com/kiva/ui/commit/9f5d4d452fb503f16368856e5e679608e32ab8fb))

## [2.124.0](https://github.com/kiva/ui/compare/v2.123.0...v2.124.0) (2022-04-28)

### Features

-   stranded loans lend button on borrower profile ([4f67928](https://github.com/kiva/ui/commit/4f67928a75d6ee1edbd21b5e5904f39e4e4c5d21))

### Bug Fixes

-   small typo ([83c3729](https://github.com/kiva/ui/commit/83c37299aa6def76b0664fea69a530cd4d1075c2))
-   update for previously lent ([3ed170b](https://github.com/kiva/ui/commit/3ed170b61ac562379593907b80b91381aa9fe393))

## [2.123.0](https://github.com/kiva/ui/compare/v2.122.1...v2.123.0) (2022-04-27)

### Features

-   loanprice component was updated to hide the dropdown component if the price is less than 25 ([837f018](https://github.com/kiva/ui/commit/837f0183c9a3683a28165d1c81e708700f414e73))
-   price was added as a text representation ([bff48c7](https://github.com/kiva/ui/commit/bff48c7b2f85eb3cfb1a6b08950f714239f1d654))

### [2.122.1](https://github.com/kiva/ui/compare/v2.122.0...v2.122.1) (2022-04-27)

### Bug Fixes

-   set initially select value for sub 25 loans if the drop down is shown ([00fbb07](https://github.com/kiva/ui/commit/00fbb07750fb4b6fde4ad76d2737afbea24f676f))
-   use a 25 increment in the dropdown for loans with 25 or more remaining ([9547254](https://github.com/kiva/ui/commit/954725402157f8e57443248c9c7f2ff7c6e96687))

## [2.122.0](https://github.com/kiva/ui/compare/v2.121.0...v2.122.0) (2022-04-27)

### Features

-   use transform/translate instead left for place holder animation ([048cdf2](https://github.com/kiva/ui/commit/048cdf29fb3e412a09f7375080fc4f9dc53e0553))

## [2.121.0](https://github.com/kiva/ui/compare/v2.120.1...v2.121.0) (2022-04-27)

### Features

-   amount lend button support was added to list loand card for lend filter page ([24b2bd0](https://github.com/kiva/ui/commit/24b2bd007d5ccfca94956ff73eaf1f6db6df582b))

### [2.120.1](https://github.com/kiva/ui/compare/v2.120.0...v2.120.1) (2022-04-27)

### Bug Fixes

-   ensure dynamic amount is passed to button component ([efde1d6](https://github.com/kiva/ui/commit/efde1d6201c7d59adaa2ff335c0024cc8e523f1f))

## [2.120.0](https://github.com/kiva/ui/compare/v2.119.1...v2.120.0) (2022-04-27)

### Features

-   component renamed and route updated ([f9ed805](https://github.com/kiva/ui/commit/f9ed805b12ddc7c341e889c67d02625753938cdd))

### [2.119.1](https://github.com/kiva/ui/compare/v2.119.0...v2.119.1) (2022-04-27)

### Bug Fixes

-   enable checking fake authentication info in qa environment ([#3761](https://github.com/kiva/ui/issues/3761)) ([b463594](https://github.com/kiva/ui/commit/b46359415ba43d15460695b9f980c01512307631))

## [2.119.0](https://github.com/kiva/ui/compare/v2.118.1...v2.119.0) (2022-04-27)

### Features

-   update LBC to accommodate less than 25 lend button + add tracking ([67506d0](https://github.com/kiva/ui/commit/67506d04f85e14e787bab078f47e5fda7c94fb32))

### Bug Fixes

-   progress bar fix ([166ef23](https://github.com/kiva/ui/commit/166ef23b586baac653d14b3fefd20b3b02d9f7ff))
-   tracking ([4a181f5](https://github.com/kiva/ui/commit/4a181f5ee687e8e74e360393977f25450bee4639))
-   update default vals ([3bbd2d0](https://github.com/kiva/ui/commit/3bbd2d03704bd687638e1169b3c24a9c76189a2c))
-   update tracking ([35465ff](https://github.com/kiva/ui/commit/35465ff2e6c28ff111390e91a6ca61b2a4b80e77))
-   update tracking for real this time ([854f09b](https://github.com/kiva/ui/commit/854f09ba4d626b2520dbe231f16ca4784033e29c))

### [2.118.1](https://github.com/kiva/ui/compare/v2.118.0...v2.118.1) (2022-04-26)

### Bug Fixes

-   category control component overwriting meta title ([#3757](https://github.com/kiva/ui/issues/3757)) ([1b8c533](https://github.com/kiva/ui/commit/1b8c533558d4975a0ef56ff589ec5bbddea7f132))

## [2.118.0](https://github.com/kiva/ui/compare/v2.117.0...v2.118.0) (2022-04-26)

### Features

-   dynamic lend amount button ([c9874fd](https://github.com/kiva/ui/commit/c9874fdac90605b6498bfde5d8b559c5c5a0425a))

### Bug Fixes

-   remove space and add todo ([bc193e8](https://github.com/kiva/ui/commit/bc193e87329a3a52cf7c6670c84ce3a9602a83ec))

## [2.117.0](https://github.com/kiva/ui/compare/v2.116.3...v2.117.0) (2022-04-26)

### Features

-   loan bundles experiment is able to all categories ([69cfd95](https://github.com/kiva/ui/commit/69cfd9579d2cd744496f0386fb8c84b53fad42a8))

### [2.116.3](https://github.com/kiva/ui/compare/v2.116.2...v2.116.3) (2022-04-25)

### Bug Fixes

-   tw-w-kiva card lint fixes ([0def5dc](https://github.com/kiva/ui/commit/0def5dccdc21aa250fea3f1798073a1c1c7c10b5))
-   tw-w-kiva card updated ([5ee6158](https://github.com/kiva/ui/commit/5ee6158b0b8dc1a1ee0d29c896edc8476820bc0c))
-   tw-w-kiva card updated ([675f727](https://github.com/kiva/ui/commit/675f727febb1e9d47e3539599a5377a5308a70c5))

### [2.116.2](https://github.com/kiva/ui/compare/v2.116.1...v2.116.2) (2022-04-25)

### Bug Fixes

-   remove /lp/\* routes from the sitemap ([#3754](https://github.com/kiva/ui/issues/3754)) ([ca3d25f](https://github.com/kiva/ui/commit/ca3d25fe0a10f7d861c860d476cd076847ec403d))

### [2.116.1](https://github.com/kiva/ui/compare/v2.116.0...v2.116.1) (2022-04-25)

### Bug Fixes

-   prevent unreservedAmount from being less than zero ([94d7fd9](https://github.com/kiva/ui/commit/94d7fd9e437858696216bf3c9420ecf0655901b8))

## [2.116.0](https://github.com/kiva/ui/compare/v2.115.2...v2.116.0) (2022-04-22)

### Features

-   monthly good optional choice exp false door lightbox ([6688fc9](https://github.com/kiva/ui/commit/6688fc90dfce14e2f364530c8cb69eb906abb720))

### Bug Fixes

-   remove package lock commit ([664fe7d](https://github.com/kiva/ui/commit/664fe7d1fa65e9285417c7e296aa0461ab1bd712))
-   update width for buttons ([8a70b4d](https://github.com/kiva/ui/commit/8a70b4d6de39f7cd9cc3c4a8803d01453fe33b06))
-   use new lightbox component ([82b4aa6](https://github.com/kiva/ui/commit/82b4aa60af3e896b72f678840073a9e163b417c8))

### [2.115.2](https://github.com/kiva/ui/compare/v2.115.1...v2.115.2) (2022-04-21)

### Performance Improvements

-   lazy-loading for homepage loan cards MARS-74 ([b219304](https://github.com/kiva/ui/commit/b2193049c00b7112d1ad549aea85aef919880f67))

### [2.115.1](https://github.com/kiva/ui/compare/v2.115.0...v2.115.1) (2022-04-20)

### Bug Fixes

-   type name should not be part of id argument ([3814c76](https://github.com/kiva/ui/commit/3814c765513529b1ba8918275f9dba036fb58c6b))

## [2.115.0](https://github.com/kiva/ui/compare/v2.114.0...v2.115.0) (2022-04-20)

### Features

-   canonical url for loan-by-category page ([1d38637](https://github.com/kiva/ui/commit/1d38637681d37a3a3b3dac27cae3942efaadda61))
-   set canonical urls ([aab0958](https://github.com/kiva/ui/commit/aab09581eedf1eeb89c4f2148569d0e245b54214))

### Bug Fixes

-   avoiding setting canonical url in some components ([d5ca249](https://github.com/kiva/ui/commit/d5ca24942f254da29026b8990595e6880b05f203))
-   solve conflicts ([fa380e1](https://github.com/kiva/ui/commit/fa380e1bc75b191e493b4d7658150aee820c8acc))

## [2.114.0](https://github.com/kiva/ui/compare/v2.113.0...v2.114.0) (2022-04-20)

### Features

-   add experiment assignment ([53f2de2](https://github.com/kiva/ui/commit/53f2de264c8e67e4280599822a60b1251e104122))
-   add optional action arg to track experiments ([eefaf92](https://github.com/kiva/ui/commit/eefaf92294903d39d96294fa9515e0afd3eb108e))
-   avoid categories sorting within control experiment ([7fed0d1](https://github.com/kiva/ui/commit/7fed0d1f28aff19f411034aaefa36c08b529fed7))

### Bug Fixes

-   change variant key to b ([78d4c25](https://github.com/kiva/ui/commit/78d4c25cfb9db3899e1e3e3e15b63a9319d407ef))
-   delete unused variables ([57c69ab](https://github.com/kiva/ui/commit/57c69ab887ce6c9c6bb2708cef373fa07cb53a31))
-   ensure exp run only in the browser ([89410de](https://github.com/kiva/ui/commit/89410de6f5c1e8e8689170c46f18701d6045a09a))
-   set exp in wwwheader file ([7f198b6](https://github.com/kiva/ui/commit/7f198b648704ff7e5524fb7c26378c40a7913fd7))
-   use apollo watch instead of created hook to get exp data ([68188bb](https://github.com/kiva/ui/commit/68188bb7ab6322ee61879ec0edc5af1f13da7220))

## [2.113.0](https://github.com/kiva/ui/compare/v2.112.0...v2.113.0) (2022-04-20)

### Features

-   init landing page work ([05a05cd](https://github.com/kiva/ui/commit/05a05cd5540bf410fd76d0f5ddc77f45d1018dbf))
-   update mg icons and add todo for false door ([4d33a1a](https://github.com/kiva/ui/commit/4d33a1add9828464e9a5e4b1deb43834c84c4deb))

### Bug Fixes

-   remove unnecessary change ([ecc8dca](https://github.com/kiva/ui/commit/ecc8dca1fac53ac624e3093257bc316a0725e8c4))
-   update styles ([a293bd8](https://github.com/kiva/ui/commit/a293bd81ac5d82d2687a1df5560338fd04be3501))

## [2.112.0](https://github.com/kiva/ui/compare/v2.111.0...v2.112.0) (2022-04-19)

### Features

-   add meta info to lend-by-category pages ([74e6cf6](https://github.com/kiva/ui/commit/74e6cf68ca7e11be1aac521e593bbc6fd64af359))
-   add og and twitter meta tags ([7220a7b](https://github.com/kiva/ui/commit/7220a7b5ce531b7b0a40e2ddb07e69e1a024247c))
-   dynamic sitemap route generator for contentful landing pages MARS-42 ([4526c41](https://github.com/kiva/ui/commit/4526c41625a71039def50bd40d33bdfc6ffc0001))
-   dynamic sitemap route generator for lending category pages MARS-42 ([5c5f1e5](https://github.com/kiva/ui/commit/5c5f1e590f85e37908c37cca005b2883265d8f29))
-   sitemap middleware for ui-server routes MARS-42 ([9bf9825](https://github.com/kiva/ui/commit/9bf982589dade31a5fa393b63615dfd4011492f0))
-   static sitemap route generator MARS-42 ([76f2c08](https://github.com/kiva/ui/commit/76f2c088240a7af4fda9386b430017a98ae5d591))

### Bug Fixes

-   changing meta default value to undefined ([33c1467](https://github.com/kiva/ui/commit/33c1467fee8083644cdde84f10b9a426ffd8fa76))

## [2.111.0](https://github.com/kiva/ui/compare/v2.110.0...v2.111.0) (2022-04-19)

### Features

-   trackers were updated for the loan bundles experiment ([252eaf5](https://github.com/kiva/ui/commit/252eaf55fda71dc92723e79c1bcd7ac9ad771a3b))

## [2.110.0](https://github.com/kiva/ui/compare/v2.109.0...v2.110.0) (2022-04-19)

### Features

-   clean up styles ([ed37553](https://github.com/kiva/ui/commit/ed37553fab6c00468443abc5783050d189366f56))
-   update braintree styles ([d0463f0](https://github.com/kiva/ui/commit/d0463f0562948ae30ef97b6409bca6ac478c5a0d))

### Bug Fixes

-   another lint commit ([38c9e72](https://github.com/kiva/ui/commit/38c9e7281ab996ee52d26b60c7cd062e3293af47))
-   lint errors ([903d94f](https://github.com/kiva/ui/commit/903d94f56d086d6a4764be4d2be169652e3da1e7))

## [2.109.0](https://github.com/kiva/ui/compare/v2.108.2...v2.109.0) (2022-04-18)

### Features

-   customized faqs were added for optional choice experiment ([7721fc0](https://github.com/kiva/ui/commit/7721fc038e4ae7da3e37bd7486ceefd5956abd30))

### [2.108.2](https://github.com/kiva/ui/compare/v2.108.1...v2.108.2) (2022-04-18)

### Bug Fixes

-   thanks page button focus styling ([dfe0cb9](https://github.com/kiva/ui/commit/dfe0cb9435ea25cd006b8ec7b1b8a470a928c5de))

### [2.108.1](https://github.com/kiva/ui/compare/v2.108.0...v2.108.1) (2022-04-15)

### Bug Fixes

-   mobile styles for kiva card updated ([45f5138](https://github.com/kiva/ui/commit/45f513898bc32c4b2d45bf50fb42e9e3898b813b))

## [2.108.0](https://github.com/kiva/ui/compare/v2.107.0...v2.108.0) (2022-04-15)

### Features

-   settings for mg_amount_selector experiment were removed ([bf686ce](https://github.com/kiva/ui/commit/bf686ce03ee888e997762f3efed29fffe72500e3))

### Bug Fixes

-   component usage was removed ([6e9399f](https://github.com/kiva/ui/commit/6e9399f1d4c023065c4efecd31fe530de440d963))
-   unused variable was removed ([55351c5](https://github.com/kiva/ui/commit/55351c504725aa8f0436a105e2edd40b10c61222))

## [2.107.0](https://github.com/kiva/ui/compare/v2.106.0...v2.107.0) (2022-04-14)

### Features

-   optional choice test settings were built ([9b41401](https://github.com/kiva/ui/commit/9b414011541da160dda93701dd66f959d05d6b8d))

## [2.106.0](https://github.com/kiva/ui/compare/v2.105.0...v2.106.0) (2022-04-14)

### Features

-   enhance borrower profile meta previews ([4ce0c63](https://github.com/kiva/ui/commit/4ce0c63457ab6bdacf9b0a5cd3ec3cd7e119aa1a))

## [2.105.0](https://github.com/kiva/ui/compare/v2.104.2...v2.105.0) (2022-04-13)

### Features

-   kvcontenfulimg component was replace for our kv-components one ([1438e7c](https://github.com/kiva/ui/commit/1438e7cfbccd5fda9554cfd6639ba81ccec34a9f))
-   mg page was updated to have a new style in the signup form ([27d2fc4](https://github.com/kiva/ui/commit/27d2fc47945fe4190b6d4b949b3909d56f6f139e))
-   unused css classes were removed ([1f3cd14](https://github.com/kiva/ui/commit/1f3cd14fc6c5d564d0c33574980d4fc3e5453abf))

### [2.104.2](https://github.com/kiva/ui/compare/v2.104.1...v2.104.2) (2022-04-13)

### Bug Fixes

-   thanks page layout and upsell for new subscription service users ([98eb2a8](https://github.com/kiva/ui/commit/98eb2a803f86ef9b543fab2bcbc06720e17b7463))

### [2.104.1](https://github.com/kiva/ui/compare/v2.104.0...v2.104.1) (2022-04-12)

### Bug Fixes

-   loan bundles initialization was updated ([bf33fd6](https://github.com/kiva/ui/commit/bf33fd69cb689768b3a9491feacf4ecb8eaedbdb))

## [2.104.0](https://github.com/kiva/ui/compare/v2.103.1...v2.104.0) (2022-04-11)

### Features

-   add and update meta info ([0000d82](https://github.com/kiva/ui/commit/0000d821ea4507d1d9d7edf2d29d693fe6587095))
-   add meta information ([432ed48](https://github.com/kiva/ui/commit/432ed48fcb7393c0a08fb532808c47f240b3af26))
-   adding tags to parser filter string logic ([c234d52](https://github.com/kiva/ui/commit/c234d5264c3c8b3742f95676a1df94add077c42d))
-   allowing dots in router and filter parser ([4548376](https://github.com/kiva/ui/commit/454837633f2be8eadfa6ff6d145b8614f9248f7e))
-   avoid unnecessary dot use in regex ([1fd6912](https://github.com/kiva/ui/commit/1fd691235d1f658f067462ab09e6abe39928d864))
-   change tests to get expected result ([883456e](https://github.com/kiva/ui/commit/883456eaa532d7c003e9971a05a5e0c89ab6f366))

### Bug Fixes

-   adding vmid to override meta description tag ([2678936](https://github.com/kiva/ui/commit/2678936e07e43cd0de4724fb981498ee14cbefa2))

### [2.103.1](https://github.com/kiva/ui/compare/v2.103.0...v2.103.1) (2022-04-11)

### Bug Fixes

-   added needed testid for header and banner ([242f669](https://github.com/kiva/ui/commit/242f6691cbe228ea2b696666a12bf4bc8b818980))
-   added some top level data-testids for elements with same data-testid ([4bfd733](https://github.com/kiva/ui/commit/4bfd733760f780fc2990b00aa307a399dcf53f1d))
-   fix SearchBar.spec.js test ([20ea3d5](https://github.com/kiva/ui/commit/20ea3d5f3668038b4e6cfab55431fae335f4a0c5))

## [2.103.0](https://github.com/kiva/ui/compare/v2.102.0...v2.103.0) (2022-04-11)

### Features

-   all the setting for mg_amount_selector experiment were removed ([17d2b5f](https://github.com/kiva/ui/commit/17d2b5fce8f72cfe6383e464abdd8cd86006f281))

## [2.102.0](https://github.com/kiva/ui/compare/v2.101.2...v2.102.0) (2022-04-05)

### Features

-   deprecate causes homepage experiment and sign up pages ([2fee1ab](https://github.com/kiva/ui/commit/2fee1abd3b33e0e8e8ecea921aa70af347414292))

### [2.101.2](https://github.com/kiva/ui/compare/v2.101.1...v2.101.2) (2022-04-01)

### Bug Fixes

-   remove duplicate/old data-test attributes ([2061ec5](https://github.com/kiva/ui/commit/2061ec54f2765ab5545b7027e5689feb905c61bb))
-   use data-testid instead of data-test for element attributes ([3a70160](https://github.com/kiva/ui/commit/3a701601eb5b00ecf6ee20f2e9cdc04f4035a282))

### [2.101.1](https://github.com/kiva/ui/compare/v2.101.0...v2.101.1) (2022-04-01)

### Bug Fixes

-   set node and npm version on ui storybook job ([fab0d76](https://github.com/kiva/ui/commit/fab0d76281b67e1d0182b6f8f99dc1e450e2028b))

## [2.101.0](https://github.com/kiva/ui/compare/v2.100.0...v2.101.0) (2022-04-01)

### Features

-   remove lunar dependencies and unused graphql mock ([2f28195](https://github.com/kiva/ui/commit/2f28195fd60c30b5eec847298543876067688668))
-   update vue, vue-template-compiler and vue-server-renderer ([aeeff09](https://github.com/kiva/ui/commit/aeeff090c139aba8c79866ef1a39eafa5f32fe29))

### Bug Fixes

-   update unit test node version ([49ee83f](https://github.com/kiva/ui/commit/49ee83ff0a933de1807f6b66b37f6685836db17e))

## [2.100.0](https://github.com/kiva/ui/compare/v2.99.2...v2.100.0) (2022-03-31)

### Features

-   automaticallysupportnotice component was created ([48b891e](https://github.com/kiva/ui/commit/48b891ea4de019ff768e7701a021340c79391062))
-   personalized mg page was removed and related components ([b37f1d1](https://github.com/kiva/ui/commit/b37f1d126f9c72859d7c355d8a6063a3a7f4f2df))
-   query and initialization for mg personalization experiment were removed ([2c55c8b](https://github.com/kiva/ui/commit/2c55c8b7775e8436bc08d920bdf6825fd91e974b))

### [2.99.2](https://github.com/kiva/ui/compare/v2.99.1...v2.99.2) (2022-03-30)

### Bug Fixes

-   ensure custom donation amount is propagated to parent context ([c7ea61f](https://github.com/kiva/ui/commit/c7ea61f17f90e90e873ae26be12adacff5021d33))

### [2.99.1](https://github.com/kiva/ui/compare/v2.99.0...v2.99.1) (2022-03-30)

### Bug Fixes

-   addtobasket method was updated for a bug adding double donation ([d22b23e](https://github.com/kiva/ui/commit/d22b23ebebf00a7730c79ccb20639a9c9be8163b))

## [2.99.0](https://github.com/kiva/ui/compare/v2.98.0...v2.99.0) (2022-03-29)

### Features

-   deprecate start page ([4141060](https://github.com/kiva/ui/commit/4141060549373127773bcfe060406958d91854cd))

## [2.98.0](https://github.com/kiva/ui/compare/v2.97.1...v2.98.0) (2022-03-28)

### Features

-   error message for addtobasket function was updated ([d8079c0](https://github.com/kiva/ui/commit/d8079c03855872caf56d4cb9bb3be4bffaa05f27))

### [2.97.1](https://github.com/kiva/ui/compare/v2.97.0...v2.97.1) (2022-03-24)

### Bug Fixes

-   apostrophe was updated for anonymous loans text ([85913ae](https://github.com/kiva/ui/commit/85913aebd6340fbb97f9477befbb7898a40468a0))

## [2.97.0](https://github.com/kiva/ui/compare/v2.96.0...v2.97.0) (2022-03-24)

### Features

-   specific text was added for anonymous loans in the BP ([cf332d8](https://github.com/kiva/ui/commit/cf332d86017a281bf65bc8b5722ce2592ccbee2d))

## [2.96.0](https://github.com/kiva/ui/compare/v2.95.0...v2.96.0) (2022-03-23)

### Features

-   jump links were added for mobile and ipad screens ([b73f505](https://github.com/kiva/ui/commit/b73f5051ae317063b8a1514317a4abec9d5775f3))

## [2.95.0](https://github.com/kiva/ui/compare/v2.94.0...v2.95.0) (2022-03-22)

### Features

-   lend by category v3 layout adjustments ([fb3c745](https://github.com/kiva/ui/commit/fb3c7456e9adf7b98ee255323ae701fd29e1e55f))

## [2.94.0](https://github.com/kiva/ui/compare/v2.93.1...v2.94.0) (2022-03-22)

### Features

-   spaces were added to the hero for desktop ([da853cb](https://github.com/kiva/ui/commit/da853cbbe1d9a0c0462537e1ca5340e0d72a98ee))

### [2.93.1](https://github.com/kiva/ui/compare/v2.93.0...v2.93.1) (2022-03-21)

### Bug Fixes

-   add + use composition api ([5f5f83e](https://github.com/kiva/ui/commit/5f5f83e98b96f3fbd4a9f2799732e9d3ebe6d8e9))
-   guard ref usage and update for-label prop on kv tab ([2f06724](https://github.com/kiva/ui/commit/2f067240a38baa58edeb41f82ec59ab18018a36c))
-   update for breaking changes in tailwind config, KvSelect, KvCheckbox, and KvTextInput ([a3c92d4](https://github.com/kiva/ui/commit/a3c92d42b1d16d857fef89bf962208ec2e1e3585))
-   update model-value on mg kv-select and guard loan arrays ([36f2816](https://github.com/kiva/ui/commit/36f2816cd93c73a398fd602efea93c440ebed579))
-   update props and ref usage to match new componenet signatures ([0a7a59a](https://github.com/kiva/ui/commit/0a7a59a37b52102b23d392def35a84ca7f68eb92))

## [2.93.0](https://github.com/kiva/ui/compare/v2.92.0...v2.93.0) (2022-03-21)

### Features

-   dynamic text for bundles was added ([ded87dc](https://github.com/kiva/ui/commit/ded87dc597056b5b7e047194cbeda52821261d3c))

### Bug Fixes

-   a default value was added to bundle text ([774dbff](https://github.com/kiva/ui/commit/774dbff160a7c80c210706a05bd42469c2e556f3))
-   optional chaining operator was added ([038fa83](https://github.com/kiva/ui/commit/038fa83a86d71543baf903595528823333c9087e))

## [2.92.0](https://github.com/kiva/ui/compare/v2.91.0...v2.92.0) (2022-03-21)

### Features

-   add dynamic unbounce page route to embed unbounce pages in iframe ([5f32074](https://github.com/kiva/ui/commit/5f320748f62c3cdca262daf835aa78bc90c7adc1))
-   poc for embedded unbounce page ([da3e9cf](https://github.com/kiva/ui/commit/da3e9cfaaaa3e945c89202f20f533c0770a7ba3d))

## [2.91.0](https://github.com/kiva/ui/compare/v2.90.0...v2.91.0) (2022-03-18)

### Features

-   redirect to checkout was added to lean to three cta ([88fb645](https://github.com/kiva/ui/commit/88fb6458aa1e102b872e48eb8ba9072d6ee22895))

## [2.90.0](https://github.com/kiva/ui/compare/v2.89.1...v2.90.0) (2022-03-18)

### Features

-   loan bundle added to category page for test ([a6f09f7](https://github.com/kiva/ui/commit/a6f09f755c458e7b80673e876d1dff608f7061e9))

### Bug Fixes

-   card component re-imported ([fe58604](https://github.com/kiva/ui/commit/fe5860424baf1ba4321dc809881ea738ff5ed32e))

### [2.89.1](https://github.com/kiva/ui/compare/v2.89.0...v2.89.1) (2022-03-17)

### Bug Fixes

-   loans are loaded dynamically for every category ([a8a86be](https://github.com/kiva/ui/commit/a8a86be863554b8b5a610b6ee36cc6574485fbb3))

## [2.89.0](https://github.com/kiva/ui/compare/v2.88.2...v2.89.0) (2022-03-16)

### Features

-   remove kiva us from lbc page experimental layout ([c4cad7e](https://github.com/kiva/ui/commit/c4cad7e66f1cff2466ffdc6f2530e041df637950))

### [2.88.2](https://github.com/kiva/ui/compare/v2.88.1...v2.88.2) (2022-03-15)

### Bug Fixes

-   set width on thanks icon buttons ([2f1d1cf](https://github.com/kiva/ui/commit/2f1d1cfc8d90cc31629bf8ccf3748d219cbaa851))

### [2.88.1](https://github.com/kiva/ui/compare/v2.88.0...v2.88.1) (2022-03-11)

### Bug Fixes

-   add analytics event on mg category selection ([655db3e](https://github.com/kiva/ui/commit/655db3e300249953ee764cdd2cd58f65411eb4fe))

## [2.88.0](https://github.com/kiva/ui/compare/v2.87.0...v2.88.0) (2022-03-10)

### Features

-   enable mg hero loans experiment ([57dabe9](https://github.com/kiva/ui/commit/57dabe912ccff0be96496f469c65a8ef28a033b1))

## [2.87.0](https://github.com/kiva/ui/compare/v2.86.0...v2.87.0) (2022-03-10)

### Features

-   some elements were hidden to match with ui design ([9fbeb83](https://github.com/kiva/ui/commit/9fbeb83817750735f3e87b49fdaad8159db56812))

## [2.86.0](https://github.com/kiva/ui/compare/v2.85.0...v2.86.0) (2022-03-10)

### Features

-   convert empty basket loan display + minimal loan card to kiva classic ([850e9d6](https://github.com/kiva/ui/commit/850e9d6850457f5374f1c0d241bb1dd149f6b196))

### Bug Fixes

-   reduce usage of legacy override styles ([9ec8357](https://github.com/kiva/ui/commit/9ec83578b15ded1aa57f5d06a3697f4889be2311))
-   remove width restriction on checkout contents ([4180750](https://github.com/kiva/ui/commit/4180750975bc868214f867494faea56e608c948b))

## [2.85.0](https://github.com/kiva/ui/compare/v2.84.1...v2.85.0) (2022-03-10)

### Features

-   data for loan ids was added to loan group categories file ([f8e9516](https://github.com/kiva/ui/commit/f8e9516d4225ca603e9e2dad9a230969fb77f368))
-   hero section for monthly good landing page was updated with a new design ([3e58b8d](https://github.com/kiva/ui/commit/3e58b8dfdd04e0d612de9fd34e2011851060be6a))

### Bug Fixes

-   unused code was removed ([4cdd7a9](https://github.com/kiva/ui/commit/4cdd7a9232fc4112243721d9d59e475b11cc9160))

### [2.84.1](https://github.com/kiva/ui/compare/v2.84.0...v2.84.1) (2022-03-09)

### Bug Fixes

-   lbc experiment layout minor fixes ([c5d8736](https://github.com/kiva/ui/commit/c5d87363d6a67fdef4d24216281b1735e7eb9c27))

## [2.84.0](https://github.com/kiva/ui/compare/v2.83.2...v2.84.0) (2022-03-09)

### Features

-   **lend-by-category:** add experiment for selecting hero loan VUE-917 ([171ea7d](https://github.com/kiva/ui/commit/171ea7d119dccf17b5181ddd3065d8ec90c3469c))

### [2.83.2](https://github.com/kiva/ui/compare/v2.83.1...v2.83.2) (2022-03-08)

### Bug Fixes

-   control mg upsell link visibility more explicity ([065886e](https://github.com/kiva/ui/commit/065886e7f43ca6e3f4eb36b61abc4d304bf4fadc))

### [2.83.1](https://github.com/kiva/ui/compare/v2.83.0...v2.83.1) (2022-03-08)

### Bug Fixes

-   convert mg copy from climate change to earth friendly ([476b6e7](https://github.com/kiva/ui/commit/476b6e710f1f8c5af8ea971f83e6f7720e92030f))

## [2.83.0](https://github.com/kiva/ui/compare/v2.82.0...v2.83.0) (2022-03-08)

### Features

-   improved open graph/twitter meta properties for sharing borrower profiles ([c8c7589](https://github.com/kiva/ui/commit/c8c758942dd6310af66b8fbe3fd41452f5213658))

## [2.82.0](https://github.com/kiva/ui/compare/v2.81.0...v2.82.0) (2022-03-08)

### Features

-   exclude experiment layout for categories that should not be experimented on ([93faf4e](https://github.com/kiva/ui/commit/93faf4e6ddf82b9f33f08648591ab3b877aacd08))
-   toggle experimental layout in lend by category page ([6fceaf3](https://github.com/kiva/ui/commit/6fceaf3231d8ca61d880a8a1a533d600ebb55221))

## [2.81.0](https://github.com/kiva/ui/compare/v2.80.0...v2.81.0) (2022-03-07)

### Features

-   lbc experiment layout category definitions and functionality ([c089a57](https://github.com/kiva/ui/commit/c089a5747dfc69f063d7fbefb792d15be6862170))

## [2.80.0](https://github.com/kiva/ui/compare/v2.79.1...v2.80.0) (2022-03-07)

### Features

-   activate contentful controls for setting default loan display and toggle visibility ([85884bd](https://github.com/kiva/ui/commit/85884bd279f0537b8c0f59d119866b72842a0804))
-   use v-if for loan display visibility + wire up optional setting ([b9b3b9e](https://github.com/kiva/ui/commit/b9b3b9e4b7f868dab11e7904354138243030e4f2))

### Bug Fixes

-   update comments around loan display settings from contentful ([663f6a9](https://github.com/kiva/ui/commit/663f6a9ec6212f2d56f9d73ca9f0825eea57f956))
-   updated corporate campaign footer styles to tailwind from broken green theme ([058b43c](https://github.com/kiva/ui/commit/058b43c6b5f5afdf5cefffc4c2bed6369b065bac))

### [2.79.1](https://github.com/kiva/ui/compare/v2.79.0...v2.79.1) (2022-03-03)

### Bug Fixes

-   add mobile view link tracking ([a3eaff8](https://github.com/kiva/ui/commit/a3eaff8d29a1d8194fd61ad01cb38ff3932871ae))
-   ensure link tracking on lend monthly link ([052482c](https://github.com/kiva/ui/commit/052482c21f468f91b48b69fc2c0735e7bd4120b6))

### Reverts

-   Revert "fix: ensure link tracking is active on router-links" ([99af1b4](https://github.com/kiva/ui/commit/99af1b41341dfe41bf64a383fdf505f5bbe4c533))

## [2.79.0](https://github.com/kiva/ui/compare/v2.78.2...v2.79.0) (2022-03-03)

### Features

-   remove checkout steps from interface ([9509ab5](https://github.com/kiva/ui/commit/9509ab54e5a086114390aeae14c49a9e61779375))

### [2.78.2](https://github.com/kiva/ui/compare/v2.78.1...v2.78.2) (2022-03-03)

### Bug Fixes

-   ensure mobile spacing between button and select ([cfe48a1](https://github.com/kiva/ui/commit/cfe48a1d127138ea520b0d91eb0d0061999b5e9b))

### [2.78.1](https://github.com/kiva/ui/compare/v2.78.0...v2.78.1) (2022-03-03)

### Bug Fixes

-   ensure link tracking is active on router-links ([1602e45](https://github.com/kiva/ui/commit/1602e457697f067092597be29d9e85dcc98490b9))

## [2.78.0](https://github.com/kiva/ui/compare/v2.77.1...v2.78.0) (2022-03-02)

### Features

-   setup filters visibility experiment on lend/filter ([5765092](https://github.com/kiva/ui/commit/57650926373e647eb04b2c129ece046901e647fa))

### [2.77.1](https://github.com/kiva/ui/compare/v2.77.0...v2.77.1) (2022-03-01)

### Bug Fixes

-   renable hiding donation option during promo checkout ([591d31c](https://github.com/kiva/ui/commit/591d31c9d0dfd1c8cc0503507f3e68f549ba3b41))

## [2.77.0](https://github.com/kiva/ui/compare/v2.76.0...v2.77.0) (2022-03-01)

### Features

-   convert checkout layout to kiva classic + tailwind ([98a040e](https://github.com/kiva/ui/commit/98a040e0102452fc2e7847a304b2b081666add86))

## [2.76.0](https://github.com/kiva/ui/compare/v2.75.2...v2.76.0) (2022-03-01)

### Features

-   core-369 lots of style cleanup while transitioning to tailwind ([2fde3b9](https://github.com/kiva/ui/commit/2fde3b9540d50d07ffe448776ddd00294cf1cab9))
-   refactor mobile and desktop into single donation selection interface ([bc212fa](https://github.com/kiva/ui/commit/bc212fa3797bc3f0248908434e15cd325c43e9f4))
-   update mobile donation lightbox to kiva classic ([89d676b](https://github.com/kiva/ui/commit/89d676b548de3592261cfb8b685b6a9cebab9a9f))

### Bug Fixes

-   core-369 wrapping up tailwinds cleanup. ([3d4f0b2](https://github.com/kiva/ui/commit/3d4f0b26da1dc1688cf5fdc721aea3b5fe3d8c14))

### [2.75.2](https://github.com/kiva/ui/compare/v2.75.1...v2.75.2) (2022-03-01)

### Bug Fixes

-   update donation interface test ids ([5103818](https://github.com/kiva/ui/commit/5103818704be77eb9033a29268b40fc18739b5cf))

### [2.75.1](https://github.com/kiva/ui/compare/v2.75.0...v2.75.1) (2022-03-01)

### Bug Fixes

-   for proper mounting after ssr App.vue root element must have id `app` ([9d9af8d](https://github.com/kiva/ui/commit/9d9af8dbc053b4fb6356a737c6b45548f69784c5))

## [2.75.0](https://github.com/kiva/ui/compare/v2.74.2...v2.75.0) (2022-02-28)

### Features

-   lbc experimental page template ([a1ebcc8](https://github.com/kiva/ui/commit/a1ebcc8963f0f4f980c2ff015f8f96f194c0443e))

### [2.74.2](https://github.com/kiva/ui/compare/v2.74.1...v2.74.2) (2022-02-25)

### Bug Fixes

-   ensure kiva credit checkout errors bubble up and show a toast message ([6444182](https://github.com/kiva/ui/commit/64441827121a2358223c2af54da5f6ce450d5748))

### [2.74.1](https://github.com/kiva/ui/compare/v2.74.0...v2.74.1) (2022-02-23)

### Bug Fixes

-   use change event to ensure bound events in the parent are triggered ([51f05f3](https://github.com/kiva/ui/commit/51f05f338cde4adc72950bb29fb0fdfcc3b3813d))

## [2.74.0](https://github.com/kiva/ui/compare/v2.73.0...v2.74.0) (2022-02-22)

### Features

-   kvanalytics plugin was updated to work as an isolated plugin ([796055f](https://github.com/kiva/ui/commit/796055f9f65df60bfea159469313807440ec9550))

## [2.73.0](https://github.com/kiva/ui/compare/v2.72.2...v2.73.0) (2022-02-22)

### Features

-   add cookie expiration to 2 years ([30f2599](https://github.com/kiva/ui/commit/30f2599050c5d1f20bb9e4007c93bd3813e5deea))
-   add unbounce capture to additional routes ([c5ac4db](https://github.com/kiva/ui/commit/c5ac4dba1bb81a3e0d77f74938f236d77196dc86))
-   do not fire unbounce event if utm_medium is email ([081a4fb](https://github.com/kiva/ui/commit/081a4fbef3312c1b821ac1d75563c7cf2d8d5f1d))

### [2.72.2](https://github.com/kiva/ui/compare/v2.72.1...v2.72.2) (2022-02-18)

### Bug Fixes

-   lend button spacing ([7f9bd27](https://github.com/kiva/ui/commit/7f9bd274feb443995f9203a7441692b78c9172e2))

### [2.72.1](https://github.com/kiva/ui/compare/v2.72.0...v2.72.1) (2022-02-18)

### Bug Fixes

-   update address of date from query for mg lend menu setting ([a7eb5f0](https://github.com/kiva/ui/commit/a7eb5f0c2398991e1ffc326fffe0ddfdd7ea8dfd))

## [2.72.0](https://github.com/kiva/ui/compare/v2.71.3...v2.72.0) (2022-02-17)

### Features

-   provide setting to swap copy for mg link in lend menu ([8cf4489](https://github.com/kiva/ui/commit/8cf44894b4ff0bc89b98895f47ce631644e02078))
-   v2 of thanks auto-deposit upsell. required moving thanks data setup into created ([35a9810](https://github.com/kiva/ui/commit/35a9810e12d9c290235c71b99e78649319c7fe95))

### Bug Fixes

-   replicate deep styles for mg hero contentful image ([95675cd](https://github.com/kiva/ui/commit/95675cdb0d1c3e888a6f4fe03edef539efa0bb3e))

### [2.71.3](https://github.com/kiva/ui/compare/v2.71.2...v2.71.3) (2022-02-16)

### Bug Fixes

-   **FakeAuthentication:** set auth domain from server entry ([1a43a48](https://github.com/kiva/ui/commit/1a43a4860f87ca0934f800dd220edb657fe2da37))

### [2.71.2](https://github.com/kiva/ui/compare/v2.71.1...v2.71.2) (2022-02-16)

### Bug Fixes

-   ensure promo credit opt-out is removed after removing credit ([bce07a1](https://github.com/kiva/ui/commit/bce07a1e5e48ac5e5dee1b54700fc652f1d4dc34))

### [2.71.1](https://github.com/kiva/ui/compare/v2.71.0...v2.71.1) (2022-02-15)

### Bug Fixes

-   core-400 altering contentful to read subHeading instead of Headline ([397a104](https://github.com/kiva/ui/commit/397a104a1c9cb06e67981449e505b8ba23b6673d))

## [2.71.0](https://github.com/kiva/ui/compare/v2.70.0...v2.71.0) (2022-02-15)

### Features

-   modifies cause hp experiment to include non mobile users as well ([9e62299](https://github.com/kiva/ui/commit/9e62299babac4a1832a8ba3a32fdfdd78650491b))

## [2.70.0](https://github.com/kiva/ui/compare/v2.69.6...v2.70.0) (2022-02-14)

### Features

-   improve employee verification form check and process flow ([edec517](https://github.com/kiva/ui/commit/edec517f498821e8e24ddde182dd68f074fd16cc))

### [2.69.6](https://github.com/kiva/ui/compare/v2.69.5...v2.69.6) (2022-02-14)

### Bug Fixes

-   update experiment assignment logic flow and tracking ([d036c7e](https://github.com/kiva/ui/commit/d036c7e3ef15d49a13b102c952aa8d9d7b0b12c7))

### [2.69.6](https://github.com/kiva/ui/compare/v2.69.5...v2.69.6) (2022-02-14)

### Bug Fixes

-   update experiment assignment logic flow and tracking ([d036c7e](https://github.com/kiva/ui/commit/d036c7e3ef15d49a13b102c952aa8d9d7b0b12c7))

### [2.69.5](https://github.com/kiva/ui/compare/v2.69.4...v2.69.5) (2022-02-14)

### Bug Fixes

-   core-400 cleaning up a console.log ([c05a36c](https://github.com/kiva/ui/commit/c05a36ccf781e01c92a86c5f92adf7874e4796f2))

### [2.69.4](https://github.com/kiva/ui/compare/v2.69.3...v2.69.4) (2022-02-14)

### Bug Fixes

-   core-400 fixes to monthlygood personalized hero, and monthly good hero for sm screens ([b1b2ae3](https://github.com/kiva/ui/commit/b1b2ae316979a3c39d797cef9e29ef067a20815d))
-   core-400 spacing in hero for large screens. ([ccf708d](https://github.com/kiva/ui/commit/ccf708d79449c3009cdd70216957d352352be7c3))
-   correctly passing amount through to MG/setup page, removing unused function ([99d9c64](https://github.com/kiva/ui/commit/99d9c6443a353e46833b6e6afa16cce0b59fa9b3))
-   refinements to MG hero on personalized page ([0954014](https://github.com/kiva/ui/commit/0954014c125be4e08794701034a5be0023f83a37))

### [2.69.3](https://github.com/kiva/ui/compare/v2.69.2...v2.69.3) (2022-02-11)

### Bug Fixes

-   udpate pmg thanks copy ([f3f1510](https://github.com/kiva/ui/commit/f3f1510cce0b1d803d0326d521018b4d315070d0))
-   update pmg analtyics events and thanks lightbox copy ([5c68021](https://github.com/kiva/ui/commit/5c680216f55ffbbe4ef51a41173cd35b7fe83265))

### [2.69.2](https://github.com/kiva/ui/compare/v2.69.1...v2.69.2) (2022-02-11)

### Bug Fixes

-   fixing alignment of value prop across screen sizes ([3d30348](https://github.com/kiva/ui/commit/3d30348504201bf297800237151bb5b305d421ba))

### [2.69.1](https://github.com/kiva/ui/compare/v2.69.0...v2.69.1) (2022-02-11)

### Bug Fixes

-   ensure loan category selection fires an analytics event ([2389172](https://github.com/kiva/ui/commit/2389172f7e77d8306f0d1a28d6e46ae78d0378ff))

## [2.69.0](https://github.com/kiva/ui/compare/v2.68.0...v2.69.0) (2022-02-11)

### Features

-   core-439 fixing opacity in monthly good cta boxes ([27ef0ef](https://github.com/kiva/ui/commit/27ef0ef283ad2c76111caffea49f4a19050fcaeb))

## [2.68.0](https://github.com/kiva/ui/compare/v2.67.1...v2.68.0) (2022-02-10)

### Features

-   core-420 rest of the personalized monthly good page in place ([4c2c1b5](https://github.com/kiva/ui/commit/4c2c1b57a87558715f80f77c52b0ca3643ede481))
-   core-420, rest of the personalized monthly good landing page, ported from monthly good page ([4b7d022](https://github.com/kiva/ui/commit/4b7d022f1e0e5df89247c7b5f254cacbad3753eb))

### Bug Fixes

-   core-420 removing 2 form on page ([5a601f0](https://github.com/kiva/ui/commit/5a601f05d505dcd76af48db01aebb472ca45ca8c))

### [2.67.1](https://github.com/kiva/ui/compare/v2.67.0...v2.67.1) (2022-02-10)

### Bug Fixes

-   update copy for thanks state lightbox ([ee70695](https://github.com/kiva/ui/commit/ee70695012cbf99253fe2a12a38f3195838c86a9))

## [2.67.0](https://github.com/kiva/ui/compare/v2.66.0...v2.67.0) (2022-02-10)

### Features

-   kvcustomdonation component was removed because not used in other pages ([68ac1e7](https://github.com/kiva/ui/commit/68ac1e7998ba0ce0a8c2cba36dcaf3d8848dcc17))
-   protocol page and its route were removed ([cddb86b](https://github.com/kiva/ui/commit/cddb86b243b9accc7a5ec48fcf6468b13a319f35))

### Bug Fixes

-   fix margin on funded text in loan card ([9fd34ed](https://github.com/kiva/ui/commit/9fd34ed44c5f6ff24081b8f7453f88ce3a9955d3))

## [2.66.0](https://github.com/kiva/ui/compare/v2.65.0...v2.66.0) (2022-02-10)

### Features

-   kiva classic lend now and lend 25 buttons ([6f8eb8d](https://github.com/kiva/ui/commit/6f8eb8de495e726cc53166c34974d76fb55e4b02))

## [2.65.0](https://github.com/kiva/ui/compare/v2.64.0...v2.65.0) (2022-02-10)

### Features

-   core-405 MG personalized value prop ([38c0c57](https://github.com/kiva/ui/commit/38c0c57cdc5595d529a067848685d198aecc735f))

### Bug Fixes

-   core-405 using flexbox instead of replicating content. ([bb9369d](https://github.com/kiva/ui/commit/bb9369d488c35c77eb15e871c1b937f0e97411ce))

## [2.64.0](https://github.com/kiva/ui/compare/v2.63.0...v2.64.0) (2022-02-09)

### Features

-   enable lightbox with interest form for personalized mg ([d1cad74](https://github.com/kiva/ui/commit/d1cad746e3aef52959138e6330162515f72cbee9))

### Bug Fixes

-   clean up merge conflicts ([0159165](https://github.com/kiva/ui/commit/01591657f7dcfb7965183caab8bc6e700b7b16bb))
-   show lightbox and update tracking on form submit ([dfed907](https://github.com/kiva/ui/commit/dfed9079d1f68300dbb0bf6d28c288d43394dcaf))

## [2.63.0](https://github.com/kiva/ui/compare/v2.62.2...v2.63.0) (2022-02-09)

### Features

-   core-404 personalized mg hero in place, only cleanup needed ([0ad5b1a](https://github.com/kiva/ui/commit/0ad5b1a83ef1a49c23f7b086ed112e4ee0951ed5))
-   core-404 style touch up for the personalized monthly good landing page hero ([e799e47](https://github.com/kiva/ui/commit/e799e479f94e126bb883f197443c49c50371dcbd))

### [2.62.2](https://github.com/kiva/ui/compare/v2.62.1...v2.62.2) (2022-02-07)

### Bug Fixes

-   update button icon size and position ([54c5416](https://github.com/kiva/ui/commit/54c541685ea21e6d501b29445459de2756775eec))

### [2.62.1](https://github.com/kiva/ui/compare/v2.62.0...v2.62.1) (2022-02-07)

### Bug Fixes

-   alight analtyics event category ([7c4a14a](https://github.com/kiva/ui/commit/7c4a14a655811ed34a079720c5bf74e210575bc4))

## [2.62.0](https://github.com/kiva/ui/compare/v2.61.0...v2.62.0) (2022-02-07)

### Features

-   gaurd lightbox visibility on mg, subs + basket state ([d7e02cb](https://github.com/kiva/ui/commit/d7e02cbcb075f7f56f04849bd43bd1ee6dedd760))
-   setup new timed lightbox on lend-by-category for mg upsell ([92ab3de](https://github.com/kiva/ui/commit/92ab3dee152542d6c6e8ac8e8ecdfebee093ab18))

## [2.61.0](https://github.com/kiva/ui/compare/v2.60.0...v2.61.0) (2022-02-04)

### Features

-   choose a cause page ([351416f](https://github.com/kiva/ui/commit/351416fa2f9817cf70b47f5f99d5ebf1798e98b8))

## [2.60.0](https://github.com/kiva/ui/compare/v2.59.0...v2.60.0) (2022-02-04)

### Features

-   core-399 adding tracking into conditional to only throw if experiment is active and user is in group A" ([d999ff2](https://github.com/kiva/ui/commit/d999ff2c4071d26a71e84b09529a1d59edde2548))
-   core-399 Monthlygood appeal personalized experiment setup ([759ba60](https://github.com/kiva/ui/commit/759ba60af1c534cd1559267a6b85b21589fb0723))

### Bug Fixes

-   core-399 fixing tracking event from A -> B ([92cc33f](https://github.com/kiva/ui/commit/92cc33f0f0c8d03fead137bda4e4432de196f786))

## [2.59.0](https://github.com/kiva/ui/compare/v2.58.1...v2.59.0) (2022-02-01)

### Features

-   tracking for recommended row algorithm experiment VUE-937 ([62a3a0e](https://github.com/kiva/ui/commit/62a3a0ee720a8a663a4f00ed92a3667750729e0f))

### [2.58.1](https://github.com/kiva/ui/compare/v2.58.0...v2.58.1) (2022-02-01)

### Bug Fixes

-   remove guards for new subs service from MG and AD landing pages ([c79afa7](https://github.com/kiva/ui/commit/c79afa7ea10181a970e7261cfc40fdbf7097db18))

## [2.58.0](https://github.com/kiva/ui/compare/v2.57.0...v2.58.0) (2022-02-01)

### Features

-   storyCard component enhancements ([e5a5ffe](https://github.com/kiva/ui/commit/e5a5ffe324b15ba321cb55421ba27983077f6c2a))

## [2.57.0](https://github.com/kiva/ui/compare/v2.56.1...v2.57.0) (2022-01-31)

### Features

-   prevent thanks page errors when user is not logged or did not come from guest checkout ([e6c620a](https://github.com/kiva/ui/commit/e6c620a7c8449e663505e42c97ad758169e94cd0))

### [2.56.1](https://github.com/kiva/ui/compare/v2.56.0...v2.56.1) (2022-01-31)

### Reverts

-   Revert "fix: core-411 only fetching fundraising loan data if loan is fundraising" ([bb06c51](https://github.com/kiva/ui/commit/bb06c515a0cc01533c9d5990d12b026317717b36))

## [2.56.0](https://github.com/kiva/ui/compare/v2.55.1...v2.56.0) (2022-01-28)

### Features

-   remove unused styleguide routes and components ([680b9f7](https://github.com/kiva/ui/commit/680b9f7dcbc25b4c1b61a97be8952a859e69bcea))
-   update /styleguide page content to point to Kiva Classic resources ([87686a9](https://github.com/kiva/ui/commit/87686a9bbad6276ab3e6c66c017e0daf5a39ba2d))

### Bug Fixes

-   redirect child styleguide routes to new styleguide page ([80cf0bc](https://github.com/kiva/ui/commit/80cf0bcb2cc333d3a3424b67354cbeeee2a2764d))

### [2.55.1](https://github.com/kiva/ui/compare/v2.55.0...v2.55.1) (2022-01-28)

### Bug Fixes

-   cleaning up file includes ([dc0ec24](https://github.com/kiva/ui/commit/dc0ec24b011b46e951642344f2798697eb63e7ea))
-   swapping link type to get the right font. ([9f2aa33](https://github.com/kiva/ui/commit/9f2aa33b10fe65e3a387fe2e9e8b51edaf12b007))

## [2.55.0](https://github.com/kiva/ui/compare/v2.54.1...v2.55.0) (2022-01-28)

### Features

-   core-381 reworking DonationItem.vue with tailwinds classes and to match the new design ([9355169](https://github.com/kiva/ui/commit/935516912368c5c88408244bcbe9fb0f1d4e80f7))

### Bug Fixes

-   core-381 icon size adjustments across screen sizes and locations ([420292b](https://github.com/kiva/ui/commit/420292b3b278fbbc6e0d807b92a507484d5d83b7))

### [2.54.1](https://github.com/kiva/ui/compare/v2.54.0...v2.54.1) (2022-01-28)

### Bug Fixes

-   guard against missing graphql endpoint in test envs and an empty receipt ([026a95e](https://github.com/kiva/ui/commit/026a95e552091489eacec341aac7354593da923c))

## [2.54.0](https://github.com/kiva/ui/compare/v2.53.1...v2.54.0) (2022-01-28)

### Features

-   update basket items with Kiva Classic and extract a removeBasketItem component ([b36797d](https://github.com/kiva/ui/commit/b36797d94cbc8c1e577107d9e6b26ec564a54edc))

### [2.53.1](https://github.com/kiva/ui/compare/v2.53.0...v2.53.1) (2022-01-27)

### Bug Fixes

-   remove gradient from imageCard link storycards ([a35135c](https://github.com/kiva/ui/commit/a35135c552589c50909d41f641b9492a0cd1a1ac))

## [2.53.0](https://github.com/kiva/ui/compare/v2.52.0...v2.53.0) (2022-01-27)

### Features

-   core-370 optional styles for swapping the checkbox and label for the vintage KvCheckbox ([4ca52b3](https://github.com/kiva/ui/commit/4ca52b3cf6ae5b30e9dffab37bf4350e613ba439))

### Bug Fixes

-   core-370 fixing the tool tip, and ensuring both checkbox right and checkbox left look right ([9b20185](https://github.com/kiva/ui/commit/9b2018547887f2d35dc1c05a893fde551b75227c))
-   core-370 tailwinds adjustments, removing tw-mt-2 from conditional and displaying it always. ([816c130](https://github.com/kiva/ui/commit/816c1302d54f3f554c3e2f12156b1f3d3797c61d))

## [2.52.0](https://github.com/kiva/ui/compare/v2.51.1...v2.52.0) (2022-01-27)

### Features

-   remove HomepageMidrollCTA component ([eea129d](https://github.com/kiva/ui/commit/eea129d26a0e9cbfccac68146a807bac61ca520f))

### [2.51.1](https://github.com/kiva/ui/compare/v2.51.0...v2.51.1) (2022-01-27)

### Bug Fixes

-   exclude private tags from the tag filter list ([58ae628](https://github.com/kiva/ui/commit/58ae628396e31f296855bce7a86648dcf8c8e9db))

## [2.51.0](https://github.com/kiva/ui/compare/v2.50.2...v2.51.0) (2022-01-27)

### Features

-   restrict Causes users from seeing MG and AD signups ([12796dd](https://github.com/kiva/ui/commit/12796dde9909f33fded468f045450d821607eadf))

### [2.50.2](https://github.com/kiva/ui/compare/v2.50.1...v2.50.2) (2022-01-26)

### Bug Fixes

-   core-411 only fetching fundraising loan data if loan is fundraising ([d2123ff](https://github.com/kiva/ui/commit/d2123ffb131e1bccdeecc17c62588e4432797229))

### [2.50.1](https://github.com/kiva/ui/compare/v2.50.0...v2.50.1) (2022-01-26)

### Bug Fixes

-   ensure team id is synced properly when present or 0 when not present ([b7ef7cf](https://github.com/kiva/ui/commit/b7ef7cf22a0f087b63dd10d1395b94b949003a35))

## [2.50.0](https://github.com/kiva/ui/compare/v2.49.1...v2.50.0) (2022-01-26)

### Features

-   remove beta query param for causes ([f53cfdf](https://github.com/kiva/ui/commit/f53cfdfd6c81f6494021e02b9b3f3be43d5103b6))

### [2.49.1](https://github.com/kiva/ui/compare/v2.49.0...v2.49.1) (2022-01-25)

### Bug Fixes

-   ensure promoOnly basket context is passed to grid view ([6f3b728](https://github.com/kiva/ui/commit/6f3b728f9078d8bea76cb74fbaaa8032d0fe2774))

## [2.49.0](https://github.com/kiva/ui/compare/v2.48.1...v2.49.0) (2022-01-24)

### Features

-   clickable imageCard theme story cards ([98ef7bc](https://github.com/kiva/ui/commit/98ef7bc6be2ef3bcb4c061ae399332006941f65a))

### [2.48.1](https://github.com/kiva/ui/compare/v2.48.0...v2.48.1) (2022-01-21)

### Bug Fixes

-   allow website link to be processed, fire sentry in the client only ([2b180ac](https://github.com/kiva/ui/commit/2b180ac109e522462fad44adf96be151887e54c5))

## [2.48.0](https://github.com/kiva/ui/compare/v2.47.4...v2.48.0) (2022-01-21)

### Features

-   deprecate HomepageBottomCTA Component ([f301f8a](https://github.com/kiva/ui/commit/f301f8ad65850c021b5bf1c87d39206235dd5b17))

### [2.47.4](https://github.com/kiva/ui/compare/v2.47.3...v2.47.4) (2022-01-21)

### Bug Fixes

-   ensure only promo credit notices show, add links for lending reward ([4015058](https://github.com/kiva/ui/commit/40150587c8e16da828fe9efdb267bff03424dd94))

### [2.47.3](https://github.com/kiva/ui/compare/v2.47.2...v2.47.3) (2022-01-21)

### Bug Fixes

-   let message take up the full width if the loan is selected by another lender ([5c2cefc](https://github.com/kiva/ui/commit/5c2cefcc37098bdc782ff64f266c6025168900ac))
-   remove font-size with higher specificy than tailwind class ([fe14842](https://github.com/kiva/ui/commit/fe148422799b5e427a3f36282b3e11c128db07e4))

### [2.47.2](https://github.com/kiva/ui/compare/v2.47.1...v2.47.2) (2022-01-20)

### Bug Fixes

-   bump spacing between borrower image and name in LoanStory component ([024398f](https://github.com/kiva/ui/commit/024398f1d983dcc50358a0d77cdd067115a97379))

### [2.47.1](https://github.com/kiva/ui/compare/v2.47.0...v2.47.1) (2022-01-20)

### Bug Fixes

-   enlarge profile image on medium screens and make the image a circle ([21f910c](https://github.com/kiva/ui/commit/21f910c9c932c1c61a8acaf8715e14fd8b99aebc))
-   use id instead of url to check for default profile image ([6429a04](https://github.com/kiva/ui/commit/6429a048cb03198b2e4e58582c3167fe52b2f678))

## [2.47.0](https://github.com/kiva/ui/compare/v2.46.6...v2.47.0) (2022-01-20)

### Features

-   sort category names alphabetically ([52b3c03](https://github.com/kiva/ui/commit/52b3c03a3a3d08472876585f671c0b1116c8d474))

### [2.46.6](https://github.com/kiva/ui/compare/v2.46.5...v2.46.6) (2022-01-19)

### Bug Fixes

-   resets the accordions and open categories when menu is closed ([23c86a0](https://github.com/kiva/ui/commit/23c86a0f98010b9850d4ae03f645c4908869d58d))

### [2.46.5](https://github.com/kiva/ui/compare/v2.46.4...v2.46.5) (2022-01-19)

### Bug Fixes

-   add accessible text to social media icons ([83ed035](https://github.com/kiva/ui/commit/83ed0359914150dd677a8bc419b6dd9bb22e1fad))

### [2.46.4](https://github.com/kiva/ui/compare/v2.46.3...v2.46.4) (2022-01-19)

### Bug Fixes

-   consolidate basket bar visibility restrictions ([0c2abae](https://github.com/kiva/ui/commit/0c2abaec04ac20032011f5541569403b53db1806))
-   update methods for basket-bar visibility to use route. ensure it's hidden on checkout ([13d4f72](https://github.com/kiva/ui/commit/13d4f72028c1f114ea6162e22847d6dc1158635f))

### [2.46.3](https://github.com/kiva/ui/compare/v2.46.2...v2.46.3) (2022-01-19)

### Bug Fixes

-   center images in HomepageVerticalCTA, remove event bindings from HomepageBottomCTA ([71a19ed](https://github.com/kiva/ui/commit/71a19edd350b92e5c6197d563bd6095cbe9edb1a))

### [2.46.2](https://github.com/kiva/ui/compare/v2.46.1...v2.46.2) (2022-01-19)

### Bug Fixes

-   ensure promo credit banner has basket state and mechanism to dicate it's visibility ([707b7da](https://github.com/kiva/ui/commit/707b7da35b228d4c5ff3e0fdaf44ebbab3025c5f))
-   ensure stable color when clicking promo links ([1feb775](https://github.com/kiva/ui/commit/1feb7753306bf50094b8a0edde5593fa3c8e99fc))
-   remove duplicate data fetch for data provided in basketState ([543bf1f](https://github.com/kiva/ui/commit/543bf1f07ee68b96093272e1279e99959038a938))

### [2.46.1](https://github.com/kiva/ui/compare/v2.46.0...v2.46.1) (2022-01-19)

### Bug Fixes

-   make sure webpack includes fonts that Tailwind config references ([65a7200](https://github.com/kiva/ui/commit/65a7200cc4fabcfb873e96ab3168a9c31d11bcda))

## [2.46.0](https://github.com/kiva/ui/compare/v2.45.7...v2.46.0) (2022-01-19)

### Features

-   deprecates dynamicHero component ([dd9bbb1](https://github.com/kiva/ui/commit/dd9bbb1018af01067b04509ce3a503c8307ccb3e))

### [2.45.7](https://github.com/kiva/ui/compare/v2.45.6...v2.45.7) (2022-01-18)

### Bug Fixes

-   core-218 updating Starred loans -> Saved loans in lend menu ([8a44417](https://github.com/kiva/ui/commit/8a44417ca6d3a1406921457f3de0481e8dcb715e))

### [2.45.6](https://github.com/kiva/ui/compare/v2.45.5...v2.45.6) (2022-01-18)

### Bug Fixes

-   prevent carousel slides from floating above the header ([c1aa1c6](https://github.com/kiva/ui/commit/c1aa1c6bf95d02214ec71431b167ab8853131e4e))

### [2.45.5](https://github.com/kiva/ui/compare/v2.45.4...v2.45.5) (2022-01-18)

### Bug Fixes

-   bump version number ([50cba02](https://github.com/kiva/ui/commit/50cba02b4af8c9dbb8f07f5f5eafaa3a1590953e))

### [2.45.4](https://github.com/kiva/ui/compare/v2.45.3...v2.45.4) (2022-01-18)

### Bug Fixes

-   guard ad upsell readQuery ([ee40be6](https://github.com/kiva/ui/commit/ee40be6cd14e90323d1e3aa8a629fef316ef0660))

### [2.45.3](https://github.com/kiva/ui/compare/v2.45.2...v2.45.3) (2022-01-15)

### Bug Fixes

-   core-216 small lanugage change to tip message so saved isn't stated twice ([388f3f1](https://github.com/kiva/ui/commit/388f3f1741e2e11504efe315494858a17d573c09))

### [2.45.2](https://github.com/kiva/ui/compare/v2.45.1...v2.45.2) (2022-01-14)

### Bug Fixes

-   ensure button operates to submit without js ([0c0b2c6](https://github.com/kiva/ui/commit/0c0b2c6c6e0e0ac11e22f867f737764a14273c1f))
-   update test for new ui element ([0bc3641](https://github.com/kiva/ui/commit/0bc364109a141f2d3df152ecad475a49e365d1a6))

### [2.45.1](https://github.com/kiva/ui/compare/v2.45.0...v2.45.1) (2022-01-14)

### Bug Fixes

-   core-151 updating style of bookmark, decreased padding, increase rounded corners ([bb85aac](https://github.com/kiva/ui/commit/bb85aac16f46cd9251f37d7045de7af52ca9ad33))

## [2.45.0](https://github.com/kiva/ui/compare/v2.44.2...v2.45.0) (2022-01-13)

### Features

-   make auto-deposit sign up buttonText configurable ([c2e3ac7](https://github.com/kiva/ui/commit/c2e3ac765af498c8cac302d76eff694ead55205e))

### Bug Fixes

-   clear auto-deposit hero area for existing ad lenders ([dd0f66c](https://github.com/kiva/ui/commit/dd0f66cdb2f1b93eb87a671e46ca991762459a44))
-   ensure analtyics are fired when activating upsell, various clean up items ([cad31a2](https://github.com/kiva/ui/commit/cad31a26e33a1c3150099dcce6eb2c7feaf5362b))
-   ensure KvGrid is imported and available ([4e9f6e3](https://github.com/kiva/ui/commit/4e9f6e38dd31743ec4f12f7be1181dbd1af78e6f))
-   ensure we check for ad/mg before initializing experiment ([49624ed](https://github.com/kiva/ui/commit/49624eddaec831eac60f47705263b52b932a7cd6))
-   update spacing on ad upsell selection copy ([6369da2](https://github.com/kiva/ui/commit/6369da2ad9658a1d11c41c83d1a23cd5a5cb1f47))

### [2.44.2](https://github.com/kiva/ui/compare/v2.44.1...v2.44.2) (2022-01-13)

### Bug Fixes

-   core-148 adding data points to complete the data loop ([67d39b9](https://github.com/kiva/ui/commit/67d39b9dd25427eb10ee616d2af8c9216775d4c4))

### [2.44.1](https://github.com/kiva/ui/compare/v2.44.0...v2.44.1) (2022-01-13)

### Bug Fixes

-   buttons in dynamicHeroClassic should fire monthly good selector when webclickevent is defined ([c6e1293](https://github.com/kiva/ui/commit/c6e1293d59ad8862961783d744c02c7be9458546))

## [2.44.0](https://github.com/kiva/ui/compare/v2.43.1...v2.44.0) (2022-01-13)

### Features

-   setup auto deposit upsell experiment and interfaces from checkout to thanks ([644ee06](https://github.com/kiva/ui/commit/644ee06d16055544611cef15792d25ba8c861155))
-   update auto-deposit thanks page to kiva classic ([e20ae3c](https://github.com/kiva/ui/commit/e20ae3c8c79be5e67a16e4d75f4fa14f9bdc2f92))
-   update kiva credit checkout button to kiva classic ([64970a2](https://github.com/kiva/ui/commit/64970a2c2fe9cecbece0801a2bd4601a8ca3a320))

### Bug Fixes

-   ensure custom ad upsell amount is synced ([a193d21](https://github.com/kiva/ui/commit/a193d21fae745f99a997c2c42fd5b2996e636e40))
-   update images, fix validation and layout of custom options ([e3084e3](https://github.com/kiva/ui/commit/e3084e3de70e89ba2204dc954cc6653186cba17d))

### [2.43.1](https://github.com/kiva/ui/compare/v2.43.0...v2.43.1) (2022-01-13)

### Bug Fixes

-   refacator loanBookmark component to decrease redundancy ([6e401e9](https://github.com/kiva/ui/commit/6e401e92c8c48c994f5f681f43086e8dccfe75b1))

## [2.43.0](https://github.com/kiva/ui/compare/v2.42.1...v2.43.0) (2022-01-12)

### Features

-   core-216 updating icon in FavoriteStar.vue replaced with new bookmark icon ([7e6f5ed](https://github.com/kiva/ui/commit/7e6f5ed4e9b6c7bac388fa865f43e2fb2c076d0b))

### Bug Fixes

-   core-216 adding back tracking events ([33ae5e1](https://github.com/kiva/ui/commit/33ae5e17caccad29f85e4ed39efc7bffb0b58234))
-   core-216 reducing code redundancy ([c6a62d5](https://github.com/kiva/ui/commit/c6a62d5fb1de4a61ce96401e255762dca92b4a3a))
-   core-216 removing v-if, no longer needed ([0a02498](https://github.com/kiva/ui/commit/0a02498f7b208fa5214fcb400e7869336e61da8d))

### [2.42.1](https://github.com/kiva/ui/compare/v2.42.0...v2.42.1) (2022-01-12)

### Bug Fixes

-   core-148 adding a nullish coalescing operator ([d06ce59](https://github.com/kiva/ui/commit/d06ce599c29915fd5831c0f49c2e36928cb4f0c0))
-   core-148 adding more complex check in order to display repayment schedule ([2ad65bb](https://github.com/kiva/ui/commit/2ad65bbbd7c6f579925aa1dd91b3e96bdb53880c))
-   core-148 assigning isSupporter with optional chaining ([68bc3ea](https://github.com/kiva/ui/commit/68bc3ea6ebed2f29b46d856191c4a2f77f1a92bd))
-   core-148 fixing eslint error, removing else statement ([6f70d2c](https://github.com/kiva/ui/commit/6f70d2c400094ea184be89ce7280f2b378380246))

## [2.42.0](https://github.com/kiva/ui/compare/v2.41.1...v2.42.0) (2022-01-12)

### Features

-   add video options for dynamicHeroClassic ([2902c25](https://github.com/kiva/ui/commit/2902c25cd6991bc615684469078950582ef7aa0d))

### [2.41.1](https://github.com/kiva/ui/compare/v2.41.0...v2.41.1) (2022-01-12)

### Bug Fixes

-   core-151 increasing fontweight on the loanBookmark text ([ff7ba11](https://github.com/kiva/ui/commit/ff7ba11aff82c77c15b24fa1325595f69b0355a9))
-   core-151 setting width to full, so margin can have space ([871c619](https://github.com/kiva/ui/commit/871c6193afd00a1ed93810ac2f4d98804cd15b76))

## [2.41.0](https://github.com/kiva/ui/compare/v2.40.1...v2.41.0) (2022-01-12)

### Features

-   convert TheBasketBar to Kiva Classic ([22019f3](https://github.com/kiva/ui/commit/22019f37f9bceed15893a68e1e21fb29f3045b60))

### [2.40.1](https://github.com/kiva/ui/compare/v2.40.0...v2.40.1) (2022-01-12)

### Bug Fixes

-   make cc landing page status bar stick at the height of the new header ([f349f9f](https://github.com/kiva/ui/commit/f349f9f5c2dc43fde667c4660c2604cca53dee61))

## [2.40.0](https://github.com/kiva/ui/compare/v2.39.0...v2.40.0) (2022-01-12)

### Features

-   core-151 fixing bookmark placement for large screens ([1072dea](https://github.com/kiva/ui/commit/1072dea4937e6d0d263fa8f1652161897b571f16))
-   core-151 fixing lint error in repaymentSchedule.vue ([8791504](https://github.com/kiva/ui/commit/879150409cfb2f8654a1d94fb9614a1c4fd238a6))
-   core-151 flexing and icon into shape ([296b116](https://github.com/kiva/ui/commit/296b116e9c6d4989b823de859c2739788d08cbf1))

## [2.39.0](https://github.com/kiva/ui/compare/v2.38.0...v2.39.0) (2022-01-12)

### Features

-   allows StoryCards to be aligned with contentful field ([206d75d](https://github.com/kiva/ui/commit/206d75d764d786e0518af92fd7fc9c71ee412f13))

## [2.38.0](https://github.com/kiva/ui/compare/v2.37.0...v2.38.0) (2022-01-11)

### Features

-   causes homepage redirect experiment ([b70b963](https://github.com/kiva/ui/commit/b70b963816eab23965eea0f4c1080aaf60459f00))

## [2.37.0](https://github.com/kiva/ui/compare/v2.36.0...v2.37.0) (2022-01-11)

### Features

-   core-148 eslint line break fix ([33049a5](https://github.com/kiva/ui/commit/33049a5fdd00c88b026b2d6b977dd9f1a07acc49))
-   core-148 fix line too long lint error ([eb72b58](https://github.com/kiva/ui/commit/eb72b58ced839ff25fc8f5e7d6efed02f27946ac))
-   core-148 fixing syntax warning ([969ca9a](https://github.com/kiva/ui/commit/969ca9a81507455d893a861b1e20ccb4aea0c09d))
-   core-148 fixing up some style definitions and a semantic issue ([2fa729a](https://github.com/kiva/ui/commit/2fa729af39249613182ca1d235de8cb6cb5a3b0e))
-   core-148 mobile view of repayment schedule ([af461b6](https://github.com/kiva/ui/commit/af461b694d6888609a40b27ca1677088b2e66f0f))

## [2.36.0](https://github.com/kiva/ui/compare/v2.35.0...v2.36.0) (2022-01-11)

### Features

-   add My Kiva and my saved searches ([70249f3](https://github.com/kiva/ui/commit/70249f375f0a3d74da60867c8806b491ad2c978e))
-   misc styling touchups to header ([6ac658e](https://github.com/kiva/ui/commit/6ac658e9136fc295fb92e12373a00eb20f8c6d6f))

## [2.35.0](https://github.com/kiva/ui/compare/v2.34.4...v2.35.0) (2022-01-11)

### Features

-   core-151 cleanup lint error ([ab13f62](https://github.com/kiva/ui/commit/ab13f62f70d4b4bf945521d7f44924d57ea583f4))
-   core-151 cleanup lint error ([753a8ba](https://github.com/kiva/ui/commit/753a8ba504d7752867a6aa30be74169f60416853))
-   core-151 cleanup lint error ([d2d58ce](https://github.com/kiva/ui/commit/d2d58cec5f0dc381735dd2016349cc9b3acf8592))
-   core-151 cleanup lint error ([b492cb1](https://github.com/kiva/ui/commit/b492cb191adbea42fe24898b1f16c1c1da5fc9ee))
-   core-151 cleanup lint error ([b71e27b](https://github.com/kiva/ui/commit/b71e27b16d1e577c56248c5c6446af424a585005))
-   core-151 fixing apollo error caused by not having load id during prefetch ([0f916a4](https://github.com/kiva/ui/commit/0f916a46dfc2b66cde2117ffd9b6cb581f5937d8))
-   core-151 loanBookmarking in place across all screen sizes with a new BookmarkUtil ([9759fbb](https://github.com/kiva/ui/commit/9759fbb9649d6657af290140527cc49f8567acb4))
-   core-151 replacing span with button since it is clickable ([5c99835](https://github.com/kiva/ui/commit/5c99835115ac076e9aedfa30e2bfa390a3b91d11))

### Bug Fixes

-   update filename ([9c49953](https://github.com/kiva/ui/commit/9c4995365c41bc2f2a47c6e8d0bcb88c5661502f))

### [2.34.4](https://github.com/kiva/ui/compare/v2.34.3...v2.34.4) (2022-01-06)

### Bug Fixes

-   fixes extra spacing created by images in RTF's from contentful ([81e58bb](https://github.com/kiva/ui/commit/81e58bb9a8c7ac57def3df2906c65c5d499ff4fa))

### [2.34.3](https://github.com/kiva/ui/compare/v2.34.2...v2.34.3) (2022-01-06)

### Bug Fixes

-   prevent kv-material-icons from being huge on Safari ([78a63b5](https://github.com/kiva/ui/commit/78a63b5c41198662b6e11ca80ede9905f44babc4))

### [2.34.2](https://github.com/kiva/ui/compare/v2.34.1...v2.34.2) (2022-01-05)

### Bug Fixes

-   remove wrapperClass from contentfulPage ([2e507cb](https://github.com/kiva/ui/commit/2e507cb5b16ad611cfc6fab2cc5688d73b734b4e))

### [2.34.1](https://github.com/kiva/ui/compare/v2.34.0...v2.34.1) (2022-01-05)

### Bug Fixes

-   kivaClassic styling tweaks for Causes cancellation and BT drop i… ([#3521](https://github.com/kiva/ui/issues/3521)) ([66a63df](https://github.com/kiva/ui/commit/66a63df6ec5752b038858224286bcf29ae2fd23d))

## [2.34.0](https://github.com/kiva/ui/compare/v2.33.1...v2.34.0) (2022-01-05)

### Features

-   core-357 added loanDisbursed check for directLoans in place, altered how loan details load ([7bb8eae](https://github.com/kiva/ui/commit/7bb8eae3d646c2cd5d3c27633bce8446b3d0b543))
-   core-357 adding anonmizationLevel check for repayment schedule, removing isPartnerLoan checks ([959b547](https://github.com/kiva/ui/commit/959b547c1031d3b41cd8482b0e92280c52ee55e1))
-   core-357 changing anonymizationLevel check to full from none ([d50cff8](https://github.com/kiva/ui/commit/d50cff8490fc0bcea57fdfb667e621c31e0964c2))
-   core-357 cleanup, removed createIntersectionObserver ([72d687c](https://github.com/kiva/ui/commit/72d687c3d1cc48495d1401a329e0c494c1ddf33d))
-   core-357 removing check that loan is not fundraising ([43829ff](https://github.com/kiva/ui/commit/43829ffc75e519c079ebdad9dfb18b011db1056d))

### [2.33.1](https://github.com/kiva/ui/compare/v2.33.0...v2.33.1) (2022-01-05)

### Bug Fixes

-   richTextRenderer should handle undefined content more gracefully ([5972520](https://github.com/kiva/ui/commit/5972520e15dbe494d4e46f21d04fe0c265355156))

## [2.33.0](https://github.com/kiva/ui/compare/v2.32.0...v2.33.0) (2022-01-05)

### Features

-   add FB tracking event for Causes signup ([6bb4b69](https://github.com/kiva/ui/commit/6bb4b69f55a5e1917e28eebe0273392795cb54b3))

## [2.32.0](https://github.com/kiva/ui/compare/v2.31.0...v2.32.0) (2022-01-05)

### Features

-   add background color to cart amount and profile balance ([7c2f93c](https://github.com/kiva/ui/commit/7c2f93ceadfdeedd8b1a703edda2b6e9401d24fd))
-   add border around search results to prevent them from being lost on white backgrounds ([2261178](https://github.com/kiva/ui/commit/22611784905bbe2382d95d319da4e283f736290d))
-   adds find a cause to desktop megamenu ([d60f8d8](https://github.com/kiva/ui/commit/d60f8d8eb46a2a7006c6f05725b65fec8a452f38))
-   bring back hideSearchInHeader ([5eadf68](https://github.com/kiva/ui/commit/5eadf68fce8a59c963601a4f209a15d8b126021e))
-   close the menu if tapping outside of it ([8eb32c4](https://github.com/kiva/ui/commit/8eb32c450b62a654fd5e7cfc94fe40617a01ce64))
-   enlarge logo and tweak vertical alignment ([6b40371](https://github.com/kiva/ui/commit/6b4037114affc8686ff84349fd5e841808bbd771))
-   fill out corporate header ([5f1af80](https://github.com/kiva/ui/commit/5f1af80b88b8707f427067f8a2cb238275736bdc))
-   mouse and touch events for showing the meganav ([81c3f4f](https://github.com/kiva/ui/commit/81c3f4f7546f0448f1e34791eb7a4dc2d2d946b8))
-   progress point for the header mega menu ([b790cb2](https://github.com/kiva/ui/commit/b790cb281d267495da23aa260e0b39e78aa6fac0))
-   remove header themes from WwwPageCorporate ([228d952](https://github.com/kiva/ui/commit/228d952738a19bf5780682c817ecbc6f015a9754))
-   starting point for new header layout ([b6de3e9](https://github.com/kiva/ui/commit/b6de3e97cf99023902228cafc0e515e4e7bbcffc))
-   stop centering the search bar on large screens, continue tablet layout instead ([3e8b001](https://github.com/kiva/ui/commit/3e8b001f0cb9390a35ee3a98e0916aa5bde83a68))
-   update mark styling to match new design ([9a9deca](https://github.com/kiva/ui/commit/9a9decae730b258bda7ee30bf4b814cc26238e2e))
-   use kv-loading-placeholder instead of kv-loading-spinner ([02a6396](https://github.com/kiva/ui/commit/02a6396736b25d3bf0e7179c8676c387ae1fa2c9))
-   use new profile icon if the users image is a default ([86eb248](https://github.com/kiva/ui/commit/86eb248f8d72c908684d272e6c247b9f9f04e355))

### Bug Fixes

-   allow keyboard enter key presses to navigate to lend page ([591bdd2](https://github.com/kiva/ui/commit/591bdd2a66f5937fa24ce2ad0beb1463bd417e08))
-   ensure we have shop property ([7bea6ff](https://github.com/kiva/ui/commit/7bea6ffdf285c72dc7371fafbbf6d8ba972b22a4))
-   hide basket on mobile since it's at the bottom of the viewport ([e5e04cc](https://github.com/kiva/ui/commit/e5e04cc5138ad76b43419f0fdcce6d7fee5c11e3))
-   load categories and regions on menu load ([94077ba](https://github.com/kiva/ui/commit/94077ba8801c26974bd14e93c75140133e9c7904))
-   misc style touchups ([3b79359](https://github.com/kiva/ui/commit/3b79359fc2b37aaaaf39db528ae5af558fb8d24f))
-   move search container into a more logical tab order ([e05df2b](https://github.com/kiva/ui/commit/e05df2b53c42f2b3942387076ce2736d7f8205d8))
-   prevent hidden submit button from keyboard focus ([2ffa9a6](https://github.com/kiva/ui/commit/2ffa9a6b7f7e5fcfba7b8da49282fe752f4c00b3))
-   prevent logo link from taking up too much area on mobile ([9f845fb](https://github.com/kiva/ui/commit/9f845fb062b79a9d14718e9562c77f55939fdba0))
-   prevent mouseover events from happening on touchend ([1db823c](https://github.com/kiva/ui/commit/1db823cac1f2267674b69d16e210238bf1b5538d))
-   prevent search from overlapping buttons at certain screen sizes ([23669ec](https://github.com/kiva/ui/commit/23669ec61410a6c79a7132480bccd8c768a106f8))
-   rotate chevron when menu is open ([eaa287b](https://github.com/kiva/ui/commit/eaa287bc0b330d6a3b61b983fdb41db2dfaccaa5))
-   rotate the icon on hover for about link ([c7519ba](https://github.com/kiva/ui/commit/c7519ba5b130ba426aa6dc9437e19270b7243f42))
-   update lock-scroll utils to use Tailwind classes ([b094c7b](https://github.com/kiva/ui/commit/b094c7b82d51b02ff66a181d917c5b7313114c38))

## [2.31.0](https://github.com/kiva/ui/compare/v2.30.2...v2.31.0) (2022-01-04)

### Features

-   promocreditbanner component was created with its story ([74827cf](https://github.com/kiva/ui/commit/74827cf99798f958dd1680b1b8a6bc6687646b1b))

### [2.30.2](https://github.com/kiva/ui/compare/v2.30.1...v2.30.2) (2022-01-04)

### Bug Fixes

-   add id to ml service queries for OrderedLoanChannel changes ([c293e82](https://github.com/kiva/ui/commit/c293e821a28eb813079ed1f46c5291453199091b))

### [2.30.1](https://github.com/kiva/ui/compare/v2.30.0...v2.30.1) (2022-01-04)

### Bug Fixes

-   update references to log function ([7579359](https://github.com/kiva/ui/commit/75793590c30463c0d396e71548193106141b8572))

## [2.30.0](https://github.com/kiva/ui/compare/v2.29.0...v2.30.0) (2022-01-04)

### Features

-   core-248 Tracking for repayment schedule ([a9d9e82](https://github.com/kiva/ui/commit/a9d9e82bef1e21fde159759a868ad3a5cfa7e898))

## [2.29.0](https://github.com/kiva/ui/compare/v2.28.0...v2.29.0) (2022-01-03)

### Features

-   add data attribute for QA ([c2860c0](https://github.com/kiva/ui/commit/c2860c0096070c9d7bd88d4b4dc59ab0155f74e2))
-   add kiva classic style to causes settings components ([bc9cdfa](https://github.com/kiva/ui/commit/bc9cdfab1517a828f82eddfae2f69d1a97d7d94d))
-   Add quick & dirty theme switcher for verifying theming ([564daa3](https://github.com/kiva/ui/commit/564daa3a950943353285b391301be7d1d489d1c6))
-   Add re-usable component for containing text width and setting top bottom padding ([d8c6de9](https://github.com/kiva/ui/commit/d8c6de9f2ebf4429fd24a6392f1724b10e35ceca))
-   added cause query param to auth server ([7095a2c](https://github.com/kiva/ui/commit/7095a2cf0615d0a349fe1afacacbc118d41b00ba))
-   appealbannercircular and kvprogresscircle components were updated to use tw classes ([8b09ed1](https://github.com/kiva/ui/commit/8b09ed13af9efd181d3fcea8fdee8025ebe4ce5d))
-   appealbannercircular and kvprogresscircle components were updated to use tw classes ([cbf228e](https://github.com/kiva/ui/commit/cbf228e2ec816a7e2c2174697d508523e1d0881b))
-   appealbannercircular was refactored to have responsive layout with tw ([7d88377](https://github.com/kiva/ui/commit/7d88377d91492900328bbfdb6d0c455a16007e85))
-   causes update payment method kiva classic styling ([ea1aa73](https://github.com/kiva/ui/commit/ea1aa7341a5e4a7b64afdc710c631bf8d95d1b57))
-   classes added to kvaccordionitem component ([ccfd004](https://github.com/kiva/ui/commit/ccfd004327b161aeb3bbd85576d37f81a07b4b95))
-   Convert /borrow subpages to Kiva Classic typography ([efb2e3c](https://github.com/kiva/ui/commit/efb2e3caef0fbaad399e06e4e2be0cc62108dfe1))
-   convert /build section to kiva classic typography ([bb376b5](https://github.com/kiva/ui/commit/bb376b5521bc01e754dc738d283f8d914e078640))
-   Convert /join-team to Kiva Classic Typography / Tailwind ([bd1bd85](https://github.com/kiva/ui/commit/bd1bd8555f5dc7f6a68dbd0ceb25d78438c793da))
-   convert /lend/filter to kiva classic typography + colors ([22001d5](https://github.com/kiva/ui/commit/22001d55e9ebf97ce2ba5b72381b53fc1fb86bb4))
-   Convert /settings to Kiva Classic / Tailwind ([74efbbe](https://github.com/kiva/ui/commit/74efbbeafdff196b2a85acc40cbc5d1619e6c014))
-   Convert campaign loan filters typography ([181a96e](https://github.com/kiva/ui/commit/181a96ef4a46f813db1d14111bad6737c7c5efd7))
-   Convert campaign status bar to KivaClassic / Tailwind ([b30d3c3](https://github.com/kiva/ui/commit/b30d3c36ee021094421148cd26d400e65581e078))
-   Convert CampaignHero to KivaClassic/Tailwind ([e8ba7ea](https://github.com/kiva/ui/commit/e8ba7ea1c259abdd173f20e84bc390398e6f38d4))
-   Convert error page to Kiva Classic typography/Tailwind ([af72e71](https://github.com/kiva/ui/commit/af72e71d7c87ba050ca061e21b2ccb68a4750faf))
-   Convert partner section to classic/tailwind ([da50cdd](https://github.com/kiva/ui/commit/da50cdd009502f2441ef19a9e0e203cb4bcab799))
-   Create a default page wrapper with top and bottom padding set ([a612119](https://github.com/kiva/ui/commit/a61211940c326a5d9ee938b6e6f9ad8b408c21ec))
-   datatestid attribute was added to some elements ([15ebf59](https://github.com/kiva/ui/commit/15ebf5961ef0995fa9722e2903a6b8ddad629966))
-   disclaimers footer component was upgraded to have the correct behaviour ([2428a50](https://github.com/kiva/ui/commit/2428a502655a2be648d8933632af34a38e0eca00))
-   donate components were updated to have tw classes in typography ([aa586d8](https://github.com/kiva/ui/commit/aa586d846db55db0a337a66274834ef8bd92a2e3))
-   footer classes were updated to avoid min heights ([6ce9bc9](https://github.com/kiva/ui/commit/6ce9bc9d0eee8d4f9628ebca34836f4e35248c4f))
-   fundedborrowerprofile component was updated in order to have tw clasess for typography tags ([da84afc](https://github.com/kiva/ui/commit/da84afc48e4831054dc4827b4487140956c3bc1d))
-   genericpromobanner was updated to use tw classes ([0ebc34e](https://github.com/kiva/ui/commit/0ebc34eea5973d7cc4e782f1fb1313c3ac1d3fe7))
-   hover and focus options added to kvaccordionitem button ([c1fbd00](https://github.com/kiva/ui/commit/c1fbd0085a168bda41ea77317c43b08f6cbfdf05))
-   Kiva classic for TertiaryMenu ([21546d5](https://github.com/kiva/ui/commit/21546d5a0c1f014756885f7146a4aca1b890c366))
-   Kiva Classic typography + colors for lend-by-category/:route ([c24ea02](https://github.com/kiva/ui/commit/c24ea02436c87621c308f503712d18b869939e35))
-   Kiva classic typography + Tailwind for /lend-vue ([225124d](https://github.com/kiva/ui/commit/225124db7343af904cde9ef96a46f2ee65f11a12))
-   Kiva Classic typography + tailwind for /monthlygood/thanks ([ba93102](https://github.com/kiva/ui/commit/ba93102267b1337bf10a8ef3fa1be9059f063259))
-   Kiva classic typography + tailwind for /start-verification ([3645f87](https://github.com/kiva/ui/commit/3645f8795173a4b227dc9cd1c8ed19f3c75b27fc))
-   Kiva Classic typography + Tailwind for settings/autolending ([0e07365](https://github.com/kiva/ui/commit/0e07365b328967e91b01c1846fd4d7fcbf075cdc))
-   Kiva Classic typography + themable colors on /getting-started pages ([b034f0a](https://github.com/kiva/ui/commit/b034f0a468fc98eaf2c119a65d67231815a238dc))
-   kiva classic typography and colors for /checkout/thanks ([cc2c55b](https://github.com/kiva/ui/commit/cc2c55b0d4996ce5a67107389b36c3f36c1af2c8))
-   Kiva Classic typography and form components for Monthly Good setup page ([ebfb923](https://github.com/kiva/ui/commit/ebfb9231c2a36de3a0c2a555b972a81cd0580a0d))
-   Kiva Classic typography and form element updates for /checkout ([8e969cb](https://github.com/kiva/ui/commit/8e969cb71941321e386705f5c13b2926a3c7c974))
-   Kiva classic typography for /monthlygood ([a48ad1c](https://github.com/kiva/ui/commit/a48ad1ca813b6b774dce07a505880238ec95fe05))
-   Kiva Classic typography for /settings/email ([118e3be](https://github.com/kiva/ui/commit/118e3be375e3f707df3d6c50d80e2d980fab8a3e))
-   Kiva classic typography for /settings/payment ([826d165](https://github.com/kiva/ui/commit/826d1657fd2f0c36c447634a4ea40ff31a967262))
-   Kiva classic typography for /settings/security ([40036e5](https://github.com/kiva/ui/commit/40036e53f5be101f3dd7e3187d6514566497bb36))
-   kiva classic typography for lending-stats page ([ae75b76](https://github.com/kiva/ui/commit/ae75b763ad7c212f3610ad3178d921618ba2673f))
-   kvaccordionitem component was updated to have tw classes and custom styles were removed ([c091e79](https://github.com/kiva/ui/commit/c091e79d58cfe12fea5764e38d4af930f3b100ca))
-   kvaccordionitem updated to dont have custom values in tailwind classes ([3560c77](https://github.com/kiva/ui/commit/3560c7759544038f6e7a8bde7b8643f13275349a))
-   kvicon component was updated to use tw classes ([7704ead](https://github.com/kiva/ui/commit/7704eade460a658ebb8939e474f6369f409116f1))
-   line break default headline on all breakpoints ([a749dc8](https://github.com/kiva/ui/commit/a749dc8f4950d5735f1e67b927614fe46a678fad))
-   mgcovid19 components were updated in order to have tw clasess for typography ([09be2b4](https://github.com/kiva/ui/commit/09be2b4d2ca99a5ae115579418b8ed794f5c04c7))
-   minor type updates ([fa94804](https://github.com/kiva/ui/commit/fa9480403f6bdafd66ad8f9a87c99fe1012b9ce0))
-   remove dark mode theme switcher ([35483f9](https://github.com/kiva/ui/commit/35483f9e2f24d8fefdb6aa3c05a18500654984b0))
-   remove foundation typography and base resets ([9dcab57](https://github.com/kiva/ui/commit/9dcab573ce61054a4457f6c7dcdd9a07218e06b2))
-   remove kv-tailwind classes ([1514c19](https://github.com/kiva/ui/commit/1514c190797c4423b125a3d53426966c135a46eb))
-   remove remaining kv-tailwind kludges ([3d8ec28](https://github.com/kiva/ui/commit/3d8ec2811dd779309a5872fa1ea97f042e74a0bd))
-   remove unused code ([2f35e0a](https://github.com/kiva/ui/commit/2f35e0a76e0768d1188750df31e2658f176b01c9))
-   thefooter component was updated in order to include tw clasess and custom styles were removed ([a185679](https://github.com/kiva/ui/commit/a18567968dfa305aae8b27813ba6c18b189701fd))
-   thefooter component was updated to avoid using non required div wrappers ([3437bb7](https://github.com/kiva/ui/commit/3437bb7a249c5957d85e24fc352bb8c9522e5c4c))
-   thefooter component was updated to avoid using non required div wrappers ([5171cdc](https://github.com/kiva/ui/commit/5171cdc6cdfedb12d15372d0b2022c9a114c5c1e))
-   thefooter component was updated to have a global kvpagecontainer component ([92cb6b4](https://github.com/kiva/ui/commit/92cb6b4725f5d626d163c1f84e19b533e2585b72))
-   typography and color updates for /register pages ([c720e25](https://github.com/kiva/ui/commit/c720e25a5126aa06ec0d7daefdc6c2b560fe22ee))
-   typography and colors for /protocol ([3959158](https://github.com/kiva/ui/commit/395915891043ea8982728346f8623d6c07d5c538))
-   typography and layout tweaks for /donate/supportus ([b9e2c33](https://github.com/kiva/ui/commit/b9e2c33012bc1aabc012bddc9bd46afb14eea208))
-   typography and new components for auto-deposit settings ([b493cf1](https://github.com/kiva/ui/commit/b493cf14aee9c7f845049bdc6754b6e0caf7e16f))
-   typography and new components for monthly-good settings ([a3d09dc](https://github.com/kiva/ui/commit/a3d09dc02233583ef5f2055b562e0253f8a9520d))
-   typography, colors, form components for /auto-deposit and /auto-deposit/thanks ([0060793](https://github.com/kiva/ui/commit/00607934ee7428b98c93eb41f873b5bfb5e4612f))
-   update /legal and subpages to Kiva Classic typography ([0577036](https://github.com/kiva/ui/commit/0577036098caed1569d66160f1531296c4a48136))
-   update /settings/security/mfa to kiva classic ([080da0e](https://github.com/kiva/ui/commit/080da0e84d21cbb83bab20110895763ffc9f5caa))
-   update /start with Kiva Classic typography and colors ([de1ae41](https://github.com/kiva/ui/commit/de1ae418be0aa94deeeeeb8b109fca1f03a85d1c))
-   update carousel type ([7332c82](https://github.com/kiva/ui/commit/7332c8204419a4c58ce1779e03415fd86beb7f99))
-   update how kiva works type ([577399d](https://github.com/kiva/ui/commit/577399d68e3e184df85232595b307a4ab02603ed))
-   update special loan text ([a4285e8](https://github.com/kiva/ui/commit/a4285e88a053a53ade8515c726c5db02d27de6a9))
-   update typography + colors for lend-by-category ([ce2edd2](https://github.com/kiva/ui/commit/ce2edd260bf9b5eb27a22327f9335eb683727756))
-   update ui-sitemap with classic typography / tailwind ([1799652](https://github.com/kiva/ui/commit/17996523ea50f9bfeca8fb51180c157525a1c01c))
-   use default-page-wrapper on all /build pages ([c73a5b5](https://github.com/kiva/ui/commit/c73a5b51a9dee86ca55c90ca71de75edfa15528d))
-   use Kiva Classic button for Monthly Good signup ([8a11bad](https://github.com/kiva/ui/commit/8a11bad831417456d6b3f84d916bc7b9349e34a5))
-   use Kv form elements in KvBaseInput ([627c89b](https://github.com/kiva/ui/commit/627c89b3edf84dd8390e072ae0aa6467bb5aee84))
-   use KvDefaultPageWrapper ([e7ddf6b](https://github.com/kiva/ui/commit/e7ddf6b835309dad73b7bc21defd7374c2d9f7fb))
-   use new KvTextInput inside KvCurrencyInput ([547f201](https://github.com/kiva/ui/commit/547f2017cfb72be495f5b0a6949cc1285c552f64))

### Bug Fixes

-   allow foundation grid classes to be applied to KvSettingsCard ([868ae13](https://github.com/kiva/ui/commit/868ae13b2d64d451ecb99fb3aee6d9095995ff95))
-   Autolending buttons should be left aligned ([c4749d5](https://github.com/kiva/ui/commit/c4749d56486a1eda783f6cd16b70737129c726d3))
-   Core-239 adding test for 40 days case ([73943f2](https://github.com/kiva/ui/commit/73943f204749ff56cfa96bd57d13453e29314dbc))
-   Core-239 cleaning up debug code ([87a826b](https://github.com/kiva/ui/commit/87a826b5b78843ba39392965d7b19e61371b9e6f))
-   Core-239 simplifying ([2da09fb](https://github.com/kiva/ui/commit/2da09fb42edbe5c8aecced7b64091212e2662b63))
-   Core-239 updating time remaining display on borrower page ([f569cda](https://github.com/kiva/ui/commit/f569cda64b3128c70cfbec80171f68a76635daf2))
-   correct typography and link color ([09e9419](https://github.com/kiva/ui/commit/09e94195ab38203873df0e768e9090ea66f1b6aa))
-   Ensure #app fills the full screen width ([2687613](https://github.com/kiva/ui/commit/2687613fbf1be281f30427c7849c4a795eef09a1))
-   fix font weight ([4ae809a](https://github.com/kiva/ui/commit/4ae809a8462b9006761b6af189730a65cf98d23f))
-   Make non-kiva classic KvSelect work for now. ([da83243](https://github.com/kiva/ui/commit/da832437b7283e6964718f097f3ea3798981051f))
-   Make pencil icon take the color of it's parent ([26ca88d](https://github.com/kiva/ui/commit/26ca88da517ccd9cb99860b521df9db9b4af1336))
-   make sure footer is on the bottom of the page even if main content is short ([13b5279](https://github.com/kiva/ui/commit/13b527915bd9e1f274ae368719b289dbf2861d32))
-   **Monthly Good Setup Page:** touch up form layout ([3447c8f](https://github.com/kiva/ui/commit/3447c8f2584df5b374e58fcf909531b566b84e72))
-   resolve color and margin issues in primary nav ([1c8b91d](https://github.com/kiva/ui/commit/1c8b91d3831192033592f147cc70fc417ebea49a))
-   set background color to a lighter gray ([85d19e5](https://github.com/kiva/ui/commit/85d19e5a735daffc087266eba46393e633861707))
-   set background opacity to previous opacity value ([232844c](https://github.com/kiva/ui/commit/232844ca6d1e99d5b91b5da2110072499b9ae354))
-   turn off erroneous stylelint error ([97d6792](https://github.com/kiva/ui/commit/97d6792d39a159c8b3792c851be57cce32436818))
-   typo on [@click](https://github.com/click) ([730645d](https://github.com/kiva/ui/commit/730645dc9b6aba45b940c0a1bdbde491da15181c))
-   use router-link instead of anchor tag ([dfc5301](https://github.com/kiva/ui/commit/dfc5301219a805d383b6a256cac92d814c3cdc60))

## [2.28.0](https://github.com/kiva/ui/compare/v2.27.1...v2.28.0) (2022-01-03)

### Features

-   **auth:** set dev graphql query params when fake authentication cookie is present ([b78ff37](https://github.com/kiva/ui/commit/b78ff376b4ed4d814ed0a46be54a2e9bfff58352))
-   avoid fake auth attempts if it is not allowed in the environment VUE-721 ([7ec131d](https://github.com/kiva/ui/commit/7ec131d8390d873ab09096774ecdd57a85e4d4d4))

### Bug Fixes

-   **live-loan:** use new logging functions ([973f0dd](https://github.com/kiva/ui/commit/973f0dd21a1d2137e126b004a8923297263df1de))

### [2.27.1](https://github.com/kiva/ui/compare/v2.27.0...v2.27.1) (2022-01-03)

### Bug Fixes

-   add storycard spacing between storycard content and cta ([a0e8eda](https://github.com/kiva/ui/commit/a0e8edab6956daecd28f3323757305952f63f88b))

## [2.27.0](https://github.com/kiva/ui/compare/v2.26.1...v2.27.0) (2021-12-21)

### Features

-   update causes subscription payment method ([47ecc88](https://github.com/kiva/ui/commit/47ecc8893ba07b090a96beb51622ab8e94c76a9b))

### [2.26.1](https://github.com/kiva/ui/compare/v2.26.0...v2.26.1) (2021-12-21)

### Bug Fixes

-   causes subscription day of month edit not working ([66ef645](https://github.com/kiva/ui/commit/66ef6457583663e02ecbe82ecc2d297aed97eaf5))

## [2.26.0](https://github.com/kiva/ui/compare/v2.25.1...v2.26.0) (2021-12-20)

### Features

-   core-148 cleaning up lint error ([6f35e9f](https://github.com/kiva/ui/commit/6f35e9f4c3f9d015fc4b9d4f4c88e31ae93adf8a))
-   core-148 code and comment cleanup ([7b7ba31](https://github.com/kiva/ui/commit/7b7ba313421ba6128585e8ee4b5538cf826368ed))
-   core-148 fixing lint failure ([a064ecb](https://github.com/kiva/ui/commit/a064ecb3ed93a93d7b78e04881ebb0f91c9bc8d0))
-   core-148 parsing monthly repayments for payments received and payments delinquent ([d8fd536](https://github.com/kiva/ui/commit/d8fd536ee177aeb14abd76c61d9b27d38747dc3b))
-   core-148 testing cleanup ([506f2bd](https://github.com/kiva/ui/commit/506f2bd9935684dacbe982a4f5ed8f62382458fe))

### [2.25.1](https://github.com/kiva/ui/compare/v2.25.0...v2.25.1) (2021-12-16)

### Bug Fixes

-   ensure legacy kvCarousel keeps button state up to date ([615f63c](https://github.com/kiva/ui/commit/615f63cf7c027934a2a83d08a91560ee9d8626f6))

## [2.25.0](https://github.com/kiva/ui/compare/v2.24.1...v2.25.0) (2021-12-16)

### Features

-   allow a user to modify their causes subscription ([44565f7](https://github.com/kiva/ui/commit/44565f79d03c7dd817d875d7f790f24668bea395))

### [2.24.1](https://github.com/kiva/ui/compare/v2.24.0...v2.24.1) (2021-12-15)

### Bug Fixes

-   guard lendingRewardOffered and receipt.values before usage ([6d57635](https://github.com/kiva/ui/commit/6d57635a596be1be1604dd7c49799f2819f9a1c2))

## [2.24.0](https://github.com/kiva/ui/compare/v2.23.0...v2.24.0) (2021-12-14)

### Features

-   map causes category id in signup form using contentful entry key ([c49aabc](https://github.com/kiva/ui/commit/c49aabca96effc7aa38724cddf4809515f351192))

## [2.23.0](https://github.com/kiva/ui/compare/v2.22.0...v2.23.0) (2021-12-14)

### Features

-   core-148 adding table heading for screen readers ([c5ada10](https://github.com/kiva/ui/commit/c5ada109cd637d819fe43cf56bcb6c8588249cdb))
-   core-148 cleaning up fundraising repayment schedule ([f18ad98](https://github.com/kiva/ui/commit/f18ad982abe7fed9e12c9bd098a78ae8dc4beb53))
-   core-148 cleaning up the code, adding comments ([32f9826](https://github.com/kiva/ui/commit/32f9826d7b1d42ca350335502f724704f4947270))
-   core-148 directLoan fundraising repayment schedule built out ([2549ff9](https://github.com/kiva/ui/commit/2549ff90ebcd47b6c77839659b071a011dbab75f))
-   core-148 parsed expected repayment data for loans with multiple payments in the same month ([7621584](https://github.com/kiva/ui/commit/76215848cacc672f142cff510744b2212bfa806b))
-   core-148 placing tw-prose selectively, cleaning up comments ([b8a8bc8](https://github.com/kiva/ui/commit/b8a8bc8ded27434a720a185d14e15db84cddacde))
-   core-148 removing scss and replacing it with postcss and tailwinds classes ([3dd921a](https://github.com/kiva/ui/commit/3dd921acc159bb281094377a90236e7853a4ce89))
-   core-148 repayment schedule trigger and component in place and needed data queried ([1a8a07c](https://github.com/kiva/ui/commit/1a8a07c23437967c09b1d9ffe6fa5623fdf56f18))
-   core-148 scoping the postcss ([b530af3](https://github.com/kiva/ui/commit/b530af366ee085741f573074a5c03ec472ddf8d1))
-   fundraising repayment schedule ([bcea4e7](https://github.com/kiva/ui/commit/bcea4e75420eadfb4beb14794a1f591deed528a7))
-   repayment schedule data parse started ([d7816b4](https://github.com/kiva/ui/commit/d7816b46b3756114d21d0d0eab66f6e6b607c95b))

## [2.22.0](https://github.com/kiva/ui/compare/v2.21.1...v2.22.0) (2021-12-14)

### Features

-   allow a causes subscription user to cancel their subscription ([3aa9592](https://github.com/kiva/ui/commit/3aa959271c2f5567344e86ceeb56b8f0f182b672))

### [2.21.1](https://github.com/kiva/ui/compare/v2.21.0...v2.21.1) (2021-12-14)

### Bug Fixes

-   ensure matching shows when applicable, clean up initial visibility logic ([a3e034b](https://github.com/kiva/ui/commit/a3e034ba87af0d81160a804b569c86811a2c3091))

## [2.21.0](https://github.com/kiva/ui/compare/v2.20.2...v2.21.0) (2021-12-10)

### Features

-   **Matching:** hide match message when remaining loan amount is less than match amount ([02155eb](https://github.com/kiva/ui/commit/02155ebe38473bb8da5cfaf01d5e67b5f9fae745))

### Bug Fixes

-   remove testing background style ([2fa3f08](https://github.com/kiva/ui/commit/2fa3f08e82ce2994669702f562cb8adc9b367d01))

### [2.20.2](https://github.com/kiva/ui/compare/v2.20.1...v2.20.2) (2021-12-08)

### Bug Fixes

-   **Header:** provide a fallback lightHeader theme, ensures promoBanner styles when page has no theme ([d653823](https://github.com/kiva/ui/commit/d653823461f6815546b2f81db740a79faab41e2c))

### [2.20.1](https://github.com/kiva/ui/compare/v2.20.0...v2.20.1) (2021-12-08)

### Bug Fixes

-   **lending reward:** update typo, refresh lendingRewardOffered on basket update, fix cursor style: ([cbae537](https://github.com/kiva/ui/commit/cbae537c94fb6116edb2fc266ffaf055a01404bb))

## [2.20.0](https://github.com/kiva/ui/compare/v2.19.2...v2.20.0) (2021-12-08)

### Features

-   show donation row when lendingRewardOffered ([e6f1426](https://github.com/kiva/ui/commit/e6f142657b4d93738e60b9e6da7ef5fe6d1c5b73))

### [2.19.2](https://github.com/kiva/ui/compare/v2.19.1...v2.19.2) (2021-12-07)

### Bug Fixes

-   **Managed Lending:** ensure themes are available as filters and match by name instead of id ([a6d489f](https://github.com/kiva/ui/commit/a6d489f2191796b69820d42e5583a04e6724b69c))

### [2.19.1](https://github.com/kiva/ui/compare/v2.19.0...v2.19.1) (2021-12-06)

### Bug Fixes

-   **Landing Pages:** ensure tip message shows above in context checkout for managed lending ([c51fc5d](https://github.com/kiva/ui/commit/c51fc5d928814c2adefcde5fa02fc316563ad65a))

## [2.19.0](https://github.com/kiva/ui/compare/v2.18.10...v2.19.0) (2021-12-06)

### Features

-   **Borrower Profile:** add click tracking on details tabs, definitions and links ([9d4a41d](https://github.com/kiva/ui/commit/9d4a41d94b7376306dc5420c00da8ee290b4627a))

### [2.18.10](https://github.com/kiva/ui/compare/v2.18.9...v2.18.10) (2021-12-06)

### Bug Fixes

-   core-322 increase font-weight and spacing of jump links on borrower profile ([2a9f71e](https://github.com/kiva/ui/commit/2a9f71e6a922f7deab29aac6f4ff19ff180ceaac))

### [2.18.9](https://github.com/kiva/ui/compare/v2.18.8...v2.18.9) (2021-12-06)

### Bug Fixes

-   updated TOU, updated last changed date and highlighted new substantive changes ([a6435df](https://github.com/kiva/ui/commit/a6435dfde1dc1c79379a093b93f46bef61681d90))

### [2.18.8](https://github.com/kiva/ui/compare/v2.18.7...v2.18.8) (2021-12-03)

### Bug Fixes

-   catch redirection errors from router.push ([5efd0e5](https://github.com/kiva/ui/commit/5efd0e54904505c495701d935a49675d490bfbc9))

### [2.18.7](https://github.com/kiva/ui/compare/v2.18.6...v2.18.7) (2021-12-03)

### Bug Fixes

-   core-316 simple formatting on numBorrowers & numDefaultedLoans ([7469c78](https://github.com/kiva/ui/commit/7469c78780c2ab4005bff9195851afa4a6708c7a))
-   in-component navigation guards should not redirect ([4346689](https://github.com/kiva/ui/commit/43466890450a8dde3016b5958d2b00d317d2992d))

### [2.18.6](https://github.com/kiva/ui/compare/v2.18.5...v2.18.6) (2021-12-02)

### Bug Fixes

-   prevent errors from null items returned in recommended loan query ([18a97a4](https://github.com/kiva/ui/commit/18a97a4a31791d3a03ad6641656574d3994ae235))

### [2.18.5](https://github.com/kiva/ui/compare/v2.18.4...v2.18.5) (2021-12-02)

### Bug Fixes

-   **live-loans:** handles bugs from fewer loans than asked for being returned ([e01eb03](https://github.com/kiva/ui/commit/e01eb03e9e104a50fc12aa52df54755b86041ec9))

### [2.18.4](https://github.com/kiva/ui/compare/v2.18.3...v2.18.4) (2021-12-01)

### Bug Fixes

-   core-185 replacing borrowerName with TrusteeName ([9e94d22](https://github.com/kiva/ui/commit/9e94d227c96bf078901a6a42ce715f4cfa1c172a))

### [2.18.3](https://github.com/kiva/ui/compare/v2.18.2...v2.18.3) (2021-12-01)

### Bug Fixes

-   core-308 fixing data points that were not hooked up, avgProfitabilty & currencyExchangeLossRate ([087da11](https://github.com/kiva/ui/commit/087da115ec751ab364e2e829e58acf4810a4a86d))

### [2.18.2](https://github.com/kiva/ui/compare/v2.18.1...v2.18.2) (2021-12-01)

### Bug Fixes

-   handle missing params state with more appropriate button option ([990b676](https://github.com/kiva/ui/commit/990b676368e625ac7f9aea46712cb700c458a37d))

### [2.18.1](https://github.com/kiva/ui/compare/v2.18.0...v2.18.1) (2021-12-01)

### Bug Fixes

-   guard against $ char in dynamic link ([488aff0](https://github.com/kiva/ui/commit/488aff00d950bb9f714be8e61b18c6385a0725ea))

## [2.18.0](https://github.com/kiva/ui/compare/v2.17.12...v2.18.0) (2021-12-01)

### Features

-   causes form and waitlist improvements ([cc88ca5](https://github.com/kiva/ui/commit/cc88ca5480f544b3573262ac64331656646b209c))

### [2.17.12](https://github.com/kiva/ui/compare/v2.17.11...v2.17.12) (2021-12-01)

### Bug Fixes

-   add name to ensure footer is cached and resolve server render error ([1768bae](https://github.com/kiva/ui/commit/1768baed5a0a5db482ce9010b4a59be9626eadad))

### [2.17.11](https://github.com/kiva/ui/compare/v2.17.10...v2.17.11) (2021-12-01)

### Bug Fixes

-   fixes the drop in error in a more robust way ([b5ee94c](https://github.com/kiva/ui/commit/b5ee94c2b1f8d096b039a04b38042689d16d2a12))

### [2.17.10](https://github.com/kiva/ui/compare/v2.17.9...v2.17.10) (2021-11-30)

### Bug Fixes

-   fixes issue with double initializing of BT drop in ([b3b2161](https://github.com/kiva/ui/commit/b3b21612b0edc08dd823bdcc383c2f2cc5787134))

### [2.17.9](https://github.com/kiva/ui/compare/v2.17.8...v2.17.9) (2021-11-30)

### Bug Fixes

-   fixes BT error if BT drop in gets initialized multiple times ([444a8e8](https://github.com/kiva/ui/commit/444a8e81c2b3767ac1be6267dde67626004408af))

### [2.17.8](https://github.com/kiva/ui/compare/v2.17.7...v2.17.8) (2021-11-30)

### Bug Fixes

-   fixes issues with BT drop in and causes signup ([f675ac1](https://github.com/kiva/ui/commit/f675ac197a969ba3d3527ae1c4eb2c39caaf4753))

### [2.17.7](https://github.com/kiva/ui/compare/v2.17.6...v2.17.7) (2021-11-29)

### Bug Fixes

-   changed month end copy for causes signup ([c827246](https://github.com/kiva/ui/commit/c827246d49ee6d7a8687e24de5cb071546078210))

### [2.17.6](https://github.com/kiva/ui/compare/v2.17.5...v2.17.6) (2021-11-29)

### Bug Fixes

-   ensure instant donation thanks is excluded ([10d3aab](https://github.com/kiva/ui/commit/10d3aabe6b842e3f3b8b527efdeecf2dba46151d))

### [2.17.5](https://github.com/kiva/ui/compare/v2.17.4...v2.17.5) (2021-11-29)

### Performance Improvements

-   increase min/max replicas for giving tuesday ([8df5e8e](https://github.com/kiva/ui/commit/8df5e8eeb1e069352e8b625a37e513a71693a852))

### [2.17.4](https://github.com/kiva/ui/compare/v2.17.3...v2.17.4) (2021-11-29)

### Bug Fixes

-   fixes causes signup eligibility issues and login query param messaging ([4b16b4a](https://github.com/kiva/ui/commit/4b16b4a2aa8de6f5f038a7928b02669a814da7ae))

### [2.17.3](https://github.com/kiva/ui/compare/v2.17.2...v2.17.3) (2021-11-29)

### Bug Fixes

-   move and update global exclude list ([4d3a787](https://github.com/kiva/ui/commit/4d3a787a2efd8ddc0a168ec180358f5f226a1f36))
-   update handling for pages that should not show promotions or their disclaimers ([038ec3e](https://github.com/kiva/ui/commit/038ec3e6cce7431378bc1f507fb45af2d7607d16))

### [2.17.2](https://github.com/kiva/ui/compare/v2.17.1...v2.17.2) (2021-11-29)

### Bug Fixes

-   remove hard-coded image designations in favor of the ordered objects from contentful ([f653a3a](https://github.com/kiva/ui/commit/f653a3a2bdec601e9234ce50b0232174665940ce))

### [2.17.1](https://github.com/kiva/ui/compare/v2.17.0...v2.17.1) (2021-11-24)

### Bug Fixes

-   fixes bugs with causes signup form success state ([e7d6a28](https://github.com/kiva/ui/commit/e7d6a283b6672c244e3350f0b275aaabca82d79d))

## [2.17.0](https://github.com/kiva/ui/compare/v2.16.2...v2.17.0) (2021-11-23)

### Features

-   adds dynamic date to causes signup form ([5a26a05](https://github.com/kiva/ui/commit/5a26a054cc11ce4005c63b69f437c7ed4962fbc7))

### [2.16.2](https://github.com/kiva/ui/compare/v2.16.1...v2.16.2) (2021-11-23)

### Bug Fixes

-   ensure disclaimer icon on appeal banner only shows when disclaimer is present ([caa456d](https://github.com/kiva/ui/commit/caa456d0afc3a026bc991b1b53084efb6bc92af0))
-   ensure richText content shows for globalPromo banners and hide disclaimer link when not present ([8001539](https://github.com/kiva/ui/commit/8001539a0bd54a5f095e73e293cb73018481b3d8))

### [2.16.1](https://github.com/kiva/ui/compare/v2.16.0...v2.16.1) (2021-11-23)

### Bug Fixes

-   make lightHeader and lightFooter cssVars available for header and footer ([6f99f93](https://github.com/kiva/ui/commit/6f99f93824cfb7cb3b94b39a34082fc06ce091f3))

## [2.16.0](https://github.com/kiva/ui/compare/v2.15.0...v2.16.0) (2021-11-23)

### Features

-   show no trustee state with updated tab name and link text ([857ae26](https://github.com/kiva/ui/commit/857ae26b4403dc631eb259f666c0948e96f1f513))

## [2.15.0](https://github.com/kiva/ui/compare/v2.14.3...v2.15.0) (2021-11-22)

### Features

-   if a user is logged in and has an account, get their email for the waitlist signup ([7bb75a2](https://github.com/kiva/ui/commit/7bb75a2c3708f2628113aa288e030861f10a2dd9))

### [2.14.3](https://github.com/kiva/ui/compare/v2.14.2...v2.14.3) (2021-11-22)

### Bug Fixes

-   prevent content from breaking mobile layout ([116fda2](https://github.com/kiva/ui/commit/116fda29c5ed6223f8964d955fad505ad6d79d05))
-   prevent javascript error if there's no loan ([0a18ad3](https://github.com/kiva/ui/commit/0a18ad33f225eff38184791cc803f80f368cb1cb))

### [2.14.2](https://github.com/kiva/ui/compare/v2.14.1...v2.14.2) (2021-11-22)

### Bug Fixes

-   update layout of global promo banner to ensure an inline display of the disclaimer link ([7a5503c](https://github.com/kiva/ui/commit/7a5503cbc3491bb98e4f8875ad20fd67859c8381))

### [2.14.1](https://github.com/kiva/ui/compare/v2.14.0...v2.14.1) (2021-11-19)

### Bug Fixes

-   sync browser clock before checkout page loads VUE-847 ([98f7aed](https://github.com/kiva/ui/commit/98f7aedbc6aae20eb9d188444cdf1f7723879106))

## [2.14.0](https://github.com/kiva/ui/compare/v2.13.2...v2.14.0) (2021-11-19)

### Features

-   remove experiment around homepage versions and redirects ([016d09b](https://github.com/kiva/ui/commit/016d09b6f348bd884e8700b8b8e6f99c114c63cb))

### Bug Fixes

-   redirect /homepage-classic to root now that experiment has ended ([74ea22a](https://github.com/kiva/ui/commit/74ea22aa6b98bff99bc59c596b423a3114d5b000))

### [2.13.2](https://github.com/kiva/ui/compare/v2.13.1...v2.13.2) (2021-11-19)

### Bug Fixes

-   remove theme logo color from use in corporate landing page ([7fdb548](https://github.com/kiva/ui/commit/7fdb548120f9054045dec1ad2ea6b3d4a68e4c34))
-   update default logo color to ([13f85d5](https://github.com/kiva/ui/commit/13f85d5c910cfa08f303412f465d6e09667b335e))

### [2.13.1](https://github.com/kiva/ui/compare/v2.13.0...v2.13.1) (2021-11-19)

### Bug Fixes

-   ensure corporate lenders opting-out of a team don't have that team applied to their loans ([b49f0c8](https://github.com/kiva/ui/commit/b49f0c8cda5a4294d5b049eaf2abeee89267c24f))
-   ensure team attribution component is reactive with updated, incoming props ([78eb6e8](https://github.com/kiva/ui/commit/78eb6e886b44814c5bc36f5825961d0afb88c586))

## [2.13.0](https://github.com/kiva/ui/compare/v2.12.0...v2.13.0) (2021-11-19)

### Features

-   add mutation for signing up for a cause subscription ([d81c22c](https://github.com/kiva/ui/commit/d81c22ce4a9a8f38d39197400fa320ec299b39f0))
-   added login protection to causes/signup route and variable template ([7023c59](https://github.com/kiva/ui/commit/7023c597e89a4a8d09a4f6fb1b53d22b68c3f689))
-   added thanks page and success events for causes ([9fef538](https://github.com/kiva/ui/commit/9fef538254d4c0cf9055004fe0ca79e72dbf6ca2))
-   causes signup form initial work ([29bf81a](https://github.com/kiva/ui/commit/29bf81a80ac3c02f2d48d205c571f3a2f37b6987))
-   get cause category id from API ([7d80ede](https://github.com/kiva/ui/commit/7d80edef297b8e29409c4f837025c15218d1f980))
-   modified eligibility check to sign up for cause ([3d58aa6](https://github.com/kiva/ui/commit/3d58aa6ca81bc45a27ebe09a27e82d3b6807f27d))

## [2.12.0](https://github.com/kiva/ui/compare/v2.11.0...v2.12.0) (2021-11-18)

### Features

-   enable redirect to instant lending if atb query param is present ([bcc9a28](https://github.com/kiva/ui/commit/bcc9a289d33e66eacbab1a9fee03e4c37f809d3f))

## [2.11.0](https://github.com/kiva/ui/compare/v2.10.0...v2.11.0) (2021-11-18)

### Features

-   green header theme was created and added to settings, portfolio and build pages and cleaning ([6e6bb3a](https://github.com/kiva/ui/commit/6e6bb3a6ab0aec9e89a822ccdb1f542a7dbba277))
-   light header theme was added to every page having the www-page component ([657df20](https://github.com/kiva/ui/commit/657df207cdc3c053bd9b19cbef64a308fd8a7c7d))

### Bug Fixes

-   code cleaning for lightheader theme ([c317630](https://github.com/kiva/ui/commit/c317630875f6686f2c8f1f512dc037a24f7c68c0))
-   code cleaning for lightheader theme ([4b8a837](https://github.com/kiva/ui/commit/4b8a83765088733bae6fb4da944bc064acd4f782))
-   gray background option was reverted for some pages ([5f7c08b](https://github.com/kiva/ui/commit/5f7c08b140a3666590e6c6d9c3ce6058d1f7c51e))
-   some pages were updated to revert the header theme update ([58ae5df](https://github.com/kiva/ui/commit/58ae5dff171c419031ad1cbcc957f5754242d8f6))

## [2.10.0](https://github.com/kiva/ui/compare/v2.9.0...v2.10.0) (2021-11-16)

### Features

-   handle incoming instantLending query param to hide kiva card row ([f42f500](https://github.com/kiva/ui/commit/f42f5003eefd78202ef7ff0cb0223797a95eb118))
-   process add to basket for loan id for instant lending and extract error scenarios ([badd420](https://github.com/kiva/ui/commit/badd4207c7a296db51edd1056c59d70241e2690c))
-   setup instant lending error page and content from contentful ([a27a5ad](https://github.com/kiva/ui/commit/a27a5adb9821d3b2556e31faf9ba3175c8cc730a))

### Bug Fixes

-   update routes for instant lending ([f658b48](https://github.com/kiva/ui/commit/f658b488acc79bf1e68eabfddce320a1c20d0eb3))

## [2.9.0](https://github.com/kiva/ui/compare/v2.8.0...v2.9.0) (2021-11-15)

### Features

-   core-251 adding previous loan link to borrower profile ([16de5b5](https://github.com/kiva/ui/commit/16de5b5be62efe704bb1e89952c84fda118a8aeb))

## [2.8.0](https://github.com/kiva/ui/compare/v2.7.0...v2.8.0) (2021-11-12)

### Features

-   core-236 adding data needed to calculate hasPromoSession within disclaimerContentful ([ecbbf0a](https://github.com/kiva/ui/commit/ecbbf0a90424bf485e0f61601f517a07d34c0a32))
-   core-236 adding margin spacing to body after removing from headline ([41390cd](https://github.com/kiva/ui/commit/41390cd5885235025342cf179abe32139a384f98))
-   core-236 adding smoothScroll to disclaimers anchor click ([1e5fcfa](https://github.com/kiva/ui/commit/1e5fcfafbca99b5af61b04ff6003c98382325aa4))
-   core-236 adding superscript to appeal banner open & closed versions ([12413d9](https://github.com/kiva/ui/commit/12413d94acd149805dca1e1e1bfe40f9350491e0))
-   core-236 cleanup ([d3272fb](https://github.com/kiva/ui/commit/d3272fb43ae310bffa447435b9be0dafbbf02823))
-   Core-236 disclaimer text parsed and rendered from contentful within the footer ([26c0193](https://github.com/kiva/ui/commit/26c01933e22238a86e11a21a442f5760e6fb4c82))
-   refactoring a little, cleaning up console error ([7309044](https://github.com/kiva/ui/commit/7309044ec5d09a183bd054b527cc8e893d81078e))

## [2.7.0](https://github.com/kiva/ui/compare/v2.6.1...v2.7.0) (2021-11-12)

### Features

-   add upc credit disclaimer ([db1bb5d](https://github.com/kiva/ui/commit/db1bb5d9a7729af9beb6aa119d845b45e83ed220))
-   adding scrollTo behavior jumpLinks ([a6bd9a4](https://github.com/kiva/ui/commit/a6bd9a42800571b9dba9f4546738aed290d77716))
-   adds optional button content to hero with carousel ([6c45b81](https://github.com/kiva/ui/commit/6c45b819e46557377a2236b2c66f1e37c83fbc4c))
-   **build:** switch to generic pipeline for deployments VUE-685 ([2c6a532](https://github.com/kiva/ui/commit/2c6a532c7d569fc82791173da9d25bbd430f3a95))
-   core-172 cleanup, removing unused refs ([8a10293](https://github.com/kiva/ui/commit/8a102932d582e8ce5eee48f6a6db21d1cff9822d))
-   core-172 jump link component, ids in place, styled ([bc5299c](https://github.com/kiva/ui/commit/bc5299c73263c3785a0b1da098876e769cc1d4b3))
-   core-172 links in place, needs spacing and finesse ([b94579c](https://github.com/kiva/ui/commit/b94579cef08ac8a5ec63e3824beb0f241579d117))
-   replace my scrollTo with smoothScroll mixin ([79b48e2](https://github.com/kiva/ui/commit/79b48e20174a9bfa8ec4336cfd56eee3c0b8df24))
-   style braintree drop-in to match KivaClassic ([f12a383](https://github.com/kiva/ui/commit/f12a3833b6122760ebe617d5a21e51780a3626e5))
-   use `main` as default branch ([8ef95de](https://github.com/kiva/ui/commit/8ef95dedb03ae4ee9fa1d789ceff177322c5b665))

### Bug Fixes

-   update eslint import path to fix eslint error for package case ([ea7fcdf](https://github.com/kiva/ui/commit/ea7fcdf86370d5a4886b6f91b5f311f8f0e019c2))
-   update promo amount presetntation for the loan level instead of cached global credit data ([7aac859](https://github.com/kiva/ui/commit/7aac8591f6e595e62a44a36ceaa5b87a48f6ab72))

[v2.715.2-rc.1]: https://github.com/kiva/ui/compare/v2.715.1...v2.715.2-rc.1
[v2.716.0-rc.1]: https://github.com/kiva/ui/compare/v2.715.2-rc.1...v2.716.0-rc.1
[v2.717.0-rc.1]: https://github.com/kiva/ui/compare/v2.716.0...v2.717.0-rc.1
[v2.718.0-rc.1]: https://github.com/kiva/ui/compare/v2.717.0...v2.718.0-rc.1
