# cnsm

## Install

```sh
git clone git@github.com:jneidel/cnsm.git
cd cnsm
npm i
npm run link
```

## Usage

Prior to usage you have to [configure your types](#configuration).

### TUI: Interactive view mode

Enter interactive view mode by using `cnsm` without any arguments.

Pass `help` for usage info:

```
Available commands:
  ls, list   - list entries

Moving around:
  n,  next   - view next 10 entries
  p,  prev   - view previous 10 entries
  gg         - goto first page of entries
  G          - goto last page of entries

Filtering:
  f,  filter - filter by type
               either with the full type, or shorthand
               examples: $ f books; f b; f b,mv
  re, reset  - reset filters
      rand   - select a random entry

Handler/openers (open with a handler defined by type):
  o,  open   - open with default handler
               example: manga searches on mangalife.us
  a,  alt    - open with alternative handler
               example: movie searches on imdb.com

Saving/exiting:
      reload - reload from file (disregarding all changes)
  w,  write  - write changes
  q,  wq     - write changes and quit
      exit   - exit without writing

Help:
      help   - this menu
      types  - list all available types
```


### CLI: script access to the data

The CLI allows for adding and viewing of the data.

See `cnsm --help` for CLI usage:

```

  $ cnsm

  Usage
    cnsm             - view mode (try 'help' for usage)
    cnsm add <name>  - add to list
    cnsm list        - list all items

  Flags for 'add'
    -t, --type  - type of media to add
    -d, --desc  - alternative name or description if name is an url

  Flags for 'view'
    -f, --filter - filter to directly apply (single or comma-separated list)

  Flags for 'list'
    -f, --filter - filter items before returning them, strips type tag of results

  Examples:
    $ cnsm list -f 'mv,b'
    #=> lists all movies and books

```

## Configuration

[See examples](example_config)

[See author's `types.json`](https://jneidel.com/dot/.config/cnsm/types.json)

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
