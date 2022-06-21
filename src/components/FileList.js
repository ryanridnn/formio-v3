import { Components } from "formiojs";

const Component = Components.components.component;

class FileList extends Component {
	// --------------------------------------
	// ------ START: MAIN METHOds ---------
	// --------------------------------------

	constructor(component, options, data) {
		super(component, options, data);
	}

	render() {
		// render this component
		const component = new Components.components.htmlelement({
			type: "htmlelement",
			tag: "div",
			content: this.getTemplate(),
		}).render();

		return component;
	}

	// --------------------------------------
	// ------ END: MAIN METHOds ---------
	// --------------------------------------

	// --------------------------------------
	// ------ START: CUSTOM METHOds ---------
	// --------------------------------------

	// return file list templat
	getTemplate() {
		const template = `
			<div ref="file-cards" class="file-cards file-cards-outside">

			</div>
		`;

		return template;
	}

	// --------------------------------------
	// ------ END: CUSTOM METHOds ---------
	// --------------------------------------
}

export default FileList;
