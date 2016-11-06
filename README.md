# Installation

1. Make sure you've installed all requirements

```
npm i -g gulp-cli
```

2. Clone this repository

```
git clone https://github.com/[username]/[repository]
```

3. Install dependencies using `npm`

```
npm i
```

4. Fetch the `Rocket.Chat.Docs` source files, into a `src` directory

```
gulp fetch
```

5. Compile assets and serve the transformed pages locally:

```
gulp
```

It will also create a `build` directory with the static pages.

# Workflow

1. Make edits to the files in `src` directory
2. metalsmith will *hot reload* and compile your changes
3. Test using a browser 
4. Repeat 1 if required
5. `git push` the tested final changes back to `Rocket.Chat.Docs`

## Note

If you are adding files or directories to the docs, the *hot reload* will not see those files/directories until you restart `gulp`.
