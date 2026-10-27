const addButton = document.getElementById("add-btn");
const totalApp = document.getElementById("total-apps");
const appList = document.getElementById("app-list");

const modal = document.getElementById("modal-overlay");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

let applicationsData = [];

// 1. Check if data exists in memory
let savedData = localStorage.getItem("applyTrackData");

// 2. If data exists, parse it and loop through it
if (savedData) {
  // Turn the text back into a real array
  applicationsData = JSON.parse(savedData);
  totalApp.textContent = applicationsData.length;
  appList.innerHTML = "";

  // Loop through each saved application
  applicationsData.forEach((app) => {
    // Setup the correct badge class and text based on app.status
    let badgeClass = "";
    let badgeText = "";

    if (app.status === "applied") {
      badgeClass = "applied-badge";
      badgeText = "Applied";
    } else if (app.status === "interview") {
      badgeClass = "interview-badge";
      badgeText = "Interview";
    }

    // Create the HTML string using the saved data (app.company, app.role)
    let rowHtml = `
        <li class="app-row" data-id="${app.id}">
          <div class="company-info">
            <p class="company-name">${app.company}</p>
            <p class="job-role">${app.role}</p>
          </div>
          <div class="badge-container">
           <div class="badge ${badgeClass}">${badgeText}</div>
           <button class="delete-btn" type="button"> 
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x preview-icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
          </div>
        </li>
        `;

    // Inject it into the list just like you did in your save button!
    appList.insertAdjacentHTML("beforeend", rowHtml);
  });
}

addButton.addEventListener("click", () => {
  modal.style.display = "flex";
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

saveBtn.addEventListener("click", () => {
  let companyName = document.getElementById("company-input").value.trim();
  let jobRole = document.getElementById("role-input").value.trim();
  let applicationStatus = document.getElementById("status-input").value;

  let badgeClass = "";
  let badgeText = "";

  if (applicationStatus === "applied") {
    badgeClass = "applied-badge";
    badgeText = "Applied";
  } else if (applicationStatus === "interview") {
    badgeClass = "interview-badge";
    badgeText = "Interview";

    // Select the Interview stat card and add 1
    let interviewStat = document.querySelector(".color-purple");
    interviewStat.textContent = parseInt(interviewStat.textContent) + 1;
  } else if (applicationStatus === "offer") {
    // You will need to create the CSS class for an 'offer-badge' later!
    badgeClass = "offer-badge";
    badgeText = "Offer";

    // Select the Offer stat card and add 1
    let offerStat = document.querySelector(".color-green");
    offerStat.textContent = parseInt(offerStat.textContent) + 1;
  }
  const onlyLettersPattern = /^[a-zA-Z\s]+$/;

  if (companyName === "" || jobRole === "") {
    alert("Please fill out both the Company Name and the Job Role.");
    return; // Stops the function!
  }

  if (
    !onlyLettersPattern.test(companyName) ||
    !onlyLettersPattern.test(jobRole)
  ) {
    alert(
      "Please use only letters for the Company Name and Job Role. Numbers and symbols are not allowed.",
    );
    return; // Stops the function!
  }

  const newApplication = {
    id: Date.now(),
    company: companyName,
    role: jobRole,
    status: applicationStatus,
  };
  // Push the new object into your array
  applicationsData.push(newApplication);
  // Convert the array to a text string and save it to the browser's memory
  localStorage.setItem("applyTrackData", JSON.stringify(applicationsData));

  let currentText = totalApp.textContent;
  let currentNumber = parseInt(currentText);
  totalApp.textContent = currentNumber + 1;

  let newRowHtml = `
    <li class="app-row" data-id="${newApplication.id}">
      <div class="company-info">
        <p class="company-name">${companyName}</p>
        <p class="job-role">${jobRole}</p>
      </div>
      
      <div class="badge-container">
        <div class="badge ${badgeClass}">${badgeText}</div>
        <button class="delete-btn" type="button">Delete</button>
      </div>
    </li>
    `;
  appList.insertAdjacentHTML("afterbegin", newRowHtml);

  document.getElementById("company-input").value = "";
  document.getElementById("role-input").value = "";
  modal.style.display = "none";
});

appList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-btn");

  if (!deleteButton) {
    return;
  }

  const row = deleteButton.closest(".app-row");
  const applicationId = row.dataset.id;

  row.remove();
  applicationsData = applicationsData.filter(
    (application) => String(application.id) !== applicationId,
  );
  localStorage.setItem("applyTrackData", JSON.stringify(applicationsData));
  totalApp.textContent = applicationsData.length;
});
