import { produce } from "immer";
import { ParseState } from "./types";
import { assertCurrentSection } from "./line_parser_helpers";
import { splitLineIntoParts } from "./lex";
import { timestampToObject } from "./timestamp";

export function parseTextBlock(line: string, currentState: ParseState): ParseState {
    assertCurrentSection("TextBlocks", currentState);

    const [
        textBlockType, // always "T" 
        _unknown, // always "-1" for test files 
        height, 
        width, 
        color, 
        timestamp, 
        text, 
        fitWidthStr,
    ] = splitLineIntoParts(line);

    return produce(currentState, (draftState) => {
        draftState.data.textBlocks.list.push({
            timestamp: timestampToObject(timestamp),
            color,
            text,
            height: parseInt(height),
            width: parseInt(width),
            fitWidth: fitWidthStr === "1",
        });
    });
}

export function parseTextBlockFont(line: string, currentState: ParseState): ParseState {
    assertCurrentSection("TextBlocks", currentState);

    const [_key, _unknown, fontSize, fixedWidthFontName, proportionalWidthFontName] = splitLineIntoParts(line);

    return produce(currentState, (draftState) => {
        draftState.data.textBlocks.font = {
            fixedWidthFontName: fixedWidthFontName,
            proportionalWidthFontName: proportionalWidthFontName,
            size: parseInt(fontSize),
        };
    });
}
