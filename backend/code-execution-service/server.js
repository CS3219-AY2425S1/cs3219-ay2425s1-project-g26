const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Function to run Python code
const runPython = (code) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "script.py");
    fs.writeFileSync(filePath, code); // Save code to a file

    exec(`python3 ${filePath}`, (error, stdout, stderr) => {
      // Clean up
      fs.unlinkSync(filePath);
      if (error) {
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
};

// Function to run Java code
const runJava = (code) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "Main.java");
    fs.writeFileSync(filePath, code); // Save code to a file

    // Compile the Java code
    exec(`javac ${filePath}`, (compileError, compileStdout, compileStderr) => {
      // Log compile output and error
      console.log("Compile stdout:", compileStdout);
      console.log("Compile stderr:", compileStderr);

      if (compileError) {
        // Clean up
        fs.unlinkSync(filePath);
        return reject(`Compilation Error: ${compileStderr || "Unknown error"}`);
      }

      // Execute the Java program
      exec(`java -cp ${__dirname} Main`, (runError, stdout, stderr) => {
        // Clean up
        fs.unlinkSync(filePath);
        fs.unlinkSync(path.join(__dirname, "Main.class"));

        // Log execution output and error
        console.log("Execution stdout:", stdout);
        console.log("Execution stderr:", stderr);

        if (runError) {
          return reject(`Runtime Error: ${stderr || "Unknown error"}`);
        }
        resolve(stdout);
      });
    });
  });
};



// Function to run C code
const runC = (code) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "program.c");
    fs.writeFileSync(filePath, code); // Save code to a file

    exec(`gcc ${filePath} -o program`, (compileError) => {
      if (compileError) {
        // Clean up
        fs.unlinkSync(filePath);
        return reject(compileError.stderr);
      }

      exec(`./program`, (runError, stdout, stderr) => {
        // Clean up
        fs.unlinkSync(filePath);
        fs.unlinkSync(path.join(__dirname, "program"));
        if (runError) {
          return reject(stderr);
        }
        resolve(stdout);
      });
    });
  });
};

// Function to run JavaScript code
const runJavaScript = (code) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "script.js");
    fs.writeFileSync(filePath, code); // Save code to a file

    exec(`node ${filePath}`, (error, stdout, stderr) => {
      // Clean up
      fs.unlinkSync(filePath);
      if (error) {
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
};

app.post("/run-code", async (req, res) => {
  const { code, language } = req.body;

  try {
    let output;

    switch (language.toLowerCase()) {
      case "python":
        output = await runPython(code);
        break;
      case "java":
        output = await runJava(code);
        break;
      case "c":
        output = await runC(code);
        break;
      case "javascript":
        output = await runJavaScript(code);
        break;
      default:
        return res.status(400).json({ error: "Unsupported language" });
    }

    return res.status(200).json({ output });
  } catch (error) {
    console.error("Error running code:", error);
    const errorMessage = error.message || error; 
    return res.status(500).json({ error: errorMessage });
  }
});


const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
