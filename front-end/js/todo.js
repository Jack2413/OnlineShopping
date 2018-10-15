$(document).ready(function(e) {
  var ERROR_LOG = console.error.bind(console);
  console.log("todo.js working");
  getthewholepage();

  //current todoitem
  var g;
  var count = 1;
  // $('#add-todo').button({ icons: { primary: "ui-icon-circle-plus" } });
  $("#new-todo").dialog({ modal: true, autoOpen: false });
  $("#edit-todo").dialog({ modal: true, autoOpen: false });
  $("#confirm-deletion").dialog({ modal: true, autoOpen: false });
  var ERROR_LOG = console.error.bind(console);

  //delete all data from database button
  $("#resetdb")
    .button({
      icons: { primary: "ui-icon-circle-plus" }
    })
    .click(() => {
      alert("Are you sure to delete all data from db??");
      deleteall();
    });

  // add button
  $("#add-todo")
    .button({
      icons: { primary: "ui-icon-circle-plus" }
    })
    .click(function() {
      $("#new-todo").dialog("open");
    });

  //add todo
  $("#new-todo").dialog({
    modal: true,
    autoOpen: false,
    buttons: {
      "Add task": function() {
        var taskName = $("#task").val();
        console.log("taskName: " + taskName);

        if (taskName === "") {
          return false;
        }
        var taskHTML = '<li><span class="done">%</span>';
        taskHTML += '<span class="edit">+</span>';
        taskHTML += '<span class="delete">x</span>';
        taskHTML += '<span class="task"></span></li>';

        //console.log("taskHTML: " + taskHTML);
        var $newTask = $(taskHTML);
        var todo = { todoitem: taskName };
        addtodo(todo);
        $(this).dialog("close");
      },
      Cancel: function() {
        $(this).dialog("close");
      }
    }
  });

  //edit todo
  $("#edit-todo").dialog({
    modal: true,
    autoOpen: false,
    buttons: {
      Confirm: function() {
        //alert("edit bt clicked");
        var task = $("#edittask").val();
        if (task === "") {
          return false;
        }

        // g.parent('li').find('.task').text()
        var todo = g.parent("li").find(".task")[0].innerText;
        var id = parseInt(todo);
        var jsonid = { id: id, todoitem: task };
        //alert("jsonid is " + JSON.stringify(jsonid));
        edit(jsonid);
        $(this).dialog("close");
      },
      Cancel: function() {
        $(this).dialog("close");
      }
    }
  });

  //swich todo
  $("#todo-list").on("click", ".done", function() {
    var $taskItem = $(this).parent("li");
    var todo = $taskItem.find(".task")[0].innerText;
    var id = parseInt(todo);
    var jsonid = { id: id };
    //alert("jsonid is " + JSON.stringify(jsonid));
    swich(jsonid);

    $taskItem.slideUp(250, function() {
      var $this = $(this);
      $this.detach();
      $this.slideDown();
    });
  });

  //delete one
  $("#confirm-deletion").dialog({
    modal: true,
    autoOpen: false,
    buttons: {
      Confirm: function() {
        $(this).dialog("close");
        //var todo = parseInt(g.parent("li").find(".task")[0]);
        var todo = g.parent("li").find(".task")[0].innerText;
        var id = parseInt(todo);
        var jsonid = { id: id };
        //alert("jsonid is " + JSON.stringify(jsonid));
        deleteone(jsonid);
      },
      Cancel: function() {
        $(this).dialog("close");
      }
    }
  });

  $(".sortlist").sortable({
    connectWith: ".sortlist",
    cursor: "pointer",
    placeholder: "ui-state-highlight",
    cancel: ".delete,.done"
  });
  $(".sortlist").on("click", ".delete", function() {
    $("#confirm-deletion").dialog("open");
    g = $(this);
  });

  $(".sortlist").on("click", ".edit", function() {
    $("#edit-todo").dialog("open");
    g = $(this);
  });

  function getthewholepage() {
    $.ajax({
      method: "GET",
      url: "/db",
      success: data => {
        // alert(JSON.stringify(data.length));
        redraw(data);
      }
    });
  }

  //can deleteall or delete certain, can not do both
  function deleteall() {
    $.ajax({
      method: "delete",
      url: "/homepage/dbreset",
      success: returnedata => {
        //alert("delete all success!!!");
        getthewholepage();
      }
    });
  }

  function deleteone(id) {
    $.ajax({
      method: "delete",
      url: "/homepage/delete",
      data: id,
      success: returnedata => {
        //alert("delete one success!!!");
        getthewholepage();
      }
    });
  }

  function edit(idandtodo) {
    $.ajax({
      method: "put",
      url: "/homepage/edit",
      data: idandtodo,
      success: returnedata => {
        //alert("edit success!!!");
        getthewholepage();
      }
    });
  }

  function swich(JSONid) {
    $.ajax({
      method: "put",
      url: "/homepage/swich",
      data: JSONid,
      success: data => {
        getthewholepage();
      }
    });
  }

  function addtodo(todo) {
    $.ajax({
      type: "POST",
      url: "/homepage/add",
      data: todo,
      success: returnedata => {
        //alert("before getpost success!!!");
        getthewholepage();
      }
    });
  }

  function redraw(data) {
    //empty 2 lists
    $("#todo-list").empty();
    $("#completed-list").empty();

    for (var i = 0; i < data.length; i++) {
      var taskName = data[i].todoitem;
      var id = data[i].id;
      var complete = data[i].complete;
      stacktodolist(id, taskName, complete);
    }
  }

  function stacktodolist(id, taskName, complete) {
    var taskHTML = '<li><span class="done">%</span>';
    taskHTML += '<span class="delete">x</span>';
    taskHTML += '<span class="edit">+</span>';
    taskHTML += '<span class="task"></span></li>';
    var $newTask = $(taskHTML);
    $newTask.find(".task").text(id + " :" + taskName);

    $newTask.hide();
    if (complete) {
      $("#completed-list").prepend($newTask);
    } else {
      $("#todo-list").prepend($newTask);
    }
    $newTask.show("clip", 250).effect("highlight", 1000);
    $("#task").val("");
  }
}); // end ready
