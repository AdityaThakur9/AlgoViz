/**
 * This file contains the Python implementation of Merge Sort as a string.
 * The code is stored as a template literal to preserve formatting.
 */

// Type definition for the Python code string
type PythonCode = string;

// Export the Python implementation of Merge Sort
export const mergeSort: PythonCode = `
def merge(arr, left, mid, right):
    n1 = mid - left + 1
    n2 = right - mid
    
    # Create temporary arrays
    L = [0] * n1
    R = [0] * n2
    
    # Copy data to temporary arrays
    for i in range(n1):
        L[i] = arr[left + i]
    for j in range(n2):
        R[j] = arr[mid + 1 + j]
    
    # Merge the temporary arrays back
    i = j = 0
    k = left
    
    while i < n1 and j < n2:
        if L[i] <= R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
        k += 1
    
    # Copy remaining elements of L[]
    while i < n1:
        arr[k] = L[i]
        i += 1
        k += 1
    
    # Copy remaining elements of R[]
    while j < n2:
        arr[k] = R[j]
        j += 1
        k += 1

def merge_sort(arr, left, right):
    if left < right:
        mid = (left + right) // 2
        
        # Sort first and second halves
        merge_sort(arr, left, mid)
        merge_sort(arr, mid + 1, right)
        
        # Merge the sorted halves
        merge(arr, left, mid, right)

# Example usage
if __name__ == "__main__":
    array = [64, 34, 25, 12, 22, 11, 90]
    n = len(array)
    merge_sort(array, 0, n - 1)
    print("Sorted array:", array)
`; 