$(document).ready(function(){

  $('.delete-center').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/centers/'+id,
      success: function(response){
        alert('Deleting Center');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });

  $('.delete-centeradmin').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/centers/'+id,
      success: function(response){
        alert('Deleting Center');
        window.location.href='/admin/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });

  $('.delete-owner').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/owners/'+id,
      success: function(response){
        alert('Deleting Owner');
        window.location.href='/admin/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });

  $('.delete-trainer').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/trainers/'+id,
      success: function(response){
        alert('Deleting Trainer');
        window.location.href='/admin/';
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
