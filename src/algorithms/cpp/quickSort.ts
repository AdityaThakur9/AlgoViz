/**
 * This file contains the C++ implementation of Quick Sort as a string.
 * The code is stored as a template literal to preserve formatting.
 */

// Type definition for the C++ code string
type CppCode = string;

// Export the C++ implementation of Quick Sort
export const quickSort: CppCode = `
// Quick Sort Implementation
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            // Swap elements
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    // Place pivot in correct position
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    int array[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(array) / sizeof(array[0]);
    quickSort(array, 0, n - 1);
    return 0;
}
`; 