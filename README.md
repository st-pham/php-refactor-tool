# PHP Refactor Tool

[![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/st-pham.php-refactor-tool.svg
)](https://marketplace.visualstudio.com/items?itemName=st-pham.php-refactor-tool) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/st-pham.php-refactor-tool.svg
)](https://marketplace.visualstudio.com/items?itemName=st-pham.php-refactor-tool) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/st-pham.php-refactor-tool.svg)](https://marketplace.visualstudio.com/items?itemName=st-pham.php-refactor-tool#review-details)

- Php refactor tool help users refactor their codes easily and safely

- The extension is made for object-oriented programming (OOP) in PHP

## Features

- Rename symbols
    - Update the name of file or the namespace if needed in case of `Class`, `Interface`, `Abstract`, ...
    - Update `Getter` and `Setter` when renaming `Property`

Rename Class
![Rename Class](https://i.imgur.com/Aq0YZAB.gif)

Rename Method
![Rename Method](https://i.imgur.com/BIEGjDQ.gif)

## Requirements

- PHP Intelephense

## Installation

- Install dependency extension `PHP Intelephense`

- All the extensions with same functionalities should be disabled to obtain the best result.
## Usage

Use key `F2` or right click and choose `Rename Symbol` on the symbol you want to rename.

## Known Issues

Not yet. If you have any problems please let me know, I'll fix it as soon as possible.

## TODO
- Rename files => rename class, interface, ...
- Rename folder => update namespace and its references
- Move files/folders => update namespace and its references
