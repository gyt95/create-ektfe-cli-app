{
  "name": "@<%= platformName %>/<%= projectName %>",
  "version": "1.0.0",
  "description": "",
  "main": "./src/index.ts",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@next/core": "workspace:^1.0.0",
    "@next/pro-components": "workspace:^1.0.0",
    "@<%= platformName %>/core": "workspace:^1.0.0"
  }
}
