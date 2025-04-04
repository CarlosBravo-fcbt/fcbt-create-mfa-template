# 🛠️ Custom React App Generator CLI

This CLI tool helps you quickly scaffold a custom React (UI) or full-stack (UI + API) application with built-in support for DevOps, modular folder structures, and dynamic configuration.

> Whether you're 21 or 100, this tool will save you hours of setup work by generating everything you need to kickstart development in seconds.

---

## 📦 Features

- ✅ Custom app name support (`--app-name`)
- ✅ UI-only or fullstack support
- ✅ Generates a scalable folder structure
- ✅ Pre-configured Webpack + DevOps YAMLs
- ✅ Auto-installs dependencies like React Router, Redux, Micro Frontends, and internal packages
- ✅ Cue file and build/deploy templates with variable replacement

---

## 🚀 Getting Started

### 1. Install Node.js

Make sure Node.js is installed. You can check with:

```bash
node -v
```

In your CLI tool root folder (where your package.json lives), run:

```shell
npm link
```

## Example of usage

```shell
./create-fcbt-custom-react-app.js fvhome-app
```

fvhome-app/
├── devops/
│   ├── build.yaml
│   ├── cue/
│   │   └── fvhome-app.cue
│   └── deploy.yaml
├── src/
│   ├── api/
│   └── ui/
│       ├── components/
│       ├── pages/
│       └── ...

- After running the command, go to the package.json and add in the scripts

```json
   "test": "jest --verbose",
   "test:watch": "jest --watch --verbose",
   "test:coverage": "jest --coverage --verbose"
```

- You might need to add the jest to the `tsconfig.ts` file if you have intellisense errors.

```json
  "types": ["node", "jest", "@testing-library/jest-dom",],
```

- As a Final Step, copy the folder to the path you want.
