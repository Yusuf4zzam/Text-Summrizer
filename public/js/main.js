// Get Select Box Value
let selectBox = document.querySelector("form select");

let selectBoxValue = "10";

for (let i = 1; i <= 40; i++) {
  // Create The Option Box
  let optionBox = document.createElement("option");

  // Set Value To The Option
  optionBox.value = i;

  // Set Text For The Options
  optionBox.textContent = i;

  selectBox.appendChild(optionBox);
}

selectBox.addEventListener("change", () => {
  selectBoxValue = selectBox.value;

  fileSize.textContent = `Summarize Size: ${selectBox.value} Sentences`;
});

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

    // Set BackgroundColor For Each List
    e.style.background = e.dataset.color;

    // Change Color Vaiable Value
    document.documentElement.style.setProperty(
      "--main-color",
      localStorage.getItem("main-color")
    );

    // Set Active Class To The Current List
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

// Loading Box Function
let loadingBox = document.querySelector(".loading");

window.addEventListener("load", () => {
  loadingBox.classList.add("active");

  setTimeout(() => loadingBox.remove(), 1000);
});

// Input Toggle
let inputTextBtn = document.querySelector("label.text-input");
let inputTextContainer = document.querySelector(".input-container");
let inputMaxLength = document.querySelector(".input-container span");
let errorHandler = document.querySelector(".error-handler");
let textareaValue = document.querySelector(".input-container textarea");

inputTextBtn.addEventListener("click", () => {
  output.classList.remove("active");

  outputContent.classList.remove("active");

  if (inputFile.files.length == 0) {
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

  outputContent.classList.remove("active");

  if (inputFile.files.length == 0) {
    errorHandler.classList.remove("active");
  }
});

let submitButtonContainer = document.querySelector(".submit-container");
let regexSentences = /\w+(\.|\?)/gi;
let inputLength;

textareaValue.addEventListener("input", function () {
  inputLength = this.value.split(" ").join("").match(regexSentences);

  if (inputLength != null && inputLength.length > 0) {
    inputMaxLength.textContent = `Sentences Count (${inputLength.length})`;
  } else {
    inputMaxLength.textContent = `Sentences Count (0)`;
  }

  // Check If The User Filled Text Or File
  if (inputLength != null && inputLength.length >= 15) {
    submitButtonContainer.classList.add("active");
  } else {
    submitButtonContainer.classList.remove("active");
  }
});

// File Input Function
let inputFile = document.querySelector(".file-container input");
let fileDetails = document.querySelector(".file-details");
let fileName = document.querySelector(".file-details .file-name");
let fileSize = document.querySelector(".file-details .file-size");

inputFile.addEventListener("change", () => {
  output.classList.remove("active");

  fileDetails.classList.remove("active");

  if (inputFile.files.length == 0) {
    removeAndAddActive([submitButtonContainer], "remove");
  } else {
    textareaValue.value = "";

    fileName.textContent = `File Name: ${inputFile.files[0].name}`;

    fileSize.textContent = `Summarize Size: ${selectBoxValue} Sentences`;

    outputContent.textContent = "";

    removeAndAddActive([submitButtonContainer, fileDetails], "add");
  }
});

// Submit Button Click Event
let submitinputTextBtn = document.querySelector(".submit-container input");

submitinputTextBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  let dataText;

  let finallDataText;

  removeAndAddActive([errorHandler, outputContent], "remove");

  if (inputFile.files[0]) {
    // Text Files
    if (inputFile.files[0].type == "text/plain") {
      let fr = new FileReader();

      let SentencesCount;

      fr.onload = function () {
        SentencesCount = fr.result.split(" ").join("").match(regexSentences);

        if (SentencesCount.length <= selectBoxValue) {
          errorHandler.classList.add("active");

          errorHandler.textContent =
            "The Selected Sentences Count Cannot Be Bigger Than Or Equal To The Uploaded Sentences";
        } else {
          dataText = fr.result;

          inputFile.value = "";

          removeAndAddActive([submitButtonContainer, fileDetails], "remove");

          let formdata = new FormData();
          formdata.append("key", "cba95b0a948bea81138fcaba921fee5f");
          formdata.append("txt", dataText);
          formdata.append("sentences", selectBoxValue);

          let requestOptions = {
            method: "post",
            body: formdata,
            redirect: "follow",
          };

          fetch(
            "https://api.meaningcloud.com/summarization-1.0",
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => {
              removeAndAddActive([output], "add");

              outputContent.textContent = JSON.parse(result).summary;
            });
        }
      };

      fr.readAsText(inputFile.files[0]);
    }

    // PDF Files
    else {
      let formData = new FormData();
      formData.append("inputFile", inputFile.files[0]);

      let SentencesCount;

      await fetch("/extract-text", {
        method: "post",

        body: formData,
      })
        .then((res) => res.text())
        .then((data) => {
          SentencesCount = data.split(" ").join("").match(regexSentences);

          dataText = data;
        });

      if (SentencesCount.length <= selectBoxValue) {
        errorHandler.classList.add("active");

        errorHandler.textContent =
          "The Selected Sentences Count Cannot Be Bigger Than Or Equal To The Uploaded Sentences";
      } else {
        let formdata = new FormData();
        formdata.append("key", "cba95b0a948bea81138fcaba921fee5f");
        formdata.append("txt", dataText);
        formdata.append("sentences", selectBoxValue);

        let requestOptions = {
          method: "post",
          body: formdata,
          redirect: "follow",
        };

        await fetch(
          "https://api.meaningcloud.com/summarization-1.0",
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            finallDataText = JSON.parse(result).summary;
          });

        outputContent.textContent = finallDataText;

        output.classList.add("active");

        inputFile.value = "";
      }
    }
  } else {
    removeAndAddActive([submitButtonContainer, inputTextContainer], "remove");

    let formdata = new FormData();
    formdata.append("key", "cba95b0a948bea81138fcaba921fee5f");
    formdata.append("txt", textareaValue.value);
    formdata.append("sentences", selectBoxValue);

    let requestOptions = {
      method: "post",
      body: formdata,
      redirect: "follow",
    };

    await fetch(
      "https://api.meaningcloud.com/summarization-1.0",
      requestOptions
    )
      .then((response) => response.text())
      .then(
        (result) => (outputContent.textContent = JSON.parse(result).summary)
      );

    textareaValue.value = "";

    inputMaxLength.textContent = "0/3000";

    output.classList.add("active");
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
let cancelButton = document.querySelector(".cancel-button button");

cancelButton.addEventListener("click", (e) => {
  e.preventDefault();
  cancelAndClose();
});

// See More Button Function
let seeMoreBtn = document.querySelector(".output .content button");

seeMoreBtn.addEventListener("click", () => {
  outputContent.classList.toggle("active");

  if (outputContent.classList.contains("active")) {
    seeMoreBtn.textContent = "See Less";
  } else {
    seeMoreBtn.textContent = "See More";
  }
});
