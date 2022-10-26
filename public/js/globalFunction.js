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

// Copy And Download Function
function copyDownload(e, newText, oldText) {
  e.classList.add("active");

  e.querySelector("p").textContent = newText;

  setTimeout(() => {
    e.classList.remove("active");
    e.querySelector("p").textContent = oldText;
  }, 2000);
}

// Cancel And Close Buttons Function
function cancelAndClose() {
  inputFile.value = "";

  outputContent.textContent = "";

  removeAndAddActive(
    [fileDetails, submitButtonContainer, errorHandler, output, outputContent],
    "remove"
  );
}
