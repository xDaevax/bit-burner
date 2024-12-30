import { BaseElement } from 'modules/ui/components/base-element';
import { Button, ButtonOptions } from 'modules/ui/components/button';
import { SVG, SVGOptions } from 'modules/ui/components/svg';

export class Container extends BaseElement {
	id = '';

	/**
	 * @type {ContainerOptions}
	 */
	#options;
	thisElement = null;
	#content = {};

	/**
	 * 
	 * @param {Document} dom 
	 * @param {ContainerOptions} options 
	 */
	constructor(dom, options) {
        super(dom);
		this.id = options.id;
		this.#content = options.content;
		this.#options = options;
	}

	#dragElement(elmnt, dom) {
		let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		if (this.findElementById(elmnt.id + '-header')) {
			// if present, the header is where you move the DIV from:
			this.findElementById(elmnt.id + '-header').onmousedown = dragMouseDown;
		} else {
			// otherwise, move the DIV from anywhere inside the DIV:
			elmnt.onmousedown = dragMouseDown;
		}

		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();
			// get the mouse cursor position at startup:
			pos3 = e.clientX;
			pos4 = e.clientY;
			dom.onmouseup = closeDragElement;
			// call a function whenever the cursor moves:
			dom.onmousemove = elementDrag;
		}

		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();
			// calculate the new cursor position:
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			// set the element's new position:
			elmnt.style.top = `${(elmnt.offsetTop - pos2)}px`;
			elmnt.style.left = `${(elmnt.offsetLeft - pos1)}px`;
		}

		function closeDragElement() {
			// stop moving when mouse button is released:
			dom.onmouseup = null;
			dom.onmousemove = null;
		}
	}

	create(headerText) {
		let exists = this.findElementById(this.id);

		if (!exists) {
			const node = this.createNode('div');
			node.id = this.id;
			let cssClasses = 'MuiPaper-root MuiPaper-elevation MuiPaper-elevation1 jss3 react-draggable react-draggable-dragged css-100bkux css-1m2n216-overviewContainer';
			node.classList.add(...cssClasses.split(' '));
			node.style.width = 'fit-content';
			node.style.minWidth = '45vw';
			node.append(this.createDockedHeader(this.id, headerText));
			node.append(this.createBodyLiner());
			this.thisElement = node;
			return node;
		}

		return null;
	}

	close(event) {
		this.thisElement.remove();
	}

	createDockedHeader(parentId, headerText) {
		const node = this.createNode('div');
		let cssClasses = 'MuiDrawer-root MuiDrawer-docked css-v3syqg border-bottom css-19262ez-header';
		node.id = `${parentId}-header`;
		node.style.width = '100%';
		node.classList.add(...cssClasses.split(' '));
		node.append(this.createHeaderLabel(headerText));
		return node;
	}

	minimize(e) {
		let target = e.currentTarget;

		target.classList.toggle('toggle');
		target.classList.toggle('toggled');
		target.parentNode?.parentNode?.parentNode?.querySelector('.collapsable').classList.toggle('collapsed');
	}

	createHeaderLabel(headerText) {
		const node = this.createNode('div');
		let cssClasses = 'MuiBox-root css-0 css-19262ez-header';
		node.style.width = "100%";
		node.classList.add(...cssClasses.split(' '));
		node.draggable = true;
		node.append(this.createIcon());
		node.append(this.createHeaderText(headerText));

		if (this.#options.expandable) {
			let svgOptions = new SVGOptions();
			svgOptions.pathData = 'M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z';
			svgOptions.cssClasses = ['MuiSvgIcon-root', 'MuiSvgIcon-colorSecondary', 'MuiSvgIcon-fontSizeMedium', 'css-1b0w8p7-icon'];
			let toggleIcon = new SVG(super.getDom(), svgOptions);

			let buttonOptions = new ButtonOptions();
			buttonOptions.cssClasses = ['toggle', 'MuiButtonBase-root', 'MuiButton-root', 'MuiButton-text', 'MuiButton-textPrimary', 'MuiButton-sizeSmall', 'MuiButton-textSizeSmall', 'MuiButton-root', 'MuiButton-text', 'MuiButton-textPrimary', 'MuiButton-sizeSmall', 'MuiButton-textSizeSmall', 'css-9vm2yu-visibilityToggle'];
			buttonOptions.click = (e) => this.minimize(e);
			let toggleButton = new Button(super.getDom(), buttonOptions);
			let toggleNode = toggleButton.create();
			toggleNode.append(toggleIcon.create());
			node.append(toggleNode);
		}

		if (this.#options.closable) {
			let closeButtonOptions = new ButtonOptions();
			closeButtonOptions.click = (e) => this.close();
			closeButtonOptions.cssClasses = 'MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButtonBase-root jss5 css-4i0fr7'.split(' ');
			closeButtonOptions.displayText = 'x';
			let closeButton = new Button(super.getDom(), closeButtonOptions);
			node.append(closeButton.create());
		}

		return node;
	}

	createHeaderText(headerText) {
		const node = this.createNode('p');
		let cssClasses = 'MuiTypography-root MuiTypography-body1 css-m9uj84';
		node.classList.add(...cssClasses.split(' '));
		node.textContent = headerText;
		return node;
	}

	createIcon() {
		const svgOptions = new SVGOptions();
		svgOptions.pathData = 'm22.747 10.291 -1.987 -0.331a8.925 8.925 0 0 0 -1.143 -2.74l1.107 -1.549a1.485 1.485 0 0 0 -0.158 -1.915l-0.321 -0.321a1.485 1.485 0 0 0 -1.915 -0.158l-1.549 1.107a8.925 8.925 0 0 0 -2.74 -1.143l-0.331 -1.987A1.5 1.5 0 0 0 12.23 0h-0.459a1.5 1.5 0 0 0 -1.48 1.253l-0.331 1.987a8.925 8.925 0 0 0 -2.74 1.143L5.671 3.277a1.485 1.485 0 0 0 -1.915 0.158l-0.321 0.321a1.485 1.485 0 0 0 -0.158 1.915l1.107 1.549a8.925 8.925 0 0 0 -1.143 2.74l-1.987 0.331A1.5 1.5 0 0 0 0 11.771v0.459a1.5 1.5 0 0 0 1.253 1.48l1.987 0.331a8.925 8.925 0 0 0 1.143 2.74l-1.107 1.549a1.485 1.485 0 0 0 0.158 1.915l0.321 0.321a1.485 1.485 0 0 0 1.915 0.158l1.549 -1.107a8.925 8.925 0 0 0 2.74 1.143l0.331 1.987A1.5 1.5 0 0 0 11.771 24h0.459a1.5 1.5 0 0 0 1.48 -1.253l0.331 -1.987a8.925 8.925 0 0 0 2.74 -1.143l1.549 1.107a1.485 1.485 0 0 0 1.915 -0.158l0.321 -0.321a1.485 1.485 0 0 0 0.158 -1.915l-1.107 -1.549a8.925 8.925 0 0 0 1.143 -2.74l1.987 -0.331A1.5 1.5 0 0 0 24 12.23v-0.459a1.5 1.5 0 0 0 -1.253 -1.48M12 16.5a4.5 4.5 0 1 1 4.5 -4.5 4.5 4.5 0 0 1 -4.5 4.5';
		svgOptions.cssClasses = ['MuiSvgIcon-root', 'MuiSvgIcon-colorSecondary', 'MuiSvgIcon-fontSizeMedium', 'css-1bpz3m4-icon'];
		const node = new SVG(super.getDom(), svgOptions);
		return node.create();
	}

	createBodyLiner() {
		const element = this.createElement('div', null, 'MuiCollapse-root collapsable');
		const liner = this.createElement('div', null, 'MuiTable-root css-1gurbcj');
		liner.append(this.#content);
		element.append(liner);
		return element;
	}

	createElement(name, id, classList) {
		const element = this.createNode(name);
		element.classList.add(...classList.split(' '));

		if (id) {
			element.id = id;
		}

		return element;
	}

	render(headerText) {
		let existing = this.findElementById(this.id);
		if (!this.findElementById(this.id)) {
			this.findElementById('root').append(this.create(headerText));
		} else {
			existing.remove();
			this.findElementById('root').append(this.create(headerText));
		}

		this.#dragElement(this.findElementById(this.id), this.getDom());
	}
} // end class Container

export class ContainerOptions {
	expandable = false;
	closable = false;
}