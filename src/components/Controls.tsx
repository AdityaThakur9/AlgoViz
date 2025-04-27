import { Box, Slider, IconButton, Button, Tooltip } from '@mui/material'
import { PlayArrow, Pause, Speed, PlayCircle, SkipPrevious, SkipNext } from '@mui/icons-material'

interface ControlsProps {
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  speed: number
  setSpeed: (speed: number) => void
  onRun: () => void
  onPause: () => void
  onPrev: () => void
  onNext: () => void
  disableRun: boolean
  disablePause: boolean
  disablePrev: boolean
  disableNext: boolean
}

const Controls = ({ isPlaying, setIsPlaying, speed, setSpeed, onRun, onPause, onPrev, onNext, disableRun, disablePause, disablePrev, disableNext }: ControlsProps) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      mt: 2,
      color: 'white'
    }}>
      <Tooltip title="Previous Step">
        <span>
          <IconButton
            onClick={onPrev}
            color="primary"
            size="large"
            disabled={disablePrev}
            sx={{ color: 'white', '&:active': { bgcolor: '#1976d2' } }}
          >
            <SkipPrevious />
          </IconButton>
        </span>
      </Tooltip>
      <Button
        variant="contained"
        startIcon={<PlayCircle />}
        onClick={onRun}
        disabled={disableRun}
        sx={{
          bgcolor: '#4caf50',
          '&:hover': {
            bgcolor: '#45a049'
          },
          '&:active': {
            bgcolor: '#357a38'
          }
        }}
      >
        Run
      </Button>
      <IconButton
        onClick={onPause}
        color="primary"
        size="large"
        disabled={disablePause}
        sx={{ color: 'white', '&:active': { bgcolor: '#b71c1c' } }}
      >
        <Pause />
      </IconButton>
      <Tooltip title="Next Step">
        <span>
          <IconButton
            onClick={onNext}
            color="primary"
            size="large"
            disabled={disableNext}
            sx={{ color: 'white', '&:active': { bgcolor: '#1976d2' } }}
          >
            <SkipNext />
          </IconButton>
        </span>
      </Tooltip>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        width: 200,
        color: 'white'
      }}>
        <Speed />
        <Slider
          value={speed}
          onChange={(_, value) => setSpeed(value as number)}
          min={0.1}
          max={10}
          step={0.1}
          valueLabelDisplay="auto"
          sx={{
            color: 'white',
            '& .MuiSlider-thumb': {
              backgroundColor: 'white',
            },
            '& .MuiSlider-track': {
              backgroundColor: 'white',
            },
            '& .MuiSlider-rail': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        />
      </Box>
    </Box>
  )
}

export default Controls 