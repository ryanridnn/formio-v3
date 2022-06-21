import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./formio.css";
import "./style.css";
import { Formio, Components } from "formiojs";

import MultipleFileSelect from "./components/MultipleFileSelect.js";
import FileModal from "./components/FileModal.js";
import FileList from "./components/FileList.js";

import fields from "./fields";

Formio.use({
  components: {
    multipleFileSelect: MultipleFileSelect,
    fileModal: FileModal,
    fileList: FileList,
  },
});

Formio.createForm(document.getElementById("formio"), fields).then((form) => {
  const resultEl = document.querySelector(".result");

  console.log(form.components[0].component.max);

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

  document.querySelector("#while").onclick = () => {
    console.log(form);
  };

  document.querySelectorAll(".formio-button-remove-row").forEach((el) => {
    el.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  });

  resultEl.innerText = JSON.stringify(form.data, null, 2);

  form.on("change", (e) => {
    document.querySelectorAll(".formio-button-remove-row").forEach((el) => {
      el.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    });
    // console.log(e.changed);
  });

  form.on("submit", (submission) => {
    resultEl.innerText = JSON.stringify(form.data, null, 2);
  });
});
