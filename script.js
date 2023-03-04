let input = document.querySelector('#csv > textarea');
input.textContent = `a,b
1,2
3,4`;
let output = document.querySelector('#latex code');

console.log(input.textContent);

function ReadCSV() {
  let test = input.textContent.split('\n').map((x) => x.split(','));
  console.log(test);

  for (let i = 0; i < test.length; i++) {
    let row = '        ';
    for (let j = 0; j < test[i].length; j++) {
      row += test[i][j];
      if (j < test[i].length - 1) {
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
ReadCSV();
output.textContent += `    \\end{tabular}
\\end{table}
`;
