import * as yargs from "yargs"
import { parse } from "./parsing/parser"
import { readAllFromSource, InputSource } from "./io_utils"

// TODO if I am able to test these functions in cli_arg_parsing.ts, keep them in that file and in this file (index.ts), import them. Otherwise, delete cli_arg_parsing.ts and keep the functions in this file.

function chooseInputSource(filePaths: Array<string>): InputSource {
  if (filePaths[0] === "-" || filePaths.length === 0) {
    return { type: "stdin" }
  } else {
    const filePath = filePaths[0]
    return { type: "file", filePath }
  }
}

// Now that I extracted this function `parseArgv`, is this testable by Jest? Can it catch the errors/exit for bad arguments without stopping the whole test?
function parseArgv(argv: Array<string>) {
  const yargsArgv = yargs
    .usage("$0 [option] [file]")
    .example("$0 myTranscribeFile.xsc", "reading input with a file argument")
    .example(
      "cat myTranscribeFile.xsc | $0 > transcribeFileData.json",
      "converting input with stdin and stdout redirection"
    )
    .option("format", {
      alias: "f",
      choices: ["generic", "audacity_label_track"],
      default: "generic",
      description: "Data format to output",
    })
    .check((argv) => {
      const filePaths = argv._
      if (filePaths.length > 1) {
        throw new Error(
          "Multiple files were given as arguments, but only one file can be converted at a time. File paths: " +
            filePaths.join(",")
        )
      }
    })
    .version()
    .help()
    .exitProcess(false) // to make testing easier
    .parse(argv)

  if (yargsArgv.format === "audacity_label_track") {
    // TODO parse as generic JS object, then convert that to Audacity’s tab-delimited text format
    console.error("Sorry, we don’t support converting to that format yet.")
    process.exit(1)
  } else {
    // convert to generic JSON format

    const inputSource = chooseInputSource(yargsArgv._)
    return { inputSource, outputFormat: yargsArgv.format }
  }
}

const { inputSource, outputFormat } = parseArgv(process.argv)

let fileContentsPromise
// change a `false` to `true` for debug inputs
if (false) {
  const testFilePath = "./tests/relatively few markers/Windows ME Startup.xsc"
  fileContentsPromise = readAllFromSource({ type: "file", filePath: testFilePath })
} else if (false) {
  fileContentsPromise = readAllFromSource({ type: "stdin" })
} else {
  // real program behavior
  fileContentsPromise = readAllFromSource(inputSource)
}

fileContentsPromise
  .then((testFileContents) => {
    const parsed = parse(testFileContents)

    if (true) {
      // debug output
      console.error("Output JSON (but in JS syntax):")
      console.dir(parsed, { depth: null, colors: true })
    } else {
      // real output
      console.log(JSON.stringify(parsed, null, 2))
    }
  })
  .catch((err) => {
    throw err
  })
