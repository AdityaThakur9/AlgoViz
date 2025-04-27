import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Typography,
  Paper,
  SelectChangeEvent,
  Tooltip,
  Zoom,
} from '@mui/material';
import { Info } from '@mui/icons-material';

interface AlgorithmControlsProps {
  title?: string;
  language: string;
  algorithm: string;
  languages: Record<string, string>;
  algorithms: Record<string, string>;
  onLanguageChange: (value: string) => void;
  onAlgorithmChange: (value: string) => void;
  onExplainClick?: () => void;
  inputArray?: string;
  onInputArrayChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputError?: string;
  showArrayInput?: boolean;
  isComparisonMode?: boolean;
  explainButtonRight?: boolean;
}

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  title,
  language,
  algorithm,
  languages,
  algorithms,
  onLanguageChange,
  onAlgorithmChange,
  onExplainClick,
  inputArray,
  onInputArrayChange,
  inputError,
  showArrayInput = false,
  isComparisonMode = false,
  explainButtonRight = false,
}) => {
  return (
    <Paper 
      sx={{ 
        p: 3, 
        bgcolor: '#1e1e1e', 
        color: '#fff',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        }
      }}
    >
      {title && (
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            color: '#fff',
            fontWeight: 600,
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {title}
        </Typography>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 3
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {!isComparisonMode && (
            <Tooltip title="Select programming language" placement="top" TransitionComponent={Zoom}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel sx={{ color: '#fff' }}>Language</InputLabel>
                <Select
                  value={language}
                  label="Language"
                  onChange={(e: SelectChangeEvent) => onLanguageChange(e.target.value)}
                  sx={{
                    color: '#fff',
                    transition: 'all 0.2s ease-in-out',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fff',
                    },
                  }}
                >
                  {Object.entries(languages).map(([key, value]) => (
                    <MenuItem key={key} value={key}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
          )}

          <Tooltip title="Select sorting algorithm" placement="top" TransitionComponent={Zoom}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: '#fff' }}>Algorithm</InputLabel>
              <Select
                value={algorithm}
                label="Algorithm"
                onChange={(e: SelectChangeEvent) => onAlgorithmChange(e.target.value)}
                sx={{
                  color: '#fff',
                  transition: 'all 0.2s ease-in-out',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fff',
                  },
                }}
              >
                {Object.entries(algorithms).map(([key, value]) => (
                  <MenuItem key={key} value={key}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>

          {onExplainClick && !isComparisonMode && explainButtonRight && (
            <Tooltip title="Learn how this algorithm works" placement="top" TransitionComponent={Zoom}>
              <Button
                variant="outlined"
                onClick={onExplainClick}
                startIcon={<Info />}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Explain Algorithm
              </Button>
            </Tooltip>
          )}
        </Box>

        {onExplainClick && !isComparisonMode && !explainButtonRight && (
          <Tooltip title="Learn how this algorithm works" placement="top" TransitionComponent={Zoom}>
            <Button
              variant="outlined"
              onClick={onExplainClick}
              startIcon={<Info />}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Explain Algorithm
            </Button>
          </Tooltip>
        )}

        {showArrayInput && onInputArrayChange && (
          <Tooltip title="Enter numbers separated by commas" placement="top" TransitionComponent={Zoom}>
            <TextField
              fullWidth
              label="Input Array"
              value={inputArray}
              onChange={onInputArrayChange}
              error={!!inputError}
              helperText={inputError}
              placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  transition: 'all 0.2s ease-in-out',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiFormHelperText-root': {
                  color: theme => theme.palette.error.main,
                  fontWeight: 500,
                },
              }}
            />
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
};

export default AlgorithmControls; 