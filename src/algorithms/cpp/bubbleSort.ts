/**
 * This file contains the C++ implementation of Bubble Sort as a string.
 * The code is stored as a template literal to preserve formatting.
 */

// Type definition for the C++ code string
type CppCode = string;

// Export the C++ implementation of Bubble Sort
export const bubbleSort: CppCode = `
// Bubble Sort Implementation
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main() {
    int array[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(array) / sizeof(array[0]);
    bubbleSort(array, n);
    return 0;
}
`; 