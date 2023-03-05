let output = document.querySelector('#latex code');
let input = document.querySelector('#csv > textarea');
let table = document.querySelector('#preview tbody');
input.addEventListener('input', Update);

function Update() {
  const data = ReadCSV(input.value);
  PrintLatex(data);
  GenerateHTML(data);
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
    let colPos = '';
    for (let i = 0; i < data[0].length; i++) {
      colPos += 'c';
    }
    output.textContent += `    \\begin{tabular}{${colPos}}\n`;
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
    for (let i = 0; i < data[0].length; i++) {
      let col = document.createElement('td');
      let check = document.createElement('input');
      check.setAttribute('type', 'checkbox');
      col.appendChild(check);
      row.appendChild(col);
    }
    table.appendChild(row);
  }
}
