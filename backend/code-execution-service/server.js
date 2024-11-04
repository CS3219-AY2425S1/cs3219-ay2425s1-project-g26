const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const EXECUTION_TIMEOUT = 5000;

const python_tc = (input, output) => {
  return `
if __name__ == "__main__":
    user_solution = solution(${input})
    print(user_solution)
    print(user_solution == ${output})`;
};

const java_import = `import java.util.*;\n`;

const java_tc = (params, input, output, return_type) => {
  const isArray = return_type.includes("[]");
  let eval;
  if (isArray) {
    eval = `
    System.out.println(Arrays.toString(user_solution));
    System.out.println(Arrays.equals(user_solution, tc_output));`;
  } else {
    eval = `
    System.out.println(user_solution);
    System.out.println(String.valueOf(user_solution).equals(String.valueOf(tc_output)));`;
  }

  return `
  public class Main {
    public static void main(String[] args) {
      ${input}
      ${return_type} user_solution = Solution.solution(${params});
      ${return_type} tc_output = ${output};
      ${eval}
    }
  }`;
};

const runInDocker = (language, code) => {
  return new Promise((resolve, reject) => {
    const dockerImage =
      language === "python"
        ? "python:3.9"
        : language === "java"
        ? "openjdk:11"
        : "node:14";

    const fileName =
      language === "python"
        ? "code.py"
        : language === "java"
        ? "Main.java"
        : "code.js";

    const command = `
      echo '${code}' > ${fileName} &&
      docker run --rm -v $(pwd):/usr/src/app -v /tmp/.java:/root/.java -w /usr/src/app ${dockerImage} 
      ${
        language === "python"
          ? "python code.py"
          : language === "java"
          ? "javac Main.java && java -Djava.util.prefs.systemRoot=/root/.java -Djava.util.prefs.userRoot=/root/.java -classpath . Main" 
          : "node code.js"
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
    const python_in = testcase.python.input;
    const python_out = testcase.python.output;
    const java_params = testcase.java.params;
    const java_in = testcase.java.input;
    const java_out = testcase.java.output;
    const java_rt = testcase.java.return_type;

    switch (language.toLowerCase()) {
      case "python":
        if (!isTestcaseAvailable) {
          output.push(await runPython(code.replace(/'/g, "\"")));
          break;
        }

        for (let i = 0; i < python_in.length; i++) {
          const formatted = python_tc(python_in[i], python_out[i]);
          const response = await runPython((code + formatted).replace(/'/g, "\""));
          const split_response = response.split("\n").slice(-3, -1);
          output.push(split_response[0]);
          result.push(split_response[1] === "True");
        }
        break;

      case "java":
        if (!isTestcaseAvailable) {
          output.push(await runJava(code));
          break;
        }

        for (let i = 0; i < java_in.length; i++) {
          const formatted = java_tc(
            java_params,
            java_in[i],
            java_out[i],
            java_rt
          );
          // console.log(java_import + code + formatted);
          const response = await runJava(java_import + code + formatted);          
          const split_response = response.split("\n").slice(-3, -1);
          output.push(split_response[0]);
          result.push(split_response[1] === "true");
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
