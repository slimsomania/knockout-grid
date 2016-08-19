# Knockout-grid

A knockout-grid is a binding for Knockoutjs designed to provide a basic data grid ability with the folowing additional fetaures:
* sort column data;
* filter column data;
* show/hide columns;
* columns ordering;
* paging;
* page size;
* custom templates;

## Demo
See https://slimsomania.github.io/knockout-grid/ for examples and details.

## Usage
include a link to the javascript and css files in your page

```html
<div data-bind="dataGrid: model"></div
```

```js
var model = new ko.dataGrid.viewModel({
        data: [],
        columns: []
    });
```

### License

**License:** MIT (http://www.opensource.org/licenses/mit-license.php)
