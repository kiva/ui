import {
	Callout
} from '@/lib/globekit/globekit.esm';

class PinCallout extends Callout {
	createElement() {
		const div = document.createElement('div');
		div.innerHTML = '<div></div>';
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
			this.element.classList.add('animate-n');
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
