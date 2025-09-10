<template>
	<www-page>
		<template #secondary>
			<developer-secondary-menu />
		</template>
		<build-page-wrapper class="tw-prose">
			<h1>App Gallery</h1>

			<p>
				These applications are created by third party developers, using Kiva tools. Kiva does not endorse or
				guarantee any of these applications. Visit
				<a href="http://build.kiva.org" target="_blank">build.kiva.org</a> to learn more about our developer
				program.
			</p>

			<h2>Websites</h2>

			<ul>
				<li>
					<a href="http://kivafolio.appspot.com/">KivaFolio</a> - An app that helps analyze a Kiva
					portfolio's diversity across different sectors and countries, and recommends fundraising loans to
					help to balance the portfolio.
				</li>
				<li>
					<a href="http://www.kivalive.com/">KivaLive: Kiva loans in real-time</a> - An app that allows you
					to monitor loans from public lenders at Kiva as they happen.
				</li>
				<li>
					<a href="http://www.kivalens.org/">KivaLens</a> - This powerful web app can be used to analyze
					fundraising loans on Kiva and quickly determine which meet your risk tolerance. You can even
					collect your favorite loans in a "bundle" for easy checkout on the Kiva website!
					(requires Microsoft Silverlight plugin)
				</li>
				<li>
					<a href="http://kivajapan.org">Kiva Japan (今僕らにできる社会貢献)</a> - A Kiva
					portal for Japanese speakers.
				</li>
				<li>
					<a href="http://kivastream.appspot.com/" target="_blank">Kiva Stream</a> - A site promoting kiva
					and offering alternate loan search functionality
				</li>
				<li>
					<a href="http://jameskopcienski.github.io/kivamap/">Kiva Loan Map</a> - Shows a list of recent
					micro-finance loans transacted on kiva.org and displays each one on a map when it is selected.
				</li>
			</ul>

			<h2>Mobile</h2>

			<ul>
				<li>
					<a href="http://kivabridge.maynebridge.com/">Kiva Bridge</a> (iPad/iPhone/iPod Touch) - Explore the
					universe of microlending opportunities available through the global Kiva community quickly and
					conveniently.
				</li>
				<li>
					<a href="http://www.freewarepocketpc.net/wp7/download-kiva7.html">Kiva7</a> (Windows Phone 7) -
					Kiva7 allows you to browse your loan portfolio on Kiva. Search for new loans and check out on the
					Kiva website.
				</li>
				<li>
					<a href="http://www.chimpler.com/kivadroid">KivaDroid</a> (Android) - KivaDroid provides an easy
					interface for Android phones to browse and make loans on Kiva. You can manage your basket on your
					phone and checkout when you are ready. Also you can browse the latest entries of the journal and
					browse your portfolio.
				</li>
				<li>
					<a href="http://itunes.apple.com/app/ikiva-for-kiva-org/id431378735?mt=8">iKiva</a>
					(iPad/iPhone/iPod Touch) - Browse and find loans using filters. View a detailed description of the
					loans, location and repayment terms. Search for loans using different criteria like geographic
					region, status, etc. Check your portfolio and loans' status. View top lending teams and their
					details. Add loans to your basket, set a pre-configured donation amount to Kiva and checkout using
					the Kiva website.
				</li>
				<li>
					<a href="http://www.kivamobile.org/">Kiva Mobile</a> (Web based) - Check Kiva loans from your
					mobile device.
				</li>
				<li>
					<a href="http://www.kivaiphoneapp.com/">Kiva Lender</a> (iPad/iPhone/iPod Touch) - A Kiva iPhone
					app.
				</li>
				<li>
					<a href="http://www.woohoosoftware.com/kivasearch/">KivaSearch</a> (Android) - KivaSearch is an
					Android app that helps you search for the latest Kiva loans. You can view your portfolio, create a
					watch list, or join a team. KivaSearch includes swipe navigation, small and large screen (tablet)
					support.
				</li>
				<li>
					<a href="http://www.panok.se/">Kiva by Panok</a> (Android) -  Kiva by Panok is an Android
					application for Kiva.org. Its purpose is to provide a simple way to browse and manage Kiva
					microfinance “on the go”.
				</li>
			</ul>

			<h2>Developer Tools</h2>

			<ul>
				<li>
					<a href="https://github.com/nekonekonik/big_hacks">KivaNuevo</a> - Sms-based service that allows
					borrowers to update lenders about their progress in real time.
				</li>
			</ul>

			<h2>Widgets</h2>

			<ul>
				<li>
					<a href="http://www.humsara.com/projects/kiva/">Humsara</a> - Create a Kiva Badge for your website
					to show off your loans.
				</li>
			</ul>

			<h2>Projects</h2>

			<ul>
				<li>
					<a href="https://github.com/jmhrovat/Kiva-integration-with-ArcGIS">Kiva Integration with ArcGIS</a>
					- This project uses the kiva API to convert loan data into a CSV format for upload to the ArcGIS
					server.
				</li>
				<li>
					<a href="http://www.kivafriends.org/index.php/topic,3352.msg56487.html#msg56487">
						CommonLenders spreadsheet
					</a> - KivaTrivia: Which lenders do you share most loans with? Which loan(s) do you
					share with your best friend? (requires Microsoft Excel for Windows)
				</li>
				<li>
					<a href="http://www.kivafriends.org/index.php/topic,3992.0.html">FundraisingLoans spreadsheet</a>
					- Browse, filter and search all currently fundraising Kiva loans in an Excel spreadsheet. You can
					also mark loans for purchase to quickly create a checkout basket on Kiva.
					(requires Microsoft Excel for Windows)
				</li>
				<li>
					<a href="http://www.kivafriends.org/index.php/topic,4176.0.html">Summary spreadsheet</a> - An Excel
					spreadsheet that allows you to easily manage and make sense of your Kiva portfolio, whatever its
					size. (requires Microsoft Excel for Windows)
				</li>
			</ul>

			<p>
				Are you a developer, designer or tech-fanatic? Check out
				<a href="http://build.kiva.org" target="_blank">build.kiva.org</a> to learn more about our API and join
				our awesome developer community.
			</p>
		</build-page-wrapper>
	</www-page>
</template>

<script>
import DeveloperSecondaryMenu from '#src/components/WwwFrame/Menus/DeveloperSecondaryMenu';
import BuildPageWrapper from '#src/components/Build/BuildPageWrapper';
import WwwPage from '#src/components/WwwFrame/WwwPage';

export default {
	name: 'AppGalleryPage',
	components: {
		DeveloperSecondaryMenu,
		BuildPageWrapper,
		WwwPage,
	},
	head: {
		title: 'App Gallery'
	},
};
</script>
