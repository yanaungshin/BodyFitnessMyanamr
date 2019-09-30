$(document).ready(function(){
  $('.delete-trainer').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/trainer/'+id,
      success: function(response){
        alert('Deleting Trainer');
        window.location.href='/trainer_list';
      },
      error: function(err){
        console.log(err);
      }
    });
  });

  $("#wrapper").addClass('toggled');
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });
  // $("#toggleSidebar").click(function(){
  //   document.getElementById('sidebar').classList.toggle('active');
  // });
});

// $("#menu-toggle").click(function(e) {
//   console.log("sidebar works");
//   e.preventDefault();
//   $("#wrapper").toggleClass("toggled");
// });
