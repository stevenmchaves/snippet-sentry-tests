import arg from "arg";
import _ from "lodash";
import fs from "fs-extra";

// Function to read all files recursively in a directory
async function readFilesRecursively(
  dir: string,
  fileList: string[] = []
): Promise<string[]> {
  const files = await fs.readdir(dir);
  await Promise.all(
    files.map(async (file) => {
      const filePath = `${dir}/${file}`;
      const fileStat = await fs.stat(filePath);
      if (fileStat.isDirectory()) {
        await readFilesRecursively(filePath, fileList);
      } else if (_.endsWith(filePath, ".feature")) {
        fileList.push(filePath);
      }
    })
  );
  return fileList;
}

// Function to extract scenarios and create a map
function extractScenarios(text: string): Map<string, string> {
  const scenarioMap = new Map<string, string>();
  const scenarioRegex = /Scenario: (.+)/g;
  const match = scenarioRegex.exec(text);

  while (match !== null) {
    const scenario = _.trim(match[1]);
    scenarioMap.set(scenario, "Example Store-TEST-ID");
  }

  return scenarioMap;
}

// Function to process all .feature files in a directory
async function processFeatureFiles(dir: string): Promise<Map<string, string>> {
  const scenarioMap = new Map<string, string>();
  const featureFiles = await readFilesRecursively(dir);

  await Promise.all(
    featureFiles.map(async (file) => {
      const content = await fs.readFile(file, "utf-8");
      const fileScenarios = extractScenarios(content);
      fileScenarios.forEach((value, key) => {
        scenarioMap.set(key, value);
      });
    })
  );

  return scenarioMap;
}

// Parse command-line arguments
const args = arg({
  "--dir": String,
  "-d": "--dir",
});

const directoryPath = args["--dir"];

if (!directoryPath) {
  console.error("Please provide a directory path using --dir or -d.");
  process.exit(1);
}

// Extract scenarios from all .feature files in the directory
processFeatureFiles(directoryPath)
  .then((scenarioMap) => {
    // Output the map to a file
    const outputFilePath = `${__dirname}/scenarioMap.json`;
    fs.writeFile(
      outputFilePath,
      JSON.stringify(Array.from(scenarioMap.entries()), null, 2)
    )
      .then(() => {
        console.log(`Scenario map has been written to ${outputFilePath}`);
      })
      .catch((err) => {
        console.error("Error writing to file:", err);
      });
  })
  .catch((err) => {
    console.error("Error processing feature files:", err);
  });
