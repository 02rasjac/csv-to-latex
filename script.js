let output = document.querySelector('#latex code');
let input = document.querySelector('#csv > textarea');
input.addEventListener('input', Update);

function Update() {
  PrintLatex(ReadCSV(input.value));
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
