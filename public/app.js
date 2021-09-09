//get the current date on the title
function getFormattedDate(today) {
  var week = new Array(
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  );
  var month = new Array(
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  );

  var day = week[today.getDay()];
  var month = month[today.getMonth()];
  var dd = today.getDate();
  var yyyy = today.getFullYear();

  return day + ", " + month + " " + dd + ", " + yyyy;
}

var today = new Date();
var date = getFormattedDate(today);
document.getElementById("currentDate").value = date;

//bangkok post does lazy loading of image urls
//so the call that we use will have some default images
//we do this below for better defaults
//fix photo loading issue on bangkokpost site

/* TO BE FIXED IT's BROKEN AND I NEED TO FIX OTHER THINGS
getRandomThaiImage = () => {
  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=thailand&api_key=zQ6M6BpGKY0Ezqj9I0RBICnbox4HX22T&limit=30";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    var result = response.data;
    let rando = Math.floor(Math.random() * 30);
    var imageUrl = result[rando].images.original_still.url;

    return imageUrl;
  });
};
*/
//$.get("/articleSource");

// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  /*
  for (var i = 0; i < data.length; i++) {
    if (
      data[i].photo ==
      "https://static.bangkokpost.com/newdesign/assets/images/bg/default-pic-w600.jpg"
    ) {
      console.log("DEFAULT HERE");
      data[i].photo = await getRandomThaiImage();
      console.log(data[i].photo);
    }
*/
  // Display the apropos information on the page
  for (var i = 0; i < data.length; i++) {
    $("#articles").prepend(
      "<div class='container body'><div class='row'>" +
        "<div class='col-sm-8'><a href='https://www.bangkokpost.com" +
        data[i].link +
        "'><h4 data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        "</h4></a>" +
        "<br />" +
        // body
        "<p>" +
        data[i].body +
        "</p></div>" +
        // photo
        "<div class='col-sm-4'><img class='img-fluid' src='" +
        data[i].photo +
        "'>" +
        "</div>" +
        "</div></div>" +
        "<hr>"
    );
  }
});

// Whenever someone clicks the article
$(document).on("click", ".body", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).find("[data-id]").attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      // console.log(data);
      // The title of the article
      $("#notes").append("<h4>" + data.title + "</h4>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append(
        "<button type='button' class='btn btn-outline-dark' data-id='" +
          data._id +
          "' id='savenote'>Save Note</button>"
      );

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  $("#notes").html("Notes saved, click the article to view");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      setTimeout(() => {
        $("#notes").empty();
      }, 5000);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
