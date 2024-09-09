import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

import { Scrollbar } from 'src/components/scrollbar';
import { useTable, TablePaginationCustom } from 'src/components/table';

// ----------------------------------------------------------------------

function createData(name, code, population, size) {
  const density = population / size;
  return {
    name,
    code,
    population,
    size,
    density,
  };
}

const TABLE_DATA = [
  createData('India', 'IR', 1324171354, 3287263),
  createData('China', 'IR', 1403500365, 9596961),
  createData('Italy', 'IR', 60483973, 301340),
  createData('United States', 'IR', 327167434, 9833520),
  createData('Canada', 'IR', 37602103, 9984670),
  createData('Australia', 'IR', 25475400, 7692024),
  createData('Germany', 'IR', 83019200, 357578),
  createData('Ireland', 'IR', 4857000, 70273),
  createData('Mexico', 'IR', 126577691, 1972550),
  createData('Japan', 'IR', 126317000, 377973),
  createData('France', 'IR', 67022000, 640679),
  createData('United Kingdom', 'IR', 67545757, 242495),
  createData('Russia', 'IR', 146793744, 17098246),
  createData('Nigeria', 'IR', 200962417, 923768),
  createData('Brazil', 'IR', 210147125, 8515767),
];

const COLUMNS = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
  {
    id: 'population',
    label: 'Population',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'density',
    label: 'Density',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];

// ----------------------------------------------------------------------

export function GroupingFixedHeaderTable() {
  const table = useTable({ defaultRowsPerPage: 10 });

  return (
    <>
      <Scrollbar sx={{ maxHeight: 400 }}>
        <Table stickyHeader sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                colSpan={2}
                sx={{
                  borderBottomColor: 'transparent',
                  background: (theme) => theme.vars.palette.background.paper,
                }}
              >
                Country
              </TableCell>
              <TableCell
                align="center"
                colSpan={3}
                sx={{
                  borderBottomColor: 'transparent',
                  background: (theme) => theme.vars.palette.background.paper,
                }}
              >
                Details
              </TableCell>
            </TableRow>

            <TableRow>
              {COLUMNS.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 56, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {TABLE_DATA.slice(
              table.page * table.rowsPerPage,
              table.page * table.rowsPerPage + table.rowsPerPage
            ).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                {COLUMNS.map((column) => {
                  const value = row[column.id];

                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>

      <TablePaginationCustom
        page={table.page}
        count={TABLE_DATA.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </>
  );
}
