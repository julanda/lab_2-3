class SimpleDataTableWidget{


    constructor(containerID)
    {
        let objName = "dataTableExample";
        // language=HTML
        let dialogs = "\n" +
            "<div class=\"modal fade\" id=\"addRowModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addRowModalTitle\" aria-hidden=\"true\">\n" +
            "    <div class=\"modal-dialog modal-sm\" role=\"document\">\n" +
            "        <div class=\"modal-content\">\n" +
            "            <div class=\"modal-header\">\n" +
            "                <h5 class=\"modal-title\" id=\"addRowModalTitle\">CREATE BOOK</h5>\n" +
            "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                    <span aria-hidden=\"true\">&times;</span>\n" +
            "                </button>\n" +
            "            </div>\n" +
            "            <div class=\"modal-body\">\n" +
            "                <div class=\"\">\n" +
            "                    <label for=\"bookNameCreateInput\">Book Name</label>\n" +
            "                    <input required id=\"bookNameCreateInput\" type=\"text\" class=\"form-control\">\n" +
            "                    <label for=\"bookNameCreateInput\">Author</label>\n" +
            "                    <input  required id=\"authorNameCreateInput\" type=\"text\" class=\"form-control\">\n" +
            "                    <label for=\"bookNameCreateInput\">Written in year</label>\n" +
            "                    <input required id=\"writtenInYearInput\" type=\"number\" class=\"form-control\">\n" +
            "                    <label for=\"bookNameCreateInput\">Description</label>\n" +
            "                    <input required id=\"descriptionCreateInput\" type=\"text\" class=\"form-control\">\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            <div class=\"modal-footer\">\n" +
            "                <button id=\"closeAddRowModal\" type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\n" +
            "                <button type=\"button\" class=\"btn btn-primary\" onclick=\"onClickCreateBook('"+objName+"')\">Create</button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>\n" +
            "\n" +
            "<div class=\"modal fade\" id=\"deleteRowsModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"deleteRowsModalTitle\" aria-hidden=\"true\">\n" +
            "    <div class=\"modal-dialog modal-sm\" role=\"document\">\n" +
            "        <div class=\"modal-content\">\n" +
            "            <div class=\"modal-header\">\n" +
            "                <h5 class=\"modal-title\" id=\"deleteRowsModalTitle\">DELETE PERSONS</h5>\n" +
            "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                    <span aria-hidden=\"true\">&times;</span>\n" +
            "                </button>\n" +
            "            </div>\n" +
            "            <div class=\"modal-body\">\n" +
            "                Are you sure you want to delete books?\n" +
            "            </div>\n" +
            "            <div class=\"modal-footer\">\n" +
            "                <button id=\"closeDeleteRowsModalModal\" type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cancel</button>\n" +
            "                <button type=\"button\" class=\"btn btn-danger\" onclick=\"onClickDeleteBook('"+objName+"')\">Yes</button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>\n" +
            "\n" +
            "<div class=\"modal fade\" id=\"updateRowModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"updateRowModalTitle\" aria-hidden=\"true\">\n" +
            "    <div class=\"modal-dialog modal-sm\" role=\"document\">\n" +
            "        <div class=\"modal-content\">\n" +
            "            <div class=\"modal-header\">\n" +
            "                <h5 class=\"modal-title\" id=\"updateRowModalTitle\">UPDATE BOOK</h5>\n" +
            "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                    <span aria-hidden=\"true\">&times;</span>\n" +
            "                </button>\n" +
            "            </div>\n" +
            "            <div class=\"modal-body\">\n" +
            "                <label for=\"bookNameCreateInput\">Book Name</label>\n" +
            "                <input required id=\"bookNameUpdateInput\" type=\"text\" class=\"form-control\">\n" +
            "                <label for=\"bookNameCreateInput\">Author</label>\n" +
            "                <input  required id=\"authorNameUpdateInput\" type=\"text\" class=\"form-control\">\n" +
            "                <label for=\"bookNameCreateInput\">Written in year</label>\n" +
            "                <input required id=\"writtenInYearUpdateInput\" type=\"number\" class=\"form-control\">\n" +
            "                <label for=\"bookNameCreateInput\">Description</label>\n" +
            "                <input required id=\"descriptionUpdateInput\" type=\"text\" class=\"form-control\">\n" +
            "                <input hidden required id=\"keyUpdateInput\" type=\"text\" class=\"form-control\">\n" +
            "\n" +
            "            </div>\n" +
            "            <div class=\"modal-footer\">\n" +
            "                <button id=\"closeUpdateRowModal\" type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cancel</button>\n" +
            "                <button type=\"button\" class=\"btn btn-primary\" onclick=\"onClickUpdateSaveBook('"+objName+"')\">Save</button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>\n" +
            "\n" +
            "\n" +
            "\n" +
            "\n";
        let thisObj = this;
        this.containerID = containerID;
        $("html").append(dialogs);
        this.db = firebase.database();
        this.allBooks = [];
        this.displayBooks = [];
        this.sortField = null;
        this.isDescSort = false;
        this.filter = '';
        this.currentPage = 0;
        this.displayPagesCount = 0;
        this.rowsOnPage = 5;
        this.maxDisplayPages = 10;

        this.bookFields = ['bookName','authorName','yearOfWritten','description'];

        this.bookRef = this.db.ref('book');
        this.createInputBookName = $('#bookNameCreateInput');
        this.createInputAuthorName = $('#authorNameCreateInput');
        this.createInputWrittenInYear = $('#writtenInYearInput');
        this.createInputDescription = $('#descriptionCreateInput');

        this.updateInputBookName = $('#bookNameUpdateInput');
        this.updateInputAuthorName = $('#authorNameUpdateInput');
        this.updateInputWrittenInYear = $('#writtenInYearUpdateInput');
        this.updateInputDescription = $('#descriptionUpdateInput');
        this.updateInputKey = $('#keyUpdateInput');

        this.bookRef.on('child_added', function(data) {
            let newBook = data.val();
            newBook.key = data.key;
            thisObj.allBooks.push(newBook);
            thisObj.refresh();
        });

        this.bookRef.on('child_changed', function(data) {
            let newBook = data.val();
            newBook.key = data.key;
            let foundIndex = thisObj.allBooks.findIndex(function (item) {
                return item.key === data.key;
            });
            if(foundIndex !== -1)
            {
                thisObj.allBooks[foundIndex] = newBook;
            }
            thisObj.refresh();
        });

        this.bookRef.on('child_removed', function(data) {
            thisObj.allBooks = thisObj.allBooks.filter(function(item){
                return item.key !== data.key;
            });
            thisObj.refresh();
        });


        this.filterBy();
        this.sortByField();
        this.renderWidget();
    }

    createBook(bookName, authorName, yearOfWritten, description) {
        let newBook = {
            bookName : bookName,
            authorName: authorName,
            yearOfWritten : yearOfWritten,
            description: description
        };
        this.db.ref('book').push(newBook);
    }

    updateBook(key,bookName, authorName, yearOfWritten, description)
    {
        let newBook = {
            bookName : bookName,
            authorName: authorName,
            yearOfWritten : yearOfWritten,
            description: description
        };

        this.db.ref('book/'+key).set(newBook);
    }


    deleteBook(key)
    {
        this.db.ref('book/'+key).remove();
    }

    renderWidget()
    {
        let objectName = "dataTableExample";
        let container = $(this.containerID);
        container.html('');

        let searchDiv = $('<div class="form-group row" style="margin: 20px 0 10px 10px">');
        searchDiv.append('<label for="searchInput" class="">Search</label><pre>  </pre>');
        searchDiv.append(

                $('<input id="searchInput" class="form-control col-md-4" onchange="onClickFilter(\''+objectName+'\');">').val(this.filter)

        );
        container.append(searchDiv);

        container.append($('<div>').text('Count: ' + this.displayBooks.length));
        //control buttons
        let controlPanel = $('<div style="margin: 10px 20px 10px 20px">');
        controlPanel.append($('<button  type="button" class="btn btn-primary" data-toggle="modal" data-target="#addRowModal" style=" color: white">').text('Create'));
        controlPanel.append($('<button class="btn btn-danger" data-toggle="modal" data-target="#deleteRowsModal" style=" margin-left: 10px ;">').text('Delete Selected'));
        controlPanel.append($('<button class="btn btn-info" style=" margin-left: 10px ;">').text('Refresh').click(function (objName) {window[objName].refresh();}));
        controlPanel.append($('<button hidden id="updateButton" data-toggle="modal" data-target="#updateRowModal">').text('Update'));
        container.append(controlPanel);
        let tableHtml = $('<table class="table table-striped" style="background-color: orange">');
        //headers
        let header = $('<tr>');
        header.append($('<th>').text('#'));
        for(let i =0;i<this.bookFields.length;i++)
        {
            let a = $('<a href="#">').click({param1:objectName},onClickSortByField).text(this.bookFields[i]);
            if(this.bookFields[i] === this.sortField)
            {
                a = $('<b>').append(a).append(this.isDescSort?' DESC':' ASC');
            }else{
                a = $('<span>').append(a).append(' <i class="fas fa-sort" style="color: rgba(133,133,133,0.31)"></i>');
            }
            header.append($('<th>').append(a))
        }
        header.append($('<th>').html('<i class="fas fa-edit"></i>'));
        header.append($('<th>').html('<i class="fas fa-trash"></i>'));

        tableHtml.append(header);
        //table data
        let firstDisplayI = (this.currentPage) * this.rowsOnPage;
        let lastDisplayI = ((this.currentPage) * this.rowsOnPage + this.rowsOnPage < this.displayBooks.length)? (this.currentPage) * this.rowsOnPage + this.rowsOnPage: this.displayBooks.length;
        for(let i =  firstDisplayI;i<lastDisplayI;i++)
        {
            let rowHtml = $('<tr>');
            rowHtml.append($('<td>').text(i+1));

            for(let j =0;j<this.bookFields.length;j++)
            {
                rowHtml.append(
                    $('<td>').text(this.displayBooks[i][this.bookFields[j]])
                );
            }
            rowHtml.append($('<td>').append($('<a href="#" class="fas fa-pen">').click({param1:i,param2:objectName},onClickUpdateBook)));
            rowHtml.append($('<td>').html('<input type="checkbox" name="type" value="'+this.displayBooks[i].key+'" />'));
            rowHtml.append( $('<td id="key' + i + '" hidden>').text(this.displayBooks[i].key));
            tableHtml.append(rowHtml);
        }
        container.append(tableHtml);
        //pages buttons
        let pagination = $('<div class="col-md-12" style="margin: 10px">');
        let allPagesCount = Math.ceil((this.displayBooks.length ) / this.rowsOnPage);
        this.displayPagesCount = (allPagesCount > this.maxDisplayPages)? this.maxDisplayPages : allPagesCount;
        let firstDisplayPage = 0;
        let lastDisplayPage = this.displayPagesCount;
        if(allPagesCount > this.maxDisplayPages)
        {
            if(this.currentPage - Math.trunc(this.maxDisplayPages/2) < 0)
            {
                firstDisplayPage = 0;
                lastDisplayPage = this.maxDisplayPages;
            }
            else if(this.currentPage + Math.trunc(this.maxDisplayPages/2) > allPagesCount)
            {
                firstDisplayPage = allPagesCount - 10;
                lastDisplayPage = allPagesCount;
            }else{
                firstDisplayPage = this.currentPage - Math.trunc(this.maxDisplayPages/2);
                lastDisplayPage = this.currentPage + Math.trunc(this.maxDisplayPages/2);
            }
        }

        for(let i = firstDisplayPage;i<lastDisplayPage;i++)
        {
            let enable = 'enable';
            if(i === this.currentPage)
                enable = 'disabled';
            let button = $('<button ' + enable +' class="btn btn-secondary" style="margin: 2px 10px 10px 0; width: 40px; height: 40px;">').text(i+1);
            button.click({param1:objectName},onSwitchPageClick);
            pagination.append(button);
        }
        container.append(pagination);


    }
    refresh() {
        this.filterBy();
        this.sortByField();
        this.renderWidget();
    }

    sortByField()
    {
        if(this.sortField !== null)
        {
            if(typeof this.allBooks[0][this.sortField] === "number")
            {
                if(this.isDescSort)
                {
                    this.displayBooks = this.displayBooks.sort((a,b) =>{
                        return a[this.sortField] - b[this.sortField];
                    });
                }else{
                    this.displayBooks = this.displayBooks.sort((a,b) => {
                        return b[this.sortField] - a[this.sortField];
                    });
                }

            }else{
                if(this.isDescSort)
                {
                    this.displayBooks = this.displayBooks.sort((a,b) => {
                        return -a[this.sortField].localeCompare(b[this.sortField])
                    });
                }else{
                    this.displayBooks = this.displayBooks.sort( (a,b)=>{

                        return a[this.sortField].localeCompare(b[this.sortField])
                    });
                }

            }

        }
    }

    filterBy()
    {
        if(this.filter !== '')
        {
            this.displayBooks = this.allBooks.filter( (value)=>{
                return value.description.indexOf(this.filter) !== -1
                    || value.bookName.indexOf(this.filter) !== -1
                    || value.authorName.indexOf(this.filter) !== -1
                    || (value.yearOfWritten+'').indexOf(this.filter) !== -1
            });
        }else
            this.displayBooks = this.allBooks.slice(0);
    }
}

function onSwitchPageClick(objName)
{
    let datatableonj = window[objName.data.param1];
    datatableonj.currentPage = parseInt(this.innerText) - 1;
    console.log(this);
    datatableonj.renderWidget();
}

function onClickFilter(objName)
{
    let datatableonj = window[objName];
    datatableonj.filter = $('#searchInput').val();
    console.log(datatableonj.filter);
    datatableonj.filterBy();
    datatableonj.renderWidget();
}
function onClickSortByField(objName)
{
    let datatableonj = window[objName.data.param1];
    let oldSortField = datatableonj.sortField;
    datatableonj.sortField = this.innerText;
    if(oldSortField === datatableonj.sortField) {
        datatableonj.isDescSort = !datatableonj.isDescSort;
    }else{
        datatableonj.isDescSort = false;
    }
    datatableonj.sortByField();
    datatableonj.renderWidget();
}

function onClickCreateBook(objName)
{
    let datatableonj = window[objName];
    let bookName = datatableonj.createInputBookName.val();
    let authorName = datatableonj.createInputAuthorName.val();
    let yearOfWritten = datatableonj.createInputWrittenInYear.val();
    let description = datatableonj.createInputDescription.val();
    if(bookName === '' || authorName === '' || yearOfWritten === '' || description === '')
        return;
    datatableonj.createBook(bookName,authorName,parseInt(yearOfWritten),description);

    $('#closeAddRowModal').click();

    datatableonj.createInputBookName.val('');
    datatableonj.createInputAuthorName.val('');
    datatableonj.createInputWrittenInYear.val('');
    datatableonj.createInputDescription.val('');

}

function onClickDeleteBook(objName) {
    let datatableonj = window[objName];
    let selected = [];

    $("input:checkbox[name=type]:checked").each(function() {
        selected.push($(this).val());
    });
    selected.forEach(function (value) {
        datatableonj.deleteBook(value);
    });
    $('#closeDeleteRowsModalModal').click();
}

function onClickUpdateBook(event) {
    let index = event.data.param1;
    let datatableonj = window[event.data.param2];
    $('#updateButton').click();
    datatableonj.updateInputBookName.val(datatableonj.displayBooks[index].bookName);
    datatableonj.updateInputAuthorName.val(datatableonj.displayBooks[index].authorName);
    datatableonj.updateInputWrittenInYear.val(datatableonj.displayBooks[index].yearOfWritten);
    datatableonj.updateInputDescription.val(datatableonj.displayBooks[index].description);
    datatableonj.updateInputKey.val(datatableonj.displayBooks[index].key);
}

function onClickUpdateSaveBook(objName) {
    let datatableonj = window[objName];
    let bookName = datatableonj.updateInputBookName.val();
    let authorName = datatableonj.updateInputAuthorName.val();
    let yearOfWritten = datatableonj.updateInputWrittenInYear.val();
    let description = datatableonj.updateInputDescription.val();
    let key = datatableonj.updateInputKey.val();

    if(bookName === '' || authorName === '' || yearOfWritten === '' || description === '')
        return;
    datatableonj.updateBook(key,bookName,authorName,parseInt(yearOfWritten),description);

    $('#closeUpdateRowModal').click();

    datatableonj.updateInputBookName.val('');
    datatableonj.updateInputAuthorName.val('');
    datatableonj.updateInputWrittenInYear.val('');
    datatableonj.updateInputDescription.val('');
}