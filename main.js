document
  .getElementById("issueInputForm")
  .addEventListener("submit", submitIssue);

  let issues = [];
  let validation = true;

// get data from local storage
function getLocalData() {
  if(!localStorage.getItem("issues")) {
    saveToLocal()
  } 
  return JSON.parse(localStorage.getItem("issues"));
}

// save data to local storage
function saveToLocal() {
  localStorage.setItem("issues", JSON.stringify(issues));
}


// validation input form
function validationForm(value, id) {
  if(value.length < 1) {
    document.getElementById(id).classList.add('error');
    document.getElementById(id).focus();

      // remove warning
    setTimeout(() => {
        document.getElementById(id).classList.remove("error");
      }, 2000);
     return false;
  }
  return true;
}

function submitIssue(e) {
  const getInputValue = (id) => document.getElementById(id).value;

  const description = getInputValue("issueDescription");
  validation = validationForm(description, "issueDescription");

  const severity = getInputValue("issueSeverity");
  validation = validationForm(severity, "issueSeverity");

  const assignedTo = getInputValue("issueAssignedTo");
  validation = validationForm(assignedTo, "issueAssignedTo");

  const id = Math.floor(Math.random() * 100000000) + "";
  const status = "Open";

  const issue = { id, description, severity, assignedTo, status };
  
  if (localStorage.getItem("issues")) {
    issues = JSON.parse(localStorage.getItem("issues"));
  }

  if(validation) {

    issues.push(issue);
    saveToLocal()
  }

  document.getElementById("issueInputForm").reset();
  fetchIssues();
  e.preventDefault();
}

const closeIssue = (id) => {
  issues = getLocalData()
  let currentIssue = issues.find((issue) => issue.id === id);
  currentIssue.status = "Closed";
  saveToLocal()
  fetchIssues();
};

const deleteIssue = (id) => {
  issues = getLocalData()
  const remainingIssues = issues.filter(issue => {
    return issue.id !== id
  });
  // console.log(remainingIssues)
  localStorage.setItem("issues", JSON.stringify(remainingIssues));

  // fetchIssues
  fetchIssues()
};

const fetchIssues = () => {
  const issues = getLocalData()
  const issuesList = document.getElementById("issuesList");
  issuesList.innerHTML = "";

  for (var i = 0; i < issues.length; i++) {
    const { id, description, severity, assignedTo, status } = issues[i];

    issuesList.innerHTML += `<div class="well">
                              <h6>Issue ID: ${id} </h6>
                              <p><span class="label label-info"> ${status} </span></p>
                              <h3> ${description} </h3>
                              <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                              <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                              <a href="#" onclick="closeIssue('${id}')" class="btn btn-warning">Close</a>
                              <a href="#" onclick="deleteIssue('${id}')" class="btn btn-danger">Delete</a>
                              </div>`;
  }
};
