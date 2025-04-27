export const quickSort = `// Quick Sort Implementation
function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      // Swap elements
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  
  // Place pivot in correct position
  let temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  
  return i + 1;
}

function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

// Initialize array
let array = [64, 34, 25, 12, 22, 11, 90];
quickSort(array);` 