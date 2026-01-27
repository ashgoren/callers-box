import { Typography, Link, List, ListItem } from '@mui/material'

export const Home = () => (
  <>
    <Typography variant='h4' gutterBottom>
      Choose a table
    </Typography>
    <List>
      <ListItem>
        <Link href="/dances">Dances</Link>
      </ListItem>
      <ListItem>
        <Link href="/programs">Programs</Link>
      </ListItem>
    </List>
  </>
)