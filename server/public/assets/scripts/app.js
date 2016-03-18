$(document).ready(function() {

    $('#submit-button').on('click', postData);
    getData();
});

function postData() {
    event.preventDefault();

    var values = {};
    $.each($('#animal-entry').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    console.log(values);

    $.ajax({
        type: 'POST',
        url: '/animals',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                console.log('from server:', data);
                getData();
            } else {
                console.log('error');
            }
        }
    });

}

function getData() {
    $.ajax({
        type: 'GET',
        url: '/animals',
        success: render
          //  console.log(data);

    });
}
function render(data) {
  console.log(data);
  var $animals = $('.animals');
  $animals.empty();
  $animals.append('<ul class="animal-list"></ul>');
  var $list = $animals.children().last();
  data.forEach(function (element) {
    $list.append('<li>Animal: ' + element.animal + '</br>' + 'Quantity: ' + element.quantity + '</li>' + '</br>');
  });
  $('#animal-entry').trigger('reset');
}
