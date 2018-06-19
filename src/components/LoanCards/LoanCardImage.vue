<!--
	issues:

	* tracking click on image - do here or bubble up?
		kvtrackevent="Lending|click-Read more|Photo|{{id}}|true"

	* do we need to deal with image editing?
		{{#is_admin}}
			<div class="image-edit-buttons">
				<a class="edit" href="{{image.edit_url}}" target="_blank"><svg class="icon icon-edit"><use xlink:href="#icon-edit"/></svg></a>
				<a class="refresh" href="#"><svg class="icon icon-refresh"><use xlink:href="#icon-refresh"/></svg></a>
			</div>
		{{/is_admin}}
 -->



<template>
	<a href="{{borrowerPageUrl}}">
		<!-- current implementation has image as background to <a> rather than <img />
	 			any reason to continue that?
				also - do we need an alt tag, if so, what should be in it? "photo of {borrower-name}"-->
		<img class="loan-card-borrower-image"
			srcset = "{{retinaUrl}} 2x"
			src = "{{standardUrl}}"
			alt = ""
		/>
	</a>
</template>

<script>
    export default {
        props: {
			standardUrl: {
				type: String,
				default: ''
			},
            retinaUrl: {
				type: String,
				default: ''
			},
			borrowerPageUrl: {
				type: String,
				default: ''
			},
			canFavorite: {
				type: Boolean
				default: false
			}
			isAdmin: {
				type: Boolean
				default: false
			}
        }
    };
</script>

<style scoped>
	.loan-card-borrower-image {
		width: 100%;
		max-width: rem-calc(480);  /* necessary? */
	}
</style>
