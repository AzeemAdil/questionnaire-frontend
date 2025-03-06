import ThemeToggle from '@/components/ThemeToggle';
import { Button, Typography, Container, Box } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <ThemeToggle />
        </Box>
        
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Your App
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          This app is configured with MUI and TailwindCSS with dark mode support.
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary">
            Primary Button
          </Button>
          <Button variant="contained" color="error">
            Error Button
          </Button>
          <Button variant="contained" color="success">
            Success Button
          </Button>
        </Box>
        
        {/* Example of using Tailwind classes */}
        <div className="mt-8 p-4 bg-primary rounded">
          This element is styled with Tailwind CSS
        </div>
      </Box>
    </Container>
  );
}