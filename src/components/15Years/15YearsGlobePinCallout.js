import { getCodes } from 'flag-icon-css';
import { Callout } from '@/lib/globekit/globekit.esm';

// Copied from KvFlag
const COUNTRY_LIST = getCodes();
const SPRITE_FLAG_WIDTH = 32; // Number of px wide that the sprite PNG is.
const getFlagSpriteYPosition = countryCode => {
	// Determine what percentage down the flag is in the sprite
	// depending on its position in the country list.
	const countryIndex = COUNTRY_LIST.indexOf(countryCode.toUpperCase());
	const flagHeightInSprite = SPRITE_FLAG_WIDTH;
	const totalSpriteHeight = flagHeightInSprite * (COUNTRY_LIST.length - 1);
	return ((countryIndex * flagHeightInSprite) / totalSpriteHeight) * 100;
};
// End Copied from KvFlag

class PinCallout extends Callout {
	createElement() {
		const div = document.createElement('div');
		div.innerHTML = `<div
			class="pin-callout-flag"
			style="background-position-y: ${getFlagSpriteYPosition(this.definition.data.iso2)}%">
		</div>`;
		div.className = 'callout pin-callout hidden';
		div.dataset.code = this.definition.data.iso3;
		return div;
	}

	setPosition(position) {
		const nx = position.screen.x - ((this.size.left + this.size.right) / 2);
		const ny = position.screen.y - ((this.size.top + this.size.bottom) * (66 / 74));
		this.element.style.transform = `translate(${nx}px, ${ny}px)`;
		// this.element.style.zIndex = Math.round(10000 * position.world.similarityToCameraVector);
		this.element.style.zIndex = 10000;
		this.element.classList.remove('hidden');
	}

	animateIn() {
		requestAnimationFrame(() => {
			this.element.classList.add('animate-in');
			setTimeout(() => {
				this.element.classList.remove('animate-in');
			}, 500);
		});
	}

	animateOut(onComplete) {
		this.element.classList.add('animate-out');
		setTimeout(() => {
			onComplete(this);
		}, 200);
	}
}

export default PinCallout;
