# StyleScape Parity Report (Legacy → New)

Generated: 2026-05-16  |  Legacy: `bup/classes` + `bup/mixins`  |  New: `src/scss/31-modules`

- **50 OK** — new module exists with comparable depth
- **15 PARTIAL** — new module exists but is <20% of legacy size (>200 lines)
- **18 MISSING** — no new module

Note: legacy line counts include heavy Doxygen comment headers, so the actual
rule loss is less dramatic than raw line ratios suggest.

## MISSING modules

| Slug | Legacy lines | Source files | Suggested home |
|------|-------------:|--------------|----------------|
| `box-surface` | 76 | _box_surface.scss | 31-modules/box (variant) |
| `canvas` | 133 | _canvas.scss | 23-layout |
| `card-extended` | 321 | _card_extended.scss | 31-modules/card (variant) |
| `cursor` | 201 | _cursor.scss | 32-utilities/interaction |
| `dimensions` | 202 | _dimensions.scss | 32-utilities/sizing |
| `group` | 352 | _input_group.scss, _button_group.scss | 31-modules/input-group OR button-group |
| `headline` | 216 | _headline.scss | 31-modules/headline (new) |
| `input-list` | 67 | _input_list.scss | 31-modules/input (datalist variant) |
| `input-state` | 245 | _input_state.scss | 31-modules/input (state mixins) |
| `interface` | 78 | _interface.scss | 23-layout |
| `page` | 403 | _page.scss | 23-layout |
| `preloader-base` | 54 | _preloader_base.scss | 31-modules/preloader |
| `preloader-lines` | 111 | _preloader_lines.scss | 31-modules/preloader |
| `preloader-pulse` | 73 | _preloader_pulse.scss | 31-modules/preloader |
| `searchbox` | 81 | _input_searchbox.scss | 31-modules/input (search variant) |
| `switch` | 149 | _button_switch.scss | 31-modules/select (custom-select) |
| `table-responsive` | 350 | _table_responsive.scss | 31-modules/table (variant) |
| `textarea` | 60 | _input_type_textarea.scss | 31-modules/input (textarea variant) |

## PARTIAL modules (new <20% of legacy size)

| Slug | Legacy lines | New lines | Ratio | Source files |
|------|-------------:|----------:|------:|--------------|
| `card` | 4069 | 182 | 4% | _card.scss |
| `video` | 1565 | 65 | 4% | _video.scss, _video.scss |
| `image` | 1352 | 80 | 6% | _image.scss, _image.scss |
| `button` | 1169 | 225 | 19% | _button.scss, _button.scss |
| `form` | 1057 | 96 | 9% | _form.scss |
| `chat` | 1037 | 148 | 14% | _chat.scss |
| `input` | 1004 | 152 | 15% | _input.scss, _input.scss |
| `placeholder` | 812 | 159 | 20% | _input_placeholder.scss, _placeholder.scss, _placeholder.scss |
| `popover` | 583 | 80 | 14% | _popover.scss, _popover.scss |
| `social` | 568 | 99 | 17% | _social.scss |
| `table` | 562 | 92 | 16% | _table.scss |
| `map` | 512 | 69 | 13% | _map.scss |
| `pagination` | 483 | 89 | 18% | _pagination.scss |
| `tooltip` | 406 | 74 | 18% | _tooltip.scss |
| `progress` | 276 | 53 | 19% | _status_progress.scss |

## OK modules

| Slug | Legacy lines | New lines |
|------|-------------:|----------:|
| `accordion` | 355 | 92 |
| `alert` | 136 | 100 |
| `badge` | 687 | 205 |
| `box` | 106 | 90 |
| `breadcrumb` | 158 | 75 |
| `caption` | 65 | 43 |
| `carousel` | 206 | 137 |
| `checkbox` | 138 | 86 |
| `chip` | 237 | 77 |
| `collapse` | 216 | 72 |
| `cookie` | 68 | 63 |
| `cover` | 107 | 91 |
| `divider` | 149 | 93 |
| `drilldown` | 383 | 136 |
| `dropdown` | 428 | 113 |
| `figure` | 280 | 112 |
| `flipper` | 216 | 214 |
| `floating-label` | 148 | 79 |
| `formfield` | 369 | 127 |
| `gallery` | 84 | 68 |
| `graphic` | 90 | 60 |
| `hero` | 280 | 230 |
| `icon-bar` | 117 | 85 |
| `image-slider` | 194 | 78 |
| `label` | 153 | 48 |
| `list-group` | 374 | 198 |
| `modal` | 386 | 228 |
| `offcanvas` | 341 | 222 |
| `portfolio` | 49 | 72 |
| `preview` | 271 | 181 |
| `rail` | 239 | 107 |
| `ribbon` | 1245 | 520 |
| `scrollspy` | 238 | 111 |
| `select` | 126 | 48 |
| `sidebar` | 158 | 247 |
| `spacer` | 217 | 74 |
| `spinner` | 217 | 72 |
| `summary` | 86 | 84 |
| `tab` | 86 | 97 |
| `tags-list` | 55 | 65 |
| `ticker` | 219 | 150 |
| `timeline` | 67 | 88 |
| `timestamp` | 127 | 78 |
| `toast` | 488 | 127 |
| `toc` | 243 | 80 |
| `toggle` | 147 | 101 |
| `validation` | 360 | 133 |
| `vcard` | 55 | 56 |
| `video-button` | 66 | 77 |
| `widget` | 83 | 69 |
