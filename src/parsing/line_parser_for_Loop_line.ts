import { produce } from "immer"
import { splitLineIntoParts } from "./lex"
import { assertCurrentSection } from "./line_parser_helpers"
import { ParseState } from "./types"
import { timestampToObject } from "./timestamp"

export function parseLoop(line: string, currentState: ParseState): ParseState {
    assertCurrentSection("Loops", currentState)

    // L,1,1,3415162,35466,,White,,0:01:11.149200,0:00:00.738881
    const [
        loopType, // always "L"
        loopIndexStr, 
        _unknown1, // "1" or "0"
        _unknown2,
        _unknown3,
        _unknown4,
        color,
        _unknown5,
        loopStartStr,
        loopLengthStr,
    ] = splitLineIntoParts(line)

    return produce(currentState, (draftState) => {
        draftState.data.loops.list.push({
            index: parseInt(loopIndexStr),
            color,
            startTimestamp: timestampToObject(loopStartStr),
            lengthTimestamp: timestampToObject(loopLengthStr),
        })
    })
}