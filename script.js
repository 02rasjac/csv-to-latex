let output = document.querySelector('#latex code');
let input = document.querySelector('#csv > textarea');
let table = document.querySelector('#preview tbody');
let options = document.querySelectorAll('#options input');

input.addEventListener('input', Update);
options.forEach((node) => {
  node.addEventListener('change', UpdateBorder);
});

let colChecks = [];
let alignment = ''; // i.e r|ccc
let colBorders = [];

//! TESTING ONLY
for (let row = 0; row < 10; row++) {
  for (let col = 0; col < 7; col++) {
    input.value += row + col + ',';
  }
  input.value += row + 7 + '\n';
}

for (let col = 0; col < 9; col++) {
  colBorders.push('');
}
Update();
//! END OF TESTING ONLY

function Update() {
  const data = ReadCSV(input.value);
  UpdateAlignment(data);
  PrintLatex(data);
  GenerateHTML(data);
}

function UpdateAlignment(data) {
  for (let i = 0; i < data[0].length; i++) {
    alignment += 'c';
    if (i < data[0].length - 1) {
      alignment += colBorders[i + 1];
    }
  }
}

function UpdateBorder(e) {
  console.log(e.target.getAttribute('name'));
}

function ReadCSV(data) {
  return data.split('\n').map((x) => x.split(','));
}

function PrintLatex(data) {
  PrintBegin();

  for (let i = 0; i < data.length; i++) {
    let row = '        ';
    for (let j = 0; j < data[i].length; j++) {
      row += data[i][j];
      if (j < data[i].length - 1) {
        row += ' & ';
      }
    }
    row += ' \\\\\n';
    output.textContent += row;
  }

  PrintEnd();

  function PrintBegin() {
    output.textContent = '\\begin{table}[!ht]\n';
    output.textContent += '    \\centering\n';
    output.textContent += `    \\begin{tabular}{${alignment}}\n`;
  }

  function PrintEnd() {
    output.textContent += '    \\end{tabular}\n';
    output.textContent += '    \\caption{Caption}\n';
    output.textContent += '    \\label{t:table}\n';
    output.textContent += '\\end{table}';
  }
}

function GenerateHTML(data) {
  table.textContent = '';
  CreateColChecks();

  for (let i = 0; i < data.length; i++) {
    let row = document.createElement('tr');
    for (let j = 0; j < data[i].length; j++) {
      let col = document.createElement('td');
      col.textContent = data[i][j];
      row.appendChild(col);
    }
    table.appendChild(row);
  }

  function CreateColChecks() {
    let row = document.createElement('tr');
    colChecks = [];
    for (let i = 0; i < data[0].length; i++) {
      let col = document.createElement('td');
      let check = document.createElement('input');
      check.setAttribute('type', 'checkbox');
      colChecks.push(check);
      col.appendChild(check);
      row.appendChild(col);
    }
    table.appendChild(row);
    console.log(colChecks);
  }
}
