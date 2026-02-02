# Desktop Portfolio

A cute desktop simulation portfolio website built with Vite and vanilla JavaScript. Features draggable windows, a taskbar, and an interactive terminal!

## Features

- Desktop-style UI with draggable, resizable windows
- Cute pastel gradient theme
- Interactive terminal with commands
- Responsive design
- Easy to customize

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:5173`

## Deploying to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `desktop-portfolio` (or whatever you prefer)
3. Don't initialize with README (we already have files)

### Step 2: Update the Base URL

Open `vite.config.js` and change the `base` to match your repository name:

```js
export default defineConfig({
  base: '/your-repo-name/',  // Change this!
  build: {
    outDir: 'dist'
  }
})
```

### Step 3: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Desktop portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. The workflow will automatically run and deploy your site!

### Step 5: Visit Your Site

After the workflow completes, your site will be live at:
```
https://audreyau.github.io/personal-portfolio/
```

### Colors & Theme

Edit `src/style.css` to change the `:root` variables:

```css
:root {
  --bg-gradient-start: #a8edea;    /* Background gradient start */
  --bg-gradient-end: #fed6e3;      /* Background gradient end */
  --accent-color: #667eea;         /* Primary accent color */
  --accent-secondary: #764ba2;     /* Secondary accent color */
}
```

### Terminal Commands

Add new commands in `src/main.js` in the `processCommand()` function.

## Project Structure

```
desktop-portfolio/
├── index.html          # Main HTML file
├── src/
│   ├── style.css       # All styles
│   └── main.js         # JavaScript logic
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies & scripts
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Pages deployment
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Technologies Used

- [Vite](https://vitejs.dev/) - Build tool
- Vanilla JavaScript
- CSS3 - Gradients, animations, flexbox/grid

## License

MIT
