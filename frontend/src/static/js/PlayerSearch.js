$(function() {
  $('#buscar-jugador').autocomplete({
    source: function(request, response) {
      // Realizar solicitud AJAX para obtener los jugadores de la base de datos
      $.ajax({
        url: 'lista_jugadores',
        data: { query: request.term },
        success: function(data) {
          // La respuesta de la solicitud es un arreglo con los nombres de los jugadores
          var jugadores = data;
          response(jugadores);
        }
      });
    }
  });
});