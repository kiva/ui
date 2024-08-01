import {
	Callout
} from '#src/lib/globekit/globekit.esm';

class DotCallout extends Callout {
	createElement() {
		this.firstRun = true;
		const div = document.createElement('div');
		div.className = 'callout dot-callout hidden';
		div.dataset.code = this.definition.data.iso3;
		return div;
	}

	setPosition(position) {
		const nx = position.screen.x - ((this.size.left + this.size.right) / 2);
		const ny = position.screen.y - ((this.size.left + this.size.right) / 2);
		this.element.style.transform = `translate(${nx}px, ${ny}px)`;
		this.element.style.zIndex = Math.round(10000 * position.world.similarityToCameraVector);
		if (position.world.similarityToCameraVector < 0.75) {
			const scale = Math.max((position.world.similarityToCameraVector - 0.5) / (0.75 - 0.5), 0);
			this.element.style.transform += ` scale(${scale}, ${scale})`;
		}
		if (this.firstRun) {
			setTimeout(() => {
				this.element.className = 'callout dot-callout';
			}, 50);
			this.firstRun = false;
		}
	}
}

export default DotCallout;
