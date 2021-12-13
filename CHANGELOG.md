## [2.21.0](https://github.com/kiva/ui/compare/v2.20.2...v2.21.0) (2021-12-10)


### Features

* **Matching:** hide match message when remaining loan amount is less than match amount ([02155eb](https://github.com/kiva/ui/commit/02155ebe38473bb8da5cfaf01d5e67b5f9fae745))


### Bug Fixes

* remove testing background style ([2fa3f08](https://github.com/kiva/ui/commit/2fa3f08e82ce2994669702f562cb8adc9b367d01))

### [2.20.2](https://github.com/kiva/ui/compare/v2.20.1...v2.20.2) (2021-12-08)


### Bug Fixes

* **Header:** provide a fallback lightHeader theme, ensures promoBanner styles when page has no theme ([d653823](https://github.com/kiva/ui/commit/d653823461f6815546b2f81db740a79faab41e2c))

### [2.20.1](https://github.com/kiva/ui/compare/v2.20.0...v2.20.1) (2021-12-08)


### Bug Fixes

* **lending reward:** update typo, refresh lendingRewardOffered on basket update, fix cursor style: ([cbae537](https://github.com/kiva/ui/commit/cbae537c94fb6116edb2fc266ffaf055a01404bb))

## [2.20.0](https://github.com/kiva/ui/compare/v2.19.2...v2.20.0) (2021-12-08)


### Features

* show donation row when lendingRewardOffered ([e6f1426](https://github.com/kiva/ui/commit/e6f142657b4d93738e60b9e6da7ef5fe6d1c5b73))

### [2.19.2](https://github.com/kiva/ui/compare/v2.19.1...v2.19.2) (2021-12-07)


### Bug Fixes

* **Managed Lending:** ensure themes are available as filters and match by name instead of id ([a6d489f](https://github.com/kiva/ui/commit/a6d489f2191796b69820d42e5583a04e6724b69c))

### [2.19.1](https://github.com/kiva/ui/compare/v2.19.0...v2.19.1) (2021-12-06)


### Bug Fixes

* **Landing Pages:** ensure tip message shows above in context checkout for managed lending ([c51fc5d](https://github.com/kiva/ui/commit/c51fc5d928814c2adefcde5fa02fc316563ad65a))

## [2.19.0](https://github.com/kiva/ui/compare/v2.18.10...v2.19.0) (2021-12-06)


### Features

* **Borrower Profile:** add click tracking on details tabs, definitions and links ([9d4a41d](https://github.com/kiva/ui/commit/9d4a41d94b7376306dc5420c00da8ee290b4627a))

### [2.18.10](https://github.com/kiva/ui/compare/v2.18.9...v2.18.10) (2021-12-06)


### Bug Fixes

* core-322 increase font-weight and spacing of jump links on borrower profile ([2a9f71e](https://github.com/kiva/ui/commit/2a9f71e6a922f7deab29aac6f4ff19ff180ceaac))

### [2.18.9](https://github.com/kiva/ui/compare/v2.18.8...v2.18.9) (2021-12-06)


### Bug Fixes

* updated TOU, updated last changed date and highlighted new substantive changes ([a6435df](https://github.com/kiva/ui/commit/a6435dfde1dc1c79379a093b93f46bef61681d90))

### [2.18.8](https://github.com/kiva/ui/compare/v2.18.7...v2.18.8) (2021-12-03)


### Bug Fixes

* catch redirection errors from router.push ([5efd0e5](https://github.com/kiva/ui/commit/5efd0e54904505c495701d935a49675d490bfbc9))

### [2.18.7](https://github.com/kiva/ui/compare/v2.18.6...v2.18.7) (2021-12-03)


### Bug Fixes

* core-316 simple formatting on numBorrowers & numDefaultedLoans ([7469c78](https://github.com/kiva/ui/commit/7469c78780c2ab4005bff9195851afa4a6708c7a))
* in-component navigation guards should not redirect ([4346689](https://github.com/kiva/ui/commit/43466890450a8dde3016b5958d2b00d317d2992d))

### [2.18.6](https://github.com/kiva/ui/compare/v2.18.5...v2.18.6) (2021-12-02)


### Bug Fixes

* prevent errors from null items returned in recommended loan query ([18a97a4](https://github.com/kiva/ui/commit/18a97a4a31791d3a03ad6641656574d3994ae235))

### [2.18.5](https://github.com/kiva/ui/compare/v2.18.4...v2.18.5) (2021-12-02)


### Bug Fixes

* **live-loans:** handles bugs from fewer loans than asked for being returned ([e01eb03](https://github.com/kiva/ui/commit/e01eb03e9e104a50fc12aa52df54755b86041ec9))

### [2.18.4](https://github.com/kiva/ui/compare/v2.18.3...v2.18.4) (2021-12-01)


### Bug Fixes

* core-185 replacing borrowerName with TrusteeName ([9e94d22](https://github.com/kiva/ui/commit/9e94d227c96bf078901a6a42ce715f4cfa1c172a))

### [2.18.3](https://github.com/kiva/ui/compare/v2.18.2...v2.18.3) (2021-12-01)


### Bug Fixes

* core-308 fixing data points that were not hooked up, avgProfitabilty & currencyExchangeLossRate ([087da11](https://github.com/kiva/ui/commit/087da115ec751ab364e2e829e58acf4810a4a86d))

### [2.18.2](https://github.com/kiva/ui/compare/v2.18.1...v2.18.2) (2021-12-01)


### Bug Fixes

* handle missing params state with more appropriate button option ([990b676](https://github.com/kiva/ui/commit/990b676368e625ac7f9aea46712cb700c458a37d))

### [2.18.1](https://github.com/kiva/ui/compare/v2.18.0...v2.18.1) (2021-12-01)


### Bug Fixes

* guard against $ char in dynamic link ([488aff0](https://github.com/kiva/ui/commit/488aff00d950bb9f714be8e61b18c6385a0725ea))

## [2.18.0](https://github.com/kiva/ui/compare/v2.17.12...v2.18.0) (2021-12-01)


### Features

* causes form and waitlist improvements ([cc88ca5](https://github.com/kiva/ui/commit/cc88ca5480f544b3573262ac64331656646b209c))

### [2.17.12](https://github.com/kiva/ui/compare/v2.17.11...v2.17.12) (2021-12-01)


### Bug Fixes

* add name to ensure footer is cached and resolve server render error ([1768bae](https://github.com/kiva/ui/commit/1768baed5a0a5db482ce9010b4a59be9626eadad))

### [2.17.11](https://github.com/kiva/ui/compare/v2.17.10...v2.17.11) (2021-12-01)


### Bug Fixes

* fixes the drop in error in a more robust way ([b5ee94c](https://github.com/kiva/ui/commit/b5ee94c2b1f8d096b039a04b38042689d16d2a12))

### [2.17.10](https://github.com/kiva/ui/compare/v2.17.9...v2.17.10) (2021-11-30)


### Bug Fixes

* fixes issue with double initializing of BT drop in ([b3b2161](https://github.com/kiva/ui/commit/b3b21612b0edc08dd823bdcc383c2f2cc5787134))

### [2.17.9](https://github.com/kiva/ui/compare/v2.17.8...v2.17.9) (2021-11-30)


### Bug Fixes

* fixes BT error if BT drop in gets initialized multiple times ([444a8e8](https://github.com/kiva/ui/commit/444a8e81c2b3767ac1be6267dde67626004408af))

### [2.17.8](https://github.com/kiva/ui/compare/v2.17.7...v2.17.8) (2021-11-30)


### Bug Fixes

* fixes issues with BT drop in and causes signup ([f675ac1](https://github.com/kiva/ui/commit/f675ac197a969ba3d3527ae1c4eb2c39caaf4753))

### [2.17.7](https://github.com/kiva/ui/compare/v2.17.6...v2.17.7) (2021-11-29)


### Bug Fixes

* changed month end copy for causes signup ([c827246](https://github.com/kiva/ui/commit/c827246d49ee6d7a8687e24de5cb071546078210))

### [2.17.6](https://github.com/kiva/ui/compare/v2.17.5...v2.17.6) (2021-11-29)


### Bug Fixes

* ensure instant donation thanks is excluded ([10d3aab](https://github.com/kiva/ui/commit/10d3aabe6b842e3f3b8b527efdeecf2dba46151d))

### [2.17.5](https://github.com/kiva/ui/compare/v2.17.4...v2.17.5) (2021-11-29)


### Performance Improvements

* increase min/max replicas for giving tuesday ([8df5e8e](https://github.com/kiva/ui/commit/8df5e8eeb1e069352e8b625a37e513a71693a852))

### [2.17.4](https://github.com/kiva/ui/compare/v2.17.3...v2.17.4) (2021-11-29)


### Bug Fixes

* fixes causes signup eligibility issues and login query param messaging ([4b16b4a](https://github.com/kiva/ui/commit/4b16b4a2aa8de6f5f038a7928b02669a814da7ae))

### [2.17.3](https://github.com/kiva/ui/compare/v2.17.2...v2.17.3) (2021-11-29)


### Bug Fixes

* move and update global exclude list ([4d3a787](https://github.com/kiva/ui/commit/4d3a787a2efd8ddc0a168ec180358f5f226a1f36))
* update handling for pages that should not show promotions or their disclaimers ([038ec3e](https://github.com/kiva/ui/commit/038ec3e6cce7431378bc1f507fb45af2d7607d16))

### [2.17.2](https://github.com/kiva/ui/compare/v2.17.1...v2.17.2) (2021-11-29)


### Bug Fixes

* remove hard-coded image designations in favor of the ordered objects from contentful ([f653a3a](https://github.com/kiva/ui/commit/f653a3a2bdec601e9234ce50b0232174665940ce))

### [2.17.1](https://github.com/kiva/ui/compare/v2.17.0...v2.17.1) (2021-11-24)


### Bug Fixes

* fixes bugs with causes signup form success state ([e7d6a28](https://github.com/kiva/ui/commit/e7d6a283b6672c244e3350f0b275aaabca82d79d))

## [2.17.0](https://github.com/kiva/ui/compare/v2.16.2...v2.17.0) (2021-11-23)


### Features

* adds dynamic date to causes signup form ([5a26a05](https://github.com/kiva/ui/commit/5a26a054cc11ce4005c63b69f437c7ed4962fbc7))

### [2.16.2](https://github.com/kiva/ui/compare/v2.16.1...v2.16.2) (2021-11-23)


### Bug Fixes

* ensure disclaimer icon on appeal banner only shows when disclaimer is present ([caa456d](https://github.com/kiva/ui/commit/caa456d0afc3a026bc991b1b53084efb6bc92af0))
* ensure richText content shows for globalPromo banners and hide disclaimer link when not present ([8001539](https://github.com/kiva/ui/commit/8001539a0bd54a5f095e73e293cb73018481b3d8))

### [2.16.1](https://github.com/kiva/ui/compare/v2.16.0...v2.16.1) (2021-11-23)


### Bug Fixes

* make lightHeader and lightFooter cssVars available for header and footer ([6f99f93](https://github.com/kiva/ui/commit/6f99f93824cfb7cb3b94b39a34082fc06ce091f3))

## [2.16.0](https://github.com/kiva/ui/compare/v2.15.0...v2.16.0) (2021-11-23)


### Features

* show no trustee state with updated tab name and link text ([857ae26](https://github.com/kiva/ui/commit/857ae26b4403dc631eb259f666c0948e96f1f513))

## [2.15.0](https://github.com/kiva/ui/compare/v2.14.3...v2.15.0) (2021-11-22)


### Features

* if a user is logged in and has an account, get their email for the waitlist signup ([7bb75a2](https://github.com/kiva/ui/commit/7bb75a2c3708f2628113aa288e030861f10a2dd9))

### [2.14.3](https://github.com/kiva/ui/compare/v2.14.2...v2.14.3) (2021-11-22)


### Bug Fixes

* prevent content from breaking mobile layout ([116fda2](https://github.com/kiva/ui/commit/116fda29c5ed6223f8964d955fad505ad6d79d05))
* prevent javascript error if there's no loan ([0a18ad3](https://github.com/kiva/ui/commit/0a18ad33f225eff38184791cc803f80f368cb1cb))

### [2.14.2](https://github.com/kiva/ui/compare/v2.14.1...v2.14.2) (2021-11-22)


### Bug Fixes

* update layout of global promo banner to ensure an inline display of the disclaimer link ([7a5503c](https://github.com/kiva/ui/commit/7a5503cbc3491bb98e4f8875ad20fd67859c8381))

### [2.14.1](https://github.com/kiva/ui/compare/v2.14.0...v2.14.1) (2021-11-19)


### Bug Fixes

* sync browser clock before checkout page loads VUE-847 ([98f7aed](https://github.com/kiva/ui/commit/98f7aedbc6aae20eb9d188444cdf1f7723879106))

## [2.14.0](https://github.com/kiva/ui/compare/v2.13.2...v2.14.0) (2021-11-19)


### Features

* remove experiment around homepage versions and redirects ([016d09b](https://github.com/kiva/ui/commit/016d09b6f348bd884e8700b8b8e6f99c114c63cb))


### Bug Fixes

* redirect /homepage-classic to root now that experiment has ended ([74ea22a](https://github.com/kiva/ui/commit/74ea22aa6b98bff99bc59c596b423a3114d5b000))

### [2.13.2](https://github.com/kiva/ui/compare/v2.13.1...v2.13.2) (2021-11-19)


### Bug Fixes

* remove theme logo color from use in corporate landing page ([7fdb548](https://github.com/kiva/ui/commit/7fdb548120f9054045dec1ad2ea6b3d4a68e4c34))
* update default logo color to ([13f85d5](https://github.com/kiva/ui/commit/13f85d5c910cfa08f303412f465d6e09667b335e))

### [2.13.1](https://github.com/kiva/ui/compare/v2.13.0...v2.13.1) (2021-11-19)


### Bug Fixes

* ensure corporate lenders opting-out of a team don't have that team applied to their loans ([b49f0c8](https://github.com/kiva/ui/commit/b49f0c8cda5a4294d5b049eaf2abeee89267c24f))
* ensure team attribution component is reactive with updated, incoming props ([78eb6e8](https://github.com/kiva/ui/commit/78eb6e886b44814c5bc36f5825961d0afb88c586))

## [2.13.0](https://github.com/kiva/ui/compare/v2.12.0...v2.13.0) (2021-11-19)


### Features

* add mutation for signing up for a cause subscription ([d81c22c](https://github.com/kiva/ui/commit/d81c22ce4a9a8f38d39197400fa320ec299b39f0))
* added login protection to causes/signup route and variable template ([7023c59](https://github.com/kiva/ui/commit/7023c597e89a4a8d09a4f6fb1b53d22b68c3f689))
* added thanks page and success events for causes ([9fef538](https://github.com/kiva/ui/commit/9fef538254d4c0cf9055004fe0ca79e72dbf6ca2))
* causes signup form initial work ([29bf81a](https://github.com/kiva/ui/commit/29bf81a80ac3c02f2d48d205c571f3a2f37b6987))
* get cause category id from API ([7d80ede](https://github.com/kiva/ui/commit/7d80edef297b8e29409c4f837025c15218d1f980))
* modified eligibility check to sign up for cause ([3d58aa6](https://github.com/kiva/ui/commit/3d58aa6ca81bc45a27ebe09a27e82d3b6807f27d))

## [2.12.0](https://github.com/kiva/ui/compare/v2.11.0...v2.12.0) (2021-11-18)


### Features

* enable redirect to instant lending if atb query param is present ([bcc9a28](https://github.com/kiva/ui/commit/bcc9a289d33e66eacbab1a9fee03e4c37f809d3f))

## [2.11.0](https://github.com/kiva/ui/compare/v2.10.0...v2.11.0) (2021-11-18)


### Features

* green header theme was created and added to settings, portfolio and build pages and cleaning ([6e6bb3a](https://github.com/kiva/ui/commit/6e6bb3a6ab0aec9e89a822ccdb1f542a7dbba277))
* light header theme was added to every page having the www-page component ([657df20](https://github.com/kiva/ui/commit/657df207cdc3c053bd9b19cbef64a308fd8a7c7d))


### Bug Fixes

* code cleaning for lightheader theme ([c317630](https://github.com/kiva/ui/commit/c317630875f6686f2c8f1f512dc037a24f7c68c0))
* code cleaning for lightheader theme ([4b8a837](https://github.com/kiva/ui/commit/4b8a83765088733bae6fb4da944bc064acd4f782))
* gray background option was reverted for some pages ([5f7c08b](https://github.com/kiva/ui/commit/5f7c08b140a3666590e6c6d9c3ce6058d1f7c51e))
* some pages were updated to revert the header theme update ([58ae5df](https://github.com/kiva/ui/commit/58ae5dff171c419031ad1cbcc957f5754242d8f6))

## [2.10.0](https://github.com/kiva/ui/compare/v2.9.0...v2.10.0) (2021-11-16)


### Features

* handle incoming instantLending query param to hide kiva card row ([f42f500](https://github.com/kiva/ui/commit/f42f5003eefd78202ef7ff0cb0223797a95eb118))
* process add to basket for loan id for instant lending and extract error scenarios ([badd420](https://github.com/kiva/ui/commit/badd4207c7a296db51edd1056c59d70241e2690c))
* setup instant lending error page and content from contentful ([a27a5ad](https://github.com/kiva/ui/commit/a27a5adb9821d3b2556e31faf9ba3175c8cc730a))


### Bug Fixes

* update routes for instant lending ([f658b48](https://github.com/kiva/ui/commit/f658b488acc79bf1e68eabfddce320a1c20d0eb3))

## [2.9.0](https://github.com/kiva/ui/compare/v2.8.0...v2.9.0) (2021-11-15)


### Features

* core-251 adding previous loan link to borrower profile ([16de5b5](https://github.com/kiva/ui/commit/16de5b5be62efe704bb1e89952c84fda118a8aeb))

## [2.8.0](https://github.com/kiva/ui/compare/v2.7.0...v2.8.0) (2021-11-12)


### Features

* core-236 adding data needed to calculate hasPromoSession within disclaimerContentful ([ecbbf0a](https://github.com/kiva/ui/commit/ecbbf0a90424bf485e0f61601f517a07d34c0a32))
* core-236 adding margin spacing to body after removing from headline ([41390cd](https://github.com/kiva/ui/commit/41390cd5885235025342cf179abe32139a384f98))
* core-236 adding smoothScroll to disclaimers anchor click ([1e5fcfa](https://github.com/kiva/ui/commit/1e5fcfafbca99b5af61b04ff6003c98382325aa4))
* core-236 adding superscript to appeal banner open & closed versions ([12413d9](https://github.com/kiva/ui/commit/12413d94acd149805dca1e1e1bfe40f9350491e0))
* core-236 cleanup ([d3272fb](https://github.com/kiva/ui/commit/d3272fb43ae310bffa447435b9be0dafbbf02823))
* Core-236 disclaimer text parsed and rendered from contentful within the footer ([26c0193](https://github.com/kiva/ui/commit/26c01933e22238a86e11a21a442f5760e6fb4c82))
* refactoring a little, cleaning up console error ([7309044](https://github.com/kiva/ui/commit/7309044ec5d09a183bd054b527cc8e893d81078e))

## [2.7.0](https://github.com/kiva/ui/compare/v2.6.1...v2.7.0) (2021-11-12)


### Features

* add upc credit disclaimer ([db1bb5d](https://github.com/kiva/ui/commit/db1bb5d9a7729af9beb6aa119d845b45e83ed220))
* adding scrollTo behavior jumpLinks ([a6bd9a4](https://github.com/kiva/ui/commit/a6bd9a42800571b9dba9f4546738aed290d77716))
* adds optional button content to hero with carousel ([6c45b81](https://github.com/kiva/ui/commit/6c45b819e46557377a2236b2c66f1e37c83fbc4c))
* **build:** switch to generic pipeline for deployments VUE-685 ([2c6a532](https://github.com/kiva/ui/commit/2c6a532c7d569fc82791173da9d25bbd430f3a95))
* core-172 cleanup, removing unused refs ([8a10293](https://github.com/kiva/ui/commit/8a102932d582e8ce5eee48f6a6db21d1cff9822d))
* core-172 jump link component, ids in place, styled ([bc5299c](https://github.com/kiva/ui/commit/bc5299c73263c3785a0b1da098876e769cc1d4b3))
* core-172 links in place, needs spacing and finesse ([b94579c](https://github.com/kiva/ui/commit/b94579cef08ac8a5ec63e3824beb0f241579d117))
* replace my scrollTo with smoothScroll mixin ([79b48e2](https://github.com/kiva/ui/commit/79b48e20174a9bfa8ec4336cfd56eee3c0b8df24))
* style braintree drop-in to match KivaClassic ([f12a383](https://github.com/kiva/ui/commit/f12a3833b6122760ebe617d5a21e51780a3626e5))
* use `main` as default branch ([8ef95de](https://github.com/kiva/ui/commit/8ef95dedb03ae4ee9fa1d789ceff177322c5b665))


### Bug Fixes

* update eslint import path to fix eslint error for package case ([ea7fcdf](https://github.com/kiva/ui/commit/ea7fcdf86370d5a4886b6f91b5f311f8f0e019c2))
* update promo amount presetntation for the loan level instead of cached global credit data ([7aac859](https://github.com/kiva/ui/commit/7aac8591f6e595e62a44a36ceaa5b87a48f6ab72))
