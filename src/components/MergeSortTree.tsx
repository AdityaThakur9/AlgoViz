import React, { useMemo } from 'react';
import { Step } from '../utils/codeParser';
import { motion } from 'framer-motion';

interface MergeSortTreeProps {
  initialArray: number[];
  steps: Step[];
  currentStep: number;
}

// Tree node type
interface TreeNodeState {
  value: number[];
  left: TreeNodeState | null;
  right: TreeNodeState | null;
  merged?: boolean; // true if this node has been merged
}

// Helper to generate all tree states for the merge sort process
function generateMergeSortTreeStates(arr: number[]): TreeNodeState[][] {
  const states: TreeNodeState[][] = [];

  function helper(subArr: number[]): TreeNodeState {
    if (subArr.length <= 1) {
      const node: TreeNodeState = { value: subArr, left: null, right: null };
      states.push([JSON.parse(JSON.stringify(node))]);
      return node;
    }
    const mid = Math.floor(subArr.length / 2);
    const leftArr = subArr.slice(0, mid);
    const rightArr = subArr.slice(mid);
    const leftNode = helper(leftArr);
    const rightNode = helper(rightArr);
    const node: TreeNodeState = { value: subArr, left: leftNode, right: rightNode };
    states.push([JSON.parse(JSON.stringify(node))]);
    // After merging, update node value to sorted
    node.value = [...leftNode.value, ...rightNode.value].sort((a, b) => a - b);
    node.merged = true;
    states.push([JSON.parse(JSON.stringify(node))]);
    return node;
  }

  helper(arr);
  return states;
}

// Animated tree node
const AnimatedTreeNode: React.FC<{ node: TreeNodeState }> = ({ node }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, type: 'spring' }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 8 }}
    >
      <motion.div
        layout
        style={{
          padding: '6px 14px',
          borderRadius: 8,
          background: node.merged ? 'rgba(76, 175, 80, 0.25)' : '#23272f',
          color: node.merged ? '#fff' : '#b0bec5',
          fontWeight: node.merged ? 700 : 400,
          border: node.merged ? '2.5px solid #4caf50' : '1.5px solid #374151',
          minWidth: 36,
          marginBottom: 6,
          boxShadow: node.merged ? '0 0 16px 2px #4caf50, 0 0 4px 1px #388e3c' : 'none',
          transition: 'all 0.4s cubic-bezier(.4,2,.6,1)',
          textShadow: node.merged ? '0 0 8px #4caf50' : 'none',
        }}
      >
        {node.value.join(', ')}
      </motion.div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
        {node.left && <AnimatedTreeNode node={node.left} />}
        {node.right && <AnimatedTreeNode node={node.right} />}
      </div>
    </motion.div>
  );
};

const MergeSortTree: React.FC<MergeSortTreeProps> = ({ initialArray, steps, currentStep }) => {
  // Generate all tree states for the process
  const treeStates = useMemo(() => generateMergeSortTreeStates(initialArray), [initialArray]);
  // Clamp currentStep to available states
  const stateIdx = Math.min(currentStep, treeStates.length - 1);
  const currentTree = treeStates[stateIdx]?.[0];

  return (
    <div style={{ overflowX: 'auto', padding: 16, background: '#181c23', borderRadius: 12 }}>
      {currentTree && <AnimatedTreeNode node={currentTree} />}
    </div>
  );
};

export default MergeSortTree; 