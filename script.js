let output = document.querySelector('#latex code');
let input = document.querySelector('#csv > textarea');
let table = document.querySelector('#preview tbody');
let options = document.querySelectorAll('#options input');

input.addEventListener('input', UpdateAll);
options.forEach((node) => {
  node.addEventListener('change', UpdateCheckboxes);
});

let colChecks = [];
let alignment = ''; // i.e r|ccc
let colBorders = [];
let data = [];

//! TESTING ONLY
for (let row = 0; row < 10; row++) {
  for (let col = 0; col < 7; col++) {
    input.value += row + col + ',';
  }
  input.value += row + 7;
  if (row < 9) {
    input.value += '\n';
  }
}

for (let col = 0; col < 9; col++) {
  colBorders.push('');
}
UpdateAll();
//! END OF TESTING ONLY

function UpdateAll() {
  UpdateData(input.value);
  UpdateLatex();
  GenerateHTML();
}

function UpdateLatex() {
  UpdateAlignment();
  PrintLatex();
}

function UpdateAlignment() {
  alignment = colBorders[0];
  for (let i = 0; i < data[0].length; i++) {
    alignment += 'c';
    if (i < data[0].length - 1) {
      alignment += colBorders[i + 1];
    }
  }
  alignment += colBorders[colBorders.length - 1];
}

function UpdateCheckboxes(e) {
  const name = e.target.getAttribute('name');
  const isChecked = e.target.checked;
  switch (name) {
    case 'cols':
      Cols();
      break;
    default:
      break;
  }

  UpdateBorder();
  UpdateLatex();

  function Cols() {
    for (let i = 0; i < colBorders.length; i++) {
      colChecks[i].checked = isChecked;
    }
  }
}

function UpdateBorder() {
  for (let i = 0; i < colChecks.length; i++) {
    colBorders[i] = colChecks[i].checked ? '|' : '';
  }
}

function UpdateData(input) {
  data = input.split('\n').map((x) => x.split(','));
}

function PrintLatex() {
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

function GenerateHTML() {
  table.textContent = '';
  CreateColChecks();

  for (let i = 0; i < data.length; i++) {
    let row = document.createElement('tr');
    row.appendChild(document.createElement('td'));
    for (let j = 0; j < data[i].length; j++) {
      let col = document.createElement('td');
      col.textContent = data[i][j];
      row.appendChild(col);
    }
    table.appendChild(row);
  }

  OffsetCheckbox();

  function CreateColChecks() {
    let row = document.createElement('tr');
    colChecks = [];
    for (let i = 0; i < data[0].length + 1; i++) {
      let col = document.createElement('td');
      let check = document.createElement('input');
      check.setAttribute('type', 'checkbox');
      check.setAttribute('data-col-index', i);
      check.addEventListener('change', UpdateCheckboxes);
      colChecks.push(check);
      col.appendChild(check);

      row.appendChild(col);
    }
    table.appendChild(row);
  }

  function OffsetCheckbox() {
    let cols = table.querySelector('tr').querySelectorAll('td');

    for (let i = 0; i < cols.length; i++) {
      let input = cols[i].querySelector('input');
      let offsetBy = cols[i].offsetWidth * 0.5;
      input.style.transform = `translate(${offsetBy}px)`;
    }
  }
}
