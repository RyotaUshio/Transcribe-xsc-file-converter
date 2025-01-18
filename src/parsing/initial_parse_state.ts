import { ParseState } from "./types"

export const initialParseState: ParseState = {
  data: {
    soundFile: {},
    markers: {
      list: [],
      autonumbering: { byMarkerType: {} },
    },
    textBlocks: { list: [], font: {} },
    loops: { list: [] },
  },
  currentSection: null,
}
