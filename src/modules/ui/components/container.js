import { BaseElement } from 'modules/ui/components/base-element';

export class Container extends BaseElement {
	id = '';
	thisElement = null;
	#content = {};

	constructor(dom, options) {
        super(dom);
		this.id = options.id;
		this.#content = options.content;
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
			let cssClasses = 'MuiPaper-root MuiPaper-elevation MuiPaper-elevation1 jss3 react-draggable react-draggable-dragged css-100bkux';
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
		let cssClasses = 'MuiDrawer-root MuiDrawer-docked css-v3syqg border-bottom';
		node.id = `${parentId}-header`;
		node.style.width = '100%';
		node.classList.add(...cssClasses.split(' '));
		node.append(this.createHeaderLabel(headerText));
		return node;
	}

	createHeaderLabel(headerText) {
		const node = this.createNode('div');
		let cssClasses = 'jss4 MuiBox-root css-0';
		node.classList.add(...cssClasses.split(' '));
		node.draggable = true;
		node.append(this.createIcon());
		node.append(this.createHeaderText(headerText));
		let expander = this.createElement('button', null, 'MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButtonBase-root jss5 css-4i0fr7');
		expander.textContent = 'x';
		expander.onclick = () => this.close();
		node.append(expander);
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
		const node = this.createElement('svg', '', 'MuiSvgIcon-root MuiSvgIcon-colorSecondary MuiSvgIcon-fontSizeMedium jss7 css-14r2v8n');
		node.attributes['data-feather'] = 'circle';
		return node;
	}

	createBodyLiner() {
		const element = this.createElement('div', null, 'MuiCollapse-root');
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