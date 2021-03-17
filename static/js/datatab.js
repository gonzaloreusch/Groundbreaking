const filepath = 'Data/all_files.json';

d3.json(filepath, function(response) {

  for (row = 0; row < Object.keys(response).length; row++) {
      const data = {
          Lat: response[row].Lat,
          Lon: response[row].Lon,
          Name: response[row].Name,
          VEI: response[row].VEI,
          Year: response[row].Year,
          depth: response[row].depth,
          depthError: response[row].depthError,
          dmin: response[row].dmin,
          gap: response[row].gap,
          horizontalError: response[row].horizontalError,
          id: response[row].id,
          latitude: response[row].latitude,
          locationSource: response[row].locationSource,
          longitude: response[row].longitude,
          mag: response[row].mag,
          magError: response[row].magError,
          magNst: response[row].magNst,
          magSource: response[row].magSource,
          magType: response[row].magType,
          net: response[row].net,
          nst: response[row].nst,
          place: response[row].place,
          rms: response[row].rms,
          status: response[row].status,
          time: response[row].time,
          type: response[row].type,
          updated: response[row].updated,
      };

      d3.select('#datatable').append('tr').attr('id', `row${row}`);

      for (col = 0; col < Object.keys(data).length; col++) {
        if (row == 0) {
          d3.select(`#row${row}`).append('th').text(Object.keys(data)[col])
        } else {
          d3.select(`#row${row}`).append('td').text(Object.values(data)[col])
        };
      };
    };
});