const emailInput = document.getElementById("emailInput");
const result = document.getElementById("result");
let spamCount = 0;
let notSpamCount = 0;
let correctCount = 0;
let totalCount = 0;

const classificationChart = document.getElementById("classificationChart");

const chart = new Chart(classificationChart, {
  type: "bar",
  data: {
    labels: ["Spam", "Not Spam"],
    datasets: [
      {
        label: "Email Classification",
        data: [spamCount, notSpamCount],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(75, 192, 192, 0.6)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
      {
        label: "Correctness Score",
        data: [0],
        type: "line",
        fill: false,
        borderColor: "rgba(153, 102, 255, 1)",
        pointBackgroundColor: "rgba(153, 102, 255, 1)",
        yAxisID: "y1",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        beginAtZero: true,
        max: 100,
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        displayColors: false,
      },
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
  },
});

async function checkEmailClassification(email) {
  try {
    const response = await fetch("/api/classify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Error classifying email");
    }

    const { classification } = await response.json();
    return classification;
  } catch (error) {
    console.error(error);
    return null;
  }
}

document.getElementById("generateSpam").onclick = async function () {
  if (this.classList.contains("disabled")) {
    return;
  }
  this.classList.add("active");
  this.classList.add("disabled");
  const email = await fetch("/api/generate-spam").then((res) => res.json());
  const classification = await checkEmailClassification(email.email);
  console.log(classification);
  const correctness = classification === "TRUE" ? "Correct" : "Incorrect";
  addEmailToTable(email.email, "Spam", classification, correctness);
  totalCount++;
  if (classification === "TRUE") {
    spamCount++;
    correctCount++;
  }
  chart.data.datasets[0].data = [spamCount, notSpamCount];
  chart.data.datasets[1].data = [(correctCount / totalCount) * 100];
  chart.update();
  this.classList.remove("active");
  this.classList.remove("disabled");
};

document.getElementById("generateNotSpam").onclick = async function () {
  if (this.classList.contains("disabled")) {
    return;
  }
  this.classList.add("active");
  this.classList.add("disabled");
  const email = await fetch("/api/generate-not-spam").then((res) => res.json());
  const classification = await checkEmailClassification(email.email);
  const correctness = classification === "FALSE" ? "Correct" : "Incorrect";
  addEmailToTable(email.email, "Not Spam", classification, correctness);
  totalCount++;
  if (classification === "FALSE") {
    notSpamCount++;
    correctCount++;
  }
  chart.data.datasets[0].data = [spamCount, notSpamCount];
  chart.data.datasets[1].data = [(correctCount / totalCount) * 100];
  chart.update();
  this.classList.remove("active");
  this.classList.remove("disabled");
};

function addEmailToTable(email, type, aiGuess, correctness) {
  const emailTableBody = document.getElementById("emailTableBody");
  const newRow = emailTableBody.insertRow();

  const emailCell = newRow.insertCell(0);
  const typeCell = newRow.insertCell(1);
  const aiGuessCell = newRow.insertCell(2); // Add this line
  const correctnessCell = newRow.insertCell(3);

  emailCell.textContent = email;
  typeCell.textContent = type;
  aiGuessCell.textContent = aiGuess === "TRUE" ? "Spam" : "Not Spam"; // Add this line
  correctnessCell.textContent = correctness;
}

document.getElementById("uploadCsvBtn").onclick = function () {
  document.getElementById("csvInputContainer").style.display = "block";
};

async function processCsvFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileContent = event.target.result;
      const lines = fileContent.trim().split("\n");
      // Detect the delimiter by checking the first line
      const delimiter = lines[0].includes("\t") ? "\t" : ",";

      for (const line of lines) {
        const [email, expectedType] = line.split(delimiter);
        const classification = await checkEmailClassification(email);
        const expectedClassification =
          expectedType.trim() === "spam" ? "TRUE" : "FALSE";
        const correctness =
          classification === expectedClassification ? "Correct" : "Incorrect";
        addEmailToTable(email, expectedType, classification, correctness);
        totalCount++;
        if (correctness === "Correct") {
          correctCount++;
          if (classification === "TRUE") {
            spamCount++;
          } else {
            notSpamCount++;
          }
        }
        chart.data.datasets[0].data = [spamCount, notSpamCount];
        chart.data.datasets[1].data = [(correctCount / totalCount) * 100];
        chart.update();
      }
      resolve();
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

document.getElementById("processCsvBtn").onclick = async function () {
  const csvInput = document.getElementById("csvInput");
  if (csvInput.files.length === 0) {
    alert("Please select a CSV file.");
    return;
  }
  const file = csvInput.files[0];
  this.classList.add("disabled");
  await processCsvFile(file);
  this.classList.remove("disabled");
};

// Disable buttons while loading
document.getElementById("generateSpam").onclick = async function () {
  if (this.classList.contains("disabled")) {
    return;
  }
  this.classList.add("active");
  this.classList.add("disabled");
  const email = await fetch("/api/generate-spam").then((res) => res.json());
  const classification = await checkEmailClassification(email.email);
  console.log(classification);
  const correctness = classification === "TRUE" ? "Correct" : "Incorrect";
  addEmailToTable(email.email, "Spam", classification, correctness);
  totalCount++;
  if (classification === "TRUE") {
    spamCount++;
    correctCount++;
  }
  chart.data.datasets[0].data = [spamCount, notSpamCount];
  chart.data.datasets[1].data = [(correctCount / totalCount) * 100];
  chart.update();
  this.classList.remove("active");
  this.classList.remove("disabled");
};

document.getElementById("generateNotSpam").onclick = async function () {
  if (this.classList.contains("disabled")) {
    return;
  }
  this.classList.add("active");
  this.classList.add("disabled");
  const email = await fetch("/api/generate-not-spam").then((res) => res.json());
  const classification = await checkEmailClassification(email.email);
  const correctness = classification === "FALSE" ? "Correct" : "Incorrect";
  addEmailToTable(email.email, "Not Spam", classification, correctness);
  totalCount++;
  if (classification === "FALSE") {
    notSpamCount++;
    correctCount++;
  }
  chart.data.datasets[0].data = [spamCount, notSpamCount];
  chart.data.datasets[1].data = [(correctCount / totalCount) * 100];
  chart.update();
  this.classList.remove("active");
  this.classList.remove("disabled");
};

function addEmailToTable(email, type, aiGuess, correctness) {
  const emailTableBody = document.getElementById("emailTableBody");
  const newRow = emailTableBody.insertRow();

  const emailCell = newRow.insertCell(0);
  const typeCell = newRow.insertCell(1);
  const aiGuessCell = newRow.insertCell(2); // Add this line
  const correctnessCell = newRow.insertCell(3);

  emailCell.textContent = email;
  typeCell.textContent = type;
  aiGuessCell.textContent = aiGuess === "TRUE" ? "Spam" : "Not Spam"; // Add this line
  correctnessCell.textContent = correctness;
}

document.getElementById("uploadCsvBtn").onclick = function () {
  document.getElementById("csvInputContainer").style.display = "block";
};

async function processCsvFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileContent = event.target.result;
      const lines = fileContent.trim().split("\n");
      // Detect the delimiter by checking the first line
      const delimiter = lines[0].includes("\t") ? "\t" : ",";

      for (const line of lines) {
        const [email, expectedType] = line.split(delimiter);
        const classification = await checkEmailClassification(email);
        const expectedClassification =
          expectedType.trim() === "spam" ? "TRUE" : "FALSE";
        const correctness =
          classification === expectedClassification ? "Correct" : "Incorrect";
        addEmailToTable(email, expectedType, classification, correctness);
        totalCount++;
        if (correctness === "Correct") {
          correctCount++;
          if (classification === "TRUE") {
            spamCount++;
          } else {
            notSpamCount++;
          }
        }
        chart.data.datasets[0].data = [spamCount, notSpamCount];
        chart.data.datasets[1].data = [(correctCount / totalCount) * 100];
        chart.update(); // Add this line
      }
      resolve();
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}
