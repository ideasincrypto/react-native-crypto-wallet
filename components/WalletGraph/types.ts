export interface GraphPoint {
  value: number
  date: Date
}

export interface GraphXRange {
  min: Date
  max: Date
}

export interface GraphYRange {
  min: number
  max: number
}

export interface GraphPathRange {
  x: GraphXRange
  y: GraphYRange
}

export type GraphRange = Partial<GraphPathRange>
