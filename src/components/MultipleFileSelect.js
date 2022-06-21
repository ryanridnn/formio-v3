import { Components } from "formiojs";
import { v4 } from "uuid";

const MultiValue = Components.components.multivalue;

class MultipleFileSelect extends MultiValue {
	// ------------------------------------
	// ------ START: MAIN METHOds ---------
	// ------------------------------------

	// Methods in "MAIN METHODS" are required by Form io

	constructor(component, options, data) {
		super(component, options, data);
		this.component.multiple = true;

		// Files always has the same value with the value in the kry given in the component object
		// But it is not changed, when the value in the popup changed, whether addition, deletion, update happens
		// Eventually, It will be renewed when the popup is submitted
		this.files = [];

		// this will store temporary value when popup inputs are changing it's value
		// when user submit the popup, the this.files value will be assigned with the this.tempFiles
		this.tempFiles = [];

		this.modalId = this.id;
		this.editingId = null;
	}

	// It will called when th4e form needed to render the from

	render() {
		// This is using another components, the fileModal custom components and fileList custom components
		const well = new Components.components.well({
			type: "well",
			customClass: "csfile",
			component: this.component,
			components: [
				{
					type: "fileModal",
					label: this.component.label,
					data: this.component.data,
					modalId: this.modalId,
				},
				{
					type: "fileList",
				},
			],
		});

		return well.render();
	}

	// this is called after render methods
	// maily use to retrieve refs and passing event listener to refs

	attach(element) {
		// The refs are being grouped, to tidy up and organize
		let refs = {
			"file-cards": "mutiple",
		};

		const modalrefs = {
			"modal-open": "single",
			"modal-save": "single",
			"modal-cancel": "single",
		};

		const formrefs = {
			"form-alert": "single",
			"form-title": "single",
			"form-file-checkbox": "single",
			"form-file-url": "single",
			"form-file-local": "single",
			"form-thumbnail-checkbox": "single",
			"form-thumbnail-url": "single",
			"form-thumbnail-local": "single",
			"form-cancel": "single",
			"form-submit": "single",
		};

		refs = { ...refs, ...modalrefs, ...formrefs };

		// loading refs
		this.loadRefs(element, refs);

		// setuping components: Passing event listeners, etc
		this.setup();

		return super.attach(element);
	}

	getValue() {
		return this.files;
	}

	// It will be called when the user give default values to the form
	setValue(value) {
		if (value === null) value = [];
		if (value[0] === null) value = [];

		this.files = value;
		this.tempFiles = value;
		this.renderFileCards();
	}

	// ------------------------------------
	// ------ END: MAIN METHOds -----------
	// ------------------------------------

	// --------------------------------------
	// ------ START: CUSTOM METHOds ---------
	// -------------------------------------

	// It calls various methods for setuping each different elements group
	setup() {
		this.setupVar();
		this.setupModalElements();
		this.setupFormElements();
		this.setupFileCardsElements();
	}

	// Make different properties in the object to avoid using this.refs
	// this.refs. needed brackets to access it, so it's not quite clean
	// however you can change this behaviour by passing the refs in component
	//   as camelCases, snake_case, or another case without dash(-) a

	setupVar() {
		this.fileElements = {
			cards: this.refs["file-cards"],
		};

		this.modal = {
			open: this.refs["modal-open"],
			save: this.refs["modal-save"],
			cancel: this.refs["modal-cancel"],
		};

		this.form = {
			alert: this.refs["form-alert"],
			title: this.refs["form-title"],
			fileCheckbox: this.refs["form-file-checkbox"],
			fileUrl: this.refs["form-file-url"],
			fileLocal: this.refs["form-file-local"],
			thumbnailCheckbox: this.refs["form-thumbnail-checkbox"],
			thumbnailUrl: this.refs["form-thumbnail-url"],
			thumbnailLocal: this.refs["form-thumbnail-local"],
			formCancel: this.refs["form-cancel"],
			formSubmit: this.refs["form-submit"],
		};
	}

	// mainly, this add event listeners to modal element
	setupModalElements() {
		// do task when MODAL OPEN BUTTON is clicked
		this.modal.open.onclick = () => {
			// setting temp files to current files values
			this.tempFiles = [...this.files];

			// resetting values
			this.editingId = null;
			this.resetFormValue();

			// render the file cards
			this.renderFileCards();
		};

		// do task when MODAL OPEN SAVE is clicked
		this.modal.save.onclick = () => {
			// save the changes in the popup inputs
			this.files = [...this.tempFiles];

			// resetting editing id
			this.editingId = null;
			this.renderFileCards();

			// This methods set the current value of the given key with the files value
			this.data[this.component.key] = this.files.map((file) => {
				// Due to form io is cannot accepting File object, we must convert files with base64 string instead
				const item = file;

				if (file.file.src) {
					item.file = file.file.base64;
					item.localfile = true;
				} else {
					item.localfile = false;
				}
				if (file.thumbnail.src) {
					item.thumbnail = file.thumbnail.base64;
					item.localThumbnail = true;
				} else {
					item.localThumbnail = false;
				}
				return item;
			});
		};

		// do task when MODAL CANCEL BUTTON is clicked
		this.modal.cancel.onclick = () => {
			this.tempFiles = [...this.files];
			this.editingId = null;
			this.data[this.component.key] = this.files;
		};
	}

	setupFormElements() {
		this.setButtonState();

		this.form.formCancel.classList.add("d-none");

		// add event listener to check if button should be disabled or not
		// If it is pretty cluttered, we can use an array loop then passing the onclick within it
		this.form.title.oninput = () => {
			this.setButtonState();
		};

		this.form.fileUrl.oninput = () => {
			this.setButtonState();
		};

		this.form.fileLocal.oninput = () => {
			this.setButtonState();
		};

		this.form.thumbnailUrl.oninput = (e) => {
			this.setButtonState();
		};

		this.form.thumbnailLocal.oninput = (e) => {
			this.setButtonState();
		};

		this.form.fileCheckbox.onclick = (e) => {
			this.form.fileUrl.value = null;
			this.form.fileLocal.value = null;
			this.setButtonState();
		};

		this.form.thumbnailCheckbox.onclick = (e) => {
			this.form.thumbnailUrl.value = null;
			this.form.thumbnailLocal.value = null;
			this.setButtonState();
		};

		this.form.formCancel.onclick = (e) => {
			this.editingId = null;

			this.resetFormValue();

			this.form.formSubmit.innerText = "Add file";
			this.form.formCancel.classList.add("d-none");

			this.renderFileCards();
		};

		this.form.formSubmit.onclick = async () => {
			if (
				this.component.max &&
				this.tempFiles.length === this.component.max &&
				this.editingId === null
			) {
				this.showAlert(
					`Oops! Can't insert more than ${this.component.max} ${
						this.component.max > 1 ? "files" : "file"
					}.`,
					5
				);

				return;
			}

			const formValue = this.getFormValue();

			if (
				formValue.thumbnail.type &&
				formValue.thumbnail.type.split("/")[0] !== "image"
			) {
				this.showAlert("Oops! Thumbnail file format is invalid.", 5);
				return;
			}

			const type = formValue.file.type
				? formValue.file.type
				: "external-file";

			const id = v4();

			let file;
			let thumbnail;

			if (formValue.file.type) {
				file = {
					src: formValue.file,
					base64: await this.convertFile(formValue.file),
				};
			} else {
				file = formValue.file;
			}

			if (formValue.thumbnail.type) {
				thumbnail = {
					src: formValue.thumbnail,
					base64: await this.convertFile(formValue.thumbnail),
				};
			} else {
				thumbnail = formValue.thumbnail;
			}

			if (this.editingId) {
				const fileIndex = this.tempFiles.findIndex(
					(file) => file.id === this.editingId
				);
				this.tempFiles[fileIndex] = {
					id,
					type,
					...formValue,
					file,
					thumbnail,
				};

				this.form.formSubmit.innerText = "Add file";
				this.form.formCancel.classList.add("d-none");
				this.editingId = null;
			} else {
				this.tempFiles = [
					...this.tempFiles,
					{
						id,
						type,
						...formValue,
						file,
						thumbnail,
					},
				];
			}

			this.renderFileCards();
			this.resetFormValue();
		};
	}

	setupFileCardsElements() {
		this.fileElements.cards.forEach((fileCards) => {
			fileCards.onclick = (e) => {
				if (e.target.classList.contains("file-card-remove")) {
					this.removeFile(e.target.dataset.id);
				} else if (e.target.classList.contains("file-card")) {
					this.setUpdate(e.target.dataset.id);
				}
			};
		});

		this.renderFileCards();
	}

	getFormValue() {
		const title = this.form.title.value;
		let file = this.form.fileUrl.value || this.form.fileLocal.files[0];
		let thumbnail =
			this.form.thumbnailUrl.value || this.form.thumbnailLocal.files[0];
		file = !file ? null : file;
		thumbnail = !thumbnail ? null : thumbnail;

		return {
			title,
			file,
			thumbnail,
		};
	}

	setButtonState() {
		const { title, file, thumbnail } = this.getFormValue();

		if (title.length === 0 || !file || !thumbnail) {
			this.form.formSubmit.disabled = true;
		} else {
			this.form.formSubmit.disabled = false;
		}
	}

	setUpdate(id) {
		this.editingId = id;

		this.form.formSubmit.innerText = "Update";
		this.form.formCancel.classList.remove("d-none");

		this.renderFileCards();

		this.fillForm(this.tempFiles.find((file) => file.id === id));
	}

	fillForm(data) {
		this.form.title.value = data.title;
		if (!data.file.src) {
			this.form.fileUrl.value = data.file;
		}

		if (!data.thumbnail.src) {
			this.form.thumbnailUrl.value = data.thumbnail;
		}
	}

	resetFormValue() {
		this.form.title.value = null;
		this.form.fileUrl.value = null;
		this.form.fileLocal.value = null;
		this.form.thumbnailUrl.value = null;
		this.form.thumbnailLocal.value = null;
		this.setButtonState();
	}

	removeFile(id) {
		this.tempFiles = this.tempFiles.filter((file) => file.id !== id);
		if (id === this.editingId) {
			this.resetFormValue();
			this.editingId = null;

			this.form.formSubmit.innerText = "Add file";
			this.form.formCancel.classList.add("d-none");
		}
		this.renderFileCards();
	}

	showAlert(message, time = 0.5) {
		this.form.alert.innerHTML = message;
		this.form.alert.classList.replace("d-none", "d-block");
		const timeout = setTimeout(() => {
			this.form.alert.classList.replace("d-block", "d-none");

			clearTimeout(timeout);
		}, time * 1000);
	}

	async convertFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	}

	renderFileCards() {
		this.fileElements.cards.forEach((filecards) => {
			if (filecards.dataset.inside === "true") {
				let template = this.getFileCardsTemplate(this.tempFiles);
				if (template === "") {
					template = `
						<div class="no-files">
							No files added yet.
						</div>
					`;
				}
				filecards.innerHTML = template;
			} else {
				filecards.classList.remove("d-none");
				if (this.files.length === 0) {
					filecards.classList.add("d-none");
					return;
				}
				const template = this.getFileCardsTemplate(this.files, true);
				filecards.innerHTML = template;
			}
		});
	}

	// ---- START: TEMPLATE GENERATOR -----

	getFileCardsTemplate(files, canOpenModal = false) {
		let template = "";

		files.forEach((file) => {
			let url;

			if (file.thumbnail.src) {
				url = file.thumbnail.base64;
			} else {
				url = file.thumbnail;
			}

			template += `
				<div class="file-card ${
					this.editingId === file.id ? "file-card-editing" : ""
				}" data-id="${file.id}" ${
				canOpenModal
					? 'data-bs-toggle="modal" data-bs-target="#' +
					  this.modalId +
					  '"'
					: ""
			}>
					<div class="file-card-inner">
						<img src="${url}"  alt="file thumbnail" />
					</div>
					<button class="file-card-remove" data-id="${
						file.id
					}"><i class="fa-solid fa-xmark"></i></button>
				</div>
			`;
		});

		return template;
	}

	// ---- END: TEMPLATE GENERATOR -----

	// --------------------------------------
	// ------ END: CUSTOM METHOds ---------
	// --------------------------------------
}

export default MultipleFileSelect;
