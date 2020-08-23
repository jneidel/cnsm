# cnsm

## Install

```sh
git clone git@github.com:jneidel/cnsm.git
cd cnsm
npm i
npm run link
```

## Usage

See `--help` and in view mode `help`.

## Configuration

[See examples](example_config)

### Types

Configured in `~/.config/cnsm/types.json` as:

```json
{
  "typeName": { options }
}
```

#### Options

**`short`**

- required
- short 1-2 letter descriptor for the interactive view

**`front` and `back`**

- color the text (`front`) or the background (`back`)
- pass colors by name, as listed [here](https://github.com/chalk/chalk#colors)

**`open`**

- required
- search provider to open the type with
- pass as an url with `%s` in-place of the query
- example: `https://www.imdb.com/find?s=all&q=%s`
- use `name` if the provided name is an url (the name will opened directly)

**`alt`**

- additional alternative search provider to open stuff with
- same as `open`

**`open_name` and `alt_name`**

- descriptive names for the openers (to differentiate them as a user)

**`primary_desc`**

- only value that makes sense is `true`
- use this if the name is an url, so the description takes the place as the name

### Data file

Generated at `~/.config/cnsm/data.json`

What the application works on as a data basis.

Should only really be touched for manual edits or backups.
