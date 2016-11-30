# Usage

Clone this repository:

```
git clone https://github.com/RocketChat/Rocket.Chat.Docs.Generator.git
cd Rocket.Chat.Docs.Generator
```

Install dependencies using `npm`:

```
npm i
```

Fetch the [Rocket.Chat.Docs](https://github.com/RocketChat/Rocket.Chat.Docs) source files, into a `src` directory or you could also symlink a local copy of the docs repo instead of fetching it, e.g. `ln -s ../rocket.chat.docs src` - assuming docs were pulled as a sibling to the generator.

Compile assets and serve the transformed pages locally:

```
npm run serve
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
