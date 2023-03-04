let input = document.querySelector('#csv > textarea');
input.textContent = `a,b
1,2
3,4`;

console.log(input.textContent);

function ReadCSV() {
  let test = input.textContent.split('\n');
  console.log(test);
}

ReadCSV();
