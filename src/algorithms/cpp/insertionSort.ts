/**
 * This file contains the C++ implementation of Insertion Sort as a string.
 * The code is stored as a template literal to preserve formatting.
 */

// Type definition for the C++ code string
type CppCode = string;

// Export the C++ implementation of Insertion Sort
export const insertionSort: CppCode = `
// Insertion Sort Implementation
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        // Move elements of arr[0..i-1] that are greater than key
        // to one position ahead of their current position
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

int main() {
    int array[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(array) / sizeof(array[0]);
    insertionSort(array, n);
    return 0;
}
`; 