const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const EXECUTION_TIMEOUT = 5000;

const python_in = ['["h","e","l","l","o"]', '["H","a","n","n","a", "h"]']
const python_out = ['["o","l","l","e","h"]', '["h","a","n","n","a", "H"]']

const python_r = `
if __name__ == "__main__":
    print(solution(${python_in}) == ${python_out})`

const python_tc = (input, output) => {
  return `
if __name__ == "__main__":
    print(solution(${input}) == ${output})`
}


// Function to run Python code
const runPython = (code) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "script.py");
    fs.writeFileSync(filePath, code); // Save code to a file

    exec(
      `python3 ${filePath}`,
      { timeout: EXECUTION_TIMEOUT },
      (error, stdout, stderr) => {
        fs.unlinkSync(filePath); // Clean up
        if (error || stderr) {
          const errorMessage = stderr || error.message || "Unknown error";
          console.error("Python Error:", errorMessage);
          return reject({ message: "Python Error", error: errorMessage });
        }

        const split_output = stdout.split("\n");
        resolve(split_output[split_output.length - 2]);
      }
    );
  });
};

// Function to run Java code
const runJava = (code) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "Main.java");
    fs.writeFileSync(filePath, code); // Save code to a file

    // Compile the Java code
    exec(
      `javac ${filePath}`,
      { timeout: EXECUTION_TIMEOUT },
      (compileError, compileStdout, compileStderr) => {
        if (compileError || compileStderr) {
          fs.unlinkSync(filePath); // Clean up
          const errorMessage =
            compileStderr || compileError.message || "Unknown error";
          console.error("Java Compilation Error:", errorMessage);
          return reject({
            message: "Java Compilation Error",
            error: errorMessage,
          });
        }

        // Execute the Java program
        exec(
          `java -cp ${__dirname} Main`,
          { timeout: EXECUTION_TIMEOUT },
          (runError, stdout, stderr) => {
            fs.unlinkSync(filePath);
            fs.unlinkSync(path.join(__dirname, "Main.class")); // Clean up

            if (runError || stderr) {
              const errorMessage =
                stderr || runError.message || "Unknown error";
              console.error("Java Runtime Error:", errorMessage);
              return reject({
                message: "Java Runtime Error",
                error: errorMessage,
              });
            }
            resolve(stdout);
          }
        );
      }
    );
  });
};

// Function to run JavaScript code
const runJavaScript = (code) => {
  return new Promise((resolve, reject) => {
    console.log("HERE3");
    const filePath = path.join(__dirname, "script.js");
    fs.writeFileSync(filePath, code); // Save code to a file

    exec(
      `node ${filePath}`,
      { timeout: EXECUTION_TIMEOUT },
      (error, stdout, stderr) => {
        fs.unlinkSync(filePath); // Clean up
        if (error || stderr) {
          const errorMessage = stderr || error.message || "Unknown error";
          console.error("JavaScript Error:", errorMessage);
          return reject({ message: "JavaScript Error", error: errorMessage });
        }
        resolve(stdout);
      }
    );
  });
};

//Submit -- Need code, language, tc, starting --> Return tc

app.post("/run-code", async (req, res) => {
  const { code, language, testcase } = req.body;

  try {
    let output;
    let result = [];
    const python_in = testcase.python.input;
    const python_out = testcase.python.output;
    console.log("TC");
    console.log(python_in);
    console.log(python_out);
    const java_in = testcase.java.input
    const java_out = testcase.java.output
    for (let i = 0; i < python_in.length; i++) {
      
      switch (language.toLowerCase()) {
        case "python":

          formatted = python_tc(python_in[i], python_out[i]);
          output = await runPython(code + formatted);
          result.push(output == 'True')
          break;
        case "java":
          output = await runJava(code);
          break;
        case "javascript":
          output = await runJavaScript(code);
          break;
        default:
          return res.status(400).json({ error: "Unsupported language" });
      }
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
