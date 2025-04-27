export const mergeSort = `// Merge Sort Implementation
function merge(arr, left, mid, right) {
  const n1 = mid - left + 1;
  const n2 = right - mid;
  
  // Create temporary arrays
  const L = new Array(n1);
  const R = new Array(n2);
  
  // Copy data to temporary arrays
  for (let i = 0; i < n1; i++) {
    L[i] = arr[left + i];
  }
  for (let j = 0; j < n2; j++) {
    R[j] = arr[mid + 1 + j];
  }
  
  // Merge the temporary arrays back
  let i = 0;
  let j = 0;
  let k = left;
  
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
  }
  
  // Copy remaining elements of L[]
  while (i < n1) {
    arr[k] = L[i];
    i++;
    k++;
  }
  
  // Copy remaining elements of R[]
  while (j < n2) {
    arr[k] = R[j];
    j++;
    k++;
  }
}

function mergeSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    // Sort first and second halves
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    
    // Merge the sorted halves
    merge(arr, left, mid, right);
  }
  return arr;
}

// Initialize array
let array = [64, 34, 25, 12, 22, 11, 90];
mergeSort(array);` 