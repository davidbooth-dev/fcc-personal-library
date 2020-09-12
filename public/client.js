

$(document).ready(function () {
  var items = [];
  var itemsRaw = [];

  function refreshBookList(data) {
    let items = [];
    if(data.length > 0){
      items.push('<table class="listWrapper"><tr><th>Title</th><th>#Comments</th></tr>');
    }
    $.each(data, function (i, val) {
      var commenttext = val.commentcount === 1 ? ' comment' : ' comments';
      items.push('<tr><td class="bookItem" id="' + i + '">' + val.title + '</td><td>' + val.commentcount + commenttext + '</td></tr>');
      return (i !== 14);
    });
    items.push('</table');
    if (items.length >= 15) {
      items.push('<p>...and ' + (data.length - 15) + ' more!</p>');
    }
    return items;
  }

  function refreshCommentsList(data) {
    let comments = [];
    if (data.comments.length > 0) {
      comments.push('<table id="comments">')
      $.each(data.comments, function (i, val) {
        comments.push('<tr><td>' + val + '</td><td>');
        comments.push('<button class="btn btn-info delComment" id="' + data._id + '">Delete Comment</button>');
        comments.push('</td></tr>');
      });
      comments.push('</table>')
    }
    comments.push('<form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
    comments.push('<div class="btnContainer"><button class="btn btn-info addComment" id="' + data._id + '">Add Comment</button>');
    comments.push('<button class="btn btn-danger deleteBook" id="' + data._id + '">Delete Book</button></div>');

    $('#detailComments').html(comments.join(''));
  }

  function updateBookList() {
    $.getJSON('/api/books', function (data) {
      itemsRaw = data;
      if (data.length !== 0) {
        items = refreshBookList(data);
        $('.listWrapper').html(items.join(''));
      }
      else {
        $('<p>No Books Found</p>').appendTo('#display')
      };
    });
  }

  $.getJSON('/api/books', function (data) {
    itemsRaw = data;
    if (data.length !== 0) {
      let items = refreshBookList(data);    

      $('#display').html(items.join(''));
      /*$('<table/>', {
        'class': 'listWrapper',
        html: items.join('')
      }).appendTo('#display');*/
    }
    else {
      $('<p>No Books Found</p>').appendTo('#display')
    }
  });

  var comments = [];
  $('#display').on('click', 'td.bookItem', function () {
    $("#detailTitle").html('<b>' + itemsRaw[this.id].title + '</b> (id: ' + itemsRaw[this.id]._id + ')');
    let id = itemsRaw[this.id]._id;
    $.getJSON('/api/books/' + itemsRaw[this.id]._id, function (data) {
      refreshCommentsList(data[0]);
    });
  });

  $('#bookDetail').on('click', 'button.deleteBook', function () {
    let id = this.id;
    $.ajax({
      url: '/api/books/' + this.id,
      type: 'delete',
      success: function (data) {
        comments = [];
        messages = [data, 'Select a book to see it\'s details and comments'];
        $.each(messages, function (i, val) {
          comments.push('<p>' + val + '</p>');
        });
        $('#detailTitle').html(comments.join(''));
        $('#detailComments').html('');

        updateBookList();
      }
    });
  });

  $('#bookDetail').on('click', 'button.addComment', function () {
    var newComment = $('#commentToAdd').val();
    $.ajax({
      url: '/api/books/' + this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function (data) {
        refreshCommentsList(data);
        updateBookList();
      }
    });
  });

  $('#bookDetail').on('click', 'button.delComment', function () {
    let comment;
    let parent = this.parentNode;
    if (parent) {
      comment = $(parent).prev('td').text();
    }
    $.ajax({
      url: '/api/books/' + this.id + '/' + comment,
      type: 'delete',
      dataType: 'json',
      success: function (data) {
        refreshCommentsList(data);
        updateBookList();
      }
    });
  });

  $('#newBook').click(function () {
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function (data) {
        if (data.length !== 0) {
          items = refreshList(data);
          $('.listWrapper').html(items.join(''));
        }
        else {
          $('<p>No Books Found</p>').appendTo('#display')
        }
      }
    });
  });

  $('#deleteAllBooks').click(function () {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function (data) {
        $('<p>' + data + '</p>').appendTo('#display');
      }
    });
  });

  $('#refresh').click(function () {
    window.location.reload(true);
  });
});