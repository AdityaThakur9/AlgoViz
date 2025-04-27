export interface Algorithm {
  name: string
  code: string
  description: string
}

export const algorithms: Algorithm[] = [
  {
    name: 'Bubble Sort',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    code: `// Initialize array
arr = [64, 34, 25, 12, 22, 11, 90];
pushStep(1, 'Array initialized');

const n = arr.length;
for (let i = 0; i < n - 1; i++) {
  for (let j = 0; j < n - i - 1; j++) {
    comparing = [j, j + 1];
    pushStep(6, \`Comparing \${arr[j]} and \${arr[j + 1]}\`);
    
    if (arr[j] > arr[j + 1]) {
      swapping = [j, j + 1];
      pushStep(9, \`Swapping \${arr[j]} and \${arr[j + 1]}\`);
      
      // Swap elements
      const temp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = temp;
      
      swapping = [];
      pushStep(15, \`Swapped \${arr[j]} and \${arr[j + 1]}\`);
    }
    comparing = [];
  }
}`
  },
  {
    name: 'Selection Sort',
    description: 'A sorting algorithm that repeatedly finds the minimum element from the unsorted part and puts it at the beginning.',
    code: `// Initialize array
arr = [64, 34, 25, 12, 22, 11, 90];
pushStep(1, 'Array initialized');

const n = arr.length;
for (let i = 0; i < n - 1; i++) {
  let minIdx = i;
  
  for (let j = i + 1; j < n; j++) {
    comparing = [minIdx, j];
    pushStep(8, \`Comparing \${arr[minIdx]} and \${arr[j]}\`);
    
    if (arr[j] < arr[minIdx]) {
      minIdx = j;
      pushStep(11, \`Found new minimum \${arr[j]} at index \${j}\`);
    }
    comparing = [];
  }
  
  if (minIdx !== i) {
    swapping = [i, minIdx];
    pushStep(18, \`Swapping \${arr[i]} and \${arr[minIdx]}\`);
    
    // Swap elements
    const temp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = temp;
    
    swapping = [];
    pushStep(24, \`Swapped \${arr[i]} and \${arr[minIdx]}\`);
  }
}`
  },
  {
    name: 'Insertion Sort',
    description: 'A sorting algorithm that builds the final sorted array one item at a time.',
    code: `// Initialize array
arr = [64, 34, 25, 12, 22, 11, 90];
pushStep(1, 'Array initialized');

const n = arr.length;
for (let i = 1; i < n; i++) {
  const key = arr[i];
  let j = i - 1;
  
  comparing = [i, j];
  pushStep(8, \`Comparing key \${key} with \${arr[j]}\`);
  
  while (j >= 0 && arr[j] > key) {
    swapping = [j + 1, j];
    pushStep(11, \`Moving \${arr[j]} to position \${j + 1}\`);
    
    arr[j + 1] = arr[j];
    j--;
    
    swapping = [];
    comparing = [i, j];
    if (j >= 0) {
      pushStep(17, \`Comparing key \${key} with \${arr[j]}\`);
    }
  }
  
  arr[j + 1] = key;
  pushStep(22, \`Inserted \${key} at position \${j + 1}\`);
  comparing = [];
}`
  }
] 