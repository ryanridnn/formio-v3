import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./formio.css";
import "./style.css";
import { Formio, Components } from "formiojs";

// import custom components
import MultipleFileSelect from "./components/MultipleFileSelect.js";
import FileModal from "./components/FileModal.js";
import FileList from "./components/FileList.js";

import fields from "./fields";

// register custom components
Formio.use({
  components: {
    multipleFileSelect: MultipleFileSelect,
    fileModal: FileModal,
    fileList: FileList,
  },
});

// initialize form
Formio.createForm(document.getElementById("formio"), fields).then((form) => {
  const resultEl = document.querySelector(".result");

  // retrieve the max count value of multipleFileSelect component
  console.log(form.components[0].component.max);

  // giving inital value to the form
  form.submission = {
    data: {
      files: [
        {
          id: "dfjsofjhs",
          type: "image/png",
          title: "Hello world",
          file: "https://picsum.photos/id/27/300/300",
          thumbnail: "https://picsum.photos/id/27/300/300",
        },
        {
          id: "dfjsofjhs",
          type: "image/png",
          title: "Hello world",
          file: "https://picsum.photos/id/27/300/300",
          thumbnail: "https://picsum.photos/id/27/300/300",
        },
      ],
    },
  };

  // render the inital value of the form
  resultEl.innerText = JSON.stringify(form.data, null, 2);

  form.on("change", (e) => {
    // somehow the remove icon in data grid is not showing,
    // so this replace the icon
    document.querySelectorAll(".formio-button-remove-row").forEach((el) => {
      el.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    });
  });

  form.on("submit", (submission) => {
    // rendering the submitted value of the form
    resultEl.innerText = JSON.stringify(form.data, null, 2);
  });
});
