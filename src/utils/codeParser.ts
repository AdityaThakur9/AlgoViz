export interface Step {
  code: string
  lineNumber: number
  variables: { [key: string]: any }
  array: number[]
  comparing: number[]
  swapping: number[]
  description: string
  timestamp: number
  explanation: string
}

export class CodeParser {
  private code: string
  private currentStep: number = 0
  private steps: Step[] = []
  private array: number[] = [64, 34, 25, 12, 22, 11, 90]
  private algorithm: string

  constructor(code: string) {
    this.code = code
    // Determine algorithm from code, handling different languages
    if (code.includes('bubbleSort') || code.includes('bubble_sort')) {
      this.algorithm = 'bubbleSort'
    } else if (code.includes('quickSort') || code.includes('quick_sort')) {
      this.algorithm = 'quickSort'
    } else if (code.includes('mergeSort') || code.includes('merge_sort')) {
      this.algorithm = 'mergeSort'
    } else if (code.includes('insertionSort') || code.includes('insertion_sort')) {
      this.algorithm = 'insertionSort'
    } else {
      // Try to detect based on code structure
      if (code.includes('for (int i = 0; i < n - 1; i++)') || 
          code.includes('for i in range(n - 1)') ||
          code.includes('for (let i = 0; i < n - 1; i++)')) {
        this.algorithm = 'bubbleSort'
      } else if (code.includes('partition(') || code.includes('def partition(')) {
        this.algorithm = 'quickSort'
      } else if (code.includes('merge(') || code.includes('def merge(')) {
        this.algorithm = 'mergeSort'
      } else if (code.includes('key = arr[i]') || code.includes('key = arr[i]')) {
        this.algorithm = 'insertionSort'
      } else {
        this.algorithm = 'bubbleSort' // Default
      }
    }
  }

  setArray(array: number[]) {
    this.array = [...array]
  }

  parse(): Step[] {
    this.steps = []
    this.currentStep = 0

    // Initialize array
    const arr = [...this.array]
    this.addStep(1, arr, [], [], 'Array initialized')

    switch (this.algorithm) {
      case 'bubbleSort':
        this.parseBubbleSort(arr)
        break
      case 'quickSort':
        this.parseQuickSort(arr)
        break
      case 'mergeSort':
        this.parseMergeSort(arr)
        break
      case 'insertionSort':
        this.parseInsertionSort(arr)
        break
    }

    return this.steps
  }

  private parseBubbleSort(arr: number[]) {
    const n = arr.length
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        this.addStep(6, arr, [j, j + 1], [], `Comparing ${arr[j]} and ${arr[j + 1]}`)
        
        if (arr[j] > arr[j + 1]) {
          this.addStep(9, arr, [], [j, j + 1], `Swapping ${arr[j]} and ${arr[j + 1]}`)
          
          const temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
          
          this.addStep(15, [...arr], [], [], `Swapped elements - new array: [${arr.join(', ')}]`)
        }
      }
    }
  }

  private parseQuickSort(arr: number[]) {
    const quickSort = (arr: number[], low: number, high: number) => {
      if (low < high) {
        const pi = this.partition(arr, low, high)
        quickSort(arr, low, pi - 1)
        quickSort(arr, pi + 1, high)
      }
    }

    quickSort(arr, 0, arr.length - 1)
  }

  private partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      this.addStep(6, arr, [j, high], [], `Comparing ${arr[j]} with pivot ${pivot}`)
      
      if (arr[j] <= pivot) {
        i++
        this.addStep(9, arr, [], [i, j], `Swapping ${arr[i]} and ${arr[j]}`)
        
        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
        
        this.addStep(15, [...arr], [], [], `Swapped elements - new array: [${arr.join(', ')}]`)
      }
    }

    this.addStep(18, arr, [], [i + 1, high], `Placing pivot ${pivot} in position ${i + 1}`)
    
    const temp = arr[i + 1]
    arr[i + 1] = arr[high]
    arr[high] = temp
    
    this.addStep(22, [...arr], [], [], `Pivot placed - new array: [${arr.join(', ')}]`)
    
    return i + 1
  }

  private parseMergeSort(arr: number[]) {
    const merge = (arr: number[], left: number, mid: number, right: number) => {
      const n1 = mid - left + 1
      const n2 = right - mid
      
      const L = new Array(n1)
      const R = new Array(n2)
      
      for (let i = 0; i < n1; i++) {
        L[i] = arr[left + i]
      }
      for (let j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j]
      }
      
      let i = 0, j = 0, k = left
      
      while (i < n1 && j < n2) {
        this.addStep(6, arr, [left + i, mid + 1 + j], [], `Comparing ${L[i]} and ${R[j]}`)
        
        if (L[i] <= R[j]) {
          arr[k] = L[i]
          i++
        } else {
          arr[k] = R[j]
          j++
        }
        k++
        
        this.addStep(15, [...arr], [], [], `Merged elements - new array: [${arr.join(', ')}]`)
      }
      
      while (i < n1) {
        arr[k] = L[i]
        i++
        k++
      }
      
      while (j < n2) {
        arr[k] = R[j]
        j++
        k++
      }
    }

    const mergeSort = (arr: number[], left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2)
        
        this.addStep(6, arr, [], [], `Splitting array at index ${mid}`)
        mergeSort(arr, left, mid)
        mergeSort(arr, mid + 1, right)
        
        this.addStep(9, arr, [], [], `Merging subarrays`)
        merge(arr, left, mid, right)
      }
    }

    mergeSort(arr, 0, arr.length - 1)
  }

  private parseInsertionSort(arr: number[]) {
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i]
      let j = i - 1
      
      this.addStep(6, arr, [i], [], `Current element: ${key}`)
      
      while (j >= 0 && arr[j] > key) {
        this.addStep(9, arr, [j], [j + 1], `Moving ${arr[j]} to position ${j + 1}`)
        
        arr[j + 1] = arr[j]
        j--
        
        this.addStep(15, [...arr], [], [], `Shifted elements - new array: [${arr.join(', ')}]`)
      }
      
      arr[j + 1] = key
      this.addStep(18, [...arr], [], [], `Inserted ${key} at position ${j + 1}`)
    }
  }

  private addStep(lineNumber: number, array: number[], comparing: number[], swapping: number[], description: string) {
    this.steps.push({
      code: this.code,
      lineNumber,
      variables: {},
      array: [...array],
      comparing: [...comparing],
      swapping: [...swapping],
      description,
      timestamp: Date.now(),
      explanation: description
    })
  }

  getCurrentStep(): Step | null {
    return this.steps[this.currentStep] || null
  }

  nextStep(): Step | null {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++
      return this.getCurrentStep()
    }
    return null
  }

  reset(): void {
    this.currentStep = 0
  }
} 