import React, { useEffect, useState, useContext, useRef } from 'react'
import { getCompanyNews } from '../../../api/getCompanyNews'
import { Column } from 'react-table'
import ToolTip from 'react-tooltip'
import { TypeNewsData } from '../../../types/Type'
import { ReportTable } from '../../../components/ReportTable'
import { TopicContext } from '../../../context/TopicContext'
import { CompanyContext } from '../../../context/CompanyContext'
import * as d3 from 'd3'
import { PageLoading } from '../../../components/PageLoading'

export const NewsOrder: React.FC = () => {
  const { company_id } = useContext(CompanyContext)

  const [data, setData] = useState<TypeNewsData[] | null>()
  const { report_topic, setReportTopic } = useContext(TopicContext)
  const ref = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ToolTip.rebuild()
    setLoading(true)
    getCompanyNews(company_id)
      .then((response) => {
        const res: TypeNewsData[] = response.data.data
        setData(
          res
            .sort((a, b) => (a.datetime < b.datetime ? -1 : 1))
            .map((value, index, arr) => {
              if (index < arr.length / 2)
                return {
                  ...value,
                  data_type: 'above' + index,
                }
              else
                return {
                  ...value,
                  data_type: 'below' + index,
                }
            }),
        )
      })
      .catch(() => {
        setData(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [company_id])
  const columns: Array<Column> = React.useMemo(
    () => [
      {
        Header: 'Sentence',
        accessor: 'sentence',
        width: '8-12',
        Cell: ({ cell: { value } }) => {
          return (
            <div
              title={value}
              className={`transition duration-300 ease-in-out cursor-pointer h-6 overflow-hidden text-ellipsis break-all${
                !!report_topic && report_topic !== value
                  ? 'text-gray-400 dark:text-gray-500 opacity-30'
                  : ''
              }`}
            >
              {/* {value.length > 120 ? value.slice(0, 120) + '...' : value} */}
              {value}
            </div>
          )
        },
      },
      {
        Header: 'Link',
        accessor: 'link',
        width: '2-12',
        Cell: ({ cell: { value } }) => (
          <a
            target="_blank"
            href={value}
            title={value}
            className="transition duration-300 ease-in-out cursor-pointer hover:underline block h-6 overflow-hidden text-ellipsis break-all"
          >
            {value}
          </a>
        ),
      },
      {
        Header: 'Data Time',
        accessor: 'datetime',
        width: '2',
        Cell: ({ cell: { value } }) => (
          <div
            className={`transition duration-300 ease-in-out h-full cursor-pointer text-center`}
          >
            {d3.timeFormat('%Y-%m-%d')(new Date(value))}
          </div>
        ),
      },
      {
        Header: '',
        accessor: 'data_type',
        show: true,
        Cell: ({ cell: { value } }) => {
          return (
            <div
              className={`transition duration-300 ease-in-out text-center h-full cursor-pointer relative`}
            >
              <div
                data-tip
                data-for={value}
                className={`m-auto inline-block align-middle w-5 h-5 cursor-pointer transition
           bg-emerald-900
           ${value.slice(0, 5) == 'above' ? 'bg-emerald-900' : 'bg-rose-700'}
            scale-90 hover:border-black hover:dark:border-white hover:scale-110 hover:border`}
              ></div>
            </div>
          )
        },
      },
      {
        Header: 'Headline',
        accessor: 'headline',
        Cell: ({ cell: { value } }) => (
          <div
            className={`transition duration-300 ease-in-out h-full cursor-pointer`}
          >
            {value}
          </div>
        ),
      },
      // {
      //   Header: '',
      //   accessor: 'data_type',
      //   show: true,
      //   Cell: ({ cell: { value } }) => {
      //     return (
      //       <div
      //         className={`transition duration-300 ease-in-out text-center h-full cursor-pointer relative`}
      //       >
      //         <div
      //           data-tip
      //           data-for={value}
      //           className={`m-auto inline-block align-middle w-5 h-5 cursor-pointer transition
      //       ${
      //         value.slice(0, 13) == 'top headlines'
      //           ? 'bg-emerald-900'
      //           : 'bg-rose-700'
      //       }
      //       scale-90 hover:border-black hover:dark:border-white hover:scale-110 hover:border`}
      //         ></div>
      //       </div>
      //     )
      //   },
      // },
    ],
    [company_id],
  )

  const handleClickOutside = (e: MouseEvent) => {
    ref &&
      ref.current &&
      !ref.current.contains(e.target as Node) &&
      typeof setReportTopic === 'function' &&
      setReportTopic('')
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return loading ? (
    <PageLoading />
  ) : (
    // <span>loading...</span>
    <div className="my-3">
      <h2 className="subtitle capitalize">Top / Worst News</h2>
      <div ref={ref} className="my-3">
        {data?.length ? <ReportTable columns={columns} data={data} /> : ''}
      </div>
    </div>
  )
}
