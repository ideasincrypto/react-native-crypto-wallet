/* eslint-disable */

/**
 * Reanimated compatible fork of https://github.com/pbeshai/d3-interpolate-path
 */

//////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * de Casteljau's algorithm for drawing and splitting bezier curves.
 * Inspired by https://pomax.github.io/bezierinfo/
 *
 * @param {Number[][]} points Array of [x,y] points: [start, control1, control2, ..., end]
 *   The original segment to split.
 * @param {Number} t Where to split the curve (value between [0, 1])
 * @return {Object} An object { left, right } where left is the segment from 0..t and
 *   right is the segment from t..1.
 */
const decasteljau = (points, t): any => {
  "worklet"

  const left = []
  const right = []

  const decasteljauRecurse = (points, t): any => {
    "worklet"

    if (points.length === 1) {
      left.push(points[0])
      right.push(points[0])
    } else {
      const newPoints = Array(points.length - 1)

      for (let i = 0; i < newPoints.length; i++) {
        if (i === 0) {
          left.push(points[0])
        }
        if (i === newPoints.length - 1) {
          right.push(points[i + 1])
        }

        newPoints[i] = [
          (1 - t) * points[i][0] + t * points[i + 1][0],
          (1 - t) * points[i][1] + t * points[i + 1][1],
        ]
      }

      decasteljauRecurse(newPoints, t)
    }
  }

  if (points.length) {
    decasteljauRecurse(points, t)
  }

  return { left, right: right.reverse() }
}

/**
 * Convert segments represented as points back into a command object
 *
 * @param {Number[][]} points Array of [x,y] points: [start, control1, control2, ..., end]
 *   Represents a segment
 * @return {Object} A command object representing the segment.
 */
const pointsToCommand = (points): any => {
  "worklet"

  const command = {}

  if (points.length === 4) {
    command.x2 = points[2][0]
    command.y2 = points[2][1]
  }
  if (points.length >= 3) {
    command.x1 = points[1][0]
    command.y1 = points[1][1]
  }

  command.x = points[points.length - 1][0]
  command.y = points[points.length - 1][1]

  if (points.length === 4) {
    // start, control1, control2, end
    command.type = "C"
  } else if (points.length === 3) {
    // start, control, end
    command.type = "Q"
  } else {
    // start, end
    command.type = "L"
  }

  return command
}

/**
 * Runs de Casteljau's algorithm enough times to produce the desired number of segments.
 *
 * @param {Number[][]} points Array of [x,y] points for de Casteljau (the initial segment to split)
 * @param {Number} segmentCount Number of segments to split the original into
 * @return {Number[][][]} Array of segments
 */
const splitCurveAsPoints = (points, segmentCount): any => {
  "worklet"

  segmentCount = segmentCount || 2

  const segments = []
  let remainingCurve = points
  const tIncrement = 1 / segmentCount

  // x-----x-----x-----x
  // t=  0.33   0.66   1
  // x-----o-----------x
  // r=  0.33
  //       x-----o-----x
  // r=         0.5  (0.33 / (1 - 0.33))  === tIncrement / (1 - (tIncrement * (i - 1))

  // x-----x-----x-----x----x
  // t=  0.25   0.5   0.75  1
  // x-----o----------------x
  // r=  0.25
  //       x-----o----------x
  // r=         0.33  (0.25 / (1 - 0.25))
  //             x-----o----x
  // r=         0.5  (0.25 / (1 - 0.5))

  for (let i = 0; i < segmentCount - 1; i++) {
    const tRelative = tIncrement / (1 - tIncrement * i)
    const split = decasteljau(remainingCurve, tRelative)
    segments.push(split.left)
    remainingCurve = split.right
  }

  // last segment is just to the end from the last point
  segments.push(remainingCurve)

  return segments
}

/**
 * Convert command objects to arrays of points, run de Casteljau's algorithm on it
 * to split into to the desired number of segments.
 *
 * @param {Object} commandStart The start command object
 * @param {Object} commandEnd The end command object
 * @param {Number} segmentCount The number of segments to create
 * @return {Object[]} An array of commands representing the segments in sequence
 */
export const splitCurve = (commandStart, commandEnd, segmentCount): any => {
  "worklet"

  const points = [[commandStart.x, commandStart.y]]
  if (commandEnd.x1 != null) {
    points.push([commandEnd.x1, commandEnd.y1])
  }
  if (commandEnd.x2 != null) {
    points.push([commandEnd.x2, commandEnd.y2])
  }
  points.push([commandEnd.x, commandEnd.y])

  return splitCurveAsPoints(points, segmentCount).map(pointsToCommand)
}

/**
 * List of params for each command type in a path `d` attribute
 */
const typeMap = {
  M: ["x", "y"],
  L: ["x", "y"],
  H: ["x"],
  V: ["y"],
  C: ["x1", "y1", "x2", "y2", "x", "y"],
  S: ["x2", "y2", "x", "y"],
  Q: ["x1", "y1", "x", "y"],
  T: ["x", "y"],
  A: ["rx", "ry", "xAxisRotation", "largeArcFlag", "sweepFlag", "x", "y"],
  Z: [],
}

// Add lower case entries too matching uppercase (e.g. 'm' == 'M')
Object.keys(typeMap).forEach((key) => {
  typeMap[key.toLowerCase()] = typeMap[key]
})

const arrayOfLength = (length, value): any => {
  "worklet"

  const array = Array(length)
  for (let i = 0; i < length; i++) {
    array[i] = value
  }

  return array
}

/**
 * Converts a command object to a string to be used in a `d` attribute
 * @param {Object} command A command object
 * @return {String} The string for the `d` attribute
 */
const commandToString = (command): any => {
  "worklet"

  return `${command.type}${typeMap[command.type]
    .map((p) => command[p])
    .join(",")}`
}

/**
 * Converts command A to have the same type as command B.
 *
 * e.g., L0,5 -> C0,5,0,5,0,5
 *
 * Uses these rules:
 * x1 <- x
 * x2 <- x
 * y1 <- y
 * y2 <- y
 * rx <- 0
 * ry <- 0
 * xAxisRotation <- read from B
 * largeArcFlag <- read from B
 * sweepflag <- read from B
 *
 * @param {Object} aCommand Command object from path `d` attribute
 * @param {Object} bCommand Command object from path `d` attribute to match against
 * @return {Object} aCommand converted to type of bCommand
 */
const convertToSameType = (aCommand, bCommand) => {
  "worklet"

  const conversionMap = {
    x1: "x",
    y1: "y",
    x2: "x",
    y2: "y",
  }

  const readFromBKeys = ["xAxisRotation", "largeArcFlag", "sweepFlag"]

  // convert (but ignore M types)
  if (aCommand.type !== bCommand.type && bCommand.type.toUpperCase() !== "M") {
    const aConverted = {}
    Object.keys(bCommand).forEach((bKey) => {
      const bValue = bCommand[bKey]
      // first read from the A command
      let aValue = aCommand[bKey]

      // if it is one of these values, read from B no matter what
      if (aValue === undefined) {
        if (readFromBKeys.includes(bKey)) {
          aValue = bValue
        } else {
          // if it wasn't in the A command, see if an equivalent was
          if (aValue === undefined && conversionMap[bKey]) {
            aValue = aCommand[conversionMap[bKey]]
          }

          // if it doesn't have a converted value, use 0
          if (aValue === undefined) {
            aValue = 0
          }
        }
      }

      aConverted[bKey] = aValue
    })

    // update the type to match B
    aConverted.type = bCommand.type
    aCommand = aConverted
  }

  return aCommand
}

/**
 * Interpolate between command objects commandStart and commandEnd segmentCount times.
 * If the types are L, Q, or C then the curves are split as per de Casteljau's algorithm.
 * Otherwise we just copy commandStart segmentCount - 1 times, finally ending with commandEnd.
 *
 * @param {Object} commandStart Command object at the beginning of the segment
 * @param {Object} commandEnd Command object at the end of the segment
 * @param {Number} segmentCount The number of segments to split this into. If only 1
 *   Then [commandEnd] is returned.
 * @return {Object[]} Array of ~segmentCount command objects between commandStart and
 *   commandEnd. (Can be segmentCount+1 objects if commandStart is type M).
 */
function splitSegment(commandStart, commandEnd, segmentCount) {
  "worklet"

  let segments = []

  // line, quadratic bezier, or cubic bezier
  if (
    commandEnd.type === "L" ||
    commandEnd.type === "Q" ||
    commandEnd.type === "C"
  ) {
    segments = segments.concat(
      splitCurve(commandStart, commandEnd, segmentCount)
    )

    // general case - just copy the same point
  } else {
    const copyCommand = Object.assign({}, commandStart)

    // convert M to L
    if (copyCommand.type === "M") {
      copyCommand.type = "L"
    }

    segments = segments.concat(
      arrayOfLength(segmentCount - 1).map(() => copyCommand)
    )
    segments.push(commandEnd)
  }

  return segments
}
/**
 * Extends an array of commandsToExtend to the length of the referenceCommands by
 * splitting segments until the number of commands match. Ensures all the actual
 * points of commandsToExtend are in the extended array.
 *
 * @param {Object[]} commandsToExtend The command object array to extend
 * @param {Object[]} referenceCommands The command object array to match in length
 * @param {Function} excludeSegment a function that takes a start command object and
 *   end command object and returns true if the segment should be excluded from splitting.
 * @return {Object[]} The extended commandsToExtend array
 */
function extend(commandsToExtend, referenceCommands, excludeSegment) {
  "worklet"

  // compute insertion points:
  // number of segments in the path to extend
  const numSegmentsToExtend = commandsToExtend.length - 1

  // number of segments in the reference path.
  const numReferenceSegments = referenceCommands.length - 1

  // this value is always between [0, 1].
  const segmentRatio = numSegmentsToExtend / numReferenceSegments

  // create a map, mapping segments in referenceCommands to how many points
  // should be added in that segment (should always be >= 1 since we need each
  // point itself).
  // 0 = segment 0-1, 1 = segment 1-2, n-1 = last vertex
  const countPointsPerSegment = arrayOfLength(numReferenceSegments).reduce(
    (accum, d, i) => {
      let insertIndex = Math.floor(segmentRatio * i)

      // handle excluding segments
      if (
        excludeSegment &&
        insertIndex < commandsToExtend.length - 1 &&
        excludeSegment(
          commandsToExtend[insertIndex],
          commandsToExtend[insertIndex + 1]
        )
      ) {
        // set the insertIndex to the segment that this point should be added to:

        // round the insertIndex essentially so we split half and half on
        // neighbouring segments. hence the segmentRatio * i < 0.5
        const addToPriorSegment = (segmentRatio * i) % 1 < 0.5

        // only skip segment if we already have 1 point in it (can't entirely remove a segment)
        if (accum[insertIndex]) {
          // TODO - Note this is a naive algorithm that should work for most d3-area use cases
          // but if two adjacent segments are supposed to be skipped, this will not perform as
          // expected. Could be updated to search for nearest segment to place the point in, but
          // will only do that if necessary.

          // add to the prior segment
          if (addToPriorSegment) {
            if (insertIndex > 0) {
              insertIndex -= 1

              // not possible to add to previous so adding to next
            } else if (insertIndex < commandsToExtend.length - 1) {
              insertIndex += 1
            }
            // add to next segment
          } else if (insertIndex < commandsToExtend.length - 1) {
            insertIndex += 1

            // not possible to add to next so adding to previous
          } else if (insertIndex > 0) {
            insertIndex -= 1
          }
        }
      }

      accum[insertIndex] = (accum[insertIndex] || 0) + 1

      return accum
    },
    []
  )

  // extend each segment to have the correct number of points for a smooth interpolation
  const extended = countPointsPerSegment.reduce((extended, segmentCount, i) => {
    // if last command, just add `segmentCount` number of times
    if (i === commandsToExtend.length - 1) {
      const lastCommandCopies = arrayOfLength(
        segmentCount,
        Object.assign({}, commandsToExtend[commandsToExtend.length - 1])
      )

      // convert M to L
      if (lastCommandCopies[0].type === "M") {
        lastCommandCopies.forEach((d) => {
          d.type = "L"
        })
      }
      return extended.concat(lastCommandCopies)
    }

    // otherwise, split the segment segmentCount times.
    return extended.concat(
      splitSegment(commandsToExtend[i], commandsToExtend[i + 1], segmentCount)
    )
  }, [])

  // add in the very first point since splitSegment only adds in the ones after it
  extended.unshift(commandsToExtend[0])

  return extended
}

/**
 * Takes a path `d` string and converts it into an array of command
 * objects. Drops the `Z` character.
 *
 * @param {String|null} d A path `d` string
 */
export function pathCommandsFromString(d) {
  "worklet"

  // split into valid tokens
  const tokens = (d || "").match(/[MLCSTQAHVZmlcstqahv]|-?[\d.e+-]+/g) || []
  const commands = []
  let commandArgs
  let command

  // iterate over each token, checking if we are at a new command
  // by presence in the typeMap
  for (let i = 0; i < tokens.length; ++i) {
    commandArgs = typeMap[tokens[i]]

    // new command found:
    if (commandArgs) {
      command = {
        type: tokens[i],
      }

      // add each of the expected args for this command:
      for (let a = 0; a < commandArgs.length; ++a) {
        command[commandArgs[a]] = +tokens[i + a + 1]
      }

      // need to increment our token index appropriately since
      // we consumed token args
      i += commandArgs.length

      commands.push(command)
    }
  }
  return commands
}

/**
 * Interpolate from A to B by extending A and B during interpolation to have
 * the same number of points. This allows for a smooth transition when they
 * have a different number of points.
 *
 * Ignores the `Z` command in paths unless both A and B end with it.
 *
 * This function works directly with arrays of command objects instead of with
 * path `d` strings (see interpolatePath for working with `d` strings).
 *
 * @param {Object[]} aCommandsInput Array of path commands
 * @param {Object[]} bCommandsInput Array of path commands
 * @param {Function} excludeSegment a function that takes a start command object and
 *   end command object and returns true if the segment should be excluded from splitting.
 * @returns {Function} Interpolation function that maps t ([0, 1]) to an array of path commands.
 */
export function interpolatePathCommands(
  aCommandsInput,
  bCommandsInput,
  excludeSegment
) {
  "worklet"

  // make a copy so we don't mess with the input arrays
  let aCommands = aCommandsInput == null ? [] : aCommandsInput.slice()
  let bCommands = bCommandsInput == null ? [] : bCommandsInput.slice()

  // both input sets are empty, so we don't interpolate
  if (!aCommands.length && !bCommands.length) {
    return function nullInterpolator() {
      "worklet"

      return []
    }
  }

  // do we add Z during interpolation? yes if both have it. (we'd expect both to have it or not)
  const addZ =
    (aCommands.length === 0 || aCommands[aCommands.length - 1].type === "Z") &&
    (bCommands.length === 0 || bCommands[bCommands.length - 1].type === "Z")

  // we temporarily remove Z
  if (aCommands.length > 0 && aCommands[aCommands.length - 1].type === "Z") {
    aCommands.pop()
  }
  if (bCommands.length > 0 && bCommands[bCommands.length - 1].type === "Z") {
    bCommands.pop()
  }

  // if A is empty, treat it as if it used to contain just the first point
  // of B. This makes it so the line extends out of from that first point.
  if (!aCommands.length) {
    aCommands.push(bCommands[0])

    // otherwise if B is empty, treat it as if it contains the first point
    // of A. This makes it so the line retracts into the first point.
  } else if (!bCommands.length) {
    bCommands.push(aCommands[0])
  }

  // extend to match equal size
  const numPointsToExtend = Math.abs(bCommands.length - aCommands.length)

  if (numPointsToExtend !== 0) {
    // B has more points than A, so add points to A before interpolating
    if (bCommands.length > aCommands.length) {
      aCommands = extend(aCommands, bCommands, excludeSegment)

      // else if A has more points than B, add more points to B
    } else if (bCommands.length < aCommands.length) {
      bCommands = extend(bCommands, aCommands, excludeSegment)
    }
  }

  // commands have same length now.
  // convert commands in A to the same type as those in B
  aCommands = aCommands.map((aCommand, i) =>
    convertToSameType(aCommand, bCommands[i])
  )

  // create mutable interpolated command objects
  const interpolatedCommands = aCommands.map((aCommand) => aCommand)

  if (addZ) {
    interpolatedCommands.push({ type: "Z" })
    aCommands.push({ type: "Z" }) // required for when returning at t == 0
  }

  return function pathCommandInterpolator(t) {
    "worklet"

    // at 1 return the final value without the extensions used during interpolation
    if (t === 1) {
      return bCommandsInput == null ? [] : bCommandsInput
    }

    // work with aCommands directly since interpolatedCommands are mutated
    if (t === 0) {
      return aCommands
    }

    // interpolate the commands using the mutable interpolated command objs
    for (let i = 0; i < interpolatedCommands.length; ++i) {
      // if (interpolatedCommands[i].type === 'Z') continue;

      const aCommand = aCommands[i]
      const bCommand = bCommands[i]
      const interpolatedCommand = interpolatedCommands[i]
      for (let j = 0; j < typeMap[interpolatedCommand.type].length; j++) {
        const arg = typeMap[interpolatedCommand.type][j]
        interpolatedCommand[arg] = (1 - t) * aCommand[arg] + t * bCommand[arg]

        // do not use floats for flags (#27), round to integer
        if (arg === "largeArcFlag" || arg === "sweepFlag") {
          interpolatedCommand[arg] = Math.round(interpolatedCommand[arg])
        }
      }
    }

    return interpolatedCommands
  }
}

/**
 * Interpolate from A to B by extending A and B during interpolation to have
 * the same number of points. This allows for a smooth transition when they
 * have a different number of points.
 *
 * Ignores the `Z` character in paths unless both A and B end with it.
 *
 * @param {String} a The `d` attribute for a path
 * @param {String} b The `d` attribute for a path
 * @param {Function} excludeSegment a function that takes a start command object and
 *   end command object and returns true if the segment should be excluded from splitting.
 * @returns {Function} Interpolation function that maps t ([0, 1]) to a path `d` string.
 */
export function interpolatePath(a, b, excludeSegment) {
  "worklet"

  const aCommands = pathCommandsFromString(a)
  const bCommands = pathCommandsFromString(b)

  if (!aCommands.length && !bCommands.length) {
    return function nullInterpolator() {
      "worklet"

      return ""
    }
  }

  const commandInterpolator = interpolatePathCommands(
    aCommands,
    bCommands,
    excludeSegment
  )

  return function pathStringInterpolator(t) {
    "worklet"

    // at 1 return the final value without the extensions used during interpolation
    if (t === 1) {
      return b == null ? "" : b
    }

    const interpolatedCommands = commandInterpolator(t)

    // convert to a string (fastest concat: https://jsperf.com/join-concat/150)
    let interpolatedString = ""
    for (let i = 0; i < interpolatedCommands.length; i++) {
      const interpolatedCommand = interpolatedCommands[i]
      interpolatedString += commandToString(interpolatedCommand)
    }

    return interpolatedString
  }
}