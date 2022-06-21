import { Components } from "formiojs";

const Component = Components.components.component;

class FileModal extends Component {
	// --------------------------------------
	// ------ START: MAIN METHOds ---------
	// --------------------------------------

	constructor(component, options, data) {
		super(component, options, data);
	}

	render() {
		const template = this.getTemplate();

		const modal = new Components.components.component({
			customClass: "file-modal",
		});

		// render the modal
		return modal.render(template);
	}

	// --------------------------------------
	// ------ END: MAIN METHOds ---------
	// --------------------------------------

	// --------------------------------------
	// ------ START: CUSTOM METHOds ---------
	// --------------------------------------

	// these template methods are being grouped by descending order, from parent to inner child
	// the tree: getTemplate => getModalTemplate => getFormTemplate

	// return the modal open button, and the modal
	getTemplate() {
		// get the modal template
		const modalTemplate = this.getModalTemplate();

		const template = `
			<button ref="modal-open" class="btn-modal-open" data-bs-toggle="modal" data-bs-target="#${this.component.modalId}">${this.component.label}</button>
			${modalTemplate}
		`;

		return template;
	}

	// get the modak template
	getModalTemplate() {
		// get the form template
		const formTemplate = this.getFormTemplate();
		const modalTemplate = `
			<div class="modal file-modal fade" id="${this.component.modalId}" tabindex="-1" aria-labelledby="${this.component.modalId}" aria-hidden="true">
			  <div class="modal-dialog modal-xl modal-dialog-centered">
			    <div class="modal-content">
			      <div class="modal-header">
			        <h5 class="modal-title" id="addSelectDataLabel">${this.component.label}</h5>	
			      </div>
			      <div class="modal-body">
		      		${formTemplate}
		      		<hr class="my-4"/>
		      		<h5 class="mb-7">Files</h5>
			      	<div ref="file-cards" class="file-cards" data-inside="true">

					</div>
			      </div>
			      <div class="modal-footer">
			        <button type="button" class="btn btn-danger" ref="modal-cancel" data-bs-dismiss="modal">Cancel</button>
			        <button type="button" class="btn btn-primary" ref="modal-save" data-bs-dismiss="modal">Save</button>
			      </div>
			    </div>
			  </div>
			</div>
		`;

		return modalTemplate;
	}

	// get the form template
	getFormTemplate() {
		const template = `
			<div class="file-form">
				<div ref="form-alert" class="alert alert-danger d-none"/></div>
				<div class="form-group">
					<label for="${this.id}-file-title" class="label">Title</label>
					<input type="text" class="form-control" id="${this.id}-file-title" ref="form-title"/>
				</div>
				<div class="form-group">
					<input
						type="checkbox"
						class="file-checkbox"
						id="${this.id}-src-checkbox"
						ref="form-file-checkbox"
					/>
					<div class="file-input-main">
						<div class="file-label-group">
							<label class="file-url-label" for="${this.id}-file-src-url"
								>File</label
							>
							<label class="file-local-label" for="${this.id}-file-src-local"
								>File</label
							>
							<label
								class="file-checkbox-toggle"
								for="${this.id}-src-checkbox"
							></label>
							<span class="file-toggle-help"
								>*Select local file instead</span
							>
						</div>
						<input
							type="text"
							class="form-control file-url"
							id="${this.id}-file-src-url"
							ref="form-file-url"
						/>
						<input
							type="file"
							class="file-local"
							id="${this.id}-file-src-local"
							ref="form-file-local"
						/>
					</div>
				</div>
				<div class="form-group">
					<input
						type="checkbox"
						class="file-checkbox"
						id="${this.id}-thumbnail-checkbox"
						ref="form-thumbnail-checkbox"
					/>
					<div class="file-input-main">
						<div class="file-label-group">
							<label class="file-url-label" for="${this.id}-file-thumbnail-url"
								>Thumbnail</label
							>
							<label
								class="file-local-label"
								for="${this.id}-file-thumbnail-local"
								>Thumbnail</label
							>
							<label
								class="file-checkbox-toggle"
								for="${this.id}-thumbnail-checkbox"
							></label>
							<span class="file-toggle-help"
								>*Select local file instead</span
							>
						</div>
						<input
							type="text"
							class="form-control file-url"
							id="${this.id}-file-thumbnail"
							ref="form-thumbnail-url"
						/>
						<input
							type="file"
							class="file-local"
							id="${this.id}-file-thumbnail"
							ref="form-thumbnail-local"
						/>
					</div>
				</div>
				<button class="btn btn-primary" ref="form-submit">Add file</button>
				<button class="btn btn-danger" ref="form-cancel">Cancel</button>
			</div>
		`;

		return template;
	}

	// --------------------------------------
	// ------ END: CUSTOM METHOds ---------
	// --------------------------------------
}

export default FileModal;
