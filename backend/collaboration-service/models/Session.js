const mongoose = require("mongoose");

const defaultCodes = {
    javascript: `// JavaScript code
const example = "raesa";
console.log(example);`,

    python: `# Python code
def main():
    example = "raesa"
    print(example)

if __name__ == "__main__":
    main()`,

    java: `// Java code
public class Main {
  public static void main(String[] args) {
    String example = "raesa";
    System.out.println(example);
  }
}`,
  };

const sessionSchema = new mongoose.Schema({
    sessionid: {
        type: String,
        required: true
    },
    codeWindows: {
        python: {
            type: String,
            default: defaultCodes.python
        },
        java: {
            type: String,
            default: defaultCodes.java
        },
        javascript: {
            type: String,
            default: defaultCodes.javascript
        }
    },
    pastAttempts: [
        {
            attemptNo: Number,
            language: String,
            content: String,
            testCases: Array
        }
    ],
    users: [
        {
            userId: String,
            username: String
        }
    ]
})

module.exports = mongoose.model("sessions", sessionSchema);