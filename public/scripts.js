const emailInput = document.getElementById("emailInput");
const submitBtn = document.getElementById("submitBtn");

const result = document.getElementById("result");
let spamCount = 0;
let notSpamCount = 0;
let correctCount = 0;
let totalCount = 0;
submitBtn.onclick = async function () {
  const email = emailInput.value;
  if (email) {
    try {
      const response = await fetch("/classify-email", {
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
      result.innerHTML = `This email is classified as: <strong>${classification}</strong>`;

      // Update chart based on classification
      if (classification === "TRUE") {
        spamCount++;
      } else if (classification === "FALSE") {
        notSpamCount++;
      }
      chart.data.datasets[0].data = [spamCount, notSpamCount];
      chart.update();

    } catch (error) {
      result.innerHTML = "Error classifying email. Please try again later.";
    }
  } else {
    result.innerHTML = "Please enter an email message.";
  }
};


const classificationChart = document.getElementById("classificationChart");

const chart = new Chart(classificationChart, {
  type: "bar",
  data: {
    labels: ["Spam", "Not Spam"],
    datasets: [
      {
        label: "Email Classification",
        data: [spamCount, notSpamCount],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
      {
        label: "Correctness Score",
        data: [0],
        type: "line",
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        yAxisID: "y1",
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        beginAtZero: true,
        max: 110,
      },
    },
  },
});


async function checkEmailClassification(email) {
  try {
    const response = await fetch("/classify-email", {
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
  const email = await fetch("/generate-spam").then((res) => res.json());
  const classification = await checkEmailClassification(email.email);
  const correctness = classification === "TRUE" ? "Correct" : "Incorrect";
  addEmailToTable(email.email, "Spam", correctness);
  totalCount++;
  if (classification === "TRUE") {
    spamCount++;
    correctCount++;
  }
  chart.data.datasets[0].data = [spamCount, notSpamCount];
  chart.data.datasets[1].data = [(correctCount / totalCount) * 100];
  chart.update();
};

document.getElementById("generateNotSpam").onclick = async function () {
  const email = await fetch("/generate-not-spam").then((res) => res.json());
  const classification = await checkEmailClassification(email.email);
  const correctness = classification === "FALSE" ? "Correct" : "Incorrect";
  addEmailToTable(email.email, "Not Spam", correctness);
  totalCount++;
  if (classification === "FALSE") {
    notSpamCount++;
    correctCount++;
  }
  chart.data.datasets[0].data = [spamCount, notSpamCount];
  chart.data.datasets[1].data = [(correctCount / totalCount) * 100];
  chart.update();
};



addNotSpamBtn.onclick = async function () {
  try {
    const response = await fetch("/generate-not-spam");
    if (!response.ok) {
      throw new Error("Error generating non-spam email");
    }
    const { email } = await response.json();
    emailInput.value = email;
  } catch (error) {
    console.error(error);
  }
};
function addEmailToTable(email, type, correctness) {
  const emailTableBody = document.getElementById("emailTableBody");
  const newRow = emailTableBody.insertRow();

  const emailCell = newRow.insertCell(0);
  const typeCell = newRow.insertCell(1);
  const correctnessCell = newRow.insertCell(2);

  emailCell.textContent = email;
  typeCell.textContent = type;
  correctnessCell.textContent = correctness;
}
