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
