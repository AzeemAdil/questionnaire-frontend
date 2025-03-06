import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton,
  TextFieldProps,
  Box,
  LinearProgress,
  Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordFieldProps extends Omit<TextFieldProps, 'type'> {
  label?: string;
  showStrengthBar?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ 
  label = 'Password',
  showStrengthBar = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [strengthText, setStrengthText] = useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // Calculate password strength when value changes
  useEffect(() => {
    if (showStrengthBar && props.value) {
      const password = props.value as string;
      calculatePasswordStrength(password);
    }
  }, [props.value, showStrengthBar]);

  const calculatePasswordStrength = (password: string) => {
    // Start with a base score
    let score = 0;
    
    // No password
    if (!password) {
      setStrength(0);
      setStrengthText('');
      return;
    }
    
    // Length check
    if (password.length > 6) score += 1;
    if (password.length > 10) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    // Convert score to percentage (0-6 scale to 0-100)
    const strengthValue = Math.min(100, Math.round((score / 6) * 100));
    setStrength(strengthValue);
    
    // Set text based on strength
    if (strengthValue < 30) setStrengthText('Weak');
    else if (strengthValue < 70) setStrengthText('Medium');
    else setStrengthText('Strong');
  };

  // Get color based on strength
  const getStrengthColor = () => {
    if (strength < 30) return 'error';
    if (strength < 70) return 'warning';
    return 'success';
  };

  return (
    <>
      <TextField
        {...props}
        label={label}
        type={showPassword ? 'text' : 'password'}
        fullWidth
        InputProps={{
          ...props.InputProps,
          sx:{
              borderRadius:"18px"
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {!showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {showStrengthBar && props.value && (
        <Box sx={{ mt: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="textSecondary">
              Password Strength
            </Typography>
            <Typography variant="caption" color={getStrengthColor()}>
              {strengthText}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={strength} 
            color={getStrengthColor() as "error" | "warning" | "success"}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      )}
    </>
  );
};

export default PasswordField;