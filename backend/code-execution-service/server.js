const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const EXECUTION_TIMEOUT = 5000;

const pythonTestcase = (input, output) => {
  return `
if __name__ == "__main__":
    userSolution = solution(${input})
    print(userSolution)
    print(userSolution == ${output})`;
};

const javaImport = `import java.util.*;\n`;

const javaTestcase = (parameter, input, output, returnType) => {
  const isArray = returnType.includes("[]");
  let eval;
  if (isArray) {
    eval = `
    System.out.println(Arrays.toString(userSolution));
    System.out.println(Arrays.equals(userSolution, testcaseOutput));`;
  } else {
    eval = `
    System.out.println(userSolution);
    System.out.println(String.valueOf(userSolution).equals(String.valueOf(testcaseOutput)));`;
  }

  return `
  public class Main {
    public static void main(String[] args) {
      ${input}
      ${returnType} userSolution = Solution.solution(${parameter});
      ${returnType} testcaseOutput = ${output};
      ${eval}
    }
  }`;
};

const runInDocker = (language, code) => {
  return new Promise((resolve, reject) => {
    const dockerImage =
      language === "python"
        ? "python:3.12.7-slim"
        : language === "java"
        ? "openjdk:17"
        : "node:18";

    const fileName =
      language === "python"
        ? "solution.py"
        : language === "java"
        ? "Main.java"
        : "solution.js";

    const command = `
      echo '${code}' > ${fileName} &&
      docker run --rm -v $(pwd):/usr/src/app -v /tmp/.java:/root/.java -w /usr/src/app ${dockerImage} 
      ${
        language === "python"
          ? "python solution.py"
          : language === "java"
          ? "javac Main.java && java -Djava.util.prefs.systemRoot=/root/.java -Djava.util.prefs.userRoot=/root/.java -classpath . Main" 
          : "node solution.js"
      }`;

    exec(command, (error, stdout, stderr) => {
      if (error || stderr) {
        const errorMessage = stderr || error.message || "Unknown error";
        const cleanErrorMessage = errorMessage
          .split("\n")
          .filter((line) => !line.includes("INFO:"))
          .join("\n");

        console.error(
          `${language.charAt(0).toUpperCase() + language.slice(1)} Error:`,
          cleanErrorMessage
        );
        return reject({
          message: `${
            language.charAt(0).toUpperCase() + language.slice(1)
          } Error`,
          error: cleanErrorMessage,
        });
      }

      let cleanStdout = stdout;
      if (language === "java") {
        const jshellIntroEndIndex = stdout.indexOf("jshell> ");
        cleanStdout =
          jshellIntroEndIndex !== -1
            ? stdout.slice(jshellIntroEndIndex + "jshell> ".length).trim()
            : stdout;
      }
      console.log(
        `${language.charAt(0).toUpperCase() + language.slice(1)} Output:`,
        cleanStdout
      );
      resolve(cleanStdout);
    });
  });
};

const runPython = (code) => runInDocker("python", code);

const runJava = (code) => runInDocker("java", code);

const runJavaScript = (code) => runInDocker("javascript", code);

app.post("/run-code", async (req, res) => {
  const { code, language, testcase } = req.body;
  let output = [];
  let result = [];
  try {
    const isTestcaseAvailable = testcase.isAvailable;
    const pythonInput = testcase.python.input;
    const pythonOutput = testcase.python.output;
    const parameter = testcase.python.params;
    const javaInput = testcase.java.input;
    const javaOutput = testcase.java.output;
    const javaReturnType = testcase.java.return_type;

    switch (language.toLowerCase()) {
      case "python":
        if (!isTestcaseAvailable) {
          output.push(await runPython(code.replace(/'/g, "\"")));
          break;
        }

        for (let i = 0; i < pythonInput.length; i++) {
          const formatted = pythonTestcase(pythonInput[i], pythonOutput[i]);
          const response = await runPython((code + formatted).replace(/'/g, "\""));
          const splitResponse = response.split("\n").slice(-3, -1);
          output.push(splitResponse[0]);
          result.push(splitResponse[1] === "True");
        }
        break;

      case "java":
        if (!isTestcaseAvailable) {
          output.push(await runJava(code));
          break;
        }

        for (let i = 0; i < javaInput.length; i++) {
          const formatted = javaTestcase(
            parameter,
            javaInput[i],
            javaOutput[i],
            javaReturnType
          );
          const response = await runJava(javaImport + code + formatted);
          const splitResponse = response.split("\n").slice(-2);
          output.push(splitResponse[0]);
          result.push(splitResponse[1] === "true");
        }
        break;

      case "javascript":
        output.push(await runJavaScript(code));
        break;

      default:
        return res.status(400).json({ error: "Unsupported language" });
    }

    return res.status(200).json({ output, result });
  } catch (error) {
    console.error("Error running code:", error.error);
    return res.status(500).json({
      error: error.message,
      details: error.error,
    });
  }
});

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
