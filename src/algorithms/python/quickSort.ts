/**
 * This file contains the Python implementation of Quick Sort as a string.
 * The code is stored as a template literal to preserve formatting.
 */

// Type definition for the Python code string
type PythonCode = string;

// Export the Python implementation of Quick Sort
export const quickSort: PythonCode = `
def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            # Swap elements
            arr[i], arr[j] = arr[j], arr[i]
    
    # Place pivot in correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

# Example usage
if __name__ == "__main__":
    array = [64, 34, 25, 12, 22, 11, 90]
    n = len(array)
    quick_sort(array, 0, n - 1)
    print("Sorted array:", array)
`; 