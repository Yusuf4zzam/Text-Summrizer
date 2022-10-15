// Settings Box
let settingsIcon = document.querySelector(".settings .icon");
let settingsBox = document.querySelector(".settings");

settingsIcon.addEventListener("click", () => {
  settingsBox.classList.toggle("active");
});

// Color Switcher
let colorList = document.querySelectorAll(".settings ul.page-colors li");

colorList.forEach((e) => {
  // Remove Active Class From Each List
  if (localStorage.getItem("main-color")) {
    colorList.forEach((e) => {
      e.classList.remove("active");
    });
  }

  // Set Active Class To The Current List
  if (localStorage.getItem("main-color")) {
    document
      .querySelector(`[data-color = "${localStorage.getItem("main-color")}"]`)
      .classList.add("active");
  }

  e.addEventListener("click", (e) => {
    // Remove Active Class From Each List
    colorList.forEach((e) => {
      e.classList.remove("active");
    });

    // Add Active Class From Each List
    e.currentTarget.classList.add("active");

    // Change Color Vaiable Value
    document.documentElement.style.setProperty(
      "--main-color",
      e.currentTarget.dataset.color
    );

    // Set Color Data To The Local Storage
    localStorage.setItem("main-color", e.currentTarget.dataset.color);
  });
});

// Get The Data Color From Local Storage
if (localStorage.getItem("main-color")) {
  document.documentElement.style.setProperty(
    "--main-color",
    localStorage.getItem("main-color")
  );
}

// Loading Box
 let loadingBox = document.querySelector(".loading");

  window.addEventListener("load", () => {
  loadingBox.classList.add("active");
   setTimeout(() => loadingBox.remove(), 500);
});

// Remove Active Class Function
function removeAndAddActive(e, action) {
  if (action == "remove") {
    e.forEach((e) => {
      e.classList.remove("active");
    });
  } else {
    e.forEach((e) => {
      e.classList.add("active");
    });
  }
}

// Cancel And Close Buttons Function
function cancelAndClose() {
  fileInput.value = "";
  
  outputContent.textContent = "";
  
  removeAndAddActive(
    [fileDetails, submitButtonContainer, errorHandler, output],
    "remove"
  );
}

// Input Toggle
let inputButton = document.querySelector("label.text-input");
let inputTextContainer = document.querySelector(".input-container");
let inputMaxLength = document.querySelector(".input-container span");
let errorHandler = document.querySelector(".error-handler");
let textareaValue = document.querySelector(".input-container textarea");

inputButton.addEventListener("click", () => {
  if (fileInput.files.length == 0) {
    inputTextContainer.classList.add("active");
  } else {
    errorHandler.classList.add("active");

    errorHandler.textContent =
      "You can't put a text while a file has already been uploaded";
  }
});

let fileButton = document.querySelector(".file-label");

fileButton.addEventListener("click", () => {
  inputTextContainer.classList.remove("active");
});

let submitButtonContainer = document.querySelector(".submit-container");

textareaValue.addEventListener("input", function () {
  inputMaxLength.textContent = `${this.value.length}/3000`;

  // Check If The User Filled Text Or File
  if (this.value.length > 1000) {
    submitButtonContainer.classList.add("active");
  } else {
    submitButtonContainer.classList.remove("active");
  }
});

// File Input Function
let fileInput = document.querySelector(".file-container input");
let fileDetails = document.querySelector(".file-details");
let fileName = document.querySelector(".file-details .file-name");
let fileSize = document.querySelector(".file-details .file-size");

fileInput.addEventListener("change", () => {
  if (fileInput.files.length == 0) {
    removeAndAddActive([submitButtonContainer], "remove");
  } else {
    textareaValue.value = "";

    fileName.textContent = `File Name: ${fileInput.files[0].name}`;

    fileSize.textContent = `File Size: ${fileInput.files[0].size}KB`;

    removeAndAddActive([submitButtonContainer, fileDetails], "add");
  }
});

// Submit Button Click Event
let submitInputButton = document.querySelector(".submit-container input");

submitInputButton.addEventListener("click", (e) => {
  e.preventDefault();

  let formData = new FormData();

  // PDF Files
  if (fileInput.files[0]) {
    formData.append("pdfFile", fileInput.files[0]);

    if (fileInput.files[0].name.slice(-3) == "pdf") {
      fetch("/extract-pdf-text", {
        method: "post",

        body: formData,
      })
        .then((res) => res.text())

        .then((text) => (outputContent.textContent = text));
    }

    // Text Files
    else if (fileInput.files[0].name.slice(-3) == "txt") {
      let fr = new FileReader();

      fr.onload = function () {
        removeAndAddActive([output], "add");

        outputContent.textContent = fr.result;
      };

      fr.readAsText(fileInput.files[0]);

      fileInput.value = "";

      removeAndAddActive([submitButtonContainer, fileDetails], "remove");
    }

    // Docx Files
    else {
    }

    output.classList.add("active");
  } else {
    output.classList.add("active");

    removeAndAddActive([submitButtonContainer, inputTextContainer], "remove");

    outputContent.textContent = textareaValue.value;

    textareaValue.value = "";

    inputMaxLength.textContent = "0/3000";
  }
});

// The Output Box
let output = document.querySelector(".output");
let outputContent = document.querySelector(".output .content p");
let outputDownloadBtn = document.querySelector(".output .copy-download a");
let outputCopyBtn = document.querySelector(".output .copy");
let outputCloseBtn = document.querySelector(".output .close-button");

function download(filename, text) {
  outputDownloadBtn.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );

  outputDownloadBtn.setAttribute("download", filename);
}

outputCloseBtn.addEventListener("click", () => {
  cancelAndClose();
});

function copyDownload(e, newText, oldText) {
  e.classList.add("active");

  e.querySelector("p").textContent = newText;

  setTimeout(() => {
    e.classList.remove("active");
    e.querySelector("p").textContent = oldText;
  }, 2000);
}

outputDownloadBtn.addEventListener("click", () => {
  download("Summary Text.txt", outputContent.textContent);

  copyDownload(outputDownloadBtn, "Downloaded", "Download As Text File");
});

outputCopyBtn.addEventListener("click", () => {
  // Copy the text inside the text field
  navigator.clipboard.writeText(outputContent.textContent);

  copyDownload(outputCopyBtn, "Copied", "Copy");
});

// Cancel Input File Function
let cancelButton = document.querySelector(".cancel-button");

cancelButton.addEventListener("click", () => {
  cancelAndClose();
});
