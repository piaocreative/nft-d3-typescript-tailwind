import React from 'react'
import { Column, useSortBy, useTable } from 'react-table'
import { SortAscendingIcon, SortDescendingIcon } from '@heroicons/react/solid'
import ToolTip from 'react-tooltip'

type Props = {
  data: Array<any>
  columns: Array<Column>
}

function useInstance(instance: { allColumns: any }) {
  const { allColumns } = instance

  let rowSpanHeaders: any[] = []

  allColumns.forEach((column: { id: any; enableRowSpan: any }, i: any) => {
    const { id, enableRowSpan } = column

    if (enableRowSpan !== undefined) {
      rowSpanHeaders = [
        ...rowSpanHeaders,
        { id, topCellValue: null, topCellIndex: 0 },
      ]
    }
  })

  Object.assign(instance, { rowSpanHeaders })
}
const initialState = { hiddenColumns: ['headline'] }

export const ReportTable: React.FC<Props> = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    rowSpanHeaders,
  } = useTable({ columns, data, initialState }, useSortBy, (hooks) => {
    hooks.useInstance.push(useInstance)
  })

  return (
    <table className="w-full dark:text-gray-300" {...getTableProps()}>
      <thead className="text-xs">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                className={`${
                  column.width != 150 ? 'w-' + column.width : ''
                } leading-6 relative font-normal px-1 py-1 border border-gray-300 dark:border-gray-700 `}
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render('Header')}
                <span className="absolute right-0 top-0 bottom-0 my-auto h-4 inline-block align-middle mx-1">
                  {column.isSorted && column.isSortedDesc && (
                    <SortDescendingIcon className="h-4" />
                  )}
                  {column.isSorted && !column.isSortedDesc && (
                    <SortAscendingIcon className="h-4" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="text-xxs" {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)

          for (let j = 0; j < row.allCells.length; j++) {
            let cell = row.allCells[j]
            let rowSpanHeader = rowSpanHeaders.find(
              (x: { id: string }) => x.id === cell.column.id,
            )

            if (rowSpanHeader !== undefined) {
              if (
                rowSpanHeader.topCellValue === null ||
                rowSpanHeader.topCellValue !== cell.value
              ) {
                cell.isRowSpanned = false
                rowSpanHeader.topCellValue = cell.value
                rowSpanHeader.topCellIndex = i
                cell.rowSpan = 1
              } else {
                rows[rowSpanHeader.topCellIndex].allCells[j].rowSpan++
                cell.isRowSpanned = true
              }
            }
          }
          return null
        })}
        {rows.map((row) => {
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                if (cell.isRowSpanned) return null
                else
                  return (
                    <td
                      className={`border border-gray-300 dark:border-gray-700 leading-6 ${
                        cell.rowSpan ? 'text-xs capitalize px-2' : 'px-2'
                      } ${
                        cell.column.width != 150 ? 'w-' + cell.column.width : ''
                      } 
                      `}
                      rowSpan={cell.rowSpan}
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                      <ToolTip
                        className="max-w-xs"
                        type="light"
                        id={cell.row.values.data_type}
                        place="left"
                      >
                        <div className="font-bold">Headline</div>
                        {cell.row.values?.headline}
                      </ToolTip>
                    </td>
                  )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
