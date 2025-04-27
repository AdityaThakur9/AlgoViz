export const ALGORITHM_EXPLANATIONS = {
    bubbleSort: {
        overview: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        timeComplexity: 'O(n²) in the worst and average case, O(n) in the best case (when the array is already sorted).',
        spaceComplexity: 'O(1) as it sorts in place.',
        keySteps: [
            'Compare adjacent elements',
            'Swap if they are in the wrong order',
            'Repeat until no swaps are needed'
        ],
        useCases: [
            'Educational purposes',
            'Small datasets',
            'Nearly sorted arrays'
        ]
    },
    quickSort: {
        overview: 'Quick Sort is a highly efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy.',
        timeComplexity: 'O(n log n) in the average case, O(n²) in the worst case.',
        spaceComplexity: 'O(log n) due to recursion stack.',
        keySteps: [
            'Choose a pivot element',
            'Partition the array around the pivot',
            'Recursively sort the sub-arrays'
        ],
        useCases: [
            'Large datasets',
            'General-purpose sorting',
            'When average-case performance matters more than worst-case'
        ]
    },
    mergeSort: {
        overview: 'Merge Sort is a stable, comparison-based sorting algorithm that uses a divide-and-conquer approach.',
        timeComplexity: 'O(n log n) in all cases.',
        spaceComplexity: 'O(n) for the auxiliary array.',
        keySteps: [
            'Divide the array into two halves',
            'Recursively sort each half',
            'Merge the sorted halves'
        ],
        useCases: [
            'Large datasets',
            'When stability is required',
            'External sorting'
        ]
    },
    insertionSort: {
        overview: 'Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time.',
        timeComplexity: 'O(n²) in the worst and average case, O(n) in the best case.',
        spaceComplexity: 'O(1) as it sorts in place.',
        keySteps: [
            'Start with the second element',
            'Compare with previous elements',
            'Insert in the correct position'
        ],
        useCases: [
            'Small datasets',
            'Nearly sorted arrays',
            'Online sorting (when new elements are added to the list)'
        ]
    }
}; 