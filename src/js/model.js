function Model() {
    var self = this;
    self.columns = ko.observableArray();
    self.data = ko.observableArray();

    self.defaultGrid = new DefaultGridModel(self)
    self.highlightedGrid = new HighlightedGridModel(self)
    self.sortableGrid = new SortableGridModel(self)
    self.showHideGrid = new ShowHideGridModel(self)
    self.FilterBasicGrid = new FilterBasicGridModel(self)
    self.filterComplexGrid = new FilterComplexGridModel(self)
    self.customTemplatesGrid = new CustomeTemplatesGridModel(self)
    self.sortColumnsGrid = new SortColumnsGridModel(self)
}

function DefaultGridModel(root) {
    var self = this;
    self.gridView = new ko.dataGrid.viewModel({
        defaultSortField: "id",
        defaultSortOrder: "asc",
        tableGridClass: "table-striped table-hover",
        pageSize: 10,
        data: root.data,
        columns: [
                {
                    name: 'Id',
                    itemProperty: "id",
                    itemCellClass: "idItem",
                    isVisible: true
                },
                {
                    name: 'First name',
                    itemProperty: "firstName",
                    itemCellClass: "firstNameItem",
                    isVisible: true
                },
                {
                    name: 'Last name',
                    itemProperty: "lastName",
                    itemCellClass: "lastNameItem",
                    isVisible: true
                },
                {
                    name: 'Email',
                    itemProperty: "email",
                    itemCellClass: "emailItem",
                    isVisible: true
                },
                {
                    name: 'Gender',
                    itemProperty: "gender",
                    itemCellClass: "genderItem",
                    isVisible: true
                },
                {
                    name: 'IP address',
                    itemProperty: "iPaddress",
                    itemCellClass: "iPaddressItem",
                    isVisible: true
                }
        ]
    });
}

function HighlightedGridModel(root) {
    var self = this;
    self.gridView = new ko.dataGrid.viewModel({
        defaultSortField: "id",
        defaultSortOrder: "asc",
        tableGridClass: "table-striped table-hover",
        pageSize: 10,
        highlightRow: function (i) { return i.gender.indexOf("Male") > -1 },
        data: root.data,
        columns: [
                {
                    name: 'Id',
                    itemProperty: "id",
                    itemCellClass: "idItem",
                    isVisible: true
                },
                {
                    name: 'First name',
                    itemProperty: "firstName",
                    itemCellClass: "firstNameItem",
                    isVisible: true
                },
                {
                    name: 'Last name',
                    itemProperty: "lastName",
                    itemCellClass: "lastNameItem",
                    isVisible: true
                },
                {
                    name: 'Email',
                    itemProperty: "email",
                    itemCellClass: "emailItem",
                    highlightCell: function (i) { return i.email.indexOf("com") > -1 },
                    isVisible: true
                },
                {
                    name: 'Gender',
                    itemProperty: "gender",
                    itemCellClass: "genderItem",
                    isVisible: true
                },
                {
                    name: 'IP address',
                    itemProperty: "iPaddress",
                    itemCellClass: "iPaddressItem",
                    isVisible: true
                }
        ]
    });
}

function SortableGridModel(root) {
    var self = this;
    self.gridView = new ko.dataGrid.viewModel({
        defaultSortField: "id",
        defaultSortOrder: "asc",
        tableGridClass: "table-striped table-hover",
        pageSize: 10,
        data: root.data,
        columns: [
                {
                    name: 'Id',
                    itemProperty: "id",
                    itemCellClass: "idItem",
                    isVisible: true,
                    isSortable: true
                },
                {
                    name: 'First name',
                    itemProperty: "firstName",
                    itemCellClass: "firstNameItem",
                    isVisible: true,
                    isSortable: true
                },
                {
                    name: 'Last name',
                    itemProperty: "lastName",
                    itemCellClass: "lastNameItem",
                    isVisible: true,
                    isSortable: true
                },
                {
                    name: 'Email',
                    itemProperty: "email",
                    itemCellClass: "emailItem",
                    isVisible: true,
                    isSortable: true
                },
                {
                    name: 'Gender',
                    itemProperty: "gender",
                    itemCellClass: "genderItem",
                    isVisible: true,
                    isSortable: true
                },
                {
                    name: 'IP address',
                    itemProperty: "iPaddress",
                    itemCellClass: "iPaddressItem",
                    isVisible: true,
                    isSortable: true
                }
        ]
    });
}

function ShowHideGridModel(root) {
    var self = this;
    self.gridView = new ko.dataGrid.viewModel({
        defaultSortField: "id",
        defaultSortOrder: "asc",
        tableGridClass: "table-striped table-hover",
        pageSize: 10,
        autoHideFilter: true,
        data: root.data,
        columns: [
                {
                    name: 'Id',
                    itemProperty: "id",
                    itemCellClass: "idItem",
                    isVisible: ko.observable(true)
                },
                {
                    name: 'First name',
                    itemProperty: "firstName",
                    itemCellClass: "firstNameItem",
                    isVisible: ko.observable(true)
                },
                {
                    name: 'Last name',
                    itemProperty: "lastName",
                    itemCellClass: "lastNameItem",
                    isVisible: ko.observable(true)
                },
                {
                    name: 'Email',
                    itemProperty: "email",
                    itemCellClass: "emailItem",
                    isVisible: ko.observable(true)
                },
                {
                    name: 'Gender',
                    itemProperty: "gender",
                    itemCellClass: "genderItem",
                    isVisible: ko.observable(true)
                },
                {
                    name: 'IP address',
                    itemProperty: "iPaddress",
                    itemCellClass: "iPaddressItem",
                    isVisible: ko.observable(true)
                },
                {
                    name: 'Color',
                    itemProperty: "color",
                    itemCellClass: "iPaddressItem",
                    isVisible: ko.observable(false)
                },
                {
                    name: 'Company Name',
                    itemProperty: "companyName",
                    itemCellClass: "iPaddressItem",
                    isVisible: ko.observable(false)
                }
        ]
    });
}

function FilterBasicGridModel(root) {
    var self = this;
    self.gridView = new ko.dataGrid.viewModel({
        defaultSortField: "id",
        defaultSortOrder: "asc",
        tableGridClass: "table-striped table-hover",
        pageSize: 10,
        autoHideFilter: true,
        data: root.data,
        columns: [
                {
                    name: 'Id',
                    itemProperty: "id",
                    itemCellClass: "idItem",
                    isVisible: true,
                    filter: {
                        from: ko.observable(),
                        to: ko.observable(),
                        func: function (f, i) {
                            if (f.from() && f.to()) return f.from() <= i.id && i.id <= f.to();
                            if (f.from()) return f.from() <= i.id;
                            if (f.to()) return f.to() >= i.id;
                            return true;
                        },
                        isActive: function () {
                            return this.from() || this.to();
                        }
                    },
                    templates: {
                        filter: "filterNumberTemplate"
                    }
                },
                {
                    name: 'First name',
                    itemProperty: "firstName",
                    itemCellClass: "firstNameItem",
                    isVisible: true,
                    filter: { 
                        q: ko.observable(""), 
                        func: function (f, i) {
                            return i.firstName.indexOf(f.q()) > -1;
                        },
                        isActive: function () {
                            return !!this.q();
                        }

                    },
                    templates: {
                        filter: "filterStringTemplate"
                    }
                },
                {
                    name: 'Last name',
                    itemProperty: "lastName",
                    itemCellClass: "lastNameItem",
                    isVisible: true,
                    filter: { 
                        q: ko.observable(""), 
                        func: function (f, i) {
                            return i.lastName.indexOf(f.q()) > -1;
                        },
                        isActive: function () {
                            return !!this.q();
                        }
                    },
                    templates: {
                        filter: "filterStringTemplate"
                    }
                },
                {
                    name: 'Email',
                    itemProperty: "email",
                    itemCellClass: "emailItem",
                    isVisible: true,
                    filter: {
                        q: ko.observableArray(),
                        func: function (f, i) {
                            return !f.q().length || ko.utils.arrayIndexOf(f.q(), i.email) > -1;
                        },
                        isActive: function () {
                            return !!this.q().length;
                        }
                    },
                    templates: {
                        filter: "filterSelectedTemplate"
                    }
                },
                {
                    name: 'Gender',
                    itemProperty: "gender",
                    itemCellClass: "genderItem",
                    isVisible: true,
                    filter: {
                        q: ko.observableArray(),
                        func: function (f, i) {
                            return !f.q().length || ko.utils.arrayIndexOf(f.q(), i.gender) > -1;
                        },
                        isActive: function () {
                            return !!this.q().length;
                        }
                    },
                    templates: {
                        filter: "filterSelectedTemplate"
                    }
                },
                {
                    name: 'IP address',
                    itemProperty: "iPaddress",
                    itemCellClass: "iPaddressItem",
                    isVisible: true,
                    filter: {
                        q: ko.observableArray(),
                        func: function (f, i) {
                            return !f.q().length || ko.utils.arrayIndexOf(f.q(), i.iPaddress) > -1;
                        },
                        isActive: function () {
                            return !!this.q().length;
                        }
                    },
                    templates: {
                        filter: "filterSelectedTemplate"
                    }
                }
        ]
    });

    self.gridView.columnUniqueValues = function (column) {
        var data = ko.utils.arrayMap(self.gridView.data(), function (i) { return i[column.itemProperty]; });
        return values = ko.utils.arrayGetDistinctValues(data);
    };
}

function FilterComplexGridModel(root) {
    var self = this;
    self.gridView = new ko.dataGrid.viewModel({
        defaultSortField: "id",
        defaultSortOrder: "asc",
        tableGridClass: "table-striped table-hover",
        pageSize: 10,
        data: root.data,
        columns: [
                {
                    name: 'Id',
                    itemProperty: "id",
                    itemCellClass: "idItem",
                    isVisible: true,
                    filter: {
                        appliedFrom: ko.observable(),
                        appliedTo: ko.observable(),
                        from: ko.observable(),
                        to: ko.observable(),
                        func: function (f, i) {
                            if (f.appliedFrom() && f.appliedTo()) return f.appliedFrom() <= i.id && i.id <= f.appliedTo();
                            if (f.appliedFrom()) return f.appliedFrom() <= i.id;
                            if (f.appliedTo()) return f.appliedTo() >= i.id;
                            return true;
                        },
                        isActive: function () {
                            return this.appliedFrom() || this.appliedTo();
                        },
                        save: function () {
                            this.appliedFrom(this.from());
                            this.appliedTo(this.to());
                        }
                    },
                    templates: {
                        filter: "filterComplexNumberTemplate"
                    }
                },
                {
                    name: 'First name',
                    itemProperty: "firstName",
                    itemCellClass: "firstNameItem",
                    isVisible: true,
                    filter: {
                        query: ko.observable(),
                        isAllSelected: ko.observable(),
                        applied: ko.observableArray(),
                        selected: ko.observableArray(),
                        selectAll: function () {
                            this.selected(this.isAllSelected() ? this.values() : []);
                        },
                        func: function (f, i) {
                            return !f.applied().length || ko.utils.arrayIndexOf(f.applied(), i.firstName) > -1;
                        },
                        isActive: function () {
                            return !!this.applied().length;
                        },
                        save: function () {
                            if (this.isAllSelected()) {
                                this.applied.removeAll();
                                return;
                            }
                            this.applied(this.selected());
                        }

                    },
                    templates: {
                        filter: "filterComplexSelectedTemplate"
                    }
                },
                {
                    name: 'Last name',
                    itemProperty: "lastName",
                    itemCellClass: "lastNameItem",
                    isVisible: true,
                    filter: {
                        query: ko.observable(),
                        isAllSelected: ko.observable(),
                        applied: ko.observableArray(),
                        selected: ko.observableArray(),
                        selectAll: function () {
                            this.selected(this.isAllSelected() ? this.values() : []);
                        },
                        func: function (f, i) {
                            return !f.applied().length || ko.utils.arrayIndexOf(f.applied(), i.lastName) > -1;
                        },
                        isActive: function () {
                            return !!this.applied().length;
                        },
                        save: function () {
                            if (this.isAllSelected()) {
                                this.applied.removeAll();
                                return;
                            }
                            this.applied(this.selected());
                        }

                    },
                    templates: {
                        filter: "filterComplexSelectedTemplate"
                    }
                },
                {
                    name: 'Email',
                    itemProperty: "email",
                    itemCellClass: "emailItem",
                    isVisible: true,
                    filter: {
                        query: ko.observable(),
                        isAllSelected: ko.observable(),
                        applied: ko.observableArray(),
                        selected: ko.observableArray(),
                        selectAll: function () {
                            this.selected(this.isAllSelected() ? this.values() : []);
                        },
                        func: function (f, i) {
                            return !f.applied().length || ko.utils.arrayIndexOf(f.applied(), i.email) > -1;
                        },
                        isActive: function () {
                            return !!this.applied().length;
                        },
                        save: function () {
                            if (this.isAllSelected()) {
                                this.applied.removeAll();
                                return;
                            }
                            this.applied(this.selected());
                        }

                    },
                    templates: {
                        filter: "filterComplexSelectedTemplate"
                    }
                },
                {
                    name: 'Gender',
                    itemProperty: "gender",
                    itemCellClass: "genderItem",
                    isVisible: true,
                    filter: {
                        query: ko.observable(),
                        isAllSelected: ko.observable(),
                        applied: ko.observableArray(),
                        selected: ko.observableArray(),
                        selectAll: function () {
                            this.selected(this.isAllSelected() ? this.values() : []);
                        },
                        func: function (f, i) {
                            return !f.applied().length || ko.utils.arrayIndexOf(f.applied(), i.gender) > -1;
                        },
                        isActive: function () {
                            return !!this.applied().length;
                        },
                        save: function () {
                            if (this.isAllSelected()) {
                                this.applied.removeAll();
                                return;
                            }
                            this.applied(this.selected());
                        }

                    },
                    templates: {
                        filter: "filterComplexSelectedTemplate"
                    }
                },
                {
                    name: 'IP address',
                    itemProperty: "iPaddress",
                    itemCellClass: "iPaddressItem",
                    isVisible: true,
                    filter: {
                        query: ko.observable(),
                        isAllSelected: ko.observable(),
                        applied: ko.observableArray(),
                        selected: ko.observableArray(),
                        selectAll: function () {
                            this.selected(this.isAllSelected() ? this.values() : []);
                        },
                        func: function (f, i) {
                            return !f.applied().length || ko.utils.arrayIndexOf(f.applied(), i.iPaddress) > -1;
                        },
                        isActive: function () {
                            return !!this.applied().length;
                        },
                        save: function () {
                            if (this.isAllSelected()) {
                                this.applied.removeAll();
                                return;
                            }
                            this.applied(this.selected());
                        }

                    },
                    templates: {
                        filter: "filterComplexSelectedTemplate"
                    }
                }
        ]
    });

    self.gridView.columnUniqueValues = function (column) {
        var data = ko.utils.arrayMap(self.gridView.data(), function (i) { return i[column.itemProperty]; });
        var values = ko.utils.arrayGetDistinctValues(data);
        return ko.utils.arrayFilter(values, function (i) { return i.toLocaleLowerCase().indexOf((column.filter.query() || "").toLocaleLowerCase()) > -1; });
    };
}

function CustomeTemplatesGridModel(root) {
    var self = this;
    self.gridView = new ko.dataGrid.viewModel({
        defaultSortField: "id",
        defaultSortOrder: "asc",
        tableGridClass: "table-striped table-hover",
        pageSize: 10,
        data: root.data,
        columns: [
                {
                    name: 'Id',
                    itemProperty: "id",
                    itemCellClass: "idItem",
                    isVisible: true,
                    templates: {
                        header: "customeTemplatesHeaderTemplate",
                        item: "customeTemplatesIdItemTemplate"
                    }
                },
                {
                    name: 'First name',
                    itemProperty: "firstName",
                    itemCellClass: "firstNameItem",
                    isVisible: true,
                    templates: {
                        header: "customeTemplatesHeaderTemplate",
                        item: "customeTemplatesFnItemTemplate"
                    }
                },
                {
                    name: 'Last name',
                    itemProperty: "lastName",
                    itemCellClass: "lastNameItem",
                    isVisible: true,
                    templates: {
                        header: "customeTemplatesHeaderTemplate",
                        item: "customeTemplatesLnItemTemplate"
                    }
                },
                {
                    name: 'Email',
                    itemProperty: "email",
                    itemCellClass: "emailItem",
                    isVisible: true,
                    templates: {
                        header: "customeTemplatesHeaderTemplate",
                        item: "customeTemplatesEmailItemTemplate"
                    }
                },
                {
                    name: 'Gender',
                    itemProperty: "gender",
                    itemCellClass: "genderItem",
                    isVisible: true,
                    isSortable: true,
                    templates: {
                        header: "customeTemplatesHeaderTemplate",
                        item: "customeTemplatesGenderItemTemplate"
                    }
                },
                {
                    name: 'IP address',
                    itemProperty: "iPaddress",
                    itemCellClass: "iPaddressItem",
                    isVisible: true,
                    isSortable: true,
                    templates: {
                        header: "customeTemplatesHeaderTemplate",
                        item: "customeTemplatesIpItemTemplate"
                    }
                }
        ]
    });
}

function SortColumnsGridModel(root) {
    var self = this;
    self.gridView = new ko.dataGrid.viewModel({
        defaultSortField: "id",
        defaultSortOrder: "asc",
        tableGridClass: "table-striped table-hover",
        pageSize: 10,
        autoHideFilter: true,
        data: root.data,
        templates: { columns: 'sortedColumnsTemplate' },
        columns: ko.observableArray([
                {
                    name: 'Id',
                    itemProperty: "id",
                    itemCellClass: "idItem",
                    isVisible: true
                },
                {
                    name: 'First name',
                    itemProperty: "firstName",
                    itemCellClass: "firstNameItem",
                    isVisible: true
                },
                {
                    name: 'Last name',
                    itemProperty: "lastName",
                    itemCellClass: "lastNameItem",
                    isVisible: true
                },
                {
                    name: 'Email',
                    itemProperty: "email",
                    itemCellClass: "emailItem",
                    isVisible: true
                },
                {
                    name: 'Gender',
                    itemProperty: "gender",
                    itemCellClass: "genderItem",
                    isVisible: true
                },
                {
                    name: 'IP address',
                    itemProperty: "iPaddress",
                    itemCellClass: "iPaddressItem",
                    isVisible: true
                },
                {
                    name: 'Color',
                    itemProperty: "color",
                    itemCellClass: "iPaddressItem",
                    isVisible: true
                },
                {
                    name: 'Company Name',
                    itemProperty: "companyName",
                    itemCellClass: "iPaddressItem",
                    isVisible: true
                }
        ])
    });
}