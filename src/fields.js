// form schema
export default {
	components: [
		{
			type: "multipleFileSelect",
			label: "Select files",
			key: "files",
			max: 4,
			validate: {
				required: true,
			},
		},
		{
			label: "Projects",
			reorder: false,
			addAnotherPosition: "bottom",
			layoutFixed: false,
			enableRowGroups: false,
			initEmpty: false,
			tableView: false,
			defaultValue: [{}],
			key: "projects",
			type: "datagrid",
			input: true,
			validate: {
				required: true,
			},
			components: [
				{
					type: "multipleFileSelect",
					label: "Select files",
					key: "files",
					max: 4,
				},
				{
					label: "Project",
					placeholder: "Enter project name...",
					tableView: true,
					key: "project",
					type: "textfield",
					input: true,
				},
			],
		},
		{
			type: "button",
			label: "Submit",
			key: "submit",
			disableOnInvalid: true,
			input: true,
			tableView: false,
		},
	],
};
