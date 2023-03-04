let output = document.querySelector('#latex code');

function ReadCSV() {
  let input = document.querySelector('#csv > textarea');
  //! Testing only
  input.textContent = `a,b
1,2
3,4`;

  return input.textContent.split('\n').map((x) => x.split(','));
}

function PrintLatex(data) {
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
}

output.textContent = `\\begin{table}[!ht]
    \\begin{tabular}
`;
PrintLatex(ReadCSV());
output.textContent += `    \\end{tabular}
\\end{table}
`;
