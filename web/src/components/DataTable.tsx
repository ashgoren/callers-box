import { useState } from 'react';
import { flexRender, type Table as ReactTable } from '@tanstack/react-table';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export const DataTable = <TData,>({ table }: { table: ReactTable<TData> }) => {
  const [filterOpen, setFilterOpen] = useState<Record<string, boolean>>({});

  const toggleFilter = (column: { id: string, setFilterValue: (value: any) => void }) => {
    column.setFilterValue(undefined);
    setFilterOpen(prev => ({ ...prev, [column.id]: !prev[column.id] }));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableCell key={header.id}>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {header.column.getCanSort() ? (
                        <TableSortLabel
                          active={!!header.column.getIsSorted()}
                          direction={header.column.getNextSortingOrder() === 'asc' ? 'asc' : 'desc'}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableSortLabel>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </Box>

                    {header.column.getCanFilter() && (
                      <IconButton 
                        size='small'
                        onClick={() => toggleFilter(header.column)}
                        color={filterOpen[header.column.id] ? 'secondary' : 'default'}
                      >
                        <SearchIcon fontSize='small' />
                      </IconButton>
                    )}
                  </Box>

                  {header.column.getCanFilter() && filterOpen[header.column.id] && (
                    <TextField
                      size='small'
                      fullWidth
                      autoFocus
                      onChange={e => header.column.setFilterValue(e.target.value)}
                      placeholder='Filter...'
                      sx={{ mt: 1 }}
                      slotProps={{
                        input: {
                          endAdornment: (<IconButton
                            size='small'
                            onClick={() => toggleFilter(header.column)}
                          >
                            <ClearIcon fontSize='small' />
                          </IconButton>
                          )
                        }
                      }}
                    />
                  )}

                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
