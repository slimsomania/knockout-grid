(function() {
    function dynamicSort(property, reverse, itemFormat) {
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            if (itemFormat) {
                return reverse * naturalCompare(itemFormat(a), itemFormat(b));
            }
            return reverse * naturalCompare(ko.unwrap(a[property]), ko.unwrap(b[property]));
        };
    }

    function naturalCompare(a, b) {
        if (isNumeric(a) && isNumeric(b)) return a - b;
        if (isDate(a) && isDate(b)) return new Date(a) - new Date(b);

        var ax = [], bx = [];
        (a || "").replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]); });
        (b || "").replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]); });

        while (ax.length && bx.length) {
            var an = ax.shift();
            var bn = bx.shift();
            var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
            if (nn) return nn;
        }

        return ax.length - bx.length;
    }
    
    function multipleSort(props) {
        return function(a, b) {
            var i = 0, result = 0, numberOfProperties = props.length;
            while (result === 0 && i < numberOfProperties) {
                result = dynamicSort(props[i].itemProperty, props[i].reverse, props[i].itemFormat)(a, b);
                i++;
            }
            return result;
        };
    }
    
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    
    function isDate(date) {
        return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
    }
    
    function setFocus() {
        var elems = document.getElementsByClassName("dataGridFilterContainer");
        if (elems.length == 0) return;
        var inputs = elems[0].getElementsByTagName("input");
        if (inputs.length == 0) return;
        inputs[0].focus();
    };

    function showOverlay(func) {
        var overlay = document.createElement("DIV");
        overlay.className = "datagGidOverlay";
        overlay.onclick = function () {
            func();
            this.parentElement.removeChild(this);
        };
        document.body.appendChild(overlay);
    };

    ko.dataGrid = {
        viewModel: function(options) {

            var self = this;

            var defaultSortColumn = options.defaultSortColumn || null;
            var defaultSortOrder = options.defaultSortOrder || null;

            var afterFilteShow = options.afterFilteShow || setFocus;
            var autoHideFilter = options.autoHideFilter || false;

            self.sortOrder = {
                ascending: "asc",
                descending: "desc"
            };
            
            self.tableGridClass = options.tableGridClass;
            self.highlightRow = options.highlightRow;

            self.data = options.data;
            self.pageSize = ko.observable(options.pageSize | 0);
            self.pageSizeValues = ko.observableArray([10, 25, 50, 100, 0]);
            self.currentPageIndex = ko.observable(0);
            self.columns = options.columns;

            self.currentOpenFilter = ko.observable("");
            self.activeSortField = ko.observable();
            self.activeSortOrder = ko.observable();

            self.filteredColumns = ko.computed(function() {
                return ko.utils.arrayFilter(ko.unwrap(self.columns), function(item) {
                    return ko.unwrap(item.isVisible);
                });
            }, self);

            self.filteredItems = ko.computed(function() {
                return ko.utils.arrayFilter(self.data(), function(item) {
                    return !(ko.utils.arrayFirst(
                        ko.utils.arrayFilter(
                            self.filteredColumns(),
                            function(column) { return !!column.filter; }),
                        function(column) {
                            return !column.filter.func(column.filter, item);
                        }));
                });
            });
            
            var getFormat = function (itemProperty) {
                var item = ko.utils.arrayFirst(ko.unwrap(self.columns), function (column) { return column.itemProperty == itemProperty; });
                return !!item && !!item.itemFormat ? item.itemFormat : "";
            };

            var getSortParam = function () {
                if (!self.activeSortField() && !defaultSortColumn) return [];
                if (defaultSortColumn && !self.activeSortField()) return [{ itemProperty: defaultSortColumn, reverse: defaultSortOrder == self.sortOrder.descending, itemFormat: getFormat(defaultSortColumn) }];
                if (self.activeSortField() && !defaultSortColumn) return [{ itemProperty: self.activeSortField(), reverse: self.activeSortOrder() == self.sortOrder.descending, itemFormat: getFormat(self.activeSortField()) }];
                return [
                    { itemProperty: self.activeSortField(), reverse: self.activeSortOrder() == self.sortOrder.descending, itemFormat: getFormat(self.activeSortField()) },
                    { itemProperty: defaultSortColumn, reverse: defaultSortOrder == self.sortOrder.descending, itemFormat: getFormat(defaultSortColumn) }
                ];
            };

            self.orderedItems = ko.computed(function () {
                return ko.unwrap(self.filteredItems).sort(multipleSort(getSortParam()));
            }, self);

            self.limitedItems = ko.computed(function() {
                if (self.pageSize() == 0) return self.orderedItems();
                var startIndex = self.pageSize() * self.currentPageIndex();
                return ko.unwrap(self.orderedItems).slice(startIndex, startIndex + self.pageSize());
            }, self);

            self.maxPageIndex = ko.computed(function() {
                if (self.pageSize() == 0) return 0;
                return Math.ceil(ko.unwrap(self.orderedItems).length / self.pageSize()) - 1;
            }, self);
            
            var setToDefaultOrder = function () {
                self.activeSortField("");
                self.activeSortOrder("");
            };

            self.changeOrder = function (column) {
                if (self.activeSortField() == column.itemProperty) {
                    if (self.activeSortOrder() == self.sortOrder.ascending) {
                        self.activeSortOrder(self.sortOrder.descending);
                    } else {
                        !!defaultSortColumn ? setToDefaultOrder() : self.activeSortOrder(self.sortOrder.ascending);
                    }
                    return;
                }

                self.activeSortOrder(self.sortOrder.ascending);
                self.activeSortField(column.itemProperty);
            };

            self.updateColumn = function (column) {
                if (!ko.unwrap(column.isVisible) && self.activeSortField() == column.itemProperty) setToDefaultOrder();
            };

            self.showFilter = function(name) {
                self.currentOpenFilter(name);
                afterFilteShow();

                if (autoHideFilter) showOverlay(function () { self.currentOpenFilter(""); });
            };

            self.isActiveGeneral = function(column) {
                return self.isActiveSorting(column) || self.isActiveFilter(column);
            };

            self.isActiveSorting = function (column) {
                return self.activeSortField() == column.itemProperty;
            };

            self.isActiveFilter = function(column) {
                return !!column.filter && column.filter.isActive();
            };

            self.isVisibleFilter = function(column, sortOrder) {
                if (!sortOrder) return self.activeSortField() != column.itemProperty;
                return self.activeSortField() == column.itemProperty && self.activeSortOrder() == sortOrder;
            };
        }
    };

    var templateEngine = new ko.nativeTemplateEngine();

    templateEngine.addTemplate = function(templateName, templateMarkup) {
        document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
    };

    templateEngine.addTemplate("ko_dataGrid_grid",
          "<table class=\"dataGridTable table\" data-bind=\"css: tableGridClass\">" +
            "<thead>" +
            "<tr>" +
            "<!-- ko foreach: filteredColumns -->" +
            "<th data-bind=\"attr: { 'class': $data.headerCellClass }, css: {active: $parent.isActiveGeneral($data) } \">" +
            //
            //---------- Start data grid header ----------
            "<!-- ko if: !!$data.templates && !!$data.templates.header && $data.templates.header -->" +
            "<!-- ko template: { name: templates.header } --><!-- /ko -->" +
            "<!-- /ko -->" +
            "<!-- ko ifnot: !!$data.templates && !!$data.templates.header && $data.templates.header -->" +
            "<span class=\"dataGridHeaderText\" data-bind=\"text: name\"></span>" +
            "<!-- /ko -->" +
            //---------- End data grid header ----------
            //
            "</th>" +
            "<!-- /ko -->" +
            "</tr>" +
            "<tr>" +
            "<!-- ko foreach: filteredColumns -->" +
            "<th data-bind=\"attr: { 'class': $data.subHeaderCellClass }, css: {active: $parent.isActiveGeneral($data) } \">" +
            //
            //---------- Start data grid sub header ----------
            "<div class=\"dataGridSubHeaderContainer\">" +
            "<div class=\"dataGridSubHeader\">" +
            //
            //---------- Start data grid filter ----------
            "<!-- ko if: !!$data.templates && !!$data.templates.filter && $data.templates.filter -->" +
            "<span class=\"dataGridSubHeaderFilter dataGridSubHeaderItem\" data-bind=\"click: function () { $parent.showFilter($data.itemProperty); }, css: { active: $parent.isActiveFilter($data) }\">" +
            "<i class=\"fa fa-filter\"></i>" +
            "</span>" +
            "<!-- /ko -->" +
            //---------- End data grid filter ----------
            //
            //
            //---------- Start data grid sort ----------
            "<!-- ko if: !!$data.isSortable && $data.isSortable -->" +
            "<!-- ko if: !!$data.templates && !!$data.templates.sort && $data.templates.sort -->" +
            "<!-- ko template: { name: templates.sort } --><!-- /ko -->" +
            "<!-- /ko -->" +
            "<!-- ko ifnot: !!$data.templates && !!$data.templates.sort && $data.templates.sort -->" +
            "<span class=\"dataGridSubHeaderSort dataGridSubHeaderItem\" data-bind=\"click: $parent.changeOrder, css: { active: $parent.isActiveSorting($data) }\">" +
            "<i class=\"glyphicon glyphicon-sort\" data-bind=\"visible: $parent.isVisibleFilter($data)\"></i>" +
            "<i class=\"glyphicon glyphicon-sort-by-attributes\" data-bind=\"visible: $parent.isVisibleFilter($data, $parent.sortOrder.ascending)\"></i>" +
            "<i class=\"glyphicon glyphicon-sort-by-attributes-alt\" data-bind=\"visible:  $parent.isVisibleFilter($data, $parent.sortOrder.descending)\"></i>" +
            "</span>" +
            "<!-- /ko -->" +
            "<!-- /ko -->" +
            //---------- End data grid sort ----------
            //
            "</div>" +
            //
            //---------- Start data grid filter content ----------
            "<!-- ko if: !!$data.templates && !!$data.templates.filter && $data.templates.filter -->" +
            "<!-- ko if: $parent.currentOpenFilter() == itemProperty -->" +
            "<div class=\"dataGridFilterContainer\">" +
            "<!-- ko template: { name: templates.filter } --><!-- /ko -->" +
            "</div>" +
            "<!-- /ko -->" +
            "<!-- /ko -->" +
            //---------- End data grid filter content ----------
            //
            "</div>" +
            //---------- End data grid sub header ----------
            //
            "</th>" +
            "<!-- /ko -->" +
            "</tr>" +
            "</thead>" +
            "<tbody data-bind=\"foreach: limitedItems\">" +
            "<tr data-bind=\"css: { highlight : !!$parent.highlightRow && $parent.highlightRow($data) } \">" +
            "<!-- ko foreach: $parent.filteredColumns -->" +
            "<td data-bind=\"attr: { 'class': $data.itemCellClass }, css: { active: $parents[1].isActiveGeneral($data), highlight : !!$data.highlightCell && $data.highlightCell($parent) } \">" +
            //
            //---------- Start data grid item ----------
            "<!-- ko if: !!$data.templates && !!$data.templates.item && $data.templates.item -->" +
            "<!-- ko template: { name: templates.item } --><!-- /ko -->" +
            "<!-- /ko -->" +
            "<!-- ko ifnot: !!$data.templates && !!$data.templates.item && $data.templates.item -->" +
            "<span class=\"dataGridItemText\"  data-bind=\"text: !!$data.itemFormat ? $data.itemFormat($parent) : $parent[itemProperty] \"></span>" +
            "<!-- /ko -->" +
            //---------- End data grid sub header ----------
            //
            "</td>" +
            "<!-- /ko -->" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "");

    templateEngine.addTemplate("ko_dataGrid_columns",
        "<div class=\"dataGridColumnsContainer\">" +
            "<a href=\"\" class=\"dataGridColumnsLink\" data-bind=\"click: function() { showFilter('columns') }\">" +
            "<i class=\"fa fa-cog\"></i>" +
            "</a>" +
            "<!-- ko if: currentOpenFilter() == 'columns' -->" +
            "<div class=\"dataGridColumnsListContainer\">" +
            "<ul class=\"list-group\" data-bind=\"foreach: columns\">" +
            "<li>" +
            "<div class=\"checkbox\">" +
            "<label>" +
            "<input type=\"checkbox\" data-bind=\"checked: isVisible, click: function() { $parent.updateColumn($data); return true; }\" />" +
            "<span data-bind=\"text: name\"></span>" +
            "</label>" +
            "</div>" +
            "</li>" +
            "</ul>" +
            "</div>" +
            "<!-- /ko -->" +
            "</div>" +
            "");

    templateEngine.addTemplate("ko_dataGrid_paging",
        "<div class=\"dataGridPagination\">" +
            "<select class=\"form-control dataGridPageSize\" data-bind=\"options: pageSizeValues, optionsText: function (i) { return i == 0 ? 'All' : i }, value: pageSize, event: { change: function () { currentPageIndex(0) } }\">" +
            "</select>" +
            "<nav class=\"datGridPaging\" data-bind=\"visible: maxPageIndex() > 0\">" +
            "<ul class=\"pagination\">" +
            "<!-- ko ifnot:  $root.currentPageIndex() == 0 -->" +
            "<li>" +
            "<a href=\"#\" aria-label=\"Previous\" data-bind=\"click: function() { $root.currentPageIndex($root.currentPageIndex() - 1) }\">" +
            "<span aria-hidden=\"true\">&laquo;</span>" +
            "</a>" +
            "</li>" +
            "<!-- /ko -->" +
            "<!-- ko foreach: ko.utils.range(0, maxPageIndex) -->" +
            "<li data-bind=\"css: { active: $data == $root.currentPageIndex() }\">" +
            "<!-- ko ifnot: $data == $root.currentPageIndex() -->" +
            "<a href=\"#\" data-bind=\"text: $data + 1, click: function() { $root.currentPageIndex($data) }\"></a>" +
            "<!-- /ko -->" +
            "<!-- ko if: $data == $root.currentPageIndex() -->" +
            "<span data-bind=\"text: $data + 1\"></span>" +
            "<!-- /ko -->" +
            "</li>" +
            "<!-- /ko -->" +
            "<!-- ko ifnot:  $root.currentPageIndex() == $root.maxPageIndex() -->" +
            "<li>" +
            "<a href=\"#\" aria-label=\"Next\" data-bind=\"click: function() { $root.currentPageIndex($root.currentPageIndex() + 1) }\">" +
            "<span aria-hidden=\"true\">&raquo;</span>" +
            "</a>" +
            "</li>" +
            "<!-- /ko -->" +
            "</ul>" +
            "</nav>" +
            "</div>" +
            "");

    ko.bindingHandlers.dataGrid = {
        init: function() {
            return { 'controlsDescendantBindings': true };
        },
        update: function(element, viewModelAccessor, allBindings) {
            var viewModel = viewModelAccessor();

            while (element.firstChild) ko.removeNode(element.firstChild);

            var gridTemplateName = allBindings.get('dataGridTemplate') || "ko_dataGrid_grid";
            var pageLinksTemplateName = allBindings.get('dataGridPagingTemplate') || "ko_dataGrid_paging";
            var columnsTemplateName = allBindings.get('dataGridColumnsTemplate') || "ko_dataGrid_columns";

            var gridContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(gridTemplateName, viewModel, { templateEngine: templateEngine }, gridContainer, "replaceNode");

            var columnsContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(columnsTemplateName, viewModel, { templateEngine: templateEngine }, columnsContainer, "replaceNode");

            var pageLinksContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(pageLinksTemplateName, viewModel, { templateEngine: templateEngine }, pageLinksContainer, "replaceNode");
        }
    };
})();