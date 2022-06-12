import { wbData } from "./data";
import { scaleLinear, scaleLog, scaleSqrt, scaleOrdinal } from "@visx/scale";
import { extent, format, max, min } from "d3";
import * as d3 from "d3";
import { Circle } from "@visx/shape";
import { Text } from "@visx/text";
import { Group } from "@visx/group";
import { Axis, AxisLeft } from "@visx/axis";
import { GridColumns } from "@visx/grid";
import { useTooltip, TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { useEffect, useContext, useRef, useMemo, useCallback } from "react";
import { localPoint } from "@visx/event";
import { voronoi } from "@visx/voronoi";
import { CompanyContext } from "../../context/CompanyContext";
import { getCompanyName } from "../../utils/getCompanyName";
import { TypeCompany, TypePeerMap } from "../../types/Type";

interface Props {
  wrap_width: number;
  data: TypePeerMap[];
  companies: TypeCompany[] | [];
}

export const ScatterPlot: React.FC<Props> = ({
  wrap_width,
  data,
  companies,
}) => {
  // let data = wbData.data
  const { company_id, company_name } = useContext(CompanyContext);

  const width = wrap_width * 0.95;
  const height = 360;
  const margin = { top: 30, left: 60, right: 40, bottom: 50 };
  const innerWidth =
    width - margin.left - margin.right > 0
      ? width - margin.left - margin.right
      : 0;
  const innerHeight = height - margin.top - margin.bottom;

  const x = (d: any) => d.signals_count;
  const y = (d: any) => d.signals_average;
  const radius = (d: any) => d.ticker_market_cap;
  const color = (d: any) => d.ticker_name;

  const xScale = scaleLinear({
    range: [margin.left, innerWidth + margin.left],
    domain: extent(data, x) as any,
  });

  const yScale = scaleLinear({
    range: [innerHeight + margin.top, margin.top],
    domain: [min(data, y), max(data, y)] as any,
    nice: true,
  });

  const rScale = scaleSqrt({
    range: [3, 30],
    domain: extent(data, radius) as any,
  });

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipOpen,
    tooltipTop = 0,
    tooltipLeft = 0,
  } = useTooltip();

  const voronoiLayout = useMemo(
    () =>
      voronoi({
        x: (d) => xScale(x(d)) ?? 0,
        y: (d) => yScale(y(d)) ?? 0,
        width,
        height,
      })(data),
    [data, width, height, xScale, yScale]
  );

  let tooltipTimeout: number;
  const svgRef = useRef(null);

  const handleMouseMove = useCallback(
    (event) => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout);
      if (!svgRef.current) return;

      // find the nearest polygon to the current mouse position
      const point = localPoint(svgRef.current, event);
      if (!point) return;
      const neighborRadius = 100;
      const closest = voronoiLayout.find(point.x, point.y, neighborRadius);
      if (closest) {
        showTooltip({
          tooltipLeft: xScale(x(closest.data)),
          tooltipTop: yScale(y(closest.data)),
          tooltipData: closest.data as TypePeerMap,
        });
      }
    },
    [xScale, yScale, showTooltip, voronoiLayout]
  );

  const handleMouseLeave = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 500);
  }, [hideTooltip]);

  // Sort the data
  const sortedData = useMemo(
    () => data.sort((a, b) => b.ticker_market_cap - a.ticker_market_cap),
    [data]
  );

  const ticker_name = getCompanyName(company_id, companies);

  return (
    <>
      <svg
        className="dark:fill-gray-300"
        width={width}
        height={height}
        ref={svgRef}
      >
        <rect
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseLeave}
        />
        <AxisLeft
          scale={yScale}
          left={margin.left}
          label="Signals Average"
          labelProps={{ fontSize: "0.8rem" }}
          numTicks={5}
          tickStroke="transparent"
          stroke="#374151"
          strokeWidth={0.3}
          tickClassName="dark:fill-gray-300"
          labelClassName="dark:fill-gray-300"
          tickLabelProps={(val, i) => ({
            fill: "inherit",
            fontSize: "0.6rem",
            textAnchor: "end",
            verticalAnchor: "middle",
          })}
        />
        <Axis
          orientation="bottom"
          scale={xScale}
          top={innerHeight + margin.top}
          tickFormat={format("2~s")}
          tickStroke="transparent"
          stroke="#374151"
          strokeWidth={0.3}
          label="Signals Count"
          labelProps={{ fontSize: "0.8rem", y: 40 }}
          tickLabelProps={(val, i) => ({
            fill: "inherit",
            fontSize: "0.6rem",
            textAnchor: "end",
            verticalAnchor: "middle",
          })}
        />
        <GridColumns
          top={margin.top}
          scale={xScale}
          height={innerHeight}
          strokeOpacity={0}
          pointerEvents="none"
          numTicks={2}
        />
        <Group pointerEvents="none">
          {sortedData.map((point, i) => (
            <Text
              className="dark:fill-gray-300"
              fillOpacity={0.5}
              key={i}
              x={
                xScale(x(point)) +
                  rScale(radius(point)) +
                  5 +
                  color(point).length * 6 >
                innerWidth
                  ? xScale(x(point)) -
                    rScale(radius(point)) -
                    5 -
                    color(point).length * 6
                  : xScale(x(point)) + rScale(radius(point)) + 5
              }
              y={yScale(y(point))}
              fill="black"
              fontSize="0.7rem"
            >
              {color(point)}
            </Text>
          ))}
        </Group>
        <Group pointerEvents="none">
          {sortedData.map((point, i) => (
            <Circle
              key={i}
              cx={xScale(x(point))}
              cy={yScale(y(point))}
              r={rScale(radius(point))}
              fillOpacity={0}
              stroke={
                tooltipData === point
                  ? "#10b981"
                  : ticker_name === point.ticker_name
                  ? "#f28e2b"
                  : "#4e79a7"
              }
              strokeWidth={tooltipData === point ? "2" : "3"}
            />
          ))}
        </Group>
      </svg>
      {tooltipOpen && tooltipData && tooltipLeft != null && tooltipTop != null && (
        <TooltipWithBounds
          left={tooltipLeft + 10}
          top={tooltipTop + 10}
          style={defaultStyles}
        >
          <h3
            style={{
              color: "blue",
              padding: 0,
              margin: 0,
            }}
          >
            {color(tooltipData)}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr",
            }}
          >
            <div>Signals Count</div>
            <div style={{ textAlign: "right" }}>{`${format("2~s")(
              x(tooltipData)
            )}`}</div>
            <div>Signals Average</div>
            <div style={{ textAlign: "right" }}>
              {/* {Math.round(y(tooltipData))} */}
              {y(tooltipData)}
            </div>
            <div>Ticker Market Cap</div>
            <div style={{ textAlign: "right" }}>{`${Math.round(
              radius(tooltipData)
            )}`}</div>
          </div>
        </TooltipWithBounds>
      )}
    </>
  );
};
