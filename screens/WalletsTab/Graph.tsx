import * as React from "react"
import { Box, Button, Flex, Heading, Stack, Text } from "bumbag-native"
import {
  LineChart,
  TLineChartDataProp,
  TLineChartPoint,
} from "react-native-wagmi-charts"
import * as haptics from "expo-haptics"
import { Platform } from "react-native"

// import mockData from "./data/line-data.json"
// import mockData2 from "./data/line-data2.json"
import { useMemo } from "react"

const mockData = [
  {
    timestamp: 1626945400000,
    value: 33575.25,
  },
  {
    timestamp: 1626946300000,
    value: 33545.25,
  },
  {
    timestamp: 1626947200000,
    value: 33510.15,
  },
  {
    timestamp: 1626948100000,
    value: 33215.61,
  },
  {
    timestamp: 1626949000000,
    value: 33445.23,
  },
  {
    timestamp: 1626949900000,
    value: 33435.51,
  },
  {
    timestamp: 1626950800000,
    value: 33480.66,
  },
  {
    timestamp: 1626951700000,
    value: 33440.25,
  },
  {
    timestamp: 1626952600000,
    value: 33485.23,
  },
  {
    timestamp: 1626953500000,
    value: 33515.21,
  },
  {
    timestamp: 1626954400000,
    value: 33570.77,
  },
  {
    timestamp: 1626955300000,
    value: 33640.45,
  },
  {
    timestamp: 1626956200000,
    value: 33645.34,
  },
  {
    timestamp: 1626957100000,
    value: 33670.33,
  },
  {
    timestamp: 1626958000000,
    value: 33740.25,
  },
  {
    timestamp: 1626958900000,
    value: 33770.25,
  },
  {
    timestamp: 1626959800000,
    value: 33705.25,
  },
  {
    timestamp: 1626960700000,
    value: 33760.25,
  },
  {
    timestamp: 1626961600000,
    value: 33670.25,
  },
  {
    timestamp: 1626962500000,
    value: 33870.25,
  },
]

const mockData2 = [
  {
    timestamp: 1625962500000,
    value: 33870.25,
  },
  {
    timestamp: 1625961600000,
    value: 33670.25,
  },
  {
    timestamp: 1625960700000,
    value: 33760.25,
  },
  {
    timestamp: 1625959800000,
    value: 33705.25,
  },
  {
    timestamp: 1625958900000,
    value: 33770.25,
  },
  {
    timestamp: 1625958000000,
    value: 33740.25,
  },
  {
    timestamp: 1625957100000,
    value: 33670.25,
  },
  {
    timestamp: 1625956200000,
    value: 33645.25,
  },
  {
    timestamp: 1625955300000,
    value: 33640.25,
  },
  {
    timestamp: 1625954400000,
    value: 33570.25,
  },
  {
    timestamp: 1625953500000,
    value: 33515.25,
  },
  {
    timestamp: 1625952600000,
    value: 33485.25,
  },
  {
    timestamp: 1625951700000,
    value: 33440.25,
  },
  {
    timestamp: 1625950800000,
    value: 33480.25,
  },
  {
    timestamp: 1625949900000,
    value: 33435.25,
  },
  {
    timestamp: 1625949000000,
    value: 33445.25,
  },
  {
    timestamp: 1625948100000,
    value: 33215.25,
  },
  {
    timestamp: 1625947200000,
    value: 33510.25,
  },
  {
    timestamp: 1625946300000,
    value: 33545.25,
  },
  {
    timestamp: 1625945400000,
    value: 33575.25,
  },
]

function invokeHaptic() {
  if (["ios", "android"].includes(Platform.OS)) {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light)
  }
}

const Graph = () => {
  const [data, setData] = React.useState<TLineChartPoint[]>(mockData)
  const [multiData, toggleMultiData] = React.useReducer(
    (state) => !state,
    false
  )
  const [partialDay, togglePartialDay] = React.useReducer(
    (state) => !state,
    false
  )

  const [yRange, setYRange] = React.useState<undefined | "low" | "high">(
    undefined
  )

  const toggleYRange = () => {
    setYRange((domain) => {
      if (!domain) {
        return "low"
      }
      if (domain === "low") {
        return "high"
      }
      return undefined
    })
  }

  const [toggleMinMaxLabels, setToggleMinMaxLabels] = React.useState(false)

  let dataProp: TLineChartDataProp = data
  const [min, max] = useMemo(() => {
    if (Array.isArray(dataProp)) {
      const values = dataProp.map((d) => d.value)
      const _min = Math.min(...values)
      const _max = Math.max(...values)
      return [
        values.findIndex((v) => v === _min),
        values.findIndex((v) => v === _max),
      ]
    }
    return [0, 0]
  }, [dataProp])

  let chart = (
    <LineChart>
      {!toggleMinMaxLabels && <LineChart.Path color="black" />}
      {toggleMinMaxLabels && (
        <LineChart.Path color="black">
          <LineChart.Tooltip at={max} position="top" />
          <LineChart.Tooltip at={min} position="bottom" yGutter={-10} />
        </LineChart.Path>
      )}
      {/* <LineChart.Path color="black">
        <LineChart.Gradient color="black" />
        <LineChart.HorizontalLine at={{ index: 0 }} />
        <LineChart.Highlight color="red" from={10} to={15} />
        <LineChart.Dot color="red" at={10} />
        <LineChart.Dot color="red" at={15} />
        {partialDay && (
          <LineChart.Dot at={data.length - 1} color="red" hasPulse />
        )}
      </LineChart.Path>
        */}
      <LineChart.CursorCrosshair
        onActivated={invokeHaptic}
        onEnded={invokeHaptic}
      >
        <LineChart.Tooltip position="top" />
        <LineChart.HoverTrap />
      </LineChart.CursorCrosshair>
    </LineChart>
  )

  if (multiData) {
    dataProp = {
      one: mockData,
      two: mockData2,
    }
    chart = (
      <LineChart.Group>
        <LineChart id="one">
          <LineChart.Path animateOnMount="foreground" color="blue" />
          <LineChart.CursorCrosshair
            onActivated={invokeHaptic}
            onEnded={invokeHaptic}
          >
            <LineChart.Tooltip />
          </LineChart.CursorCrosshair>
        </LineChart>
        <LineChart id="two">
          <LineChart.Path color="red">
            <LineChart.Gradient color="black" />
            <LineChart.HorizontalLine at={{ index: 4 }} />
          </LineChart.Path>
          <LineChart.CursorCrosshair
            color="hotpink"
            onActivated={invokeHaptic}
            onEnded={invokeHaptic}
          >
            <LineChart.Tooltip />
          </LineChart.CursorCrosshair>
        </LineChart>
      </LineChart.Group>
    )
  }

  return (
    <>
      <Heading.H5 marginBottom="major-2" paddingX="major-2">
        Line Chart 📈
      </Heading.H5>
      <LineChart.Provider
        data={dataProp}
        xLength={partialDay ? data.length * 2 : undefined}
        yRange={{
          min:
            yRange === "low"
              ? Math.min(...data.map((d) => d.value)) / 1.1
              : undefined,
          max:
            yRange === "high"
              ? Math.max(...data.map((d) => d.value)) * 1.1
              : undefined,
        }}
      >
        {chart}
        <Box marginTop="major-2" marginX="major-2">
          <Heading.H6 marginBottom={"major-2"}>Load Data</Heading.H6>
          <Flex flexWrap={"wrap"}>
            <Button onPress={() => setData(mockData)}>Data 1</Button>
            <Button onPress={() => setData(mockData2)}>Data 2</Button>
            <Button onPress={() => setData([...mockData, ...mockData2])}>
              Data 1 + Data 2
            </Button>
            <Button onPress={() => setData([...mockData2, ...mockData])}>
              Data 2 + Data 1
            </Button>
            <Button
              onPress={() => setData([...mockData2, ...mockData, ...mockData2])}
            >
              Data 2 + Data 1 + Data 2
            </Button>
            <Button
              onPress={() =>
                setData([
                  ...mockData2,
                  ...mockData,
                  ...mockData2,
                  ...mockData,
                  ...mockData,
                  ...mockData2,
                  ...mockData2,
                  ...mockData,
                  ...mockData2,
                  ...mockData,
                  ...mockData,
                  ...mockData2,
                ])
              }
            >
              V large data
            </Button>
            <Button onPress={toggleYRange}>
              {`${yRange || "Set"} Y Domain`}
            </Button>
            <Button onPress={toggleMultiData}>{`Multi Data`}</Button>
            <Button onPress={togglePartialDay}>{`Partial Day`}</Button>
            <Button
              onPress={() => setToggleMinMaxLabels((p) => !p)}
            >{`Toggle min/max labels`}</Button>
          </Flex>
        </Box>
        {!multiData && (
          <Stack padding="major-2" spacing="major-1">
            <Heading.H6>PriceText</Heading.H6>
            <Flex>
              <Text fontWeight="500">Formatted: </Text>
              <LineChart.PriceText />
            </Flex>
            <Flex>
              <Text fontWeight="500">Value: </Text>
              <LineChart.PriceText variant="value" />
            </Flex>
            <Flex>
              <Text fontWeight="500">Custom format: </Text>
              <LineChart.PriceText
                format={(d) => {
                  "worklet"
                  return d.formatted ? `$${d.formatted} AUD` : ""
                }}
              />
            </Flex>
            <Heading.H6>DatetimeText</Heading.H6>
            <Flex>
              <Text fontWeight="500">Formatted: </Text>
              <LineChart.DatetimeText />
            </Flex>
            <Flex>
              <Text fontWeight="500">Value: </Text>
              <LineChart.DatetimeText variant="value" />
            </Flex>
            <Flex>
              <Text fontWeight="500">Custom format: </Text>
              <LineChart.DatetimeText
                locale="en-AU"
                options={{
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                }}
              />
            </Flex>
          </Stack>
        )}
      </LineChart.Provider>
    </>
  )
}

export default Graph
