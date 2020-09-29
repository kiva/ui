import {
	Callout
} from '@/lib/globekit/globekit.esm';

class PinCallout extends Callout {
	createElement() {
		console.log(this.definition);
		const div = document.createElement('div');
		div.className = 'callout pin-callout';
		div.dataset.code = this.definition.data.code;
		return div;
	}

	setPosition(position) {
		const nx = position.screen.x - ((this.size.left + this.size.right) / 2);
		const ny = position.screen.y - 33;
		this.element.style.transform = `translate(${nx}px, ${ny}px)`;
		// this.element.style.zIndex = Math.round(10000 * position.world.similarityToCameraVector);
		this.element.style.zIndex = 10000;
	}
}

export default PinCallout;
