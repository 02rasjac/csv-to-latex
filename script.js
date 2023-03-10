let output = document.querySelector('#latex code');
let input = document.querySelector('#csv > textarea');
let table = document.querySelector('#preview tbody');
let options = document.querySelectorAll('#options input');

input.addEventListener('input', UpdateAll);
options.forEach((node) => {
  node.addEventListener('change', UpdateCheckboxes);
});

let colChecks = [];
let rowChecks = [];
let alignment = ''; // i.e r|ccc
let colBorders = [];
let rowBorders = [];
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
for (let row = 0; row < 11; row++) {
  rowBorders.push('');
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
    case 'border':
      colChecks[0].checked = isChecked;
      colChecks[colChecks.length - 1].checked = isChecked;
      break;
    default:
      break;
  }

  UpdateColBorder();
  UpdateRowBorder();
  UpdateLatex();

  function Cols() {
    for (let i = 1; i < colBorders.length - 1; i++) {
      colChecks[i].checked = isChecked;
    }
  }
}

function UpdateColBorder() {
  for (let i = 0; i < colChecks.length; i++) {
    const isChecked = colChecks[i].checked;
    colBorders[i] = isChecked ? '|' : '';
    let cols = table.querySelectorAll(`tr:nth-child(n+2) td:nth-child(${i + 2})`);
    cols.forEach((c) => {
      if (isChecked) c.classList.add('border');
      else c.classList.remove('border');
    });
  }
}

function UpdateRowBorder() {
  for (let i = 0; i < rowChecks.length; i++) {
    const isChecked = rowChecks[i].checked;
    rowBorders[i] = isChecked ? '\\hline \n' : '';
    let cols = table.querySelectorAll(`tr:nth-child(${i + 2}) td:nth-child(n+3)`);
    cols.forEach((c) => {
      if (isChecked) c.classList.add('row-border');
      else c.classList.remove('row-border');
    });
  }
}

function UpdateData(input) {
  data = input.split('\n').map((x) => x.split(','));
}

function PrintLatex() {
  PrintBegin();

  for (let i = 0; i < data.length; i++) {
    PrintBorder(i);
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

  PrintBorder(rowBorders.length - 1);
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

  function PrintBorder(index) {
    if (rowBorders[index] !== '') {
      let row = '        ' + rowBorders[index];
      output.textContent += row;
    }
  }
}

function GenerateHTML() {
  table.textContent = '';
  CreateColChecks();
  let tempRow = document.createElement('tr');
  tempRow.appendChild(CreateCheckbox('row', 0));
  table.appendChild(tempRow);

  for (let i = 0; i < data.length; i++) {
    let row = document.createElement('tr');
    row.appendChild(CreateCheckbox('row', i + 1));
    row.appendChild(document.createElement('td'));
    for (let j = 0; j < data[i].length; j++) {
      let col = document.createElement('td');
      col.textContent = data[i][j];
      row.appendChild(col);
    }
    table.appendChild(row);
  }

  OffsetColCheckbox();
  OffsetRowCheckbox();

  function CreateColChecks() {
    let row = document.createElement('tr');
    row.appendChild(document.createElement('td'));
    colChecks = [];
    for (let i = 0; i < data[0].length + 1; i++) {
      row.appendChild(CreateCheckbox('col', i));
    }
    table.appendChild(row);
  }

  /**
   * Create a checkbox inside a column
   * @param {string} dataAttribute - Use either 'row' or 'col'.
   * @param {int} index - The current row/col index.
   * @returns {Element} \<td\> with a checkbox inside.
   */
  function CreateCheckbox(dataAttribute, index) {
    let col = document.createElement('td');
    let check = document.createElement('input');
    check.setAttribute('type', 'checkbox');
    check.setAttribute(`data-${dataAttribute}-index`, index);
    check.addEventListener('change', UpdateCheckboxes);
    if (dataAttribute === 'col') {
      colChecks.push(check);
    } else {
      rowChecks.push(check);
    }
    col.appendChild(check);
    return col;
  }

  function OffsetColCheckbox() {
    let cols = table.querySelectorAll('tr:first-child td');

    for (let i = 1; i < cols.length; i++) {
      let input = cols[i].querySelector('input');
      let offsetBy = cols[i].offsetWidth * 0.5;
      input.style.transform = `translate(${offsetBy}px)`;
    }
  }

  function OffsetRowCheckbox() {
    let cols = table.querySelectorAll('tr td:first-child');
    for (let i = 1; i < cols.length; i++) {
      let input = cols[i].querySelector('input');
      let offsetBy = cols[i].offsetHeight * 0.5;
      input.style.transform = `translate(0, ${offsetBy}px)`;
    }
  }
}
